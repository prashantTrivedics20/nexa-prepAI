import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOAST_DURATION = 4000;
const TOAST_TYPES = {
  success: {
    icon: "✓",
    bgColor: "bg-green-600",
    iconBg: "bg-green-700",
  },
  error: {
    icon: "✕",
    bgColor: "bg-red-600",
    iconBg: "bg-red-700",
  },
  warning: {
    icon: "⚠",
    bgColor: "bg-yellow-600",
    iconBg: "bg-yellow-700",
  },
  info: {
    icon: "ℹ",
    bgColor: "bg-blue-600",
    iconBg: "bg-blue-700",
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
              className={`toast-item ${config.bgColor}`}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              layout
            >
              <div className={`toast-icon ${config.iconBg}`}>
                {config.icon}
              </div>
              <p className="toast-message">{toast.message}</p>
              <button
                className="toast-close"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
              >
                ✕
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export default Toast;
