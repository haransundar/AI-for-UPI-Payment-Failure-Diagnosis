from fastapi import FastAPI, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
from services.diagnosis_service import DiagnosisService
from models.transaction import Transaction, DiagnosisResponse, FailureType
from utils.data_loader import DataLoader
from database.mongodb import mongodb
from data_ingestion.huggingface_loader import HuggingFaceDataLoader
from database.advanced_queries import advanced_queries
from services.voice_service import voice_service
from fastapi import UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
import tempfile
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="UPI Payment Failure Diagnosis API",
    description="AI-powered real-time payment failure diagnosis for UPI ecosystem with Voice Support",
    version="1.0.0"
)

# Mount static files for audio serving
os.makedirs("static/audio", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
diagnosis_service = DiagnosisService()
data_loader = DataLoader()
hf_loader = HuggingFaceDataLoader()

@app.on_event("startup")
async def startup_event():
    """Initialize data and services on startup"""
    try:
        print("Loading transaction data...")
        await data_loader.load_transaction_data()
        print("Transaction data loaded successfully")
        
        print("Initializing diagnosis service...")
        await diagnosis_service.initialize()
        print("Diagnosis service initialized successfully")
        
        print("UPI Diagnosis API startup completed successfully!")
    except Exception as e:
        print(f"Error during startup: {e}")
        print("API will continue with limited functionality")

@app.get("/")
async def root():
    return {"message": "UPI Payment Failure Diagnosis API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "upi-diagnosis-api"}

@app.post("/diagnose", response_model=DiagnosisResponse)
async def diagnose_transaction(transaction: Transaction):
    """
    Diagnose a failed UPI transaction and provide actionable guidance
    """
    try:
        diagnosis = await diagnosis_service.diagnose_failure(transaction)
        return diagnosis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Diagnosis failed: {str(e)}")

@app.get("/transactions", response_model=List[Transaction])
async def get_transactions(
    limit: int = Query(100, description="Number of transactions to retrieve"),
    skip: int = Query(0, description="Number of transactions to skip for pagination"),
    failure_type: Optional[str] = Query(None, description="Filter by failure type"),
    search: Optional[str] = Query(None, description="Search term for transaction ID, VPA, or failure reason")
):
    """
    Get transactions with advanced filtering, pagination, and search
    """
    try:
        transactions = await data_loader.get_transactions(
            limit=limit, 
            skip=skip,
            failure_type=failure_type,
            search_term=search
        )
        return transactions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch transactions: {str(e)}")

@app.get("/transactions/{transaction_id}", response_model=Transaction)
async def get_transaction_by_id(transaction_id: str):
    """
    Get a specific transaction by ID
    """
    try:
        transaction = await data_loader.get_transaction_by_id(transaction_id)
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        return transaction
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch transaction: {str(e)}")

@app.get("/transactions/stats")
async def get_transaction_statistics():
    """
    Get comprehensive transaction statistics
    """
    try:
        stats = await data_loader.get_transaction_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch statistics: {str(e)}")

@app.get("/failure-types")
async def get_failure_types():
    """
    Get failure type distribution with counts
    """
    try:
        failure_types = await data_loader.get_failure_types()
        return failure_types
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch failure types: {str(e)}")

@app.get("/analytics/hourly")
async def get_hourly_analytics(days: int = Query(7, description="Number of days to analyze")):
    """
    Get hourly transaction analytics for charts
    """
    try:
        if data_loader.mongodb_connected:
            hourly_data = await mongodb.get_hourly_transaction_data(days=days)
            return hourly_data
        else:
            # Fallback to mock data for charts
            return [
                {"hour": "00:00", "date": "2024-01-01", "total": 12, "failed": 2, "successful": 10},
                {"hour": "01:00", "date": "2024-01-01", "total": 8, "failed": 1, "successful": 7},
                {"hour": "02:00", "date": "2024-01-01", "total": 15, "failed": 3, "successful": 12},
            ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch analytics: {str(e)}")

@app.get("/database/health")
async def database_health_check():
    """
    Check database connection and health
    """
    try:
        if data_loader.mongodb_connected:
            health_status = await mongodb.health_check()
            return health_status
        else:
            return {
                "status": "fallback",
                "connected": False,
                "message": "Using CSV/memory storage",
                "transactions_count": len(data_loader.transactions_cache)
            }
    except Exception as e:
        return {
            "status": "error",
            "connected": False,
            "error": str(e)
        }

# Hugging Face Dataset Endpoints
@app.post("/dataset/load-huggingface")
async def load_huggingface_dataset(background_tasks: BackgroundTasks):
    """
    Load the Hugging Face UPI transaction dataset
    """
    try:
        # Load dataset in background
        success = await hf_loader.load_dataset_from_huggingface()
        if not success:
            raise HTTPException(status_code=500, detail="Failed to load Hugging Face dataset")
        
        # Process dataset
        transactions = hf_loader.process_dataset_to_transactions()
        if not transactions:
            raise HTTPException(status_code=500, detail="Failed to process dataset")
        
        # Get statistics
        stats = await hf_loader.get_dataset_statistics()
        
        return {
            "status": "success",
            "message": f"Successfully loaded and processed {len(transactions)} transactions",
            "statistics": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load dataset: {str(e)}")

@app.post("/dataset/ingest-to-mongodb")
async def ingest_huggingface_to_mongodb():
    """
    Ingest processed Hugging Face dataset into MongoDB
    """
    try:
        if not hf_loader.processed_transactions:
            raise HTTPException(status_code=400, detail="No processed transactions found. Load dataset first.")
        
        inserted_count = await hf_loader.ingest_to_mongodb()
        if inserted_count == 0:
            raise HTTPException(status_code=500, detail="Failed to ingest data into MongoDB")
        
        return {
            "status": "success",
            "message": f"Successfully ingested {inserted_count} transactions into MongoDB",
            "inserted_count": inserted_count
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to ingest data: {str(e)}")

@app.get("/dataset/statistics")
async def get_dataset_statistics():
    """
    Get statistics about the loaded Hugging Face dataset
    """
    try:
        if not hf_loader.processed_transactions:
            return {
                "status": "no_data",
                "message": "No dataset loaded. Use /dataset/load-huggingface first."
            }
        
        stats = await hf_loader.get_dataset_statistics()
        return {
            "status": "success",
            "statistics": stats
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get statistics: {str(e)}")

@app.post("/dataset/simulate-realtime")
async def simulate_realtime_replay(
    background_tasks: BackgroundTasks,
    speed_multiplier: float = Query(100.0, description="Speed multiplier for replay (1.0 = real-time)")
):
    """
    Simulate real-time transaction flow by replaying dataset records
    """
    try:
        if not hf_loader.processed_transactions:
            raise HTTPException(status_code=400, detail="No processed transactions found. Load dataset first.")
        
        # Start simulation in background
        background_tasks.add_task(hf_loader.simulate_realtime_replay, speed_multiplier)
        
        return {
            "status": "started",
            "message": f"Real-time simulation started with {speed_multiplier}x speed",
            "transaction_count": len(hf_loader.processed_transactions)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start simulation: {str(e)}")

@app.get("/dataset/info")
async def get_dataset_info():
    """
    Get information about the Hugging Face dataset
    """
    return {
        "dataset_name": "deepakjoshi1606/mock-upi-txn-data",
        "description": "Mock UPI transaction data with realistic failure scenarios",
        "source": "Hugging Face Datasets",
        "fields": {
            "Transaction ID": "Unique identifier for each transaction",
            "Date": "Transaction date",
            "Time": "Transaction time",
            "Issue Type": "Type of failure/issue encountered",
            "Description": "Detailed description of the issue",
            "Amount": "Transaction amount",
            "Sender": "Sender information",
            "Receiver": "Receiver information",
            "Sender UPI ID": "Sender's UPI identifier",
            "Receiver UPI ID": "Receiver's UPI identifier",
            "Sender Bank": "Sender's bank",
            "Receiver Bank": "Receiver's bank",
            "Resolution": "Resolution status/description"
        },
        "mapping": {
            "issue_types_to_failure_types": {
                "insufficient funds": "insufficient_funds",
                "invalid vpa": "invalid_vpa",
                "network issues": "network_issue",
                "bank server error": "bank_server_error",
                "daily limit exceeded": "daily_limit_exceeded",
                "authentication failed": "authentication_failed"
            }
        },
        "status": "loaded" if hf_loader.processed_transactions else "not_loaded"
    }

# Advanced Analytics Endpoints - Direct MongoDB Queries
@app.get("/analytics/failure-patterns")
async def get_failure_patterns_by_time():
    """
    Analyze failure patterns by hour of day - Direct MongoDB aggregation
    """
    try:
        patterns = await advanced_queries.get_failure_patterns_by_time()
        return {
            "status": "success",
            "data": patterns,
            "message": f"Retrieved failure patterns for {len(patterns)} time periods"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze failure patterns: {str(e)}")

@app.get("/analytics/bank-performance")
async def get_bank_performance_metrics():
    """
    Get comprehensive bank performance metrics - Direct MongoDB aggregation
    """
    try:
        metrics = await advanced_queries.get_bank_performance_metrics()
        return {
            "status": "success",
            "data": metrics,
            "message": f"Retrieved performance metrics for {len(metrics)} banks"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get bank metrics: {str(e)}")

@app.get("/analytics/vpa-domains")
async def get_vpa_domain_analysis():
    """
    Analyze transaction patterns by VPA domain (paytm, phonepe, etc.) - Direct MongoDB
    """
    try:
        analysis = await advanced_queries.get_vpa_domain_analysis()
        return {
            "status": "success",
            "data": analysis,
            "message": f"Retrieved VPA domain analysis for {len(analysis)} domain pairs"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze VPA domains: {str(e)}")

@app.get("/analytics/amount-based-failures")
async def get_amount_based_failure_analysis():
    """
    Analyze failure patterns based on transaction amounts - Direct MongoDB aggregation
    """
    try:
        analysis = await advanced_queries.get_amount_based_failure_analysis()
        return {
            "status": "success",
            "data": analysis,
            "message": f"Retrieved amount-based failure analysis for {len(analysis)} ranges"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze amount-based failures: {str(e)}")

@app.get("/analytics/retry-patterns")
async def get_retry_pattern_analysis():
    """
    Analyze retry patterns and success rates - Direct MongoDB aggregation
    """
    try:
        patterns = await advanced_queries.get_retry_pattern_analysis()
        return {
            "status": "success",
            "data": patterns,
            "message": f"Retrieved retry pattern analysis for {len(patterns)} scenarios"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze retry patterns: {str(e)}")

@app.get("/dashboard/realtime")
async def get_realtime_dashboard_data():
    """
    Get comprehensive real-time dashboard data - Optimized MongoDB queries
    """
    try:
        dashboard_data = await advanced_queries.get_real_time_dashboard_data()
        return {
            "status": "success",
            "data": dashboard_data,
            "message": "Real-time dashboard data retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get dashboard data: {str(e)}")

@app.get("/search/advanced")
async def advanced_search_transactions(
    query: str = Query(..., description="Search query"),
    status: Optional[str] = Query(None, description="Filter by status"),
    failure_type: Optional[str] = Query(None, description="Filter by failure type"),
    amount_min: Optional[float] = Query(None, description="Minimum amount"),
    amount_max: Optional[float] = Query(None, description="Maximum amount"),
    limit: int = Query(50, description="Maximum results to return")
):
    """
    Advanced search with multiple filters and relevance scoring - Direct MongoDB
    """
    try:
        filters = {}
        if status:
            filters["status"] = status
        if failure_type:
            filters["failure_type"] = failure_type
        if amount_min is not None:
            filters["amount_min"] = amount_min
        if amount_max is not None:
            filters["amount_max"] = amount_max
        
        results = await advanced_queries.search_transactions_advanced(
            query=query,
            filters=filters,
            limit=limit
        )
        
        return {
            "status": "success",
            "data": results,
            "query": query,
            "filters": filters,
            "count": len(results),
            "message": f"Found {len(results)} matching transactions"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Advanced search failed: {str(e)}")

@app.get("/analytics/live-metrics")
async def get_live_metrics():
    """
    Get live system metrics - Ultra-fast MongoDB queries for monitoring
    """
    try:
        # Quick aggregation for live metrics
        pipeline = [
            {
                "$group": {
                    "_id": None,
                    "total_transactions": {"$sum": 1},
                    "active_failures": {
                        "$sum": {"$cond": [{"$eq": ["$status", "failed"]}, 1, 0]}
                    },
                    "total_volume": {"$sum": "$amount"},
                    "avg_transaction_value": {"$avg": "$amount"}
                }
            }
        ]
        
        result = await mongodb.transactions_collection.aggregate(pipeline).to_list(1)
        metrics = result[0] if result else {}
        
        # Add real-time timestamp
        metrics["timestamp"] = datetime.utcnow().isoformat()
        metrics["system_status"] = "operational"
        
        return {
            "status": "success",
            "metrics": metrics,
            "message": "Live metrics retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get live metrics: {str(e)}")

# Voice Feature Endpoints
@app.post("/voice/upload-audio")
async def upload_audio_for_transcription(
    audio_file: UploadFile = File(...),
    language: str = Form("en")
):
    """
    Upload audio file for speech-to-text transcription
    """
    try:
        # Validate file type
        if not audio_file.content_type.startswith('audio/'):
            raise HTTPException(status_code=400, detail="File must be an audio file")
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            content = await audio_file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Process voice input
            result = await voice_service.process_voice_input(temp_file_path, language)
            
            # Clean up temp file
            os.unlink(temp_file_path)
            
            if result.get("success"):
                return {
                    "status": "success",
                    "transcript": result["transcript"],
                    "confidence": result["confidence"],
                    "language_code": result["language_code"],
                    "audio_duration": result["audio_duration"],
                    "message": "Audio transcribed successfully"
                }
            else:
                raise HTTPException(status_code=400, detail=result.get("error", "Transcription failed"))
        
        except Exception as e:
            # Clean up temp file on error
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
            raise e
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio processing failed: {str(e)}")

@app.post("/voice/diagnose")
async def voice_diagnosis(
    audio_file: UploadFile = File(...),
    language: str = Form("en")
):
    """
    Complete voice-to-voice diagnosis pipeline
    """
    try:
        # Validate file type
        if not audio_file.content_type.startswith('audio/'):
            raise HTTPException(status_code=400, detail="File must be an audio file")
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            content = await audio_file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            # Step 1: Transcribe audio
            transcription_result = await voice_service.process_voice_input(temp_file_path, language)
            
            # Clean up temp file
            os.unlink(temp_file_path)
            
            if not transcription_result.get("success"):
                raise HTTPException(status_code=400, detail=transcription_result.get("error", "Transcription failed"))
            
            transcript = transcription_result["transcript"]
            
            # Step 2: Parse transcript to extract transaction details
            # For demo, we'll use a simple approach - in production, use NLP
            transaction_data = await _parse_voice_transaction(transcript)
            
            # Step 3: Get AI diagnosis
            diagnosis = await diagnosis_service.diagnose_failure(transaction_data)
            
            # Step 4: Generate voice response
            diagnosis_text = f"{diagnosis.diagnosis}. {diagnosis.recommendation}"
            voice_lang = "hi-IN" if language == "hi" else "en-US"
            audio_filename = await voice_service.generate_voice_response(diagnosis_text, voice_lang)
            
            return {
                "status": "success",
                "transcript": transcript,
                "confidence": transcription_result["confidence"],
                "diagnosis": diagnosis.dict(),
                "voice_response_url": voice_service.get_audio_url(audio_filename) if audio_filename else None,
                "message": "Voice diagnosis completed successfully"
            }
        
        except Exception as e:
            # Clean up temp file on error
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
            raise e
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice diagnosis failed: {str(e)}")

@app.post("/voice/text-to-speech")
async def text_to_speech(
    text: str = Form(...),
    language: str = Form("en-US"),
    voice_name: Optional[str] = Form(None)
):
    """
    Convert text to speech audio
    """
    try:
        if not text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        audio_filename = await voice_service.text_to_speech(text, language, voice_name)
        
        if audio_filename:
            return {
                "status": "success",
                "audio_url": voice_service.get_audio_url(audio_filename),
                "filename": audio_filename,
                "message": "Text converted to speech successfully"
            }
        else:
            raise HTTPException(status_code=500, detail="Failed to generate speech")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text-to-speech failed: {str(e)}")

@app.get("/voice/supported-languages")
async def get_supported_languages():
    """
    Get list of supported languages for voice features
    """
    return {
        "speech_to_text": [
            {"code": "en", "name": "English", "display": "English"},
            {"code": "hi", "name": "Hindi", "display": "हिंदी"}
        ],
        "text_to_speech": [
            {"code": "en-US", "name": "English (US)", "voices": ["en-US-Wavenet-D", "en-US-Wavenet-A"]},
            {"code": "hi-IN", "name": "Hindi (India)", "voices": ["hi-IN-Wavenet-A", "hi-IN-Wavenet-B"]}
        ]
    }

@app.post("/voice/cleanup")
async def cleanup_audio_files():
    """
    Clean up old audio files (admin endpoint)
    """
    try:
        await voice_service.cleanup_old_audio_files(max_age_hours=24)
        return {
            "status": "success",
            "message": "Audio files cleaned up successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cleanup failed: {str(e)}")

async def _parse_voice_transaction(transcript: str) -> Transaction:
    """
    Parse voice transcript to extract transaction details
    Simple implementation - in production, use advanced NLP
    """
    import re
    from datetime import datetime
    
    # Extract amount using regex
    amount_match = re.search(r'(?:amount|rupees?|rs\.?)\s*(\d+(?:\.\d{2})?)', transcript.lower())
    amount = float(amount_match.group(1)) if amount_match else 100.0
    
    # Extract VPA if mentioned
    vpa_match = re.search(r'(\w+@\w+)', transcript.lower())
    sender_vpa = vpa_match.group(1) if vpa_match else "user@paytm"
    
    # Extract failure keywords
    failure_keywords = {
        "insufficient": "insufficient_funds",
        "balance": "insufficient_funds",
        "network": "network_issue",
        "timeout": "network_issue",
        "invalid": "invalid_vpa",
        "wrong": "invalid_vpa",
        "server": "bank_server_error",
        "limit": "daily_limit_exceeded",
        "pin": "authentication_failed",
        "password": "authentication_failed"
    }
    
    failure_type = None
    failure_reason = "Transaction failed"
    
    for keyword, ftype in failure_keywords.items():
        if keyword in transcript.lower():
            failure_type = FailureType(ftype)
            failure_reason = f"Transaction failed due to {keyword} issue"
            break
    
    # Create transaction object
    return Transaction(
        transaction_id=f"VOICE_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        timestamp=datetime.now(),
        amount=amount,
        sender_vpa=sender_vpa,
        receiver_vpa="merchant@phonepe",
        sender_bank="HDFC",
        receiver_bank="ICICI",
        status="failed",
        failure_reason=failure_reason,
        failure_type=failure_type,
        error_code="E999",
        retry_count=0,
        metadata={"source": "voice_input", "transcript": transcript}
    )

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=int(os.getenv("PORT", 8000)), 
        reload=True
    )