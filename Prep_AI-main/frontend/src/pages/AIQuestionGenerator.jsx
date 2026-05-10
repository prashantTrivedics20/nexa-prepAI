import { useState } from 'react';
import { motion } from 'framer-motion';
import API from '../services/api';
import { isAuthenticated } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import './AIQuestionGenerator.css';

function AIQuestionGenerator() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resume');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');

  // Form states
  const [resumeCount, setResumeCount] = useState(5);
  const [resumeDifficulty, setResumeDifficulty] = useState('medium');
  
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('0-2');
  const [roleCount, setRoleCount] = useState(5);
  const [roleDifficulty, setRoleDifficulty] = useState('medium');
  
  const [company, setCompany] = useState('');
  const [companyRole, setCompanyRole] = useState('');
  const [companyCount, setCompanyCount] = useState(5);
  
  const [weakTopicCount, setWeakTopicCount] = useState(5);
  
  const [domain, setDomain] = useState('');
  const [scenarioCount, setScenarioCount] = useState(5);
  const [scenarioDifficulty, setScenarioDifficulty] = useState('medium');
  
  const [behavioralCount, setBehavioralCount] = useState(5);
  const [behavioralFocus, setBehavioralFocus] = useState('general');
  
  const [adaptiveCount, setAdaptiveCount] = useState(5);

  // Check authentication
  if (!isAuthenticated()) {
    navigate('/signup');
    return null;
  }

  const generateQuestions = async (type) => {
    setLoading(true);
    setError('');
    setQuestions([]);

    try {
      let response;

      switch (type) {
        case 'resume':
          response = await API.post('/question-generator/generate/resume', {
            count: resumeCount,
            difficulty: resumeDifficulty
          });
          break;

        case 'role':
          if (!role) {
            setError('Please enter a role');
            setLoading(false);
            return;
          }
          response = await API.post('/question-generator/generate/role', {
            role,
            experience,
            count: roleCount,
            difficulty: roleDifficulty
          });
          break;

        case 'company':
          if (!company || !companyRole) {
            setError('Please enter company and role');
            setLoading(false);
            return;
          }
          response = await API.post('/question-generator/generate/company', {
            company,
            role: companyRole,
            count: companyCount
          });
          break;

        case 'weak-topics':
          response = await API.post('/question-generator/generate/weak-topics', {
            count: weakTopicCount
          });
          break;

        case 'scenario':
          if (!domain) {
            setError('Please enter a domain');
            setLoading(false);
            return;
          }
          response = await API.post('/question-generator/generate/scenario', {
            domain,
            count: scenarioCount,
            difficulty: scenarioDifficulty
          });
          break;

        case 'behavioral':
          response = await API.post('/question-generator/generate/behavioral', {
            count: behavioralCount,
            focus: behavioralFocus
          });
          break;

        case 'adaptive':
          response = await API.post('/question-generator/generate/adaptive', {
            count: adaptiveCount
          });
          break;

        default:
          throw new Error('Invalid question type');
      }

      if (response.data.success) {
        setQuestions(response.data.questions);
      } else {
        setError(response.data.message || 'Failed to generate questions');
      }
    } catch (err) {
      console.error('Generate questions error:', err);
      setError(err.response?.data?.message || 'Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'resume', label: '📄 Resume-Based', icon: '📄' },
    { id: 'role', label: '💼 Role-Specific', icon: '💼' },
    { id: 'company', label: '🏢 Company-Specific', icon: '🏢' },
    { id: 'weak-topics', label: '📊 Weak Topics', icon: '📊' },
    { id: 'scenario', label: '🎯 Scenario-Based', icon: '🎯' },
    { id: 'behavioral', label: '🗣️ Behavioral (STAR)', icon: '🗣️' },
    { id: 'adaptive', label: '🤖 Adaptive AI', icon: '🤖' }
  ];

  return (
    <div className="ai-question-generator">
      <div className="generator-header">
        <h1>🤖 AI Question Generator</h1>
        <p>Generate unlimited personalized interview questions powered by AI</p>
      </div>

      {/* Tabs */}
      <div className="generator-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="generator-content">
        {/* Resume-Based */}
        {activeTab === 'resume' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="tab-panel"
          >
            <h2>📄 Resume-Based Questions</h2>
            <p>Generate questions based on your uploaded resume</p>

            <div className="form-group">
              <label>Number of Questions</label>
              <input
                type="number"
                min="1"
                max="20"
                value={resumeCount}
                onChange={(e) => setResumeCount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Difficulty Level</label>
              <select value={resumeDifficulty} onChange={(e) => setResumeDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <button
              className="generate-btn"
              onClick={() => generateQuestions('resume')}
              disabled={loading}
            >
              {loading ? 'Generating...' : '✨ Generate Questions'}
            </button>
          </motion.div>
        )}

        {/* Role-Specific */}
        {activeTab === 'role' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="tab-panel"
          >
            <h2>💼 Role-Specific Questions</h2>
            <p>Generate questions for a specific job role</p>

            <div className="form-group">
              <label>Target Role</label>
              <input
                type="text"
                placeholder="e.g., Frontend Developer, Data Scientist"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Years of Experience</label>
              <select value={experience} onChange={(e) => setExperience(e.target.value)}>
                <option value="0-2">0-2 years (Entry Level)</option>
                <option value="2-5">2-5 years (Mid Level)</option>
                <option value="5-10">5-10 years (Senior)</option>
                <option value="10+">10+ years (Lead/Principal)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Number of Questions</label>
              <input
                type="number"
                min="1"
                max="20"
                value={roleCount}
                onChange={(e) => setRoleCount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Difficulty Level</label>
              <select value={roleDifficulty} onChange={(e) => setRoleDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <button
              className="generate-btn"
              onClick={() => generateQuestions('role')}
              disabled={loading}
            >
              {loading ? 'Generating...' : '✨ Generate Questions'}
            </button>
          </motion.div>
        )}

        {/* Company-Specific */}
        {activeTab === 'company' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="tab-panel"
          >
            <h2>🏢 Company-Specific Questions</h2>
            <p>Generate questions specific to a company's interview style</p>

            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                placeholder="e.g., Google, Amazon, Microsoft"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Role at Company</label>
              <input
                type="text"
                placeholder="e.g., Software Engineer, Product Manager"
                value={companyRole}
                onChange={(e) => setCompanyRole(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Number of Questions</label>
              <input
                type="number"
                min="1"
                max="20"
                value={companyCount}
                onChange={(e) => setCompanyCount(e.target.value)}
              />
            </div>

            <button
              className="generate-btn"
              onClick={() => generateQuestions('company')}
              disabled={loading}
            >
              {loading ? 'Generating...' : '✨ Generate Questions'}
            </button>
          </motion.div>
        )}

        {/* Weak Topics */}
        {activeTab === 'weak-topics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="tab-panel"
          >
            <h2>📊 Weak Topics Questions</h2>
            <p>Generate questions focused on your weak areas</p>

            <div className="form-group">
              <label>Number of Questions</label>
              <input
                type="number"
                min="1"
                max="20"
                value={weakTopicCount}
                onChange={(e) => setWeakTopicCount(e.target.value)}
              />
            </div>

            <button
              className="generate-btn"
              onClick={() => generateQuestions('weak-topics')}
              disabled={loading}
            >
              {loading ? 'Generating...' : '✨ Generate Questions'}
            </button>
          </motion.div>
        )}

        {/* Scenario-Based */}
        {activeTab === 'scenario' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="tab-panel"
          >
            <h2>🎯 Scenario-Based Questions</h2>
            <p>Generate real-world scenario questions</p>

            <div className="form-group">
              <label>Domain/Topic</label>
              <input
                type="text"
                placeholder="e.g., System Design, Problem Solving, Leadership"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Number of Questions</label>
              <input
                type="number"
                min="1"
                max="20"
                value={scenarioCount}
                onChange={(e) => setScenarioCount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Difficulty Level</label>
              <select value={scenarioDifficulty} onChange={(e) => setScenarioDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <button
              className="generate-btn"
              onClick={() => generateQuestions('scenario')}
              disabled={loading}
            >
              {loading ? 'Generating...' : '✨ Generate Questions'}
            </button>
          </motion.div>
        )}

        {/* Behavioral */}
        {activeTab === 'behavioral' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="tab-panel"
          >
            <h2>🗣️ Behavioral Questions (STAR Format)</h2>
            <p>Generate behavioral questions using the STAR method</p>

            <div className="form-group">
              <label>Focus Area</label>
              <select value={behavioralFocus} onChange={(e) => setBehavioralFocus(e.target.value)}>
                <option value="general">General</option>
                <option value="leadership">Leadership</option>
                <option value="teamwork">Teamwork</option>
                <option value="problem-solving">Problem Solving</option>
                <option value="conflict-resolution">Conflict Resolution</option>
                <option value="communication">Communication</option>
              </select>
            </div>

            <div className="form-group">
              <label>Number of Questions</label>
              <input
                type="number"
                min="1"
                max="20"
                value={behavioralCount}
                onChange={(e) => setBehavioralCount(e.target.value)}
              />
            </div>

            <button
              className="generate-btn"
              onClick={() => generateQuestions('behavioral')}
              disabled={loading}
            >
              {loading ? 'Generating...' : '✨ Generate Questions'}
            </button>
          </motion.div>
        )}

        {/* Adaptive */}
        {activeTab === 'adaptive' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="tab-panel"
          >
            <h2>🤖 Adaptive AI Questions</h2>
            <p>AI generates questions based on your performance and progress</p>

            <div className="form-group">
              <label>Number of Questions</label>
              <input
                type="number"
                min="1"
                max="20"
                value={adaptiveCount}
                onChange={(e) => setAdaptiveCount(e.target.value)}
              />
            </div>

            <button
              className="generate-btn"
              onClick={() => generateQuestions('adaptive')}
              disabled={loading}
            >
              {loading ? 'Generating...' : '✨ Generate Questions'}
            </button>
          </motion.div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <LoadingSpinner />
          <p>AI is generating personalized questions for you...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* Generated Questions */}
      {questions.length > 0 && !loading && (
        <div className="generated-questions">
          <div className="questions-header">
            <h2>✨ Generated Questions ({questions.length})</h2>
            <button className="save-btn">💾 Save All</button>
          </div>

          <div className="questions-list">
            {questions.map((q, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="question-card"
              >
                <div className="question-header">
                  <span className="question-number">Q{idx + 1}</span>
                  <span className={`question-type ${q.type}`}>{q.type}</span>
                  <span className={`question-difficulty ${q.difficulty}`}>{q.difficulty}</span>
                </div>

                <h3 className="question-text">{q.question}</h3>

                <div className="question-meta">
                  <span className="question-topic">📌 {q.topic}</span>
                  {q.context && <p className="question-context">{q.context}</p>}
                </div>

                {q.expectedKeyPoints && q.expectedKeyPoints.length > 0 && (
                  <div className="expected-points">
                    <strong>Key Points to Cover:</strong>
                    <ul>
                      {q.expectedKeyPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="question-actions">
                  <button 
                    className="action-btn practice"
                    onClick={() => {
                      // Store question in localStorage and navigate to practice
                      localStorage.setItem('practiceQuestion', JSON.stringify(q));
                      navigate('/practice-random');
                    }}
                  >
                    🎯 Practice Now
                  </button>
                  <button className="action-btn save">💾 Save</button>
                  <button className="action-btn share">📤 Share</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AIQuestionGenerator;
