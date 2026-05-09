import { motion } from 'framer-motion';
import './Card.css';

/**
 * Professional Card Component
 * Variants: default, elevated, bordered, glass
 * Hover effects: lift, glow, none
 */

function Card({
  children,
  variant = 'default',
  hover = 'lift',
  padding = 'md',
  className = '',
  onClick,
  ...props
}) {
  const baseClass = 'card';
  const variantClass = `card-${variant}`;
  const paddingClass = `card-padding-${padding}`;
  const hoverClass = hover !== 'none' ? `card-hover-${hover}` : '';
  const clickableClass = onClick ? 'card-clickable' : '';

  const classes = [
    baseClass,
    variantClass,
    paddingClass,
    hoverClass,
    clickableClass,
    className
  ].filter(Boolean).join(' ');

  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      className={classes}
      onClick={onClick}
      whileHover={hover !== 'none' ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </Component>
  );
}

function CardHeader({ children, className = '' }) {
  return (
    <div className={`card-header ${className}`}>
      {children}
    </div>
  );
}

function CardBody({ children, className = '' }) {
  return (
    <div className={`card-body ${className}`}>
      {children}
    </div>
  );
}

function CardFooter({ children, className = '' }) {
  return (
    <div className={`card-footer ${className}`}>
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
