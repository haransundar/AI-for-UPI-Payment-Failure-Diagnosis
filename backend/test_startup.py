#!/usr/bin/env python3
"""
Test script to verify backend startup and basic functionality
"""

import asyncio
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from utils.data_loader import DataLoader
from services.diagnosis_service import DiagnosisService
from models.transaction import Transaction, FailureType
from datetime import datetime

async def test_data_loader():
    """Test data loader functionality"""
    print("🔄 Testing Data Loader...")
    
    data_loader = DataLoader()
    
    try:
        # Test loading transaction data
        await data_loader.load_transaction_data()
        print(f"✅ Data loaded successfully: {len(data_loader.transactions_cache)} transactions")
        
        # Test getting transactions
        transactions = await data_loader.get_transactions(limit=5)
        print(f"✅ Retrieved {len(transactions)} transactions")
        
        # Test getting failure types
        failure_types = await data_loader.get_failure_types()
        print(f"✅ Failure types: {failure_types}")
        
        return True
    except Exception as e:
        print(f"❌ Data loader test failed: {e}")
        return False

async def test_diagnosis_service():
    """Test diagnosis service functionality"""
    print("\n🔄 Testing Diagnosis Service...")
    
    diagnosis_service = DiagnosisService()
    
    try:
        # Test initialization
        await diagnosis_service.initialize()
        print("✅ Diagnosis service initialized successfully")
        
        # Create a test transaction
        test_transaction = Transaction(
            transaction_id="TEST001",
            timestamp=datetime.now(),
            amount=1000.0,
            sender_vpa="test@paytm",
            receiver_vpa="merchant@phonepe",
            sender_bank="HDFC",
            receiver_bank="ICICI",
            status="FAILED",
            failure_reason="Insufficient funds",
            failure_type=FailureType.INSUFFICIENT_FUNDS,
            error_code="E001",
            retry_count=1,
            metadata={"device": "mobile"}
        )
        
        # Test diagnosis
        diagnosis = await diagnosis_service.diagnose_failure(test_transaction)
        print(f"✅ Diagnosis completed: {diagnosis.diagnosis[:50]}...")
        print(f"✅ Confidence score: {diagnosis.confidence_score}")
        
        return True
    except Exception as e:
        print(f"❌ Diagnosis service test failed: {e}")
        return False

async def main():
    """Run all tests"""
    print("🚀 Starting UPI Diagnosis Backend Tests\n")
    
    # Test data loader
    data_loader_ok = await test_data_loader()
    
    # Test diagnosis service
    diagnosis_service_ok = await test_diagnosis_service()
    
    # Summary
    print("\n📊 Test Summary:")
    print(f"Data Loader: {'✅ PASS' if data_loader_ok else '❌ FAIL'}")
    print(f"Diagnosis Service: {'✅ PASS' if diagnosis_service_ok else '❌ FAIL'}")
    
    if data_loader_ok and diagnosis_service_ok:
        print("\n🎉 All tests passed! Backend is ready to run.")
        return 0
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)