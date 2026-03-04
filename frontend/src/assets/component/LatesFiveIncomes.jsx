import React from 'react'

const LatesFiveIncomes = ({totalIncome,latestIncomes,}) => {
  return (
<<<<<<< Updated upstream
    <div className="w-80 bg-gray-400/18 px-5 py-5 border rounded-lg mt-10 shadow-md 
=======
    <div className="w-80 h-103.5 bg-gray-400/18 px-5 py-5 rounded-lg mt-10 shadow-md 
>>>>>>> Stashed changes
                    transition-all duration-300 
                    hover:shadow-xl hover:scale-105 ">
  <div>
      <h2 className="text-xl font-semibold text-white ">
       Incomes
    </h2>
  </div>
  <div className='flex justify-between'>
<<<<<<< Updated upstream
    <div className='flex justify-center w-18 bg-green-500 rounded text-xs p-1 mb-6'>
      <p>Latest Five</p>
    </div>
    <div>
      <span className='text-green-500 text-lg'>$ {totalIncome}</span>
=======
    <div className='flex justify-center w-18 bg-[#8080FF] rounded text-xs p-1 mb-6'>
      <p className='text-white'>Latest Five</p>
    </div>
    <div>
      <span className='text-white text-lg'>$ {totalIncome}</span>
>>>>>>> Stashed changes
    </div>
  </div>
    

    <div className='space-y-4'>
      {latestIncomes.length === 0 ? (
      <p className="text-sm text-gray-500">No income records</p>
    ) : (
      latestIncomes.map(item => (
<<<<<<< Updated upstream
        <div key={item.id} className="flex justify-between items-center bg-gray-500/15 px-4 py-2 rounded-md text-green-500">
          <span>{item.category}</span>
          <span className="text-green-500 font-medium">
=======
        <div key={item.id} className="flex justify-between items-center bg-gray-500/15 px-4 py-2 rounded-md text-white">
          <span>{item.category}</span>
          <span className="text-[#8080FF] font-medium">
>>>>>>> Stashed changes
            +{item.amount}
          </span>
        </div>
      ))
    )}
    </div>
  </div>
  )
}

export default LatesFiveIncomes