import React from 'react'
import { BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend
 } from 'recharts'

const IncomeExpensesChart = ({ data }) => {
  const chartData = Array.isArray(data) && data.length ? data : [];
  
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
    <div className='w-full sm:max-w-2xl md:max-w-3xl lg:w-[850px] h-64 sm:h-80 md:h-96 lg:h-[380px] rounded-xl shadow-md 
                    transition-all duration-300 
                    hover:shadow-xl hover:scale-105 '>
        <h2 className='text-base sm:text-lg md:text-xl text-black font-bold flex justify-center text-white '>
        Income vs Expenses
        </h2>
        <span className='flex justify-center text-sm sm:text-base text-[#4747D4]'>last 6 months</span>

        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
                <XAxis dataKey='month'/>
                <YAxis />
                <Tooltip content={<CustomTooltip />} />

                <Legend/>

                <Bar dataKey="income" fill="#8080FF" radius={[4,4,0,0]} />
                <Bar dataKey="expenses" fill="#0353a4" radius={[4,4,0,0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
}

export default IncomeExpensesChart