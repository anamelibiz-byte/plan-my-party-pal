import React, { useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info, XCircle } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="text-green-600" size={24} />,
    error: <XCircle className="text-red-600" size={24} />,
    warning: <AlertCircle className="text-yellow-600" size={24} />,
    info: <Info className="text-blue-600" size={24} />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-in-right">
      <div className={`flex items-start gap-3 ${bgColors[type]} border-2 rounded-xl shadow-2xl p-4 max-w-sm`}>
        <div className="flex-shrink-0 mt-0.5">
          {icons[type]}
        </div>
        <p className="text-gray-800 text-sm flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
