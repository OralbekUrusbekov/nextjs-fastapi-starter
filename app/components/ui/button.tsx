import React from 'react';
import clsx from 'clsx';

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'icon';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'default' | 'destructive' | 'outline';
  disabled?: boolean;
  asChild?: boolean;
}

export function Button({
  children,
  className,
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  variant = 'default',
  asChild = false,
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    icon: 'p-2 w-10 h-10 flex items-center justify-center',
  };

  const variantClasses = {
    default: 'bg-purple-600 text-white hover:bg-purple-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline:
      'bg-transparent border border-purple-600 text-purple-600 hover:bg-purple-100',
  };

  const buttonClasses = clsx(
    'font-semibold rounded-lg shadow transition',
    sizeClasses[size],
    variantClasses[variant],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  if (asChild) {
    return <>{children}</>;
  }

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  );
}
