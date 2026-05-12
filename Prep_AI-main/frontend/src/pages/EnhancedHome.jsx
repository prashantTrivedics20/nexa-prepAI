import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/design-system.css";
import "./EnhancedHome.css";

function EnhancedHome() {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
      title: "AI-Powered Feedback",
      description: "Get instant, detailed feedback on every answer with advanced AI analysis",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      ),
      title: "Voice Interview Mode",
      description: "Practice speaking naturally with real-time voice recognition",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      ),
      title: "AI Question Generator",
      description: "Generate personalized questions based on your resume, role, or weak topics",
      link: "/ai-generator",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      title: "AI Mock Interviewer",
      description: "Practice with a conversational AI interviewer that asks follow-up questions",
      link: "/mock-interviewer",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
      ),
      title: "Progress Analytics",
      description: "Track your improvement with comprehensive performance metrics",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      title: "Question Bank",
      description: "Access 300+ curated interview questions across multiple domains",
      link: "/questions",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          <line x1="9" y1="10" x2="15" y2="10"></line>
          <line x1="12" y1="7" x2="12" y2="13"></line>
        </svg>
      ),
      title: "AI Chat Assistant",
      description: "Get help structuring answers with our intelligent chatbot",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      ),
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

  const detailedFeatures = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ),
      title: "Real-time AI Analysis",
      description: "Advanced natural language processing evaluates your responses instantly",
      details: [
        "Analyzes communication clarity and structure",
        "Evaluates technical depth and accuracy",
        "Provides specific improvement suggestions",
        "Compares against industry best practices"
      ],
      benefit: "Improve 3x faster with targeted feedback"
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      title: "Practice Anytime, Anywhere",
      description: "No scheduling needed - practice whenever you're ready",
      details: [
        "24/7 availability with instant AI responses",
        "Works on desktop, tablet, and mobile",
        "No waiting for human reviewers",
        "Practice at your own pace"
      ],
      benefit: "Build confidence on your schedule"
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
      ),
      title: "Personalized Learning Path",
      description: "AI adapts to your experience level and goals",
      details: [
        "Resume-based question generation",
        "Role-specific interview scenarios",
        "Difficulty adjusts to your skill level",
        "Focus on your weak areas automatically"
      ],
      benefit: "Practice exactly what you'll be asked"
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18"></path>
          <path d="M18 17V9"></path>
          <path d="M13 17V5"></path>
          <path d="M8 17v-3"></path>
        </svg>
      ),
      title: "Track Your Progress",
      description: "Comprehensive analytics show your improvement over time",
      details: [
        "Performance trends with visual charts",
        "Strength and weakness breakdown",
        "Session history with detailed reports",
        "Benchmark against successful candidates"
      ],
      benefit: "Know exactly where you stand"
    }
  ];

  const benefits = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      ),
      title: "Save Time",
      description: "Practice anytime without scheduling mock interviews or waiting for feedback"
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      title: "Cost Effective",
      description: "Get unlimited practice for free - no expensive coaching needed"
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      ),
      title: "Learn Faster",
      description: "AI feedback helps you improve 3x faster than traditional methods"
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      ),
      title: "Private & Safe",
      description: "Practice in a judgment-free environment without pressure"
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      title: "Always Available",
      description: "24/7 access to AI interviewer - practice whenever you want"
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ),
      title: "Proven Results",
      description: "95% of users report improved confidence and performance"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Upload Your Resume",
      description: "Start by uploading your resume or entering your skills and target role. Our AI analyzes your background to create a personalized experience.",
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      )
    },
    {
      step: "02",
      title: "Choose Your Practice Mode",
      description: "Select from text-based practice, voice interviews, or conversational AI mock interviews. Pick from our question bank or generate custom ones.",
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="10 8 16 12 10 16 10 8"></polyline>
        </svg>
      )
    },
    {
      step: "03",
      title: "Practice & Get Feedback",
      description: "Answer questions naturally while our AI analyzes your responses in real-time. Get instant feedback on content, structure, and delivery.",
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      )
    },
    {
      step: "04",
      title: "Review & Improve",
      description: "Study your performance analytics, review detailed feedback, and track progress over time. Focus on weak areas and watch your scores improve.",
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 3v18h18"></path>
          <path d="M18 17V9"></path>
          <path d="M13 17V5"></path>
          <path d="M8 17v-3"></path>
        </svg>
      )
    }
  ];

  const useCases = [
    {
      title: "Job Seekers",
      description: "Prepare for upcoming interviews with company-specific questions and feedback",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
      )
    },
    {
      title: "Career Switchers",
      description: "Practice explaining your career transition and build confidence in your story",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="17 1 21 5 17 9"></polyline>
          <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
          <polyline points="7 23 3 19 7 15"></polyline>
          <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
        </svg>
      )
    },
    {
      title: "Fresh Graduates",
      description: "Learn how to answer behavioral questions and present your projects effectively",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
        </svg>
      )
    },
    {
      title: "Tech Professionals",
      description: "Practice technical interviews, system design, and coding explanations",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      )
    },
    {
      title: "Interview Coaches",
      description: "Use our platform to train clients and track their progress with analytics",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      title: "HR Teams",
      description: "Help candidates prepare better and improve your interview pipeline quality",
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at Google",
      initials: "PS",
      quote: "NexaAura InterviewAI helped me land my dream job at Google. The AI feedback was incredibly detailed and helped me improve my answers significantly.",
      rating: 5
    },
    {
      name: "Rahul Verma",
      role: "Product Manager at Microsoft",
      initials: "RV",
      quote: "The voice interview feature is a game-changer. It helped me practice speaking clearly and confidently, which made a huge difference in my actual interviews.",
      rating: 5
    },
    {
      name: "Ananya Patel",
      role: "Data Scientist at Amazon",
      initials: "AP",
      quote: "I was able to practice 100+ questions in just 2 weeks. The personalized question generator based on my resume was exactly what I needed.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "Is NexaAura InterviewAI really free?",
      answer: "Yes! We offer a comprehensive free tier that includes access to our question bank, AI feedback, and basic analytics. Premium features like unlimited AI-generated questions and advanced analytics are available in our paid plans."
    },
    {
      question: "How accurate is the AI feedback?",
      answer: "Our AI is trained on thousands of real interview responses and uses advanced natural language processing. It provides feedback comparable to experienced interview coaches, with 95% user satisfaction rating."
    },
    {
      question: "Can I practice for specific companies?",
      answer: "Absolutely! You can generate questions tailored to specific companies, roles, and technologies. Our AI understands different interview styles and can simulate company-specific interview formats."
    },
    {
      question: "Does it work for non-technical interviews?",
      answer: "Yes! While we have extensive technical question coverage, we also support behavioral, situational, and role-specific questions for all industries including marketing, sales, finance, and more."
    },
    {
      question: "How is this different from other interview prep tools?",
      answer: "Unlike static question banks, we provide real-time AI feedback, conversational mock interviews, voice practice, and personalized question generation based on your resume. It's like having a personal interview coach available 24/7."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take security seriously. All your data is encrypted, and we never share your information with third parties. Your resume and practice sessions are completely private."
    }
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
            <div className="hero-gradient-mesh">
              {/* Animated gradient orbs */}
              <div className="gradient-orb gradient-orb-1"></div>
              <div className="gradient-orb gradient-orb-2"></div>
              <div className="gradient-orb gradient-orb-3"></div>
              
              {/* Floating elements */}
              <div className="floating-element floating-element-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div className="element-label">Interview Ready</div>
              </div>
              
              <div className="floating-element floating-element-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
                <div className="element-label">AI Powered</div>
              </div>
              
              <div className="floating-element floating-element-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                <div className="element-label">Track Progress</div>
              </div>
              
              {/* Center mockup card */}
              <div className="hero-mockup-card">
                <div className="mockup-header">
                  <div className="mockup-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <div className="mockup-title">AI Interview Assistant</div>
                </div>
                <div className="mockup-content">
                  <div className="mockup-message">
                    <div className="message-avatar">AI</div>
                    <div className="message-text">
                      <div className="message-label">AI Interviewer</div>
                      <div className="message-bubble">Tell me about your experience with React...</div>
                    </div>
                  </div>
                  <div className="mockup-message mockup-message-user">
                    <div className="message-text">
                      <div className="message-label">You</div>
                      <div className="message-bubble">I have 3 years of experience building...</div>
                    </div>
                    <div className="message-avatar">You</div>
                  </div>
                  <div className="mockup-typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
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
                  <div className="feature-icon-svg">{feature.icon}</div>
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

      {/* Detailed Features Section */}
      <section className="detailed-features-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Powerful features that set you apart</h2>
            <p className="section-description">
              Advanced AI technology designed to give you a competitive edge
            </p>
          </motion.div>

          <div className="detailed-features-list">
            {detailedFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="detailed-feature-item"
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="detailed-feature-icon-svg">{feature.icon}</div>
                <div className="detailed-feature-content">
                  <h3 className="detailed-feature-title">{feature.title}</h3>
                  <p className="detailed-feature-description">{feature.description}</p>
                  <ul className="detailed-feature-list">
                    {feature.details.map((detail, idx) => (
                      <li key={idx}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        {detail}
                      </li>
                    ))}
                  </ul>
                  <div className="detailed-feature-benefit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span className="benefit-text">{feature.benefit}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">How it works</h2>
            <p className="section-description">
              Get started in minutes and see results in days
            </p>
          </motion.div>

          <div className="how-it-works-grid">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                className="how-it-works-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="step-number">{step.step}</div>
                <div className="step-icon-svg">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Why choose NexaAura InterviewAI?</h2>
            <p className="section-description">
              The smartest way to prepare for your next interview
            </p>
          </motion.div>

          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="benefit-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="benefit-icon-svg">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="use-cases-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Perfect for everyone</h2>
            <p className="section-description">
              Whether you're a student, professional, or career switcher
            </p>
          </motion.div>

          <div className="use-cases-grid">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                className="use-case-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="use-case-icon-svg">{useCase.icon}</div>
                <h3 className="use-case-title">{useCase.title}</h3>
                <p className="use-case-description">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Loved by professionals worldwide</h2>
            <p className="section-description">
              See what our users have to say about their success
            </p>
          </motion.div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  ))}
                </div>
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.initials}</div>
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

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Frequently asked questions</h2>
            <p className="section-description">
              Everything you need to know about NexaAura InterviewAI
            </p>
          </motion.div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="faq-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </motion.div>
            ))}
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
