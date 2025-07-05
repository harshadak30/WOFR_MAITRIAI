import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Eye } from "lucide-react";
import { Lease, LeaseStatus } from "../../../types";

// Mock data for pending leases
const mockPendingLeases: Lease[] = [
  {
    id: "1",
    leaseNumber: "LEASE-001",
    propertyType: "Office Space",
    client: "ABC Corp",
    price: 25000,
    startDate: "2024-01-01",
    endDate: "2025-01-01",
    status: "Pending" as LeaseStatus
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
    status: "Pending" as LeaseStatus
  }
];

const CheckerLeaseManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLeases, setFilteredLeases] = useState(mockPendingLeases);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = mockPendingLeases.filter(
      lease =>
        lease.leaseNumber.toLowerCase().includes(term.toLowerCase()) ||
        lease.client.toLowerCase().includes(term.toLowerCase()) ||
        lease.propertyType.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredLeases(filtered);
  };

  return (
    <div className="container mx-auto px-2 py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Lease Review Queue
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Review and approve/reject pending lease applications
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by lease number, client, or property type..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{filteredLeases.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Approved Today</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-red-600 rounded-full"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rejected Today</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leases Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lease Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeases.map((lease) => (
                <tr key={lease.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {lease.leaseNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lease.propertyType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lease.client}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${lease.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lease.startDate} to<br />
                    {lease.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      {lease.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/dashboard/checker-lease/review/${lease.id}`}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Eye size={16} />
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLeases.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No pending leases found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckerLeaseManagement;