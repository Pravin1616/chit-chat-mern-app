import React, { createContext, useState, useContext } from "react";

const ToastContext = createContext();

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, variant = "primary", delay = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant, delay }]);
    setTimeout(() => removeToast(id), delay);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1050,
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast show bg-${toast.variant} text-white`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{
              minWidth: "250px",
              marginBottom: "10px",
              borderRadius: "5px",
              overflow: "hidden",
            }}
          >
            <div className="toast-body">{toast.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
