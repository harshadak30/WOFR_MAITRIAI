import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "../ui/Card";

const data = [
  { year: "0 - 1 year", income: 20 },
  { year: "1 - 5 years", income: 25 },
  { year: "+5 years", income: 30 },
];

const LeaseMaturityChart = () => (
  <Card className="bg-white p-8 cursor-pointer">
    <CardContent className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Lease Maturity Distribution</h2>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="year" />
            <Tooltip />
            <Bar dataKey="income" fill="#93C5FD" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

export default LeaseMaturityChart;
