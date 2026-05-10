import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/design-system.css";
import "./EnhancedHome.css";

const HERO_VIDEO_SOURCE = "/homepage.mp4";

function EnhancedHome() {
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState(false);

  const features = [
    {
      icon: "🎯",
      title: "AI-Powered Feedback",
      description: "Get instant, detailed feedback on every answer with advanced AI analysis",
    },
    {
      icon: "🎤",
      title: "Voice Interview Mode",
      description: "Practice speaking naturally with real-time voice recognition",
    },
    {
      icon: "🤖",
      title: "AI Question Generator",
      description: "Generate personalized questions based on your resume, role, or weak topics",
      link: "/ai-generator",
    },
    {
      icon: "👔",
      title: "AI Mock Interviewer",
      description: "Practice with a conversational AI interviewer that asks follow-up questions",
      link: "/mock-interviewer",
    },
    {
      icon: "📊",
      title: "Progress Analytics",
      description: "Track your improvement with comprehensive performance metrics",
    },
    {
      icon: "📝",
      title: "Question Bank",
      description: "Access 300+ curated interview questions across multiple domains",
      link: "/questions",
    },
    {
      icon: "💬",
      title: "AI Chat Assistant",
      description: "Get help structuring answers with our intelligent chatbot",
    },
    {
      icon: "📄",
      title: "Resume Analysis",
      description: "Upload your resume for personalized question generation",
      link: "/resume",
    },
  ];

  const stats = [
    { value: "2,000+", label: "Professionals Trained" },
    { value: "300+", label: "Interview Questions" },
    { value: "95%", label: "Success Rate" },
    { value: "24/7", label: "AI Availability" },
  ];

  return (
    <div className="enhanced-home">
      <Navbar />

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
              <span className="badge-dot"></span>
              Trusted by 2,000+ professionals
            </div>

            <h1 className="hero-title">
              Master Your Next Interview
              <span className="gradient-text"> with AI</span>
            </h1>

            <p className="hero-description">
              Practice with AI-powered feedback, track your progress, and land your dream job.
              Built by <strong>NexaAura IT Solutions</strong> for serious candidates.
            </p>

            <div className="hero-actions">
              <button
                onClick={() => navigate("/resume")}
                className="hero-btn hero-btn-primary"
              >
                Start Free Practice
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>

              <button
                onClick={() => navigate("/questions")}
                className="hero-btn hero-btn-secondary"
              >
                Browse Questions
              </button>
            </div>

            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {!videoError ? (
              <video
                className="hero-video"
                autoPlay
                loop
                muted
                playsInline
                onError={() => setVideoError(true)}
              >
                <source src={HERO_VIDEO_SOURCE} type="video/mp4" />
              </video>
            ) : (
              <div className="hero-placeholder">
                <div className="placeholder-icon">🎯</div>
                <div className="placeholder-text">AI Interview Practice</div>
              </div>
            )}
            <div className="video-overlay"></div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Everything you need to succeed</h2>
            <p className="section-description">
              Comprehensive tools and features to prepare you for any interview
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => {
              const FeatureCard = (
                <motion.div
                  key={index}
                  className={`feature-card ${feature.link ? 'feature-card-clickable' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  onClick={feature.link ? () => navigate(feature.link) : undefined}
                  style={feature.link ? { cursor: 'pointer' } : {}}
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  {feature.link && (
                    <div className="feature-arrow">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  )}
                </motion.div>
              );
              return FeatureCard;
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title">Ready to ace your next interview?</h2>
            <p className="cta-description">
              Join thousands of professionals who have improved their interview skills with NexaAura InterviewAI
            </p>
            <div className="cta-actions">
              <button
                onClick={() => navigate("/resume")}
                className="cta-btn cta-btn-primary"
              >
                Get Started Free
              </button>
              <a
                href="https://nexaaura-doc-hub.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn cta-btn-secondary"
              >
                View Documentation
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="brand-icon">N</div>
              <div className="brand-text">
                <span className="brand-name">NexaAura InterviewAI</span>
                <span className="brand-subtitle">AI-Powered Interview Mastery</span>
              </div>
            </div>
            <p className="footer-description">
              Enterprise-grade interview preparation platform built by NexaAura IT Solutions
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-heading">Product</h4>
              <Link to="/questions" className="footer-link">Question Bank</Link>
              <Link to="/resume" className="footer-link">AI Interview</Link>
              <Link to="/ai-generator" className="footer-link">AI Generator</Link>
              <Link to="/mock-interviewer" className="footer-link">Mock Interview</Link>
              <Link to="/report" className="footer-link">Reports</Link>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Company</h4>
              <a href="https://www.nexaurait.online" target="_blank" rel="noopener noreferrer" className="footer-link">
                About Us
              </a>
              <a href="https://nexaaura-doc-hub.vercel.app/" target="_blank" rel="noopener noreferrer" className="footer-link">
                Documentation
              </a>
              <a href="mailto:nexaaurait@gmail.com" className="footer-link">Contact</a>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Contact</h4>
              <a href="mailto:nexaaurait@gmail.com" className="footer-link">nexaaurait@gmail.com</a>
              <a href="tel:+917991666248" className="footer-link">+91 7991 666 248</a>
              <a href="https://wa.me/917991666248" target="_blank" rel="noopener noreferrer" className="footer-link">
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2024 NexaAura IT Solutions. All rights reserved.
          </p>
          <div className="footer-social">
            <a href="https://www.nexaurait.online" target="_blank" rel="noopener noreferrer" className="social-link">
              Website
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default EnhancedHome;
