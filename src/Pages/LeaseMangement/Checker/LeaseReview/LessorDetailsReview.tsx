import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X, AlertTriangle } from "lucide-react";
import { LeaseFormLabels } from "../../createLease/LeaseForms/LeaseFormLabel";

import { LeaseFormData } from "../../../../types";

// Static data for pre-filling the form
const STATIC_FORM_DATA = {
  entityMaster: ["entity1", "entity2", "entity3"],
  department: ["hr"],
  leaserMaster: ["leaser1", "leaser2", "leaser3"],
  hasMultiEntityAllocation: true,
  hasLessorAllocation: true,
  entityDepartmentPercentages: {
    entity1: { hr: 30.00, admin: 25.00, it: 45.00 },
    entity2: { hr: 20.00, account: 40.00, it: 40.00 },
    entity3: { sales: 35.00, hr: 35.00, admin: 30.00 }
  },
  lessorPercentages: {
    leaser1: 40.00,
    leaser2: 35.00,
    leaser3: 25.00
  },
  overallEntityPercentages: {
    entity1: 30.00,
    entity2: 40.00,
    entity3: 30.00
  }
};

interface LeaseBasicInfoProps {
  formData: LeaseFormData;
  updateFormData: (data: Partial<LeaseFormData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  isSaving: boolean;
}

const departmentOptionsMap: Record<string, { label: string; value: string }[]> =
  {
    entity1: [
      { label: "HR", value: "hr" },
      { label: "Admin", value: "admin" },
      { label: "IT", value: "it" },
    ],
    entity2: [
      { label: "HR", value: "hr" },
      { label: "Account", value: "account" },
      { label: "IT", value: "it" },
    ],
    entity3: [
      { label: "Sales", value: "sales" },
      { label: "HR", value: "hr" },
      { label: "Admin", value: "admin" },
    ],
  };

const entityLabels: Record<string, string> = {
  entity1: "Entity 1",
  entity2: "Entity 2",
  entity3: "Entity 3",
};

const lessorOptions = [
  { label: "ABC Properties Ltd.", value: "leaser1" },
  { label: "XYZ Real Estate Co.", value: "leaser2" },
  { label: "Premium Spaces Inc.", value: "leaser3" },
  { label: "Global Property Holdings", value: "leaser4" },
  { label: "Metropolitan Leasing", value: "leaser5" },
];

interface MultiSelectDropdownProps {
  options: { label: string; value: string }[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder: string;
  disabled?: boolean;
  singleSelect?: boolean;
  readOnly?: boolean; // New prop for read-only mode
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
  disabled = false,
  singleSelect = false,
  readOnly = false, // New prop
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionToggle = (value: string) => {
    if (readOnly) return; // Prevent changes in read-only mode
    
    if (singleSelect) {
      onSelectionChange([value]);
      setIsOpen(false);
    } else {
      const newSelection = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      onSelectionChange(newSelection);
    }
  };

  const removeSelectedItem = (value: string, e: React.MouseEvent) => {
    if (readOnly) return; // Prevent changes in read-only mode
    e.stopPropagation();
    onSelectionChange(selectedValues.filter((v) => v !== value));
  };

  const getSelectedLabels = () => {
    return selectedValues.map(
      (value) =>
        options.find((option) => option.value === value)?.label || value
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`w-full min-h-[42px] rounded-md border border-gray-300 px-4 py-2 ${
          readOnly 
            ? "bg-gray-50 cursor-default" 
            : disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "bg-white hover:border-gray-400 cursor-pointer"
        }`}
        onClick={() => !disabled && !readOnly && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-h-[24px]">
            {selectedValues.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {getSelectedLabels().map((label, index) => (
                  <span
                    key={selectedValues[index]}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                  >
                    {label}
                    {!disabled && !singleSelect && !readOnly && (
                      <X
                        size={14}
                        className="ml-1 cursor-pointer hover:text-blue-600"
                        onClick={(e) =>
                          removeSelectedItem(selectedValues[index], e)
                        }
                      />
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
          {!readOnly && (
            <ChevronDown
              size={20}
              className={`text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>

      {isOpen && !disabled && !readOnly && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">No options available</div>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center ${
                  selectedValues.includes(option.value)
                    ? "bg-blue-50 text-blue-700"
                    : ""
                }`}
                onClick={() => handleOptionToggle(option.value)}
              >
                {!singleSelect && (
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => {}} // Handled by parent click
                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                )}
                {singleSelect && (
                  <input
                    type="radio"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => {}} // Handled by parent click
                    className="mr-3 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                )}
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export const LessorDetailsReview: React.FC<LeaseBasicInfoProps> = ({
  formData,
  updateFormData,
  onPrevious,
  onNext,
  onSave,
  isSaving,
}) => {
  // Use static data instead of formData
  const staticFormData = STATIC_FORM_DATA;
  
  // Initialize state with static data
  const [entityDepartmentPercentages, setEntityDepartmentPercentages] =
    useState<Record<string, Record<string, number>>>(
      staticFormData.entityDepartmentPercentages
    );
  const [lessorPercentages, setLessorPercentages] = useState<
    Record<string, number>
  >(staticFormData.lessorPercentages);
  const [overallEntityPercentages, setOverallEntityPercentages] = useState<
    Record<string, number>
  >(staticFormData.overallEntityPercentages);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("hr");

  const isMultiEntityMode = staticFormData.hasMultiEntityAllocation;
  const isLessorSplitMode = staticFormData.hasLessorAllocation;

  // Disabled handlers for read-only mode
  const handleEntityChange = (selectedEntities: string[]) => {
    // No-op for read-only mode
  };

  const handleLessorChange = (selectedLessors: string[]) => {
    // No-op for read-only mode
  };

  const handleDepartmentChange = (selectedDepartments: string[]) => {
    // No-op for read-only mode
  };

  const handleEntityDepartmentPercentageChange = (
    entityId: string,
    deptId: string,
    value: string
  ) => {
    // No-op for read-only mode
  };

  const handleOverallEntityPercentageChange = (
    entityId: string,
    value: string
  ) => {
    // No-op for read-only mode
  };

  const handleLessorPercentageChange = (lessorId: string, value: string) => {
    // No-op for read-only mode
  };

  const getUniqueDepartments = () => {
    const selectedEntities = Array.isArray(staticFormData.entityMaster)
      ? staticFormData.entityMaster
      : staticFormData.entityMaster
      ? [staticFormData.entityMaster]
      : [];
    const deptMap = new Map<string, string>();

    selectedEntities.forEach((entityId) => {
      const departments = departmentOptionsMap[entityId] || [];
      departments.forEach((dept) => {
        if (!deptMap.has(dept.value)) {
          deptMap.set(dept.value, dept.label);
        }
      });
    });

    return Array.from(deptMap.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  };

  const getDepartmentsForEntity = (entityId: string) => {
    return departmentOptionsMap[entityId] || [];
  };

  const entityHasDepartment = (entityId: string, deptValue: string) => {
    const departments = departmentOptionsMap[entityId] || [];
    return departments.some((dept) => dept.value === deptValue);
  };

  const getEntityTotal = (entityId: string) => {
    const entityPercentages = entityDepartmentPercentages[entityId] || {};
    return Object.values(entityPercentages).reduce((sum, val) => sum + val, 0);
  };

  const getOverallEntityGrandTotal = () => {
    return Object.values(overallEntityPercentages).reduce(
      (sum, val) => sum + val,
      0
    );
  };

  const lessorTotal = Object.values(lessorPercentages).reduce(
    (sum, val) => sum + val,
    0
  );

  const selectedEntities = Array.isArray(staticFormData.entityMaster)
    ? staticFormData.entityMaster
    : staticFormData.entityMaster
    ? [staticFormData.entityMaster]
    : [];
  const selectedLessors = Array.isArray(staticFormData.leaserMaster)
    ? staticFormData.leaserMaster
    : staticFormData.leaserMaster
    ? [staticFormData.leaserMaster]
    : [];
  const uniqueDepartments = getUniqueDepartments();

  // All validations should pass with static data
  const allEntityTotalsValid = true;
  const overallEntityGrandTotalValid = true;
  const lessorTotalValid = true;
  const singleModeValid = true;
  const canProceed = true;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">
        Multi-Entity/Lessor Setup (Read-Only View)
      </h2>

      {/* Section: Entity Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Entity Selection
        </h3>
        <div>
          <label
            htmlFor="entityMaster"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Selected Entities <span className="text-red-600">*</span>
          </label>
          <MultiSelectDropdown
            options={[
              { label: "Entity 1", value: "entity1" },
              { label: "Entity 2", value: "entity2" },
              { label: "Entity 3", value: "entity3" },
            ]}
            selectedValues={selectedEntities}
            onSelectionChange={handleEntityChange}
            placeholder="Select Entity(ies)"
            singleSelect={false}
            readOnly={true}
          />
        </div>
      </div>

      {/* Entity-Department Matrix for Multi-Entity Mode */}
      {isMultiEntityMode &&
        selectedEntities.length > 0 &&
        uniqueDepartments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Entity-Department Allocation Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-r border-gray-300 bg-gray-100 min-w-[120px]">
                      Overall Entity Allocation (%)
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-r border-gray-300">
                      Entity
                    </th>
                    {uniqueDepartments.map((dept) => (
                      <th
                        key={dept.value}
                        className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-r border-gray-300 min-w-[120px]"
                      >
                        {dept.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b bg-gray-100 border-gray-300">
                      Entity Total (%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEntities.map((entityId, entityIndex) => {
                    const entityTotal = getEntityTotal(entityId);
                    const isValidTotal = Math.abs(entityTotal - 100) < 0.01;
                    const currentOverallEntityValue =
                      overallEntityPercentages[entityId] || "";

                    return (
                      <tr
                        key={entityId}
                        className={
                          entityIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }
                      >
                        <td className="px-2 py-3 border-r border-gray-300 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-center bg-gray-50 cursor-not-allowed"
                            value={currentOverallEntityValue}
                            onChange={() => {}} // No-op for read-only
                            readOnly
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-300 bg-gray-50">
                          {entityLabels[entityId] || entityId}
                        </td>
                        {uniqueDepartments.map((dept) => {
                          const hasThisDept = entityHasDepartment(
                            entityId,
                            dept.value
                          );
                          const currentValue =
                            entityDepartmentPercentages[entityId]?.[
                              dept.value
                            ] || "";

                          return (
                            <td
                              key={dept.value}
                              className="px-2 py-3 border-r text-center border-gray-300"
                            >
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder={hasThisDept ? "0.00" : "N/A"}
                                disabled={!hasThisDept}
                                className={`w-full px-2 py-1 border border-gray-300 rounded text-sm text-center ${
                                  !hasThisDept
                                    ? "bg-gray-100 cursor-not-allowed text-gray-400"
                                    : "bg-gray-50 cursor-not-allowed"
                                }`}
                                value={hasThisDept ? currentValue : ""}
                                onChange={() => {}} // No-op for read-only
                                readOnly
                              />
                            </td>
                          );
                        })}
                        <td className="px-4 py-3 text-center bg-gray-100 border-l ">
                          <span
                            className={`text-sm font-semibold ${
                              isValidTotal ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {entityTotal.toFixed(2)}%
                          </span>
                          {!isValidTotal && (
                            <div className="flex items-center justify-center mt-1">
                              <AlertTriangle
                                size={12}
                                className="text-red-500 mr-1"
                              />
                              <span className="text-xs text-red-600">
                                ≠100%
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 border-r border-gray-300 bg-gray-100">
                      Overall Grand Total:
                    </td>
                    <td className="px-4 py-3 text-center bg-gray-100 border-l border-r border-gray-300">
                      <span
                        className={`text-sm font-semibold ${
                          overallEntityGrandTotalValid
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {getOverallEntityGrandTotal().toFixed(2)}%
                      </span>
                      {!overallEntityGrandTotalValid && (
                        <div className="flex items-center justify-center mt-1 ">
                          <AlertTriangle
                            size={12}
                            className="text-red-500 mr-1"
                          />
                          <span className="text-xs text-red-600">≠100%</span>
                        </div>
                      )}
                    </td>
                    {uniqueDepartments.map((dept) => (
                      <td
                        key={`empty-dept-footer-${dept.value}`}
                        className="px-4 py-3 bg-gray-100 border-r border-gray-300"
                      ></td>
                    ))}
                    <td className="px-4 py-3 bg-gray-100"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

      {/* Section: Lessor Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Lessor Selection
        </h3>
        <div>
          <label
            htmlFor="leaserMaster"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Selected Lessor(s) <span className="text-red-600">*</span>
          </label>
          <MultiSelectDropdown
            options={lessorOptions}
            selectedValues={selectedLessors}
            onSelectionChange={handleLessorChange}
            placeholder="Select Lessor(s)"
            singleSelect={false}
            readOnly={true}
          />
        </div>
      </div>

      {/* Lessor Allocation Table for Lessor Split Mode */}
      {isLessorSplitMode && selectedLessors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Lessor Allocation
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                    Lessor
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                    Percentage (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedLessors.map((lessorId) => {
                  const lessor = lessorOptions.find(
                    (l) => l.value === lessorId
                  );
                  return (
                    <tr key={lessorId} className="border-b">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {lessor?.label || lessorId}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          placeholder="0.00"
                          className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 cursor-not-allowed"
                          value={lessorPercentages[lessorId] || ""}
                          onChange={() => {}} // No-op for read-only
                          readOnly
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    Total:
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-semibold ${
                        lessorTotalValid ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {lessorTotal.toFixed(2)}%
                    </span>
                    {!lessorTotalValid && (
                      <div className="flex items-center mt-1">
                        <AlertTriangle
                          size={16}
                          className="text-red-500 mr-1"
                        />
                        <span className="text-xs text-red-600">
                          Must equal 100%
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={true} // Disabled in read-only mode
          className="bg-gray-400 text-gray-200 border border-gray-300 px-4 py-2 rounded-md cursor-not-allowed"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={false} // Always enabled since data is valid
          className="px-4 py-2 rounded-md transition-colors bg-[#008F98] text-white hover:bg-[#007A82] cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};