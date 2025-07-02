import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import countries from "world-countries";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import { Organization } from "../../types";
import { updateOrganization, createOrganization } from "../../hooks/organizationService";

interface OrganizationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData: Organization | null;
  mode: "create" | "edit";
}

interface FormData {
  name: string;
  organization_type: string;
  industry_sector: { label: string; value: string } | null;
  registration_tax_id: string;
  address: string;
  country: { label: string; value: string } | null;
  zip_postal_code: string;
  incorporation_date?: string;
}

const countryOptions = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
}));

const industryOptions = [
  { label: "Banking and Financial Services", value: "banking_financial_services" },
  { label: "Investment Management", value: "investment_management" },
  { label: "Insurance", value: "insurance" },
  { label: "Wealth Management", value: "wealth_management" },
  { label: "Fintech and Digital Banking", value: "fintech_digital_banking" },
  { label: "Capital Markets", value: "capital_markets" },
  { label: "Real Estate Finance", value: "real_estate_finance" },
  { label: "Corporate Finance", value: "corporate_finance" },
  { label: "Risk Management", value: "risk_management" },
  { label: "Financial Consulting", value: "financial_consulting" },
  { label: "Other", value: "other" },
];

const OrganizationForm = ({
  onSuccess,
  onCancel,
  initialData,
  mode = "create",
}: OrganizationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!initialData);
  const { authState } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // Initialize form
  useEffect(() => {
    if (initialData) {
      const countryOption = countryOptions.find(
        (option) => option.label === initialData.country || option.value === initialData.country
      );

      const industryOption = industryOptions.find(
        (option) => option.label === initialData.industry_sector || option.value === initialData.industry_sector
      ) || { label: initialData.industry_sector || "", value: initialData.industry_sector || "" };

      let formattedDate = "";
      if (initialData.incorporation_date) {
        const date = new Date(initialData.incorporation_date);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split("T")[0];
        }
      }

      reset({
        name: initialData.name || "",
        organization_type: initialData.organization_type || "",
        industry_sector: industryOption,
        registration_tax_id: initialData.registration_tax_id || "",
        address: initialData.address || "",
        country: countryOption || null,
        zip_postal_code: initialData.zip_postal_code || "",
        incorporation_date: formattedDate,
      });
      setIsEditMode(false); // Start in view mode if we have data
    } else {
      reset({
        name: "",
        organization_type: "",
        industry_sector: null,
        registration_tax_id: "",
        address: "",
        country: null,
        zip_postal_code: "",
        incorporation_date: "",
      });
      setIsEditMode(true); // Start in edit mode if no data
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    if (!authState.token) {
      toast.error("Authentication required");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: data.name,
      organization_type: data.organization_type,
      industry_sector: data.industry_sector?.label || data.industry_sector?.value || "",
      registration_tax_id: data.registration_tax_id || null,
      address: data.address || null,
      country: data.country?.label || data.country?.value || "",
      zip_postal_code: data.zip_postal_code || null,
      incorporation_date: data.incorporation_date || null,
    };

    try {
      if (mode === "edit" && initialData) {
        await updateOrganization(payload, authState.token);
        toast.success("Organization updated successfully");
      } else {
        await createOrganization(payload, authState.token);
        toast.success("Organization created successfully");
      }
      setIsEditMode(false); // Switch to view mode after submit
      onSuccess();
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error(error?.response?.data?.detail || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true); // Switch to edit mode
  };

  const handleCancelEdit = () => {
    if (initialData) {
      // Reset to original values
      const countryOption = countryOptions.find(
        (option) => option.label === initialData.country || option.value === initialData.country
      );
      const industryOption = industryOptions.find(
        (option) => option.label === initialData.industry_sector || option.value === initialData.industry_sector
      ) || { label: initialData.industry_sector || "", value: initialData.industry_sector || "" };

      let formattedDate = "";
      if (initialData.incorporation_date) {
        const date = new Date(initialData.incorporation_date);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split("T")[0];
        }
      }

      reset({
        name: initialData.name || "",
        organization_type: initialData.organization_type || "",
        industry_sector: industryOption,
        registration_tax_id: initialData.registration_tax_id || "",
        address: initialData.address || "",
        country: countryOption || null,
        zip_postal_code: initialData.zip_postal_code || "",
        incorporation_date: formattedDate,
      });
      setIsEditMode(false); // Switch back to view mode
    }
  };

  // Render field in read-only or edit mode
  const renderField = (
    name: keyof FormData,
    label: string,
    required: boolean = false,
    renderInput: () => React.ReactNode,
    renderDisplay: (value: any) => React.ReactNode
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {isEditMode ? (
        <>
          {renderInput()}
          {errors[name] && <p className="text-red-500 text-sm">{errors[name]?.message}</p>}
        </>
      ) : (
        <div className="px-4 py-3 bg-gray-100 rounded-lg min-h-[44px] flex items-center">
          {renderDisplay(initialData ? (initialData as any)[name] : null) || "Not provided"}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organization Name */}
          {renderField(
            "name",
            "Organization Name",
            true,
            () => (
              <input
                {...register("name", { required: "Organization name is required" })}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                placeholder="Enter organization name"
              />
            ),
            (value) => value
          )}

          {/* Organization Type */}
          {renderField(
            "organization_type",
            "Organization Type",
            true,
            () => (
              <Controller
                control={control}
                name="organization_type"
                rules={{ required: "Organization type is required" }}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                  >
                    <option value="">Select organization type</option>
                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Limited Liability Partnership">LLP</option>
                    <option value="Limited Liability Company">LLC</option>
                    <option value="Corporation">Corporation</option>
                    <option value="Nonprofit">Nonprofit</option>
                  </select>
                )}
              />
            ),
            (value) => value
          )}

          {/* Industry Sector */}
          {renderField(
            "industry_sector",
            "Industry Sector",
            true,
            () => (
              <Controller
                control={control}
                name="industry_sector"
                rules={{ required: "Industry sector is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={industryOptions}
                    placeholder="Select industry sector"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "rgba(243, 244, 246, 1)",
                        borderColor: "transparent",
                        minHeight: "44px",
                        borderRadius: "0.5rem",
                        "&:hover": { backgroundColor: "#ffffff" },
                      }),
                    }}
                  />
                )}
              />
            ),
            (value) => value?.label || value
          )}

          {/* Incorporation Date */}
          {renderField(
            "incorporation_date",
            "Date of Incorporation",
            true,
            () => (
              <input
                type="date"
                {...register("incorporation_date", {
                  required: "Incorporation date is required",
                })}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              />
            ),
            (value) => value ? new Date(value).toLocaleDateString() : ""
          )}

          {/* Tax ID */}
          {renderField(
            "registration_tax_id",
            "Registration / Tax ID",
            true,
            () => (
              <input
                {...register("registration_tax_id", {
                  required: "Tax ID is required",
                  validate: (value) => {
                    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
                    if (panRegex.test(value) || gstinRegex.test(value)) {
                      return true;
                    }
                    return "Enter valid PAN or GSTIN";
                  },
                })}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                placeholder="Enter PAN or GSTIN"
              />
            ),
            (value) => value
          )}

          {/* Address */}
          {renderField(
            "address",
            "Address",
            false,
            () => (
              <input
                {...register("address")}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                placeholder="Enter complete address"
              />
            ),
            (value) => value
          )}

          {/* Country */}
          {renderField(
            "country",
            "Country",
            true,
            () => (
              <Controller
                control={control}
                name="country"
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={countryOptions}
                    placeholder="Select country"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "rgba(243, 244, 246, 1)",
                        borderColor: "transparent",
                        minHeight: "44px",
                        borderRadius: "0.5rem",
                        "&:hover": { backgroundColor: "#ffffff" },
                      }),
                    }}
                  />
                )}
              />
            ),
            (value) => value?.label || value
          )}

          {/* Postal Code */}
          {renderField(
            "zip_postal_code",
            "Pincode",
            true,
            () => (
              <input
                {...register("zip_postal_code", {
                  required: "Pincode is required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Must be 6 digits",
                  },
                })}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                placeholder="Enter 6-digit pincode"
              />
            ),
            (value) => value
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4">
          {!isEditMode ? (
            <>
              <button
                type="button"
                onClick={handleEdit}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </>
          ) : (
            <>
              {mode === "edit" && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 ${
                  isSubmitting ? "bg-blue-400 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Processing...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default OrganizationForm;