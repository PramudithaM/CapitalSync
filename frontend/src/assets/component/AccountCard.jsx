import React, { useState } from "react";

const AccountCard = ({mainAccountBalance,totalSalary,totalInvestment,totalBusinessIncome,totalFoodandDrink,totalHousing,totalTransportation}) => {
  const [activeTab, setActiveTab] = useState("income");
  const [loading,setLoading] = useState(true);

    

  // ---------------- HARD CODED DATA ----------------
  const expenseData = [
    { id: 1, category: "Food & Drink", amount: totalFoodandDrink },
    { id: 2, category: "Rent", amount: totalHousing },
    { id: 3, category: "Transport", amount: totalTransportation },
  ];
  const incomeData = [
    { id: 1, category: "Salary/Wadges", amount: totalSalary },
    { id: 2, category: "Investment", amount: totalInvestment },
    { id: 3, category: "Business Income", amount: totalBusinessIncome },
  ];

  // ---------------- CALCULATIONS ----------------
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const mainBalance = mainAccountBalance;

  const activeData = activeTab === "income" ? incomeData : expenseData;

  // ---------------- UI ----------------
  return (
    <div className="w-full sm:max-w-sm md:max-w-md lg:w-[450px] bg-gray-400/18 rounded-xl shadow-md p-3 sm:p-5 md:p-7 lg:p-10
                    transition-all duration-300 
                    hover:shadow-xl hover:scale-105">
      
      {/* Balance */}
      <div className="text-center">
        <p className="text-[#FFFFFF] font-medium text-sm sm:text-base md:text-lg lg:text-xl">
          Main Account Balance
        </p>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold mt-0 p-0 text-white">
          ${mainBalance}
        </h1>
      </div>

      {/* Switch Buttons */}
      <div className="flex mt-3 sm:mt-4 md:mt-5 lg:mt-6 bg-[#001845] rounded-lg p-1.5 sm:p-2">
        <button
          onClick={() => setActiveTab("income")}
          className={`cursor-pointer flex-1 py-1.5 sm:py-2 md:py-2 lg:py-2 text-xs sm:text-sm md:text-sm lg:text-base rounded-md font-semibold transition ${
            activeTab === "income"
              ? "bg-[#8080FF] text-[#FFFFFF]"
              : "text-[#8080FF]"
          }`}
        >
          Income
        </button>

        <button
          onClick={() => setActiveTab("expense")}
          className={`cursor-pointer flex-1 py-1.5 sm:py-2 md:py-2 lg:py-2 text-xs sm:text-sm md:text-sm lg:text-base rounded-md font-semibold transition ${
            activeTab === "expense"
              ? "bg-[#0353a4] text-[#FFFFFF]"
              : "text-[#0353a4]"
          }`}
        >
          Expenses
        </button>
      </div>

      {/* Totals */}
      <div className="mt-2 sm:mt-3 md:mt-3 lg:mt-4 text-center">
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#56cfe1]">
          {activeTab === "income" ? "Total Income" : "Total Expenses"}
        </p>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
          ${activeTab === "income" ? totalIncome : totalExpense}
        </p>
      </div>

      {/* Category List */}
      <div className="space-y-1.5 sm:space-y-2 md:space-y-2 lg:space-y-2">
        {activeData.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-gray-400/18 px-2.5 sm:px-3 md:px-4 lg:px-4 py-1.5 sm:py-2 md:py-2 lg:py-2 rounded-md text-xs sm:text-sm md:text-base lg:text-base"
          >
            <span className={`${activeTab === "expense"
              ? "text-white"
              : "text-white"}`}>{item.category}</span>
            <span className={`${activeTab === "expense"
              ? "text-white"
              : "text-white"}`}>${item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountCard;
