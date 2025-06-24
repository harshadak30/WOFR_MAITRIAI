import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lease, LeaseStatus } from "../../types";
import { mockLeases } from "../../data/mockData";
import Pagination from "../../component/common/ui/Table/Pagination";
import LeaseTable from "../../component/common/LeaseTable/LeaseTable";
import { Search } from "lucide-react";
import StatusTabs from "../../component/common/LeaseTable/StatusTabs";
import { useAuth } from "../../context/AuthContext";

const LeaseManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LeaseStatus>("All Lease");
  const [leases, setLeases] = useState<Lease[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const { authState } = useAuth();
  const role = authState?.user_type;
  useEffect(() => {
    // Simulate API call
    setLoading(true);

    setTimeout(() => {
      let filteredLeases = [...mockLeases];

      if (activeTab !== "All Lease") {
        filteredLeases = mockLeases.filter(
          (lease) => lease.status === activeTab
        );
      }

      setLeases(filteredLeases);
      setLoading(false);
      setCurrentPage(1); 
    }, 500);
  }, [activeTab]);

  const handleTabChange = (tab: LeaseStatus) => {
    setActiveTab(tab);
  };

  

  // Calculate pagination
  const totalItems = leases.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeases = leases.slice(indexOfFirstItem, indexOfLastItem);
  // Calculate status counts
  const statusCounts = mockLeases.reduce<Record<string, number>>((acc, lease) => {
    acc[lease.status] = (acc[lease.status] || 0) + 1;
    acc["All Lease"] = mockLeases.length;
    return acc;
  }, {});

  return (
    <div className=" bg-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 p-3 rounded-lg">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
            placeholder="Search lease..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {role === "super_admin" && (
        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/dashboard/create-lease")}
            className="px-4 py-2 bg-white border border-gray-600 rounded-md hover:bg-gray-50 transition flex items-center justify-center"
          >
            <span className="m-1">+</span> Create New Lease
          </button>
          <button
            onClick={() => navigate("/dashboard/bulk-upload")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
          >
            Lease Import
          </button>
        </div>
           )}
      </div>

      <StatusTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        counts={statusCounts}
      />

      <LeaseTable leases={currentLeases} loading={loading} />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(leases.length / itemsPerPage)}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default LeaseManagement;
