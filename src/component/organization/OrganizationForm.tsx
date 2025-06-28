// import { useForm, Controller } from "react-hook-form";
// import Select from "react-select";
// import countries from "world-countries";
// import { toast } from "react-hot-toast";
// import { useAuth } from "../../hooks/useAuth";
// import { useState, useEffect } from "react";
// import { Organization } from "../../types";
// import * as naics from "naics";
// import { createOrganization, updateOrganization } from "../../hooks/organizationService";

// interface OrganizationFormProps {
//   onSuccess: () => void;
//   onCancel: () => void;
//   initialData: Organization | null;
// }

// interface FormData {
//   name: string;
//   organization_type: string;
//   industry_sector: { label: string; value: string } | null;
//   registration_tax_id: string;
//   address: string;
//   country: { label: string; value: string } | null;
//   zip_postal_code: string;
//   date_of_incorporation?: string;
// }

// const countryOptions = countries.map((country) => ({
//   value: country.cca2,
//   label: country.name.common,
// }));

// // Get industries from NAICS library
// // [24] Get industries from NAICS library
// const getIndustryOptions = () => {
//   const industries = Array.from(naics.Industry.codes() as any);
//   return industries.map((industry: any) => ({ // ✅ Explicitly typing as any
//     label: `${industry.title} (${industry.code})`,
//     value: industry.code,
//     title: industry.title,
//     code: industry.code,
//   }));
// };


// const industryOptions = getIndustryOptions();

// const OrganizationForm = ({ onSuccess, onCancel, initialData }: OrganizationFormProps) => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { authState } = useAuth();

//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     formState: { errors },
//   } = useForm<FormData>();

//   useEffect(() => {
//     if (initialData) {
//       // Find country option
//       const countryOption = countryOptions.find(
//         option => option.label === initialData.country
//       );

//       // Find industry option by title or code
//       const industryOption = industryOptions.find(
//         option => option.title === initialData.industry_sector ||
//           option.code === initialData.industry_sector
//       );

//       reset({
//         name: initialData.name,
//         organization_type: initialData.organization_type,
//         industry_sector: industryOption || null,
//         registration_tax_id: initialData.registration_tax_id,
//         address: initialData.address,
//         country: countryOption || null,
//         zip_postal_code: initialData.zip_postal_code,
//         date_of_incorporation: initialData.date_of_incorporation,
//       });
//     }
//   }, [initialData, reset]);

//   const onSubmit = async (data: FormData) => {
//     if (!authState.token) {
//       toast.error("Authentication required");
//       return;
//     }

//     setIsSubmitting(true);

//     const payload = {
//       name: data.name,
//       organization_type: data.organization_type,
//       industry_sector:
//       ((data.industry_sector as any)?.title) ||
//       data.industry_sector?.label ||
//       "",      registration_tax_id: data.registration_tax_id,
//       address: data.address,
//       country: data.country?.label || "",
//       zip_postal_code: data.zip_postal_code,
//       date_of_incorporation: data.date_of_incorporation || null,
//     };

//     try {
//       if (initialData) {
//         await updateOrganization(initialData.tenant_id, payload, authState.token);
//         toast.success("Organization updated successfully");
//       } else {
//         await createOrganization(payload, authState.token);
//         toast.success("Organization registered successfully");
//       }
//       onSuccess();
//     } catch (error: any) {
//       console.error("API Error:", error);
//       toast.error(error?.response?.data?.detail || "Something went wrong");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Organization Name */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">
//               Organization Name
//             </label>
//             <input
//               {...register("name", {
//                 required: "Organization name is required",
//               })}
//               className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
//               placeholder="Enter your organization name"
//             />
//             {errors.name && (
//               <p className="text-red-500 text-sm">{errors.name.message}</p>
//             )}
//           </div>

//           {/* Organization Type */}
//           {/* Organization Type */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">
//               Organization Type
//             </label>
//             <Controller
//               control={control}
//               name="organization_type"
//               rules={{ required: "Organization type is required" }}
//               render={({ field }) => (
//                 <select
//                   {...field}
//                   className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
//                 >
//                   <option value="">Select organization type</option>
//                   <option value="Sole Proprietorship">Sole Proprietorship</option>
//                   <option value="Partnership">Partnership</option>
//                   <option value="Limited Liability Company (LLC)">Limited Liability Company (LLC)</option>
//                   <option value="Corporation (C-Corp)">Corporation (C-Corp)</option>
//                   <option value="S-Corporation (S-Corp)">S-Corporation (S-Corp)</option>
//                   <option value="Nonprofit Organization">Nonprofit Organization</option>
//                   <option value="Cooperative">Cooperative</option>
//                   <option value="Government Agency">Government Agency</option>
//                   <option value="Educational Institution">Educational Institution</option>
//                   <option value="Healthcare Provider">Healthcare Provider</option>
//                   <option value="Financial Institution">Financial Institution</option>
//                   <option value="Retail Business">Retail Business</option>
//                   <option value="Manufacturing Company">Manufacturing Company</option>
//                   <option value="Technology Company">Technology Company</option>
//                   <option value="Professional Services">Professional Services</option>
//                   <option value="Freelance/Independent Contractor">Freelance/Independent Contractor</option>
//                 </select>
//               )}
//             />
//             {errors.organization_type && (
//               <p className="text-red-500 text-sm">{errors.organization_type.message}</p>
//             )}
//           </div>

//           {/* Industry Sector */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">
//               Industry Sector
//             </label>
//             <Controller
//               control={control}
//               name="industry_sector"
//               rules={{ required: "Industry sector is required" }}
//               render={({ field }) => (
//                 <Select
//                   {...field}
//                   options={industryOptions}
//                   placeholder="Select industry sector"
//                   isClearable
//                   isSearchable
//                   className="react-select-container"
//                   classNamePrefix="react-select"
//                   styles={{
//                     control: (base, state) => ({
//                       ...base,
//                       backgroundColor: "rgba(243, 244, 246, 1)",
//                       borderColor: "transparent",
//                       boxShadow: state.isFocused
//                         ? "0 0 0 2px rgba(59, 130, 246, 0.5)"
//                         : "none",
//                       minHeight: "2.75rem",
//                       borderRadius: "0.5rem",
//                       "&:hover": {
//                         backgroundColor: "#ffffff",
//                       },
//                     }),
//                     menu: (base) => ({
//                       ...base,
//                       zIndex: 50,
//                       borderRadius: "0.5rem",
//                     }),
//                   }}
//                 />
//               )}
//             />
//             {errors.industry_sector && (
//               <p className="text-red-500 text-sm">{errors.industry_sector.message}</p>
//             )}
//           </div>

//           {/* Date of Incorporation */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">
//               Date of Incorporation
//             </label>
//             <input
//               type="date"
//               {...register("date_of_incorporation")}
//               className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
//             />
//           </div>

//           {/* Tax ID */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">
//               Registration / Tax ID
//             </label>
//             <input
//               {...register("registration_tax_id", {
//                 required: "Tax ID is required",
//               })}
//               className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
//               placeholder="Enter your tax ID"
//             />
//             {errors.registration_tax_id && (
//               <p className="text-red-500 text-sm">{errors.registration_tax_id.message}</p>
//             )}
//           </div>

//           {/* Address */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">
//               Address
//             </label>
//             <input
//               {...register("address", {
//                 required: "Address is required",
//               })}
//               className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
//               placeholder="Enter your complete address"
//             />
//             {errors.address && (
//               <p className="text-red-500 text-sm">{errors.address.message}</p>
//             )}
//           </div>

//           {/* Country */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">
//               Country
//             </label>
//             <Controller
//               control={control}
//               name="country"
//               rules={{ required: "Country is required" }}
//               render={({ field }) => (
//                 <Select
//                   {...field}
//                   options={countryOptions}
//                   placeholder="Select your country"
//                   isClearable
//                   isSearchable
//                   className="react-select-container"
//                   classNamePrefix="react-select"
//                   styles={{
//                     control: (base, state) => ({
//                       ...base,
//                       backgroundColor: "rgba(243, 244, 246, 1)",
//                       borderColor: "transparent",
//                       boxShadow: state.isFocused
//                         ? "0 0 0 2px rgba(59, 130, 246, 0.5)"
//                         : "none",
//                       minHeight: "2.75rem",
//                       borderRadius: "0.5rem",
//                       "&:hover": {
//                         backgroundColor: "#ffffff",
//                       },
//                     }),
//                     menu: (base) => ({
//                       ...base,
//                       zIndex: 50,
//                       borderRadius: "0.5rem",
//                     }),
//                   }}
//                 />
//               )}
//             />
//             {errors.country && (
//               <p className="text-red-500 text-sm">{errors.country.message}</p>
//             )}
//           </div>

//           {/* Postal Code */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium text-gray-700">
//               Zip/Postal Code
//             </label>
//             <input
//               type="text"
//               {...register("zip_postal_code", {
//                 required: "Zip code is required",
//                 pattern: {
//                   value: /^\d{6}(-\d{5})?$/,
//                   message: "Invalid zip code format",
//                 },
//               })}
//               className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
//               placeholder="e.g., 12345 or 12345-6789"
//             />
//             {errors.zip_postal_code && (
//               <p className="text-red-500 text-sm">{errors.zip_postal_code.message}</p>
//             )}
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-4 pt-4">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
//           >
//             {isSubmitting ? (
//               <>
//                 <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
//                 <span>Processing...</span>
//               </>
//             ) : (
//               <span>{initialData ? 'Update' : 'Submit'}</span>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default OrganizationForm;



import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import countries from "world-countries";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import { Organization } from "../../types";
import * as naics from "naics";
import { createOrganization, updateOrganization } from "../../hooks/organizationService";

interface OrganizationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData: Organization | null;
}

interface FormData {
  name: string;
  organization_type: string;
  industry_sector: { label: string; value: string } | null;
  registration_tax_id: string;
  address: string;
  country: { label: string; value: string } | null;
  zip_postal_code: string;
  date_of_incorporation?: string;
}

interface IndustryCode {
  code: string;
  title: string;
}

const countryOptions = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
}));

// Get industries from NAICS library
const getIndustryOptions = () => {
  const industries = Array.from((naics as any).Industry.codes()) as IndustryCode[];
  return industries.map((industry: IndustryCode) => ({
    label: `${industry.title} (${industry.code})`,
    value: industry.code,
    title: industry.title,
    code: industry.code,
  }));
};

const industryOptions = getIndustryOptions();

const OrganizationForm = ({ onSuccess, onCancel, initialData }: OrganizationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authState } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (initialData) {
      // Find country option
      const countryOption = countryOptions.find(
        option => option.label === initialData.country
      );

      // Find industry option by title or code
      const industryOption = industryOptions.find(
        option => option.title === initialData.industry_sector ||
          option.code === initialData.industry_sector
      );

      reset({
        name: initialData.name,
        organization_type: initialData.organization_type,
        industry_sector: industryOption || null,
        registration_tax_id: initialData.registration_tax_id,
        address: initialData.address,
        country: countryOption || null,
        zip_postal_code: initialData.zip_postal_code,
        date_of_incorporation: initialData.date_of_incorporation,
      });
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
      industry_sector:
        (data.industry_sector as any)?.title ||
        data.industry_sector?.label ||
        "",
      registration_tax_id: data.registration_tax_id,
      address: data.address,
      country: data.country?.label || "",
      zip_postal_code: data.zip_postal_code,
      date_of_incorporation: data.date_of_incorporation || null,
    };

    try {
      if (initialData) {
        await updateOrganization(initialData.tenant_id, payload, authState.token);
        toast.success("Organization updated successfully");
      } else {
        await createOrganization(payload, authState.token);
        toast.success("Organization registered successfully");
      }
      onSuccess();
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error(error?.response?.data?.detail || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organization Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Organization Name
            </label>
            <input
              {...register("name", {
                required: "Organization name is required",
              })}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              placeholder="Enter your organization name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Organization Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Organization Type
            </label>
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
                  <option value="Limited Liability Company (LLC)">Limited Liability Company (LLC)</option>
                  <option value="Corporation (C-Corp)">Corporation (C-Corp)</option>
                  <option value="S-Corporation (S-Corp)">S-Corporation (S-Corp)</option>
                  <option value="Nonprofit Organization">Nonprofit Organization</option>
                  <option value="Cooperative">Cooperative</option>
                  <option value="Government Agency">Government Agency</option>
                  <option value="Educational Institution">Educational Institution</option>
                  <option value="Healthcare Provider">Healthcare Provider</option>
                  <option value="Financial Institution">Financial Institution</option>
                  <option value="Retail Business">Retail Business</option>
                  <option value="Manufacturing Company">Manufacturing Company</option>
                  <option value="Technology Company">Technology Company</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Freelance/Independent Contractor">Freelance/Independent Contractor</option>
                </select>
              )}
            />
            {errors.organization_type && (
              <p className="text-red-500 text-sm">{errors.organization_type.message}</p>
            )}
          </div>

          {/* Industry Sector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Industry Sector
            </label>
            <Controller
              control={control}
              name="industry_sector"
              rules={{ required: "Industry sector is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={industryOptions}
                  placeholder="Select industry sector"
                  isClearable
                  isSearchable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "rgba(243, 244, 246, 1)",
                      borderColor: "transparent",
                      boxShadow: state.isFocused
                        ? "0 0 0 2px rgba(59, 130, 246, 0.5)"
                        : "none",
                      minHeight: "2.75rem",
                      borderRadius: "0.5rem",
                      "&:hover": {
                        backgroundColor: "#ffffff",
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 50,
                      borderRadius: "0.5rem",
                    }),
                  }}
                />
              )}
            />
            {errors.industry_sector && (
              <p className="text-red-500 text-sm">{errors.industry_sector.message}</p>
            )}
          </div>

          {/* Date of Incorporation */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Date of Incorporation
            </label>
            <input
              type="date"
              {...register("date_of_incorporation")}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
            />
          </div>

          {/* Tax ID */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Registration / Tax ID
            </label>
            <input
              {...register("registration_tax_id", {
                required: "Tax ID is required",
              })}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              placeholder="Enter your tax ID"
            />
            {errors.registration_tax_id && (
              <p className="text-red-500 text-sm">{errors.registration_tax_id.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              {...register("address", {
                required: "Address is required",
              })}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              placeholder="Enter your complete address"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Country
            </label>
            <Controller
              control={control}
              name="country"
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={countryOptions}
                  placeholder="Select your country"
                  isClearable
                  isSearchable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "rgba(243, 244, 246, 1)",
                      borderColor: "transparent",
                      boxShadow: state.isFocused
                        ? "0 0 0 2px rgba(59, 130, 246, 0.5)"
                        : "none",
                      minHeight: "2.75rem",
                      borderRadius: "0.5rem",
                      "&:hover": {
                        backgroundColor: "#ffffff",
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 50,
                      borderRadius: "0.5rem",
                    }),
                  }}
                />
              )}
            />
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country.message}</p>
            )}
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Zip/Postal Code
            </label>
            <input
              type="text"
              {...register("zip_postal_code", {
                required: "Zip code is required",
                pattern: {
                  value: /^\d{6}(-\d{5})?$/,
                  message: "Invalid zip code format",
                },
              })}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              placeholder="e.g., 12345 or 12345-6789"
            />
            {errors.zip_postal_code && (
              <p className="text-red-500 text-sm">{errors.zip_postal_code.message}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Processing...</span>
              </>
            ) : (
              <span>{initialData ? 'Update' : 'Submit'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganizationForm;
