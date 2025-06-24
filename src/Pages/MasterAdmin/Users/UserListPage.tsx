import { useContext, useEffect, useState } from "react";
import { ArrowLeft, DownloadIcon, Search, UserPlusIcon } from "lucide-react";
import ExternalOrganizations from "./ExternalOrganizations";
import { AuthContext } from "../../../context/AuthContext";
import UserRolesPage from "./UserRolesPage";
import AddUserModal from "../../SuperAdminPages/User/NewUser/AddUserModal";
import AddUserExcel from "../../SuperAdminPages/User/NewUser/AddUserExcel";
import UserManagementWrapper from "../../SuperAdminPages/User/NewUser/UserManagementWrapper";
import { fetchOrganizations } from "../../../hooks/organizationService";
import { useNavigate } from "react-router-dom";
import { Organization } from "../../../types";
function UserListPage() {
  const [showModuleView, setShowModuleView] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddUserExcelModal, setshowAddUserExcelModal] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(true);
  const { authState } = useContext(AuthContext);
  const userType = authState.user_type;
  const navigate = useNavigate();
  useEffect(() => {
    const loadOrganizations = async () => {
      if (!authState.token) return;

      try {
        const result = await fetchOrganizations(authState.token, 1, 10);
        setOrganizations(result.organizations);
      } catch (error) {
        console.error("Failed to load organizations:", error);
      } finally {
        setIsLoadingOrganizations(false);
      }
    };

    loadOrganizations();
  }, [authState.token]);

  const onBack = () => {
    navigate("/dashboard/org-form");
  };

  const handleToggleView = () => setShowModuleView((prev) => !prev);
  const handleSaveUser = () => {};
  const renderSwitch = (
    <label className="inline-flex relative items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={showModuleView}
        onChange={handleToggleView}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
      <span className="ml-2 text-sm font-medium text-gray-700">
        {showModuleView ? "External" : "Internal"}
      </span>
    </label>
  );

  return (
    <div className=" bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200">
        <nav className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="m-5">
              <h2 className="text-lg font-semibold text-gray-800">
                {userType === "master_admin" && showModuleView
                  ? " External User "
                  : "Internal User"}
              </h2>

              {userType === "master_admin" && (
                <div className="md:hidden">{renderSwitch}</div>
              )}
            </div>

            <div className="flex flex-col md:flex-row w-full md:w-auto items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto">
                {userType === "super_admin" && (
                  <>
                    <button
                      onClick={() => setShowAddUserModal(true)}
                      disabled={organizations.length === 0}
                      className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition whitespace-nowrap ${
                        organizations.length === 0
                          ? "text-gray-400 bg-gray-200 cursor-not-allowed"
                          : "text-white bg-[#008F98] hover:bg-[#007a82]"
                      }`}
                    >
                      <UserPlusIcon size={16} /> Add Users
                    </button>

                    <button
                      onClick={() => setshowAddUserExcelModal(true)}
                      disabled={organizations.length === 0}
                      className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition whitespace-nowrap ${
                        organizations.length === 0
                          ? "text-gray-400 bg-gray-200 cursor-not-allowed"
                          : "text-white bg-[#008F98] hover:bg-[#007a82]"
                      }`}
                    >
                      <DownloadIcon size={16} /> Import Users
                    </button>
                  </>
                )}

                <div className="relative w-full md:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {userType === "master_admin" && (
                <div className="hidden md:block">{renderSwitch}</div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Modal */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onSave={handleSaveUser} // Optional
          modules={[]}
        />
      )}

      {showAddUserExcelModal && (
        <AddUserExcel
          onClose={() => setshowAddUserExcelModal(false)}
          onSave={handleSaveUser} // Optional
          modules={[]}
        />
      )}

      <div className="flex-1 relative z-0 mx-auto mt-1 w-full">
        {userType === "super_admin" &&
        !isLoadingOrganizations &&
        organizations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-sm mx-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Organizations Found
              </h3>
              <p className="text-gray-600 mb-4">
                Please create an organization first before adding users.
              </p>
              <button
                onClick={onBack}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150 mb-4"
              >
                <ArrowLeft size={16} className="mr-2" />
                Organization Form
              </button>
            </div>
          </div>
        ) : (
          <>
            {userType === "master_admin" ? (
              showModuleView ? (
                <UserRolesPage isReadOnly={false} searchTerm={searchTerm} />
              ) : (
                <ExternalOrganizations
                  isReadOnly={false}
                  searchTerm={searchTerm}
                />
              )
            ) : (
              <UserManagementWrapper
                isReadOnly={false}
                searchTerm={searchTerm}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UserListPage;
