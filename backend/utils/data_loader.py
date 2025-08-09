import pandas as pd
import json
from typing import List, Optional, Dict
from models.transaction import Transaction, FailureType
from datetime import datetime, timedelta
import random
import os
from database.mongodb import mongodb

class DataLoader:
    def __init__(self):
        self.transactions_df = None
        self.transactions_cache = []
        self.mongodb_connected = False
        
    async def load_transaction_data(self):
        """Load UPI transaction data from MongoDB or generate synthetic data"""
        try:
            # Try to connect to MongoDB first
            if await mongodb.connect():
                self.mongodb_connected = True
                print("✅ Connected to MongoDB successfully")
                
                # Check if we have existing data in MongoDB
                existing_count = await mongodb.transactions_collection.count_documents({})
                
                if existing_count == 0:
                    print("📊 No existing data found, generating synthetic data...")
                    await self._generate_and_store_synthetic_data()
                else:
                    print(f"📊 Found {existing_count} existing transactions in MongoDB")
                    
            else:
                print("⚠️ MongoDB connection failed, falling back to CSV/memory storage")
                self.mongodb_connected = False
                await self._fallback_to_csv()
                
        except Exception as e:
            print(f"❌ Error during data loading: {e}")
            print("⚠️ Falling back to CSV/memory storage")
            self.mongodb_connected = False
            await self._fallback_to_csv()
    
    async def _fallback_to_csv(self):
        """Fallback to CSV file storage when MongoDB is not available"""
        data_path = os.path.join("data", "upi_transactions.csv")
        
        try:
            if os.path.exists(data_path):
                # Load from CSV if exists
                self.transactions_df = pd.read_csv(data_path, quotechar='"', escapechar='\\')
                self.transactions_cache = self._convert_to_transactions(self.transactions_df)
            else:
                # Generate synthetic data and save to CSV
                await self._generate_synthetic_data()
        except Exception as e:
            print(f"Error loading CSV data: {e}")
            print("Generating synthetic data instead...")
            await self._generate_synthetic_data()
    
    async def _generate_and_store_synthetic_data(self):
        """Generate synthetic data and store in MongoDB"""
        print("🔄 Generating synthetic UPI transaction data...")
        
        # Sample bank codes and VPAs
        banks = ["HDFC", "ICICI", "SBI", "AXIS", "KOTAK", "PNB", "BOB", "CANARA"]
        vpa_domains = ["paytm", "phonepe", "gpay", "amazonpay", "mobikwik"]
        
        transactions = []
        
        # Generate 1000 synthetic transactions
        for i in range(1000):
            transaction_id = f"TXN{str(i+1).zfill(6)}"
            timestamp = datetime.now() - timedelta(days=random.randint(0, 30))
            amount = round(random.uniform(10, 50000), 2)
            
            sender_name = f"user{random.randint(1000, 9999)}"
            receiver_name = f"merchant{random.randint(100, 999)}"
            sender_vpa = f"{sender_name}@{random.choice(vpa_domains)}"
            receiver_vpa = f"{receiver_name}@{random.choice(vpa_domains)}"
            
            sender_bank = random.choice(banks)
            receiver_bank = random.choice(banks)
            
            # 70% success, 30% failure for realistic distribution
            is_failed = random.random() < 0.3
            status = "failed" if is_failed else "success"
            
            failure_reason = None
            failure_type = None
            error_code = None
            retry_count = 0
            
            if is_failed:
                failure_scenarios = [
                    ("insufficient_funds", "Insufficient balance in account", "E001"),
                    ("invalid_vpa", "Invalid VPA provided", "E002"),
                    ("network_issue", "Network timeout occurred", "E003"),
                    ("bank_server_error", "Bank server temporarily unavailable", "E004"),
                    ("daily_limit_exceeded", "Daily transaction limit exceeded", "E005"),
                    ("authentication_failed", "UPI PIN verification failed", "E008")
                ]
                
                scenario = random.choice(failure_scenarios)
                failure_type = scenario[0]
                failure_reason = scenario[1]
                error_code = scenario[2]
                retry_count = random.randint(0, 3)
            
            # Create Transaction object
            transaction = Transaction(
                transaction_id=transaction_id,
                timestamp=timestamp,
                amount=amount,
                sender_vpa=sender_vpa,
                receiver_vpa=receiver_vpa,
                sender_bank=sender_bank,
                receiver_bank=receiver_bank,
                status=status,
                failure_reason=failure_reason,
                failure_type=FailureType(failure_type) if failure_type else None,
                error_code=error_code,
                retry_count=retry_count,
                metadata={"device": "mobile", "app_version": "1.2.3"}
            )
            
            transactions.append(transaction)
        
        # Store in MongoDB
        if self.mongodb_connected:
            inserted_count = await mongodb.bulk_insert_transactions(transactions)
            print(f"✅ Inserted {inserted_count} transactions into MongoDB")
        
        # Also cache in memory for immediate use
        self.transactions_cache = transactions
        print(f"📊 Generated and cached {len(transactions)} synthetic transactions")
    
    async def _generate_synthetic_data(self):
        """Generate synthetic UPI transaction data for MVP"""
        synthetic_data = []
        
        # Sample bank codes and VPAs
        banks = ["HDFC", "ICICI", "SBI", "AXIS", "KOTAK", "PNB", "BOB", "CANARA"]
        vpa_domains = ["paytm", "phonepe", "gpay", "amazonpay", "mobikwik"]
        
        # Generate 1000 synthetic transactions
        for i in range(1000):
            transaction_id = f"TXN{str(i+1).zfill(6)}"
            timestamp = datetime.now() - timedelta(days=random.randint(0, 30))
            amount = round(random.uniform(10, 50000), 2)
            
            sender_name = f"user{random.randint(1000, 9999)}"
            receiver_name = f"merchant{random.randint(100, 999)}"
            sender_vpa = f"{sender_name}@{random.choice(vpa_domains)}"
            receiver_vpa = f"{receiver_name}@{random.choice(vpa_domains)}"
            
            sender_bank = random.choice(banks)
            receiver_bank = random.choice(banks)
            
            # 70% success, 30% failure for realistic distribution
            is_failed = random.random() < 0.3
            status = "FAILED" if is_failed else "SUCCESS"
            
            failure_reason = None
            failure_type = None
            error_code = None
            retry_count = 0
            
            if is_failed:
                failure_scenarios = [
                    ("insufficient_funds", "Insufficient balance in account", "E001"),
                    ("incorrect_details", "Invalid VPA provided", "E002"),
                    ("network_issue", "Network timeout occurred", "E003"),
                    ("bank_server_error", "Bank server temporarily unavailable", "E004"),
                    ("daily_limit_exceeded", "Daily transaction limit exceeded", "E005"),
                    ("invalid_vpa", "VPA does not exist", "E006"),
                    ("timeout", "Transaction timeout", "E007"),
                    ("authentication_failed", "UPI PIN verification failed", "E008")
                ]
                
                scenario = random.choice(failure_scenarios)
                failure_type = scenario[0]
                failure_reason = scenario[1]
                error_code = scenario[2]
                retry_count = random.randint(0, 3)
            
            synthetic_data.append({
                "transaction_id": transaction_id,
                "timestamp": timestamp.isoformat(),
                "amount": amount,
                "sender_vpa": sender_vpa,
                "receiver_vpa": receiver_vpa,
                "sender_bank": sender_bank,
                "receiver_bank": receiver_bank,
                "status": status,
                "failure_reason": failure_reason,
                "failure_type": failure_type,
                "error_code": error_code,
                "retry_count": retry_count,
                "metadata": json.dumps({"device": "mobile", "app_version": "1.2.3"})
            })
        
        # Create DataFrame and save to CSV
        self.transactions_df = pd.DataFrame(synthetic_data)
        
        # Ensure data directory exists
        os.makedirs("data", exist_ok=True)
        
        # Save to CSV with proper quoting for JSON fields
        self.transactions_df.to_csv("data/upi_transactions.csv", index=False, quoting=1)
        
        # Convert to Transaction objects
        self.transactions_cache = self._convert_to_transactions(self.transactions_df)
    
    def _convert_to_transactions(self, df: pd.DataFrame) -> List[Transaction]:
        """Convert DataFrame to Transaction objects"""
        transactions = []
        
        for _, row in df.iterrows():
            try:
                # Handle metadata safely
                metadata_str = row.get('metadata', '{}')
                if pd.isna(metadata_str) or metadata_str == '':
                    metadata = {}
                else:
                    try:
                        metadata = json.loads(metadata_str)
                    except json.JSONDecodeError:
                        metadata = {}
                
                # Handle failure_type safely
                failure_type = None
                if pd.notna(row.get('failure_type')) and row.get('failure_type'):
                    try:
                        failure_type = FailureType(row['failure_type'])
                    except ValueError:
                        failure_type = None
                
                transaction = Transaction(
                    transaction_id=str(row['transaction_id']),
                    timestamp=datetime.fromisoformat(str(row['timestamp'])),
                    amount=float(row['amount']),
                    sender_vpa=str(row['sender_vpa']),
                    receiver_vpa=str(row['receiver_vpa']),
                    sender_bank=str(row['sender_bank']),
                    receiver_bank=str(row['receiver_bank']),
                    status=str(row['status']),
                    failure_reason=str(row.get('failure_reason')) if pd.notna(row.get('failure_reason')) else None,
                    failure_type=failure_type,
                    error_code=str(row.get('error_code')) if pd.notna(row.get('error_code')) else None,
                    retry_count=int(row.get('retry_count', 0)),
                    metadata=metadata
                )
                transactions.append(transaction)
            except Exception as e:
                print(f"Error converting row to transaction: {e}")
                print(f"Row data: {row.to_dict()}")
                continue
                
        print(f"Successfully converted {len(transactions)} transactions")
        return transactions
    
    async def get_transactions(self, limit: int = 100, failure_type: Optional[str] = None, skip: int = 0, search_term: Optional[str] = None) -> List[Transaction]:
        """Get transactions with optional filtering"""
        if self.mongodb_connected:
            # Use MongoDB for data retrieval
            try:
                transaction_docs = await mongodb.get_transactions(
                    limit=limit,
                    skip=skip,
                    failure_type=failure_type,
                    search_term=search_term
                )
                
                # Convert MongoDB documents to Transaction objects
                transactions = []
                for doc in transaction_docs:
                    try:
                        transaction = Transaction(
                            transaction_id=doc['transaction_id'],
                            timestamp=doc['timestamp'],
                            amount=doc['amount'],
                            sender_vpa=doc['sender_vpa'],
                            receiver_vpa=doc['receiver_vpa'],
                            sender_bank=doc['sender_bank'],
                            receiver_bank=doc['receiver_bank'],
                            status=doc['status'],
                            failure_reason=doc.get('failure_reason'),
                            failure_type=FailureType(doc['failure_type']) if doc.get('failure_type') else None,
                            error_code=doc.get('error_code'),
                            retry_count=doc.get('retry_count', 0),
                            metadata=doc.get('metadata', {})
                        )
                        transactions.append(transaction)
                    except Exception as e:
                        print(f"Error converting MongoDB doc to transaction: {e}")
                        continue
                
                return transactions
                
            except Exception as e:
                print(f"Error retrieving from MongoDB: {e}")
                # Fallback to cache
                pass
        
        # Fallback to cache/CSV data
        if not self.transactions_cache:
            await self.load_transaction_data()
        
        filtered_transactions = self.transactions_cache
        
        if failure_type:
            filtered_transactions = [
                t for t in filtered_transactions 
                if t.failure_type and t.failure_type.value == failure_type
            ]
        
        if search_term:
            search_lower = search_term.lower()
            filtered_transactions = [
                t for t in filtered_transactions
                if (search_lower in t.transaction_id.lower() or
                    search_lower in t.sender_vpa.lower() or
                    search_lower in t.receiver_vpa.lower() or
                    (t.failure_reason and search_lower in t.failure_reason.lower()))
            ]
        
        # Apply pagination
        start_idx = skip
        end_idx = skip + limit
        return filtered_transactions[start_idx:end_idx]
    
    async def get_failure_types(self) -> Dict[str, int]:
        """Get failure type distribution"""
        if self.mongodb_connected:
            try:
                return await mongodb.get_failure_type_distribution()
            except Exception as e:
                print(f"Error getting failure types from MongoDB: {e}")
                # Fallback to cache
                pass
        
        # Fallback to cache data
        if not self.transactions_cache:
            await self.load_transaction_data()
        
        failure_counts = {}
        for transaction in self.transactions_cache:
            if transaction.failure_type:
                failure_type = transaction.failure_type.value
                failure_counts[failure_type] = failure_counts.get(failure_type, 0) + 1
        
        return failure_counts
    
    async def get_transaction_stats(self) -> Dict[str, any]:
        """Get transaction statistics"""
        if self.mongodb_connected:
            try:
                return await mongodb.get_transaction_stats()
            except Exception as e:
                print(f"Error getting stats from MongoDB: {e}")
                # Fallback to cache calculation
                pass
        
        # Fallback to cache calculation
        if not self.transactions_cache:
            await self.load_transaction_data()
        
        total = len(self.transactions_cache)
        failed = len([t for t in self.transactions_cache if t.status == 'failed'])
        successful = len([t for t in self.transactions_cache if t.status == 'success'])
        pending = len([t for t in self.transactions_cache if t.status == 'pending'])
        
        total_amount = sum(t.amount for t in self.transactions_cache)
        avg_amount = total_amount / total if total > 0 else 0
        success_rate = (successful / total * 100) if total > 0 else 0
        
        return {
            "total_transactions": total,
            "failed_transactions": failed,
            "successful_transactions": successful,
            "pending_transactions": pending,
            "total_amount": total_amount,
            "avg_amount": avg_amount,
            "success_rate": success_rate
        }
    
    async def get_transaction_by_id(self, transaction_id: str) -> Optional[Transaction]:
        """Get a specific transaction by ID"""
        if self.mongodb_connected:
            try:
                doc = await mongodb.get_transaction_by_id(transaction_id)
                if doc:
                    return Transaction(
                        transaction_id=doc['transaction_id'],
                        timestamp=doc['timestamp'],
                        amount=doc['amount'],
                        sender_vpa=doc['sender_vpa'],
                        receiver_vpa=doc['receiver_vpa'],
                        sender_bank=doc['sender_bank'],
                        receiver_bank=doc['receiver_bank'],
                        status=doc['status'],
                        failure_reason=doc.get('failure_reason'),
                        failure_type=FailureType(doc['failure_type']) if doc.get('failure_type') else None,
                        error_code=doc.get('error_code'),
                        retry_count=doc.get('retry_count', 0),
                        metadata=doc.get('metadata', {})
                    )
            except Exception as e:
                print(f"Error getting transaction from MongoDB: {e}")
        
        # Fallback to cache search
        if not self.transactions_cache:
            await self.load_transaction_data()
        
        for transaction in self.transactions_cache:
            if transaction.transaction_id == transaction_id:
                return transaction
        
        return None