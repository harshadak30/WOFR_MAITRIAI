import { useState, useEffect } from "react";

import { ChevronUp, Plus } from "lucide-react";
import { Organization } from "../../../types";
import { useAuth } from "../../../hooks/useAuth";
import OrganizationForm from "../../../component/organization/OrganizationForm";
import OrganizationTable from "../../../component/organization/OrganizationTable";
import { fetchOrganizations } from "../../../hooks/organizationService";

const OrganizationManager = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null);
  const { authState } = useAuth();

  const firstPageLimit = 50;
  const subsequentPageLimit = 20;

  const loadOrganizations = async (page: number) => {
    if (!authState.token) return;

    setIsLoading(true);
    try {
      const result = await fetchOrganizations(
        authState.token,
        page,
        page === 1 ? firstPageLimit : subsequentPageLimit
      );

      setOrganizations(result.organizations);
      setTotalItems(result.totalItems);

      if (result.organizations.length === 0 && page === 1) {
        setShowForm(true);
      }
    } catch (error) {
      console.error("Failed to load organizations:", error);
      if (page === 1) setShowForm(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations(currentPage);
  }, [currentPage, authState.token]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingOrganization(null);
    loadOrganizations(1);
  };

  const handleAddNew = () => {
    setEditingOrganization(null);
    setShowForm(true);
  };

  const handleEditOrganization = (organization: Organization) => {
    setEditingOrganization(organization);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingOrganization(null);
  };

  return (
    <div className=" mx-auto ">

      {showForm ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingOrganization
                ? "Edit Organization"
                : "Register New Organization"}
            </h2>
            <button
              onClick={handleCancelForm}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronUp size={24} />
            </button>
          </div>
          <OrganizationForm
            onSuccess={handleFormSuccess}
            initialData={editingOrganization}
            onCancel={handleCancelForm}
          />
        </div>
      ) : (
        organizations.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <OrganizationTable
              organizations={organizations}
              isLoading={isLoading}
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={
                currentPage === 1 ? firstPageLimit : subsequentPageLimit
              }
              onPageChange={handlePageChange}
              onEdit={handleEditOrganization}
            />
          </div>
        )
      )}

      {!showForm && organizations.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Organizations Found
            </h3>
            <p className="text-gray-600">
              Get started by registering your first organization
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition-all duration-200 shadow-sm"
          >
            <Plus size={18} />
            <span>Register Organization</span>
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default OrganizationManager;


