import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/design-system.css';
import './PracticePage.css';

function PracticePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [startTime] = useState(Date.now());
  const [showSample, setShowSample] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/questions/${id}`);
      setQuestion(response.data.data);
    } catch (error) {
      console.error('Failed to fetch question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert('Please provide an answer');
      return;
    }

    try {
      setSubmitting(true);
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      const response = await api.post('/questions/submit', {
        questionId: id,
        answer,
        timeSpent
      });

      setResult(response.data.data);
    } catch (error) {
      console.error('Failed to submit answer:', error);
      alert('Failed to submit answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAskAI = async () => {
    if (!aiMessage.trim()) {
      alert('Please type your question');
      return;
    }

    try {
      setAiLoading(true);
      const response = await api.post('/questions/chat', {
        questionId: id,
        message: aiMessage
      });

      setAiResponse(response.data.data);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      alert('Failed to get AI response. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="practice-page">
        <Navbar />
        <div className="practice-container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="practice-page">
        <Navbar />
        <div className="practice-container">
          <h2>Question not found</h2>
          <button onClick={() => navigate('/questions')} className="btn-action btn-secondary">
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="practice-page">
      <Navbar />
      <div className="practice-container">
        {!result ? (
          /* Question View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Header */}
            <div className="question-header">
              <button
                onClick={() => navigate('/questions')}
                className="back-button"
              >
                ← Back to Questions
              </button>

              <div className="question-badges">
                <span className="badge badge-category">
                  {question.category}
                </span>
                <span 
                  className="badge"
                  style={{
                    background: getDifficultyColor(question.difficulty) + '20',
                    color: getDifficultyColor(question.difficulty)
                  }}
                >
                  {question.difficulty}
                </span>
                <span className="badge">
                  🏢 {question.company}
                </span>
              </div>

              <h1 className="question-title">
                {question.question}
              </h1>

              {question.tags && question.tags.length > 0 && (
                <div className="question-tags">
                  {question.tags.map((tag, i) => (
                    <span key={i} className="question-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Answer Input */}
            <div className="answer-section">
              <label className="answer-label">
                Your Answer
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here... Be specific and provide examples where possible."
                className="answer-textarea"
              />
              <div className="answer-tip">
                💡 Tip: Use the STAR method for behavioral questions (Situation, Task, Action, Result)
              </div>
            </div>

            {/* Actions */}
            <div className="action-buttons">
              <div className="action-group">
                <button
                  onClick={() => setShowSample(!showSample)}
                  className="btn-action btn-secondary"
                >
                  {showSample ? '🙈 Hide' : '👁️ Show'} Sample Answer
                </button>
                <button
                  onClick={() => setShowAIChat(!showAIChat)}
                  className="btn-action btn-ai"
                >
                  {showAIChat ? '❌ Close' : '🤖 Ask AI'}
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting || !answer.trim()}
                className="btn-action btn-submit"
              >
                {submitting ? '⏳ Evaluating...' : '✅ Submit Answer'}
              </button>
            </div>

            {/* AI Chat Box */}
            {showAIChat && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="ai-chat-box"
              >
                <h3 className="ai-chat-title">
                  🤖 Ask AI for Help
                </h3>
                <p className="ai-chat-description">
                  Need help understanding the question or structuring your answer? Ask AI!
                </p>
                <div className="ai-input-group">
                  <input
                    type="text"
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                    placeholder="e.g., How should I structure my answer? What are key points to cover?"
                    className="ai-input"
                  />
                  <button
                    onClick={handleAskAI}
                    disabled={aiLoading || !aiMessage.trim()}
                    className="ai-send-btn"
                  >
                    {aiLoading ? '⏳' : '📤'} Send
                  </button>
                </div>

                {/* AI Response */}
                {aiResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ai-response"
                  >
                    <div className="ai-response-header">
                      <span>🤖</span>
                      <span>AI Response</span>
                    </div>
                    <div className="ai-response-text">
                      {aiResponse.response}
                    </div>
                    <div className="ai-response-footer">
                      💡 This is AI-generated guidance. Use it as a reference to build your own answer.
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Sample Answer */}
            {showSample && question.sampleAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="sample-answer-box"
              >
                <h3 className="sample-answer-title">
                  📝 Sample Answer
                </h3>
                <p className="sample-answer-text">
                  {question.sampleAnswer}
                </p>
                {question.tips && question.tips.length > 0 && (
                  <div className="sample-tips">
                    <h4 className="sample-tips-title">
                      💡 Tips:
                    </h4>
                    <ul className="sample-tips-list">
                      {question.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* Result View */
          <motion.div
            className="result-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Score Card */}
            <div className="score-card">
              <div className="score-emoji">
                {result.score >= 8 ? '🎉' : result.score >= 6 ? '👍' : '💪'}
              </div>
              <h2 className="score-heading">
                Your Score
              </h2>
              <div 
                className="score-value"
                style={{ color: getScoreColor(result.score) }}
              >
                {result.score}/10
              </div>
              <p className="score-message">
                {result.score >= 8 ? 'Excellent work!' : result.score >= 6 ? 'Good job! Keep practicing.' : 'Keep learning and improving!'}
              </p>
            </div>

            {/* Feedback */}
            {result.feedback && (
              <div className="feedback-card">
                <h3 className="feedback-title">
                  📊 Detailed Feedback
                </h3>

                {result.feedback.strengths && result.feedback.strengths.length > 0 && (
                  <div className="feedback-section">
                    <h4 className="feedback-section-title" style={{ color: '#10b981' }}>
                      ✅ Strengths
                    </h4>
                    <ul className="feedback-list">
                      {result.feedback.strengths.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.feedback.improvements && result.feedback.improvements.length > 0 && (
                  <div className="feedback-section">
                    <h4 className="feedback-section-title" style={{ color: '#f59e0b' }}>
                      📈 Areas for Improvement
                    </h4>
                    <ul className="feedback-list">
                      {result.feedback.improvements.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.feedback.suggestions && result.feedback.suggestions.length > 0 && (
                  <div className="feedback-section">
                    <h4 className="feedback-section-title" style={{ color: '#667eea' }}>
                      💡 Suggestions
                    </h4>
                    <ul className="feedback-list">
                      {result.feedback.suggestions.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Sample Answer */}
            {result.sampleAnswer && (
              <div className="sample-answer-box">
                <h3 className="sample-answer-title">
                  📝 Sample Answer
                </h3>
                <p className="sample-answer-text">
                  {result.sampleAnswer}
                </p>
                {result.tips && result.tips.length > 0 && (
                  <div className="sample-tips">
                    <h4 className="sample-tips-title">
                      💡 Tips:
                    </h4>
                    <ul className="sample-tips-list">
                      {result.tips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="result-actions">
              <button
                onClick={() => navigate('/questions')}
                className="result-btn result-btn-secondary"
              >
                📚 Back to Questions
              </button>
              <button
                onClick={() => navigate('/practice-random')}
                className="result-btn result-btn-primary"
              >
                🎲 Try Another Question
              </button>
              <button
                onClick={() => navigate('/practice-history')}
                className="result-btn result-btn-success"
              >
                📊 View Progress
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default PracticePage;
