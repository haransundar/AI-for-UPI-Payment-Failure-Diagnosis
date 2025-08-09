"""
MongoDB database connection and operations for UPI Diagnosis Platform
"""

import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
import logging
from models.transaction import Transaction, FailureType

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MongoDB:
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.database = None
        self.transactions_collection = None
        self.analytics_collection = None
        self.users_collection = None
        
    async def connect(self):
        """Connect to MongoDB database"""
        try:
            # Get MongoDB connection string from environment
            mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
            database_name = os.getenv("DATABASE_NAME", "upi_diagnosis")
            
            # Create async MongoDB client
            self.client = AsyncIOMotorClient(
                mongodb_url,
                serverSelectionTimeoutMS=5000,  # 5 second timeout
                maxPoolSize=50,
                minPoolSize=5
            )
            
            # Test connection
            await self.client.admin.command('ping')
            logger.info("✅ Connected to MongoDB successfully")
            
            # Get database and collections
            self.database = self.client[database_name]
            self.transactions_collection = self.database.transactions
            self.analytics_collection = self.database.analytics
            self.users_collection = self.database.users
            
            # Create indexes for better performance
            await self._create_indexes()
            
            return True
            
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logger.error(f"❌ Failed to connect to MongoDB: {e}")
            return False
        except Exception as e:
            logger.error(f"❌ Unexpected error connecting to MongoDB: {e}")
            return False
    
    async def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
            logger.info("🔌 Disconnected from MongoDB")
    
    async def _create_indexes(self):
        """Create database indexes for optimal performance"""
        try:
            # Transactions collection indexes
            await self.transactions_collection.create_index("transaction_id", unique=True)
            await self.transactions_collection.create_index("timestamp")
            await self.transactions_collection.create_index("status")
            await self.transactions_collection.create_index("failure_type")
            await self.transactions_collection.create_index("sender_vpa")
            await self.transactions_collection.create_index("receiver_vpa")
            await self.transactions_collection.create_index([("timestamp", -1), ("status", 1)])
            
            # Analytics collection indexes
            await self.analytics_collection.create_index("date")
            await self.analytics_collection.create_index("metric_type")
            
            logger.info("📊 Database indexes created successfully")
            
        except Exception as e:
            logger.error(f"❌ Error creating indexes: {e}")
    
    async def insert_transaction(self, transaction: Transaction) -> bool:
        """Insert a single transaction into MongoDB"""
        try:
            transaction_doc = {
                "transaction_id": transaction.transaction_id,
                "timestamp": transaction.timestamp,
                "amount": transaction.amount,
                "sender_vpa": transaction.sender_vpa,
                "receiver_vpa": transaction.receiver_vpa,
                "sender_bank": transaction.sender_bank,
                "receiver_bank": transaction.receiver_bank,
                "status": transaction.status,
                "failure_reason": transaction.failure_reason,
                "failure_type": transaction.failure_type.value if transaction.failure_type else None,
                "error_code": transaction.error_code,
                "retry_count": transaction.retry_count,
                "metadata": transaction.metadata,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            result = await self.transactions_collection.insert_one(transaction_doc)
            logger.info(f"✅ Inserted transaction {transaction.transaction_id}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error inserting transaction: {e}")
            return False
    
    async def bulk_insert_transactions(self, transactions: List[Transaction]) -> int:
        """Insert multiple transactions in bulk"""
        try:
            transaction_docs = []
            for transaction in transactions:
                doc = {
                    "transaction_id": transaction.transaction_id,
                    "timestamp": transaction.timestamp,
                    "amount": transaction.amount,
                    "sender_vpa": transaction.sender_vpa,
                    "receiver_vpa": transaction.receiver_vpa,
                    "sender_bank": transaction.sender_bank,
                    "receiver_bank": transaction.receiver_bank,
                    "status": transaction.status,
                    "failure_reason": transaction.failure_reason,
                    "failure_type": transaction.failure_type.value if transaction.failure_type else None,
                    "error_code": transaction.error_code,
                    "retry_count": transaction.retry_count,
                    "metadata": transaction.metadata,
                    "created_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
                transaction_docs.append(doc)
            
            if transaction_docs:
                result = await self.transactions_collection.insert_many(transaction_docs, ordered=False)
                inserted_count = len(result.inserted_ids)
                logger.info(f"✅ Bulk inserted {inserted_count} transactions")
                return inserted_count
            
            return 0
            
        except Exception as e:
            logger.error(f"❌ Error bulk inserting transactions: {e}")
            return 0
    
    async def get_transactions(
        self, 
        limit: int = 100, 
        skip: int = 0,
        status: Optional[str] = None,
        failure_type: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        search_term: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Get transactions with filtering and pagination"""
        try:
            # Build query filter
            query_filter = {}
            
            if status:
                query_filter["status"] = status
            
            if failure_type:
                query_filter["failure_type"] = failure_type
            
            if start_date or end_date:
                date_filter = {}
                if start_date:
                    date_filter["$gte"] = start_date
                if end_date:
                    date_filter["$lte"] = end_date
                query_filter["timestamp"] = date_filter
            
            if search_term:
                query_filter["$or"] = [
                    {"transaction_id": {"$regex": search_term, "$options": "i"}},
                    {"sender_vpa": {"$regex": search_term, "$options": "i"}},
                    {"receiver_vpa": {"$regex": search_term, "$options": "i"}},
                    {"failure_reason": {"$regex": search_term, "$options": "i"}}
                ]
            
            # Execute query with pagination
            cursor = self.transactions_collection.find(query_filter).sort("timestamp", -1).skip(skip).limit(limit)
            transactions = await cursor.to_list(length=limit)
            
            # Convert ObjectId to string for JSON serialization
            for transaction in transactions:
                transaction["_id"] = str(transaction["_id"])
            
            logger.info(f"📊 Retrieved {len(transactions)} transactions")
            return transactions
            
        except Exception as e:
            logger.error(f"❌ Error retrieving transactions: {e}")
            return []
    
    async def get_transaction_by_id(self, transaction_id: str) -> Optional[Dict[str, Any]]:
        """Get a specific transaction by ID"""
        try:
            transaction = await self.transactions_collection.find_one({"transaction_id": transaction_id})
            if transaction:
                transaction["_id"] = str(transaction["_id"])
                logger.info(f"📊 Retrieved transaction {transaction_id}")
            return transaction
            
        except Exception as e:
            logger.error(f"❌ Error retrieving transaction {transaction_id}: {e}")
            return None
    
    async def get_transaction_stats(self) -> Dict[str, Any]:
        """Get transaction statistics"""
        try:
            # Aggregate statistics
            pipeline = [
                {
                    "$group": {
                        "_id": None,
                        "total_transactions": {"$sum": 1},
                        "failed_transactions": {
                            "$sum": {"$cond": [{"$eq": ["$status", "failed"]}, 1, 0]}
                        },
                        "successful_transactions": {
                            "$sum": {"$cond": [{"$eq": ["$status", "success"]}, 1, 0]}
                        },
                        "pending_transactions": {
                            "$sum": {"$cond": [{"$eq": ["$status", "pending"]}, 1, 0]}
                        },
                        "total_amount": {"$sum": "$amount"},
                        "avg_amount": {"$avg": "$amount"}
                    }
                }
            ]
            
            result = await self.transactions_collection.aggregate(pipeline).to_list(length=1)
            
            if result:
                stats = result[0]
                stats.pop("_id", None)  # Remove the _id field
                
                # Calculate success rate
                total = stats.get("total_transactions", 0)
                successful = stats.get("successful_transactions", 0)
                stats["success_rate"] = (successful / total * 100) if total > 0 else 0
                
                logger.info("📊 Retrieved transaction statistics")
                return stats
            
            return {
                "total_transactions": 0,
                "failed_transactions": 0,
                "successful_transactions": 0,
                "pending_transactions": 0,
                "total_amount": 0,
                "avg_amount": 0,
                "success_rate": 0
            }
            
        except Exception as e:
            logger.error(f"❌ Error retrieving transaction stats: {e}")
            return {}
    
    async def get_failure_type_distribution(self) -> Dict[str, int]:
        """Get distribution of failure types"""
        try:
            pipeline = [
                {"$match": {"failure_type": {"$ne": None}}},
                {"$group": {"_id": "$failure_type", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}}
            ]
            
            result = await self.transactions_collection.aggregate(pipeline).to_list(length=None)
            
            distribution = {}
            for item in result:
                distribution[item["_id"]] = item["count"]
            
            logger.info("📊 Retrieved failure type distribution")
            return distribution
            
        except Exception as e:
            logger.error(f"❌ Error retrieving failure distribution: {e}")
            return {}
    
    async def get_hourly_transaction_data(self, days: int = 7) -> List[Dict[str, Any]]:
        """Get hourly transaction data for charts"""
        try:
            start_date = datetime.utcnow() - timedelta(days=days)
            
            pipeline = [
                {"$match": {"timestamp": {"$gte": start_date}}},
                {
                    "$group": {
                        "_id": {
                            "hour": {"$hour": "$timestamp"},
                            "date": {"$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}}
                        },
                        "total": {"$sum": 1},
                        "failed": {"$sum": {"$cond": [{"$eq": ["$status", "failed"]}, 1, 0]}},
                        "successful": {"$sum": {"$cond": [{"$eq": ["$status", "success"]}, 1, 0]}}
                    }
                },
                {"$sort": {"_id.date": 1, "_id.hour": 1}}
            ]
            
            result = await self.transactions_collection.aggregate(pipeline).to_list(length=None)
            
            # Format data for charts
            chart_data = []
            for item in result:
                chart_data.append({
                    "hour": f"{item['_id']['hour']:02d}:00",
                    "date": item["_id"]["date"],
                    "total": item["total"],
                    "failed": item["failed"],
                    "successful": item["successful"]
                })
            
            logger.info(f"📊 Retrieved hourly data for {len(chart_data)} periods")
            return chart_data
            
        except Exception as e:
            logger.error(f"❌ Error retrieving hourly data: {e}")
            return []
    
    async def update_transaction_status(self, transaction_id: str, status: str, diagnosis_result: Optional[Dict] = None) -> bool:
        """Update transaction status and diagnosis result"""
        try:
            update_data = {
                "status": status,
                "updated_at": datetime.utcnow()
            }
            
            if diagnosis_result:
                update_data["diagnosis"] = diagnosis_result
            
            result = await self.transactions_collection.update_one(
                {"transaction_id": transaction_id},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                logger.info(f"✅ Updated transaction {transaction_id}")
                return True
            else:
                logger.warning(f"⚠️ No transaction found with ID {transaction_id}")
                return False
                
        except Exception as e:
            logger.error(f"❌ Error updating transaction {transaction_id}: {e}")
            return False
    
    async def health_check(self) -> Dict[str, Any]:
        """Check database health and return status"""
        try:
            # Test connection
            await self.client.admin.command('ping')
            
            # Get collection stats
            transactions_count = await self.transactions_collection.count_documents({})
            
            return {
                "status": "healthy",
                "connected": True,
                "transactions_count": transactions_count,
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"❌ Database health check failed: {e}")
            return {
                "status": "unhealthy",
                "connected": False,
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }

# Global MongoDB instance
mongodb = MongoDB()