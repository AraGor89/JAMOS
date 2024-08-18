"use client";

import { createContext, useContext, FC, ReactNode } from "react";
import toast, { Toaster, ToasterProps } from "react-hot-toast";

type ToastContextProps = {
  success: (message: string) => void;
  error: (message: string) => void;
};

export const ToastContext = createContext<ToastContextProps | undefined>(
  undefined
);

export const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ToastContext.Provider value={useHotToast()}>
      {children}
      <Toaster position="bottom-center" reverseOrder={false} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};

const useHotToast = (): ToastContextProps => {
  // You can customize and extend this hook based on your needs
  return {
    success: (message) => toast.success(message, { duration: 8000 }),
    error: (message) => toast.error(message, { duration: 8000 }),
    // Add more functions for other types of toasts
  };
};
