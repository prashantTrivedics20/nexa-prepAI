import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";
import ThemeToggleButton from "../components/ThemeToggleButton";
import AuthProfileMenu from "../components/AuthProfileMenu";
import { getStoredUser, isAuthenticated, subscribeAuthChanges } from "../services/auth";
import "../styles/professional-pages.css";

const ITEMS_PER_PAGE = 5;

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

  if (typeof rawValue === "object") {
    return rawValue;
  }

  if (typeof rawValue !== "string") {
    return null;
  }

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
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => stringifyPreviewValue(item))
      .filter(Boolean)
      .join(", ");
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

function sectionToItems(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => stringifyPreviewValue(item))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n+/)
      .map((item) => item.replace(/^\s*[-*]\s*/, "").replace(/^\s*\d+[.)]\s*/, "").trim())
      .filter(Boolean);
  }

  if (typeof value === "object") {
    return Object.entries(value)
      .map(([label, item]) => {
        const normalized = stringifyPreviewValue(item);
        return normalized ? `${label}: ${normalized}` : "";
      })
      .filter(Boolean);
  }

  return [];
}

function ResumePage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deletingSavedResume, setDeletingSavedResume] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(() => getStoredUser());
  const [resumeFileUrl, setResumeFileUrl] = useState(null);
  const [viewingResume, setViewingResume] = useState(false);
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
  const [parsedResume, setParsedResume] = useState(() => {
    const saved = localStorage.getItem("parsedResume");
    if (!saved) return null;

    try {
      return parseResumePayload(JSON.parse(saved));
    } catch (_error) {
      return parseResumePayload(saved);
    }
  });

  const parsedSections = useMemo(() => {
    if (!parsedResume || typeof parsedResume !== "object" || parsedResume.rawText) {
      return [];
    }

    return [
      {
        title: "Skills",
        key: "skills",
        icon: "🎯",
        items: sectionToItems(getSectionValue(parsedResume, "skills")),
      },
      {
        title: "Projects",
        key: "projects",
        icon: "💼",
        items: sectionToItems(getSectionValue(parsedResume, "projects")),
      },
      {
        title: "Experience",
        key: "experience",
        icon: "🏢",
        items: sectionToItems(getSectionValue(parsedResume, "experience")),
      },
      {
        title: "Education",
        key: "education",
        icon: "🎓",
        items: sectionToItems(getSectionValue(parsedResume, "education")),
      },
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
    // Reset to page 1 when searching
    setSectionPages(prev => ({
      ...prev,
      [sectionKey]: 1
    }));
  };

  const isLoggedIn = Boolean(loggedInUser);

  useEffect(() => subscribeAuthChanges(() => setLoggedInUser(getStoredUser())), []);

  useEffect(() => {
    let isMounted = true;

    const loadSavedResume = async () => {
      if (!isLoggedIn) {
        return;
      }

      try {
        const response = await API.get("/resume/me");
        const normalized = parseResumePayload(response.data?.parsedData);
        if (!normalized || !isMounted) {
          return;
        }

        setParsedResume((currentResume) => currentResume || normalized);
        if (!localStorage.getItem("parsedResume")) {
          localStorage.setItem("parsedResume", JSON.stringify(normalized));
        }
      } catch (savedResumeError) {
        const status = savedResumeError?.response?.status;
        if (status === 401 || status === 404) {
          return;
        }
      }
    };

    loadSavedResume();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files?.[0];
    setError("");
    setSuccess("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setFile(null);
      setError("Only PDF resumes are supported.");
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    const isPdf =
      droppedFile.type === "application/pdf" ||
      droppedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setError("Only PDF resumes are supported.");
      return;
    }

    setFile(droppedFile);
    setError("");
    setSuccess("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Select a PDF resume before uploading.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await API.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const normalized = parseResumePayload(response.data?.parsedData);
      if (!normalized) {
        throw new Error("Resume data could not be parsed.");
      }

      localStorage.setItem("parsedResume", JSON.stringify(normalized));
      localStorage.removeItem("finalResult");
      setParsedResume(normalized);
      
      // Store resume file URL if available
      if (response.data?.fileUrl) {
        setResumeFileUrl(response.data.fileUrl);
      }
      
      const saveSuffix = response.data?.savedForUser
        ? " Resume is linked to your logged-in profile."
        : " Please login before interview to continue.";
      setSuccess(
        response.data?.warning
          ? `Resume uploaded successfully. ${response.data.warning}${saveSuffix}`
          : `Resume uploaded and parsed successfully.${saveSuffix}`
      );
    } catch (uploadError) {
      const message =
        uploadError.response?.data?.error ||
        uploadError.message ||
        "Resume upload failed. Please try again.";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setError("");
    setSuccess("");
    setParsedResume(null);
    localStorage.removeItem("parsedResume");
    localStorage.removeItem("finalResult");
  };

  const handleDeleteSavedResume = async () => {
    if (!isLoggedIn) {
      setError("Please login to delete a saved resume from your profile.");
      return;
    }

    setDeletingSavedResume(true);
    setError("");

    try {
      await API.delete("/resume/me");
      setFile(null);
      setParsedResume(null);
      localStorage.removeItem("parsedResume");
      localStorage.removeItem("finalResult");
      setSuccess("Saved resume deleted from your profile.");
    } catch (deleteError) {
      const message =
        deleteError.response?.data?.error ||
        deleteError.message ||
        "Unable to delete saved resume.";
      setError(message);
    } finally {
      setDeletingSavedResume(false);
    }
  };

  const goToInterviewWithAuthCheck = () => {
    if (isAuthenticated()) {
      navigate("/interview");
      return;
    }

    setError("Please login before starting the interview. Redirecting to login...");
    setTimeout(() => {
      navigate("/signup?mode=login&redirect=/interview");
    }, 450);
  };

  return (
    <div className="home-shell app-shell">
      <nav className="home-navbar">
        <a href="/" className="home-brand" aria-label="NexaAura InterviewAI Home">
          <span className="brand-mark" aria-hidden="true">
            <span />
          </span>
          <span className="brand-text">NexaAura InterviewAI</span>
        </a>

        <div className="home-menu">
          <Link to="/">Home</Link>
          <Link to="/resume">Resume</Link>
          <Link to="/interview">Interview</Link>
          <Link to="/report">Report</Link>
          <a 
            href="https://nexaaura-doc-hub.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '0.4rem 0.9rem',
              borderRadius: '6px',
              fontWeight: '600',
              textDecoration: 'none'
            }}
          >
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

      <main className="app-page">
        {!parsedResume ? (
          // Landing page when no resume uploaded
          <motion.section
            className="app-page-header home-fade-up"
            variants={revealUp}
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="app-kicker">Step 1</p>
            <h1>Upload Your Resume</h1>
            <p>
              Upload a PDF, let NexaAura InterviewAI parse your profile, then continue to your interview flow.
            </p>
          </motion.section>
        ) : (
          // Dashboard header when resume uploaded
          <motion.section
            className="app-page-header home-fade-up"
            variants={revealUp}
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <p className="app-kicker">Your Profile</p>
            <h1>Resume Dashboard</h1>
            <p>
              Your parsed resume information. Ready to start your AI-powered interview!
            </p>
          </motion.section>
        )}

        {!parsedResume ? (
          // Upload section when no resume
          <motion.section
            className="app-grid home-fade-up"
            variants={revealStagger}
            initial="hidden"
            whileInView="show"
            viewport={revealViewport}
          >
            <motion.article className="glass-card" variants={revealUp}>
              <div className="card-header-enhanced">
                <div className="icon-badge">📄</div>
                <div>
                  <h2>Resume File</h2>
                  <p className="card-subtitle">Upload your PDF resume for AI analysis</p>
                </div>
              </div>
              
              <div className="upload-zone">
                <label className="app-file-picker enhanced-file-picker" htmlFor="resume-file">
                  <div className="file-picker-icon">
                    {file ? '✓' : '📤'}
                  </div>
                  <div className="file-picker-content">
                    <span className="file-picker-title">
                      {file ? file.name : "Choose a PDF resume"}
                    </span>
                    <span className="file-picker-hint">
                      {file ? 'Click to change file' : 'Click to browse or drag & drop'}
                    </span>
                  </div>
                  <input id="resume-file" type="file" accept=".pdf,application/pdf" onChange={handleFileSelect} />
                </label>
              </div>

              <div className="app-button-row">
                <button 
                  type="button" 
                  className="app-btn primary-gradient" 
                  onClick={handleUpload} 
                  disabled={uploading || !file}
                  style={{
                    background: uploading ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    opacity: (!file && !uploading) ? 0.6 : 1
                  }}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-small"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <span>📤</span>
                      Upload Resume
                    </>
                  )}
                </button>
              </div>

              {error && (
                <motion.div 
                  className="app-alert error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span>⚠️</span>
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div 
                  className="app-alert success"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span>✅</span>
                  {success}
                </motion.div>
              )}
            </motion.article>

            <motion.article className="glass-card" variants={revealUp}>
              <div className="empty-state-box" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <div className="empty-icon" style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
                <p className="empty-title" style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  No Resume Uploaded
                </p>
                <p className="empty-text" style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                  Upload your resume to practice AI-powered interviews tailored to your profile
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                    <span>AI-powered question generation</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                    <span>Personalized interview experience</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                    <span>Real-time feedback & scoring</span>
                  </div>
                </div>
              </div>
            </motion.article>
          </motion.section>
        ) : (
          // Dashboard when resume uploaded
          <>
            {/* Quick Actions Bar */}
            <motion.section
              className="home-fade-up"
              variants={revealUp}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
              style={{ marginBottom: '2rem' }}
            >
              <div className="app-button-row" style={{ justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  className="app-btn primary-gradient" 
                  onClick={goToInterviewWithAuthCheck}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    fontSize: '1.1rem',
                    padding: '0.75rem 2rem'
                  }}
                >
                  <span>🚀</span>
                  Start Interview
                </button>
                <button 
                  type="button" 
                  className="app-btn secondary" 
                  onClick={() => setViewingResume(true)}
                  style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                >
                  <span>👁️</span>
                  View Resume
                </button>
                <button 
                  type="button" 
                  className="app-btn secondary" 
                  onClick={handleReset}
                  style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                >
                  <span>📤</span>
                  Upload New
                </button>
                {isLoggedIn && (
                  <button
                    type="button"
                    className="app-btn danger"
                    onClick={handleDeleteSavedResume}
                    disabled={deletingSavedResume}
                    style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}
                  >
                    {deletingSavedResume ? (
                      <>
                        <span className="spinner-small"></span>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <span>🗑️</span>
                        Delete
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {error && (
                <motion.div 
                  className="app-alert error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginTop: '1rem', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}
                >
                  <span>⚠️</span>
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div 
                  className="app-alert success"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginTop: '1rem', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}
                >
                  <span>✅</span>
                  {success}
                </motion.div>
              )}
            </motion.section>

            {/* Resume Dashboard Grid */}
            <motion.section
              className="app-grid home-fade-up"
              variants={revealStagger}
              initial="hidden"
              whileInView="show"
              viewport={revealViewport}
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}
            >
              {parsedSections.map((section, idx) => {
                const paginatedData = getPaginatedItems(section);
                const isExpanded = expandedSections[section.key];
                
                return (
                  <motion.article 
                    key={section.title} 
                    className="glass-card"
                    variants={revealUp}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    {/* Section Header */}
                    <div 
                      className="card-header-enhanced" 
                      style={{ 
                        cursor: 'pointer',
                        userSelect: 'none',
                        borderBottom: isExpanded ? '1px solid var(--border-primary)' : 'none',
                        paddingBottom: isExpanded ? '1rem' : '0'
                      }}
                      onClick={() => toggleSection(section.key)}
                    >
                      <div className="icon-badge" style={{ fontSize: '1.5rem' }}>
                        {section.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h2 style={{ margin: 0 }}>{section.title}</h2>
                        <p className="card-subtitle" style={{ margin: 0 }}>
                          {paginatedData.totalItems} {paginatedData.totalItems === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ fontSize: '1.5rem', color: 'var(--text-tertiary)' }}
                      >
                        ▼
                      </motion.div>
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
                          {/* Search Bar */}
                          {paginatedData.totalItems > 3 && (
                            <div style={{ padding: '1rem 0' }}>
                              <div style={{ position: 'relative' }}>
                                <input
                                  type="text"
                                  placeholder={`Search ${section.title.toLowerCase()}...`}
                                  value={searchQueries[section.key]}
                                  onChange={(e) => handleSearchChange(section.key, e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    border: '2px solid var(--border-primary)',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-primary)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--color-primary-500)';
                                    e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                                  }}
                                  onBlur={(e) => {
                                    e.target.style.borderColor = 'var(--border-primary)';
                                    e.target.style.boxShadow = 'none';
                                  }}
                                />
                                <span style={{
                                  position: 'absolute',
                                  left: '0.75rem',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  fontSize: '1.2rem'
                                }}>
                                  🔍
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Items List */}
                          <div className="resume-preview-list" style={{ marginTop: '1rem' }}>
                            {paginatedData.items.length === 0 ? (
                              <div style={{ 
                                padding: '2rem', 
                                textAlign: 'center',
                                color: 'var(--text-tertiary)'
                              }}>
                                No items found
                              </div>
                            ) : (
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {paginatedData.items.map((item, index) => (
                                  <motion.li 
                                    key={`${section.title}-${index}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    style={{
                                      padding: '1rem',
                                      marginBottom: '0.75rem',
                                      background: 'var(--bg-secondary)',
                                      borderRadius: 'var(--radius-lg)',
                                      border: '1px solid var(--border-primary)',
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: '0.75rem',
                                      transition: 'all 0.2s ease',
                                      position: 'relative',
                                      overflow: 'hidden'
                                    }}
                                    whileHover={{
                                      scale: 1.02,
                                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                      borderColor: 'var(--color-primary-300)'
                                    }}
                                  >
                                    <span style={{ 
                                      color: 'var(--color-primary-500)', 
                                      fontWeight: 'bold',
                                      fontSize: '1.5rem',
                                      lineHeight: '1',
                                      marginTop: '0.1rem'
                                    }}>
                                      •
                                    </span>
                                    <span style={{ 
                                      flex: 1, 
                                      fontSize: '0.95rem',
                                      lineHeight: '1.6',
                                      color: 'var(--text-primary)'
                                    }}>
                                      {item}
                                    </span>
                                    <div style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '3px',
                                      height: '100%',
                                      background: 'var(--gradient-primary)',
                                      opacity: 0,
                                      transition: 'opacity 0.2s ease'
                                    }}
                                    className="item-accent"
                                    />
                                  </motion.li>
                                ))}
                              </ul>
                            )}
                          </div>

                          {/* Pagination */}
                          {paginatedData.totalPages > 1 && (
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginTop: '1.5rem',
                              padding: '1rem',
                              background: 'var(--bg-secondary)',
                              borderRadius: 'var(--radius-md)',
                              border: '1px solid var(--border-primary)'
                            }}>
                              <button
                                onClick={() => handlePageChange(section.key, paginatedData.currentPage - 1)}
                                disabled={paginatedData.currentPage === 1}
                                style={{
                                  padding: '0.5rem 1rem',
                                  background: paginatedData.currentPage === 1 ? 'var(--bg-tertiary)' : 'var(--gradient-primary)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: 'var(--radius-md)',
                                  cursor: paginatedData.currentPage === 1 ? 'not-allowed' : 'pointer',
                                  fontSize: '0.9rem',
                                  fontWeight: '600',
                                  opacity: paginatedData.currentPage === 1 ? 0.5 : 1,
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                ← Previous
                              </button>
                              
                              <span style={{
                                fontSize: '0.9rem',
                                color: 'var(--text-secondary)',
                                fontWeight: '600'
                              }}>
                                Page {paginatedData.currentPage} of {paginatedData.totalPages}
                              </span>
                              
                              <button
                                onClick={() => handlePageChange(section.key, paginatedData.currentPage + 1)}
                                disabled={paginatedData.currentPage === paginatedData.totalPages}
                                style={{
                                  padding: '0.5rem 1rem',
                                  background: paginatedData.currentPage === paginatedData.totalPages ? 'var(--bg-tertiary)' : 'var(--gradient-primary)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: 'var(--radius-md)',
                                  cursor: paginatedData.currentPage === paginatedData.totalPages ? 'not-allowed' : 'pointer',
                                  fontSize: '0.9rem',
                                  fontWeight: '600',
                                  opacity: paginatedData.currentPage === paginatedData.totalPages ? 0.5 : 1,
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                Next →
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                );
              })}

              {/* Summary Card */}
              <motion.article className="glass-card" variants={revealUp}>
                <div className="card-header-enhanced">
                  <div className="icon-badge" style={{ fontSize: '1.5rem' }}>📊</div>
                  <div>
                    <h2>Profile Summary</h2>
                    <p className="card-subtitle">Your resume at a glance</p>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {parsedSections.map((section, idx) => (
                    <motion.div 
                      key={`summary-${section.title}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--border-primary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      whileHover={{
                        scale: 1.02,
                        borderColor: 'var(--color-primary-300)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      onClick={() => toggleSection(section.key)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>
                          {section.icon}
                        </span>
                        <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                          {section.title}
                        </span>
                      </div>
                      <span style={{
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        padding: '0.35rem 0.85rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.875rem',
                        fontWeight: '700'
                      }}>
                        {section.items.length}
                      </span>
                    </motion.div>
                  ))}

                  <div style={{
                    marginTop: '1rem',
                    padding: '2rem 1.5rem',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                    borderRadius: 'var(--radius-xl)',
                    border: '2px solid var(--color-primary-200)',
                    textAlign: 'center'
                  }}>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--text-secondary)',
                      marginBottom: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Total Items
                    </p>
                    <p style={{ 
                      fontSize: '3rem', 
                      fontWeight: '800',
                      background: 'var(--gradient-primary)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      margin: 0,
                      lineHeight: '1'
                    }}>
                      {parsedSections.reduce((sum, section) => sum + section.items.length, 0)}
                    </p>
                  </div>

                  <button 
                    type="button" 
                    className="app-btn primary-gradient" 
                    onClick={goToInterviewWithAuthCheck}
                    style={{
                      width: '100%',
                      marginTop: '1rem',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      fontSize: '1.1rem',
                      padding: '0.875rem'
                    }}
                  >
                    <span>🚀</span>
                    Start AI Interview
                  </button>
                </div>
              </motion.article>
            </motion.section>

            {/* View Resume Modal */}
            <AnimatePresence>
              {viewingResume && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem'
                  }}
                  onClick={() => setViewingResume(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    style={{
                      background: 'var(--bg-elevated)',
                      borderRadius: 'var(--radius-2xl)',
                      padding: '2rem',
                      maxWidth: '900px',
                      width: '100%',
                      maxHeight: '90vh',
                      overflow: 'auto',
                      position: 'relative'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1.5rem'
                    }}>
                      <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Resume Preview</h2>
                      <button
                        onClick={() => setViewingResume(false)}
                        style={{
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-primary)',
                          borderRadius: 'var(--radius-full)',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '1.5rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        ×
                      </button>
                    </div>
                    
                    <div style={{
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '2rem',
                      border: '1px solid var(--border-primary)'
                    }}>
                      {parsedSections.map((section) => (
                        <div key={section.title} style={{ marginBottom: '2rem' }}>
                          <h3 style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '1rem',
                            fontSize: '1.25rem'
                          }}>
                            <span>{section.icon}</span>
                            {section.title}
                          </h3>
                          <ul style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                          }}>
                            {section.items.map((item, idx) => (
                              <li key={idx} style={{
                                padding: '0.75rem',
                                background: 'var(--bg-primary)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.9rem',
                                lineHeight: '1.5'
                              }}>
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </main>
    </div>
  );
}

export default ResumePage;
