import { useEffect } from 'react';
import './toast.css';

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className={`toast toast--${toast.type}`} role="alert">
      <strong className="toast__title">{toast.title}</strong>
      {toast.message && <p className="toast__message">{toast.message}</p>}
      <button
        type="button"
        className="toast__close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Закрыть"
      >
        ×
      </button>
    </div>
  );
}

export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
