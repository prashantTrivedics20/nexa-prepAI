# 🔧 Troubleshooting Guide - NexaAura InterviewAI

## ⚠️ Common Issues & Solutions

### 1. Practice History Not Showing

#### **Symptoms:**
- Practice sessions show "0 Total Practice Sessions"
- Recent Practice Sessions section is empty
- Data disappears after logout

#### **Root Causes & Fixes:**

##### ✅ **Fix 1: Restart Backend Server**
The backend code was updated to add `optionalAuth` middleware. You MUST restart the server.

```bash
# Stop the backend server (Ctrl+C)
# Then restart:
cd Prep_AI-main/backend
npm run dev
```

##### ✅ **Fix 2: Verify User is Logged In**
Practice sessions are only saved for authenticated users.

**Check:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type: `localStorage.getItem('prepai-auth-token')`
4. Should return a token string (not null)

**If null:**
- Click "Login" button
- Enter credentials: `admin@test.com` / `admin123`
- Or create a new account

##### ✅ **Fix 3: Check Backend Logs**
When you submit an answer, check backend console for:

```
Saving practice session for user: [userId]
Practice session saved successfully: [sessionId]
```

**If you see:**
```
No user authenticated - practice session not saved
```
Then the auth token is not being sent. Check Fix 2.

##### ✅ **Fix 4: Verify Database Connection**
Check backend console on startup for:

```
✓ MongoDB connected successfully
✓ Server running on port 5000
```

**If MongoDB connection fails:**
- Check `.env` file has correct `MONGODB_URI`
- Verify MongoDB Atlas cluster is running
- Check network connectivity

---

### 2. Resume Not Persisting After Logout

#### **Symptoms:**
- Resume disappears after logout
- Need to re-upload resume every time

#### **Root Cause:**
Resume needs to be saved to database (not just localStorage)

#### **Fix:**

##### ✅ **Step 1: Verify You're Logged In**
Resume is only saved to database if you're authenticated.

**Check:**
- Look for your name/email in top-right corner
- Should see profile menu, not "Login" button

##### ✅ **Step 2: Upload Resume While Logged In**
1. Login first
2. Then upload resume
3. Look for success message: **"Resume uploaded and saved to your account! 🎉"**

**If you see:**
"Resume uploaded! Login to save it to your account. 🎉"
→ You're not logged in. Login first, then re-upload.

##### ✅ **Step 3: Verify Resume is in Database**
After upload, check backend console for:
```
POST /api/resume/upload 200
```

Test by:
1. Logout
2. Login again
3. Go to Resume page
4. Resume should automatically load

---

### 3. Backend Server Not Starting

#### **Symptoms:**
- `npm run dev` fails
- Port 5000 already in use
- MongoDB connection errors

#### **Fixes:**

##### ✅ **Fix 1: Port Already in Use**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F

# Or change port in .env
PORT=5001
```

##### ✅ **Fix 2: Missing Dependencies**
```bash
cd Prep_AI-main/backend
npm install
```

##### ✅ **Fix 3: MongoDB Connection**
Check `backend/.env` file:
```env
MONGODB_URI=mongodb+srv://pk980480_db_user:ib4SgHzOVPow8rIc@cluster0.c3vguvv.mongodb.net/prepai
JWT_SECRET=your-secret-key-here
XAI_API_KEY=your-xai-api-key
```

---

### 4. Frontend Not Connecting to Backend

#### **Symptoms:**
- API calls fail with 404 or CORS errors
- "Network Error" in console

#### **Fixes:**

##### ✅ **Fix 1: Check Backend URL**
`frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

##### ✅ **Fix 2: Verify Backend is Running**
Open: http://localhost:5000/health

Should see:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

##### ✅ **Fix 3: CORS Issues**
Backend `.env` should have:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174,http://localhost:3000
```

---

## 🧪 Complete Testing Checklist

### Backend Tests:

```bash
# 1. Start backend
cd Prep_AI-main/backend
npm run dev

# 2. Test health endpoint
curl http://localhost:5000/health

# 3. Test question endpoint
curl http://localhost:5000/api/questions

# 4. Check logs for:
# ✓ MongoDB connected successfully
# ✓ Server running on port 5000
```

### Frontend Tests:

```bash
# 1. Start frontend
cd Prep_AI-main/frontend
npm run dev

# 2. Open browser: http://localhost:5173

# 3. Test flow:
# - Login (admin@test.com / admin123)
# - Upload resume
# - Practice a question
# - Check Practice History
# - Logout
# - Login again
# - Verify data persists
```

---

## 🔍 Debug Mode

### Enable Detailed Logging:

**Backend** (`server.js`):
```javascript
// Already enabled in development mode
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}
```

**Frontend** (Browser Console):
```javascript
// Check auth token
console.log('Token:', localStorage.getItem('prepai-auth-token'));

// Check user
console.log('User:', localStorage.getItem('prepai-user'));

// Check resume
console.log('Resume:', localStorage.getItem('parsedResume'));
```

---

## 📞 Still Having Issues?

### Collect This Information:

1. **Backend Console Output** (last 20 lines)
2. **Frontend Browser Console** (F12 → Console tab)
3. **Network Tab** (F12 → Network tab) - Check failed requests
4. **Steps to Reproduce** - What exactly are you doing?
5. **Expected vs Actual** - What should happen vs what's happening?

### Quick Reset (Nuclear Option):

```bash
# Backend
cd Prep_AI-main/backend
rm -rf node_modules package-lock.json
npm install
npm run dev

# Frontend
cd Prep_AI-main/frontend
rm -rf node_modules package-lock.json
npm install
npm run dev

# Clear browser data
# F12 → Application → Clear storage → Clear site data
```

---

## ✅ Verification Commands

Run these to verify everything is working:

```bash
# Backend health
curl http://localhost:5000/health

# Questions endpoint
curl http://localhost:5000/api/questions

# Login test
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"admin123"}'
```

---

## 🎯 Expected Behavior

### After Fixes:

1. ✅ **Login** → Token saved to localStorage
2. ✅ **Upload Resume** → Saved to MongoDB + localStorage
3. ✅ **Practice Questions** → Sessions saved to MongoDB
4. ✅ **Check History** → Shows all sessions
5. ✅ **Logout** → Only token cleared, data stays in DB
6. ✅ **Login Again** → Resume auto-loads, history shows all sessions

---

## 📊 Database Schema

### Collections:

- **users** - User accounts
- **resumes** - User resumes (one per user)
- **practicesessions** - Practice history
- **interviews** - Interview sessions
- **questions** - Question bank

### Check MongoDB:

```javascript
// In MongoDB Compass or Atlas
db.practicesessions.find({}).sort({createdAt: -1}).limit(10)
db.resumes.find({})
```

---

## 🚀 Production Deployment

Before deploying:

1. ✅ Update `.env` with production values
2. ✅ Set `NODE_ENV=production`
3. ✅ Use strong `JWT_SECRET`
4. ✅ Configure proper CORS origins
5. ✅ Enable HTTPS
6. ✅ Set up MongoDB Atlas IP whitelist

---

**Last Updated:** 2026-05-09
**Version:** 1.0.0
**Support:** nexaaurait@gmail.com
