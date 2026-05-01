import { motion } from "framer-motion";

export function EmptyState({
  icon = "📋",
  title = "No data yet",
  description = "Get started by creating your first item",
  actionText,
  onAction,
}) {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="empty-state-icon" role="img" aria-label="Empty state icon">
        {typeof icon === "string" ? (
          <span style={{ fontSize: "64px" }}>{icon}</span>
        ) : (
          icon
        )}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>
      {actionText && onAction && (
        <button className="empty-state-action" onClick={onAction}>
          {actionText}
        </button>
      )}
    </motion.div>
  );
}

export default EmptyState;
