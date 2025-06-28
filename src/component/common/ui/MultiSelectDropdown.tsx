import React, { useState, useEffect, useRef } from "react";
import {  X } from "lucide-react";
import { MultiSelectDropdownProps } from "../../../types";

interface ExtendedMultiSelectDropdownProps extends MultiSelectDropdownProps {
  onClose?: () => void;
}

const MultiSelectDropdown: React.FC<ExtendedMultiSelectDropdownProps> = ({
  title,
  options,
  selectedOptions,
  onApply,
  onReset,
  onClose,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelected, setTempSelected] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize temp selected with the current selections
  useEffect(() => {
    setTempSelected([...selectedOptions]);
  }, [selectedOptions]);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose?.();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  // Toggle selection of an option
  const toggleOption = (optionId: string) => {
    setTempSelected((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleApply = () => {
    onApply(tempSelected);
  };

  const handleReset = () => {
    setTempSelected([]);
    onReset();
  };

  return (
    <div
      ref={dropdownRef}
      className={`bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-gray-700 font-medium text-sm sm:text-base">{title}</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Close dropdown"
          >
            <X size={16} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Search Input */}
        {/* <div className="relative mb-3">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={14} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Search options..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}

        {/* Options List */}
        <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {filteredOptions.length > 0 ? (
            <div className="space-y-2">
              {filteredOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors"
                    checked={tempSelected.includes(option.id)}
                    onChange={() => toggleOption(option.id)}
                  />
                  <span className="ml-3 text-sm text-gray-700 flex-1 truncate">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm">
              {searchTerm ? "No options found" : "No options available"}
            </div>
          )}
        </div>

      

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-3 border-t border-gray-200">
          <button
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            onClick={handleApply}
          >
            Apply ({tempSelected.length})
          </button>
          <button
            className="flex-1 px-4 py-2 text-gray-600 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiSelectDropdown;