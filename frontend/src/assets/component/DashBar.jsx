import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";


const DashBar = () => {

  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
  try {
    await signOut(auth);
    navigate("/login"); // change to your login route
  } catch (error) {
    console.error("Logout error:", error.message);
  }
};

  return (
    <div className="w-full bg-dark-100/30 max-w-full h-15 flex items-center justify-between px-5 ">
      <div className="flex  items-center gap-[1px]">
        <img src="/logo.png" alt="Logo" className="flex w-9 h-9 rounded-full item-start" />
        <span className="flex text-lg font-semibold text-white ml-3">Capital sync</span>
      </div>
      <div className="flex justify-center gap-30 ml-30">
        <span onClick={() => navigate("/home-page")}className="text-light-200 
                  hover:text-blue-500 
                  transition-colors duration-300 cursor-pointer">Dashboard</span>
        <span onClick={() => navigate("/income-page")} className="text-light-200 
                  hover:text-blue-500 
                  transition-colors duration-300 cursor-pointer">Income</span>
        <span onClick={() => navigate("/expenses-page")} className="text-light-200 
                  hover:text-blue-500 
                  transition-colors duration-300 cursor-pointer">Expenses</span>
        <span onClick={() => navigate("/transaction-page")} className="text-light-200 
                  hover:text-blue-500 
                  transition-colors duration-300 cursor-pointer">Transaction</span>
        <span onClick={() => navigate("/analytics")} className="text-light-200 
                  hover:text-blue-500 
                  transition-colors duration-300 cursor-pointer">Analytics</span>
        <span onClick={() => navigate("/about-us")} className="text-light-200 
                  hover:text-blue-500 
                  transition-colors duration-300 cursor-pointer mr-40">About Us</span>
      </div>

      <div className="flex justify-center pr-10">
        
          
          <div className="flex justify-center items-center gap-3">
            {/* <img src="/logo.png" alt="Profile" className="w-8 h-8 rounded-full" /> */}
            <div className="relative cursor-pointer mr-15">
                {/* <span className="text-xl">🔔</span> */}
            {/* <span
              className="absolute -top-1 -right-1 bg-red-500 text-xs w-4 h-4 
                       rounded-full flex items-center justify-center text-white"
            >
              3
            </span> */}
            </div>
            
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-gray-500/28 text-white text-sm rounded-lg shadow-md 
                    transition-all duration-300 
                    hover:shadow-xl hover:scale-105">
              Logout
            </button>

          </div>
          
        
      </div>
    </div>
  );
};

export default DashBar;
