import { motion } from "framer-motion";

export function LoadingSpinner({ size = "md", text = "" }) {
  const sizeClasses = {
    sm: "spinner-sm",
    md: "spinner-md",
    lg: "spinner-lg",
  };

  return (
    <div className="spinner-container">
      <motion.div
        className={`spinner ${sizeClasses[size]}`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="spinner-circle" />
      </motion.div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}

export function LoadingOverlay({ text = "Loading..." }) {
  return (
    <motion.div
      className="loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loading-overlay-content">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </motion.div>
  );
}

export function ButtonSpinner() {
  return (
    <motion.div
      className="button-spinner"
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

export default LoadingSpinner;
