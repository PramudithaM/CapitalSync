import React from 'react'

const Amount = ({incomeAmount,setIncomeAmount}) => {
  return (
    <div className='search mt-2 mb-3 border rounded-xl border-slate-700 hover:border-indigo-500 transition'>
        <div>
            <input type='text' 
<<<<<<< Updated upstream
            placeholder='Money' 
=======
            placeholder='Add amount' 
>>>>>>> Stashed changes
            value={incomeAmount} 
            onChange={(e) => setIncomeAmount(e.target.value)} className='text-sm'/>
        </div>
    </div>
  )
}

export default Amount