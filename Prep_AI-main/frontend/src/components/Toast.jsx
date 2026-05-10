import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Toast.css";

const TOAST_DURATION = 5000;
const TOAST_TYPES = {
  success: {
    icon: "✓",
    title: "Success",
  },
  error: {
    icon: "✕",
    title: "Error",
  },
  warning: {
    icon: "⚠",
    title: "Warning",
  },
  info: {
    icon: "ℹ",
    title: "Info",
  },
};

let toastId = 0;
const toastListeners = new Set();

export function showToast(message, type = "info", duration = TOAST_DURATION) {
  const toast = {
    id: ++toastId,
    message,
    type,
    duration,
    timestamp: Date.now(),
  };

  toastListeners.forEach((listener) => listener(toast));
  return toast.id;
}

export function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleNewToast = (toast) => {
      setToasts((prev) => [...prev, toast]);

      if (toast.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
        }, toast.duration);
      }
    };

    toastListeners.add(handleNewToast);
    return () => toastListeners.delete(handleNewToast);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="toast-container">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = TOAST_TYPES[toast.type] || TOAST_TYPES.info;
          return (
            <motion.div
              key={toast.id}
              className={`toast ${toast.type}`}
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              layout
            >
              <div className="toast-icon">{config.icon}</div>
              <div className="toast-content">
                <div className="toast-title">{config.title}</div>
                <div className="toast-message">{toast.message}</div>
              </div>
              <button
                className="toast-close"
                onClick={() => removeToast(toast.id)}
                aria-label="Close"
              >
                ×
              </button>
              <div className="toast-progress">
                <div 
                  className="toast-progress-bar" 
                  style={{ animationDuration: `${toast.duration}ms` }} 
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default Toast;
