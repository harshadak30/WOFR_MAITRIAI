import React from 'react';

interface InfoCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
}

const InfoCard = ({
  icon: Icon,
  label,
  value,
}: InfoCardProps) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
      </div>
    </div>
  </div>
);

export default InfoCard;