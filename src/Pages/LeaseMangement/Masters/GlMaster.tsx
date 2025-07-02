import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "../../../helper/axios";
import { toast } from "react-toastify";



interface FormData {
  Entry_Name: string;
  Event: string;
  Entity_Name: string;
  Description?: string;
  GL_Code?: string;
  GL_Description: string;
  Dept_ID?: string;
}

interface EntityData {
  id: number;
  entity_id: number;
  entry_name: string;
  event_phase: String;
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
  const [entities, setEntities] = useState<EntityData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // const onSubmit = async (data: FormData) => {
  //   setIsSubmitting(true);

  //   // Simulate API delay
  //   await new Promise((resolve) => setTimeout(resolve, 800));

  //   const newEntity: EntityData = {
  //     id: entities.length + 1,
  //     entry_name: data.Entry_Name,
  //     Event: data.Event,
  //     entity_name: data.Entity_Name,
  //     // description: data.Description || "",
  //     gl_code: data.GL_Code || "",
  //     gl_description: data.GL_Description,
  //     department_id: data.Dept_ID || "Not specified",
  //     created_at: new Date().toLocaleDateString(),
  //   };

  //   setEntities((prev) => [...prev, newEntity]);
  //   reset();
  //   setIsSubmitting(false);
  //   setIsModalOpen(false);
  // };

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

  const fetchGlData = async () => {
    try {
      const response = await axios.get(`/api/v1/lease-gl-masters`);
      setEntities(response?.data?.data?.lease_gl_masters);
      console.log(
        "GL data fetched successfully:",
        response.data.data?.lease_gl_masters
      );
    } catch (error) {
      console.error("Error fetching GL data:", error);
      toast.error("Failed to fetch GL data");
    }
  };

  useEffect(() => {
    fetchGlData();
  }, []);

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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entities.length === 0 ? (
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
                  entities.map((entity, index) => (
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

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 space-y-0">
                {/* Entry_Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entry Name
                  </label>
                  <input
                    {...register("Entry_Name", {
                      required: "Entry Name is required",
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter entity name"
                  />
                  {errors.Entry_Name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.Entry_Name.message}
                    </p>
                  )}
                </div>

                {/* Event */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event
                  </label>
                  <input
                    {...register("Event", { required: "Event is required" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter Event"
                  />
                  {errors.Event && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.Event.message}
                    </p>
                  )}
                </div>

                {/* Entity_Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Entity Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("Entity_Name", {
                      required: "Entity Name is required",
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter Entity Name"
                  />
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
                    {...register("Description", {
                      required: "Description is required",
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter Description"
                  />
                  {errors.Description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.Description.message}
                    </p>
                  )}
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
                    Dept ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("Dept_ID", {
                      required: "Dept ID is required",
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter Dept ID"
                  />
                  {errors.Dept_ID && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.Dept_ID.message}
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
                type="button"
                // onClick={handleSubmit(onSubmit)}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default GlMaster;
