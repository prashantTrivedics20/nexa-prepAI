# ✅ Deployment Checklist

Quick checklist to deploy PrepAI application.

---

## 🗄️ Database (MongoDB Atlas)

- [ ] Create MongoDB Atlas account
- [ ] Create free cluster (M0)
- [ ] Create database user
- [ ] Whitelist all IPs (0.0.0.0/0)
- [ ] Copy connection string
- [ ] Replace password in connection string

---

## 🔧 Backend (Render)

- [ ] Push backend code to GitHub
- [ ] Create Render account
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set root directory to `backend`
- [ ] Configure build command: `npm install`
- [ ] Configure start command: `npm start`
- [ ] Add environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000`
  - [ ] `MONGODB_URI=<your-mongodb-uri>`
  - [ ] `JWT_SECRET=<32-char-random-string>`
  - [ ] `GROQ_API_KEY=<your-groq-key>`
  - [ ] `ALLOWED_ORIGINS=<will-update-later>`
- [ ] Deploy service
- [ ] Wait for deployment to complete
- [ ] Copy backend URL
- [ ] Test health endpoint: `/health`

---

## 🎨 Frontend (Vercel)

- [ ] Create `.env.production` in frontend folder
- [ ] Add `VITE_API_BASE_URL=<your-render-backend-url>/api`
- [ ] Push frontend code to GitHub
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set root directory to `frontend` (if monorepo)
- [ ] Set framework preset to Vite
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`
- [ ] Add environment variable:
  - [ ] `VITE_API_BASE_URL=<your-render-backend-url>/api`
- [ ] Deploy project
- [ ] Wait for deployment to complete
- [ ] Copy frontend URL

---

## 🔄 Final Configuration

- [ ] Go back to Render backend
- [ ] Update `ALLOWED_ORIGINS` environment variable
- [ ] Add your Vercel frontend URL
- [ ] Save and redeploy backend
- [ ] Test complete application flow

---

## ✅ Verification

- [ ] Visit frontend URL
- [ ] Sign up for new account
- [ ] Upload resume
- [ ] Practice a question
- [ ] Generate AI questions
- [ ] Start mock interview
- [ ] Check practice history
- [ ] Test voice features
- [ ] Check all pages load correctly

---

## 🎯 URLs to Save

**Frontend (Vercel):**
```
https://your-app.vercel.app
```

**Backend (Render):**
```
https://your-backend.onrender.com
```

**MongoDB:**
```
mongodb+srv://user:pass@cluster.mongodb.net/prepai
```

---

## 📝 Environment Variables Summary

### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
GROQ_API_KEY=your-groq-key
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

---

## 🚨 Common Issues

**Backend not starting?**
- Check all environment variables are set
- Verify MongoDB connection string
- Check Render logs

**Frontend can't connect to backend?**
- Verify VITE_API_BASE_URL is correct
- Check CORS settings in backend
- Ensure backend is running

**CORS errors?**
- Update ALLOWED_ORIGINS in backend
- Include both www and non-www versions
- Redeploy backend

---

## 🎉 Done!

Your application is now live and ready to use!

**Next Steps:**
- Share with users
- Monitor logs
- Set up custom domain (optional)
- Enable analytics (optional)
