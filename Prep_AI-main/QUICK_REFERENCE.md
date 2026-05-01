# Quick Reference Guide - NexaAura InterviewAI

## 🚀 Quick Start

### Start Development Servers
```bash
# Terminal 1 - Backend
cd Prep_AI-main/backend
npm start

# Terminal 2 - Frontend
cd Prep_AI-main/frontend
npm run dev
```

### Access Application
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## 📁 Project Structure

```
Prep_AI-main/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth, validation, errors
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── services/       # AI, resume, speech services
│   │   └── server.js       # Express server
│   ├── .env                # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── assets/         # Images, icons
    │   ├── components/     # Reusable components
    │   ├── context/        # React context
    │   ├── pages/          # Page components
    │   ├── services/       # API, auth services
    │   ├── styles/         # CSS files
    │   ├── utils/          # Helper functions
    │   ├── App.jsx         # Main app component
    │   ├── index.css       # Global styles
    │   └── main.jsx        # Entry point
    ├── .env                # Environment variables
    └── package.json
```

## 🎨 Key Pages

### 1. Landing Page
- **File**: `frontend/src/pages/EnhancedHome.jsx`
- **Route**: `/`
- **Features**: Hero, stats, features, tracks, testimonials

### 2. Resume Upload
- **File**: `frontend/src/pages/ResumePage.jsx`
- **Route**: `/resume`
- **Features**: PDF upload, parsing, preview

### 3. Interview
- **File**: `frontend/src/pages/Interview.jsx`
- **Route**: `/interview`
- **Features**: Questions, text/voice input, confidence analysis

### 4. Report
- **File**: `frontend/src/pages/ReportPage.jsx`
- **Route**: `/report`
- **Features**: Scores, analytics, history, graphs

### 5. Auth
- **File**: `frontend/src/pages/Signup.jsx`
- **Route**: `/signup`
- **Features**: Login, register, Google OAuth

## 🔧 Key Components

### Navigation
- `Navbar.jsx` - Main navigation bar
- `AuthProfileMenu.jsx` - User profile dropdown
- `ThemeToggleButton.jsx` - Dark mode toggle

### UI Components
- `Toast.jsx` - Notifications
- `ConfirmDialog.jsx` - Confirmation modals
- `LoadingSpinner.jsx` - Loading indicators
- `EmptyState.jsx` - Empty placeholders

### Interview Components
- `InterviewScreen.jsx` - Interview flow
- `ReportScreen.jsx` - Report display
- `ResumeUpload.jsx` - File upload

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/google/config` - Google config

### Resume
- `POST /api/resume/upload` - Upload resume
- `GET /api/resume/me` - Get user resume
- `DELETE /api/resume/me` - Delete resume

### Interview
- `POST /api/interview/start` - Start interview
- `POST /api/interview/answer` - Submit answer
- `POST /api/interview/finish` - Finish interview
- `POST /api/interview/voice-answer` - Voice answer

### Test/AI
- `POST /api/test/stt` - Speech-to-text
- `POST /api/test/tts` - Text-to-speech

## 🎨 Design Tokens

### Colors
```css
--brand-500: #4d6bff;      /* Primary blue */
--brand-600: #3b56e0;      /* Darker blue */
--sky-400: #6fd0ff;        /* Sky blue */
--ink-900: #0a1022;        /* Dark text */
--ink-700: #243452;        /* Medium text */
--ink-500: #506381;        /* Light text */
```

### Spacing
```css
0.25rem = 4px
0.5rem = 8px
1rem = 16px
1.5rem = 24px
2rem = 32px
```

### Breakpoints
```css
Mobile: < 640px
Tablet: 640px - 1050px
Desktop: > 1050px
```

## 🔐 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
GROQ_API_KEY=gsk_...
PORT=5001
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5001/api
VITE_GOOGLE_CLIENT_ID=your_client_id
```

## 🧪 Testing Checklist

### Manual Testing
- [ ] Landing page loads
- [ ] Sign up works
- [ ] Login works
- [ ] Google OAuth works
- [ ] Resume upload works
- [ ] Interview starts
- [ ] Text answers work
- [ ] Voice recording works
- [ ] Report generates
- [ ] Dark mode toggles
- [ ] Mobile responsive

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## 🐛 Common Issues

### Issue: Backend won't start
**Solution**: Check MongoDB connection string in `.env`

### Issue: Frontend can't connect to backend
**Solution**: Verify `VITE_API_URL` in frontend `.env`

### Issue: Google OAuth not working
**Solution**: Check `VITE_GOOGLE_CLIENT_ID` is set

### Issue: Voice recording fails
**Solution**: Check microphone permissions in browser

### Issue: Resume upload fails
**Solution**: Ensure file is PDF and < 10MB

## 📝 Quick Commands

### Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev          # Frontend
npm start            # Backend

# Build for production
npm run build        # Frontend

# Run linter
npm run lint         # Frontend
```

### Git Commands
```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "message"

# Push to remote
git push origin main

# Create new branch
git checkout -b feature-name
```

## 🎓 Learning Resources

### Technologies Used
- **Frontend**: React, Vite, Framer Motion, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **AI**: Groq API (Llama models)
- **Auth**: JWT, Google OAuth
- **Speech**: Web Speech API, MediaRecorder API

### Documentation Links
- React: https://react.dev
- Vite: https://vitejs.dev
- Express: https://expressjs.com
- MongoDB: https://www.mongodb.com/docs
- Framer Motion: https://www.framer.com/motion

## 📞 Support

### Contact Information
- **Email**: nexaaurait@gmail.com
- **Phone**: +91 7991 666 248
- **Website**: https://www.nexaurait.online

### Getting Help
1. Check documentation files
2. Review error messages
3. Check browser console
4. Contact support team

## 🎉 Features Overview

### ✅ Implemented
- Resume upload and parsing
- AI interview questions
- Text and voice answers
- Confidence analysis
- Score calculation
- Report generation
- Interview history
- Dark mode
- Google OAuth
- Responsive design

### 🔮 Coming Soon
- Interview recording playback
- PDF report export
- Email sharing
- Interview scheduling
- Practice mode
- Custom questions

---

**Last Updated**: May 1, 2026
**Version**: 1.0.0
**Company**: NexaAura IT Solutions
