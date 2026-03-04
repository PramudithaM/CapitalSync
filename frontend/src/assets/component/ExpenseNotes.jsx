import React from 'react'

const ExpenseNotes = ({notes, setNotes}) => {
  return (
    <div className='search mt-2 mb-3 border rounded-xl border-slate-700 hover:border-indigo-500 transition'>
        <div>
            <input type='text' 
<<<<<<< Updated upstream
            placeholder='$' 
=======
            placeholder='Add short note' 
>>>>>>> Stashed changes
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} className='text-sm'/>
        </div>
    </div>
  )
}

export default ExpenseNotes