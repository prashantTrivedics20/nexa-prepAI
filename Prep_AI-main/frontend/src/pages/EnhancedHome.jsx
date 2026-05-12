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

  const detailedFeatures = [
    {
      icon: "🎯",
      title: "AI-Powered Feedback Engine",
      description: "Get instant, actionable feedback on every answer",
      details: [
        "Real-time analysis of your responses using advanced NLP",
        "Detailed scoring across communication, technical depth, and clarity",
        "Personalized improvement suggestions for each answer",
        "Compare your answers with industry-standard responses"
      ],
      benefit: "Improve 3x faster with targeted feedback"
    },
    {
      icon: "🎤",
      title: "Voice Interview Simulation",
      description: "Practice speaking naturally like a real interview",
      details: [
        "Real-time speech-to-text with 98% accuracy",
        "Natural conversation flow with AI interviewer",
        "Pronunciation and clarity analysis",
        "Practice answering under time pressure"
      ],
      benefit: "Build confidence for in-person interviews"
    },
    {
      icon: "🤖",
      title: "Smart Question Generator",
      description: "Get questions tailored to your profile and goals",
      details: [
        "Upload your resume for personalized questions",
        "Target specific roles, companies, or technologies",
        "Focus on your weak areas for targeted improvement",
        "Generate unlimited practice questions on-demand"
      ],
      benefit: "Practice exactly what you'll be asked"
    },
    {
      icon: "📊",
      title: "Advanced Analytics Dashboard",
      description: "Track your progress with comprehensive metrics",
      details: [
        "Performance trends over time with visual charts",
        "Strength and weakness identification by topic",
        "Detailed session history with replay capability",
        "Benchmark against top performers"
      ],
      benefit: "Know exactly where you stand"
    }
  ];

  const benefits = [
    {
      icon: "⚡",
      title: "Save Time",
      description: "Practice anytime, anywhere without scheduling mock interviews or waiting for feedback"
    },
    {
      icon: "💰",
      title: "Cost Effective",
      description: "Get unlimited practice for free - no expensive coaching or interview prep courses needed"
    },
    {
      icon: "🎓",
      title: "Learn Faster",
      description: "AI feedback helps you improve 3x faster than traditional practice methods"
    },
    {
      icon: "🔒",
      title: "Private & Safe",
      description: "Practice in a judgment-free environment - make mistakes and learn without pressure"
    },
    {
      icon: "🌍",
      title: "Always Available",
      description: "24/7 access to AI interviewer - practice at 2 AM or during your lunch break"
    },
    {
      icon: "📈",
      title: "Proven Results",
      description: "95% of our users report improved confidence and better interview performance"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Upload Your Resume",
      description: "Start by uploading your resume or manually entering your skills and target role. Our AI analyzes your background to create a personalized interview experience.",
      icon: "📄"
    },
    {
      step: "02",
      title: "Choose Your Practice Mode",
      description: "Select from text-based practice, voice interview simulation, or conversational AI mock interviews. Pick questions from our bank or generate custom ones.",
      icon: "🎯"
    },
    {
      step: "03",
      title: "Practice & Get Feedback",
      description: "Answer questions naturally while our AI analyzes your responses in real-time. Get instant feedback on content, structure, and delivery.",
      icon: "💬"
    },
    {
      step: "04",
      title: "Review & Improve",
      description: "Study your performance analytics, review detailed feedback, and track your progress over time. Focus on weak areas and watch your scores improve.",
      icon: "📊"
    }
  ];

  const useCases = [
    {
      title: "Job Seekers",
      description: "Prepare for upcoming interviews with company-specific questions and get feedback on your answers",
      icon: "💼"
    },
    {
      title: "Career Switchers",
      description: "Practice answering questions about your career transition and build confidence in explaining your journey",
      icon: "🔄"
    },
    {
      title: "Fresh Graduates",
      description: "Learn how to answer behavioral questions and present your projects effectively to potential employers",
      icon: "🎓"
    },
    {
      title: "Tech Professionals",
      description: "Practice technical interviews, system design questions, and coding problem explanations",
      icon: "💻"
    },
    {
      title: "Interview Prep Coaches",
      description: "Use our platform to train your clients and track their progress with detailed analytics",
      icon: "👨‍🏫"
    },
    {
      title: "HR Teams",
      description: "Help candidates prepare better and improve the quality of your interview pipeline",
      icon: "🏢"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Software Engineer at Google",
      image: "👩‍💻",
      quote: "NexaAura InterviewAI helped me land my dream job at Google. The AI feedback was incredibly detailed and helped me improve my answers significantly.",
      rating: 5
    },
    {
      name: "Rahul Verma",
      role: "Product Manager at Microsoft",
      image: "👨‍💼",
      quote: "The voice interview feature is a game-changer. It helped me practice speaking clearly and confidently, which made a huge difference in my actual interviews.",
      rating: 5
    },
    {
      name: "Ananya Patel",
      role: "Data Scientist at Amazon",
      image: "👩‍🔬",
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
                <div className="element-icon">💼</div>
                <div className="element-label">Interview Ready</div>
              </div>
              
              <div className="floating-element floating-element-2">
                <div className="element-icon">🎯</div>
                <div className="element-label">AI Powered</div>
              </div>
              
              <div className="floating-element floating-element-3">
                <div className="element-icon">📊</div>
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
                    <div className="message-avatar">🤖</div>
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
                    <div className="message-avatar">👤</div>
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
                <div className="detailed-feature-icon">{feature.icon}</div>
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
                    <span className="benefit-badge">✨ Benefit:</span>
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
                <div className="step-icon">{step.icon}</div>
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
                <div className="benefit-icon">{benefit.icon}</div>
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
                <div className="use-case-icon">{useCase.icon}</div>
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
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div className="testimonial-author">
                  <div className="author-image">{testimonial.image}</div>
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
