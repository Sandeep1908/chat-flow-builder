import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`fixed top-5 left-1/2 -translate-x-1/2 ${bgColor} text-white py-2 px-5 rounded-lg shadow-lg z-50 animate-fade-in-down`}>
      {message}
    </div>
  );
};

export default Toast;
