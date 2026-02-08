import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'strong' | 'subtle' | 'green';
  hover?: boolean;
  shimmer?: boolean;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = false,
  shimmer = false,
  onClick
}) => {
  const variantClasses = {
    default: 'glass-card',
    strong: 'glass-strong',
    subtle: 'glass-subtle',
    green: 'glass-green'
  };

  const baseClass = variantClasses[variant];
  const hoverClass = hover ? 'glass-card-hover hover-glow-green' : '';
  const shimmerClass = shimmer ? 'glass-shimmer' : '';
  const cursorClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClass} ${hoverClass} ${shimmerClass} ${cursorClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;
