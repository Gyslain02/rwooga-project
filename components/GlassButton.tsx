import React from 'react';
import { Loader2 } from 'lucide-react';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  loading = false,
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 rounded-full';

  const variantClasses = {
    primary: 'bg-brand-primary text-white hover:bg-brand-primary-light hover-glow-green shadow-lg shadow-brand-primary/20',
    ghost: 'glass-card text-white hover:glass-strong hover-glow-green',
    outline: 'glass-subtle border-2 border-brand-primary/30 text-brand-primary hover:border-brand-primary hover:glass-card hover-glow-green',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const disabledClasses = disabled || loading
    ? 'opacity-50 cursor-not-allowed'
    : 'hover:scale-105 active:scale-95';

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  const renderIcon = () => {
    if (loading) {
      return <Loader2 size={16} className="animate-spin" />;
    }
    return icon;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClasses}
    >
      {icon && iconPosition === 'left' && renderIcon()}
      {children}
      {icon && iconPosition === 'right' && renderIcon()}
    </button>
  );
};

export default GlassButton;
