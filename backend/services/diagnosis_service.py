from groq import Groq
from models.transaction import Transaction, DiagnosisResponse, FailureType
import json
import os
from typing import List, Dict
import asyncio

class DiagnosisService:
    def __init__(self):
        self.llm = None
        self.diagnosis_chain = None
        self.knowledge_base = None
        self.embeddings = None
        
    async def initialize(self):
        """Initialize LLM and knowledge base"""
        # Initialize Groq client
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        
        self.llm = Groq(api_key=api_key)
        self.model_name = os.getenv("LLM_MODEL", "llama3-8b-8192")
        
        # Load knowledge base
        await self._load_knowledge_base()
        
        # Create diagnosis prompt template
        self._create_diagnosis_prompt()
    
    async def _load_knowledge_base(self):
        """Load UPI failure knowledge base"""
        self.knowledge_base = {
            "insufficient_funds": {
                "content": "Insufficient funds: User's bank account doesn't have enough balance. Solution: Check account balance, add funds, or use different payment method.",
                "category": "user_error"
            },
            "invalid_vpa": {
                "content": "Incorrect VPA: Virtual Payment Address is invalid or doesn't exist. Solution: Verify recipient's UPI ID, check for typos, confirm with recipient.",
                "category": "user_error"
            },
            "network_issue": {
                "content": "Network timeout: Transaction failed due to poor network connectivity. Solution: Check internet connection, retry in better network area, use mobile data if on WiFi.",
                "category": "technical"
            },
            "bank_server_error": {
                "content": "Bank server error: Recipient or sender bank server is temporarily unavailable. Solution: Wait 5-10 minutes and retry, contact bank if issue persists.",
                "category": "technical"
            },
            "daily_limit_exceeded": {
                "content": "Daily limit exceeded: Transaction amount exceeds daily UPI transaction limit. Solution: Check daily limits, split transaction, or use different payment method.",
                "category": "limit"
            },
            "authentication_failed": {
                "content": "Authentication failed: UPI PIN verification failed or expired. Solution: Re-enter correct UPI PIN, reset PIN if forgotten, ensure device security.",
                "category": "security"
            }
        }
    
    def _create_diagnosis_prompt(self):
        """Create diagnosis prompt template"""
        self.diagnosis_prompt_template = """
You are an expert UPI payment system analyst. Analyze the failed transaction and provide clear, actionable guidance.

Transaction Details:
{transaction_data}

Failure Context:
{failure_context}

Relevant Knowledge:
{knowledge_context}

Provide a comprehensive diagnosis with:
1. Clear explanation of what went wrong
2. Specific steps the user should take
3. Technical details for support teams
4. Estimated resolution time
5. Whether to contact support or retry

Be empathetic, clear, and actionable. Avoid technical jargon for user guidance.

Response format (JSON):
{{
    "diagnosis": "Clear explanation of the failure",
    "user_guidance": "Simple steps for the user",
    "technical_details": "Technical explanation for support",
    "resolution_steps": ["Step 1", "Step 2", "Step 3"],
    "estimated_resolution_time": "Time estimate",
    "contact_support": true/false,
    "retry_recommended": true/false,
    "confidence_score": 0.95
}}
"""
    
    async def diagnose_failure(self, transaction: Transaction) -> DiagnosisResponse:
        """Diagnose transaction failure using AI with enhanced real-world data context"""
        try:
            # Determine failure type
            failure_type = self._classify_failure_type(transaction)
            
            # Get relevant knowledge from RAG
            knowledge_context = await self._get_relevant_knowledge(transaction, failure_type)
            
            # Prepare enhanced transaction data with metadata
            transaction_data = {
                "id": transaction.transaction_id,
                "timestamp": transaction.timestamp.isoformat() if transaction.timestamp else None,
                "amount": transaction.amount,
                "sender_vpa": transaction.sender_vpa,
                "receiver_vpa": transaction.receiver_vpa,
                "sender_bank": transaction.sender_bank,
                "receiver_bank": transaction.receiver_bank,
                "error_code": transaction.error_code,
                "failure_reason": transaction.failure_reason,
                "retry_count": transaction.retry_count,
                "status": transaction.status
            }
            
            # Add metadata context if available
            metadata_context = ""
            if transaction.metadata:
                if 'original_issue_type' in transaction.metadata:
                    metadata_context += f"Original Issue Type: {transaction.metadata['original_issue_type']}\n"
                if 'original_description' in transaction.metadata:
                    metadata_context += f"Original Description: {transaction.metadata['original_description']}\n"
                if 'original_resolution' in transaction.metadata:
                    metadata_context += f"Original Resolution: {transaction.metadata['original_resolution']}\n"
                if 'dataset_source' in transaction.metadata:
                    metadata_context += f"Data Source: Real-world UPI transaction dataset\n"
            
            # Enhanced failure context
            failure_context = f"""
Failure Type: {failure_type.value if failure_type else 'Unknown'}
Transaction Status: {transaction.status}
Banks Involved: {transaction.sender_bank} → {transaction.receiver_bank}
Retry Attempts: {transaction.retry_count}

{metadata_context}
"""
            
            # Create the enhanced prompt
            prompt = self.diagnosis_prompt_template.format(
                transaction_data=json.dumps(transaction_data, indent=2),
                failure_context=failure_context.strip(),
                knowledge_context=knowledge_context
            )
            
            # Generate diagnosis using Groq
            result = await asyncio.to_thread(
                self._call_groq_api,
                prompt
            )
            
            # Parse LLM response
            diagnosis_data = self._parse_llm_response(result)
            
            # Enhance diagnosis with real-world context
            if transaction.metadata and 'original_resolution' in transaction.metadata:
                original_resolution = transaction.metadata['original_resolution']
                if original_resolution and str(original_resolution).lower() not in ['nan', 'none', '']:
                    diagnosis_data['technical_details'] += f"\n\nOriginal Resolution Status: {original_resolution}"
            
            return DiagnosisResponse(
                transaction_id=transaction.transaction_id,
                failure_type=failure_type,
                **diagnosis_data
            )
            
        except Exception as e:
            # Fallback diagnosis
            return self._create_fallback_diagnosis(transaction, str(e))
    
    def _classify_failure_type(self, transaction: Transaction) -> FailureType:
        """Classify failure type based on transaction data"""
        if transaction.failure_type:
            return transaction.failure_type
            
        # Simple rule-based classification
        failure_reason = (transaction.failure_reason or "").lower()
        error_code = (transaction.error_code or "").lower()
        
        if "insufficient" in failure_reason or "balance" in failure_reason:
            return FailureType.INSUFFICIENT_FUNDS
        elif "invalid" in failure_reason or "vpa" in failure_reason:
            return FailureType.INVALID_VPA
        elif "network" in failure_reason or "timeout" in failure_reason:
            return FailureType.NETWORK_ISSUE
        elif "server" in failure_reason or "bank" in failure_reason:
            return FailureType.BANK_SERVER_ERROR
        elif "limit" in failure_reason:
            return FailureType.DAILY_LIMIT_EXCEEDED
        elif "auth" in failure_reason or "pin" in failure_reason:
            return FailureType.AUTHENTICATION_FAILED
        else:
            return FailureType.NETWORK_ISSUE  # Default
    
    async def _get_relevant_knowledge(self, transaction: Transaction, failure_type: FailureType) -> str:
        """Get relevant knowledge from knowledge base"""
        if not self.knowledge_base:
            return "No knowledge base available"
            
        # Get knowledge for the specific failure type
        failure_key = failure_type.value.lower()
        if failure_key in self.knowledge_base:
            return self.knowledge_base[failure_key]["content"]
        
        # Return general knowledge if specific type not found
        return "General UPI failure: Transaction could not be completed due to system issues. Please retry after some time."
    
    def _call_groq_api(self, prompt: str) -> str:
        """Call Groq API with the given prompt"""
        try:
            chat_completion = self.llm.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model_name,
                temperature=0.3,
                max_tokens=1024,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            raise Exception(f"Groq API call failed: {str(e)}")
    
    def _parse_llm_response(self, response: str) -> Dict:
        """Parse LLM JSON response with fallback"""
        try:
            # Try to extract JSON from response
            start = response.find('{')
            end = response.rfind('}') + 1
            if start != -1 and end != 0:
                json_str = response[start:end]
                return json.loads(json_str)
        except:
            pass
            
        # Fallback parsing
        return {
            "diagnosis": "Transaction failed due to system error",
            "user_guidance": "Please try again in a few minutes",
            "technical_details": "LLM response parsing failed",
            "resolution_steps": ["Wait 5 minutes", "Retry transaction", "Contact support if issue persists"],
            "estimated_resolution_time": "5-10 minutes",
            "contact_support": False,
            "retry_recommended": True,
            "confidence_score": 0.5
        }
    
    def _create_fallback_diagnosis(self, transaction: Transaction, error: str) -> DiagnosisResponse:
        """Create fallback diagnosis when AI fails"""
        return DiagnosisResponse(
            transaction_id=transaction.transaction_id,
            failure_type=FailureType.NETWORK_ISSUE,
            diagnosis=f"Unable to analyze transaction failure: {error}",
            user_guidance="Please try your transaction again. If the problem continues, contact your bank.",
            technical_details=f"Diagnosis service error: {error}",
            resolution_steps=[
                "Wait 2-3 minutes",
                "Check your internet connection", 
                "Retry the transaction",
                "Contact support if issue persists"
            ],
            estimated_resolution_time="2-5 minutes",
            contact_support=False,
            retry_recommended=True,
            confidence_score=0.3
        )