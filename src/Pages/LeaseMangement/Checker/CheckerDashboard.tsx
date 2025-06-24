import React, { useState } from "react";
import { 
  FileText, 
  ArrowLeft, 
  Check, 
  X, 
  Calendar,
  DollarSign,
  Building,
  Users,
  Clock
} from "lucide-react";

// Sample lease data structure
const sampleLeases = [
  {
    id: "LEASE001",
    leaseNumber: "LN-2024-001",
    propertyType: "Office Space",
    client: "TechCorp Ltd",
    price: 50000,
    startDate: "2024-01-01",
    endDate: "2026-12-31",
    status: "pending_review",
    // Detailed lease information
    propertyId: "PROP-001",
    propertyName: "Tech Tower, Floor 5",
    duration: { years: 3, months: 0, days: 0 },
    entityMaster: ["Entity A", "Entity B"],
    leaserMaster: ["Lessor ABC Corp"],
    department: ["IT", "Operations"],
    annualPayment: 600000,
    paymentFrequency: "monthly",
    paymentTiming: "advance",
    incrementalBorrowingRate: 8.5,
    initialDirectCosts: 15000,
    paymentDelay: 0,
    isShortTerm: false,
    isLowValue: false,
    hasMultiEntityAllocation: true,
    entityDepartmentPercentages: {
      "Entity A": { "IT": 60, "Operations": 20 },
      "Entity B": { "IT": 15, "Operations": 5 }
    },
    lessorPercentages: {
      "Lessor ABC Corp": 100
    },
    rentRevisions: [
      {
        id: "REV001",
        revisionDate: "2025-01-01",
        revisedPayment: 55000
      }
    ],
    securityDeposits: [
      {
        id: "DEP001",
        depositNumber: "DEP-001",
        amount: 100000,
        rate: 5,
        startDate: "2024-01-01",
        endDate: "2026-12-31",
        remark: "Refundable security deposit"
      }
    ]
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
    propertyId: "PROP-002",
    propertyName: "Warehouse Complex B",
    duration: { years: 3, months: 0, days: 0 },
    entityMaster: ["Entity C"],
    leaserMaster: ["Warehouse Holdings"],
    department: ["Logistics"],
    annualPayment: 900000,
    paymentFrequency: "quarterly",
    paymentTiming: "advance",
    incrementalBorrowingRate: 7.5,
    initialDirectCosts: 25000,
    paymentDelay: 0,
    isShortTerm: false,
    isLowValue: false,
    hasMultiEntityAllocation: false,
    rentRevisions: [],
    securityDeposits: []
  }
];

const CheckerDashboard = () => {
  const [selectedLease, setSelectedLease] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionCategory, setRejectionCategory] = useState("");
  const [leases, setLeases] = useState(sampleLeases);

  const formatCurrency = (value: string | null | undefined) => {
    if (value === null || value === undefined || value === "") return "$0.00";
    return `$${Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const displayValue = (value: string | null | undefined, fallback = "Not specified") => {
    if (value === null || value === undefined || value === "") {
      return fallback;
    }
    return String(value);
  };

  const handleLeaseClick = (lease: React.SetStateAction<null> | {
      id: string; leaseNumber: string; propertyType: string; client: string; price: number; startDate: string; endDate: string; status: string;
      // Detailed lease information
      propertyId: string; propertyName: string; duration: { years: number; months: number; days: number; }; entityMaster: string[]; leaserMaster: string[]; department: string[]; annualPayment: number; paymentFrequency: string; paymentTiming: string; incrementalBorrowingRate: number; initialDirectCosts: number; paymentDelay: number; isShortTerm: boolean; isLowValue: boolean; hasMultiEntityAllocation: boolean; entityDepartmentPercentages: { "Entity A": { IT: number; Operations: number; }; "Entity B": { IT: number; Operations: number; }; }; lessorPercentages: { "Lessor ABC Corp": number; }; rentRevisions: { id: string; revisionDate: string; revisedPayment: number; }[]; securityDeposits: { id: string; depositNumber: string; amount: number; rate: number; startDate: string; endDate: string; remark: string; }[];
    } | { id: string; leaseNumber: string; propertyType: string; client: string; price: number; startDate: string; endDate: string; status: string; propertyId: string; propertyName: string; duration: { years: number; months: number; days: number; }; entityMaster: string[]; leaserMaster: string[]; department: string[]; annualPayment: number; paymentFrequency: string; paymentTiming: string; incrementalBorrowingRate: number; initialDirectCosts: number; paymentDelay: number; isShortTerm: boolean; isLowValue: boolean; hasMultiEntityAllocation: boolean; rentRevisions: never[]; securityDeposits: never[]; entityDepartmentPercentages?: undefined; lessorPercentages?: undefined; }) => {
    setSelectedLease(lease);
  };

  const handleBackToList = () => {
    setSelectedLease(null);
  };

  const handleApprove = () => {
    if (selectedLease) {
      setLeases(prev => prev.map(lease => 
        lease.id === selectedLease.id 
          ? { ...lease, status: 'approved' }
          : lease
      ));
      alert("Lease approved successfully!");
      setSelectedLease(null);
    }
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (selectedLease && rejectionReason.trim()) {
      setLeases(prev => prev.map(lease => 
        lease.id === selectedLease.id 
          ? { 
              ...lease, 
              status: 'rejected',
              rejectionReason: rejectionReason,
              rejectionCategory: rejectionCategory
            }
          : lease
      ));
      alert("Lease rejected successfully!");
      setShowRejectModal(false);
      setRejectionReason("");
      setRejectionCategory("");
      setSelectedLease(null);
    }
  };

  const getUniqueDepartments = (lease: { entityDepartmentPercentages: ArrayLike<unknown> | { [s: string]: unknown; }; }) => {
    if (!lease.entityDepartmentPercentages) return [];
    
    const deptSet = new Set();
    Object.values(lease.entityDepartmentPercentages).forEach(
      (entityDepts) => {
        Object.keys(entityDepts).forEach((dept) => deptSet.add(dept));
      }
    );
    
    return Array.from(deptSet);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
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

  // Lease Table Component
  const LeaseTable = () => {
    if (leases.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow p-8 my-4 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-800">No leases found</h3>
          <p className="text-gray-500 mt-2">
            Create a new lease or change your filter criteria.
          </p>
        </div>
      );
    }

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
                <tr 
                  key={lease.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleLeaseClick(lease)}
                >
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
                    <button className="text-blue-600 hover:text-blue-800">
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

  // Lease Review Component
  const LeaseReview = ({ lease }) => {
    const isMultiEntityMode = lease.hasMultiEntityAllocation;
    const selectedEntities = Array.isArray(lease.entityMaster) ? lease.entityMaster : [lease.entityMaster];
    const selectedLessors = Array.isArray(lease.leaserMaster) ? lease.leaserMaster : [lease.leaserMaster];

    return (
      <div className="bg-white rounded-lg shadow-sm mx-auto">
        {/* Header with Action Buttons */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToList}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to List
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Lease Review - {lease.leaseNumber}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Review all lease details before approval or rejection
                </p>
              </div>
            </div>
            
            {lease.status === 'pending_review' && (
              <div className="flex space-x-3">
                <button
                  onClick={handleReject}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <X size={18} className="mr-2" />
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check size={18} className="mr-2" />
                  Approve
                </button>
              </div>
            )}
            
            {lease.status !== 'pending_review' && (
              <div className="flex items-center space-x-2">
                {getStatusBadge(lease.status)}
              </div>
            )}
          </div>
        </div>

        {/* Review Content */}
        <div className="p-6 space-y-8">
          {/* Basic Lease Information */}
          <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <Building className="text-blue-600 mr-3" size={24} />
              <h3 className="text-xl font-semibold text-gray-900">
                Basic Lease Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property ID
                </p>
                <p className="mt-1 font-medium text-gray-900">
                  {displayValue(lease.propertyId)}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property Name
                </p>
                <p className="mt-1 font-medium text-gray-900">
                  {displayValue(lease.propertyName)}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lease Start Date
                </p>
                <p className="mt-1 font-medium text-gray-900 flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  {displayValue(lease.startDate)}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lease End Date
                </p>
                <p className="mt-1 font-medium text-gray-900 flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  {displayValue(lease.endDate)}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </p>
                <p className="mt-1 font-medium text-gray-900 flex items-center">
                  <Clock size={16} className="mr-2 text-gray-400" />
                  {lease.duration?.years || 0} years, {lease.duration?.months || 0} months, {lease.duration?.days || 0} days
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lease Type
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {lease.isShortTerm && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Short Term
                    </span>
                  )}
                  {lease.isLowValue && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Low Value
                    </span>
                  )}
                  {!lease.isShortTerm && !lease.isLowValue && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                      Standard
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Entity & Lessor Information */}
          <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <Users className="text-purple-600 mr-3" size={24} />
              <h3 className="text-xl font-semibold text-gray-900">
                Entity & Lessor Information
              </h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedEntities.length > 0 && (
                  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entity Master
                    </p>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {selectedEntities.map((entityId: boolean | React.Key | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined) => (
                          <span
                            key={entityId}
                            className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                          >
                            {entityId}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedLessors.length > 0 && (
                  <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lessor(s)
                    </p>
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {selectedLessors.map((lessor: boolean | React.Key | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined) => (
                          <span
                            key={lessor}
                            className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                          >
                            {lessor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Department Display */}
              {!isMultiEntityMode && lease.department && lease.department.length > 0 && (
                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department(s)
                  </p>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {lease.department.map((dept: boolean | React.Key | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined) => (
                        <span
                          key={dept}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Multi-Entity Department Allocation Matrix */}
          {isMultiEntityMode && lease.entityDepartmentPercentages && (
            <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <Users className="text-indigo-600 mr-3" size={24} />
                <h3 className="text-xl font-semibold text-gray-900">
                  Entity-Department Allocation Matrix
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Entity
                      </th>
                      {getUniqueDepartments(lease).map((dept) => (
                        <th
                          key={dept}
                          className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]"
                        >
                          {dept}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-200">
                        Total (%)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedEntities.map((entityId: boolean | React.Key | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, entityIndex: number) => {
                      const entityPercentages = lease.entityDepartmentPercentages?.[entityId] || {};
                      const entityTotal = Object.values(entityPercentages).reduce((sum, val) => sum + val, 0);

                      return (
                        <tr
                          key={entityId}
                          className={entityIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r bg-gray-100">
                            {entityId}
                          </td>
                          {getUniqueDepartments(lease).map((dept) => {
                            const percentage = entityPercentages[dept];
                            return (
                              <td key={dept} className="px-4 py-3 border-r text-center text-sm">
                                {percentage !== undefined && percentage !== null
                                  ? `${percentage.toFixed(2)}%`
                                  : "—"}
                              </td>
                            );
                          })}
                          <td className="px-4 py-3 text-center bg-gray-100 border-l">
                            <span
                              className={`text-sm font-semibold ${
                                Math.abs(entityTotal - 100) < 0.01
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {entityTotal.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Financial Details */}
          <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center mb-6">
              <DollarSign className="text-green-600 mr-3" size={24} />
              <h3 className="text-xl font-semibold text-gray-900">
                Financial Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annual Lease Payment
                </p>
                <p className="mt-1 text-xl font-bold text-green-600">
                  {formatCurrency(lease.annualPayment)}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Frequency
                </p>
                <p className="mt-1 font-medium text-gray-900 capitalize">
                  {displayValue(lease.paymentFrequency)}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Timing
                </p>
                <p className="mt-1 font-medium text-gray-900 capitalize">
                  {displayValue(lease.paymentTiming)}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Incremental Borrowing Rate
                </p>
                <p className="mt-1 font-medium text-gray-900">
                  {displayValue(lease.incrementalBorrowingRate, "0")}%
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Initial Direct Costs
                </p>
                <p className="mt-1 font-medium text-gray-900">
                  {formatCurrency(lease.initialDirectCosts)}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Delay
                </p>
                <p className="mt-1 font-medium text-gray-900">
                  {displayValue(lease.paymentDelay, "0")} days
                </p>
              </div>
            </div>
          </section>

          {/* Rent Revisions */}
          {lease.rentRevisions && lease.rentRevisions.length > 0 && (
            <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <Calendar className="text-orange-600 mr-3" size={24} />
                <h3 className="text-xl font-semibold text-gray-900">
                  Rent Revisions
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Revision Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Revised Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lease.rentRevisions.map((revision: { id: React.Key | null | undefined; revisionDate: any; revisedPayment: any; }, index: number) => (
                      <tr
                        key={revision.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {displayValue(revision.revisionDate, "—")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {revision.revisedPayment ? formatCurrency(revision.revisedPayment) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
{/* Security Deposits */}
{lease.securityDeposits && lease.securityDeposits.length > 0 && (
            <section className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-6">
                <DollarSign className="text-blue-600 mr-3" size={24} />
                <h3 className="text-xl font-semibold text-gray-900">
                  Security Deposits
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Deposit Number
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Rate (%)
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        End Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Remark
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lease.securityDeposits.map((deposit: { id: React.Key | null | undefined; depositNumber: any; amount: any; rate: any; startDate: any; endDate: any; remark: any; }, index: number) => (
                      <tr
                        key={deposit.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {displayValue(deposit.depositNumber, "—")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {deposit.amount ? formatCurrency(deposit.amount) : "—"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {displayValue(deposit.rate, "—")}%
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {displayValue(deposit.startDate, "—")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {displayValue(deposit.endDate, "—")}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {displayValue(deposit.remark, "—")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>
    );
  };

  // Rejection Modal Component
  const RejectionModal = () => {
    if (!showRejectModal) return null;

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Reject Lease
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Category
              </label>
              <select
                value={rejectionCategory}
                onChange={(e) => setRejectionCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select a category</option>
                <option value="documentation">Documentation Issues</option>
                <option value="financial">Financial Concerns</option>
                <option value="compliance">Compliance Issues</option>
                <option value="terms">Unfavorable Terms</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a detailed reason for rejection..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows={4}
                required
              />
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setShowRejectModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmReject}
              disabled={!rejectionReason.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <div className=" bg-gray-100">
      <div className="container mx-auto px-2 py-4">
        {selectedLease ? (
          <LeaseReview lease={selectedLease} />
        ) : (
          <LeaseTable />
        )}
        <RejectionModal />
      </div>
    </div>
  );
};

export default CheckerDashboard;
