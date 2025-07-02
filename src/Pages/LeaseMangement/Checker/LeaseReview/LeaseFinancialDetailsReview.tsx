import React from "react";
import { LeaseFormData, RentRevision } from "../../../../types";
import { LeaseFormLabels } from "../../createLease/LeaseForms/LeaseFormLabel";

interface LeaseFinancialDetailsReviewProps {
  formData: LeaseFormData;
  onPrevious: () => void;
  onNext: () => void;
}

const LeaseFinancialDetailsReview: React.FC<LeaseFinancialDetailsReviewProps> = ({
  formData,
  onPrevious,
  onNext,
}) => {
  const rentRevisions = formData.rentRevisions || [
    {
      id: "1",
      revisionDate: "",
      revisedPayment: "",
    },
  ];

  const showExcelFormat = (formData.rentRevisions && formData.rentRevisions.length > 1) || false;

  const formatCurrency = (value: string | number | undefined) => {
    if (!value) return "$0.00";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  const formatPercentage = (value: string | number | undefined) => {
    if (!value) return "0%";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return `${num}%`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Lease Payment Details</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {LeaseFormLabels.paymentDetails.monthlyPayment}
          </label>
          <div className="p-2 bg-gray-50 rounded-md">
            {formatCurrency(formData.annualPayment)}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {LeaseFormLabels.paymentDetails.borrowingRate}
          </label>
          <div className="p-2 bg-gray-50 rounded-md">
            {formatPercentage(formData.incrementalBorrowingRate)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {LeaseFormLabels.paymentDetails.paymentFrequency}
          </label>
          <div className="p-2 bg-gray-50 rounded-md capitalize">
            {formData.paymentFrequency || "Not specified"}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {LeaseFormLabels.paymentDetails.paymentTiming}
          </label>
          <div className="p-2 bg-gray-50 rounded-md">
            {formData.paymentTiming 
              ? formData.paymentTiming === "beginning" 
                ? "Beginning of period" 
                : "End of period"
              : "Not specified"}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {LeaseFormLabels.paymentDetails.fitoutPeriod}
          </label>
          <div className="p-2 bg-gray-50 rounded-md">
            {formData.paymentDelay 
              ? `${formData.paymentDelay} ${formData.paymentDelay === "1" ? "month" : "months"}` 
              : "Not specified"}
          </div>
        </div>
      </div>

      <div className="bg-white mt-10">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            Future Rent Revisions
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {rentRevisions.length > 1 || (rentRevisions[0]?.revisionDate && rentRevisions[0]?.revisedPayment)
              ? "Planned rent increases"
              : "No rent increases specified"}
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {LeaseFormLabels.paymentDetails.initialDirectCosts}
          </label>
          <div className="p-2 bg-gray-50 rounded-md max-w-md">
            {formatCurrency(formData.initialDirectCosts)}
          </div>
        </div>

        {!showExcelFormat ? (
          // Single entry format
          rentRevisions.slice(0, 1).map((revision) => (
            (revision.revisionDate || revision.revisedPayment) && (
              <div key={revision.id} className="border border-gray-200 rounded-md p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {LeaseFormLabels.paymentDetails.futureRentRevisions.revisionDate}
                    </label>
                    <div className="p-2 bg-gray-50 rounded-md">
                      {revision.revisionDate ? formatDate(revision.revisionDate) : "Not specified"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {LeaseFormLabels.paymentDetails.futureRentRevisions.revisedPayment}
                    </label>
                    <div className="p-2 bg-gray-50 rounded-md">
                      {revision.revisedPayment ? formatCurrency(revision.revisedPayment) : "Not specified"}
                    </div>
                  </div>
                </div>
              </div>
            )
          ))
        ) : (
          // Excel-like table format
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    #
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Future Rent Revision Date
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Revised Monthly Lease Payment
                  </th>
                </tr>
              </thead>
              <tbody>
                {rentRevisions.map((revision, index) => (
                  <tr key={revision.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {revision.revisionDate ? formatDate(revision.revisionDate) : "Not specified"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm">
                      {revision.revisedPayment ? formatCurrency(revision.revisedPayment) : "Not specified"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007A82] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default LeaseFinancialDetailsReview;