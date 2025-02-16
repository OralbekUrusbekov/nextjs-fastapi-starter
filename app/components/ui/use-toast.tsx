import React, { createContext, useContext, ReactNode } from 'react';

type ToastOptions = {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
};

const ToastContext = createContext<
  { showToast: (options: ToastOptions) => void } | undefined
>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const showToast = ({
    title,
    description,
    variant = 'default',
  }: ToastOptions) => {
    console.log(`[${variant.toUpperCase()}] ${title}: ${description}`);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

// Optional direct export
export const toast = ({ title, description, variant }: ToastOptions) => {
  console.log(
    `[${variant?.toUpperCase() || 'INFO'}]: ${title} - ${description}`
  );
};
