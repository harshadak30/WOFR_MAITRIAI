import React from "react";

interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  enabled,
  onChange,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#6BC8FE] focus:ring-offset-2 ${enabled ? "bg-[#6BC8FE]" : "bg-gray-200"
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? "translate-x-6" : "translate-x-1"
            }`}
        />
      </button>
    </div>
  );
};

export default Toggle;
