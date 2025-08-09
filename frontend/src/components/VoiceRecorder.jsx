import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Stop, PlayArrow, Pause, VolumeUp } from '@mui/icons-material';

const VoiceRecorder = ({ onTranscription, onDiagnosis, language = 'en' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [voiceResponseUrl, setVoiceResponseUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const transcribeAudio = async () => {
    if (!audioBlob) return;
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'recording.webm');
      formData.append('language', language);
      
      const response = await fetch('http://localhost:8000/voice/upload-audio', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setTranscript(result.transcript);
        if (onTranscription) {
          onTranscription(result);
        }
      } else {
        throw new Error(result.detail || 'Transcription failed');
      }
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Failed to transcribe audio: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const diagnoseVoice = async () => {
    if (!audioBlob) return;
    
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'recording.webm');
      formData.append('language', language);
      
      const response = await fetch('http://localhost:8000/voice/diagnose', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        setTranscript(result.transcript);
        setDiagnosis(result.diagnosis);
        setVoiceResponseUrl(result.voice_response_url);
        
        if (onDiagnosis) {
          onDiagnosis(result);
        }
      } else {
        throw new Error(result.detail || 'Voice diagnosis failed');
      }
    } catch (error) {
      console.error('Voice diagnosis error:', error);
      alert('Failed to diagnose: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const playVoiceResponse = () => {
    if (voiceResponseUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const clearRecording = () => {
    setAudioBlob(null);
    setTranscript('');
    setDiagnosis(null);
    setVoiceResponseUrl(null);
    setRecordingTime(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          🎤 Voice Diagnosis Assistant
        </h3>
        <p className="text-gray-600">
          Describe your UPI transaction issue and get instant AI diagnosis
        </p>
      </div>

      {/* Recording Controls */}
      <div className="flex justify-center items-center space-x-4 mb-6">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isProcessing}
            className="bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
          >
            <Mic sx={{ fontSize: 32 }} />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 animate-pulse"
          >
            <Stop sx={{ fontSize: 32 }} />
          </button>
        )}
        
        {audioBlob && (
          <button
            onClick={clearRecording}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Clear
          </button>
        )}
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="text-center mb-4">
          <div className="text-red-500 font-semibold">
            🔴 Recording... {formatTime(recordingTime)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Speak clearly about your transaction issue
          </div>
        </div>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <div className="text-center mb-4">
          <div className="inline-flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Processing audio...</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {audioBlob && !isProcessing && (
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={transcribeAudio}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            📝 Transcribe Only
          </button>
          <button
            onClick={diagnoseVoice}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            🔍 Full Diagnosis
          </button>
        </div>
      )}

      {/* Transcript Display */}
      {transcript && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">📝 Transcript:</h4>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="text-gray-700">{transcript}</p>
          </div>
        </div>
      )}

      {/* Diagnosis Display */}
      {diagnosis && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">🔍 AI Diagnosis:</h4>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="mb-3">
              <span className="font-medium text-blue-800">Issue:</span>
              <p className="text-blue-700 mt-1">{diagnosis.diagnosis}</p>
            </div>
            <div className="mb-3">
              <span className="font-medium text-blue-800">Recommendation:</span>
              <p className="text-blue-700 mt-1">{diagnosis.recommendation}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600">
                Confidence: {Math.round(diagnosis.confidence * 100)}%
              </span>
              <span className="text-sm text-blue-600">
                Severity: {diagnosis.severity}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Voice Response Player */}
      {voiceResponseUrl && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">🔊 Voice Response:</h4>
          <div className="flex items-center space-x-4 bg-green-50 p-4 rounded-lg border border-green-200">
            <button
              onClick={playVoiceResponse}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </button>
            <span className="text-green-700">
              {isPlaying ? 'Playing diagnosis...' : 'Click to hear diagnosis'}
            </span>
            <VolumeUp className="text-green-600" />
          </div>
          <audio
            ref={audioRef}
            src={`http://localhost:8000${voiceResponseUrl}`}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
          />
        </div>
      )}

      {/* Language Selection */}
      <div className="text-center">
        <label className="text-sm text-gray-600">
          Language: 
          <select 
            value={language} 
            onChange={(e) => {/* Handle language change */}}
            className="ml-2 border rounded px-2 py-1"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default VoiceRecorder;