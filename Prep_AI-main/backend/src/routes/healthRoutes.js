const express = require("express");
const mongoose = require("mongoose");
const { getActiveProvider } = require("../services/xaiClient");

const router = express.Router();

/**
 * Basic health check endpoint
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

/**
 * Detailed health check with dependencies
 */
router.get("/health/detailed", async (req, res) => {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    services: {},
  };

  // Check MongoDB connection
  try {
    const dbState = mongoose.connection.readyState;
    const dbStates = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    health.services.database = {
      status: dbState === 1 ? "healthy" : "unhealthy",
      state: dbStates[dbState] || "unknown",
      name: mongoose.connection.name || "unknown",
    };

    if (dbState !== 1) {
      health.status = "degraded";
    }
  } catch (error) {
    health.services.database = {
      status: "unhealthy",
      error: error.message,
    };
    health.status = "degraded";
  }

  // Check AI service configuration
  try {
    const aiProvider = getActiveProvider();
    const hasApiKey = Boolean(process.env.GROQ_API_KEY || process.env.GROK_API_KEY || process.env.XAI_API_KEY);

    health.services.ai = {
      status: hasApiKey ? "healthy" : "unhealthy",
      provider: aiProvider,
      configured: hasApiKey,
    };

    if (!hasApiKey) {
      health.status = "degraded";
    }
  } catch (error) {
    health.services.ai = {
      status: "unhealthy",
      error: error.message,
    };
    health.status = "degraded";
  }

  // Memory usage
  const memUsage = process.memoryUsage();
  health.memory = {
    rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
  };

  const statusCode = health.status === "healthy" ? 200 : 503;
  res.status(statusCode).json(health);
});

/**
 * Readiness probe (for Kubernetes/Docker)
 */
router.get("/ready", async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        ready: false,
        reason: "Database not connected",
      });
    }

    // Check if AI service is configured
    const hasApiKey = Boolean(process.env.GROQ_API_KEY || process.env.GROK_API_KEY || process.env.XAI_API_KEY);
    if (!hasApiKey) {
      return res.status(503).json({
        ready: false,
        reason: "AI service not configured",
      });
    }

    res.status(200).json({
      ready: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      ready: false,
      reason: error.message,
    });
  }
});

/**
 * Liveness probe (for Kubernetes/Docker)
 */
router.get("/live", (req, res) => {
  res.status(200).json({
    alive: true,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
