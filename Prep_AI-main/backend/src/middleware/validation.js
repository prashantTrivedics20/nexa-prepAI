const mongoose = require("mongoose");

/**
 * Sanitize string input to prevent XSS and injection attacks
 */
function sanitizeString(value) {
  if (typeof value !== "string") return value;
  
  return value
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
}

/**
 * Recursively sanitize object properties
 */
function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === "object") {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Middleware to sanitize request body
 */
exports.sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  
  next();
};

/**
 * Validate MongoDB ObjectId
 */
exports.validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName] || req.body[paramName] || req.query[paramName];
    
    if (!id) {
      return res.status(400).json({
        error: `Missing required parameter: ${paramName}`,
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: `Invalid ${paramName} format. Expected MongoDB ObjectId.`,
      });
    }
    
    next();
  };
};

/**
 * Validate required fields in request body
 */
exports.validateRequired = (fields = []) => {
  return (req, res, next) => {
    const missing = [];
    
    for (const field of fields) {
      const value = req.body[field];
      
      if (value === undefined || value === null || value === "") {
        missing.push(field);
      }
    }
    
    if (missing.length > 0) {
      return res.status(400).json({
        error: "Missing required fields",
        missingFields: missing,
      });
    }
    
    next();
  };
};

/**
 * Validate email format
 */
exports.validateEmail = (fieldName = "email") => {
  return (req, res, next) => {
    const email = req.body[fieldName];
    
    if (!email) {
      return next();
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: `Invalid ${fieldName} format`,
      });
    }
    
    next();
  };
};

/**
 * Validate string length
 */
exports.validateLength = (fieldName, min = 0, max = Infinity) => {
  return (req, res, next) => {
    const value = req.body[fieldName];
    
    if (!value) {
      return next();
    }
    
    if (typeof value !== "string") {
      return res.status(400).json({
        error: `${fieldName} must be a string`,
      });
    }
    
    const length = value.trim().length;
    
    if (length < min) {
      return res.status(400).json({
        error: `${fieldName} must be at least ${min} characters long`,
      });
    }
    
    if (length > max) {
      return res.status(400).json({
        error: `${fieldName} must be at most ${max} characters long`,
      });
    }
    
    next();
  };
};

/**
 * Validate number range
 */
exports.validateRange = (fieldName, min = -Infinity, max = Infinity) => {
  return (req, res, next) => {
    const value = req.body[fieldName];
    
    if (value === undefined || value === null) {
      return next();
    }
    
    const num = Number(value);
    
    if (!Number.isFinite(num)) {
      return res.status(400).json({
        error: `${fieldName} must be a valid number`,
      });
    }
    
    if (num < min || num > max) {
      return res.status(400).json({
        error: `${fieldName} must be between ${min} and ${max}`,
      });
    }
    
    next();
  };
};

/**
 * Validate enum values
 */
exports.validateEnum = (fieldName, allowedValues = []) => {
  return (req, res, next) => {
    const value = req.body[fieldName];
    
    if (!value) {
      return next();
    }
    
    if (!allowedValues.includes(value)) {
      return res.status(400).json({
        error: `Invalid ${fieldName}. Allowed values: ${allowedValues.join(", ")}`,
      });
    }
    
    next();
  };
};
