import { useState, useEffect } from "react";
import { ChevronUp, Edit, Plus } from "lucide-react";
import { Organization } from "../../../types";
import { useAuth } from "../../../hooks/useAuth";
import OrganizationForm from "../../../component/organization/OrganizationForm";
import { fetchOrganizations } from "../../../hooks/organizationService";

const OrganizationManager = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
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

      // Set the first organization as the one to edit if none is selected
      if (result.organizations.length > 0 && !editingOrganization) {
        setEditingOrganization(result.organizations[0]);
      }
    } catch (error) {
      console.error("Failed to load organizations:", error);
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
    loadOrganizations(currentPage); // Refresh the current page
  };

  const handleCreateNew = () => {
    setEditingOrganization(null); // Set to null for create mode
  };

  const handleEditOrganization = (organization: Organization) => {
    setEditingOrganization(organization);
  };

  const isDataIncomplete = (org: Organization) => {
    return (
      !org.name ||
      !org.organization_type ||
      !org.industry_sector ||
      !org.country ||
      !org.zip_postal_code
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Organization
        </button>
      </div>

      {/* Always show the form at the top */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingOrganization
              ? isDataIncomplete(editingOrganization)
                ? "Complete Organization Details"
                : "Edit Organization"
              : "Create New Organization"}
          </h2>
        </div>
        <OrganizationForm
          onSuccess={handleFormSuccess}
          initialData={editingOrganization}
          onCancel={() => {}}
          mode={editingOrganization ? "edit" : "create"}
        />
      </div>

      {/* Organizations table below the form */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : organizations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Organizations Found
            </h3>
            <p className="text-gray-600">Your newly created organization will appear here</p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Industry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {organizations.map((org) => (
                    <tr key={org.tenant_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {org.name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {org.organization_type || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {org.industry_sector || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {org.country || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditOrganization(org)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          <Edit className="h-4 w-4 inline mr-1" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalItems > firstPageLimit && (
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {Math.ceil(totalItems / (currentPage === 1 ? firstPageLimit : subsequentPageLimit))}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={organizations.length < subsequentPageLimit}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrganizationManager;