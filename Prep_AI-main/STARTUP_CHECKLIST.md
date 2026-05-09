# 🚀 Startup Checklist - NexaAura InterviewAI

## ✅ Pre-Flight Checklist

Follow these steps **in order** to ensure everything works correctly.

---

## 1️⃣ Backend Setup

### Step 1: Install Dependencies
```bash
cd Prep_AI-main/backend
npm install
```

### Step 2: Configure Environment
Check `backend/.env` file exists with:
```env
# MongoDB
MONGODB_URI=mongodb+srv://pk980480_db_user:ib4SgHzOVPow8rIc@cluster0.c3vguvv.mongodb.net/prepai

# JWT
JWT_SECRET=your-secret-key-change-in-production

# AI Service
XAI_API_KEY=your-xai-api-key-here

# Server
PORT=5000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

### Step 3: Start Backend Server
```bash
npm run dev
```

### Step 4: Verify Backend is Running
You should see:
```
✓ MongoDB connected successfully
✓ Server running on port 5000
✓ Environment: development
✓ Health check: http://localhost:5000/health
```

### Step 5: Test Backend API
```bash
# In a new terminal
cd Prep_AI-main/backend
node test-api.js
```

Expected output:
```
✓ Health Check: 200 OK
✓ Root: 200 OK
✓ Login: 200 OK
✓ Get Questions: 200 OK
...
```

---

## 2️⃣ Frontend Setup

### Step 1: Install Dependencies
```bash
cd Prep_AI-main/frontend
npm install
```

### Step 2: Configure Environment
Check `frontend/.env` file exists with:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 3: Start Frontend Server
```bash
npm run dev
```

### Step 4: Verify Frontend is Running
You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 3️⃣ Complete Functionality Test

### Test 1: Login
1. Open browser: http://localhost:5173
2. Click "Login" button
3. Enter credentials:
   - Email: `admin@test.com`
   - Password: `admin123`
4. Should see your name in top-right corner

**✅ Success:** You're logged in
**❌ Failure:** Check backend logs for errors

---

### Test 2: Upload Resume
1. Go to "Resume" page
2. Drag & drop a PDF resume OR click to browse
3. Click "Upload & Analyze Resume"
4. Should see: **"Resume uploaded and saved to your account! 🎉"**

**✅ Success:** Resume saved to database
**❌ Failure:** Check:
- Are you logged in?
- Is backend running?
- Check backend console for errors

---

### Test 3: Practice Questions
1. Go to "Question Bank" page
2. Click on any question
3. Type an answer (at least 50 characters)
4. Click "Submit Answer"
5. Should see AI feedback with score

**Backend Console Should Show:**
```
Saving practice session for user: [userId]
Practice session saved successfully: [sessionId]
```

**✅ Success:** Practice session saved
**❌ Failure:** Check:
- Are you logged in?
- Check backend console for "No user authenticated" message
- Verify auth token exists: `localStorage.getItem('prepai-auth-token')`

---

### Test 4: Practice History
1. Go to "Reports" page (or Practice History)
2. Should see:
   - Total Practice Sessions: 1 (or more)
   - Your recent practice session listed

**✅ Success:** History shows your sessions
**❌ Failure:** Check:
- Did you complete Test 3?
- Are you logged in?
- Check backend console for errors

---

### Test 5: Data Persistence (Logout/Login)
1. Click your profile → Logout
2. Click "Login" again
3. Enter same credentials
4. Go to "Resume" page → Resume should auto-load
5. Go to "Reports" page → History should still show

**✅ Success:** All data persists after logout
**❌ Failure:** Check:
- Was resume uploaded while logged in?
- Were practice sessions completed while logged in?
- Check MongoDB database directly

---

## 4️⃣ Database Verification

### Check MongoDB Atlas:
1. Go to: https://cloud.mongodb.com/
2. Login to your account
3. Browse Collections → `prepai` database
4. Check collections:
   - `users` - Should have your user
   - `resumes` - Should have your resume
   - `practicesessions` - Should have your practice sessions

---

## 5️⃣ Common Issues & Quick Fixes

### Issue: "Cannot connect to backend"
**Fix:**
```bash
# Check if backend is running
curl http://localhost:5000/health

# If not running, start it:
cd Prep_AI-main/backend
npm run dev
```

---

### Issue: "Practice sessions not saving"
**Fix:**
1. Check you're logged in (see name in top-right)
2. Restart backend server (Ctrl+C, then `npm run dev`)
3. Check backend console for "Saving practice session" message
4. Verify auth token: Open DevTools (F12) → Console:
   ```javascript
   localStorage.getItem('prepai-auth-token')
   ```

---

### Issue: "Resume not persisting after logout"
**Fix:**
1. Make sure you're logged in BEFORE uploading resume
2. Look for success message: "saved to your account"
3. Check backend console for: `POST /api/resume/upload 200`
4. Verify in MongoDB: `db.resumes.find({})`

---

### Issue: "Port 5000 already in use"
**Fix:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F

# Or change port in backend/.env
PORT=5001
```

---

## 6️⃣ Development Workflow

### Daily Startup:
```bash
# Terminal 1: Backend
cd Prep_AI-main/backend
npm run dev

# Terminal 2: Frontend
cd Prep_AI-main/frontend
npm run dev

# Terminal 3: Testing (optional)
cd Prep_AI-main/backend
node test-api.js
```

### Before Committing Code:
1. ✅ Test all functionality
2. ✅ Check for console errors
3. ✅ Run API test script
4. ✅ Verify data persists after logout

---

## 7️⃣ Production Deployment

### Pre-Deployment Checklist:
- [ ] Update `MONGODB_URI` to production database
- [ ] Set strong `JWT_SECRET` (use: `openssl rand -base64 32`)
- [ ] Update `ALLOWED_ORIGINS` to production URLs
- [ ] Set `NODE_ENV=production`
- [ ] Configure XAI_API_KEY
- [ ] Test all functionality in production environment
- [ ] Set up MongoDB Atlas IP whitelist
- [ ] Enable HTTPS
- [ ] Set up monitoring/logging

---

## 📞 Need Help?

### Debug Information to Collect:
1. Backend console output (last 50 lines)
2. Frontend browser console (F12 → Console)
3. Network tab (F12 → Network) - Check failed requests
4. MongoDB connection status
5. Environment variables (without sensitive data)

### Contact:
- Email: nexaaurait@gmail.com
- Phone: +91 7991 666 248
- WhatsApp: https://wa.me/917991666248

---

## ✅ Success Criteria

You're ready to go when:
- ✅ Backend starts without errors
- ✅ Frontend connects to backend
- ✅ Login works
- ✅ Resume uploads and persists
- ✅ Practice sessions save and show in history
- ✅ Data persists after logout/login
- ✅ All pages load without errors

---

**Last Updated:** 2026-05-09
**Version:** 1.0.0
