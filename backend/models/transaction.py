from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

class FailureType(str, Enum):
    INSUFFICIENT_FUNDS = "insufficient_funds"
    INCORRECT_DETAILS = "incorrect_details"
    NETWORK_ISSUE = "network_issue"
    BANK_SERVER_ERROR = "bank_server_error"
    DAILY_LIMIT_EXCEEDED = "daily_limit_exceeded"
    INVALID_VPA = "invalid_vpa"
    TIMEOUT = "timeout"
    AUTHENTICATION_FAILED = "authentication_failed"

class Transaction(BaseModel):
    transaction_id: str = Field(..., description="Unique transaction identifier")
    timestamp: datetime = Field(..., description="Transaction timestamp")
    amount: float = Field(..., description="Transaction amount in INR")
    sender_vpa: str = Field(..., description="Sender's Virtual Payment Address")
    receiver_vpa: str = Field(..., description="Receiver's Virtual Payment Address")
    sender_bank: str = Field(..., description="Sender's bank code")
    receiver_bank: str = Field(..., description="Receiver's bank code")
    status: str = Field(..., description="Transaction status (SUCCESS/FAILED)")
    failure_reason: Optional[str] = Field(None, description="Failure reason if transaction failed")
    failure_type: Optional[FailureType] = Field(None, description="Categorized failure type")
    error_code: Optional[str] = Field(None, description="System error code")
    retry_count: int = Field(0, description="Number of retry attempts")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional transaction metadata")

class DiagnosisResponse(BaseModel):
    transaction_id: str
    failure_type: FailureType
    diagnosis: str = Field(..., description="AI-generated diagnosis explanation")
    user_guidance: str = Field(..., description="Clear, actionable steps for the user")
    technical_details: str = Field(..., description="Technical explanation for support teams")
    resolution_steps: list[str] = Field(..., description="Step-by-step resolution guide")
    estimated_resolution_time: str = Field(..., description="Expected time to resolve")
    contact_support: bool = Field(..., description="Whether user should contact support")
    retry_recommended: bool = Field(..., description="Whether retry is recommended")
    confidence_score: float = Field(..., description="AI confidence in diagnosis (0-1)")