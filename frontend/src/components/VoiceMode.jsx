import React, { useState, useEffect } from 'react';
import { Mic, MicOff, VolumeUp, VolumeOff, Settings, Help } from '@mui/icons-material';
import VoiceRecorder from './VoiceRecorder';

const VoiceMode = () => {
  const [isVoiceModeEnabled, setIsVoiceModeEnabled] = useState(false);
  const [language, setLanguage] = useState('en');
  const [voiceSettings, setVoiceSettings] = useState({
    autoPlay: true,
    speechRate: 1.0,
    volume: 0.8
  });
  const [supportedLanguages, setSupportedLanguages] = useState([]);
  const [recentDiagnoses, setRecentDiagnoses] = useState([]);

  useEffect(() => {
    fetchSupportedLanguages();
    loadVoiceSettings();
  }, []);

  const fetchSupportedLanguages = async () => {
    try {
      const response = await fetch('http://localhost:8000/voice/supported-languages');
      const data = await response.json();
      setSupportedLanguages(data);
    } catch (error) {
      console.error('Failed to fetch supported languages:', error);
    }
  };

  const loadVoiceSettings = () => {
    const saved = localStorage.getItem('voiceSettings');
    if (saved) {
      setVoiceSettings(JSON.parse(saved));
    }
  };

  const saveVoiceSettings = (newSettings) => {
    setVoiceSettings(newSettings);
    localStorage.setItem('voiceSettings', JSON.stringify(newSettings));
  };

  const handleDiagnosis = (result) => {
    const newDiagnosis = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      transcript: result.transcript,
      diagnosis: result.diagnosis,
      confidence: result.confidence
    };
    
    setRecentDiagnoses(prev => [newDiagnosis, ...prev.slice(0, 4)]);
  };

  const toggleVoiceMode = () => {
    setIsVoiceModeEnabled(!isVoiceModeEnabled);
  };

  const testTextToSpeech = async () => {
    try {
      const formData = new FormData();
      formData.append('text', 'Voice mode is working correctly. You can now use voice commands for UPI diagnosis.');
      formData.append('language', language === 'hi' ? 'hi-IN' : 'en-US');
      
      const response = await fetch('http://localhost:8000/voice/text-to-speech', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        const audio = new Audio(`http://localhost:8000${result.audio_url}`);
        audio.volume = voiceSettings.volume;
        audio.play();
      }
    } catch (error) {
      console.error('TTS test failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                🎤 Voice Diagnosis Mode
              </h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleVoiceMode}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isVoiceModeEnabled 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {isVoiceModeEnabled ? <Mic /> : <MicOff />}
                  <span>{isVoiceModeEnabled ? 'Voice ON' : 'Voice OFF'}</span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="en">🇺🇸 English</option>
                <option value="hi">🇮🇳 हिंदी</option>
              </select>
              
              {/* Settings Button */}
              <button
                onClick={() => {/* Open settings modal */}}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Voice Interface */}
          <div className="lg:col-span-2">
            {isVoiceModeEnabled ? (
              <VoiceRecorder
                onDiagnosis={handleDiagnosis}
                language={language}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                  <MicOff sx={{ fontSize: 64 }} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Voice Mode Disabled
                  </h3>
                  <p className="text-gray-600">
                    Enable voice mode to start using speech-to-text diagnosis
                  </p>
                </div>
                
                <button
                  onClick={toggleVoiceMode}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Enable Voice Mode
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Voice Settings */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Settings className="mr-2" />
                Voice Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volume
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={voiceSettings.volume}
                    onChange={(e) => saveVoiceSettings({
                      ...voiceSettings,
                      volume: parseFloat(e.target.value)
                    })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Quiet</span>
                    <span>Loud</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speech Rate
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={voiceSettings.speechRate}
                    onChange={(e) => saveVoiceSettings({
                      ...voiceSettings,
                      speechRate: parseFloat(e.target.value)
                    })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Slow</span>
                    <span>Fast</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Auto-play responses
                  </label>
                  <button
                    onClick={() => saveVoiceSettings({
                      ...voiceSettings,
                      autoPlay: !voiceSettings.autoPlay
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      voiceSettings.autoPlay ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        voiceSettings.autoPlay ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <button
                  onClick={testTextToSpeech}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <VolumeUp />
                  <span>Test Voice</span>
                </button>
              </div>
            </div>

            {/* Recent Diagnoses */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📋 Recent Voice Diagnoses
              </h3>
              
              {recentDiagnoses.length > 0 ? (
                <div className="space-y-3">
                  {recentDiagnoses.map((diagnosis) => (
                    <div key={diagnosis.id} className="border-l-4 border-orange-500 pl-3 py-2">
                      <div className="text-sm text-gray-600 mb-1">
                        {new Date(diagnosis.timestamp).toLocaleTimeString()}
                      </div>
                      <div className="text-sm font-medium text-gray-800 mb-1">
                        "{diagnosis.transcript.substring(0, 50)}..."
                      </div>
                      <div className="text-xs text-green-600">
                        Confidence: {Math.round(diagnosis.confidence * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  No voice diagnoses yet. Start recording to see your history here.
                </p>
              )}
            </div>

            {/* Help & Tips */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Help className="mr-2" />
                Voice Tips
              </h3>
              
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="text-orange-500">•</span>
                  <span>Speak clearly and at normal pace</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-orange-500">•</span>
                  <span>Mention transaction amount and failure reason</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-orange-500">•</span>
                  <span>Use quiet environment for better recognition</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-orange-500">•</span>
                  <span>Try both English and Hindi languages</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceMode;