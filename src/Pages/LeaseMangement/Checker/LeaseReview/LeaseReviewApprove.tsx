import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Check, X } from "lucide-react";
import MultiStepIndicatorReview from "../LeaseReview/MultistepIndicatorReview";
import LeaseBasicInfoReview from "./LeaseBasicInfoReview";
import { LessorDetailsReview } from "../LeaseReview/LessorDetailsReview";
import LeaseFinancialDetailsReview from "./LeaseFinancialDetailsReview";
import LeaseRentRevisionReview from "./LeaseRentRevisionReview";
import LeaseSummaryReview from "./LeaseSummaryReview";

interface LeaseFormData {
  leaseId: string;
  leaseClass: string;
  isShortTerm: boolean;
  isLowValue: boolean;
  startDate: string;
  endDate: string;
  terminationDate: string;
  duration: { years: number; months: number; days: number };
  hasCashflow: boolean;
  annualPayment: string;
  incrementalBorrowingRate: string;
  initialDirectCosts: string;
  paymentFrequency: string;
  paymentTiming: string;
  paymentDelay: string;
  depositNumber: string;
  depositAmount: string;
  depositRate: string;
  depositStartDate: string;
  depositEndDate: string;
  documents: any[];
  notes: string;
  clientContact: string;
  clientName: string;
  propertyAddress: string;
  propertyName: string;
  propertyId: string;
  leaseType: string;
  cashflowAmount: string;
  cashflowType: string;
  cashflowEntries: Array<{
    id: string;
    leaseId: string;
    date: string;
    amount: string;
  }>;
  securityDeposits: Array<{
    id: string;
    depositNumber: string;
    amount: string;
    rate: string;
    startDate: string;
    endDate: string;
    remark: string;
  }>;
  rentRevisions: Array<{
    id: string;
    revisionDate: string;
    revisedPayment: string;
  }>;
  entityMaster: string[];
  leaserMaster: string[];
  department: any[];
  entityDepartmentPercentages?: any;
  lessorPercentages?: any;
  hasMultiEntityAllocation: boolean;
  overallEntityPercentages?: any;
  shortTermValue: string;
  hasLessorAllocation: boolean;
}

const LeaseReviewApprove = () => {
  // const { leaseId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionCategory, setRejectionCategory] = useState("");
  const location = useLocation();
  const { leaseId, leaseNumber,updateLeaseStatus  } = location.state || {};
  
  const [formData, setFormData] = useState<LeaseFormData>({
    leaseId: "",
    leaseClass: "",
    isShortTerm: false,
    isLowValue: false,
    startDate: "",
    endDate: "",
    terminationDate: "",
    duration: { years: 0, months: 0, days: 0 },
    hasCashflow: false,
    annualPayment: "",
    incrementalBorrowingRate: "",
    initialDirectCosts: "",
    paymentFrequency: "",
    paymentTiming: "",
    paymentDelay: "",
    depositNumber: "",
    depositAmount: "",
    depositRate: "",
    depositStartDate: "",
    depositEndDate: "",
    documents: [],
    notes: "",
    clientContact: "",
    clientName: "",
    propertyAddress: "",
    propertyName: "",
    propertyId: "",
    leaseType: "",
    cashflowAmount: "",
    cashflowType: "",
    cashflowEntries: [],
    securityDeposits: [],
    rentRevisions: [],
    entityMaster: [],
    leaserMaster: [],
    department: [],
    hasMultiEntityAllocation: false,
    shortTermValue: "",
    hasLessorAllocation: false
  });

  // Create filtered steps and step mapping similar to CreateLease
  const { filteredSteps, displayCurrentStep } = React.useMemo(() => {
    const allSteps = [
      {
        id: 1,
        name: "Lease Terms",
        status: currentStep === 1 ? "current" : currentStep > 1 ? "complete" : "upcoming",
      },
      {
        id: 2,
        name: "Lessor & Lessee Details",
        status: currentStep === 2 ? "current" : currentStep > 2 ? "complete" : "upcoming",
        skip: formData.hasCashflow,
      },
      {
        id: 3,
        name: "Lease Payment Details",
        status: currentStep === 3 ? "current" : currentStep > 3 ? "complete" : "upcoming",
        skip: formData.hasCashflow,
      },
      {
        id: 4,
        name: "Security Deposit",
        status: currentStep === 4 ? "current" : currentStep > 4 ? "complete" : "upcoming",
        skip: formData.hasCashflow,
      },
      {
        id: 5,
        name: "Lease Summary",
        status: currentStep === 5 ? "current" : "upcoming",
      }
    ];

    // Filter out skipped steps
    const filtered = allSteps.filter(step => !step.skip);

    // Map the current step to display step for indicator
    let displayStep = currentStep;
    if (formData.hasCashflow && currentStep >= 2) {
      // Adjust steps when hasCashflow is true
      displayStep = currentStep - 3; // This might need adjustment based on your exact logic
    }

    const updatedFilteredSteps = filtered.map((step, index) => ({
      ...step,
      id: index + 1,
      status:
        index + 1 === displayStep
          ? ("current" as const)
          : index + 1 < displayStep
            ? ("complete" as const)
            : ("upcoming" as const),
    }));

    return {
      filteredSteps: updatedFilteredSteps,
      displayCurrentStep: displayStep
    };
  }, [currentStep, formData.hasCashflow]);

  useEffect(() => {
    // Fetch lease data based on leaseId
    // For now using mock data
    const mockLeaseData: LeaseFormData = {
      leaseId: leaseId || "",
      leaseClass: "Class A",
      isShortTerm: false,
      isLowValue: false,
      startDate: "2024-01-01",
      endDate: "2026-12-31",
      terminationDate: "",
      duration: { years: 3, months: 0, days: 0 },
      hasCashflow: false,
      annualPayment: "12000",
      incrementalBorrowingRate: "5",
      initialDirectCosts: "500",
      paymentFrequency: "Monthly",
      paymentTiming: "Advance",
      paymentDelay: "0",
      depositNumber: "DEP-001",
      depositAmount: "2000",
      depositRate: "5",
      depositStartDate: "2024-01-01",
      depositEndDate: "2026-12-31",
      documents: [],
      notes: "Sample lease agreement",
      clientContact: "John Doe",
      clientName: "ABC Corporation",
      propertyAddress: "123 Main St, City, Country",
      propertyName: "Commercial Building A",
      propertyId: "PROP-001",
      leaseType: "Commercial",
      cashflowAmount: "",
      cashflowType: "",
      cashflowEntries: [],
      securityDeposits: [{
        id: "1",
        depositNumber: "DEP-001",
        amount: "2000",
        rate: "5",
        startDate: "2024-01-01",
        endDate: "2026-12-31",
        remark: "Security deposit"
      }],
      rentRevisions: [{
        id: "1",
        revisionDate: "2025-01-01",
        revisedPayment: "13000"
      }],
      entityMaster: ["Entity A", "Entity B"],
      leaserMaster: ["Lessor X"],
      department: ["Finance", "Operations"],
      hasMultiEntityAllocation: false,
      shortTermValue: "",
      hasLessorAllocation: false
    };
    setFormData(mockLeaseData);
  }, [leaseId]);

  const updateFormData = (data: Partial<LeaseFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (formData.hasCashflow && currentStep === 1) {
      setCurrentStep(5);
    } else if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    if (formData.hasCashflow && currentStep === 5) {
      setCurrentStep(1);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    navigate(-1);
  };

   const handleApprove = () => {
    // Update the status and navigate back with the updated lease
    navigate("/dashboard/checker", {
      state: {
        updatedLease: {
          id: leaseId,
          status: "approved"
        }
      },
      replace: true // This replaces the current entry in history
    });
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (rejectionReason.trim()) {
      
      alert("Lease rejected successfully!");
      navigate("/dashboard/checker");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBackToList}
          className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer"
        >
          <ArrowLeft size={18} className="mr-2 cursor-pointer" />
          Back to List
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            LeaseId - {leaseId}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Review all lease details before approval or rejection
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleReject}
            className="flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200"
          >
            <X size={18} className="mr-2" />
            Reject
          </button>
          <button
            onClick={handleApprove}
            className="flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-md hover:bg-green-200"
          >
            <Check size={18} className="mr-2" />
            Approve
          </button>
        </div>
      </div>

      <MultiStepIndicatorReview steps={filteredSteps} currentStep={displayCurrentStep} />

      {currentStep === 1 && (
        <LeaseBasicInfoReview
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onSave={() => { }}
          isSaving={false}
        />
      )}

      {currentStep === 2 && !formData.hasCashflow && (
        <LessorDetailsReview
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSave={() => { }}
          isSaving={false}
        />
      )}

      {currentStep === 3 && !formData.hasCashflow && (
        <LeaseFinancialDetailsReview
          formData={formData}
          updateFormData={updateFormData}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isSaving={false}
        />
      )}

      {currentStep === 4 && !formData.hasCashflow && (
        <LeaseRentRevisionReview
          formData={formData}
          updateFormData={updateFormData}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isSaving={false}
        />
      )}

      {currentStep === 5 && (
        <LeaseSummaryReview
          formData={formData}
          onPrevious={handlePrevious}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Reject Lease</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Rejection
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2"
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={rejectionCategory}
                onChange={(e) => setRejectionCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="Incomplete Information">Incomplete Information</option>
                <option value="Incorrect Data">Incorrect Data</option>
                <option value="Policy Violation">Policy Violation</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaseReviewApprove;