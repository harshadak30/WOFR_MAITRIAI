import React, { useEffect } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

interface MessageAlertProps {
  message: string;
  onClose: () => void;
  type: "success" | "error";
  autoClose?: boolean;
  duration?: number;
}

const MessageAlert: React.FC<MessageAlertProps> = ({
  message,
  onClose,
  type,
  autoClose = true,
  duration = 5000,
}) => {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose, message]);

  const getAlertStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-700 border-green-200";
      case "error":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={18} className="text-green-500" />;
      case "error":
        return <AlertCircle size={18} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`px-4 py-3 mx-4 my-2 rounded-md border flex justify-between items-center animate-fadeIn ${getAlertStyles()}`}
    >
      <div className="flex items-center space-x-2">
        {getIcon()}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
        aria-label="Close"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default MessageAlert;
