import React from 'react'
import { useState } from 'react';

const ExpneseCalander = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  
    const today = new Date().toISOString().split("T")[0];
  
    return (
      <div className="relative w-64 w-full  text-sm text-white mb-3 mt-2 ">
        {/* Input Button */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full px-4 py-2 text-left border rounded-lg bg-light-100/5 hover:border-blue-500 focus:outline-none"
        >
          {value || "Select date"}
        </button>
  
        {/* Dropdown Calendar */}
        {open && (
          <div className="absolute z-10 mt-2 w-full bg-light-100/5 ">
            <input
              type="date"
              max={today}
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setOpen(false);
              }}
              className="w-full border bg-slate-7005 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}
      </div>
    );
}

export default ExpneseCalander
