# 🎯 NexaAura InterviewAI

> AI-Powered Interview Preparation Platform

Enterprise-grade interview preparation platform with AI-powered feedback, mock interviews, and personalized question generation.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)
[![Backend on Render](https://img.shields.io/badge/Backend-Render-46E3B7)](https://render.com)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248)](https://www.mongodb.com/cloud/atlas)

---

## ✨ Features

### 🎤 **AI Mock Interviewer**
- Conversational AI interviewer
- 5 interviewer styles (Friendly, Professional, Technical, Tough, Casual)
- Real-time follow-up questions
- Live feedback during interview
- Comprehensive post-interview report
- Voice-enabled interviews

### 🤖 **AI Question Generator**
- **7 Generation Modes:**
  - Resume-Based Questions
  - Role-Specific Questions
  - Company-Specific Questions
  - Weak Topics Questions
  - Scenario-Based Questions
  - Behavioral Questions (STAR format)
  - Adaptive Questions (performance-based)

### 📚 **Question Bank**
- 300+ curated interview questions
- Multiple categories and difficulty levels
- Practice with instant AI feedback
- Track your progress

### 🎙️ **Voice AI Assistant**
- Speech-to-text for answers
- Text-to-speech for questions
- Natural conversation flow
- Hands-free practice mode

### 📊 **Progress Tracking**
- Detailed practice history
- Performance analytics
- Category-wise breakdown
- Time tracking
- Score trends

### 📄 **Resume Analysis**
- Upload and parse resumes
- Generate personalized questions
- Skills-based recommendations

---

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Routing:** React Router v7
- **Styling:** Custom CSS + Design System
- **Animations:** Framer Motion
- **HTTP Client:** Axios
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT
- **AI Service:** Groq API
- **File Upload:** Multer
- **PDF Parsing:** pdf-parse
- **Deployment:** Render

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Groq API key

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend URL
npm run dev
```

---

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy

**Backend (Render):**
1. Push to GitHub
2. Connect to Render
3. Add environment variables
4. Deploy

**Frontend (Vercel):**
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

---

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
GROQ_API_KEY=your-groq-key
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend (.env)
```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

---

## 📖 API Documentation

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/random` - Get random question
- `POST /api/questions/submit` - Submit answer
- `GET /api/questions/history` - Get practice history
- `GET /api/questions/analytics` - Get analytics

### AI Question Generator
- `POST /api/question-generator/generate/resume` - Resume-based
- `POST /api/question-generator/generate/role` - Role-specific
- `POST /api/question-generator/generate/company` - Company-specific
- `POST /api/question-generator/generate/weak-topics` - Weak topics
- `POST /api/question-generator/generate/scenario` - Scenario-based
- `POST /api/question-generator/generate/behavioral` - Behavioral
- `POST /api/question-generator/generate/adaptive` - Adaptive

### Mock Interviewer
- `POST /api/mock-interviewer/start` - Start interview
- `POST /api/mock-interviewer/continue` - Continue conversation
- `POST /api/mock-interviewer/end` - End and get report
- `GET /api/mock-interviewer/history` - Get interview history

### Resume
- `POST /api/resume/upload` - Upload resume
- `GET /api/resume/me` - Get my resume
- `DELETE /api/resume/me` - Delete resume

---

## 🎨 Features in Detail

### Mock Interview Flow
```
Setup → Interview → Report
  ↓         ↓          ↓
Role    Questions   Scores
Style   Feedback    Analysis
Level   Follow-ups  Recommendations
```

### Question Generator Modes

1. **Resume-Based**: Analyzes your resume and generates relevant questions
2. **Role-Specific**: Questions tailored to specific job roles
3. **Company-Specific**: Questions based on company culture and interview style
4. **Weak Topics**: Focuses on areas where you need improvement
5. **Scenario-Based**: Real-world problem-solving scenarios
6. **Behavioral**: STAR format behavioral questions
7. **Adaptive**: AI adjusts difficulty based on your performance

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License - see LICENSE file for details

---

## 👨‍💻 Author

**Prashant Kumar Trivedi**
- Email: nexaaurait@gmail.com
- Company: NexaAura IT Solutions
- Website: https://www.nexaurait.online
- Phone: +91 7991 666 248

---

## 🙏 Acknowledgments

- Groq for AI API
- MongoDB Atlas for database
- Vercel for frontend hosting
- Render for backend hosting
- All open-source contributors

---

## 📞 Support

For support, email nexaaurait@gmail.com or visit our website.

---

## 🎉 Live Demo

**Frontend:** [https://prepai.vercel.app](https://prepai.vercel.app)
**Backend:** [https://prepai-backend.onrender.com](https://prepai-backend.onrender.com)

---

Made with ❤️ by NexaAura IT Solutions
