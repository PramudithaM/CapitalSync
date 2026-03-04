import React from "react";
<<<<<<< Updated upstream
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";


const DashBar = () => {

  const navigate = useNavigate();
  const auth = getAuth();

=======
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";



const DashBar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

>>>>>>> Stashed changes
  const handleLogout = async () => {
  try {
    await signOut(auth);
    navigate("/login"); // change to your login route
  } catch (error) {
    console.error("Logout error:", error.message);
  }
};

  return (
<<<<<<< Updated upstream
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
=======
    <div className="w-full bg-dark-100/30 max-w-full h-auto sm:h-12 md:h-14 lg:h-16 flex flex-col sm:flex-row items-center justify-between px-2 sm:px-3 md:px-5 lg:px-8 py-1.5 sm:py-1 md:py-0 gap-1.5 sm:gap-0">
      <div className="flex items-center gap-0.5 sm:gap-1 order-1">
        <img src="/logo.png" alt="Logo" className="w-6 sm:w-7 md:w-8 lg:w-9 h-6 sm:h-7 md:h-8 lg:h-9 rounded-full" />
        <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-[#8080FF] ml-1 sm:ml-2 md:ml-3 lg:ml-4 whitespace-nowrap">Capital sync</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-6 lg:gap-10 flex-1 sm:ml-2 md:ml-4 lg:ml-8 order-3 sm:order-2 w-full sm:w-auto">
        <span onClick={() => navigate("/home-page")} className={`text-xs sm:text-xs md:text-sm lg:text-base font-semibold
                  transition-colors duration-300 cursor-pointer whitespace-nowrap ${
                    isActive("/home-page")
                      ? "text-[#8080FF]"
                      : "text-white hover:text-[#8080FF]"
                  }`}>Dashboard</span>
        <span onClick={() => navigate("/income-page")} className={`text-xs sm:text-xs md:text-sm lg:text-base font-semibold 
                  transition-colors duration-300 cursor-pointer whitespace-nowrap ${
                    isActive("/income-page")
                      ? "text-[#8080FF]"
                      : "text-white hover:text-[#8080FF]"
                  }`}>Income</span>
        <span onClick={() => navigate("/expenses-page")} className={`text-xs sm:text-xs md:text-sm lg:text-base font-semibold 
                  transition-colors duration-300 cursor-pointer whitespace-nowrap ${
                    isActive("/expenses-page")
                      ? "text-[#8080FF]"
                      : "text-white hover:text-[#8080FF]"
                  }`}>Expenses</span>
        <span onClick={() => navigate("/transaction-page")} className={`text-xs sm:text-xs md:text-sm lg:text-base font-semibold 
                  transition-colors duration-300 cursor-pointer whitespace-nowrap ${
                    isActive("/transaction-page")
                      ? "text-[#8080FF]"
                      : "text-white hover:text-[#8080FF]"
                  }`}>Transaction</span>
        <span onClick={() => navigate("/analytics")} className={`text-xs sm:text-xs md:text-sm lg:text-base font-semibold 
                  transition-colors duration-300 cursor-pointer whitespace-nowrap ${
                    isActive("/analytics")
                      ? "text-[#8080FF]"
                      : "text-white hover:text-[#8080FF]"
                  }`}>Analytics</span>
        <span onClick={() => navigate("/about-us")} className={`text-xs sm:text-xs md:text-sm lg:text-base font-semibold 
                  transition-colors duration-300 cursor-pointer whitespace-nowrap ${
                    isActive("/about-us")
                      ? "text-[#8080FF]"
                      : "text-white hover:text-[#8080FF]"
                  }`}>About Us</span>
      </div>

      <div className="flex justify-center pr-0 sm:pr-1 md:pr-2 lg:pr-6 order-2 sm:order-3">
        
          
          <div className="flex justify-center items-center gap-1 sm:gap-2">
            {/* <img src="/logo.png" alt="Profile" className="w-8 h-8 rounded-full" /> */}
            <div className="relative cursor-pointer mr-1 sm:mr-2 md:mr-4 lg:mr-8 hidden">
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
              className="px-3 py-1 bg-gray-500/28 text-white text-sm rounded-lg shadow-md 
                    transition-all duration-300 
                    hover:shadow-xl hover:scale-105">
=======
              className="px-2 sm:px-2.5 md:px-3 lg:px-4 py-0.5 sm:py-1 md:py-1.5 bg-[#8080FF] text-white text-xs sm:text-xs md:text-sm lg:text-base font-bold rounded-lg shadow-md 
                    transition-all duration-300 
                    hover:shadow-xl hover:scale-105 whitespace-nowrap">
>>>>>>> Stashed changes
              Logout
            </button>

          </div>
          
        
      </div>
    </div>
  );
};

export default DashBar;
