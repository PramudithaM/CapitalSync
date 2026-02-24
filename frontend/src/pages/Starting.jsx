import React from 'react'
import GetStarted from '../assets/component/GetStarted'
import { useNavigate } from "react-router-dom";


const Starting = () => {

  const navigate = useNavigate();
  
  return (
    <main>
      <div className='w-full h-screen bg-center bg-cover absolute top-0 left-0'/>
      <div className='px-1 py-12 xs:p-10 max-w-8xl mx-auto flex flex-col relative z-10 min-h-screen flex items-center justify-center'>
        <header>
          <h1 className='mx-auto max-w-7xl text-center text-5xl font-bold leading-tight tracking-[-1%] text-white sm:text-[64px] sm:leading-[76px] mb-2'>Welcome to wealth os system</h1>
          <p className='text-center text-indigo-500 '>Your gateway to financial success starts here. Join us to manage and grow your wealth effectively</p>
          <div 
          onClick={() => navigate("/login")}
          className='cursor-pointer select-none mt-4 flex item-center justify-center'><GetStarted/></div>
          
        </header>
      </div>
    </main>
  )
}

export default Starting