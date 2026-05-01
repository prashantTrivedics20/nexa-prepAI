/**
 * Centralized error handling middleware
 */

function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

/**
 * Format error response
 */
function formatErrorResponse(error, req) {
  const response = {
    error: error.message || "An unexpected error occurred",
    timestamp: new Date().toISOString(),
    path: req.originalUrl || req.url,
  };

  // Add stack trace in development
  if (isDevelopment()) {
    response.stack = error.stack;
    response.details = error.details || null;
  }

  return response;
}

/**
 * Log error for monitoring
 */
function logError(error, req) {
  const logData = {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl || req.url,
    error: error.message,
    stack: error.stack,
    userId: req.user?.userId || "anonymous",
    ip: req.ip || req.connection?.remoteAddress,
  };

  // In production, you'd send this to a logging service (e.g., Winston, Sentry)
  console.error("[ERROR]", JSON.stringify(logData, null, 2));
}

/**
 * Determine HTTP status code from error
 */
function getStatusCode(error) {
  // Mongoose validation errors
  if (error.name === "ValidationError") {
    return 400;
  }

  // Mongoose cast errors (invalid ObjectId)
  if (error.name === "CastError") {
    return 400;
  }

  // Mongoose duplicate key errors
  if (error.code === 11000) {
    return 409;
  }

  // JWT errors
  if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    return 401;
  }

  // Custom status code
  if (error.statusCode) {
    return error.statusCode;
  }

  // Default to 500
  return 500;
}

/**
 * Format Mongoose validation errors
 */
function formatValidationError(error) {
  const errors = {};

  if (error.errors) {
    for (const field in error.errors) {
      errors[field] = error.errors[field].message;
    }
  }

  return {
    error: "Validation failed",
    validationErrors: errors,
  };
}

/**
 * Format Mongoose duplicate key errors
 */
function formatDuplicateKeyError(error) {
  const field = Object.keys(error.keyPattern || {})[0];
  const value = error.keyValue?.[field];

  return {
    error: `Duplicate value for ${field}: ${value}`,
    field,
  };
}

/**
 * Main error handler middleware
 */
exports.errorHandler = (error, req, res, next) => {
  // Log the error
  logError(error, req);

  // Get status code
  const statusCode = getStatusCode(error);

  // Format response based on error type
  let response;

  if (error.name === "ValidationError") {
    response = formatValidationError(error);
  } else if (error.code === 11000) {
    response = formatDuplicateKeyError(error);
  } else {
    response = formatErrorResponse(error, req);
  }

  // Send response
  res.status(statusCode).json(response);
};

/**
 * 404 Not Found handler
 */
exports.notFoundHandler = (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl || req.url,
    method: req.method,
    availableRoutes: [
      "POST /api/auth/signup",
      "POST /api/auth/login",
      "GET /api/auth/me",
      "POST /api/resume/upload",
      "GET /api/resume/me",
      "POST /api/interview/start",
      "POST /api/interview/answer",
      "POST /api/interview/finish",
      "POST /api/test/stt",
    ],
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
exports.asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Create custom error
 */
exports.createError = (message, statusCode = 500, details = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
};
