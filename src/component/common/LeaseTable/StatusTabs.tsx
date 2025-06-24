import React from "react";
import { LeaseStatus } from "../../../types";

interface StatusTabsProps {
  activeTab: LeaseStatus;
  onTabChange: (tab: LeaseStatus) => void;
  counts?: Record<LeaseStatus, number>;
}

const StatusTabs: React.FC<StatusTabsProps> = ({
  activeTab,
  onTabChange,
  counts = {},
}) => {
  const tabs: LeaseStatus[] = [
    "All Lease",
    "Draft",
    "Pending",
    "Active",
    "Rejected",
    "Expired",
  ];

  return (
    <div className="flex border-b gap-7 bg-white p-2 rounded-lg border-gray-200 mt-4 overflow-x-auto hide-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`whitespace-nowrap py-3 lg:px-10 px-5 rounded-md text-xs sm:text-sm font-medium transition-colors duration-200  ${
            activeTab === tab
              ? "bg-[#008F98] text-white hover:bg-[#008F98]"
              : "text-gray-600 bg-gray-100"
          }`}
        >
          {tab} {counts[tab] ? `(${counts[tab]})` : ""}
        </button>
      ))}
    </div>
  );
};

export default StatusTabs;
