"""
Voice Service for UPI Payment Failure Diagnosis
Handles Speech-to-Text (AssemblyAI) and Text-to-Speech (Google Cloud TTS)
"""

import os
import asyncio
import aiohttp
import aiofiles
import json
import uuid
from typing import Optional, Dict, Any, Tuple
from datetime import datetime
import logging
from google.cloud import texttospeech
from google.oauth2 import service_account
import tempfile

logger = logging.getLogger(__name__)

class VoiceService:
    def __init__(self):
        self.assemblyai_api_key = os.getenv("ASSEMBLYAI_API_KEY", "your_assemblyai_api_key_here")
        self.assemblyai_base_url = "https://api.assemblyai.com/v2"
        self.google_api_key = os.getenv("GOOGLE_API_KEY", "your_google_api_key_here")
        
        # Initialize Google Cloud TTS client
        self.tts_client = None
        self._init_google_tts()
        
        # Create audio storage directory
        self.audio_dir = os.path.join("static", "audio")
        os.makedirs(self.audio_dir, exist_ok=True)
    
    def _init_google_tts(self):
        """Initialize Google Cloud TTS client"""
        try:
            # Try to use service account if available
            service_account_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
            if service_account_path and os.path.exists(service_account_path):
                credentials = service_account.Credentials.from_service_account_file(service_account_path)
                self.tts_client = texttospeech.TextToSpeechClient(credentials=credentials)
                logger.info("✅ Google TTS initialized with service account")
            else:
                # Fallback to API key (we'll use REST API)
                logger.info("📝 Google TTS will use REST API with API key")
        except Exception as e:
            logger.error(f"❌ Error initializing Google TTS: {e}")
    
    async def upload_audio_to_assemblyai(self, audio_file_path: str) -> Optional[str]:
        """Upload audio file to AssemblyAI and get upload URL"""
        try:
            headers = {"authorization": self.assemblyai_api_key}
            
            async with aiohttp.ClientSession() as session:
                async with aiofiles.open(audio_file_path, 'rb') as f:
                    audio_data = await f.read()
                
                async with session.post(
                    f"{self.assemblyai_base_url}/upload",
                    headers=headers,
                    data=audio_data
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        upload_url = result.get("upload_url")
                        logger.info(f"✅ Audio uploaded to AssemblyAI: {upload_url}")
                        return upload_url
                    else:
                        error_text = await response.text()
                        logger.error(f"❌ AssemblyAI upload failed: {response.status} - {error_text}")
                        return None
        
        except Exception as e:
            logger.error(f"❌ Error uploading to AssemblyAI: {e}")
            return None
    
    async def transcribe_audio(self, audio_url: str, language_code: str = "en") -> Optional[Dict[str, Any]]:
        """Transcribe audio using AssemblyAI"""
        try:
            headers = {
                "authorization": self.assemblyai_api_key,
                "content-type": "application/json"
            }
            
            # Configure transcription settings
            transcription_config = {
                "audio_url": audio_url,
                "language_code": language_code,  # "en" for English, "hi" for Hindi
                "punctuate": True,
                "format_text": True,
                "dual_channel": False,
                "webhook_url": None,
                "auto_highlights": True,
                "speaker_labels": False
            }
            
            async with aiohttp.ClientSession() as session:
                # Submit transcription job
                async with session.post(
                    f"{self.assemblyai_base_url}/transcript",
                    headers=headers,
                    json=transcription_config
                ) as response:
                    if response.status == 200:
                        job_response = await response.json()
                        job_id = job_response.get("id")
                        logger.info(f"📝 Transcription job submitted: {job_id}")
                        
                        # Poll for completion
                        return await self._poll_transcription_status(session, headers, job_id)
                    else:
                        error_text = await response.text()
                        logger.error(f"❌ Transcription submission failed: {response.status} - {error_text}")
                        return None
        
        except Exception as e:
            logger.error(f"❌ Error in transcription: {e}")
            return None
    
    async def _poll_transcription_status(self, session: aiohttp.ClientSession, headers: Dict, job_id: str) -> Optional[Dict[str, Any]]:
        """Poll AssemblyAI for transcription completion"""
        max_attempts = 60  # 5 minutes max
        attempt = 0
        
        while attempt < max_attempts:
            try:
                async with session.get(
                    f"{self.assemblyai_base_url}/transcript/{job_id}",
                    headers=headers
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        status = result.get("status")
                        
                        if status == "completed":
                            logger.info(f"✅ Transcription completed: {job_id}")
                            return {
                                "transcript": result.get("text", ""),
                                "confidence": result.get("confidence", 0),
                                "language_code": result.get("language_code", "en"),
                                "audio_duration": result.get("audio_duration", 0),
                                "words": result.get("words", [])
                            }
                        elif status == "error":
                            error_msg = result.get("error", "Unknown error")
                            logger.error(f"❌ Transcription failed: {error_msg}")
                            return None
                        else:
                            # Still processing
                            logger.info(f"⏳ Transcription in progress: {status}")
                            await asyncio.sleep(5)
                            attempt += 1
                    else:
                        logger.error(f"❌ Error polling transcription: {response.status}")
                        return None
            
            except Exception as e:
                logger.error(f"❌ Error polling transcription: {e}")
                return None
        
        logger.error("❌ Transcription timeout")
        return None
    
    async def text_to_speech(self, text: str, language_code: str = "en-US", voice_name: str = None) -> Optional[str]:
        """Convert text to speech using Google Cloud TTS"""
        try:
            # Set default voice based on language
            if not voice_name:
                if language_code.startswith("hi"):
                    voice_name = "hi-IN-Wavenet-A"  # Hindi voice
                else:
                    voice_name = "en-US-Wavenet-D"  # English voice
            
            # Generate unique filename
            audio_filename = f"tts_{uuid.uuid4().hex}.mp3"
            audio_path = os.path.join(self.audio_dir, audio_filename)
            
            if self.tts_client:
                # Use Google Cloud client library
                synthesis_input = texttospeech.SynthesisInput(text=text)
                voice = texttospeech.VoiceSelectionParams(
                    language_code=language_code,
                    name=voice_name
                )
                audio_config = texttospeech.AudioConfig(
                    audio_encoding=texttospeech.AudioEncoding.MP3,
                    speaking_rate=1.0,
                    pitch=0.0
                )
                
                response = self.tts_client.synthesize_speech(
                    input=synthesis_input,
                    voice=voice,
                    audio_config=audio_config
                )
                
                # Save audio file
                async with aiofiles.open(audio_path, 'wb') as f:
                    await f.write(response.audio_content)
                
                logger.info(f"✅ TTS audio generated: {audio_filename}")
                return audio_filename
            
            else:
                # Use REST API with API key
                return await self._tts_rest_api(text, language_code, voice_name, audio_path, audio_filename)
        
        except Exception as e:
            logger.error(f"❌ Error in text-to-speech: {e}")
            return None
    
    async def _tts_rest_api(self, text: str, language_code: str, voice_name: str, audio_path: str, audio_filename: str) -> Optional[str]:
        """Use Google TTS REST API as fallback"""
        try:
            url = f"https://texttospeech.googleapis.com/v1/text:synthesize?key={self.google_api_key}"
            
            payload = {
                "input": {"text": text},
                "voice": {
                    "languageCode": language_code,
                    "name": voice_name
                },
                "audioConfig": {
                    "audioEncoding": "MP3",
                    "speakingRate": 1.0,
                    "pitch": 0.0
                }
            }
            
            async with aiohttp.ClientSession() as session:
                async with session.post(url, json=payload) as response:
                    if response.status == 200:
                        result = await response.json()
                        audio_content = result.get("audioContent")
                        
                        if audio_content:
                            # Decode base64 audio content
                            import base64
                            audio_bytes = base64.b64decode(audio_content)
                            
                            # Save audio file
                            async with aiofiles.open(audio_path, 'wb') as f:
                                await f.write(audio_bytes)
                            
                            logger.info(f"✅ TTS audio generated via REST API: {audio_filename}")
                            return audio_filename
                    else:
                        error_text = await response.text()
                        logger.error(f"❌ Google TTS REST API failed: {response.status} - {error_text}")
                        return None
        
        except Exception as e:
            logger.error(f"❌ Error in TTS REST API: {e}")
            return None
    
    async def process_voice_input(self, audio_file_path: str, language_code: str = "en") -> Dict[str, Any]:
        """Complete voice input processing pipeline"""
        try:
            logger.info(f"🎤 Processing voice input: {audio_file_path}")
            
            # Step 1: Upload audio to AssemblyAI
            upload_url = await self.upload_audio_to_assemblyai(audio_file_path)
            if not upload_url:
                return {"error": "Failed to upload audio file"}
            
            # Step 2: Transcribe audio
            transcription_result = await self.transcribe_audio(upload_url, language_code)
            if not transcription_result:
                return {"error": "Failed to transcribe audio"}
            
            transcript = transcription_result.get("transcript", "")
            confidence = transcription_result.get("confidence", 0)
            
            if not transcript.strip():
                return {"error": "No speech detected in audio"}
            
            logger.info(f"📝 Transcription: {transcript} (confidence: {confidence})")
            
            return {
                "success": True,
                "transcript": transcript,
                "confidence": confidence,
                "language_code": transcription_result.get("language_code", language_code),
                "audio_duration": transcription_result.get("audio_duration", 0)
            }
        
        except Exception as e:
            logger.error(f"❌ Error processing voice input: {e}")
            return {"error": f"Voice processing failed: {str(e)}"}
    
    async def generate_voice_response(self, diagnosis_text: str, language_code: str = "en-US") -> Optional[str]:
        """Generate voice response for diagnosis"""
        try:
            logger.info(f"🔊 Generating voice response for diagnosis")
            
            # Clean up text for better speech synthesis
            clean_text = self._clean_text_for_speech(diagnosis_text)
            
            # Generate audio
            audio_filename = await self.text_to_speech(clean_text, language_code)
            
            if audio_filename:
                logger.info(f"✅ Voice response generated: {audio_filename}")
                return audio_filename
            else:
                logger.error("❌ Failed to generate voice response")
                return None
        
        except Exception as e:
            logger.error(f"❌ Error generating voice response: {e}")
            return None
    
    def _clean_text_for_speech(self, text: str) -> str:
        """Clean text for better speech synthesis"""
        # Remove markdown formatting
        import re
        
        # Remove markdown headers
        text = re.sub(r'#{1,6}\s*', '', text)
        
        # Remove markdown bold/italic
        text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
        text = re.sub(r'\*(.*?)\*', r'\1', text)
        
        # Remove markdown lists
        text = re.sub(r'^\s*[-*+]\s*', '', text, flags=re.MULTILINE)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Add pauses for better speech flow
        text = text.replace('.', '. ')
        text = text.replace(',', ', ')
        text = text.replace(':', ': ')
        
        return text
    
    def get_audio_url(self, audio_filename: str) -> str:
        """Get public URL for audio file"""
        return f"/static/audio/{audio_filename}"
    
    async def cleanup_old_audio_files(self, max_age_hours: int = 24):
        """Clean up old audio files to save storage"""
        try:
            import time
            current_time = time.time()
            max_age_seconds = max_age_hours * 3600
            
            for filename in os.listdir(self.audio_dir):
                file_path = os.path.join(self.audio_dir, filename)
                if os.path.isfile(file_path):
                    file_age = current_time - os.path.getctime(file_path)
                    if file_age > max_age_seconds:
                        os.remove(file_path)
                        logger.info(f"🗑️ Cleaned up old audio file: {filename}")
        
        except Exception as e:
            logger.error(f"❌ Error cleaning up audio files: {e}")

# Global voice service instance
voice_service = VoiceService()