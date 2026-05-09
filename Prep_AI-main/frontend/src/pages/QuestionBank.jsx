import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/design-system.css';
import './QuestionBank.css';

function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    company: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Technical', 'Behavioral', 'HR', 'System Design', 'Coding', 'Situational'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const companies = ['General', 'Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple'];

  useEffect(() => {
    fetchQuestions();
  }, [filters, page]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });

      const response = await api.get(`/questions?${params}`);
      setQuestions(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: '', difficulty: '', company: '' });
    setSearchQuery('');
    setPage(1);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'var(--color-success)';
      case 'Medium': return 'var(--color-warning)';
      case 'Hard': return 'var(--color-error)';
      default: return 'var(--text-tertiary)';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Technical': '💻',
      'Behavioral': '🗣️',
      'HR': '👔',
      'System Design': '🏗️',
      'Coding': '⚡',
      'Situational': '🎯'
    };
    return icons[category] || '📝';
  };

  const filteredQuestions = questions.filter(q =>
    q.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="question-bank-page">
      <Navbar />
      
      {/* Hero Header */}
      <section className="qb-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="qb-hero-content"
          >
            <h1 className="qb-title">
              Interview Question Bank
            </h1>
            <p className="qb-subtitle">
              Practice with {questions.length}+ curated interview questions from top companies
            </p>

            {/* Search Bar */}
            <div className="qb-search">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Quick Actions */}
            <div className="qb-actions">
              <Link to="/practice-random" className="qb-action-btn primary">
                <span>🎲</span>
                Random Question
              </Link>
              <Link to="/practice-history" className="qb-action-btn secondary">
                <span>📊</span>
                My Progress
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="qb-filters-section">
        <div className="container">
          <div className="qb-filters-card">
            <div className="filters-header">
              <h3 className="filters-title">Filters</h3>
              <button onClick={clearFilters} className="clear-btn">
                Clear All
              </button>
            </div>

            <div className="filters-grid">
              {/* Category Filter */}
              <div className="filter-group">
                <label className="filter-label">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div className="filter-group">
                <label className="filter-label">Difficulty</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Difficulties</option>
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>

              {/* Company Filter */}
              <div className="filter-group">
                <label className="filter-label">Company</label>
                <select
                  value={filters.company}
                  onChange={(e) => handleFilterChange('company', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Companies</option>
                  {companies.map(comp => (
                    <option key={comp} value={comp}>{comp}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.category || filters.difficulty || filters.company) && (
              <div className="active-filters">
                {filters.category && (
                  <span className="filter-tag">
                    {filters.category}
                    <button onClick={() => handleFilterChange('category', '')}>×</button>
                  </span>
                )}
                {filters.difficulty && (
                  <span className="filter-tag">
                    {filters.difficulty}
                    <button onClick={() => handleFilterChange('difficulty', '')}>×</button>
                  </span>
                )}
                {filters.company && (
                  <span className="filter-tag">
                    {filters.company}
                    <button onClick={() => handleFilterChange('company', '')}>×</button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Questions Grid */}
      <section className="qb-questions-section">
        <div className="container">
          {loading ? (
            <div className="qb-loading">
              <LoadingSpinner />
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="qb-empty">
              <div className="empty-icon">🔍</div>
              <h3 className="empty-title">No questions found</h3>
              <p className="empty-text">Try adjusting your filters or search query</p>
              <button onClick={clearFilters} className="empty-btn">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="questions-grid">
                {filteredQuestions.map((question, index) => (
                  <motion.div
                    key={question._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/practice/${question._id}`} className="question-card">
                      <div className="card-header">
                        <div className="card-category">
                          <span className="category-icon">{getCategoryIcon(question.category)}</span>
                          <span className="category-text">{question.category}</span>
                        </div>
                        <span 
                          className="difficulty-badge"
                          style={{ 
                            background: `${getDifficultyColor(question.difficulty)}20`,
                            color: getDifficultyColor(question.difficulty)
                          }}
                        >
                          {question.difficulty}
                        </span>
                      </div>

                      <h3 className="card-question">{question.question}</h3>

                      {question.tags && question.tags.length > 0 && (
                        <div className="card-tags">
                          {question.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="tag">#{tag}</span>
                          ))}
                        </div>
                      )}

                      <div className="card-footer">
                        <span className="company-tag">
                          🏢 {question.company}
                        </span>
                        <span className="practice-link">
                          Practice →
                        </span>
                      </div>
                    </Link>
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
        </div>
      </section>
    </div>
  );
}

export default QuestionBank;
