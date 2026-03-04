import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";




<<<<<<< Updated upstream
const COLORS = ["#489BAE", "#D0312D", ];
=======
const COLORS = ["#8080FF", "#0353a4", ];
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    <div className="w-full flex h-85   ">
      <ResponsiveContainer width="60%" height="105%">
=======
    <div className="w-full flex flex-col lg:flex-row h-auto sm:h-auto md:h-auto lg:h-auto xl:h-85 gap-2 sm:gap-3 md:gap-4 lg:gap-2 xl:gap-0">
      <ResponsiveContainer width="100%" height={340}>
>>>>>>> Stashed changes
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
<<<<<<< Updated upstream
            outerRadius={150}
            dataKey="value"
            label
=======
            outerRadius={110}
            dataKey="value"
            label={false}
>>>>>>> Stashed changes
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />

        </PieChart>
      </ResponsiveContainer>
<<<<<<< Updated upstream
      <div>
        <div className='w-40 h-3 bg-[#489BAE] mb-2'></div>
        <div className='text-white font-bold text-lg mb-9'><span>Incomes</span></div>
        <div className='w-40 h-3 bg-[#D0312D] mb-2'></div>
        <div className='text-white font-bold text-lg mb-43'><span>Expenses</span></div>
        <div className='w-50 h-10 bg-green-500 rounded border-3xl flex justify-center items-center'>
            <span>Total Analysis</span>
=======
      <div className="w-full lg:w-auto flex flex-col justify-center px-2 sm:px-3 md:px-4 lg:px-0 lg:ml-3 xl:ml-4">
        <div className='w-full sm:w-24 md:w-32 lg:w-32 xl:w-40 h-1.5 sm:h-2 md:h-2.5 lg:h-3 bg-[#8080FF] mb-1.5 sm:mb-2 md:mb-2'></div>
        <div className='text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-3 md:mb-4 lg:mb-6 xl:mb-9'><span>Incomes</span></div>
        <div className='w-full sm:w-24 md:w-32 lg:w-32 xl:w-40 h-1.5 sm:h-2 md:h-2.5 lg:h-3 bg-[#0353a4] mb-1.5 sm:mb-2 md:mb-2'></div>
        <div className='text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg mb-2 sm:mb-4 md:mb-6 lg:mb-8 xl:mb-43'><span>Expenses</span></div>
        <div className='w-full sm:w-32 md:w-40 lg:w-40 xl:w-50 h-6 sm:h-7 md:h-8 lg:h-9 xl:h-10 bg-[#4747D4] rounded border-3xl flex justify-center items-center'>
            <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Total Analysis</span>
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  );
}

export default PiChart