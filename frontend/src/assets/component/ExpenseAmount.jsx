import React from 'react'

const ExpenseAmount = ({expenseAmount,setExpenseAmount}) => {
  return (
    <div className='search mt-2 mb-3 border rounded-xl border-slate-700 hover:border-indigo-500 transition'>
        <div>
            <input type='text' 
<<<<<<< Updated upstream
            placeholder='$' 
=======
            placeholder='Add amount' 
>>>>>>> Stashed changes
            value={expenseAmount} 
            onChange={(e) => setExpenseAmount(e.target.value)} className='text-sm'/>
        </div>
    </div>
  )
}

export default ExpenseAmount