# 🔐 Google Login Setup Guide

Google login is currently **not configured**. Follow this guide to enable it.

---

## ⚠️ Current Status

**Google Login: ❌ NOT WORKING**

**Reason:** Missing `GOOGLE_CLIENT_ID` in environment variables.

**Impact:** Users can still use email/password login. Google login button will show but won't work.

---

## 🎯 Option 1: Enable Google Login (Recommended)

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

### Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Configure consent screen (if first time):
   - User Type: **External**
   - App name: `NexaAura InterviewAI`
   - User support email: `nexaaurait@gmail.com`
   - Developer contact: `nexaaurait@gmail.com`
   - Scopes: Add `email`, `profile`, `openid`
   - Test users: Add your email
   - Save and continue

4. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `PrepAI Web Client`
   
5. **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   http://localhost:5174
   https://your-frontend.vercel.app
   ```

6. **Authorized redirect URIs:**
   ```
   http://localhost:5173
   http://localhost:5174
   https://your-frontend.vercel.app
   ```

7. Click "Create"
8. **Copy the Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)

### Step 3: Add to Backend Environment

**Local Development:**

Edit `backend/.env`:
```env
# Add this line
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

**Production (Render):**

1. Go to Render Dashboard
2. Select your backend service
3. Go to "Environment"
4. Add new variable:
   ```
   GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```
5. Save (will auto-redeploy)

### Step 4: Add to Frontend Environment (Optional)

**Local Development:**

Edit `frontend/.env`:
```env
# Optional - frontend can fetch from backend
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

**Production (Vercel):**

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add:
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
   ```
5. Redeploy

### Step 5: Test

1. Restart backend: `npm run dev`
2. Restart frontend: `npm run dev`
3. Go to signup page
4. Click "Continue with Google"
5. Should open Google sign-in popup

---

## 🎯 Option 2: Disable Google Login (Quick Fix)

If you don't want to set up Google login right now, you can hide the button.

### Hide Google Login Button

Edit `frontend/src/pages/Signup.jsx`:

Find this section (around line 700):
```jsx
<div className="signup-socials">
  <button
    type="button"
    className="signup-social-google"
    onClick={handleGoogleAuth}
    disabled={isSubmitting || isGoogleSubmitting}
  >
    ...
  </button>
</div>
```

Replace with:
```jsx
{googleClientId && (
  <div className="signup-socials">
    <button
      type="button"
      className="signup-social-google"
      onClick={handleGoogleAuth}
      disabled={isSubmitting || isGoogleSubmitting}
    >
      ...
    </button>
  </div>
)}
```

This will hide the button if Google Client ID is not configured.

---

## 🐛 Troubleshooting

### Issue: "Google sign-in is not configured"

**Solution:** Add `GOOGLE_CLIENT_ID` to backend `.env`

### Issue: "Google sign-in script did not load"

**Solution:** 
- Check internet connection
- Verify `index.html` has the Google script
- Clear browser cache

### Issue: "Google sign-in popup was closed"

**Solution:**
- Allow popups in browser
- Try again
- Check browser console for errors

### Issue: "Google token audience mismatch"

**Solution:**
- Verify Client ID matches in backend and Google Console
- Check authorized origins in Google Console

### Issue: "Google email is not verified"

**Solution:**
- Verify email in Google account
- Use a different Google account

---

## 📝 Environment Variables Summary

### Backend (.env)
```env
# Required for Google login
GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com

# Optional (not currently used)
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Frontend (.env)
```env
# Optional - frontend can fetch from backend
VITE_GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
```

---

## ✅ Verification Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth Client ID created
- [ ] Authorized origins added
- [ ] Client ID copied
- [ ] Backend .env updated
- [ ] Backend restarted
- [ ] Frontend .env updated (optional)
- [ ] Frontend restarted
- [ ] Tested Google login
- [ ] Production env vars updated

---

## 🎉 Success!

Once configured, users can:
- Sign up with Google (one click)
- Login with Google (one click)
- No password needed
- Faster onboarding

---

## 📞 Need Help?

**Issues with Google OAuth?**
- Check Google Cloud Console logs
- Verify all URLs are correct
- Ensure OAuth consent screen is published
- Contact: nexaaurait@gmail.com

---

## 🔒 Security Notes

1. **Never commit** `.env` files to Git
2. **Keep Client Secret** secure (if using)
3. **Limit authorized origins** to your domains only
4. **Use HTTPS** in production
5. **Regularly rotate** credentials

---

## 💡 Alternative: Email/Password Only

If you prefer to keep it simple:
- Users can still sign up with email/password
- No Google setup needed
- Hide Google button (see Option 2 above)
- Fully functional without Google OAuth

---

**Current Status:** Google login is optional. Email/password login works perfectly! ✅
