

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  id: string;
  label: string;
  value?: any;
  disabled?: boolean;
}

interface ResponsiveDropdownProps {
  options: DropdownOption[];
  selectedValue?: string | string[];
  onSelect: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  maxHeight?: number;
  searchable?: boolean;
  renderOption?: (option: DropdownOption, isSelected: boolean) => React.ReactNode;
  renderSelected?: (selectedCount: number, selectedOptions: DropdownOption[]) => React.ReactNode;
}

export const ResponsiveDropdown: React.FC<ResponsiveDropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = "Select option...",
  multiple = false,
  disabled = false,
  className = "",
  maxHeight = 300,
  searchable = false,
  renderOption,
  renderSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Enhanced position calculation for all viewport sizes (0-2000px)
  const calculateDirection = useCallback(() => {
    if (!buttonRef.current) return;

    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    
    const spaceBelow = viewportHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    
    // If there's more space above and not enough below, open upward
    const shouldOpenUpward = spaceBelow < maxHeight + 20 && spaceAbove > spaceBelow;
    
    setDropdownDirection(shouldOpenUpward ? 'up' : 'down');
  }, [maxHeight]);

  // Handle dropdown toggle
  const toggleDropdown = useCallback(() => {
    if (disabled) return;
    
    if (!isOpen) {
      calculateDirection();
    }
    setIsOpen(!isOpen);
  }, [disabled, isOpen, calculateDirection]);

  // Handle option selection
  const handleOptionSelect = useCallback((optionId: string) => {
    if (multiple) {
      const currentSelection = Array.isArray(selectedValue) ? selectedValue : [];
      const newSelection = currentSelection.includes(optionId)
        ? currentSelection.filter(id => id !== optionId)
        : [...currentSelection, optionId];
      onSelect(newSelection);
    } else {
      onSelect(optionId);
      setIsOpen(false);
    }
  }, [multiple, selectedValue, onSelect]);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, searchable]);

  // Get selected options
  const selectedOptions = useMemo(() => {
    if (!selectedValue) return [];
    const values = Array.isArray(selectedValue) ? selectedValue : [selectedValue];
    return options.filter(option => values.includes(option.id));
  }, [options, selectedValue]);

  // Close dropdown on outside click and handle scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        calculateDirection();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        calculateDirection();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, calculateDirection]);

  // Render selected value in button
  const renderButtonContent = () => {
    if (selectedOptions.length === 0) {
      return <span className="text-gray-500">{placeholder}</span>;
    }

    if (renderSelected) {
      return renderSelected(selectedOptions.length, selectedOptions);
    }

    if (multiple) {
      if (selectedOptions.length === 1) {
        return selectedOptions[0].label;
      }
      return `${selectedOptions.length} items selected`;
    }

    return selectedOptions[0].label;
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Dropdown Button - Optimized for mobile */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`
          w-full px-3 py-2.5 text-left bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200 min-h-[40px] flex items-center justify-between text-sm
          ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'hover:border-gray-400 cursor-pointer'}
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-20' : 'border-gray-300'}
        `}
      >
        <span className="truncate flex-1 text-sm">
          {renderButtonContent()}
        </span>
        <ChevronDown
          size={14}
          className={`ml-2 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          } ${disabled ? 'text-gray-400' : 'text-gray-500'}`}
        />
      </button>

      {/* Dropdown Menu - Optimized for all devices 0-2000px */}
      {isOpen && (
        <div
          className={`
            absolute z-50 bg-white border border-gray-200 rounded-lg shadow-xl
            ${dropdownDirection === 'up' ? 'bottom-full mb-1' : 'top-full mt-1'}
          `}
          style={{
            minWidth: buttonRef.current?.offsetWidth || 'auto',
            maxWidth: 'min(320px, calc(100vw - 1rem))',
            width: window.innerWidth <= 640 ? 'calc(100vw - 1rem)' : 'auto',
          }}
        >
          {/* Search Input - Compact for mobile */}
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Options List - Compact spacing */}
          <div
            ref={listRef}
            className="py-1 overflow-y-auto"
            style={{ maxHeight: maxHeight - (searchable ? 50 : 0) }}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                {searchTerm ? 'No matches' : 'No options'}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = Array.isArray(selectedValue)
                  ? selectedValue.includes(option.id)
                  : selectedValue === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={option.disabled}
                    className={`
                      w-full px-3 py-2 text-left text-sm transition-colors duration-150
                      ${option.disabled 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'hover:bg-gray-50 cursor-pointer'
                      }
                      ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}
                    `}
                  >
                    {renderOption ? renderOption(option, isSelected) : (
                      <div className="flex items-center justify-between">
                        <span className="truncate">{option.label}</span>
                        {isSelected && multiple && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center ml-2">
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                              <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsiveDropdown;