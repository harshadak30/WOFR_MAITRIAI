import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "../../../helper/axios";

interface FormData {
  name: string;
  Industry_Sector: string;
  incorporation_date?: string;
  Ownership_share?: string;
  Tax_ID: string;
  Parent_Name?: string;
  Relationship_Type: string;
}

interface EntityData {
  id: number;
  name: string;
  functionalCurrency: string;
  financialStart: string;
  OwnerShipShare: string;
  departName: string;
  parentOrganization: string;
  relatedPartyRelationship: string;
  createdAt: string;
}

const EntityMaster: React.FC = () => {
  const [entities, setEntities] = useState<EntityData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Static data for dropdowns
  const relationshipTypes = [
    { id: 1, name: "Subsidiary" },
    { id: 2, name: "Branch" },
    { id: 3, name: "Division" },
    { id: 4, name: "Joint Venture" },
    { id: 5, name: "Associate" },
  ];

  const organizations = [
    { tenant_id: "ORG001", name: "Main Corp" },
    { tenant_id: "ORG002", name: "Tech Solutions Ltd" },
    { tenant_id: "ORG003", name: "Global Services Inc" },
  ];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // const onSubmit = async (data: FormData) => {
  //   setIsSubmitting(true);
  //   console.log(data)

  //   // Simulate API delay
  //   await new Promise((resolve) => setTimeout(resolve, 800));

  //   const newEntity: EntityData = {
  //     id: entities.length + 1,
  //     name: data.name,
  //     functionalCurrency: data.Industry_Sector || "Not specified",
  //     financialStart: data.incorporation_date || "Not specified",
  //     OwnerShipShare: data.Ownership_share || "Not specified",
  //     departName: data.Tax_ID || "Not specified",
  //     parentOrganization:
  //       data.Parent_Name === "own"
  //         ? "Own Organization"
  //         : organizations.find((org) => org.tenant_id === data.Parent_Name)
  //             ?.name || "Not specified",
  //     relatedPartyRelationship:
  //       relationshipTypes.find(
  //         (type) => type.id.toString() === data.Relationship_Type
  //       )?.name || "Not specified",
  //     createdAt: new Date().toLocaleDateString(),
  //   };

  //   setEntities((prev) => [...prev, newEntity]);
  //   reset();
  //   setIsSubmitting(false);
  //   setIsModalOpen(false);
  // };
// const onSubmit = async (data: FormData) => {
//   setIsSubmitting(true);
//  console.log(token);
//   try {
//     // Prepare the request body according to the API requirements
//     const requestBody = {
//       organization_id: organizationId,
//       entity_name: data.name,
//       functional_currency: data.Industry_Sector,
//       financial_start_date: data.incorporation_date 
//         ? new Date(data.incorporation_date).toISOString() 
//         : new Date().toISOString(),
//       ownership_name_percent: data.Ownership_share || "0",
//       relationship_type: relationshipTypes.find(
//         (type) => type.id.toString() === data.Relationship_Type
//       )?.name || "Not specified",
//       related_to: data.Parent_Name === "own" 
//         ? "Own Organization" 
//         : organizations.find((org) => org.tenant_id === data.Parent_Name)?.name || "Not specified",
//       department_name: data.Tax_ID || "Not specified",
//       status: "active"
//     };

//     // Make the API call
//     const response = await axios.post('/api/v1/entities',{
//       requestBody
//     }, {
     
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//     });

//     if (!response.ok) {
//       throw new Error('Failed to create entity');
//     }

//     console.log(response);

//     // Update local state with the new entity
//     const newEntity: EntityData = {
//       id: entities.length + 1,
//       name: data.name,
//       functionalCurrency: data.Industry_Sector || "Not specified",
//       financialStart: data.incorporation_date || "Not specified",
//       OwnerShipShare: data.Ownership_share || "Not specified",
//       departName: data.Tax_ID || "Not specified",
//       parentOrganization: 
//         data.Parent_Name === "own"
//           ? "Own Organization"
//           : organizations.find((org) => org.tenant_id === data.Parent_Name)
//               ?.name || "Not specified",
//       relatedPartyRelationship:
//         relationshipTypes.find(
//           (type) => type.id.toString() === data.Relationship_Type
//         )?.name || "Not specified",
//       createdAt: new Date().toLocaleDateString(),
//     };

//     setEntities((prev) => [...prev, newEntity]);
//     reset();
//     setIsModalOpen(false);
//   } catch (error) {
//     console.error('Error creating entity:', error.response.data);
//   } finally {
//     setIsSubmitting(false);
//   }
// };
const onSubmit = async (data: FormData) => {
  setIsSubmitting(true);
  
  try {
    // Verify token exists
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Prepare the request body
    const requestData = {
      organization_id: organizationId,
      entity_name: data.name,
      functional_currency: data.Industry_Sector,
      financial_start_date: data.incorporation_date 
        ? new Date(data.incorporation_date).toISOString() 
        : new Date().toISOString(),
      ownership_name_percent: data.Ownership_share || "0",
      relationship_type: relationshipTypes.find(
        (type) => type.id.toString() === data.Relationship_Type
      )?.name || "Not specified",
      related_to: data.Parent_Name === "own" 
        ? "Own Organization" 
        : organizations.find((org) => org.tenant_id === data.Parent_Name)?.name || "Not specified",
      department_name: data.Tax_ID || "Not specified",
      status: "active"
    };

    // Make the API call
    const response = await axios.post('/api/v1/entities', requestData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Fixed: Added space after Bearer
      }
    });
      console.log(response);

    // Update local state with the new entity
    const newEntity: EntityData = {
      id: entities.length + 1,
      name: data.name,
      functionalCurrency: data.Industry_Sector || "Not specified",
      financialStart: data.incorporation_date || "Not specified",
      OwnerShipShare: data.Ownership_share || "Not specified",
      departName: data.Tax_ID || "Not specified",
      parentOrganization: 
        data.Parent_Name === "own"
          ? "Own Organization"
          : organizations.find((org) => org.tenant_id === data.Parent_Name)
              ?.name || "Not specified",
      relatedPartyRelationship:
        relationshipTypes.find(
          (type) => type.id.toString() === data.Relationship_Type
        )?.name || "Not specified",
      createdAt: new Date().toLocaleDateString(),
    };

    setEntities((prev) => [...prev, newEntity]);
    reset();
    setIsModalOpen(false);
  } catch (error) {
    console.error('Error creating entity:', error.response?.data || error.message);
    // Add user feedback here (e.g., toast notification)
  } finally {
    setIsSubmitting(false);
  }
};
  const handleDelete = (id: number) => {
    setEntities((prev) => prev.filter((entity) => entity.id !== id));
  };

  const openModal = () => {
    setIsModalOpen(true);
    reset();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };
  const token=localStorage.getItem('token')
  const [organizationId,setOrganizationId]=useState('');
  const getId=async()=>{
    try{
 const response= await axios.get('/api/v1/tenant?page=1&limit=10&sort_by=created_at&sort_order=asc',{
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
    })
           console.log(response.data.data);

       console.log(response.data.data.tenants[0].tenant_id);
      setOrganizationId(response.data.data.tenants[0].tenant_id);

    }
    catch(e){
      console.log(e);

    }
   

  }
  useEffect(()=>{
    getId();
  },[])

  return (
    <div className=" bg-gray-50 p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          {/* Left side: Search Bar */}
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="Search entity..."
              className="w-full pl-4 pr-10 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
         
          </div>

          {/* Right side: Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={openModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Entity
            </button>

            <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
              Export Excel
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Entity Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Currency
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Financial Start
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Parent Organization
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Relationship
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    OwnerShipShare
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entities.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-gray-300 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No entities found
                        </h3>              
                        <button
                          onClick={openModal}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Create Entity
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  entities.map((entity) => (
                    <tr key={entity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{entity.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {entity.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entity.functionalCurrency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entity.financialStart}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entity.departName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entity.parentOrganization}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {entity.relatedPartyRelationship}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entity.OwnerShipShare}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entity.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(entity.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                          title="Delete entity"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Entity
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Two Column Form Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Basic Information
                  </h3>

                  {/* Entity Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entity Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("name", {
                        required: "Entity name is required",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter entity name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Functional Currency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Functional Currency
                      <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="Industry_Sector"
                      rules={{ required: "Currency is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select currency</option>
                          <option value="Indian Rupee (INR)">
                            Indian Rupee (INR)
                          </option>
                          <option value="US Dollar (USD)">
                            US Dollar (USD)
                          </option>
                          <option value="Euro (EUR)">Euro (EUR)</option>
                          <option value="British Pound (GBP)">
                            British Pound (GBP)
                          </option>
                          <option value="Australian Dollar (AUD)">
                            Australian Dollar (AUD)
                          </option>
                          <option value="Singapore Dollar (SGD)">
                            Singapore Dollar (SGD)
                          </option>
                        </select>
                      )}
                    />
                    {errors.Industry_Sector && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.Industry_Sector.message}
                      </p>
                    )}
                  </div>

                  {/* Financial Start */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Financial Start Date
                    </label>
                    <input
                      type="date"
                      {...register("incorporation_date")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Department Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department Name
                    </label>
                    <input
                      {...register("Tax_ID")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter department name"
                    />
                  </div>
                </div>

                {/* Right Column - Organizational Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Organizational Details
                  </h3>

                  {/* Ownership Share */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ownership Share (%){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register("Ownership_share")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter ownership share"
                      min="0"
                      max="100"
                    />
                  </div>

                  {/* Parent Organization */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Organization
                    </label>
                    <Controller
                      control={control}
                      name="Parent_Name"
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select parent organization</option>
                          <option value="own">Own Organization</option>
                          {organizations.map((org) => (
                            <option key={org.tenant_id} value={org.tenant_id}>
                              {org.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>

                  {/* Relationship Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Related Party Relationship
                    </label>
                    <Controller
                      control={control}
                      name="Relationship_Type"
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select relationship type</option>
                          {relationshipTypes.map((type) => (
                            <option key={type.id} value={type.id.toString()}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Entity"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityMaster;