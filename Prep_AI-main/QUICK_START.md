# ⚡ Quick Start Guide

Get your PrepAI application deployed in 30 minutes!

---

## 🎯 What You'll Need

1. **GitHub Account** - [Sign up](https://github.com/signup)
2. **Vercel Account** - [Sign up](https://vercel.com/signup)
3. **Render Account** - [Sign up](https://render.com/register)
4. **MongoDB Atlas** - [Sign up](https://www.mongodb.com/cloud/atlas/register)
5. **Groq API Key** - [Get key](https://console.groq.com/)

---

## 📝 Step-by-Step (30 Minutes)

### ⏱️ Step 1: MongoDB Setup (5 min)

1. Go to MongoDB Atlas → Create free cluster
2. Create database user (save password!)
3. Network Access → Allow 0.0.0.0/0
4. Get connection string:
   ```
   mongodb+srv://user:PASSWORD@cluster.mongodb.net/prepai
   ```

### ⏱️ Step 2: Get Groq API Key (2 min)

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up / Log in
3. Create API key
4. Copy and save it

### ⏱️ Step 3: Deploy Backend (10 min)

1. **Push to GitHub:**
   ```bash
   cd Prep_AI-main
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Render:**
   - Go to Render → New Web Service
   - Connect GitHub repo
   - Root directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   
3. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<generate-32-char-random-string>
   GROQ_API_KEY=<your-groq-key>
   ALLOWED_ORIGINS=*
   ```

4. **Deploy** → Wait 5 minutes → Copy backend URL

### ⏱️ Step 4: Deploy Frontend (10 min)

1. **Update Frontend .env:**
   ```bash
   cd frontend
   echo "VITE_API_BASE_URL=https://your-backend.onrender.com/api" > .env.production
   ```

2. **Deploy on Vercel:**
   - Go to Vercel → New Project
   - Import GitHub repo
   - Root directory: `frontend`
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`
   
3. **Add Environment Variable:**
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   ```

4. **Deploy** → Wait 3 minutes → Copy frontend URL

### ⏱️ Step 5: Update CORS (3 min)

1. Go back to Render backend
2. Update `ALLOWED_ORIGINS`:
   ```
   https://your-frontend.vercel.app
   ```
3. Save → Auto redeploys

---

## ✅ Test Your Deployment

1. Visit your Vercel URL
2. Sign up for account
3. Try these features:
   - Upload resume
   - Practice question
   - Generate AI questions
   - Start mock interview
   - Check history

---

## 🎉 You're Live!

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`

---

## 🐛 Quick Fixes

**Backend not working?**
```bash
# Check Render logs
# Verify all env variables are set
# Test: https://your-backend.onrender.com/health
```

**Frontend can't connect?**
```bash
# Check VITE_API_BASE_URL in Vercel
# Verify CORS in backend
# Check browser console
```

**CORS errors?**
```bash
# Update ALLOWED_ORIGINS in Render
# Include your Vercel URL
# Redeploy backend
```

---

## 📚 Next Steps

- [ ] Set up custom domain
- [ ] Enable analytics
- [ ] Monitor logs
- [ ] Share with users!

---

## 💡 Pro Tips

1. **Free Tier Limits:**
   - Render: Sleeps after 15 min inactivity
   - Vercel: 100 GB bandwidth/month
   - MongoDB: 512 MB storage

2. **Keep Backend Awake:**
   - Use a cron job to ping every 10 minutes
   - Or upgrade to paid plan ($7/month)

3. **Monitor Performance:**
   - Check Render metrics
   - Use Vercel analytics
   - Monitor MongoDB usage

---

## 🆘 Need Help?

- 📖 Read [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- ✅ Check [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- 📧 Email: nexaaurait@gmail.com
- 📱 WhatsApp: +91 7991 666 248

---

**Happy Deploying! 🚀**
