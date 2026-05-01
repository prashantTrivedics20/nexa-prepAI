import { showToast } from "../components/Toast";

/**
 * Extract user-friendly error message from API error
 */
export function getErrorMessage(error) {
  // Network error
  if (!error.response) {
    return "Network error. Please check your internet connection.";
  }

  // Server error with message
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  // Validation errors
  if (error.response?.data?.validationErrors) {
    const errors = error.response.data.validationErrors;
    const firstError = Object.values(errors)[0];
    return firstError || "Validation failed";
  }

  // HTTP status messages
  const status = error.response?.status;
  const statusMessages = {
    400: "Invalid request. Please check your input.",
    401: "Please log in to continue.",
    403: "You don't have permission to do this.",
    404: "Resource not found.",
    409: "This resource already exists.",
    429: "Too many requests. Please try again later.",
    500: "Server error. Please try again later.",
    502: "Service temporarily unavailable.",
    503: "Service temporarily unavailable.",
  };

  return statusMessages[status] || error.message || "Something went wrong";
}

/**
 * Handle API error with toast notification
 */
export function handleApiError(error, customMessage = null) {
  const message = customMessage || getErrorMessage(error);
  showToast(message, "error");
  console.error("[API Error]", error);
  return message;
}

/**
 * Handle API success with toast notification
 */
export function handleApiSuccess(message, type = "success") {
  showToast(message, type);
}

/**
 * Retry failed request with exponential backoff
 */
export async function retryRequest(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries - 1) {
        throw error;
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

/**
 * Validate file type
 */
export function validateFileType(file, allowedTypes = []) {
  if (!allowedTypes.length) return true;

  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  return allowedTypes.some((type) => {
    if (type.startsWith(".")) {
      return fileName.endsWith(type);
    }
    return fileType === type || fileType.startsWith(type.replace("/*", ""));
  });
}

/**
 * Validate file size
 */
export function validateFileSize(file, maxSizeMB = 10) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Debounce function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Format date for display
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return new Date(date).toLocaleDateString("en-US", defaultOptions);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;

  return formatDate(date);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard", "success");
    return true;
  } catch (error) {
    showToast("Failed to copy to clipboard", "error");
    return false;
  }
}

/**
 * Download data as file
 */
export function downloadFile(data, filename, type = "text/plain") {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Check if user is on mobile device
 */
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Scroll to element smoothly
 */
export function scrollToElement(elementId, offset = 0) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: "smooth" });
}
