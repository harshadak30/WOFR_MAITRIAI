import React, { useState, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";
import { CashflowEntry, LeaseFormData } from "../../../../types";
import { v4 as uuidv4 } from "uuid";
import { LeaseFormLabels } from "../../createLease/LeaseForms/LeaseFormLabel";

interface LeaseBasicInfoProps {
    formData: LeaseFormData;
    updateFormData: (data: Partial<LeaseFormData>) => void;
    onNext: () => void;
    onSave: () => void;
    isSaving: boolean;
}

const LeaseBasicInfoReview: React.FC<LeaseBasicInfoProps> = ({
    formData,
    updateFormData,
    onNext,
    onSave,
    isSaving,
}) => {
    // Initialize with static data
    const staticFormData = {
        propertyId: "VEHICLE",
        propertyName: "Company Fleet Vehicle - Tesla Model S",
        isShortTerm: true,
        isLowValue: true,
        hasMultiEntityAllocation: false,
        hasLessorAllocation: true,
        shortTermValue: "15000",
        startDate: "2024-01-15",
        endDate: "2026-01-15",
        duration: {
            years: 2,
            months: 0,
            days: 0
        },
        hasCashflow: true,
        cashflowEntries: [
            {
                id: uuidv4(),
                leaseId: "VEHICLE",
                date: "2024-02-15",
                amount: "850"
            },
            {
                id: uuidv4(),
                leaseId: "VEHICLE",
                date: "2024-03-15",
                amount: "850"
            },
            {
                id: uuidv4(),
                leaseId: "VEHICLE",
                date: "2024-04-15",
                amount: "850"
            }
        ]
    };

    // State to track if data has been initialized
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize form data with static values on component mount
    useEffect(() => {
        if (!isInitialized) {
            updateFormData(staticFormData);
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const [showCashflowDetails, setShowCashflowDetails] = useState(
        staticFormData.hasCashflow || false
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Class options for dropdown
    const classOptions = [
        { value: "", label: "Select Class" },
        { value: "VEHICLE", label: "Vehicle" },
        { value: "EQUIPMENT", label: "Equipment" },
        { value: "PROPERTY", label: "Property" },
        { value: "TECHNOLOGY", label: "Technology" },
        { value: "MACHINERY", label: "Machinery" },
        { value: "FURNITURE", label: "Furniture" },
    ];

    const [cashflowEntries, setCashflowEntries] = useState<CashflowEntry[]>(
        staticFormData.cashflowEntries
    );

    // Auto-calculate lease duration when start/end dates change
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);

            if (endDate > startDate) {
                const years = endDate.getFullYear() - startDate.getFullYear();
                const months = endDate.getMonth() - startDate.getMonth();
                const days = endDate.getDate() - startDate.getDate();

                // Adjust for negative values
                let adjustedYears = years;
                let adjustedMonths = months;
                let adjustedDays = days;

                if (adjustedDays < 0) {
                    const lastMonth = new Date(
                        endDate.getFullYear(),
                        endDate.getMonth(),
                        0
                    );
                    adjustedDays += lastMonth.getDate();
                    adjustedMonths--;
                }

                if (adjustedMonths < 0) {
                    adjustedMonths += 12;
                    adjustedYears--;
                }

                updateFormData({
                    duration: {
                        years: Math.max(0, adjustedYears),
                        months: Math.max(0, adjustedMonths),
                        days: Math.max(0, adjustedDays),
                    },
                });
            }
        }
    }, [formData.startDate, formData.endDate]);

    // Update cashflow entries when class changes
    useEffect(() => {
        if (formData.propertyId && cashflowEntries.length > 0) {
            setCashflowEntries((prevEntries) =>
                prevEntries.map((entry) => ({
                    ...entry,
                    leaseId: formData.propertyId || "",
                }))
            );
        }
    }, [formData.propertyId]);

    useEffect(() => {
        if (Array.isArray(cashflowEntries)) {
            updateFormData({ cashflowEntries });
        }
    }, [cashflowEntries]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.propertyId) {
            newErrors.propertyId = "Class is required";
        }
        if (!formData.propertyName) {
            newErrors.propertyName = "Lease Name is required";
        }
        if (!formData.startDate) {
            newErrors.startDate = "Start date is required";
        }
        if (!formData.endDate) {
            newErrors.endDate = "End date is required";
        } else if (
            formData.startDate &&
            new Date(formData.endDate) <= new Date(formData.startDate)
        ) {
            newErrors.endDate = "End date must be after start date";
        }

        if (showCashflowDetails) {
            const invalidEntries = cashflowEntries.some(
                (entry) => !entry.leaseId || !entry.date || !entry.amount
            );
            if (invalidEntries) {
                newErrors.cashflow = "All cashflow entries must be completed";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;

        if (name === "hasCashflow") {
            setShowCashflowDetails(checked);
            if (
                checked &&
                (!formData.cashflowEntries || formData.cashflowEntries.length === 0)
            ) {
                setCashflowEntries([
                    {
                        id: uuidv4(),
                        leaseId: formData.propertyId || "",
                        date: "",
                        amount: "",
                    },
                ]);
            }
        }

        updateFormData({ [name]: checked });
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleCashflowEntryChange = (
        id: string,
        field: keyof CashflowEntry,
        value: string
    ) => {
        setCashflowEntries((prevEntries) =>
            prevEntries.map((entry) =>
                entry.id === id ? { ...entry, [field]: value } : entry
            )
        );
        if (errors.cashflow) {
            setErrors((prev) => ({ ...prev, cashflow: "" }));
        }
    };

    const addCashflowEntry = () => {
        setCashflowEntries((prevEntries) => [
            ...prevEntries,
            {
                id: uuidv4(),
                leaseId: formData.propertyId || "",
                date: "",
                amount: "",
            },
        ]);
    };

    const removeCashflowEntry = (id: string) => {
        setCashflowEntries((prevEntries) =>
            prevEntries.filter((entry) => entry.id !== id)
        );
    };

    const handleNext = () => {
        if (validateForm()) {
            onNext();
        }
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave();
        }
    };

    return (
        <div className="bg-white p-3 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Lease Terms</h2>

            <div className="grid gap-6 p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label
                            htmlFor="propertyId"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            {LeaseFormLabels.leaseTerms.class}{" "}
                            <span className="text-red-600">*</span>
                        </label>
                        <select
                            id="propertyId"
                            name="propertyId"
                            disabled
                            className={`w-full rounded-md border ${errors.propertyId ? "border-red-300" : "border-gray-300"
                                } px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-500 cursor-not-allowed`}
                            value={formData.propertyId || (isInitialized ? "" : staticFormData.propertyId)}
                            onChange={handleChange}
                        >
                            {classOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {errors.propertyId && (
                            <p className="mt-1 text-sm text-red-600">{errors.propertyId}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="propertyName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            {LeaseFormLabels.leaseTerms.leaseName}{" "}
                            <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            id="propertyName"
                            name="propertyName"
                            className={`w-full rounded-md border ${errors.propertyName ? "border-red-300" : "border-gray-300"
                                } px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            placeholder="Enter Lease Name"
                            value={formData.propertyName || staticFormData.propertyName}
                            onChange={handleChange}
                            readOnly={true} // Assuming this field is read-only in review mode
                        />
                        {errors.propertyName && (
                            <p className="mt-1 text-sm text-red-600">{errors.propertyName}</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-8 p-2">
                    <div className="flex items-center">
                        <input
                            id="isShortTerm"
                            name="isShortTerm"
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={formData.isShortTerm ?? staticFormData.isShortTerm}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="isShortTerm" className="ml-2 text-sm text-gray-700">
                            {LeaseFormLabels.leaseTerms.isShortTerm}
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="isLowValue"
                            name="isLowValue"
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={formData.isLowValue ?? staticFormData.isLowValue}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="isLowValue" className="ml-2 text-sm text-gray-700">
                            {LeaseFormLabels.leaseTerms.isLowValue}
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="hasMultiEntityAllocation"
                            name="hasMultiEntityAllocation"
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={formData.hasMultiEntityAllocation ?? staticFormData.hasMultiEntityAllocation}
                            onChange={handleCheckboxChange}
                            readOnly={true} // Assuming this field is read-only in review mode
                        />
                        <label
                            htmlFor="hasMultiEntityAllocation"
                            className="ml-2 text-sm text-gray-700"
                        >
                            {LeaseFormLabels.leaseTerms.hasMultiEntityAllocation}
                        </label>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="hasLessorAllocation"
                            name="hasLessorAllocation"
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={formData.hasLessorAllocation ?? staticFormData.hasLessorAllocation}
                            onChange={handleCheckboxChange}
                        />
                        <label
                            htmlFor="hasLessorAllocation"
                            className="ml-2 text-sm text-gray-700"
                        >
                            {LeaseFormLabels.leaseTerms.hasLessorAllocation}
                        </label>
                    </div>
                </div>

                {(formData.isLowValue ?? staticFormData.isLowValue) && (
                    <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="shortTermValue"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    {LeaseFormLabels.leaseTerms.isInputLowValue}
                                </label>
                                <input
                                    type="number"
                                    id="shortTermValue"
                                    name="shortTermValue"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter value"
                                    value={formData.shortTermValue || staticFormData.shortTermValue}
                                    onChange={handleChange}
                                    readOnly={true} // Assuming this field is read-only in review mode
                                    min="0"
                                    onKeyDown={(e) => {
                                        if (e.key === "-" || e.key === "e") {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8 p-2">
                    <div>
                        <label
                            htmlFor="startDate"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            {LeaseFormLabels.leaseTerms.startDate}{" "}
                            <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                className={`w-full rounded-md border ${errors.startDate ? "border-red-300" : "border-gray-300"
                                    } pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                value={formData.startDate || staticFormData.startDate}
                                onChange={handleDateChange}
                                onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                                style={{ colorScheme: "light" }}
                                readOnly={true} // Assuming this field is read-only in review mode
                            />
                        </div>
                        {errors.startDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="endDate"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            {LeaseFormLabels.leaseTerms.endDate}{" "}
                            <span className="text-red-600">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                min={formData.startDate || staticFormData.startDate}
                                className={`w-full rounded-md border ${errors.endDate ? "border-red-300" : "border-gray-300"
                                    } pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                value={formData.endDate || staticFormData.endDate}
                                onFocus={(e) => e.target.showPicker && e.target.showPicker()}
                                onChange={handleDateChange}
                                readOnly={true}
                            />
                        </div>
                        {errors.endDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                        )}
                    </div>
                </div>

                <div className="border border-gray-200 rounded-md bg-gray-50 p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Lease Duration
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label
                                htmlFor="years"
                                className="block text-sm text-gray-500 mb-1"
                            >
                                {LeaseFormLabels.leaseTerms.leaseDuration.years}
                            </label>
                            <input
                                type="number"
                                id="years"
                                min="0"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                                value={formData.duration?.years ?? staticFormData.duration.years}
                                readOnly
                                disabled
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="months"
                                className="block text-sm text-gray-500 mb-1"
                            >
                                {LeaseFormLabels.leaseTerms.leaseDuration.months}
                            </label>
                            <input
                                type="number"
                                id="months"
                                min="0"
                                max="11"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                                value={formData.duration?.months ?? staticFormData.duration.months}
                                readOnly
                                disabled
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="days"
                                className="block text-sm text-gray-500 mb-1"
                            >
                                {LeaseFormLabels.leaseTerms.leaseDuration.days}
                            </label>
                            <input
                                type="number"
                                id="days"
                                min="0"
                                max="30"
                                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                                value={formData.duration?.days ?? staticFormData.duration.days}
                                readOnly
                                disabled
                            />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Duration is automatically calculated based on start and end dates
                    </p>
                </div>

                <div className="mt-4">
                    <div className="flex items-center">
                        <input
                            id="hasCashflow"
                            name="hasCashflow"
                            type="checkbox"
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={formData.hasCashflow ?? staticFormData.hasCashflow}
                            onChange={handleCheckboxChange}
                        />
                        <label
                            htmlFor="hasCashflow"
                            className="ml-2 text-sm font-medium text-gray-700"
                        >
                            {LeaseFormLabels.leaseTerms.customCashflow.checkbox}
                        </label>
                    </div>

                    {showCashflowDetails && (
                        <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 animate-fadeIn">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-md font-medium">Custom Cashflow</h3>
                                <button
                                    type="button"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
                                >
                                    <span>Cash Flow Import</span>
                                </button>
                            </div>

                            {cashflowEntries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end relative"
                                >
                                    <div>
                                        <label
                                            htmlFor={`leaseId-${entry.id}`}
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            {LeaseFormLabels.leaseTerms.customCashflow.leaseId}
                                        </label>
                                        <input
                                            type="text"
                                            id={`leaseId-${entry.id}`}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                                            value={entry.leaseId}
                                            readOnly
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor={`date-${entry.id}`}
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            {LeaseFormLabels.leaseTerms.customCashflow.date}
                                        </label>
                                        <input
                                            type="date"
                                            id={`date-${entry.id}`}
                                            min={formData.startDate || staticFormData.startDate}
                                            className="w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={entry.date}
                                            onFocus={(e) =>
                                                e.target.showPicker && e.target.showPicker()
                                            }
                                            onChange={(e) =>
                                                handleCashflowEntryChange(
                                                    entry.id,
                                                    "date",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <div className="flex-grow">
                                            <label
                                                htmlFor={`amount-${entry.id}`}
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                {LeaseFormLabels.leaseTerms.customCashflow.amount}
                                            </label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                                    $
                                                </span>
                                                <input
                                                    type="number"
                                                    id={`amount-${entry.id}`}
                                                    className="w-full rounded-md border border-gray-300 pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="0.00"
                                                    value={entry.amount}
                                                    min={0}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "-" || e.key === "e") {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) =>
                                                        handleCashflowEntryChange(
                                                            entry.id,
                                                            "amount",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        {cashflowEntries.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeCashflowEntry(entry.id)}
                                                className="p-2 text-gray-500 hover:text-red-500 focus:outline-none"
                                                aria-label="Remove entry"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {errors.cashflow && (
                                <p className="mt-1 text-sm text-red-600">{errors.cashflow}</p>
                            )}

                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={addCashflowEntry}
                                    className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Add Entry
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 flex justify-between">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors ${isSaving ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007A82] transition-colors"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default LeaseBasicInfoReview;