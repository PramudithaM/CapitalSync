import React from 'react'

const LatestFiveExpenses = ({latestExpenses,totalExpense}) => {
  return (
    <div className="w-80 bg-gray-400/18 px-5 py-5 border rounded-lg mt-10 shadow-md 
                    transition-all duration-300 
                    hover:shadow-xl hover:scale-105 ">
  <div>
      <h2 className="text-xl font-semibold text-white ">
      Expense
    </h2>
  </div>
  <div className='flex justify-between'>
    <div className='flex justify-center w-18 bg-red-500 rounded text-xs p-1 mb-6'>
      <p>Latest Five</p>
    </div>
    <div>
      <span className='text-red-500 text-lg'>$ {totalExpense}</span>
    </div>
  </div>
    <div className='space-y-4'>
      {latestExpenses.length === 0 ? (
      <p className="text-sm text-gray-500">No income records</p>
    ) : (
      latestExpenses.map(item => (
        <div key={item.id} className="flex justify-between items-center bg-gray-500/15 px-4 py-2 rounded-md text-red-500">
          <span>{item.category}</span>
          <span className="text-red-500 font-medium">
            -{item.amount}
          </span>
        </div>
      ))
    )}
    </div>
  </div>
  )
}

export default LatestFiveExpenses