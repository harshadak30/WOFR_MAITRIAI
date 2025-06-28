import { useContext, useState } from "react";
import {  DownloadIcon, Search, UserPlusIcon } from "lucide-react";
import ExternalOrganizations from "./ExternalOrganizations";
import { AuthContext } from "../../../context/AuthContext";
import UserRolesPage from "./UserRolesPage";
import AddUserModal from "../../SuperAdminPages/User/NewUser/AddUserModal";
import AddUserExcel from "../../SuperAdminPages/User/NewUser/AddUserExcel";
import UserManagementWrapper from "../../SuperAdminPages/User/NewUser/UserManagementWrapper";
function UserListPage() {
  const [showModuleView, setShowModuleView] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddUserExcelModal, setshowAddUserExcelModal] = useState(false);
  const { authState } = useContext(AuthContext);
  const userType = authState.user_type;
 
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
    <div className="bg-gray-50">
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
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition whitespace-nowrap text-white bg-[#008F98] hover:bg-[#007a82]"
                    >
                      <UserPlusIcon size={16} /> Add Users
                    </button>

                    <button
                      onClick={() => setshowAddUserExcelModal(true)}
                      className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition whitespace-nowrap text-white bg-[#008F98] hover:bg-[#007a82]"
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

      {/* Modals */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onSave={handleSaveUser}
          modules={[]}
        />
      )}

      {showAddUserExcelModal && (
        <AddUserExcel
          onClose={() => setshowAddUserExcelModal(false)}
          onSave={handleSaveUser}
          modules={[]}
        />
      )}

      {/* Content */}
      <div className="flex-1 relative z-0 mx-auto mt-1 w-full">
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
      </div>
    </div>
  );
}

export default UserListPage;
