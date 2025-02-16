import React from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  const closeDialog = () => {
    onOpenChange(false);
  };

  const openDialog = () => {
    onOpenChange(true);
  };

  return (
    open && (
      <div
        className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50"
        onClick={closeDialog}
      >
        <div
          className="bg-white p-6 rounded-lg w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    )
  );
};

export const DialogContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-4">{children}</div>;
};

export const DialogHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="mb-4">{children}</div>;
};

export const DialogTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="text-xl font-semibold">{children}</h2>;
};

export const DialogDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <p className="text-gray-500">{children}</p>;
};

export const Button = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white p-2 rounded-lg w-full mt-4"
    >
      {children}
    </button>
  );
};
