#!/usr/bin/env python3
"""
Standalone script to ingest Hugging Face UPI transaction dataset
Run this script to load real-world data into your MongoDB database
"""

import asyncio
import sys
import os

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data_ingestion.huggingface_loader import HuggingFaceDataLoader
from database.mongodb import mongodb
from dotenv import load_dotenv

async def main():
    """Main ingestion process"""
    print("🚀 Starting Hugging Face Dataset Ingestion Process")
    print("=" * 60)
    
    # Load environment variables
    load_dotenv()
    
    # Initialize loader
    loader = HuggingFaceDataLoader()
    
    try:
        # Step 1: Load dataset from Hugging Face
        print("\n📥 Step 1: Loading dataset from Hugging Face...")
        success = await loader.load_dataset_from_huggingface()
        if not success:
            print("❌ Failed to load dataset from Hugging Face")
            return 1
        
        # Step 2: Process dataset into Transaction objects
        print("\n🔄 Step 2: Processing dataset into Transaction objects...")
        transactions = loader.process_dataset_to_transactions()
        if not transactions:
            print("❌ Failed to process dataset")
            return 1
        
        print(f"✅ Successfully processed {len(transactions)} transactions")
        
        # Step 3: Get and display statistics
        print("\n📊 Step 3: Dataset Statistics")
        stats = await loader.get_dataset_statistics()
        
        print(f"Total Transactions: {stats['total_transactions']}")
        print(f"Successful: {stats['successful_transactions']} ({stats['success_rate']:.1f}%)")
        print(f"Failed: {stats['failed_transactions']} ({stats['failure_rate']:.1f}%)")
        print(f"Pending: {stats['pending_transactions']}")
        
        print(f"\nAmount Statistics:")
        print(f"  Min: ₹{stats['amount_statistics']['min_amount']:.2f}")
        print(f"  Max: ₹{stats['amount_statistics']['max_amount']:.2f}")
        print(f"  Avg: ₹{stats['amount_statistics']['avg_amount']:.2f}")
        print(f"  Total: ₹{stats['amount_statistics']['total_amount']:.2f}")
        
        print(f"\nFailure Type Distribution:")
        for failure_type, count in stats['failure_type_distribution'].items():
            print(f"  {failure_type}: {count}")
        
        print(f"\nDate Range:")
        print(f"  From: {stats['date_range']['earliest']}")
        print(f"  To: {stats['date_range']['latest']}")
        
        # Step 4: Connect to MongoDB
        print("\n🔌 Step 4: Connecting to MongoDB...")
        if not await mongodb.connect():
            print("❌ Failed to connect to MongoDB")
            print("💡 Make sure MongoDB is running and connection string is correct")
            return 1
        
        print("✅ Connected to MongoDB successfully")
        
        # Step 5: Ingest data into MongoDB
        print("\n💾 Step 5: Ingesting data into MongoDB...")
        
        # Ask user if they want to clear existing data
        response = input("Do you want to clear existing transaction data? (y/N): ").lower()
        if response in ['y', 'yes']:
            print("🗑️ Clearing existing transaction data...")
            await mongodb.transactions_collection.delete_many({})
            print("✅ Existing data cleared")
        
        # Ingest new data
        inserted_count = await loader.ingest_to_mongodb(transactions)
        if inserted_count == 0:
            print("❌ Failed to ingest data into MongoDB")
            return 1
        
        print(f"✅ Successfully ingested {inserted_count} transactions into MongoDB")
        
        # Step 6: Verify ingestion
        print("\n🔍 Step 6: Verifying ingestion...")
        db_count = await mongodb.transactions_collection.count_documents({})
        print(f"✅ Database now contains {db_count} transactions")
        
        # Optional: Real-time simulation
        print("\n🎬 Optional: Real-time Simulation")
        response = input("Do you want to simulate real-time transaction replay? (y/N): ").lower()
        if response in ['y', 'yes']:
            speed = input("Enter speed multiplier (default 100x): ").strip()
            try:
                speed_multiplier = float(speed) if speed else 100.0
            except ValueError:
                speed_multiplier = 100.0
            
            print(f"🎬 Starting real-time simulation at {speed_multiplier}x speed...")
            await loader.simulate_realtime_replay(speed_multiplier)
            print("✅ Real-time simulation completed")
        
        print("\n🎉 Ingestion Process Completed Successfully!")
        print("=" * 60)
        print("Your UPI Diagnosis platform now has real-world transaction data!")
        print("You can start the backend server and explore the data.")
        
        return 0
        
    except KeyboardInterrupt:
        print("\n⚠️ Process interrupted by user")
        return 1
    except Exception as e:
        print(f"\n❌ Error during ingestion: {e}")
        return 1
    finally:
        # Cleanup
        if mongodb.client:
            await mongodb.disconnect()

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    sys.exit(exit_code)