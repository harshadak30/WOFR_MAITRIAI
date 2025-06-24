import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "../ui/Card";

const data = [
  { month: 'Jan', value: 12000 },
  { month: 'Feb', value: 14000 },
  { month: 'Mar', value: 10000 },
  { month: 'Apr', value: 16000 },
  { month: 'May', value: 12000 },
  { month: 'Jun', value: 18000 },
];

const MonthlyExpenseChart = () => (
  <Card className="bg-[#fcfcfc] hover:shadow-md transition-shadow duration-200">
    <CardContent className="p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">
        Monthly Expense Analysis
      </h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, left: 10 }}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
              content={({ active, payload }) =>
                active && payload?.length ? (
                  <div className="bg-white p-2 border rounded shadow-sm">
                    <p className="font-medium">
                      {`${payload[0].payload.month}: $${payload[0].payload.value.toLocaleString()}`}
                    </p>
                  </div>
                ) : null
              }
            />
            <Bar
              dataKey="value"
              fill="#D1FAE5"
              radius={[4, 4, 0, 0]}
              barSize={80}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export default MonthlyExpenseChart;
