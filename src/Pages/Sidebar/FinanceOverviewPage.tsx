import React from "react";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const FinanceOverviewPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
      <div className="mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Total Revenue"
            amount="$84,000"
            change="+12.5%"
            trend="up"
            icon={<DollarSign className="w-5 h-5 text-gray-600" />}
          />
          <SummaryCard
            title="Total Expenses"
            amount="$21,400"
            change="-8.2%"
            trend="down"
            icon={<CreditCard className="w-5 h-5 text-gray-600" />}
          />
          <SummaryCard
            title="Net Profit"
            amount="$62,600"
            change="+18.7%"
            trend="up"
            icon={<TrendingUp className="w-5 h-5 text-gray-600" />}
          />
          <SummaryCard
            title="Available Balance"
            amount="$15,200"
            change="+5.3%"
            trend="up"
            icon={<Wallet className="w-5 h-5 text-gray-600" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 lg:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  View all
                </button>
              </div>
            </div>
            <div className="p-4 lg:p-6">
              <div className="space-y-4">
                {[
                  { 
                    name: "Stripe Payment Processing", 
                    category: "Payment Gateway",
                    amount: "-$120.00", 
                    date: "Jun 1, 2025",
                    time: "2:30 PM"
                  },
                  { 
                    name: "Advertisement Revenue", 
                    category: "Revenue",
                    amount: "+$450.00", 
                    date: "May 31, 2025",
                    time: "11:45 AM"
                  },
                  { 
                    name: "Server Infrastructure", 
                    category: "Operations",
                    amount: "-$80.00", 
                    date: "May 30, 2025",
                    time: "9:15 AM"
                  },
                  { 
                    name: "Software License", 
                    category: "Tools",
                    amount: "-$299.00", 
                    date: "May 29, 2025",
                    time: "4:20 PM"
                  },
                  { 
                    name: "Client Payment", 
                    category: "Revenue",
                    amount: "+$2,500.00", 
                    date: "May 28, 2025",
                    time: "1:10 PM"
                  },
                ].map((transaction, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        transaction.amount.startsWith('+') ? 'bg-green-50' : 'bg-gray-50'
                      }`}>
                        {transaction.amount.startsWith('+') ? (
                          <ArrowUpRight className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{transaction.category}</span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">{transaction.date} at {transaction.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-semibold ${
                        transaction.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {transaction.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Budget Tracker */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 lg:p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Budget Allocation</h2>
              <p className="text-sm text-gray-600 mt-1">Monthly spending by category</p>
            </div>
            <div className="p-4 lg:p-6">
              <div className="space-y-6">
                <BudgetItem 
                  title="Marketing & Advertising" 
                  spent="$6,000"
                  budget="$10,000"
                  percentage={60} 
                />
                <BudgetItem 
                  title="Operations & Infrastructure" 
                  spent="$4,500"
                  budget="$10,000"
                  percentage={45} 
                />
                <BudgetItem 
                  title="Research & Development" 
                  spent="$8,000"
                  budget="$10,000"
                  percentage={80} 
                />
                <BudgetItem 
                  title="Human Resources" 
                  spent="$3,200"
                  budget="$8,000"
                  percentage={40} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceOverviewPage;

interface SummaryCardProps {
  title: string;
  amount: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, change, trend, icon }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition-all duration-200">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{title}</p>
        <p className="text-xl font-semibold text-gray-900 mb-2">{amount}</p>
        <div className="flex items-center gap-1">
          {trend === 'up' ? (
            <ArrowUpRight className="w-3 h-3 text-green-600" />
          ) : (
            <ArrowDownRight className="w-3 h-3 text-red-500" />
          )}
          <span className={`text-xs font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-500'
          }`}>
            {change}
          </span>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      </div>
      <div className="p-2 bg-gray-50 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

interface BudgetItemProps {
  title: string;
  spent: string;
  budget: string;
  percentage: number;
}

const BudgetItem: React.FC<BudgetItemProps> = ({ title, spent, budget, percentage }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{spent} of {budget}</p>
      </div>
      <span className="text-sm font-medium text-gray-700">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-300 ${
          percentage >= 80 ? 'bg-red-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-green-500'
        }`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  </div>
);