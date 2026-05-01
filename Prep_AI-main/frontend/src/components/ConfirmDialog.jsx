import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning", // warning, danger, info
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const typeStyles = {
    warning: "confirm-warning",
    danger: "confirm-danger",
    info: "confirm-info",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="confirm-dialog"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className={`confirm-header ${typeStyles[type]}`}>
              <h3>{title}</h3>
            </div>
            <div className="confirm-body">
              <p>{message}</p>
            </div>
            <div className="confirm-actions">
              <button
                className="confirm-btn confirm-btn-cancel"
                onClick={onClose}
                autoFocus
              >
                {cancelText}
              </button>
              <button
                className={`confirm-btn confirm-btn-confirm ${typeStyles[type]}`}
                onClick={handleConfirm}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ConfirmDialog;
