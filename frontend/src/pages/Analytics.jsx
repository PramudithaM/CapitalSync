import React from 'react'
import DashBar from '../assets/component/DashBar'
import AnalyticPiChart from '../assets/component/AnalyticPiChart'
import PiChart from '../assets/component/PiChart'
import { useEffect } from 'react';
import { useState } from 'react';

import { auth } from '../firebase';
import { getAllIncomes } from '../services/incomeService';
import { getAllExpenses } from '../services/expenseService';
import ExpenseAnalaticPichart from '../assets/component/ExpenseAnalaticPichart';

const Analytics = () => {

  const [incomes, setIncomes] = useState([])
      const [expenses, setExpenses] = useState([])
      const [loading, setLoading] = useState(true);
  
    const fetchData = async () => {
        setLoading(true)
        try {
          const [incRes, expRes] = await Promise.all([getAllIncomes(),getAllExpenses()])
    
          console.log("Incomes from backend:", incRes)   // <<-- THIS LINE
        console.log("Expenses from backend:", expRes)
        
          setIncomes(Array.isArray(incRes) ? incRes : [])
          setExpenses(Array.isArray(expRes) ? expRes : [])
        } catch (err) {
          console.error('Error fetching incomes/expenses', err)
          setIncomes([])
          setExpenses([])
        } finally {
          setLoading(false)
        }
      }
      
   useEffect(() => {
      const unsub = auth.onAuthStateChanged((user) => {
        if (user) fetchData()
        else {
          setIncomes([])
          setExpenses([])
          setLoading(false)
        }
      })
      return () => unsub()
    }, []);
  
    const getTotalByCategory = (data, category) => {
    return data
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + Number(item.amount), 0)
  }
    
  // Calculate Income by Category
  const totalSalary = getTotalByCategory(incomes, "Salary/Wages")
  const totalInvestment = getTotalByCategory(incomes, "Investment")
  const  totalBusinessIncome = getTotalByCategory(incomes, "Business Income")
  const  totalFreelance = getTotalByCategory(incomes, "Freelance/Side hustle")
  const  totalOthers = getTotalByCategory(incomes, "Others")

  //Calculate Expense by Category

const totalFoodandDrink = getTotalByCategory(expenses, "Food & Drink")
const totalHousing = getTotalByCategory(expenses, "Housing")
const totalTransportation = getTotalByCategory(expenses, "Transportation")
const totalBills = getTotalByCategory(expenses, "Bills & Utilities")
const totalHealth = getTotalByCategory(expenses, "Health & Medical")
<<<<<<< Updated upstream
  
  return (
    <div>
      <DashBar/>
      <div className='w-250 h-190 bg-dark-100/20 px-10 py-10 rounded-lg mt-10 ml-90 mr-20 justify-center shadow-md 
                    transition-all duration-300 
                    hover:shadow-xl hover:scale-101'>
              <div className='flex justify-center gap-10'>
                <div className=''>
                <div className='w-100 h-10 bg-green-500 rounded border-3xl flex justify-center items-center mb-10'>
                <span className='text-white'>Income</span>
                </div>
                <AnalyticPiChart totalSalary = {totalSalary} totalBusinessIncome = {totalBusinessIncome} totalFreelance = {totalFreelance} totalInvestment = {totalInvestment} totalOthers = {totalOthers} />
                <div className='w-100 h-60 bg-green-500/8 rounded border-3xl  flex justify-center justify-between gap-20 p-5'>
                  <div>
                    <div className='py-2 text-white'><span>Salary</span></div>
                    <div className='py-2 text-white'><span>Freelance</span></div>
                    <div className='py-2 text-white'><span>Business Income</span></div>
                    <div className='py-2 text-white'><span>Investment</span></div>
                    <div className='py-2 text-white'><span>Others</span></div>
                  </div>
                  <div>
                    <div className='py-2 text-green-500'><span>$ {totalSalary}</span></div>
                    <div className='py-2 text-green-500'><span>$ {totalFreelance}</span></div>
                    <div className='py-2 text-green-500'><span>$ {totalBusinessIncome}</span></div>
                    <div className='py-2 text-green-500'><span>$ {totalInvestment}</span></div>
                    <div className='py-2 text-green-500'><span>$ {totalOthers}</span></div>
                  </div>
                </div>
              </div>
              <div className=''>
                <div className='w-100 h-10 bg-red-500 rounded border-3xl flex justify-center items-center mb-10'>
                <span className='text-white'>Expenses</span>
                </div>
                <ExpenseAnalaticPichart totalBills={totalBills} totalFoodandDrink={totalFoodandDrink} totalHealth={totalHealth} totalHousing={totalHousing} totalTransportation={totalTransportation}/>
                <div className='w-100 h-60 bg-green-500/8 rounded border-3xl  flex justify-center justify-between gap-20 p-5'>
                  <div>
                    <div className='py-2 text-white'><span>Bills & Utilities</span></div>
                    <div className='py-2 text-white'><span>health & Medical</span></div>
                    <div className='py-2 text-white'><span>Food & Drinks</span></div>
                    <div className='py-2 text-white'><span>Transportation</span></div>
                    <div className='py-2 text-white'><span>Housing</span></div>
                  </div>
                  <div>
                    <div className='py-2 text-red-500'><span>$ {totalBills}</span></div>
                    <div className='py-2 text-red-500'><span>$ {totalHealth}</span></div>
                    <div className='py-2 text-red-500'><span>$ {totalFoodandDrink}</span></div>
                    <div className='py-2 text-red-500'><span>$ {totalTransportation}</span></div>
                    <div className='py-2 text-red-500'><span>$ {totalHousing}</span></div>
                  </div>
                </div>
              </div>
              </div>
            </div>
        </div>
=======

const formatCurrency = (amount) => {
  return Number(amount).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
  
  return (
    <div className='w-full min-h-screen flex flex-col'>
      <DashBar/>
      <div className='flex-1 flex justify-center items-center py-6 sm:py-8 md:py-10 lg:py-12 xl:py-14 px-2 sm:px-3 md:px-4'>
      <div className='w-full md:w-250 lg:w-260 xl:w-280 h-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-5 md:py-6 lg:py-8 xl:py-10 rounded-lg shadow-md 
                    transition-all duration-300 
                    hover:shadow-xl hover:scale-101'>
              <div className='flex flex-col lg:flex-row justify-center items-center gap-16 sm:gap-20 md:gap-24 lg:gap-32 xl:gap-40'>
                <div className='flex flex-col items-center justify-center w-full sm:w-96'>
                <div className='w-full sm:w-96 md:w-100 lg:w-110 xl:w-120 h-7 sm:h-8 md:h-9 lg:h-10 xl:h-11 bg-[#8080FF] rounded border-3xl flex justify-center items-center mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10'>
                <span className='text-white text-xs sm:text-sm md:text-base lg:text-base xl:text-lg'>Income</span>
                </div>
                <div className='w-full sm:w-[450px] md:w-[500px] lg:w-[580px] xl:w-[650px] h-auto flex items-center justify-center'>
                <div className='w-full sm:w-[450px] md:w-[500px] lg:w-[580px] xl:w-[650px] h-auto flex items-center justify-center'>
                <AnalyticPiChart totalSalary = {totalSalary} totalBusinessIncome = {totalBusinessIncome} totalFreelance = {totalFreelance} totalInvestment = {totalInvestment} totalOthers = {totalOthers} />
                </div>
                </div>
                <div className='w-full sm:w-96 md:w-100 lg:w-110 xl:w-120 h-auto bg-green-500/8 rounded border-3xl flex flex-col gap-1.5 sm:gap-2 md:gap-2 lg:gap-2.5 xl:gap-3 p-2.5 sm:p-3 md:p-4 lg:p-5 xl:p-6'>
                  <div className='flex justify-between items-center py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-2.5'>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Salary</span>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Rs {formatCurrency(totalSalary)}</span>
                  </div>
                  <div className='flex justify-between items-center py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-2.5'>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Freelance</span>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Rs {formatCurrency(totalFreelance)}</span>
                  </div>
                  <div className='flex justify-between items-center py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-2.5'>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Business Income</span>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Rs {formatCurrency(totalBusinessIncome)}</span>
                  </div>
                  <div className='flex justify-between items-center py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-2.5'>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Investment</span>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Rs {formatCurrency(totalInvestment)}</span>
                  </div>
                  <div className='flex justify-between items-center py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-2.5'>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Others</span>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Rs {formatCurrency(totalOthers)}</span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-center justify-center w-full sm:w-96'>
                <div className='w-full sm:w-96 md:w-100 lg:w-110 xl:w-120 h-7 sm:h-8 md:h-9 lg:h-10 xl:h-11 bg-[#0353a4] rounded border-3xl flex justify-center items-center mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10'>
                <span className='text-white text-xs sm:text-sm md:text-base lg:text-base xl:text-lg'>Expenses</span>
                </div>
                <div className='w-full sm:w-96 md:w-100 lg:w-110 xl:w-120 h-auto flex items-center justify-center'>
                <div className='w-full sm:w-[450px] md:w-[500px] lg:w-[580px] xl:w-[650px] h-auto flex items-center justify-center'>
                <ExpenseAnalaticPichart totalBills={totalBills} totalFoodandDrink={totalFoodandDrink} totalHealth={totalHealth} totalHousing={totalHousing} totalTransportation={totalTransportation}/>
                </div>
                </div>
                <div className='w-full sm:w-96 md:w-100 lg:w-110 xl:w-120 h-auto bg-green-500/8 rounded border-3xl flex flex-col gap-1.5 sm:gap-2 md:gap-2 lg:gap-2.5 xl:gap-3 p-2.5 sm:p-3 md:p-4 lg:p-5 xl:p-6'>
                  <div className='flex justify-between items-center py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-2.5'>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Bills & Utilities</span>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Rs {formatCurrency(totalBills)}</span>
                  </div>
                  <div className='flex justify-between items-center py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-2.5'>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Health & Medical</span>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Rs {formatCurrency(totalHealth)}</span>
                  </div>
                  <div className='flex justify-between items-center py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-2.5'>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Food & Drinks</span>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Rs {formatCurrency(totalFoodandDrink)}</span>
                  </div>
                  <div className='flex justify-between items-center py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-2.5'>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Transportation</span>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Rs {formatCurrency(totalTransportation)}</span>
                  </div>
                  <div className='flex justify-between items-center py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-2.5'>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Housing</span>
                    <span className='text-white text-xs sm:text-sm md:text-sm lg:text-base xl:text-base'>Rs {formatCurrency(totalHousing)}</span>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
>>>>>>> Stashed changes
  )
}

export default Analytics