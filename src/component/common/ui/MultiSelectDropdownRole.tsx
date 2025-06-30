// import React, { useState, useEffect, useRef } from "react";
// import { Search, X, Check } from "lucide-react";
// import { MultiSelectDropdownProps } from "../../../types";

// interface ExtendedMultiSelectDropdownProps extends MultiSelectDropdownProps {
//   onClose?: () => void;
//   maxHeight?: number;
//   preSelectedOptions?: string[];
// }

// const MultiSelectDropdownRole: React.FC<ExtendedMultiSelectDropdownProps> = ({
//   title,
//   options,
//   selectedOptions,
//   preSelectedOptions = [],
//   onApply,
//   onReset,
//   onClose,
//   maxHeight = 400,
//   className = "",
// }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [tempSelected, setTempSelected] = useState<string[]>([]);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const searchInputRef = useRef<HTMLInputElement>(null);

//   // Initialize temp selected with current selections + pre-selected options
//   useEffect(() => {
//     const combinedSelected = [...new Set([...preSelectedOptions, ...selectedOptions])];
//     setTempSelected(combinedSelected);
//     setSearchTerm("");
    
//     // Focus search input after a short delay
//     setTimeout(() => {
//       if (searchInputRef.current) {
//         searchInputRef.current.focus();
//       }
//     }, 100);
//   }, [selectedOptions, preSelectedOptions]);

//   // Handle outside clicks and escape key
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         onClose?.();
//       }
//     };

//     const handleEscapeKey = (event: KeyboardEvent) => {
//       if (event.key === 'Escape') {
//         onClose?.();
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", handleEscapeKey);
    
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEscapeKey);
//     };
//   }, [onClose]);

//   // Filter options based on search
//   const filteredOptions = options.filter((option) =>
//     option.label.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Toggle option selection
//   const toggleOption = (optionId: string) => {
//     // Don't allow toggling of pre-selected (already assigned) options
//     if (preSelectedOptions.includes(optionId)) {
//       return;
//     }

//     setTempSelected((prev) =>
//       prev.includes(optionId)
//         ? prev.filter((id) => id !== optionId)
//         : [...prev, optionId]
//     );
//   };

//   const handleApply = () => {
//     // Only pass newly selected options (exclude pre-selected ones)
//     const newSelections = tempSelected.filter(id => !preSelectedOptions.includes(id));
//     onApply(newSelections);
//     onClose?.();
//   };

//   const getNewSelectionsCount = () => {
//     return tempSelected.filter(id => !preSelectedOptions.includes(id)).length;
//   };

//   return (
//     <div 
//       ref={dropdownRef}
//       className={`bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden ${className}`}
//       style={{ height: `${maxHeight}px` }}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
//         <div className="flex items-center space-x-2">
//           <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
//           {getNewSelectionsCount() > 0 && (
//             <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
//               +{getNewSelectionsCount()}
//             </span>
//           )}
//           {preSelectedOptions.length > 0 && (
//             <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
//               {preSelectedOptions.length} assigned
//             </span>
//           )}
//         </div>
//         {onClose && (
//           <button
//             onClick={onClose}
//             className="p-1 hover:bg-gray-200 rounded-md transition-colors"
//             type="button"
//           >
//             <X size={16} className="text-gray-500" />
//           </button>
//         )}
//       </div>

//       {/* Search */}
//       <div className="p-3 border-b border-gray-200">
//         <div className="relative">
//           <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input
//             ref={searchInputRef}
//             type="text"
//             className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             placeholder={`Search ${title.toLowerCase()}...`}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       {/* Options List */}
//       <div className="flex-1 overflow-y-auto" style={{ maxHeight: `${maxHeight - 140}px` }}>
//         {filteredOptions.length > 0 ? (
//           <div className="py-2">
//             {filteredOptions.map((option) => {
//               const isPreSelected = preSelectedOptions.includes(option.id);
//               const isSelected = tempSelected.includes(option.id);
              
//               return (
//                 <label
//                   key={option.id}
//                   className={`flex items-center px-4 py-2 text-sm cursor-pointer transition-colors ${
//                     isPreSelected 
//                       ? "bg-green-50 hover:bg-green-100" 
//                       : "hover:bg-gray-50"
//                   }`}
//                   onClick={() => !isPreSelected && toggleOption(option.id)}
//                 >
//                   <div className="relative flex items-center">
//                     <input
//                       type="checkbox"
//                       className={`w-4 h-4 rounded border-2 focus:ring-2 focus:ring-blue-500 ${
//                         isPreSelected
//                           ? "bg-green-100 border-green-300 text-green-600"
//                           : "border-gray-300 text-blue-600"
//                       }`}
//                       checked={isSelected}
//                       disabled={isPreSelected}
//                       onChange={() => {}} // Handled by label click
//                     />
//                     {isPreSelected && (
//                       <Check size={12} className="absolute top-0.5 left-0.5 text-green-600 pointer-events-none" />
//                     )}
//                   </div>
//                   <span className={`ml-3 flex-1 ${
//                     isPreSelected ? "text-green-700 font-medium" : "text-gray-700"
//                   }`}>
//                     {option.label}
//                   </span>
//                   {isPreSelected && (
//                     <span className="text-xs text-green-600 bg-green-200 px-2 py-1 rounded-full ml-2">
//                       Assigned
//                     </span>
//                   )}
//                 </label>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="flex items-center justify-center py-8 text-gray-500">
//             <div className="text-center">
//               <Search size={24} className="mx-auto mb-2 text-gray-300" />
//               <p className="text-sm">No {title.toLowerCase()} found</p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       <div className="p-3 border-t border-gray-200 bg-gray-50">
//         <div className="flex items-center justify-between space-x-3">
//           <div className="text-xs text-gray-600">
//             {preSelectedOptions.length > 0 && (
//               <span>{preSelectedOptions.length} already assigned</span>
//             )}
//           </div>
//           <button
//             onClick={handleApply}
//             className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-w-[80px]"
//             type="button"
//           >
//             Apply
//             {getNewSelectionsCount() > 0 && (
//               <span className="ml-1 bg-blue-500 text-xs px-1.5 py-0.5 rounded-full">
//                 {getNewSelectionsCount()}
//               </span>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MultiSelectDropdownRole;

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { MultiSelectDropdownProps } from "../../../types";

interface ExtendedMultiSelectDropdownProps extends MultiSelectDropdownProps {
  onClose?: () => void;
  maxHeight?: number;
  preSelectedOptions?: string[];
}

const MultiSelectDropdownRole: React.FC<ExtendedMultiSelectDropdownProps> = ({
  title,
  options,
  selectedOptions,
  preSelectedOptions = [],
  onApply,
  onReset,
  onClose,
  maxHeight = 400,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelected, setTempSelected] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize temp selected with current selections + pre-selected options
  useEffect(() => {
    // Combine pre-selected (assigned) and currently selected (new selections)
    const combinedSelected = [...new Set([...preSelectedOptions, ...selectedOptions])];
    setTempSelected(combinedSelected);
    setSearchTerm("");
    
    // Focus search input after a short delay
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  }, [selectedOptions, preSelectedOptions]);

  // Handle outside clicks and escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  // Filter options based on search
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle option selection
  const toggleOption = (optionId: string) => {
    setTempSelected((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleApply = () => {
    // Only pass newly selected options (exclude pre-selected ones)
    const newSelections = tempSelected.filter(id => !preSelectedOptions.includes(id));
    onApply(newSelections);
    onClose?.();
  };

  const getNewSelectionsCount = () => {
    return tempSelected.filter(id => !preSelectedOptions.includes(id)).length;
  };

  return (
    <div 
      ref={dropdownRef}
      className={`bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden ${className}`}
      style={{ height: `${maxHeight}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {getNewSelectionsCount() > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
              +{getNewSelectionsCount()}
            </span>
          )}
          {preSelectedOptions.length > 0 && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
              {preSelectedOptions.length} assigned
            </span>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-md transition-colors"
            type="button"
          >
            <X size={16} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Options List */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: `${maxHeight - 140}px` }}>
        {filteredOptions.length > 0 ? (
          <div className="py-2">
            {filteredOptions.map((option) => {
              const isPreSelected = preSelectedOptions.includes(option.id);
              const isSelected = tempSelected.includes(option.id);
              
              return (
                <label
                  key={option.id}
                  className={`flex items-center px-4 py-2 text-sm cursor-pointer transition-colors ${
                    isPreSelected 
                      ? "bg-green-50 hover:bg-green-100" 
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => toggleOption(option.id)}
                >
                  <input
                    type="checkbox"
                    className={`w-4 h-4 rounded border-2 focus:ring-2 focus:ring-blue-500 ${
                      isPreSelected
                        ? "bg-green-100 border-green-300 text-green-600"
                        : "border-gray-300 text-blue-600"
                    }`}
                    checked={isSelected}
                    onChange={() => {}} // Handled by label click
                  />
                  <span className={`ml-3 flex-1 ${
                    isPreSelected ? "text-green-700 font-medium" : "text-gray-700"
                  }`}>
                    {option.label}
                  </span>
                  {isPreSelected && (
                    <span className="text-xs text-green-600 bg-green-200 px-2 py-1 rounded-full ml-2">
                      Assigned
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <div className="text-center">
              <Search size={24} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No {title.toLowerCase()} found</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between space-x-3">
          <div className="text-xs text-gray-600">
            {preSelectedOptions.length > 0 && (
              <span>{preSelectedOptions.length} already assigned</span>
            )}
          </div>
          <button
            onClick={handleApply}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors min-w-[80px]"
            type="button"
          >
            Apply
            {getNewSelectionsCount() > 0 && (
              <span className="ml-1 bg-blue-500 text-xs px-1.5 py-0.5 rounded-full">
                {getNewSelectionsCount()}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiSelectDropdownRole;