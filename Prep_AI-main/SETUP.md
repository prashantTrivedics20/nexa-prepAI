# PrepAI Local Setup Guide

This guide will help you set up PrepAI for local development and testing.

## Prerequisites

- **Node.js** 20+ (recommended)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas account)
- **AI API Key** (Groq or xAI)

## Step 1: Clone the Repository

```bash
git clone https://github.com/Ankit052003/Prep_AI.git
cd Prep_AI
```

## Step 2: Set Up MongoDB

### Option A: Local MongoDB

1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   - **Windows**: MongoDB should start automatically as a service
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`
3. Your connection string will be: `mongodb://localhost:27017/prepai`

### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with password
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string (looks like): `mongodb+srv://<username>:<password>@cluster.mongodb.net/prepai`

## Step 3: Get AI API Keys

### Option A: Groq (Recommended - includes STT support)

1. Visit [console.groq.com](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key (starts with `gsk_`)
5. Copy the key for use in `.env` file

**Benefits**: Free tier available, supports both chat completion and speech-to-text (Whisper)

### Option B: xAI (Grok)

1. Visit [console.x.ai](https://console.x.ai/)
2. Sign up for an account
3. Create an API key (starts with `xai-`)
4. Copy the key for use in `.env` file

**Note**: xAI does not support speech-to-text in this setup. Voice features will not work.

## Step 4: Configure Backend

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   # Copy the example file
   cp ../.env.example .env
   ```

4. Edit `backend/.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   
   # Your MongoDB connection string
   MONGO_URI=mongodb://localhost:27017/prepai
   
   # Generate a secure random string for JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this
   
   # Choose your AI provider
   AI_PROVIDER=groq
   
   # Add your Groq API key
   GROQ_API_KEY=gsk_your_actual_api_key_here
   GROQ_API_BASE=https://api.groq.com/openai/v1
   GROQ_MODEL=llama-3.1-8b-instant
   GROQ_STT_MODEL=whisper-large-v3-turbo
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   Server running on port 5000
   MongoDB Connected
   ```

## Step 5: Configure Frontend

1. Open a new terminal and navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   # Create the file
   touch .env
   ```

4. Edit `frontend/.env`:
   ```env
   # Backend URL for Vite proxy
   VITE_BACKEND_URL=http://localhost:5000
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE v8.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ```

## Step 6: Test the Application

1. Open your browser and navigate to: `http://localhost:5173`
2. You should see the PrepAI landing page
3. Click "Get Started" or "Sign Up" to create an account
4. Test the features:
   - Sign up / Login
   - Upload a resume (PDF only)
   - Start an interview
   - Answer questions (text or voice)
   - View the report

## Troubleshooting

### Backend won't start

**Error**: `MongooseServerSelectionError`
- **Solution**: Check if MongoDB is running and the connection string is correct

**Error**: `GROK_API_KEY is not set`
- **Solution**: Make sure you've added your API key to `backend/.env`

### Frontend can't connect to backend

**Error**: Network errors or 404 responses
- **Solution**: Ensure backend is running on port 5000
- **Solution**: Check that `VITE_BACKEND_URL` in `frontend/.env` is correct

### Voice features not working

**Issue**: Voice recording or transcription fails
- **Solution**: Make sure you're using Groq as the AI provider (xAI doesn't support STT)
- **Solution**: Check browser microphone permissions
- **Solution**: Verify `GROQ_API_KEY` is valid and has STT access

### Resume upload fails

**Issue**: PDF upload returns an error
- **Solution**: Ensure the file is a valid PDF
- **Solution**: Check backend logs for parsing errors
- **Solution**: Try a simpler PDF without complex formatting

## Environment Variables Reference

### Backend Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 5000 | Backend server port |
| `NODE_ENV` | No | development | Environment mode |
| `MONGO_URI` | **Yes** | - | MongoDB connection string |
| `JWT_SECRET` | **Yes** | - | Secret key for JWT tokens |
| `AI_PROVIDER` | No | xai | AI provider: "groq" or "xai" |
| `GROQ_API_KEY` | **Yes*** | - | Groq API key (if using Groq) |
| `GROK_API_KEY` | **Yes*** | - | xAI API key (if using xAI) |
| `GROQ_MODEL` | No | llama-3.1-8b-instant | Groq chat model |
| `GROQ_STT_MODEL` | No | whisper-large-v3-turbo | Groq STT model |

*One of `GROQ_API_KEY` or `GROK_API_KEY` is required

### Frontend Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_BACKEND_URL` | No | http://localhost:5000 | Backend URL for proxy |
| `VITE_API_BASE_URL` | No | - | Direct API base URL (bypasses proxy) |

## Next Steps

- Customize interview domains in the backend
- Add more question types
- Enhance the evaluation algorithm
- Deploy to production (see deployment guides)

## Support

For issues and questions:
- Check the [main README](./README.md)
- Review backend logs in the terminal
- Check browser console for frontend errors
- Open an issue on GitHub

## License

MIT License - see [LICENSE](./LICENSE)
