import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeToggleButton from "../components/ThemeToggleButton";
import AuthProfileMenu from "../components/AuthProfileMenu";

const HERO_VIDEO_SOURCE = "/homepage.mp4";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 },
};

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
      description: "Practice speaking naturally with real-time waveform visualization",
    },
    {
      icon: "📊",
      title: "Progress Analytics",
      description: "Track your improvement with comprehensive performance metrics",
    },
    {
      icon: "🏢",
      title: "Company-Specific Prep",
      description: "Practice for Google, Amazon, Microsoft, and top tech companies",
    },
    {
      icon: "📝",
      title: "Resume-Based Questions",
      description: "Questions tailored to your experience and skills",
    },
    {
      icon: "⚡",
      title: "Instant Evaluation",
      description: "Real-time scoring with detailed improvement suggestions",
    },
  ];

  const stats = [
    { value: "2,000+", label: "Active Users" },
    { value: "50,000+", label: "Interviews Completed" },
    { value: "4.8/5", label: "User Rating" },
    { value: "95%", label: "Success Rate" },
  ];

  const interviewTracks = [
    { name: "Frontend Developer", icon: "⚛️", color: "#61dafb" },
    { name: "Backend Developer", icon: "🔧", color: "#68a063" },
    { name: "System Design", icon: "🏗️", color: "#f59e0b" },
    { name: "Data Structures", icon: "📊", color: "#8b5cf6" },
    { name: "HR Interview", icon: "💼", color: "#ec4899" },
    { name: "Behavioral", icon: "🗣️", color: "#3b82f6" },
  ];

  const testimonials = [
    {
      name: "Rahul Kumar",
      role: "Software Engineer at Google",
      image: "👨‍💻",
      text: "NexaAura InterviewAI helped me land my dream job at Google. The AI feedback was incredibly accurate and helped me improve my communication skills.",
    },
    {
      name: "Priya Sharma",
      role: "Product Manager at Microsoft",
      image: "👩‍💼",
      text: "The voice interview mode is a game-changer. I practiced for weeks and felt completely confident during my actual interviews.",
    },
    {
      name: "Amit Patel",
      role: "Full Stack Developer at Amazon",
      image: "👨‍💼",
      text: "Best interview prep platform I've used. The resume-based questions were spot-on and the analytics helped me track my progress.",
    },
  ];

  return (
    <div className="enhanced-home">
      {/* Navigation */}
      <nav className="enhanced-nav">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            <div className="brand-icon">N</div>
            <span className="brand-name">NexaAura InterviewAI</span>
          </Link>

          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#testimonials">Testimonials</a>
            <Link to="/report">My Progress</Link>
            <a 
              href="https://nexaaura-doc-hub.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                color: 'white',
                padding: '0.6rem 1.2rem',
                borderRadius: '10px',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
                animation: 'pulse 2s infinite',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              📚 NexaDoc
            </a>
          </div>

          <div className="nav-actions">
            <AuthProfileMenu />
            <ThemeToggleButton />
            <button className="btn-primary" onClick={() => navigate("/resume")}>
              Start Free Practice
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <motion.div
            className="hero-content"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div className="hero-badge" variants={fadeUp}>
              <span className="badge-dot"></span>
              <span>Trusted by 2,000+ professionals</span>
            </motion.div>

            <motion.h1 className="hero-title" variants={fadeUp}>
              Master Your Next Interview
              <span className="gradient-text"> with AI</span>
            </motion.h1>

            <motion.p className="hero-subtitle" variants={fadeUp}>
              Practice with AI-powered feedback, track your progress, and land your dream job.
              Built by <strong>NexaAura IT Solutions</strong> for serious candidates.
            </motion.p>

            <motion.div className="hero-cta" variants={fadeUp}>
              <button
                className="btn-hero-primary"
                onClick={() => navigate("/resume")}
              >
                Start Free Practice
                <span className="btn-arrow">→</span>
              </button>
              <button
                className="btn-hero-secondary"
                onClick={() => navigate("/signup")}
              >
                <span className="play-icon">▶</span>
                Watch Demo
              </button>
            </motion.div>

            <motion.div className="hero-features" variants={fadeUp}>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <span>Free forever</span>
              </div>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <span>AI-powered feedback</span>
              </div>
            </motion.div>

            <motion.div 
              variants={fadeUp}
              style={{ 
                marginTop: '2rem',
                padding: '1.25rem 1.75rem',
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                borderRadius: '16px',
                border: '3px solid #FF6B6B',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                boxShadow: '0 8px 24px rgba(255, 107, 107, 0.4)',
                cursor: 'pointer'
              }}
              whileHover={{ scale: 1.02, boxShadow: '0 12px 32px rgba(255, 107, 107, 0.5)' }}
              onClick={() => window.open('https://nexaaura-doc-hub.vercel.app/', '_blank')}
            >
              <span style={{ fontSize: '2.5rem' }}>📚</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.35rem', color: 'white' }}>
                  Need Interview Prep Resources?
                </p>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.95)' }}>
                  Access DSA problems, system design guides & more on NexaDoc
                </p>
              </div>
              <div
                style={{
                  background: 'white',
                  color: '#FF6B6B',
                  padding: '0.85rem 1.75rem',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '1rem',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                Visit Now →
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-visual"
            variants={scaleIn}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="visual-card">
              <div className="card-header">
                <div className="card-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="card-title">Live Interview</span>
              </div>
              <div className="card-content">
                {!videoError ? (
                  <video
                    className="hero-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    onError={() => setVideoError(true)}
                  >
                    <source src={HERO_VIDEO_SOURCE} type="video/mp4" />
                  </video>
                ) : (
                  <div className="video-placeholder">
                    <div className="placeholder-icon">🎥</div>
                    <p>Interview in Progress</p>
                  </div>
                )}
              </div>
              <div className="card-footer">
                <div className="score-badge">
                  <span className="score-label">Score</span>
                  <span className="score-value">8.5/10</span>
                </div>
                <div className="status-badge">
                  <span className="status-dot"></span>
                  <span>AI Analyzing...</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="stat-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">
              Everything you need to <span className="gradient-text">ace interviews</span>
            </h2>
            <p className="section-subtitle">
              Powerful features designed to help you succeed in your next interview
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interview Tracks */}
      <section className="tracks-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Practice for any role</h2>
            <p className="section-subtitle">
              Specialized interview tracks for different positions
            </p>
          </motion.div>

          <div className="tracks-grid">
            {interviewTracks.map((track, index) => (
              <motion.div
                key={track.name}
                className="track-card"
                style={{ "--track-color": track.color }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="track-icon">{track.icon}</div>
                <div className="track-name">{track.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">How it works</h2>
            <p className="section-subtitle">Get started in 3 simple steps</p>
          </motion.div>

          <div className="steps-container">
            {[
              {
                step: "01",
                title: "Upload Your Resume",
                description: "Upload your resume and our AI will analyze your skills and experience",
                icon: "📄",
              },
              {
                step: "02",
                title: "Practice Interviews",
                description: "Answer AI-generated questions tailored to your profile and target role",
                icon: "🎯",
              },
              {
                step: "03",
                title: "Get Feedback & Improve",
                description: "Receive detailed feedback and track your progress over time",
                icon: "📈",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                className="step-card"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="step-number">{item.step}</div>
                <div className="step-icon">{item.icon}</div>
                <h3 className="step-title">{item.title}</h3>
                <p className="step-description">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Loved by professionals worldwide</h2>
            <p className="section-subtitle">
              See what our users have to say about their experience
            </p>
          </motion.div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.image}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NexaDoc Section */}
      <section className="nexadoc-section" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '4rem 2rem', margin: '4rem 0' }}>
        <div className="section-container">
          <motion.div
            className="nexadoc-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', color: 'white' }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', marginBottom: '1rem' }}>
              Need Interview Preparation Resources?
            </h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.95, maxWidth: '700px', margin: '0 auto 2rem' }}>
              Access comprehensive interview preparation materials, coding challenges, system design guides, and more on <strong>NexaDoc</strong> - your complete interview prep companion.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem 1.5rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                ✅ DSA Problems & Solutions
              </div>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem 1.5rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                ✅ System Design Guides
              </div>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem 1.5rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                ✅ Behavioral Questions
              </div>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem 1.5rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                ✅ Company-Specific Prep
              </div>
            </div>
            <motion.a
              href="https://nexaaura-doc-hub.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'white',
                color: '#667eea',
                padding: '1rem 2.5rem',
                borderRadius: '999px',
                fontSize: '1.1rem',
                fontWeight: '700',
                textDecoration: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 15px 40px rgba(0,0,0,0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              Visit NexaDoc →
            </motion.a>
          </motion.div>
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
            <p className="cta-subtitle">
              Join thousands of professionals who have improved their interview skills
            </p>
            <button
              className="btn-cta"
              onClick={() => navigate("/resume")}
            >
              Start Practicing Now - It's Free
            </button>
            <p className="cta-note">No credit card required • Free forever</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="enhanced-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="brand-icon">N</div>
                <span>NexaAura InterviewAI</span>
              </div>
              <p className="footer-tagline">
                Master your next interview with AI-powered practice
              </p>
              <div className="footer-social">
                <a href="https://www.linkedin.com/in/prashant-trivedi-66956b219/" target="_blank" rel="noopener noreferrer">
                  💼 LinkedIn
                </a>
                <a href="https://wa.me/917991666248" target="_blank" rel="noopener noreferrer">
                  💬 WhatsApp
                </a>
              </div>
            </div>

            <div className="footer-links">
              <h4>Product</h4>
              <Link to="/resume">Practice</Link>
              <Link to="/report">Analytics</Link>
              <Link to="/signup">Sign Up</Link>
              <a href="https://nexaaura-doc-hub.vercel.app/" target="_blank" rel="noopener noreferrer">
                NexaDoc
              </a>
            </div>

            <div className="footer-links">
              <h4>Company</h4>
              <a href="https://www.nexaurait.online" target="_blank" rel="noopener noreferrer">
                About Us
              </a>
              <a href="https://www.nexaurait.online/#services" target="_blank" rel="noopener noreferrer">
                Services
              </a>
              <a href="https://www.nexaurait.online/#contact" target="_blank" rel="noopener noreferrer">
                Contact
              </a>
            </div>

            <div className="footer-links">
              <h4>Contact</h4>
              <a href="mailto:nexaaurait@gmail.com">nexaaurait@gmail.com</a>
              <a href="tel:+917991666248">+91 7991 666 248</a>
              <a href="https://www.nexaurait.online" target="_blank" rel="noopener noreferrer">
                nexaurait.online
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 NexaAura IT Solutions. All rights reserved.</p>
            <p>Built with ❤️ by <a href="https://www.nexaurait.online" target="_blank" rel="noopener noreferrer">NexaAura IT Solutions</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default EnhancedHome;
