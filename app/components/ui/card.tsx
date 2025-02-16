import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children }: CardProps) {
  return <div className="p-4 border-b">{children}</div>;
}

export function CardContent({ children }: CardProps) {
  return <div className="p-4">{children}</div>;
}

export function CardFooter({ children }: CardProps) {
  return <div className="p-4 border-t">{children}</div>;
}

export function CardTitle({ children }: CardProps) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}

export function CardDescription({ children }: CardProps) {
  return <p className="text-gray-600">{children}</p>;
}
