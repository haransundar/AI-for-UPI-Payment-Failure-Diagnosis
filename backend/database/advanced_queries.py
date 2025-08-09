"""
Advanced MongoDB queries for UPI Diagnosis Platform
Optimized aggregation pipelines for complex analytics
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from database.mongodb import mongodb
import logging

logger = logging.getLogger(__name__)

class AdvancedQueries:
    """Advanced MongoDB aggregation queries for deep analytics"""
    
    @staticmethod
    async def get_failure_patterns_by_time() -> List[Dict[str, Any]]:
        """Analyze failure patterns by hour of day"""
        try:
            pipeline = [
                {"$match": {"status": "failed"}},
                {
                    "$group": {
                        "_id": {
                            "hour": {"$hour": "$timestamp"},
                            "failure_type": "$failure_type"
                        },
                        "count": {"$sum": 1},
                        "avg_amount": {"$avg": "$amount"}
                    }
                },
                {"$sort": {"_id.hour": 1, "count": -1}}
            ]
            
            result = await mongodb.transactions_collection.aggregate(pipeline).to_list(length=None)
            return result
            
        except Exception as e:
            logger.error(f"Error analyzing failure patterns: {e}")
            return []
    
    @staticmethod
    async def get_bank_performance_metrics() -> List[Dict[str, Any]]:
        """Get performance metrics by bank"""
        try:
            pipeline = [
                {
                    "$group": {
                        "_id": "$sender_bank",
                        "total_transactions": {"$sum": 1},
                        "failed_transactions": {
                            "$sum": {"$cond": [{"$eq": ["$status", "failed"]}, 1, 0]}
                        },
                        "total_amount": {"$sum": "$amount"},
                        "avg_amount": {"$avg": "$amount"},
                        "failure_types": {"$addToSet": "$failure_type"}
                    }
                },
                {
                    "$addFields": {
                        "success_rate": {
                            "$multiply": [
                                {"$divide": [
                                    {"$subtract": ["$total_transactions", "$failed_transactions"]},
                                    "$total_transactions"
                                ]},
                                100
                            ]
                        }
                    }
                },
                {"$sort": {"success_rate": -1}}
            ]
            
            result = await mongodb.transactions_collection.aggregate(pipeline).to_list(length=None)
            return result
            
        except Exception as e:
            logger.error(f"Error analyzing bank performance: {e}")
            return []
    
    @staticmethod
    async def get_vpa_domain_analysis() -> List[Dict[str, Any]]:
        """Analyze transaction patterns by VPA domain (paytm, phonepe, etc.)"""
        try:
            pipeline = [
                {
                    "$addFields": {
                        "sender_domain": {
                            "$arrayElemAt": [
                                {"$split": ["$sender_vpa", "@"]}, 1
                            ]
                        },
                        "receiver_domain": {
                            "$arrayElemAt": [
                                {"$split": ["$receiver_vpa", "@"]}, 1
                            ]
                        }
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "sender_domain": "$sender_domain",
                            "receiver_domain": "$receiver_domain"
                        },
                        "transaction_count": {"$sum": 1},
                        "failure_count": {
                            "$sum": {"$cond": [{"$eq": ["$status", "failed"]}, 1, 0]}
                        },
                        "avg_amount": {"$avg": "$amount"},
                        "common_failures": {"$addToSet": "$failure_type"}
                    }
                },
                {
                    "$addFields": {
                        "failure_rate": {
                            "$multiply": [
                                {"$divide": ["$failure_count", "$transaction_count"]},
                                100
                            ]
                        }
                    }
                },
                {"$sort": {"transaction_count": -1}}
            ]
            
            result = await mongodb.transactions_collection.aggregate(pipeline).to_list(length=None)
            return result
            
        except Exception as e:
            logger.error(f"Error analyzing VPA domains: {e}")
            return []
    
    @staticmethod
    async def get_amount_based_failure_analysis() -> List[Dict[str, Any]]:
        """Analyze failure patterns based on transaction amounts"""
        try:
            pipeline = [
                {
                    "$addFields": {
                        "amount_range": {
                            "$switch": {
                                "branches": [
                                    {"case": {"$lt": ["$amount", 100]}, "then": "0-100"},
                                    {"case": {"$lt": ["$amount", 500]}, "then": "100-500"},
                                    {"case": {"$lt": ["$amount", 1000]}, "then": "500-1000"},
                                    {"case": {"$lt": ["$amount", 5000]}, "then": "1000-5000"},
                                    {"case": {"$gte": ["$amount", 5000]}, "then": "5000+"}
                                ],
                                "default": "unknown"
                            }
                        }
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "amount_range": "$amount_range",
                            "failure_type": "$failure_type"
                        },
                        "count": {"$sum": 1},
                        "avg_retry_count": {"$avg": "$retry_count"}
                    }
                },
                {"$sort": {"_id.amount_range": 1, "count": -1}}
            ]
            
            result = await mongodb.transactions_collection.aggregate(pipeline).to_list(length=None)
            return result
            
        except Exception as e:
            logger.error(f"Error analyzing amount-based failures: {e}")
            return []
    
    @staticmethod
    async def get_retry_pattern_analysis() -> List[Dict[str, Any]]:
        """Analyze retry patterns and success rates"""
        try:
            pipeline = [
                {"$match": {"retry_count": {"$gt": 0}}},
                {
                    "$group": {
                        "_id": {
                            "retry_count": "$retry_count",
                            "failure_type": "$failure_type"
                        },
                        "transaction_count": {"$sum": 1},
                        "eventual_success": {
                            "$sum": {"$cond": [{"$eq": ["$status", "success"]}, 1, 0]}
                        }
                    }
                },
                {
                    "$addFields": {
                        "success_after_retry_rate": {
                            "$multiply": [
                                {"$divide": ["$eventual_success", "$transaction_count"]},
                                100
                            ]
                        }
                    }
                },
                {"$sort": {"_id.retry_count": 1}}
            ]
            
            result = await mongodb.transactions_collection.aggregate(pipeline).to_list(length=None)
            return result
            
        except Exception as e:
            logger.error(f"Error analyzing retry patterns: {e}")
            return []
    
    @staticmethod
    async def get_real_time_dashboard_data() -> Dict[str, Any]:
        """Get comprehensive real-time dashboard data"""
        try:
            # Last 24 hours data
            last_24h = datetime.utcnow() - timedelta(hours=24)
            
            # Multiple aggregations in parallel
            recent_stats_pipeline = [
                {"$match": {"timestamp": {"$gte": last_24h}}},
                {
                    "$group": {
                        "_id": None,
                        "total": {"$sum": 1},
                        "failed": {"$sum": {"$cond": [{"$eq": ["$status", "failed"]}, 1, 0]}},
                        "avg_amount": {"$avg": "$amount"},
                        "total_volume": {"$sum": "$amount"}
                    }
                }
            ]
            
            # Top failure reasons in last 24h
            top_failures_pipeline = [
                {"$match": {"timestamp": {"$gte": last_24h}, "status": "failed"}},
                {"$group": {"_id": "$failure_type", "count": {"$sum": 1}}},
                {"$sort": {"count": -1}},
                {"$limit": 5}
            ]
            
            # Hourly trend for last 24h
            hourly_trend_pipeline = [
                {"$match": {"timestamp": {"$gte": last_24h}}},
                {
                    "$group": {
                        "_id": {"$hour": "$timestamp"},
                        "total": {"$sum": 1},
                        "failed": {"$sum": {"$cond": [{"$eq": ["$status", "failed"]}, 1, 0]}}
                    }
                },
                {"$sort": {"_id": 1}}
            ]
            
            # Execute all pipelines
            recent_stats = await mongodb.transactions_collection.aggregate(recent_stats_pipeline).to_list(1)
            top_failures = await mongodb.transactions_collection.aggregate(top_failures_pipeline).to_list(5)
            hourly_trend = await mongodb.transactions_collection.aggregate(hourly_trend_pipeline).to_list(24)
            
            return {
                "recent_stats": recent_stats[0] if recent_stats else {},
                "top_failures": top_failures,
                "hourly_trend": hourly_trend,
                "last_updated": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error getting dashboard data: {e}")
            return {}
    
    @staticmethod
    async def search_transactions_advanced(
        query: str,
        filters: Dict[str, Any] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Advanced text search across multiple fields"""
        try:
            # Build search pipeline
            search_pipeline = []
            
            # Text search stage
            if query:
                search_pipeline.append({
                    "$match": {
                        "$or": [
                            {"transaction_id": {"$regex": query, "$options": "i"}},
                            {"sender_vpa": {"$regex": query, "$options": "i"}},
                            {"receiver_vpa": {"$regex": query, "$options": "i"}},
                            {"failure_reason": {"$regex": query, "$options": "i"}},
                            {"error_code": {"$regex": query, "$options": "i"}}
                        ]
                    }
                })
            
            # Apply additional filters
            if filters:
                filter_conditions = {}
                
                if filters.get("status"):
                    filter_conditions["status"] = filters["status"]
                
                if filters.get("failure_type"):
                    filter_conditions["failure_type"] = filters["failure_type"]
                
                if filters.get("amount_min") or filters.get("amount_max"):
                    amount_filter = {}
                    if filters.get("amount_min"):
                        amount_filter["$gte"] = filters["amount_min"]
                    if filters.get("amount_max"):
                        amount_filter["$lte"] = filters["amount_max"]
                    filter_conditions["amount"] = amount_filter
                
                if filters.get("date_from") or filters.get("date_to"):
                    date_filter = {}
                    if filters.get("date_from"):
                        date_filter["$gte"] = filters["date_from"]
                    if filters.get("date_to"):
                        date_filter["$lte"] = filters["date_to"]
                    filter_conditions["timestamp"] = date_filter
                
                if filter_conditions:
                    search_pipeline.append({"$match": filter_conditions})
            
            # Add scoring for relevance
            search_pipeline.extend([
                {
                    "$addFields": {
                        "relevance_score": {
                            "$add": [
                                {"$cond": [{"$regexMatch": {"input": "$transaction_id", "regex": query, "options": "i"}}, 10, 0]},
                                {"$cond": [{"$regexMatch": {"input": "$failure_reason", "regex": query, "options": "i"}}, 5, 0]},
                                {"$cond": [{"$regexMatch": {"input": "$sender_vpa", "regex": query, "options": "i"}}, 3, 0]},
                                {"$cond": [{"$regexMatch": {"input": "$receiver_vpa", "regex": query, "options": "i"}}, 3, 0]}
                            ]
                        }
                    }
                },
                {"$sort": {"relevance_score": -1, "timestamp": -1}},
                {"$limit": limit}
            ])
            
            result = await mongodb.transactions_collection.aggregate(search_pipeline).to_list(limit)
            
            # Convert ObjectId to string
            for doc in result:
                doc["_id"] = str(doc["_id"])
            
            return result
            
        except Exception as e:
            logger.error(f"Error in advanced search: {e}")
            return []

# Global instance
advanced_queries = AdvancedQueries()