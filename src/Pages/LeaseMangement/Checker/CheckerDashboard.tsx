import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

interface LeaseData {
  id: string;
  leaseNumber: string;
  propertyType: string;
  client: string;
  price: number;
  startDate: string;
  endDate: string;
  status: string;
}

const CheckerDashboard = () => {
  const navigate = useNavigate();
  const [leases, setLeases] = useState<LeaseData[]>([
    {
      id: "LEASE001",
      leaseNumber: "LN-2024-001",
      propertyType: "Office Space",
      client: "TechCorp Ltd",
      price: 50000,
      startDate: "2024-01-01",
      endDate: "2026-12-31",
      status: "pending_review",
    },
    {
      id: "LEASE002",
      leaseNumber: "LN-2024-002",
      propertyType: "Warehouse",
      client: "LogiCorp Inc",
      price: 75000,
      startDate: "2024-02-01",
      endDate: "2027-01-31",
      status: "pending_review",
    }
  ]);

  const updateLeaseStatus = (leaseId: string, newStatus: string) => {
    setLeases(prevLeases => 
      prevLeases.map(lease => 
        lease.id === leaseId ? { ...lease, status: newStatus } : lease
      )
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; text: string } } = {
      pending_review: { color: "bg-yellow-100 text-yellow-800", text: "Pending Review" },
      approved: { color: "bg-green-100 text-green-800", text: "Approved" },
      rejected: { color: "bg-red-100 text-red-800", text: "Rejected" }
    };

    const config = statusConfig[status] || statusConfig.pending_review;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const handleReviewClick = (leaseId: string, leaseNumber: string) => {
    navigate(`/dashboard/lease-review`, {
      state: { 
        leaseId, 
        leaseNumber,
        currentStatus: leases.find(lease => lease.id === leaseId)?.status || "pending_review"
      },
    });
  };

  React.useEffect(() => {
    const handleBackNavigation = () => {
      const state = history.state;
      if (state?.updatedLease) {
        updateLeaseStatus(state.updatedLease.id, state.updatedLease.status);
      }
    };

    window.addEventListener('popstate', handleBackNavigation);
    return () => window.removeEventListener('popstate', handleBackNavigation);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden my-1">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Lease Management</h2>
        <p className="text-sm text-gray-600 mt-1">Click on any lease to review details</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ITEM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PROPERTY TYPE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CLIENT / ENTITY
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PRICE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PERIOD
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leases.map((lease, index) => (
              <tr key={lease.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
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
                  {lease.startDate} to
                  <br />
                  {lease.endDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(lease.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleReviewClick(lease.id, lease.leaseNumber)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheckerDashboard;