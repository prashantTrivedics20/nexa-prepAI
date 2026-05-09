import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { isAuthenticated } from '../services/auth';
import './VoiceAIAssistant.css';

function VoiceAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [error, setError] = useState('');
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [mode, setMode] = useState('communication-practice');
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const conversationEndRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);

        // If final result, send to AI automatically
        if (event.results[current].isFinal) {
          setIsListening(false);
          handleSendMessage(transcriptText);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition not supported in this browser. Please use Chrome or Edge.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not available');
      return;
    }

    // Stop any ongoing speech first
    if (synthRef.current && synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }

    setError('');
    setTranscript('');
    setIsListening(true);
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error('Error starting recognition:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) {
      // If empty message, restart listening
      setTimeout(() => {
        if (!isSpeaking) {
          startListening();
        }
      }, 500);
      return;
    }

    if (!isAuthenticated()) {
      setError('Please login to use Voice AI Assistant');
      speakText('Please login to continue using the voice assistant');
      return;
    }

    const userMessage = { role: 'user', content: message };
    setConversationHistory(prev => [...prev, userMessage]);
    setTranscript('');

    try {
      const response = await API.post('/voice/chat', {
        sessionId: sessionId,
        message: message,
        mode: mode
      });

      const data = response.data?.data;
      const aiMessage = { role: 'assistant', content: data.aiResponse };
      
      setConversationHistory(prev => [...prev, aiMessage]);
      setCurrentAnalysis(data.analysis);

      // Show analysis if there are grammar errors or suggestions
      if (data.analysis?.grammar?.hasErrors || data.analysis?.communication?.suggestions?.length > 0) {
        setShowAnalysis(true);
      }

      // Automatically speak the response
      speakText(data.aiResponse);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMsg = error.response?.data?.message || 'Sorry, I encountered an error. Please try again.';
      setError(errorMsg);
      
      if (error.response?.status === 401) {
        speakText('Please login to continue using the voice assistant');
      } else {
        speakText(errorMsg);
      }
    }
  };

  const speakText = (text) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    
    utterance.onend = () => {
      setIsSpeaking(false);
      // After AI finishes speaking, automatically start listening again
      setTimeout(() => {
        if (!isListening && isOpen) {
          startListening();
        }
      }, 500);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      // Even on error, restart listening
      setTimeout(() => {
        if (!isListening && isOpen) {
          startListening();
        }
      }, 500);
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const clearConversation = async () => {
    try {
      if (isAuthenticated()) {
        await API.post('/voice/end', { sessionId });
      }
    } catch (error) {
      console.error('Error ending conversation:', error);
    }
    
    setConversationHistory([]);
    setTranscript('');
    setError('');
    setCurrentAnalysis(null);
    setShowAnalysis(false);
    stopSpeaking();
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationHistory]);

  // Auto-start conversation when panel opens for the first time
  useEffect(() => {
    if (isOpen && conversationHistory.length === 0 && !isListening && !isSpeaking) {
      // Wait a bit for panel animation, then start listening
      const timer = setTimeout(() => {
        startListening();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getModeDescription = () => {
    const descriptions = {
      'general': 'General conversation and questions',
      'communication-practice': 'Practice communication with feedback',
      'interview-practice': 'Mock interview practice',
      'grammar-focus': 'Focus on grammar improvement'
    };
    return descriptions[mode] || descriptions['general'];
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className={`voice-ai-fab ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Voice AI Assistant"
      >
        {isListening ? (
          <span className="voice-ai-icon listening">🎤</span>
        ) : isSpeaking ? (
          <span className="voice-ai-icon speaking">🔊</span>
        ) : (
          <span className="voice-ai-icon">🎙️</span>
        )}
      </motion.button>

      {/* Voice Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="voice-ai-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="voice-ai-header">
              <div className="voice-ai-title">
                <span className="voice-ai-avatar">🤖</span>
                <div>
                  <h3>Voice AI Assistant</h3>
                  <p className="voice-ai-subtitle">
                    {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready to help'}
                  </p>
                </div>
              </div>
              <button
                className="voice-ai-close"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Conversation History */}
            <div className="voice-ai-conversation">
              {conversationHistory.length === 0 ? (
                <div className="voice-ai-empty">
                  <span className="voice-ai-empty-icon">
                    {isListening ? '🎤' : isSpeaking ? '🔊' : '🤖'}
                  </span>
                  <p>
                    {isListening 
                      ? 'Listening... Speak now!' 
                      : isSpeaking 
                      ? 'AI is speaking...' 
                      : 'Starting conversation...'}
                  </p>
                  <p className="voice-ai-hint">
                    Practice English, communication skills, or interview questions!
                  </p>
                </div>
              ) : (
                <>
                  {conversationHistory.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`voice-ai-message ${msg.role}`}
                    >
                      <div className="voice-ai-message-avatar">
                        {msg.role === 'user' ? '👤' : '🤖'}
                      </div>
                      <div className="voice-ai-message-content">
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  <div ref={conversationEndRef} />
                </>
              )}

              {/* Current Transcript */}
              {transcript && (
                <div className="voice-ai-message user interim">
                  <div className="voice-ai-message-avatar">👤</div>
                  <div className="voice-ai-message-content">
                    {transcript}
                    <span className="voice-ai-typing">...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="voice-ai-error">
                ⚠️ {error}
              </div>
            )}

            {/* Controls */}
            <div className="voice-ai-controls">
              {isListening ? (
                <button
                  className="voice-ai-btn danger"
                  onClick={stopListening}
                >
                  <span className="voice-ai-btn-icon">⏹️</span>
                  Stop Listening
                </button>
              ) : isSpeaking ? (
                <button
                  className="voice-ai-btn secondary"
                  onClick={stopSpeaking}
                >
                  <span className="voice-ai-btn-icon">🔇</span>
                  Stop AI Speaking
                </button>
              ) : (
                <button
                  className="voice-ai-btn primary"
                  onClick={startListening}
                >
                  <span className="voice-ai-btn-icon">🎤</span>
                  Start Speaking
                </button>
              )}

              {conversationHistory.length > 0 && !isListening && !isSpeaking && (
                <button
                  className="voice-ai-btn secondary"
                  onClick={clearConversation}
                >
                  <span className="voice-ai-btn-icon">🗑️</span>
                  New Conversation
                </button>
              )}
            </div>

            {/* Status Bar */}
            <div className="voice-ai-status">
              {isListening && (
                <div className="voice-ai-status-item listening">
                  <span className="voice-ai-pulse"></span>
                  Listening... Speak now
                </div>
              )}
              {isSpeaking && (
                <div className="voice-ai-status-item speaking">
                  <span className="voice-ai-pulse"></span>
                  AI is speaking...
                </div>
              )}
              {!isListening && !isSpeaking && conversationHistory.length > 0 && (
                <div className="voice-ai-status-item ready">
                  ✓ Ready - Will start listening automatically
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="voice-ai-tips">
              <p><strong>💡 Tips:</strong></p>
              <ul>
                <li>Speak clearly and naturally</li>
                <li>Practice English conversation</li>
                <li>Ask for interview tips</li>
                <li>Get help with coding questions</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default VoiceAIAssistant;
