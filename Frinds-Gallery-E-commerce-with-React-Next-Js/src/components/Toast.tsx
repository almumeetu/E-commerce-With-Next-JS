import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColors = {
    success: 'bg-indigo-900 border-indigo-700',
    error: 'bg-red-900 border-red-700',
    info: 'bg-blue-900 border-blue-700',
  };

  const icons = {
    success: <CheckCircle className="text-indigo-400 h-5 w-5" />,
    error: <AlertCircle className="text-red-400 h-5 w-5" />,
    info: <AlertCircle className="text-blue-400 h-5 w-5" />,
  };

  return (
    <div className={`fixed bottom-5 right-5 z-[100] flex items-center p-4 rounded-lg shadow-lg border text-white min-w-[300px] animate-slide-up ${bgColors[type]}`}>
      <div className="flex-shrink-0 mr-3">
        {icons[type]}
      </div>
      <div className="flex-1 text-sm font-medium">
        {message}
      </div>
      <button onClick={onClose} className="ml-3 text-white/70 hover:text-white transition">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;