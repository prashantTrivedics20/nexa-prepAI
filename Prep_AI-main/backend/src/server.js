const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { sanitizeInput } = require("./middleware/validation");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.text({ type: "text/plain" }));

// Security: Sanitize all inputs
app.use(sanitizeInput);

// Request logging middleware (development only)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Health check routes (should be before other routes)
app.use("/", require("./routes/healthRoutes"));

// API ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/interview", require("./routes/interviewRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/test", require("./routes/testRoutes"));

// Backward-compatible aliases (without /api prefix)
app.use("/auth", require("./routes/authRoutes"));
app.use("/interview", require("./routes/interviewRoutes"));
app.use("/resume", require("./routes/resumeRoutes"));
app.use("/test", require("./routes/testRoutes"));

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    name: "NexaAura InterviewAI API",
    version: "1.0.0",
    description: "Enterprise-grade AI interview preparation platform",
    company: "NexaAura IT Solutions",
    website: "https://www.nexaurait.online",
    contact: {
      email: "nexaaurait@gmail.com",
      phone: "+917991666248",
      whatsapp: "https://wa.me/917991666248"
    },
    status: "running",
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      interview: "/api/interview",
      resume: "/api/resume",
      test: "/api/test",
    },
  });
});

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});
