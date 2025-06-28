 import { ChevronDown } from "lucide-react";
import React from "react";

export const DropdownButton: React.FC<{
    children: React.ReactNode;
    onClick: () => void;
    isOpen?: boolean;
    disabled?: boolean;
    className?: string;
  }> = React.memo(
    ({ children, onClick, isOpen = false, disabled = false, className = "" }) => (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-100 text-left text-sm flex items-center justify-between transition-all duration-200 hover:border-gray-400 ${className}`}
      >
        <span className="truncate flex-1">{children}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    )
  );
  