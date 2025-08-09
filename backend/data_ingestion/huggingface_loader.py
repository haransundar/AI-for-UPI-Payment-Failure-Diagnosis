"""
Hugging Face Dataset Loader for UPI Transaction Data
Ingests deepakjoshi1606/mock-upi-txn-data into MongoDB
"""

import os
import asyncio
import pandas as pd
from datasets import load_dataset
from datetime import datetime, timedelta
import logging
from typing import List, Dict, Optional, Any
from motor.motor_asyncio import AsyncIOMotorClient
from database.mongodb import mongodb
from models.transaction import Transaction, FailureType
import random
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HuggingFaceDataLoader:
    def __init__(self):
        self.dataset = None
        self.processed_transactions = []
        
    async def load_dataset_from_huggingface(self) -> bool:
        """Load the UPI transaction dataset from Hugging Face"""
        try:
            logger.info("🔄 Loading dataset from Hugging Face: deepakjoshi1606/mock-upi-txn-data")
            
            # Load dataset from Hugging Face
            self.dataset = load_dataset("deepakjoshi1606/mock-upi-txn-data")
            
            logger.info(f"✅ Successfully loaded dataset with {len(self.dataset['train'])} records")
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to load dataset from Hugging Face: {e}")
            return False
    
    def _map_issue_type_to_failure_type(self, issue_type: str) -> Optional[FailureType]:
        """Map dataset issue types to our FailureType enum"""
        if not issue_type:
            return None
            
        issue_lower = issue_type.lower()
        
        # Mapping based on common UPI failure patterns
        if any(keyword in issue_lower for keyword in ['insufficient', 'balance', 'fund']):
            return FailureType.INSUFFICIENT_FUNDS
        elif any(keyword in issue_lower for keyword in ['invalid', 'vpa', 'id', 'account']):
            return FailureType.INVALID_VPA
        elif any(keyword in issue_lower for keyword in ['network', 'timeout', 'connection', 'connectivity']):
            return FailureType.NETWORK_ISSUE
        elif any(keyword in issue_lower for keyword in ['server', 'bank', 'downtime', 'maintenance']):
            return FailureType.BANK_SERVER_ERROR
        elif any(keyword in issue_lower for keyword in ['limit', 'exceeded', 'maximum']):
            return FailureType.DAILY_LIMIT_EXCEEDED
        elif any(keyword in issue_lower for keyword in ['pin', 'auth', 'verification', 'otp']):
            return FailureType.AUTHENTICATION_FAILED
        else:
            return FailureType.NETWORK_ISSUE  # Default fallback
    
    def _generate_transaction_id(self, index: int) -> str:
        """Generate a realistic transaction ID"""
        return f"UPI{datetime.now().strftime('%Y%m%d')}{str(index).zfill(6)}"
    
    def _parse_datetime(self, date_str: str, time_str: str) -> datetime:
        """Parse date and time strings into datetime object"""
        try:
            # Handle various date formats
            if isinstance(date_str, str):
                # Try different date formats
                for fmt in ['%Y-%m-%d', '%d/%m/%Y', '%d-%m-%Y', '%m/%d/%Y']:
                    try:
                        date_obj = datetime.strptime(date_str, fmt)
                        break
                    except ValueError:
                        continue
                else:
                    # If no format works, use current date
                    date_obj = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            else:
                date_obj = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
            
            # Parse time
            if isinstance(time_str, str):
                try:
                    time_parts = time_str.split(':')
                    hour = int(time_parts[0]) if len(time_parts) > 0 else 0
                    minute = int(time_parts[1]) if len(time_parts) > 1 else 0
                    second = int(time_parts[2]) if len(time_parts) > 2 else 0
                    
                    return date_obj.replace(hour=hour, minute=minute, second=second)
                except (ValueError, IndexError):
                    pass
            
            # Fallback to random time
            return date_obj.replace(
                hour=random.randint(0, 23),
                minute=random.randint(0, 59),
                second=random.randint(0, 59)
            )
            
        except Exception as e:
            logger.warning(f"Error parsing datetime: {e}")
            return datetime.now() - timedelta(days=random.randint(0, 30))
    
    def _extract_amount(self, amount_str: Any) -> float:
        """Extract amount from various formats"""
        if isinstance(amount_str, (int, float)):
            return float(amount_str)
        
        if isinstance(amount_str, str):
            # Remove currency symbols and extract numbers
            amount_clean = re.sub(r'[^\d.]', '', amount_str)
            try:
                return float(amount_clean) if amount_clean else random.uniform(100, 50000)
            except ValueError:
                pass
        
        # Fallback to random amount
        return round(random.uniform(100, 50000), 2)
    
    def _generate_vpa(self, name_hint: str = None) -> str:
        """Generate realistic VPA"""
        domains = ['paytm', 'phonepe', 'gpay', 'amazonpay', 'mobikwik', 'ybl', 'ibl', 'axl']
        
        if name_hint and isinstance(name_hint, str):
            # Extract name from hint
            clean_name = re.sub(r'[^a-zA-Z0-9]', '', name_hint.lower())
            if clean_name:
                return f"{clean_name[:10]}@{random.choice(domains)}"
        
        # Generate random VPA
        username = f"user{random.randint(1000, 9999)}"
        return f"{username}@{random.choice(domains)}"
    
    def _get_bank_from_vpa(self, vpa: str) -> str:
        """Map VPA domain to bank"""
        domain_to_bank = {
            'paytm': 'PAYTM',
            'phonepe': 'YESBANK',
            'gpay': 'AXIS',
            'amazonpay': 'AXIS',
            'mobikwik': 'YESBANK',
            'ybl': 'YES',
            'ibl': 'IDBI',
            'axl': 'AXIS'
        }
        
        domain = vpa.split('@')[-1] if '@' in vpa else 'paytm'
        return domain_to_bank.get(domain, random.choice(['HDFC', 'ICICI', 'SBI', 'AXIS', 'KOTAK']))
    
    def _determine_status(self, resolution: str) -> str:
        """Determine transaction status from resolution"""
        if not resolution or pd.isna(resolution):
            return 'failed'
        
        resolution_lower = str(resolution).lower()
        
        if any(keyword in resolution_lower for keyword in ['success', 'completed', 'resolved', 'fixed']):
            return 'success'
        elif any(keyword in resolution_lower for keyword in ['pending', 'processing', 'in progress']):
            return 'pending'
        else:
            return 'failed'
    
    def _generate_error_code(self, failure_type: FailureType) -> str:
        """Generate realistic error codes"""
        error_codes = {
            FailureType.INSUFFICIENT_FUNDS: ['U30', 'E001', 'BAL_LOW'],
            FailureType.INVALID_VPA: ['U16', 'E002', 'VPA_INVALID'],
            FailureType.NETWORK_ISSUE: ['U69', 'E003', 'NET_TIMEOUT'],
            FailureType.BANK_SERVER_ERROR: ['U28', 'E004', 'BANK_DOWN'],
            FailureType.DAILY_LIMIT_EXCEEDED: ['U53', 'E005', 'LIMIT_EXCEED'],
            FailureType.AUTHENTICATION_FAILED: ['U17', 'E008', 'AUTH_FAIL']
        }
        
        return random.choice(error_codes.get(failure_type, ['U99', 'E999']))
    
    def process_dataset_to_transactions(self) -> List[Transaction]:
        """Process the Hugging Face dataset into Transaction objects"""
        if not self.dataset:
            logger.error("❌ Dataset not loaded. Call load_dataset_from_huggingface() first.")
            return []
        
        logger.info("🔄 Processing dataset into Transaction objects...")
        transactions = []
        
        # Get the training split
        data = self.dataset['train']
        
        for idx, record in enumerate(data):
            try:
                # Extract and clean data from the record
                transaction_id = self._generate_transaction_id(idx)
                
                # Parse datetime
                date_str = record.get('Date', '')
                time_str = record.get('Time', '')
                timestamp = self._parse_datetime(date_str, time_str)
                
                # Extract amount
                amount = self._extract_amount(record.get('Amount', 0))
                
                # Map issue type to failure type
                issue_type = record.get('Issue Type', '')
                failure_type = self._map_issue_type_to_failure_type(issue_type)
                
                # Generate VPAs
                sender_vpa = self._generate_vpa(record.get('Sender', ''))
                receiver_vpa = self._generate_vpa(record.get('Receiver', ''))
                
                # Get banks from VPAs
                sender_bank = self._get_bank_from_vpa(sender_vpa)
                receiver_bank = self._get_bank_from_vpa(receiver_vpa)
                
                # Determine status
                resolution = record.get('Resolution', '')
                status = self._determine_status(resolution)
                
                # Get failure reason and description
                failure_reason = record.get('Description', issue_type) if status == 'failed' else None
                
                # Generate error code for failed transactions
                error_code = self._generate_error_code(failure_type) if status == 'failed' and failure_type else None
                
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
                    failure_type=failure_type,
                    error_code=error_code,
                    retry_count=random.randint(0, 3) if status == 'failed' else 0,
                    metadata={
                        'original_issue_type': issue_type,
                        'original_description': record.get('Description', ''),
                        'original_resolution': resolution,
                        'dataset_source': 'huggingface_deepakjoshi1606',
                        'processed_at': datetime.now().isoformat()
                    }
                )
                
                transactions.append(transaction)
                
            except Exception as e:
                logger.warning(f"⚠️ Error processing record {idx}: {e}")
                continue
        
        logger.info(f"✅ Successfully processed {len(transactions)} transactions from dataset")
        self.processed_transactions = transactions
        return transactions
    
    async def ingest_to_mongodb(self, transactions: List[Transaction] = None) -> int:
        """Ingest processed transactions into MongoDB"""
        if not transactions:
            transactions = self.processed_transactions
        
        if not transactions:
            logger.error("❌ No transactions to ingest")
            return 0
        
        try:
            # Connect to MongoDB
            if not await mongodb.connect():
                logger.error("❌ Failed to connect to MongoDB")
                return 0
            
            # Clear existing data (optional - comment out to preserve existing data)
            # await mongodb.transactions_collection.delete_many({})
            # logger.info("🗑️ Cleared existing transaction data")
            
            # Bulk insert transactions
            inserted_count = await mongodb.bulk_insert_transactions(transactions)
            
            logger.info(f"✅ Successfully ingested {inserted_count} transactions into MongoDB")
            return inserted_count
            
        except Exception as e:
            logger.error(f"❌ Error ingesting data to MongoDB: {e}")
            return 0
    
    async def simulate_realtime_replay(self, speed_multiplier: float = 1000.0) -> None:
        """Simulate real-time transaction flow by replaying records by timestamp"""
        if not self.processed_transactions:
            logger.error("❌ No transactions loaded for replay")
            return
        
        logger.info(f"🎬 Starting real-time replay simulation (speed: {speed_multiplier}x)")
        
        # Sort transactions by timestamp
        sorted_transactions = sorted(self.processed_transactions, key=lambda t: t.timestamp)
        
        if not sorted_transactions:
            return
        
        start_time = sorted_transactions[0].timestamp
        current_real_time = datetime.now()
        
        for transaction in sorted_transactions:
            # Calculate delay based on timestamp difference
            time_diff = (transaction.timestamp - start_time).total_seconds()
            delay = time_diff / speed_multiplier
            
            if delay > 0:
                await asyncio.sleep(delay)
            
            # Insert transaction into MongoDB
            await mongodb.insert_transaction(transaction)
            
            logger.info(f"📊 Replayed transaction: {transaction.transaction_id} - {transaction.status}")
        
        logger.info("🎬 Real-time replay simulation completed")
    
    async def get_dataset_statistics(self) -> Dict[str, Any]:
        """Get statistics about the loaded dataset"""
        if not self.processed_transactions:
            return {}
        
        total_transactions = len(self.processed_transactions)
        failed_transactions = len([t for t in self.processed_transactions if t.status == 'failed'])
        successful_transactions = len([t for t in self.processed_transactions if t.status == 'success'])
        pending_transactions = len([t for t in self.processed_transactions if t.status == 'pending'])
        
        # Failure type distribution
        failure_types = {}
        for transaction in self.processed_transactions:
            if transaction.failure_type:
                ft = transaction.failure_type.value
                failure_types[ft] = failure_types.get(ft, 0) + 1
        
        # Amount statistics
        amounts = [t.amount for t in self.processed_transactions]
        
        return {
            'total_transactions': total_transactions,
            'successful_transactions': successful_transactions,
            'failed_transactions': failed_transactions,
            'pending_transactions': pending_transactions,
            'success_rate': (successful_transactions / total_transactions * 100) if total_transactions > 0 else 0,
            'failure_rate': (failed_transactions / total_transactions * 100) if total_transactions > 0 else 0,
            'failure_type_distribution': failure_types,
            'amount_statistics': {
                'min_amount': min(amounts) if amounts else 0,
                'max_amount': max(amounts) if amounts else 0,
                'avg_amount': sum(amounts) / len(amounts) if amounts else 0,
                'total_amount': sum(amounts) if amounts else 0
            },
            'date_range': {
                'earliest': min(t.timestamp for t in self.processed_transactions).isoformat() if self.processed_transactions else None,
                'latest': max(t.timestamp for t in self.processed_transactions).isoformat() if self.processed_transactions else None
            }
        }

# Main execution function
async def main():
    """Main function to load and ingest Hugging Face dataset"""
    loader = HuggingFaceDataLoader()
    
    # Load dataset from Hugging Face
    if not await loader.load_dataset_from_huggingface():
        logger.error("❌ Failed to load dataset")
        return
    
    # Process dataset into transactions
    transactions = loader.process_dataset_to_transactions()
    if not transactions:
        logger.error("❌ No transactions processed")
        return
    
    # Get dataset statistics
    stats = await loader.get_dataset_statistics()
    logger.info(f"📊 Dataset Statistics: {stats}")
    
    # Ingest into MongoDB
    inserted_count = await loader.ingest_to_mongodb(transactions)
    logger.info(f"✅ Ingestion complete: {inserted_count} transactions")
    
    # Optional: Simulate real-time replay (uncomment to enable)
    # await loader.simulate_realtime_replay(speed_multiplier=100.0)

if __name__ == "__main__":
    asyncio.run(main())