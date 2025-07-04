import React, { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { LeaseFormData } from "../../../types";

import toast from "react-hot-toast";
import MultiStepIndicator from "../createLease/LeaseForms/MultistepIndicator";
import LeaseBasicInfo from "../createLease/LeaseForms/LeaseBasicInfo";
import { LessorDetails } from "../createLease/LeaseForms/LessorDetails";
import LeaseFinancialDetails from "../createLease/LeaseForms/LeaseFinancialDetails";
import LeaseRentRevision from "../createLease/LeaseForms/LeaseRentRevision";
import LeaseSummary from "../createLease/LeaseForms/LeaseSummary";

// Mock lease data for checker review
const mockLeaseData: LeaseFormData = {
  leaseId: "LEASE-001",
  leaseClass: "VEHICLE",
  isShortTerm: false,
  isLowValue: true,
  startDate: "2024-01-01",
  endDate: "2025-01-01",
  terminationDate: "2025-01-01",
  duration: {
    years: 1,
    months: 0,
    days: 0,
  },
  hasCashflow: false,
  annualPayment: "24000",
  incrementalBorrowingRate: "5.5",
  initialDirectCosts: "5000",
  paymentFrequency: "monthly",
  paymentTiming: "beginning",
  paymentDelay: "0",
  depositNumber: "DEP-001",
  depositAmount: "2000",
  depositRate: "3.5",
  depositStartDate: "2024-01-01",
  depositEndDate: "2025-01-01",
  documents: [],
  notes: "Sample lease agreement",
  clientContact: "John Doe",
  clientName: "ABC Company",
  propertyAddress: "123 Main St",
  propertyName: "Sample Lease",
  propertyId: "VEHICLE",
  leaseType: "Standard",
  cashflowAmount: "",
  cashflowType: "",
  cashflowEntries: [],
  securityDeposits: [
    {
      id: "1",
      depositNumber: "DEP-001",
      amount: "2000",
      rate: "3.5",
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      remark: "Security deposit for vehicle lease",
    }
  ],
  rentRevisions: [
    {
      id: "1",
      revisionDate: "2024-07-01",
      revisedPayment: "2100",
    }
  ],
  entityMaster: ["entity1"],
  leaserMaster: ["leaser1"],
  department: ["hr"],
  entityDepartmentPercentages: {},
  lessorPercentages: {},
  hasMultiEntityAllocation: false,
  overallEntityPercentages: {},
  shortTermValue: "",
  hasLessorAllocation: false
};

const CheckerLeaseReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData] = useState<LeaseFormData>(mockLeaseData);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { filteredSteps, displayCurrentStep } = useMemo(() => {
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

    const filtered = allSteps.filter(step => !step.skip);
    
    let displayStep = currentStep;
    if (formData.hasCashflow && currentStep === 5) {
      displayStep = 2;
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

  const handleApprove = () => {
    setActionType('approve');
    setShowActionModal(true);
  };

  const handleReject = () => {
    setActionType('reject');
    setShowActionModal(true);
  };

  const handleSubmitAction = async () => {
    if (actionType === 'reject' && !rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (actionType === 'approve') {
        toast.success("Lease approved successfully!");
      } else {
        toast.success("Lease rejected successfully!");
      }
      
      navigate("/dashboard/checker-lease");
    } catch (error) {
      toast.error("Failed to submit action. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowActionModal(false);
    }
  };

  const closeModal = () => {
    setShowActionModal(false);
    setActionType(null);
    setRejectionReason("");
  };

  // Read-only props for all components
  const readOnlyProps = {
    readOnly: true,
    disabled: true
  };

  return (
    <div className="container mx-auto px-2 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Review Lease {id}
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Review and approve/reject lease application
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/dashboard/checker-lease"
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm sm:text-base whitespace-nowrap"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Queue
          </Link>
        </div>
      </div>
      
      <MultiStepIndicator steps={filteredSteps} currentStep={displayCurrentStep} />

      {/* Action Buttons - Always visible */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Checker Actions</h3>
        <div className="flex gap-4">
          <button
            onClick={handleApprove}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <CheckCircle size={16} />
            Approve Lease
          </button>
          <button
            onClick={handleReject}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <XCircle size={16} />
            Reject Lease
          </button>
        </div>
      </div>

      {/* Form Steps */}
      {currentStep === 1 && (
        <LeaseBasicInfo
          formData={formData}
          updateFormData={() => {}} // No-op for checker
          onNext={handleNext}
          onSave={() => {}} // No-op for checker
          isSaving={false}
          {...readOnlyProps}
        />
      )}

      {currentStep === 2 && !formData.hasCashflow && (
        <LessorDetails
          formData={formData}
          updateFormData={() => {}} // No-op for checker
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSave={() => {}} // No-op for checker
          isSaving={false}
          {...readOnlyProps}
        />
      )}

      {currentStep === 3 && !formData.hasCashflow && (
        <LeaseFinancialDetails
          formData={formData}
          updateFormData={() => {}} // No-op for checker
          onPrevious={handlePrevious}
          onNext={handleNext}
          isSaving={false}
          {...readOnlyProps}
        />
      )}

      {currentStep === 4 && !formData.hasCashflow && (
        <LeaseRentRevision
          formData={formData}
          updateFormData={() => {}} // No-op for checker
          onPrevious={handlePrevious}
          onNext={handleNext}
          isSaving={false}
          {...readOnlyProps}
        />
      )}

      {currentStep === 5 && (
        <LeaseSummary
          formData={formData}
          onPrevious={handlePrevious}
          onNext={() => {}} // No next for checker
          isSaving={false}
          {...readOnlyProps}
        />
      )}

      {/* Action Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {actionType === 'approve' ? 'Approve Lease' : 'Reject Lease'}
            </h3>
            
            {actionType === 'approve' ? (
              <p className="text-gray-600 mb-6">
                Are you sure you want to approve this lease application?
              </p>
            ) : (
              <div className="mb-6">
                <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Please provide detailed reason for rejection..."
                  required
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={isSubmitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAction}
                disabled={isSubmitting || (actionType === 'reject' && !rejectionReason.trim())}
                className={`px-4 py-2 rounded-md text-white transition-colors ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } ${
                  isSubmitting || (actionType === 'reject' && !rejectionReason.trim())
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {isSubmitting ? 'Processing...' : (actionType === 'approve' ? 'Approve' : 'Reject')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckerLeaseReview;