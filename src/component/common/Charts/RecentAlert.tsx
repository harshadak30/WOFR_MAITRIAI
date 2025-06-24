import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { Card, CardContent } from "../ui/Card";

const alerts = [
  {
    id: "1",
    title: "Payment Due Alert",
    description: "Office Lease #123 payment due in 3 days",
    icon: <AlertTriangle size={18} className="text-red-500" />,
    bgColor: "bg-[#FEF2F2]",
    actionColor: "text-[#EF4444]",
  },
  {
    id: "2",
    title: "Lease Expiring",
    description: "Warehouse Lease #456 expires in 30 days",
    icon: <AlertCircle size={18} className="text-amber-500" />,
    bgColor: "bg-[#FFFBEB]",
    actionColor: "text-[#F59E0B]",
  },
  {
    id: "3",
    title: "Modification Required",
    description: "Retail Space #789 needs contract update",
    icon: <Info size={18} className="text-blue-500" />,
    bgColor: "bg-[#EFF6FF]",
    actionColor: "text-[#3B82F6]",
  },
];

const RecentAlerts = () => (
  <Card className="bg-white hover:shadow-md transition-shadow duration-200">
    <CardContent className="p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Recent Alerts
      </h2>
      <div className="space-y-4">
        {alerts.map(({ id, icon, title, description, bgColor, actionColor }) => (
          <div
            key={id}
            className={`${bgColor} p-4 rounded-md transition-transform duration-200 hover:scale-[1.01]`}
          >
            <div className="flex items-center gap-2 mb-1">
              {icon}
              <p className="font-bold text-gray-800">{title}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-700">{description}</p>
              <a href="#" className={`${actionColor} font-medium hover:underline`}>
                View
              </a>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default RecentAlerts;
