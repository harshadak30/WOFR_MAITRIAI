// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Lease, LeaseStatus } from "../../types";
// import { mockLeases } from "../../data/mockData";
// import Pagination from "../../component/common/ui/Table/Pagination";
// import LeaseTable from "../../component/common/LeaseTable/LeaseTable";
// import { Search } from "lucide-react";
// import StatusTabs from "../../component/common/LeaseTable/StatusTabs";
// import { useAuth } from "../../context/AuthContext";

// const LeaseManagement: React.FC = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState<LeaseStatus>("All Lease");
//   const [leases, setLeases] = useState<Lease[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState<boolean>(true);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const itemsPerPage = 10;
//   const { authState } = useAuth();
//   const role = authState?.user_type;
//   useEffect(() => {
//     // Simulate API call
//     setLoading(true);

//     setTimeout(() => {
//       let filteredLeases = [...mockLeases];

//       if (activeTab !== "All Lease") {
//         filteredLeases = mockLeases.filter(
//           (lease) => lease.status === activeTab
//         );
//       }

//       setLeases(filteredLeases);
//       setLoading(false);
//       setCurrentPage(1); 
//     }, 500);
//   }, [activeTab]);

//   const handleTabChange = (tab: LeaseStatus) => {
//     setActiveTab(tab);
//   };

  

//   // Calculate pagination
//   const totalItems = leases.length;
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentLeases = leases.slice(indexOfFirstItem, indexOfLastItem);
//   // Calculate status counts
//   const statusCounts = mockLeases.reduce((acc, lease) => {

//     acc[lease.status as string] = (acc[lease.status as string] || 0) + 1;

//     acc["All Lease"] = mockLeases.length;

//     return acc;

//   }, {} as Record<string, number>);

//   return (
//     <div className=" bg-white">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 p-3 rounded-lg">
//         <div className="relative w-full md:w-80">
//           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//             <Search size={18} className="text-gray-400" />
//           </div>
//           <input
//             type="text"
//             className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent sm:text-sm"
//             placeholder="Search lease..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         {role === "super_admin" && (
//         <div className="flex space-x-3">
//           <button
//             onClick={() => navigate("/dashboard/create-lease")}
//             className="px-4 py-2 bg-white border border-gray-600 rounded-md hover:bg-gray-50 transition flex items-center justify-center"
//           >
//             <span className="m-1">+</span> Create New Lease
//           </button>
//           <button
//             onClick={() => navigate("/dashboard/bulk-upload")}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
//           >
//             Lease Import
//           </button>
//         </div>
//            )}
//       </div>

//       <StatusTabs
//         activeTab={activeTab}
//         onTabChange={handleTabChange}
//         counts={statusCounts}
//       />

//       <LeaseTable leases={currentLeases} loading={loading} />

//       <Pagination
//         currentPage={currentPage}
//         totalPages={Math.ceil(leases.length / itemsPerPage)}
//         totalItems={totalItems}
//         itemsPerPage={itemsPerPage}
//         onPageChange={setCurrentPage}
//       />
//     </div>
//   );
// };

// export default LeaseManagement;

import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

import { Lease, LeaseStatus } from "../../types";
import LeaseTable from "../../component/common/LeaseTable/LeaseTable";
import StatusTabs from "../../component/common/LeaseTable/StatusTabs";

const LeaseManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LeaseStatus>("All Lease");
  const [leases, setLeases] = useState<Lease[]>([]);
  const [filteredLeases, setFilteredLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in real app, this would come from API
  const mockLeases: Lease[] = [
    {
      id: "1",
      leaseNumber: "LEASE-001",
      propertyType: "Office Space",
      client: "ABC Corp",
      price: 25000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      status: "Active" as LeaseStatus
    },
    {
      id: "2",
      leaseNumber: "LEASE-002",
      propertyType: "Vehicle",
      client: "XYZ Ltd",
      price: 35000,
      startDate: "2024-02-01",
      endDate: "2025-02-01",
      status: "Pending" as LeaseStatus
    },
    {
      id: "3",
      leaseNumber: "LEASE-003",
      propertyType: "Equipment",
      client: "Tech Solutions",
      price: 15000,
      startDate: "2024-03-01",
      endDate: "2025-03-01",
      status: "Draft" as LeaseStatus
    },
    {
      id: "4",
      leaseNumber: "LEASE-004",
      propertyType: "Warehouse",
      client: "Storage Inc",
      price: 50000,
      startDate: "2024-04-01",
      endDate: "2025-04-01",
      status: "Rejected" as LeaseStatus
    },
    {
      id: "5",
      leaseNumber: "LEASE-005",
      propertyType: "Retail Space",
      client: "Fashion Store",
      price: 30000,
      startDate: "2023-01-01",
      endDate: "2024-01-01",
      status: "Expired" as LeaseStatus
    }
  ];

  useEffect(() => {
    loadLeases();
  }, []);

  useEffect(() => {
    filterLeases();
  }, [activeTab, leases, searchTerm]);

  const loadLeases = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLeases(mockLeases);
    } catch (error) {
      console.error("Failed to load leases:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterLeases = () => {
    let filtered = leases;

    // Filter by status
    if (activeTab !== "All Lease") {
      filtered = filtered.filter(lease => lease.status === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(lease =>
        lease.leaseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.propertyType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLeases(filtered);
  };

  const getStatusCounts = (): Record<LeaseStatus, number> => {
    const counts: Record<LeaseStatus, number> = {
      "All Lease": leases.length,
      "Draft": 0,
      "Pending": 0,
      "Active": 0,
      "Rejected": 0,
      "Expired": 0
    };

    leases.forEach(lease => {
      if (lease.status in counts) {
        counts[lease.status]++;
      }
    });

    return counts;
  };

  const handleRefresh = () => {
    loadLeases();
  };

  return (
    <div className="container mx-auto px-2 py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Lease Management
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Manage all your lease agreements
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link to="/dashboard/bulk-upload"
           className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007a82] transition-colors flex items-center gap-2 justify-center">
   Lease Import
           </Link>
          
          <Link
            to="/dashboard/create-lease"
            className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007a82] transition-colors flex items-center gap-2 justify-center"
          >
            <Plus size={16} />
            Create Lease
          </Link>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search leases..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <StatusTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={getStatusCounts()}
      />

      {/* Lease Table */}
      <LeaseTable leases={filteredLeases} loading={loading} />
    </div>
  );
};

export default LeaseManagement;
