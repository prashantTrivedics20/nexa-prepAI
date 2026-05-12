import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { isAuthenticated } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import './AIMockInterviewer.css';

function AIMockInterviewer() {
  const navigate = useNavigate();
  const [step, setStep] = useState('setup'); // setup, interview, report
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Setup form
  const [role, setRole] = useState('');
  const [interviewerStyle, setInterviewerStyle] = useState('professional');
  const [difficulty, setDifficulty] = useState('medium');

  // Interview state
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  // Report state
  const [report, setReport] = useState(null);

  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const conversationEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/signup');
    }
  }, [navigate]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Enable continuous listening
      recognitionRef.current.interimResults = true; // Show interim results
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      let finalTranscript = '';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Update input with final + interim results
        setUserInput(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          setError('No speech detected. Please try again.');
        } else if (event.error === 'aborted') {
          // Silently handle abort
          finalTranscript = '';
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        finalTranscript = ''; // Reset for next time
      };
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

  // Auto-scroll to bottom
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  // Text-to-speech function
  const speak = (text) => {
    if (!voiceEnabled || !autoSpeak) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Get available voices and prefer a natural-sounding one
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  // Toggle voice listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    synthRef.current.cancel();
    setIsSpeaking(false);
  };

  // Start interview
  const startInterview = async () => {
    if (!role.trim()) {
      setError('Please enter a role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await API.post('/mock-interviewer/start', {
        role,
        interviewerStyle,
        difficulty
      });

      if (response.data.success) {
        setSessionId(response.data.sessionId);
        setConversation([{
          role: 'interviewer',
          message: response.data.interviewerMessage,
          timestamp: new Date()
        }]);
        setStep('interview');
      }
    } catch (err) {
      console.error('Start interview error:', err);
      setError(err.response?.data?.message || 'Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!userInput.trim() || isTyping) return;

    const message = userInput.trim();
    setUserInput('');

    // Add user message to conversation
    setConversation(prev => [...prev, {
      role: 'candidate',
      message,
      timestamp: new Date()
    }]);

    setIsTyping(true);

    try {
      const response = await API.post('/mock-interviewer/continue', {
        sessionId,
        message
      });

      if (response.data.success) {
        // Add interviewer response
        setConversation(prev => [...prev, {
          role: 'interviewer',
          message: response.data.interviewerMessage,
          timestamp: new Date()
        }]);

        setCurrentAnalysis(response.data.analysis);

        // Speak the interviewer's response
        if (voiceEnabled && autoSpeak) {
          speak(response.data.interviewerMessage);
        }

        // Check if interview should end
        if (!response.data.shouldContinue) {
          setTimeout(() => {
            endInterview();
          }, 2000);
        }
      }
    } catch (err) {
      console.error('Send message error:', err);
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setIsTyping(false);
    }
  };

  // End interview
  const endInterview = async () => {
    setLoading(true);

    try {
      const response = await API.post('/mock-interviewer/end', {
        sessionId
      });

      if (response.data.success) {
        setReport(response.data);
        setStep('report');
      }
    } catch (err) {
      console.error('End interview error:', err);
      setError(err.response?.data?.message || 'Failed to end interview');
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const interviewerStyles = [
    { value: 'friendly', label: '😊 Friendly', desc: 'Warm and encouraging' },
    { value: 'professional', label: '💼 Professional', desc: 'Polite and formal' },
    { value: 'technical', label: '🔧 Technical', desc: 'Deep technical focus' },
    { value: 'tough', label: '💪 Tough', desc: 'Challenging questions' },
    { value: 'casual', label: '😎 Casual', desc: 'Relaxed and conversational' }
  ];

  return (
    <div className="ai-mock-interviewer">
      {/* Setup Step */}
      {step === 'setup' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="setup-container"
        >
          <button 
            className="back-btn-top"
            onClick={() => navigate('/')}
            title="Go Back"
          >
            ← Back to Home
          </button>
          <div className="setup-header">
            <h1>🎭 AI Mock Interviewer</h1>
            <p>Practice with a realistic AI interviewer that adapts to your answers</p>
          </div>

          <div className="setup-form">
            <div className="form-group">
              <label>Target Role *</label>
              <input
                type="text"
                placeholder="e.g., Frontend Developer, Data Scientist"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Interviewer Style</label>
              <div className="style-grid">
                {interviewerStyles.map(style => (
                  <div
                    key={style.value}
                    className={`style-card ${interviewerStyle === style.value ? 'active' : ''}`}
                    onClick={() => setInterviewerStyle(style.value)}
                  >
                    <div className="style-label">{style.label}</div>
                    <div className="style-desc">{style.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Difficulty Level</label>
              <div className="difficulty-buttons">
                {['easy', 'medium', 'hard'].map(level => (
                  <button
                    key={level}
                    className={`difficulty-btn ${difficulty === level ? 'active' : ''}`}
                    onClick={() => setDifficulty(level)}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="error-message">⚠️ {error}</div>}

            <button
              className="start-btn"
              onClick={startInterview}
              disabled={loading}
            >
              {loading ? 'Starting Interview...' : '🚀 Start Mock Interview'}
            </button>
          </div>

          <div className="setup-tips">
            <h3>💡 Tips for Success:</h3>
            <ul>
              <li>Find a quiet place</li>
              <li>Treat it like a real interview</li>
              <li>Take your time to think</li>
              <li>Use the STAR method for behavioral questions</li>
              <li>Ask for clarification if needed</li>
            </ul>
            <div className="voice-feature-notice">
              <strong>🎤 Voice Feature Available!</strong>
              <p>Enable voice mode during the interview to speak your answers and hear the interviewer's questions.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Interview Step */}
      {step === 'interview' && (
        <div className="interview-container">
          <div className="interview-header">
            <div className="interview-info">
              <button 
                className="back-btn"
                onClick={() => navigate('/')}
                title="Go Back"
              >
                ← Back
              </button>
              <h2>🎭 Mock Interview</h2>
              <span className="interview-role">{role}</span>
              <span className={`interview-style ${interviewerStyle}`}>
                {interviewerStyles.find(s => s.value === interviewerStyle)?.label}
              </span>
            </div>
            <div className="interview-controls">
              <button 
                className={`voice-toggle-btn ${voiceEnabled ? 'active' : ''}`}
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                title={voiceEnabled ? 'Disable Voice' : 'Enable Voice'}
              >
                {voiceEnabled ? '🔊' : '🔇'}
              </button>
              {voiceEnabled && (
                <button 
                  className={`auto-speak-btn ${autoSpeak ? 'active' : ''}`}
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  title={autoSpeak ? 'Disable Auto-Speak' : 'Enable Auto-Speak'}
                >
                  {autoSpeak ? '🤖' : '⏸️'}
                </button>
              )}
              <button className="end-btn" onClick={endInterview} disabled={loading}>
                End Interview
              </button>
            </div>
          </div>

          <div className="conversation-area">
            {conversation.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`message ${msg.role}`}
              >
                <div className="message-avatar">
                  {msg.role === 'interviewer' ? '🎭' : '👤'}
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-sender">
                      {msg.role === 'interviewer' ? 'Interviewer' : 'You'}
                    </span>
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="message-text">{msg.message}</div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="message interviewer typing">
                <div className="message-avatar">🎭</div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={conversationEndRef} />
          </div>

          {/* Real-time Analysis - Compact Version */}
          {currentAnalysis && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="live-analysis-compact"
            >
              <div className="analysis-header">
                <h4>📊 Live Feedback</h4>
                <button 
                  className="collapse-btn"
                  onClick={() => setCurrentAnalysis(null)}
                  title="Hide Feedback"
                >
                  ✕
                </button>
              </div>
              <div className="analysis-scores-compact">
                <div className="score-badge">
                  <span className="score-label">Clarity</span>
                  <span className="score-value">{currentAnalysis.clarity}/10</span>
                </div>
                <div className="score-badge">
                  <span className="score-label">Relevance</span>
                  <span className="score-value">{currentAnalysis.relevance}/10</span>
                </div>
                <div className="score-badge">
                  <span className="score-label">Complete</span>
                  <span className="score-value">{currentAnalysis.completeness}/10</span>
                </div>
              </div>
              {currentAnalysis.suggestions && currentAnalysis.suggestions.length > 0 && (
                <details className="suggestions-details">
                  <summary>💡 View Suggestions ({currentAnalysis.suggestions.length})</summary>
                  <ul>
                    {currentAnalysis.suggestions.map((suggestion, idx) => (
                      <li key={idx}>{suggestion}</li>
                    ))}
                  </ul>
                </details>
              )}
            </motion.div>
          )}

          <div className="input-area">
            {voiceEnabled && (
              <div className="voice-controls">
                <button
                  className={`voice-btn ${isListening ? 'listening' : ''}`}
                  onClick={toggleListening}
                  disabled={isTyping || loading}
                  title={isListening ? 'Stop Listening' : 'Start Voice Input'}
                >
                  {isListening ? (
                    <>
                      <span className="pulse-ring"></span>
                      🎤 Listening...
                    </>
                  ) : (
                    '🎤 Speak'
                  )}
                </button>
                {isSpeaking && (
                  <button
                    className="stop-speak-btn"
                    onClick={stopSpeaking}
                    title="Stop Speaking"
                  >
                    ⏹️ Stop
                  </button>
                )}
                {userInput && !isListening && (
                  <button
                    className="clear-btn"
                    onClick={() => setUserInput('')}
                    title="Clear Text"
                  >
                    🗑️ Clear
                  </button>
                )}
              </div>
            )}
            <div className="input-area-content">
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={voiceEnabled ? (isListening ? "Listening... speak now" : "Type or click 'Speak' to use voice...") : "Type your answer here... (Press Enter to send)"}
                disabled={isTyping || loading}
                rows={3}
              />
              <button
                className="send-btn"
                onClick={sendMessage}
                disabled={!userInput.trim() || isTyping || loading || isListening}
              >
                {isTyping ? 'AI is thinking...' : '📤 Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Step */}
      {step === 'report' && report && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="report-container"
        >
          <button 
            className="back-btn-top"
            onClick={() => navigate('/')}
            title="Go Back"
          >
            ← Back to Home
          </button>
          <div className="report-header">
            <h1>📊 Interview Report</h1>
            <p>Here's your detailed performance analysis</p>
          </div>

          <div className="report-scores">
            <div className="score-card main">
              <div className="score-value">{report.performance.overallScore}</div>
              <div className="score-label">Overall Score</div>
            </div>
            <div className="score-card">
              <div className="score-value">{report.performance.communicationScore}</div>
              <div className="score-label">Communication</div>
            </div>
            <div className="score-card">
              <div className="score-value">{report.performance.technicalScore}</div>
              <div className="score-label">Technical</div>
            </div>
            <div className="score-card">
              <div className="score-value">{report.performance.problemSolvingScore}</div>
              <div className="score-label">Problem Solving</div>
            </div>
          </div>

          <div className="report-section">
            <h2>📝 Summary</h2>
            <p>{report.feedback.summary}</p>
          </div>

          <div className="report-section">
            <h2>🔍 Detailed Analysis</h2>
            <p>{report.feedback.detailedAnalysis}</p>
          </div>

          <div className="report-grid">
            <div className="report-section">
              <h2>💪 Strengths</h2>
              <ul>
                {report.performance.strengths.map((strength, idx) => (
                  <li key={idx}>✅ {strength}</li>
                ))}
              </ul>
            </div>

            <div className="report-section">
              <h2>📈 Areas to Improve</h2>
              <ul>
                {report.performance.weaknesses.map((weakness, idx) => (
                  <li key={idx}>⚠️ {weakness}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="report-section">
            <h2>💡 Recommendations</h2>
            <ul>
              {report.feedback.recommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="report-section">
            <h2>🎯 Next Steps</h2>
            <ul>
              {report.feedback.nextSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="report-readiness">
            <h3>Interview Readiness</h3>
            <div className={`readiness-badge ${report.feedback.estimatedReadiness}`}>
              {report.feedback.estimatedReadiness.split('-').join(' ').toUpperCase()}
            </div>
          </div>

          <div className="report-actions">
            <button className="action-btn primary" onClick={() => window.location.reload()}>
              🔄 Start New Interview
            </button>
            <button className="action-btn secondary" onClick={() => navigate('/practice-history')}>
              📊 View History
            </button>
            <button className="action-btn secondary">
              📥 Download Report
            </button>
          </div>
        </motion.div>
      )}

      {loading && step !== 'interview' && (
        <div className="loading-overlay">
          <LoadingSpinner />
          <p>Processing...</p>
        </div>
      )}
    </div>
  );
}

export default AIMockInterviewer;
