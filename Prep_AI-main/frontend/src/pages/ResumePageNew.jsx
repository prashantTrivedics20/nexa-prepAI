import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import ThemeToggleButton from "../components/ThemeToggleButton";
import AuthProfileMenu from "../components/AuthProfileMenu";
import { getStoredUser, isAuthenticated, subscribeAuthChanges } from "../services/auth";
import "../styles/professional-pages.css";
import "./ResumePageNew.css";

const ITEMS_PER_PAGE = 4;

const revealUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

const revealStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const revealViewport = { once: true, amount: 0.2 };

function parseResumePayload(rawValue) {
  if (!rawValue) return null;
  if (typeof rawValue === "object") return rawValue;
  if (typeof rawValue !== "string") return null;

  const cleaned = rawValue.replace(/```json|```/gi, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (_error) {
    return { rawText: cleaned };
  }
}

function getSectionValue(parsedResume, key) {
  if (!parsedResume || typeof parsedResume !== "object") return null;

  const keyVariants = [key, key.toLowerCase(), key.toUpperCase()];
  const titleCase = key.charAt(0).toUpperCase() + key.slice(1);
  keyVariants.push(titleCase);

  for (const name of keyVariants) {
    if (Object.prototype.hasOwnProperty.call(parsedResume, name)) {
      return parsedResume[name];
    }
  }
  return null;
}

function stringifyPreviewValue(value) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) {
    return value.map((item) => stringifyPreviewValue(item)).filter(Boolean).join(", ");
  }
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([key, item]) => {
        const normalized = stringifyPreviewValue(item);
        return normalized ? `${key}: ${normalized}` : "";
      })
      .filter(Boolean)
      .join(" | ");
  }
  return String(value).trim();
}

function truncateText(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

function sectionToItems(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => truncateText(stringifyPreviewValue(item), 150)).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\r?\n+/)
      .map((item) => truncateText(item.replace(/^\s*[-*]\s*/, "").replace(/^\s*\d+[.)]\s*/, "").trim(), 150))
      .filter(Boolean);
  }
  if (typeof value === "object") {
    return Object.entries(value)
      .map(([label, item]) => {
        const normalized = stringifyPreviewValue(item);
        return normalized ? truncateText(`${label}: ${normalized}`, 150) : "";
      })
      .filter(Boolean);
  }
  return [];
}

function ResumePageNew() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(() => getStoredUser());
  const [viewingResume, setViewingResume] = useState(false);
  const [parsedResume, setParsedResume] = useState(null);
  const [loadingResume, setLoadingResume] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    skills: true,
    projects: true,
    experience: true,
    education: true
  });
  const [sectionPages, setSectionPages] = useState({
    skills: 1,
    projects: 1,
    experience: 1,
    education: 1
  });
  const [searchQueries, setSearchQueries] = useState({
    skills: '',
    projects: '',
    experience: '',
    education: ''
  });

  const isLoggedIn = Boolean(loggedInUser);

  useEffect(() => subscribeAuthChanges(() => setLoggedInUser(getStoredUser())), []);

  // Fetch resume from database on mount if user is logged in
  useEffect(() => {
    const fetchResumeFromDB = async () => {
      if (!isLoggedIn) {
        setLoadingResume(false);
        return;
      }
      
      try {
        setLoadingResume(true);
        const response = await API.get('/resume/me');
        if (response.data?.parsedData) {
          const normalized = parseResumePayload(response.data.parsedData);
          if (normalized) {
            setParsedResume(normalized);
          }
        }
      } catch (error) {
        // If no resume found in DB, that's okay - user hasn't uploaded yet
        if (error.response?.status !== 404) {
          console.error('Failed to fetch resume from database:', error);
        }
      } finally {
        setLoadingResume(false);
      }
    };

    fetchResumeFromDB();
  }, [isLoggedIn]);

  const parsedSections = useMemo(() => {
    if (!parsedResume || typeof parsedResume !== "object" || parsedResume.rawText) {
      return [];
    }
    return [
      { title: "Skills", key: "skills", icon: "🎯", items: sectionToItems(getSectionValue(parsedResume, "skills")) },
      { title: "Projects", key: "projects", icon: "💼", items: sectionToItems(getSectionValue(parsedResume, "projects")) },
      { title: "Experience", key: "experience", icon: "🏢", items: sectionToItems(getSectionValue(parsedResume, "experience")) },
      { title: "Education", key: "education", icon: "🎓", items: sectionToItems(getSectionValue(parsedResume, "education")) },
    ].filter((section) => section.items.length);
  }, [parsedResume]);

  const getFilteredItems = (section) => {
    const query = searchQueries[section.key]?.toLowerCase() || '';
    if (!query) return section.items;
    return section.items.filter(item => 
      item.toLowerCase().includes(query)
    );
  };

  const getPaginatedItems = (section) => {
    const filteredItems = getFilteredItems(section);
    const page = sectionPages[section.key] || 1;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return {
      items: filteredItems.slice(startIndex, endIndex),
      totalItems: filteredItems.length,
      totalPages: Math.ceil(filteredItems.length / ITEMS_PER_PAGE),
      currentPage: page
    };
  };

  const toggleSection = (key) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePageChange = (sectionKey, newPage) => {
    setSectionPages(prev => ({
      ...prev,
      [sectionKey]: newPage
    }));
  };

  const handleSearchChange = (sectionKey, query) => {
    setSearchQueries(prev => ({
      ...prev,
      [sectionKey]: query
    }));
    setSectionPages(prev => ({
      ...prev,
      [sectionKey]: 1
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    const isPdf = droppedFile.type === "application/pdf" || droppedFile.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setError("Only PDF resumes are supported.");
      return;
    }

    setFile(droppedFile);
    setError("");
    setSuccess("");
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files?.[0];
    setError("");
    setSuccess("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const isPdf = selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setFile(null);
      setError("Only PDF resumes are supported.");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Select a PDF resume before uploading.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError("");
    setSuccess("");

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await API.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const normalized = parseResumePayload(response.data?.parsedData);
      if (!normalized) {
        throw new Error("Resume data could not be parsed.");
      }

      // Save to state and localStorage (for Interview page)
      setParsedResume(normalized);
      localStorage.setItem("parsedResume", JSON.stringify(normalized));

      // Show success message
      const savedToDB = response.data?.savedForUser;
      const successMsg = savedToDB 
        ? "Resume uploaded and saved to your account! 🎉"
        : "Resume uploaded! Login to save it to your account. 🎉";

      setTimeout(() => {
        setSuccess(successMsg);
        setFile(null);
        setUploadProgress(0);
      }, 500);
    } catch (uploadError) {
      clearInterval(progressInterval);
      const message = uploadError.response?.data?.error || uploadError.message || "Resume upload failed. Please try again.";
      setError(message);
      setUploadProgress(0);
    } finally {
      setTimeout(() => {
        setUploading(false);
      }, 1000);
    }
  };

  const handleReset = () => {
    setFile(null);
    setError("");
    setSuccess("");
    setParsedResume(null);
    localStorage.removeItem("parsedResume");
  };

  const goToInterviewWithAuthCheck = () => {
    if (isAuthenticated()) {
      navigate("/interview");
      return;
    }
    setError("Please login before starting the interview.");
    setTimeout(() => {
      navigate("/signup?mode=login&redirect=/interview");
    }, 1500);
  };

  return (
    <div className="resume-page-new">
      {/* Navbar */}
      <nav className="home-navbar">
        <a href="/" className="home-brand">
          <span className="brand-mark"><span /></span>
          <span className="brand-text">NexaAura InterviewAI</span>
        </a>
        <div className="home-menu">
          <Link to="/">Home</Link>
          <Link to="/resume">Resume</Link>
          <Link to="/interview">Interview</Link>
          <Link to="/report">Report</Link>
          <a href="https://nexaaura-doc-hub.vercel.app/" target="_blank" rel="noopener noreferrer" className="nexadoc-link">
            📚 NexaDoc
          </a>
        </div>
        <div className="nav-actions">
          <button type="button" className="home-signin" onClick={goToInterviewWithAuthCheck}>
            Go To Interview
          </button>
          <AuthProfileMenu />
          <ThemeToggleButton />
        </div>
      </nav>

      {!parsedResume ? (
        // LANDING PAGE
        loadingResume ? (
          <div className="resume-landing" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="spinner-large" style={{ 
                width: '60px', 
                height: '60px', 
                border: '4px solid var(--border-primary)', 
                borderTop: '4px solid var(--color-primary-500)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }}></div>
              <p style={{ color: 'var(--text-secondary)' }}>Loading your resume...</p>
            </div>
          </div>
        ) : (
        <div className="resume-landing">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-container">
              <motion.div
                className="hero-content"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="hero-badge">
                  <span className="badge-icon">✨</span>
                  <span>AI-Powered Interview Preparation</span>
                </div>
                
                <h1 className="hero-title">
                  Transform Your Resume Into
                  <span className="gradient-text"> Interview Success</span>
                </h1>
                
                <p className="hero-description">
                  Upload your resume and let our advanced AI analyze your profile to generate
                  personalized interview questions tailored to your experience and skills.
                </p>

                <div className="hero-stats">
                  <div className="stat-item">
                    <div className="stat-value">10K+</div>
                    <div className="stat-label">Interviews Practiced</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">95%</div>
                    <div className="stat-label">Success Rate</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">500+</div>
                    <div className="stat-label">Companies Covered</div>
                  </div>
                </div>
              </motion.div>

              {/* Upload Card */}
              <motion.div
                className="upload-card-hero"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div
                  className={`upload-zone-hero ${isDragging ? 'dragging' : ''} ${file ? 'has-file' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !uploading && document.getElementById('resume-file-input').click()}
                >
                  <input
                    id="resume-file-input"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />

                  {!file ? (
                    <div className="upload-placeholder">
                      <div className="upload-icon">📄</div>
                      <h3>Drop your resume here</h3>
                      <p>or click to browse</p>
                      <div className="upload-hint">PDF files only • Max 10MB</div>
                    </div>
                  ) : (
                    <div className="file-preview">
                      <div className="file-icon">✅</div>
                      <div className="file-info">
                        <div className="file-name">{file.name}</div>
                        <div className="file-size">{(file.size / 1024).toFixed(2)} KB</div>
                      </div>
                    </div>
                  )}
                </div>

                {uploading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: '0%' }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="progress-text">{uploadProgress}% • Analyzing your resume...</div>
                  </div>
                )}

                <button
                  className="upload-btn-hero"
                  onClick={handleUpload}
                  disabled={!file || uploading}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-small"></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      Upload & Analyze Resume
                    </>
                  )}
                </button>

                {error && (
                  <motion.div className="alert-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    ⚠️ {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div className="alert-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    ✅ {success}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </section>

          {/* Features Section */}
          <section className="features-section">
            <div className="features-container">
              <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2>Why Choose NexaAura InterviewAI?</h2>
                <p>Everything you need to ace your next interview</p>
              </motion.div>

              <div className="features-grid">
                {[
                  {
                    icon: '🤖',
                    title: 'AI-Powered Analysis',
                    description: 'Advanced AI analyzes your resume to understand your skills, experience, and career trajectory'
                  },
                  {
                    icon: '🎯',
                    title: 'Personalized Questions',
                    description: 'Get interview questions specifically tailored to your background and target role'
                  },
                  {
                    icon: '📊',
                    title: 'Real-Time Feedback',
                    description: 'Receive instant AI feedback with detailed suggestions for improvement'
                  },
                  {
                    icon: '🏆',
                    title: 'Top Company Focus',
                    description: 'Practice with questions from Google, Amazon, Microsoft, and 500+ companies'
                  },
                  {
                    icon: '💡',
                    title: 'Smart Insights',
                    description: 'Track your progress with detailed analytics and performance metrics'
                  },
                  {
                    icon: '🚀',
                    title: 'Career Growth',
                    description: 'Build confidence and skills to land your dream job faster'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="feature-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="feature-icon">{feature.icon}</div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="how-it-works-section">
            <div className="how-container">
              <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2>How It Works</h2>
                <p>Get started in 3 simple steps</p>
              </motion.div>

              <div className="steps-grid">
                {[
                  {
                    step: '01',
                    title: 'Upload Resume',
                    description: 'Upload your PDF resume and let our AI parse your profile'
                  },
                  {
                    step: '02',
                    title: 'AI Analysis',
                    description: 'Our AI analyzes your skills, experience, and generates personalized questions'
                  },
                  {
                    step: '03',
                    title: 'Start Practicing',
                    description: 'Practice with AI-powered interviews and get instant feedback'
                  }
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    className="step-card"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div className="step-number">{step.step}</div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>
        )
      ) : (
        // DASHBOARD with full features
        <div className="resume-dashboard">
          <div className="dashboard-header">
            <div>
              <h1>Your Resume Dashboard</h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Your parsed resume information. Ready to start your AI-powered interview!
              </p>
            </div>
            <div className="dashboard-actions">
              <button className="btn-primary" onClick={goToInterviewWithAuthCheck}>
                🚀 Start Interview
              </button>
              <button className="btn-secondary" onClick={() => setViewingResume(true)}>
                👁️ View Resume
              </button>
              <button className="btn-secondary" onClick={handleReset}>
                📤 Upload New
              </button>
            </div>
          </div>

          {error && (
            <motion.div className="alert-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              ⚠️ {error}
            </motion.div>
          )}
          {success && (
            <motion.div className="alert-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              ✅ {success}
            </motion.div>
          )}

          {parsedSections.length === 0 ? (
            <div className="empty-dashboard">
              <div className="empty-icon">📄</div>
              <h2>No Resume Data Found</h2>
              <p>Your resume was uploaded but we couldn't extract structured data. Please try uploading again.</p>
              <button className="btn-primary" onClick={handleReset}>
                📤 Upload New Resume
              </button>
            </div>
          ) : (
            <div className="dashboard-grid">
              {parsedSections.map((section, idx) => {
                const paginatedData = getPaginatedItems(section);
                const isExpanded = expandedSections[section.key];
                
                return (
                  <motion.div
                    key={section.key}
                    className="dashboard-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div 
                      className="card-header"
                      onClick={() => toggleSection(section.key)}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                      title="Click to expand/collapse"
                    >
                      <span className="card-icon">{section.icon}</span>
                      <h3>{section.title}</h3>
                      <span className="card-count">{paginatedData.totalItems}</span>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ fontSize: '1.2rem', marginLeft: 'auto', cursor: 'pointer' }}
                      >
                        ▼
                      </motion.span>
                    </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        {/* Search - Always show if there are items */}
                        {paginatedData.totalItems > 0 && (
                          <div style={{ padding: '1rem 0' }}>
                            <input
                              type="text"
                              placeholder={`Search ${section.title.toLowerCase()}...`}
                              value={searchQueries[section.key]}
                              onChange={(e) => handleSearchChange(section.key, e.target.value)}
                              className="search-input"
                            />
                          </div>
                        )}

                        {/* Items */}
                        <div className="card-items">
                          {paginatedData.items.length === 0 ? (
                            <div className="empty-items">
                              No items found
                            </div>
                          ) : (
                            paginatedData.items.map((item, idx) => (
                              <motion.div
                                key={idx}
                                className="item"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                title={item} // Show full text on hover
                              >
                                <span className="item-bullet">•</span>
                                <span className="item-text">{item}</span>
                              </motion.div>
                            ))
                          )}
                        </div>

                        {/* Pagination */}
                        {paginatedData.totalPages > 1 && (
                          <div className="pagination">
                            <button
                              onClick={() => handlePageChange(section.key, paginatedData.currentPage - 1)}
                              disabled={paginatedData.currentPage === 1}
                              className="pagination-btn"
                            >
                              ← Previous
                            </button>
                            <span className="pagination-info">
                              Page {paginatedData.currentPage} of {paginatedData.totalPages}
                            </span>
                            <button
                              onClick={() => handlePageChange(section.key, paginatedData.currentPage + 1)}
                              disabled={paginatedData.currentPage === paginatedData.totalPages}
                              className="pagination-btn"
                            >
                              Next →
                            </button>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* Summary Card */}
              <motion.div
                className="dashboard-card summary-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: parsedSections.length * 0.1 }}
              >
              <div className="card-header">
                <span className="card-icon">📊</span>
                <h3>Profile Summary</h3>
              </div>
              <div className="summary-content">
                {parsedSections.map((section, idx) => (
                  <div key={idx} className="summary-item" onClick={() => toggleSection(section.key)}>
                    <span className="summary-icon">{section.icon}</span>
                    <span className="summary-label">{section.title}</span>
                    <span className="summary-count">{section.items.length}</span>
                  </div>
                ))}
                <div className="total-items">
                  <div className="total-label">Total Items</div>
                  <div className="total-value">
                    {parsedSections.reduce((sum, section) => sum + section.items.length, 0)}
                  </div>
                </div>
                <button className="btn-primary" onClick={goToInterviewWithAuthCheck} style={{ width: '100%', marginTop: '1.5rem' }}>
                  🚀 Start AI Interview
                </button>
              </div>
            </motion.div>
            </div>
          )}

          {/* View Resume Modal */}
          <AnimatePresence>
            {viewingResume && (
              <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setViewingResume(false)}
              >
                <motion.div
                  className="modal-content"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-header">
                    <h2>Resume Preview</h2>
                    <button className="modal-close" onClick={() => setViewingResume(false)}>×</button>
                  </div>
                  <div className="modal-body">
                    {parsedSections.map((section) => (
                      <div key={section.key} className="modal-section">
                        <h3>
                          <span>{section.icon}</span>
                          {section.title}
                        </h3>
                        <div className="modal-items">
                          {section.items.map((item, idx) => (
                            <div key={idx} className="modal-item">• {item}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default ResumePageNew;
