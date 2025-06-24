import React from "react";

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className = "",
}) => {
  return (
    <th
      className={`py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
};

export default TableHeader;
