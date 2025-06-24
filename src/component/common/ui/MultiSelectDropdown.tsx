import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { MultiSelectDropdownProps } from "../../../types";

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  title,
  options,
  selectedOptions,
  onApply,
  onReset,
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
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      className={`bg-white rounded-lg shadow-md p-4 ${className}`}
    >
      <h3 className="text-gray-700 font-medium mb-2">{title}</h3>

      <div className="relative mb-2">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="max-h-48 overflow-y-auto">
        {filteredOptions.map((option) => (
          <div key={option.id} className="flex items-center mb-2 last:mb-0">
            <input
              type="checkbox"
              id={`${title}-${option.id}`}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              checked={tempSelected.includes(option.id)}
              onChange={() => toggleOption(option.id)}
            />
            <label
              htmlFor={`${title}-${option.id}`}
              className="ml-2 text-sm text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>

      <div className="flex mt-3 space-x-2">
        <button
          className="px-4 py-2 bg-[#6BC8FE] text-white rounded-md hover:bg-[#6BC8FE] transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          onClick={handleApply}
        >
          Apply
        </button>
        <button
          className="px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
