import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/design-system.css';
import './PracticeHistory.css';

function PracticeHistory() {
  const [sessions, setSessions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Debug: Check if token exists
      const token = localStorage.getItem('prepai-auth-token');
      console.log('Auth token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'none');
      
      // Get AI-generated sessions from localStorage
      const aiSessions = JSON.parse(localStorage.getItem('aiPracticeSessions') || '[]');
      console.log('AI sessions from localStorage:', aiSessions.length);
      
      let dbSessions = [];
      let dbAnalytics = null;
      
      // Try to fetch from database if authenticated
      try {
        const [historyRes, analyticsRes] = await Promise.all([
          api.get(`/questions/history?page=${page}&limit=10`),
          api.get('/questions/analytics')
        ]);
        
        dbSessions = historyRes.data.data || [];
        setTotalPages(historyRes.data.pagination.pages);
        dbAnalytics = analyticsRes.data.data;
      } catch (dbError) {
        console.log('Database fetch failed (user might not be logged in):', dbError.response?.status);
        // User not logged in - that's okay, we'll show AI sessions
      }
      
      // Combine database and AI sessions
      const combinedSessions = [...aiSessions, ...dbSessions].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      // Calculate combined analytics
      const totalAISessions = aiSessions.length;
      const totalDBSessions = dbAnalytics?.totalSessions || 0;
      const avgAIScore = aiSessions.length > 0 
        ? aiSessions.reduce((sum, s) => sum + s.score, 0) / aiSessions.length 
        : 0;
      const avgDBScore = dbAnalytics?.averageScore || 0;
      const totalAITime = aiSessions.reduce((sum, s) => sum + (s.timeSpent || 0), 0);
      const totalDBTime = dbAnalytics?.totalTimeSpent || 0;
      
      const combinedAnalytics = {
        totalSessions: totalAISessions + totalDBSessions,
        averageScore: totalAISessions + totalDBSessions > 0
          ? ((avgAIScore * totalAISessions + avgDBScore * totalDBSessions) / (totalAISessions + totalDBSessions)).toFixed(1)
          : 0,
        totalTimeSpent: totalAITime + totalDBTime,
        categoryStats: dbAnalytics?.categoryStats || [],
        recentProgress: dbAnalytics?.recentProgress || [],
        aiSessionsCount: totalAISessions,
        dbSessionsCount: totalDBSessions
      };

      setSessions(combinedSessions.slice(0, 10)); // Show first 10
      setAnalytics(combinedAnalytics);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Fallback to just AI sessions
      const aiSessions = JSON.parse(localStorage.getItem('aiPracticeSessions') || '[]');
      setSessions(aiSessions.slice(0, 10));
      
      const avgScore = aiSessions.length > 0 
        ? aiSessions.reduce((sum, s) => sum + s.score, 0) / aiSessions.length 
        : 0;
      const totalTime = aiSessions.reduce((sum, s) => sum + (s.timeSpent || 0), 0);
      
      setAnalytics({
        totalSessions: aiSessions.length,
        averageScore: avgScore.toFixed(1),
        totalTimeSpent: totalTime,
        categoryStats: [],
        recentProgress: [],
        aiSessionsCount: aiSessions.length,
        dbSessionsCount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    return '#ef4444';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading && !analytics) {
    return (
      <div>
        <Navbar />
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="practice-history-page">
      <Navbar />
      <div className="history-container">
        {/* Header */}
        <motion.div
          className="history-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="history-title">
            📊 Your Progress
          </h1>
          <p className="history-subtitle">
            Track your interview preparation journey
          </p>
        </motion.div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="analytics-grid">
            <motion.div
              className="analytics-card gradient-purple"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="analytics-icon">📝</div>
              <div className="analytics-value">{analytics.totalSessions}</div>
              <div className="analytics-label">Total Practice Sessions</div>
            </motion.div>

            <motion.div
              className="analytics-card gradient-green"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="analytics-icon">⭐</div>
              <div className="analytics-value">{analytics.averageScore}</div>
              <div className="analytics-label">Average Score</div>
            </motion.div>

            <motion.div
              className="analytics-card gradient-orange"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="analytics-icon">⏱️</div>
              <div className="analytics-value">{Math.floor(analytics.totalTimeSpent / 60)}m</div>
              <div className="analytics-label">Total Practice Time</div>
            </motion.div>

            <motion.div
              className="analytics-card gradient-pink"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="analytics-icon">🔥</div>
              <div className="analytics-value">{analytics.recentProgress.length}</div>
              <div className="analytics-label">Days Active (Last 7)</div>
            </motion.div>
          </div>
        )}

        {/* Category Breakdown */}
        {analytics && analytics.categoryStats.length > 0 && (
          <motion.div
            className="category-stats-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="category-stats-title">📊 Performance by Category</h2>
            <div>
              {analytics.categoryStats.map((stat, index) => (
                <div key={index} className="category-stat-item">
                  <div className="category-stat-header">
                    <span className="category-stat-name">{stat._id}</span>
                    <span className="category-stat-meta">
                      {stat.count} questions • Avg: {stat.avgScore.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="category-stat-bar">
                    <div 
                      className="category-stat-fill"
                      style={{
                        width: `${(stat.avgScore / 10) * 100}%`,
                        background: getScoreColor(stat.avgScore)
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Practice History */}
        <motion.div
          className="sessions-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="sessions-title">📝 Recent Practice Sessions</h2>

          {loading ? (
            <LoadingSpinner />
          ) : sessions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <h3 className="empty-state-title">No practice sessions yet</h3>
              <p className="empty-state-text">
                {analytics?.totalSessions === 0 && !loading 
                  ? 'Login and start practicing to track your progress here'
                  : 'Start practicing to see your progress here'}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                <Link to="/signup?mode=login" className="empty-state-btn" style={{ background: 'var(--gradient-primary)' }}>
                  🔐 Login
                </Link>
                <Link to="/questions" className="empty-state-btn">
                  📚 Start Practicing
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="sessions-list">
                {sessions.map((session, index) => (
                  <motion.div
                    key={session._id}
                    className="session-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="session-item-content">
                      <div className="session-item-left">
                        <h3 className="session-item-title">
                          {session.question?.question || 'Question'}
                        </h3>
                        <div className="session-item-badges">
                          {session.isAIGenerated && (
                            <span className="session-badge ai-generated">
                              🤖 AI Generated
                            </span>
                          )}
                          <span className="session-badge category">
                            {session.category}
                          </span>
                          <span className="session-badge difficulty">
                            {session.difficulty}
                          </span>
                          <span className="session-badge time">
                            ⏱️ {formatTime(session.timeSpent)}
                          </span>
                        </div>
                      </div>
                      <div className="session-item-right">
                        <div 
                          className="session-score"
                          style={{ color: getScoreColor(session.score) }}
                        >
                          {session.score}/10
                        </div>
                        <div className="session-date">
                          {formatDate(session.createdAt)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="pagination-btn"
                  >
                    ← Previous
                  </button>
                  <span className="pagination-info">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="pagination-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/questions" className="quick-action-btn primary">
            📚 Browse Questions
          </Link>
          <Link to="/practice-random" className="quick-action-btn success">
            🎲 Random Question
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PracticeHistory;
