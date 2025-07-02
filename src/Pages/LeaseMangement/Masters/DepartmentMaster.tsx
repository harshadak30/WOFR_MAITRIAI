// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import axios from "../../../helper/axios";
// import { useAuth } from "../../../context/AuthContext";

// interface FormData {
//   Entry_Name: string;
//   Event: string;
//   Entity_Name: string;
//   Description?: string;
//   GL_Code?: string;
//   GL_Description: string;
//   Dept_ID?: string;
// }

// interface EntityData {
//   id: number;
//   entity_id: number;
//   Entry_Name: string;
//   event_phase: String;
//   entity_name: string;
//   Event: string;
//   description_narration: string;
//   gl_code: string;
//   gl_description: string;
//   department_id: string;
//   created_at: string;
// }

// const GlMaster: React.FC = () => {
//   const [entities, setEntities] = useState<EntityData[]>([]);
//  const [entitiesDropdown, setEntitiesDropdown] = useState<EntityData[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoadingModules, setIsLoadingModules] = useState(true);
//   const { authState } = useAuth();
//   // const token = authState.token;
//   const token = localStorage.getItem("token");

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<FormData>();

//   useEffect(() => {
//     const fetchEntities = async () => {
//       try {
//         const response = await axios.get("/api/v1/entities" ,
//           {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       }
//         );
//         console.log("Entities fetched successfully:", response.data);
//         setEntitiesDropdown(response.data); // Store entities for dropdown
//       } catch (error) {
//         console.error("Error fetching entities:", error);
//       }
//     };

//     fetchEntities();
//   }, []);

//   // const onSubmit = async (data: FormData) => {
//   //   setIsSubmitting(true);

//   //   // Simulate API delay
//   //   await new Promise((resolve) => setTimeout(resolve, 800));

//   //   const newEntity: EntityData = {
//   //     id: entities.length + 1,
//   //     Entry_Name: data.Entry_Name,
//   //     Event: data.Event,
//   //     Entity_Name: data.Entity_Name,
//   //     Description: data.Description || "",
//   //     GL_Code: data.GL_Code || "",
//   //     GL_Description: data.GL_Description,
//   //     Dept_ID: data.Dept_ID || "Not specified",
//   //     createdAt: new Date().toLocaleDateString(),
//   //   };

//   //   setEntities((prev) => [...prev, newEntity]);
//   //   reset();
//   //   setIsSubmitting(false);
//   //   setIsModalOpen(false);
//   // };

//   const onSubmit = async (data: FormData) => {
//     // console.log(token)
//     setIsSubmitting(true);

//     const payload = {
//       entity_id: Number(data.Entity_Name),
//       department_id: Number(data.Dept_ID),
//       event_phase: data.Event,
//       entry_name: data.Entry_Name,
//       description_narration: data.Description || "",
//       gl_code: data.GL_Code || "",
//       gl_description: data.GL_Description,
//       status: "active",
//     };
//     console.log("Payload to create GL Master:", payload);

//     try {
//       const response = await axios.post("/api/v1/lease-gl-master", payload, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log("GL Master created successfully:", response.data);
//       toast.success("GL Master created successfully!");

//       fetchGlData(); // Refresh the table
//       reset();
//       setIsModalOpen(false);
//     } catch (error) {
//       console.error("Error creating GL Master:", error);
//       toast.error("Failed to create GL Master");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDelete = (id: number) => {
//     setEntities((prev) => prev.filter((entity) => entity.id !== id));
//   };

//   const openModal = () => {
//     setIsModalOpen(true);
//     reset();
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     reset();
//   };

//   const fetchGlData = async () => {
//     setIsLoadingModules(true);
//     try {
//       const response = await axios.get(`/api/v1/lease-gl-masters`);
//       setEntities(response?.data?.data?.lease_gl_masters);
//       console.log(
//         "Modules data fetched successfully:",
//         response.data.data?.lease_gl_masters
//       );
//     } catch (error) {
//       console.error("Error fetching modules data:", error);
//       toast.error("Failed to fetch modules data");
//     } finally {
//       setIsLoadingModules(false);
//     }
//   };

//   useEffect(() => {
//     fetchGlData();
//   }, []);

//   return (
//     <div className=" bg-gray-50 p-6">
//       <div className="mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           {/* Left side: Search Bar */}
//           <div className="w-full max-w-md">
//             <input
//               type="text"
//               placeholder="Search GL Master..."
//               className="w-full pl-4 pr-10 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* Right side: Buttons */}
//           <div className="flex items-center gap-4">
//             <button
//               onClick={openModal}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 4v16m8-8H4"
//                 />
//               </svg>
//               Create GL Master
//             </button>

//             <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
//               Export Excel
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b border-gray-200">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     ID
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Entity Name
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Event
//                   </th>
//                   {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Entity Name
//                     </th> */}
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Description
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     GL Code
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     GL Description
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Dept ID
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Created
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {entities.length === 0 ? (
//                   <tr>
//                     <td colSpan={9} className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center">
//                         <svg
//                           className="w-12 h-12 text-gray-300 mb-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={1}
//                             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                           />
//                         </svg>
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">
//                           No entities found
//                         </h3>

//                         <button
//                           onClick={openModal}
//                           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
//                         >
//                           Create GlMaster
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   entities.map((entity) => (
//                     <tr key={entity.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         #{entity.id}
//                       </td>
//                       {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                           {entity.Entry_Name}
//                         </td> */}
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {entity.event_phase}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {entity.entity_name}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {entity.description_narration}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {entity.gl_code}
//                       </td>

//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {entity.gl_description}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {entity.department_id}
//                       </td>

//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {entity.created_at}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button
//                           onClick={() => handleDelete(entity.id)}
//                           className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
//                           title="Delete entity"
//                         >
//                           <svg
//                             className="w-4 h-4"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                             />
//                           </svg>
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between p-6 border-b border-gray-200">
//               <h2 className="text-xl font-semibold text-gray-900">
//                 Create New GlMaster
//               </h2>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>

//             <div className="p-6">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 space-y-0">
//                 {/* Entry_Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Entry Name
//                   </label>
//                   <input
//                     {...register("Entry_Name", {
//                       required: "Entry Name is required",
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter entity name"
//                   />
//                   {errors.Entry_Name && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.Entry_Name.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Event */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Event
//                   </label>
//                   <input
//                     {...register("Event", { required: "Event is required" })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter Event"
//                   />
//                   {errors.Event && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.Event.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Entity_Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Select Entity<span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     {...register("Entity_Name", {
//                       required: "Entity selection is required",
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">Select an entity</option>
//                     {entitiesDropdown.map((entity) => (
//                       <option key={entity.entity_id} value={entity.entity_id}>
//                         {entity.entity_id} 
//                       </option>
//                     ))}
//                   </select>
//                   {errors.Entity_Name && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.Entity_Name.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Description
//                   </label>
//                   <input
//                     {...register("Description", {
//                       required: "Description is required",
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter Description"
//                   />
//                   {errors.Description && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.Description.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* GL_Code */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     GL Code <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     {...register("GL_Code", {
//                       required: "GL Code is required",
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter GL Code"
//                   />
//                   {errors.GL_Code && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.GL_Code.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* GL_Description */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     GL Description <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     {...register("GL_Description", {
//                       required: "GL Description is required",
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter entity name"
//                   />
//                   {errors.GL_Description && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.GL_Description.message}
//                     </p>
//                   )}
//                 </div>

//                 {/* Dept_ID */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Dept ID <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     {...register("Dept_ID", {
//                       required: "Dept ID is required",
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter Dept ID"
//                   />
//                   {errors.Dept_ID && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.Dept_ID.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-3 p-6 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={closeModal}
//                 className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSubmit(onSubmit)}
//                 disabled={isSubmitting}
//                 className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <svg
//                       className="animate-spin w-4 h-4"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Creating...
//                   </>
//                 ) : (
//                   "Create GlMaster"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GlMaster;




import React, { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import axios from "../../../helper/axios";
import { toast } from "react-toastify";

interface Department {
  id: number;
  department_code: string;
  department_name: string;
  isEnabled: boolean;
  status: string;
}

const DepartmentMaster: React.FC = () => {
  const [department, setDepartment] = useState<Department[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    department_code: "",
    department_name: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAsset) {
      setDepartment((prev) =>
        prev.map((asset) =>
          asset.id === editingAsset.id
            ? {
                ...asset,
                department_code: formData.department_code,
                Department_Name: formData.department_name,
              }
            : asset
        )
      );
      setEditingAsset(null);
    } else {
      const newAsset: Department = {
        id: Date.now(),
        department_code: formData.department_code,
        Department_Name: formData.department_name,
        isEnabled: true,
      };
      setDepartment((prev) => [...prev, newAsset]);
    }

    setFormData({
      department_code: "",
      department_name: "",
    });
    setShowForm(false);
  };

  const handleEdit = (asset: Department) => {
    setEditingAsset(asset);
    setFormData({
      department_code: asset.department_code,
      department_name: asset.Department_Name,
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setDepartment((prev) => prev.filter((asset) => asset.id !== id));
  };

  const toggleAssetStatus = (id: number) => {
    setDepartment((prev) =>
      prev.map((asset) =>
        asset.id === id ? { ...asset, isEnabled: !asset.isEnabled } : asset
      )
    );
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAsset(null);
    setFormData({
      department_code: "",
      department_name: "",
    });
  };

  const fetchDepartment = async () => {
    try {
      const response = await axios.get(`/api/v1/departments`);
      setDepartment(response?.data?.data?.departments || []);
      console.log("Department data fetched:", response?.data?.data?.departments);
    } catch (error) {
      console.error("Error fetching department data:", error);
      toast.error("Failed to fetch department data");
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  return (
    <div className="bg-gray-50 mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search Department..."
            className="w-full pl-4 pr-10 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Department
          </button>

          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
            Export Excel
          </button>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold mb-4">
                {editingAsset ? "Edit Department" : "Create New Department"}
              </h3>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="department_code"
                  value={formData.department_code}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="department_name"
                  value={formData.department_name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  {editingAsset ? "Update Asset" : "Save Asset"}
                </button>
                <button type="button" onClick={handleCancel} className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Department Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Department Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {department.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No Department found</td>
                </tr>
              ) : (
                department.map((asset) => (
                  <tr key={asset.id} className={asset.isEnabled ? "" : "opacity-60"}>
                    <td className="px-6 py-4">{asset.department_code}</td>
                    <td className="px-6 py-4">{asset.department_name}</td>
                    <td className="px-6 py-4">
                      {/* <button
                        onClick={() => toggleAssetStatus(asset.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${asset.isEnabled ? "bg-green-600" : "bg-gray-200"}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${asset.isEnabled ? "translate-x-6" : "translate-x-1"}`}
                        />
                      </button> */}
                      {asset.status}
                      {/* <span className="ml-2">{asset.isEnabled ? "Enabled" : "Disabled"}</span> */}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => handleEdit(asset)} className="text-blue-600 hover:text-blue-800">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(asset.id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
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
  );
};

export default DepartmentMaster;
