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
  )
}

export default Analytics