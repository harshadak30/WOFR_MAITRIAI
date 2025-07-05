// import { useState } from "react";
// import { useForm } from "react-hook-form";

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
//   Entry_Name: string;
//   Event: String;
//   Entity_Name: string;
//   Description: string;
//   GL_Code: string;
//   GL_Description: string;
//   Dept_ID: string;
//   createdAt: string;
// }

// const GlMaster: React.FC = () => {
//   const [entities, setEntities] = useState<EntityData[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm<FormData>();

//   const onSubmit = async (data: FormData) => {
//     setIsSubmitting(true);

//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 800));

//     const newEntity: EntityData = {
//       id: entities.length + 1,
//       Entry_Name: data.Entry_Name,
//       Event: data.Event,
//       Entity_Name: data.Entity_Name,
//       Description: data.Description || "",
//       GL_Code: data.GL_Code || "",
//       GL_Description: data.GL_Description,
//       Dept_ID: data.Dept_ID || "Not specified",
//       createdAt: new Date().toLocaleDateString(),
//     };

//     setEntities((prev) => [...prev, newEntity]);
//     reset();
//     setIsSubmitting(false);
//     setIsModalOpen(false);
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
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                     Entity Name
//                   </th>
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
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                         {entity.Entry_Name}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {entity.Event}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {entity.Entity_Name}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {entity.Description}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {entity.GL_Code}
//                       </td>

//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {entity.GL_Description}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {entity.Dept_ID}
//                       </td>

//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                         {entity.createdAt}
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
//                     Entity Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     {...register("Entity_Name", {
//                       required: "Entity Name is required",
//                     })}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     placeholder="Enter Entity Name"
//                   />
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
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "../../../helper/axios";
import { toast } from "react-toastify";
import useMaster from "../../../hooks/useMaster";
import Pagination from "../../../component/common/ui/Table/Pagination";
interface FormData {
  Entry_Name: string;
  Event: string;
  Entity_Name: string;
  Description?: string;
  GL_Code?: string;
  GL_Description: string;
  Dept_ID?: string;
  // entity_id:number;
  Entity_ID: number; // This should match your form field name
}

interface EntityData {
  id: number;
  entity_id: number;
  entry_name: string;
  event_phase: string;
  entity_name: string;
  Event: string;
  description_narration: string;
  gl_code: string;
  gl_description: string;
  department_id: string;
  department_name: string;
  created_at: string;
}

const GlMaster: React.FC = () => {
  // const [entities, setEntities] = useState<EntityData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  // const { glData, entities, department } = useMaster();

   const {
    glData,
    handleMaster,
    entities,
    department,
    glPagination,
    fetchGlData,
    setGlPagination
  } = useMaster();
 

useEffect(() => {
    fetchGlData(glPagination.currentPage, glPagination.itemsPerPage);
  }, [glPagination.currentPage, glPagination.itemsPerPage])

 const handlePageChange = (page: number) => {
    setGlPagination(prev => ({
      ...prev,
      currentPage: page
    }));
    fetchGlData(page, glPagination.itemsPerPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openModal = () => {
    setIsModalOpen(true);
    reset();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  // const handleMaster = async (data: FormData) => {
  //   // console.log(token)
  //   setIsSubmitting(true);

  //   const payload = {
  //     entity_id: Number(data.Entity_ID), // Changed from entity_name to entity_id
  //     department_id: Number(data.Dept_ID),
  //     event_phase: data.Event,
  //     entry_name: data.Entry_Name,
  //     description_narration: data.Description || "",
  //     gl_code: data.GL_Code || "",
  //     gl_description: data.GL_Description,
  //     status: "active",
  //   };

  //   try {
  //     const response = await axios.post("/api/v1/lease-gl-master", payload, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     console.log("GL Master created successfully:", response.data);
  //     toast.success("GL Master created successfully!");

  //     // if (response.data?.data) {
  //     //   // setEntities(prev => [...prev, response.data.data]);
  //     //   toast.success("GL Master created successfully!");
  //     // }
  //     // Option 2: Refetch all data
  //     // else {
  //     //   await fetchGlData(); // Wait for the refetch to complete
  //     //   toast.success("GL Master created successfully!");
  //     // }

  //     reset();
  //     setIsModalOpen(false);
  //   } catch (error: any) {
  //     console.error("Error creating GL Master:", error);
  //     toast.error(
  //       error.response?.data?.message ||
  //         "Failed to create GL Master. Please check console for details."
  //     );
  //     console.log("Error details:", error.response?.data);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <div className=" bg-gray-50 p-6">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-8">
          {/* Left side: Search Bar */}
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="Search GL Master..."
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
              Create GL Master
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
                    Entry Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Entity Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Department Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    GL Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    GL Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Dept ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created
                  </th>
                  {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {glData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
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
                        <h3>
                          Please first fill the form in Entity and Department master
                          </h3> 

                        <button
                          onClick={openModal}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Create GlMaster
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  glData.map((entity, index) => (
                    <tr key={entity.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {entity.entry_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entity.event_phase}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entity.entity_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entity.department_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entity.description_narration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entity.gl_code}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entity.gl_description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entity.department_id}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entity.created_at}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          // onClick={() => handleDelete(entity.id)}
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
                      </td> */}
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
                Create New GlMaster
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

            <form
              onSubmit={handleSubmit((data) => handleMaster(data, closeModal))}
            >
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 space-y-0">
                  {/* Entry_Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entry Name
                    </label>
                    <input
                      {...register("Entry_Name")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter entity name"
                    />
                    {/* {errors.Entry_Name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.Entry_Name.message}
                      </p>
                    )} */}
                  </div>

                  {/* Event */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event
                    </label>
                    <input
                      {...register("Event")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter Event"
                    />
                    {/* {errors.Event && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.Event.message}
                      </p>
                    )} */}
                  </div>

                  {/* Entity_Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entity Name <span className="text-red-500">*</span>
                    </label>

                    {entities.length > 0 ? (
                      <select
                        // {...register("Entity_ID", {
                        //   required: "Entity Name is required",
                        // })}
                        {...register("Entity_ID", {
                          required: "Entity Name is required",
                          valueAsNumber: true, // This ensures the value is treated as a number
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Entity Name</option>
                        {entities.map((en) => (
                          <option key={en.entity_id} value={en.entity_id}>
                            {en.entity_name}
                          </option>
                        ))}
                        {errors.Entity_Name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.Entity_Name.message}
                          </p>
                        )}
                      </select>
                   
                    ) : (
                      <input
                        {...register("Entity_Name", {
                          required: "Entity Name is required",
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter Entity Name"
                      />
                    )}

                    {errors.Entity_Name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.Entity_Name.message}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      {...register("Description")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter Description"
                    />
                    {/* {errors.Description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.Description.message}
                      </p>
                    )} */}
                  </div>

                  {/* GL_Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GL Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("GL_Code", {
                        required: "GL Code is required",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter GL Code"
                    />
                    {errors.GL_Code && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.GL_Code.message}
                      </p>
                    )}
                  </div>

                  {/* GL_Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GL Description <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("GL_Description", {
                        required: "GL Description is required",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter entity name"
                    />
                    {errors.GL_Description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.GL_Description.message}
                      </p>
                    )}
                  </div>

                  {/* Dept_ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department Name <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("Dept_ID", {
                        required: "Department is required",
                        valueAsNumber: true, // Convert to number
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Department Name</option>
                      {department.map((de) => (
                        <option key={de.department_id} value={de.department_id}>
                          {de.department_name}
                        </option>
                      ))}
                    </select>
                    {errors.Dept_ID && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.Dept_ID.message}
                      </p>
                    )}
                       {department.length === 0 && (
                      <p className="text-yellow-600 text-sm mt-2">
                        Note:  please create
                        departments in the Department Master first.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 p-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
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
                    "Create GlMaster"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    {/* {glData.length > 0 && (
        <div className="px-4 py-3 border-t border-blue-400">
          <Pagination
            currentPage={glPagination.currentPage}
            totalPages={glPagination.totalPages}
            totalItems={glPagination.totalItems}
            itemsPerPage={glPagination.itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      )} */}
      

  {/* <div className="px-4 py-3 border-t border-blue-400 ">
    <Pagination
      currentPage={glPagination.currentPage}
      totalPages={glPagination.totalPages}
      totalItems={glPagination.totalItems}
      itemsPerPage={glPagination.itemsPerPage}
      onPageChange={handlePageChange}
    />
  </div> */}

    </div>
  );
};

export default GlMaster;
