interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Switch = ({
  checked,
  onChange,
  label,
  disabled = false,
}: SwitchProps) => {
  const handleChange = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleChange}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? "bg-blue-500" : "bg-gray-300"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      {label && (
        <span
          className={`ml-2 text-sm ${
            disabled ? "text-gray-400" : "text-gray-700"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
};
