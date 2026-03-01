import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";




const COLORS = ["#489BAE", "#D0312D", ];

const PiChart = ({totalIncome,totalExpense}) => {
  const data = [
  { name: "Income", value: totalIncome },
  { name: "Expenses", value: totalExpense },
];

  const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white text-black px-3 py-2 rounded shadow-md text-sm">
        <span className="font-semibold">
          {payload[0].name} : ${payload[0].value}
        </span>
      </div>
    );
  }
  return null;
};

  return (
    <div className="w-full flex h-85   ">
      <ResponsiveContainer width="60%" height="105%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={150}
            dataKey="value"
            label
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />

        </PieChart>
      </ResponsiveContainer>
      <div>
        <div className='w-40 h-3 bg-[#489BAE] mb-2'></div>
        <div className='text-white font-bold text-lg mb-9'><span>Incomes</span></div>
        <div className='w-40 h-3 bg-[#D0312D] mb-2'></div>
        <div className='text-white font-bold text-lg mb-43'><span>Expenses</span></div>
        <div className='w-50 h-10 bg-green-500 rounded border-3xl flex justify-center items-center'>
            <span>Total Analysis</span>
        </div>
      </div>
    </div>
  );
}

export default PiChart