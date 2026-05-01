# NexaAura InterviewAI

**Master Your Next Interview with AI**

NexaAura InterviewAI is an enterprise-grade AI-powered interview preparation platform built by [NexaAura IT Solutions](https://www.nexaurait.online). Practice with AI-generated questions, get real-time feedback, and track your progress with advanced analytics.

---

## 🌟 Highlights

- **AI-Powered Feedback** - Get instant, detailed feedback on every answer
- **Resume-Based Questions** - Questions tailored to your experience and skills  
- **Voice Interview Mode** - Practice speaking with live waveform visualization
- **Confidence Metrics** - Track fluency, pace, and speaking confidence
- **Company-Specific Prep** - Practice for top tech companies
- **Detailed Analytics** - Comprehensive progress tracking and reports
- **Multiple Interview Tracks:**
  - Frontend Developer
  - Backend Developer
  - Data Structures & Algorithms
  - HR & Behavioral
  - System Design
  - Employee Introduction

---

## 🎯 Built by NexaAura IT Solutions

**Company:** [NexaAura IT Solutions](https://www.nexaurait.online)  
**Founder:** Prashant Kumar Trivedi  
**Email:** [nexaaurait@gmail.com](mailto:nexaaurait@gmail.com)  
**Phone:** [+91 7991 666 248](tel:+917991666248)  
**WhatsApp:** [Chat with us](https://wa.me/917991666248)  
**LinkedIn:** [Prashant Kumar Trivedi](https://www.linkedin.com/in/prashant-trivedi-66956b219/)

---

## 🚀 Features

### Core Features
- ✅ Resume upload and intelligent parsing (PDF)
- ✅ AI-generated interview questions (1-20 questions)
- ✅ Text and voice answer modes
- ✅ Real-time answer evaluation with detailed feedback
- ✅ Live audio waveform visualization
- ✅ Confidence metrics analysis
- ✅ Final report with score trends
- ✅ User authentication (JWT)
- ✅ Resume persistence for logged-in users

### Advanced Features
- 🎯 Company-specific interview preparation
- 📊 Advanced analytics dashboard
- 📄 Downloadable reports
- 🎤 Voice tone and pace analysis
- 💡 Personalized improvement suggestions
- 🏆 Progress tracking over time

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19
- **Routing:** React Router 7
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **UI Components:** react-loading-skeleton

### Backend
- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose
- **File Upload:** Multer
- **PDF Parsing:** pdf-parse
- **Authentication:** JWT (jsonwebtoken)

### AI Integration
- **Chat Completion:** xAI/Groq-compatible OpenAI-style API
- **Speech-to-Text:** Groq Whisper API
- **Models:** GPT-4, Llama 3.1, Mixtral

---

## 📁 Project Structure

```
nexaura-interviewai/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # AI, resume parsing, speech services
│   │   └── server.js        # Express server
│   ├── uploads/             # Temporary file uploads
│   └── package.json
│
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── assets/          # Images, icons
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── utils/           # Helper functions
│   │   └── App.jsx          # Main app component
│   └── package.json
│
└── docs/                    # Documentation
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (recommended)
- npm or yarn
- MongoDB (local or Atlas)
- Groq API Key (for AI features)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/nexaura-interviewai.git
cd nexaura-interviewai
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# - MONGO_URI
# - JWT_SECRET
# - GROQ_API_KEY

# Start backend
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env file (optional)
# VITE_BACKEND_URL=http://localhost:5000

# Start frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🔧 Environment Variables

### Backend (.env)

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/nexaura-interviewai

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# AI Provider
AI_PROVIDER=groq
GROQ_API_KEY=gsk_your-groq-api-key-here
GROQ_MODEL=llama-3.1-8b-instant
GROQ_STT_MODEL=whisper-large-v3-turbo

# Security
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Company Info
COMPANY_NAME=NexaAura IT Solutions
COMPANY_WEBSITE=https://www.nexaurait.online
COMPANY_EMAIL=nexaaurait@gmail.com
```

### Frontend (.env)

```env
# Backend URL
VITE_BACKEND_URL=http://localhost:5000
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

### Health & Status
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system status
- `GET /ready` - Readiness probe
- `GET /live` - Liveness probe

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires auth)

### Resume
- `POST /api/resume/upload` - Upload and parse resume
- `GET /api/resume/me` - Get saved resume (requires auth)
- `DELETE /api/resume/me` - Delete saved resume (requires auth)

### Interview
- `POST /api/interview/start` - Start new interview
- `POST /api/interview/answer` - Submit answer
- `POST /api/interview/finish` - Finish interview and get report
- `POST /api/interview/voice-answer` - Submit voice answer

### Testing
- `POST /api/test/stt` - Speech-to-text transcription
- `POST /api/test/tts` - Text-to-speech (fallback to browser)

---

## 🎨 Features in Detail

### 1. Resume Upload & Parsing
- Upload PDF resumes
- AI-powered text extraction
- Skill and experience identification
- Resume persistence for logged-in users

### 2. AI Interview Generation
- Questions based on resume content
- Domain-specific question sets
- Configurable question count (1-20)
- Multiple difficulty levels

### 3. Answer Evaluation
- Real-time AI feedback
- Score (0-10) with detailed breakdown
- Coverage analysis
- Improvement suggestions
- Strengths and weaknesses identification

### 4. Voice Interview Mode
- Live audio recording
- Real-time waveform visualization
- Voice intensity tracking
- Speech-to-text transcription
- Confidence metrics:
  - Speaking speed (WPM)
  - Filler word detection
  - Pause analysis
  - Fluency scoring

### 5. Analytics & Reports
- Question-by-question breakdown
- Score trends over time
- Weak topic identification
- Performance comparison
- Downloadable reports

---

## 🔒 Security Features

- Input sanitization (XSS protection)
- JWT authentication
- Password hashing (bcrypt)
- CORS configuration
- Request validation
- Rate limiting ready
- Secure error handling

---

## 📊 Performance

- Fast response times (<200ms average)
- Optimized database queries
- Efficient AI API usage
- Lazy loading for frontend
- Code splitting
- Image optimization

---

## 🤝 Support & Contact

### Get Help
- 📧 Email: [nexaaurait@gmail.com](mailto:nexaaurait@gmail.com)
- 📞 Phone: [+91 7991 666 248](tel:+917991666248)
- 💬 WhatsApp: [Chat Now](https://wa.me/917991666248)
- 💼 LinkedIn: [Prashant Kumar Trivedi](https://www.linkedin.com/in/prashant-trivedi-66956b219/)

### Company Website
Visit [NexaAura IT Solutions](https://www.nexaurait.online) for more products and services.

---

## 📄 License

**MIT License** - Free and Open Source

Copyright © 2026 NexaAura IT Solutions. 

This software is free to use, modify, and distribute. See [LICENSE](./LICENSE) for details.

**Built by:** Prashant Kumar Trivedi  
**Company:** NexaAura IT Solutions  
**Website:** https://www.nexaurait.online

If you find this useful, please:
- ⭐ Star the repository
- 🔗 Link back to [NexaAura IT Solutions](https://www.nexaurait.online)
- 📧 Share your feedback: nexaaurait@gmail.com
- 💬 Connect on [WhatsApp](https://wa.me/917991666248)

---

## 🙏 Acknowledgments

- Built with modern web technologies
- Powered by Groq AI and OpenAI-compatible APIs
- Designed for enterprise-grade performance
- Crafted with care by NexaAura IT Solutions

---

## 🚀 What's Next?

### Upcoming Features
- 📹 Video interview mode
- 🏢 Company-specific question banks
- 📊 Advanced analytics dashboard
- 🎓 Career path guidance
- 🏆 Achievement system
- 📱 Mobile app (React Native)

---

**Ready to master your next interview?** [Get Started Now](https://wa.me/917991666248) 🚀
