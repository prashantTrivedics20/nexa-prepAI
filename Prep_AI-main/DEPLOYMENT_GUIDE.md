# 🚀 Deployment Guide - NexaAura InterviewAI

Complete guide to deploy your application on Vercel (Frontend) and Render (Backend).

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier)
- Render account (free tier)
- MongoDB Atlas account (free tier)
- Groq API key (free)

---

## 🗄️ Part 1: Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Click "Build a Database"
4. Choose **FREE** tier (M0)
5. Select region closest to you
6. Click "Create Cluster"

### Step 2: Configure Database Access

1. Go to **Database Access** (left sidebar)
2. Click "Add New Database User"
3. Username: `prepai_user`
4. Password: Generate a strong password (save it!)
5. Database User Privileges: **Read and write to any database**
6. Click "Add User"

### Step 3: Configure Network Access

1. Go to **Network Access** (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 4: Get Connection String

1. Go to **Database** (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `prepai`

Example:
```
mongodb+srv://prepai_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/prepai
```

---

## 🔧 Part 2: Backend Deployment (Render)

### Step 1: Push Code to GitHub

```bash
cd Prep_AI-main
git init
git add .
git commit -m "Initial commit - PrepAI Backend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/prepai-backend.git
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select `Prep_AI-main/backend` folder

### Step 3: Configure Service

**Basic Settings:**
- **Name**: `prepai-backend`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend` (if monorepo) or leave empty
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **Free** tier

### Step 4: Add Environment Variables

Click "Advanced" → "Add Environment Variable"

Add these variables:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://prepai_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/prepai
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
GROQ_API_KEY=your-groq-api-key-here
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

**Important:**
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Generate a strong `JWT_SECRET` (at least 32 characters)
- Get `GROQ_API_KEY` from [Groq Console](https://console.groq.com/)
- Update `ALLOWED_ORIGINS` after deploying frontend

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Once deployed, copy your backend URL:
   ```
   https://prepai-backend.onrender.com
   ```

### Step 6: Test Backend

Visit: `https://prepai-backend.onrender.com/health`

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2024-...",
  "uptime": 123.45
}
```

---

## 🎨 Part 3: Frontend Deployment (Vercel)

### Step 1: Update Environment Variable

1. Go to `Prep_AI-main/frontend`
2. Create `.env.production` file:

```env
VITE_API_BASE_URL=https://prepai-backend.onrender.com/api
```

Replace with your actual Render backend URL.

### Step 2: Push Frontend to GitHub

```bash
cd Prep_AI-main/frontend
git init
git add .
git commit -m "Initial commit - PrepAI Frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/prepai-frontend.git
git push -u origin main
```

### Step 3: Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select `prepai-frontend` repository

### Step 4: Configure Project

**Framework Preset:** Vite

**Build Settings:**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

**Root Directory:**
- If monorepo: `frontend`
- If separate repo: leave empty

### Step 5: Add Environment Variables

Click "Environment Variables"

Add:
```
VITE_API_BASE_URL=https://prepai-backend.onrender.com/api
```

### Step 6: Deploy

1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Once deployed, copy your frontend URL:
   ```
   https://prepai.vercel.app
   ```

### Step 7: Update Backend CORS

1. Go back to Render Dashboard
2. Open your backend service
3. Go to "Environment"
4. Update `ALLOWED_ORIGINS`:
   ```
   https://prepai.vercel.app,https://www.prepai.vercel.app
   ```
5. Click "Save Changes"
6. Service will automatically redeploy

---

## ✅ Part 4: Verification

### Test Complete Flow

1. **Visit Frontend**: `https://prepai.vercel.app`
2. **Sign Up**: Create a new account
3. **Upload Resume**: Test resume upload
4. **Practice Question**: Try answering a question
5. **AI Generator**: Generate AI questions
6. **Mock Interview**: Start a mock interview
7. **Check History**: View practice history

### Check Logs

**Backend Logs (Render):**
1. Go to Render Dashboard
2. Click on your service
3. Click "Logs" tab
4. Check for errors

**Frontend Logs (Vercel):**
1. Go to Vercel Dashboard
2. Click on your project
3. Click "Deployments"
4. Click on latest deployment
5. Check "Build Logs" and "Function Logs"

---

## 🔒 Part 5: Security Checklist

- [ ] Strong JWT_SECRET (32+ characters)
- [ ] MongoDB user has limited permissions
- [ ] CORS configured with specific origins
- [ ] API keys stored in environment variables
- [ ] .env files added to .gitignore
- [ ] HTTPS enabled (automatic on Vercel/Render)

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: "Cannot connect to MongoDB"**
- Check MongoDB connection string
- Verify IP whitelist (0.0.0.0/0)
- Check database user credentials

**Problem: "CORS error"**
- Update ALLOWED_ORIGINS in Render
- Include both www and non-www versions
- Redeploy backend after changes

**Problem: "Service unavailable"**
- Check Render logs
- Verify all environment variables are set
- Check if service is sleeping (free tier)

### Frontend Issues

**Problem: "API calls failing"**
- Check VITE_API_BASE_URL is correct
- Verify backend is running
- Check browser console for errors

**Problem: "Build failed"**
- Check Node version compatibility
- Verify all dependencies are installed
- Check build logs in Vercel

**Problem: "404 on refresh"**
- Verify vercel.json is present
- Check routing configuration

---

## 📊 Monitoring

### Render (Backend)

- **Free Tier Limits:**
  - 750 hours/month
  - Sleeps after 15 min inactivity
  - Wakes up on first request (cold start ~30s)

- **Monitor:**
  - Dashboard → Metrics
  - Check CPU, Memory, Requests

### Vercel (Frontend)

- **Free Tier Limits:**
  - 100 GB bandwidth/month
  - Unlimited deployments
  - Automatic HTTPS

- **Monitor:**
  - Dashboard → Analytics
  - Check page views, performance

---

## 🔄 Updates & Redeployment

### Update Backend

```bash
cd Prep_AI-main/backend
git add .
git commit -m "Update: description"
git push origin main
```

Render will automatically redeploy.

### Update Frontend

```bash
cd Prep_AI-main/frontend
git add .
git commit -m "Update: description"
git push origin main
```

Vercel will automatically redeploy.

---

## 🎯 Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `prepai.com`)
3. Follow DNS configuration instructions
4. Update backend ALLOWED_ORIGINS

### Add Custom Domain to Render

1. Go to Service Settings → Custom Domain
2. Add your domain (e.g., `api.prepai.com`)
3. Follow DNS configuration instructions
4. Update frontend VITE_API_BASE_URL

---

## 📞 Support

**Issues?**
- Check logs first
- Review environment variables
- Test locally before deploying
- Contact: nexaaurait@gmail.com

---

## 🎉 Congratulations!

Your PrepAI application is now live!

**Frontend**: https://prepai.vercel.app
**Backend**: https://prepai-backend.onrender.com

Share it with the world! 🚀
