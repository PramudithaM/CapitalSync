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
    <div className='w-[850px] h-[380px] border  rounded-xl shadow-md 
                    transition-all duration-300 
                    hover:shadow-xl hover:scale-105 '>
        <h2 className='text-lg text-black font-bold  flex justify-center  '>
        Income vs Expenses
        </h2>

        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
                <XAxis dataKey='month'/>
                <YAxis />
                <Tooltip content={<CustomTooltip />} />

                <Legend/>

                <Bar dataKey="income" fill="#489BAE" radius={[4,4,0,0]} />
                <Bar dataKey="expenses" fill="#D0312D" radius={[4,4,0,0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
}

export default IncomeExpensesChart