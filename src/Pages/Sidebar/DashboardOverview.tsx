
import { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Shield,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  UserCheck,
  Monitor,
  Zap,
} from "lucide-react";
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: string;
  trend: "up" | "down";
  trendIsGood?: boolean;
}

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}
const DashboardOverview = () => {
  const [userType] = useState("master_admin");

  // Sample data
  const systemMetrics = [
    { name: "Jan", users: 120, revenue: 45000, performance: 95 },
    { name: "Feb", users: 135, revenue: 52000, performance: 97 },
    { name: "Mar", users: 148, revenue: 48000, performance: 94 },
    { name: "Apr", users: 162, revenue: 58000, performance: 96 },
    { name: "May", users: 178, revenue: 61000, performance: 98 },
    { name: "Jun", users: 195, revenue: 67000, performance: 99 },
  ];

  const serverData = [
    { name: "Server 1", cpu: 45, memory: 68, storage: 72 },
    { name: "Server 2", cpu: 32, memory: 54, storage: 61 },
    { name: "Server 3", cpu: 67, memory: 78, storage: 84 },
    { name: "Server 4", cpu: 28, memory: 41, storage: 39 },
  ];

  const regionData = [
    { name: "North America", value: 45 },
    { name: "Europe", value: 30 },
    { name: "Asia Pacific", value: 20 },
    { name: "Others", value: 5 },
  ];

  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  const recentActivities = [
    {
      id: 1,
      action: "System Backup Completed",
      user: "System",
      time: "2 minutes ago",
      type: "success",
    },
    {
      id: 2,
      action: "High CPU Usage Alert",
      user: "Server Monitor",
      time: "15 minutes ago",
      type: "warning",
    },
    {
      id: 3,
      action: "New Admin User Created",
      user: "Super Admin",
      time: "1 hour ago",
      type: "info",
    },
    {
      id: 4,
      action: "Security Scan Completed",
      user: "Security System",
      time: "2 hours ago",
      type: "success",
    },
  ];

  const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, trend, trendIsGood = true }) => {
    const isTrendPositive = (trend === "up" && trendIsGood) || (trend === "down" && !trendIsGood);

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="mt-1 text-3xl font-bold text-gray-900">{value}</h3>
          </div>
          <div className="p-3 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {trend === "up" ? (
            <TrendingUp className={`h-4 w-4 ${isTrendPositive ? "text-green-500" : "text-red-500"}`} />
          ) : (
            <TrendingDown className={`h-4 w-4 ${isTrendPositive ? "text-green-500" : "text-red-500"}`} />
          )}
          <span className={`ml-1 text-sm font-medium ${isTrendPositive ? "text-green-700" : "text-red-700"}`}>
            {change}
          </span>
          <span className="ml-1.5 text-sm text-gray-500">vs last month</span>
        </div>
      </div>
    );
  };

  const Card: React.FC<CardProps> = ({ title, children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={18} className="text-green-500" />;
      case "warning":
        return <AlertTriangle size={18} className="text-yellow-500" />;
      case "info":
        return <UserCheck size={18} className="text-blue-500" />;
      default:
        return <Shield size={18} className="text-green-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <>
              <StatCard
                title="Total Users"
                value="1,248"
                icon={<Users size={24} />}
                change="12%"
                trend="up"
              />
              <StatCard
                title="Monthly Revenue"
                value="$67,000"
                icon={<DollarSign size={24} />}
                change="8%"
                trend="up"
              />
              <StatCard
                title="Active Sessions"
                value="342"
                icon={<Monitor size={24} />}
                change="5%"
                trend="up"
              />
              <StatCard
                title="Performance Score"
                value="96%"
                icon={<Zap size={24} />}
                change="2%"
                trend="up"
              />
            </>
    
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Chart */}
          <Card title={userType === "super_admin" ? "System Performance" : "User Growth & Revenue"} className="lg:col-span-2">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {userType === "super_admin" ? (
                  <AreaChart data={systemMetrics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="performance"
                      stroke="#3B82F6"
                      fillOpacity={1}
                      fill="url(#colorPerformance)"
                    />
                  </AreaChart>
                ) : (
                  <LineChart data={systemMetrics} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis yAxisId="left" stroke="#9ca3af" />
                    <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Side Chart */}
          <Card title={userType === "super_admin" ? "Traffic Distribution" : "Regional Users"}>
            <div className="h-80 bg-gray-100 rounded-xl"> {/* Add background, padding, and rounded corners */}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
                  <Pie
                    data={regionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, value, x, y }) => (
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ fontSize: "12px", fill: "#333" }} // 👈 set font size here
                      >
                        {`${name}: ${value}%`}
                      </text>
                    )}
                  >
                    {regionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

            </div>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Server/Resource Monitoring */}
          <Card title={userType === "super_admin" ? "Server Resources" : "System Overview"}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serverData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="cpu" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="memory" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="storage" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent Activities */}
          <Card title="Recent Activities">
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">by {activity.user}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
