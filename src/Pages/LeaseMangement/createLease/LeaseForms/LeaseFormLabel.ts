export const LeaseFormLabels = {
  //Lease Terms Section
  leaseTerms: {
    title: "Lease Terms",
    class: "Class",
    leaseName: "Lease Name",
    isShortTerm: "Short Term Lease",
    isLowValue: "Low Value Lease",
    isInputLowValue: "Low Value",
    hasMultiEntityAllocation: "Entity Lease Split",
    hasLessorAllocation: "Multipler Lessor",
    startDate: "Lease Start Date",
    endDate: "Lease End Date",
    leaseDuration: {
      title: "Lease Duration",
      years: "Years",
      months: "Months",
      days: "Days",
    },
    customCashflow: {
      checkbox: "Custom Cashflow",
      leaseId: "Lease ID (Auto-filled)",
      date: "Date",
      amount: "Amount",
    },
  },

  // Lessor Details Sections
  lessorDetails: {
    // entitySelection: {
    //   label: "Entity Selection",
    //   inputLabel: (isMultiEntityMode: boolean) =>
    //     isMultiEntityMode ? 'Select Entities' : 'Select Entity',
    // },
    departmentSelection: {
      label: "Department Selection",
      inputLabel: "Select Department",
    },
    allocationMatrix: {
      label: "Entity-Department Allocation Matrix",
      overallAllocation: "Overall Allocation",
      entity: "Entity",
      entityTotal: "Entity Total",
      overallGrandTotal: "Overall Grand Total",
    },
    lessorSelection: {
      label: "Lessor Selection",
      // inputLabel: (isLessorSplitMode: boolean) =>
      //   isLessorSplitMode ? 'Select Lessor(s)' : 'Select Lessor',
    },
    lessorAllocation: {
      label: "Lessor Allocation",
      lessorColumn: "Lessor",
      percentageColumn: "Percentage",
      totalLabel: "Total",
    },
  },

  //Lease Financials Section

  paymentDetails: {
    monthlyPayment: "Monthly Lease Payment",
    borrowingRate: "Incremental Borrowing Rate(% p.a)",
    paymentFrequency: "Payment Frequency",
    paymentTiming: "Payment Timing",
    fitoutPeriod: "Fitout period",
    initialDirectCosts: "Initial direct costs",
    futureRentRevisions: {
      title: "Future Rent Revisions",
      revisionDate: "Future Rent Revision Date 1",
      revisedPayment: "Revised monthly Lease Payment 1",
    },
  },

  //Lease Rent Section

  securityDeposits: {
    depositName: "Deposit Name",
    amount: "Amount",
    discountRate: "Discount Rate",
    startDate: "Start Date",
    endDate: "End Date",
    remark: "Remark",
  },

  // Add more sections as needed
};
