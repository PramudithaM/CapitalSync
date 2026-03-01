import React from 'react'

const AddButton = ({ text, onClick, loading = false, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`bg-light-200 py-3.5 rounded-2xl shadow-inner shadow-light-100/10 w-45 h-14 m-5 text-gray-100 text-lg text-center cursor-pointer hover:bg-light-200/80 transition ${
        loading || disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {loading ? 'Processing...' : text}
    </button>
  )
}

export default AddButton
