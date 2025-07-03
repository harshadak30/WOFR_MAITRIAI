// import { useState, useEffect } from "react";
// import { ChevronUp, Edit } from "lucide-react";
// import { Organization } from "../../../types";
// import { useAuth } from "../../../hooks/useAuth";
// import OrganizationForm from "../../../component/organization/OrganizationForm";
// import OrganizationTable from "../../../component/organization/OrganizationTable";
// import { fetchOrganizations } from "../../../hooks/organizationService";

// const OrganizationManager = () => {
//   const [organizations, setOrganizations] = useState<Organization[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [editingOrganization, setEditingOrganization] =
//     useState<Organization | null>(null);
//   const { authState } = useAuth();

//   const firstPageLimit = 50;
//   const subsequentPageLimit = 20;

//   const loadOrganizations = async (page: number) => {
//     if (!authState.token) return;

//     setIsLoading(true);
//     try {
//       const result = await fetchOrganizations(
//         authState.token,
//         page,
//         page === 1 ? firstPageLimit : subsequentPageLimit
//       );

//       setOrganizations(result.organizations);
//       setTotalItems(result.totalItems);

//       // Check if organization data needs to be filled
//       if (result.organizations.length > 0) {
//         const org = result.organizations[0];
//         const needsUpdate = !org.name || 
//                            !org.organization_type || 
//                            !org.industry_sector || 
//                            !org.country || 
//                            !org.zip_postal_code;
        
//         if (needsUpdate) {
//           setEditingOrganization(org);
//           setShowForm(true);
//         }
//       }
//     } catch (error) {
//       console.error("Failed to load organizations:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadOrganizations(currentPage);
//   }, [currentPage, authState.token]);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleFormSuccess = () => {
//     setShowForm(false);
//     setEditingOrganization(null);
//     loadOrganizations(1);
//   };

//   const handleEditOrganization = (organization: Organization) => {
//     setEditingOrganization(organization);
//     setShowForm(true);
//   };

//   const handleCancelForm = () => {
//     setShowForm(false);
//     setEditingOrganization(null);
//   };

//   const isDataIncomplete = (org: Organization) => {
//     return !org.name || 
//            !org.organization_type || 
//            !org.industry_sector || 
//            !org.country || 
//            !org.zip_postal_code;
//   };

//   return (
//     <div className="mx-auto">
//       {showForm ? (
//         <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
//           <div className="p-6 border-b border-gray-200 flex justify-between items-center">
//             <h2 className="text-xl font-semibold text-gray-800">
//               {editingOrganization && isDataIncomplete(editingOrganization)
//                 ? "Complete Organization Details"
//                 : "Edit Organization"}
//             </h2>
//             <button
//               onClick={handleCancelForm}
//               className="text-gray-500 hover:text-gray-700 transition-colors"
//             >
//               <ChevronUp size={24} />
//             </button>
//           </div>
//           <OrganizationForm
//             onSuccess={handleFormSuccess}
//             initialData={editingOrganization}
//             onCancel={handleCancelForm}
//           />
//         </div>
//       ) : (
//         organizations.length > 0 && (
//           <div className="space-y-4">
//             {/* Show alert if data is incomplete */}
//             {organizations.some(org => isDataIncomplete(org)) && (
//               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center">
//                     <div className="flex-shrink-0">
//                       <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                     <div className="ml-3">
//                       <p className="text-sm text-yellow-800">
//                         Organization details are incomplete. Please complete your organization information.
//                       </p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => handleEditOrganization(organizations[0])}
//                     className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded text-sm transition-colors"
//                   >
//                     <Edit size={14} />
//                     Complete Details
//                   </button>
//                 </div>
//               </div>
//             )}
            
//             <div className="bg-white rounded-xl shadow-md overflow-hidden">
//               <OrganizationTable
//                 organizations={organizations}
//                 isLoading={isLoading}
//                 currentPage={currentPage}
//                 totalItems={totalItems}
//                 itemsPerPage={
//                   currentPage === 1 ? firstPageLimit : subsequentPageLimit
//                 }
//                 onPageChange={handlePageChange}
//                 onEdit={handleEditOrganization}
//               />
//             </div>
//           </div>
//         )
//       )}

//       {!showForm && organizations.length === 0 && !isLoading && (
//         <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
//           <div className="text-center mb-6">
//             <h3 className="text-xl font-semibold text-gray-800 mb-2">
//               No Organizations Found
//             </h3>
//             <p className="text-gray-600">
//               No tenant data available
//             </p>
//           </div>
//         </div>
//       )}

//       {isLoading && (
//         <div className="flex justify-center items-center py-20">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrganizationManager;


import { useState, useEffect } from "react";
import { Organization } from "../../../types";
import { useAuth } from "../../../hooks/useAuth";
import OrganizationForm from "./OrganizationForm";
import { fetchOrganizations } from "../../../hooks/organizationService";

const OrganizationManager = () => {
  const [ ,setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const { authState } = useAuth();
  const [isEditting, setIsEditting] = useState(false);

  const loadOrganizations = async () => {
    if (!authState.token) return;

    setIsLoading(true);
    try {
      const result = await fetchOrganizations(authState.token, 1, 1); // Just get the first organization
      
      if (result.organizations.length > 0) {
        setEditingOrganization(result.organizations[0]);
      } else {
        setEditingOrganization(null); // Ensure null when no organizations exist
      }
      setOrganizations(result.organizations);
    } catch (error) {
      console.error("Failed to load organizations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, [authState.token]);

  const handleFormSuccess = () => {
    setIsEditting(false);
    loadOrganizations(); // Refresh the data after successful submission
  };

  const handleCancelForm = () => {
    // If in create mode and canceled, reload to show empty state
    setIsEditting(false);
    if (!editingOrganization) {
      loadOrganizations();
    }
    
  };

  useEffect(() => {
    if(!isEditting){
      loadOrganizations();
    }
  
    
  }, [isEditting])
  

  return (
    <div className="mx-auto  px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingOrganization ? "Organization Details" : "Create Organization"}
          </h2>
        </div>
        {!isLoading && (
          <OrganizationForm
            onSuccess={handleFormSuccess}
            initialData={editingOrganization}
            onCancel={handleCancelForm}
            mode={editingOrganization ? "edit" : "create"}
            isEditting={isEditting}
            setIsEditting={setIsEditting}
          />
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default OrganizationManager;