import React from 'react'
import DashBar from '../assets/component/DashBar'
import IncomeDetails from '../assets/component/IncomeDetails'
import { useState } from 'react'
import Description from '../assets/component/Description'
import Amount from '../assets/component/Amount'
import IncomeSelect from '../assets/component/IncomeSelect'
import CalanderDate from '../assets/component/CalanderDate'
import DashBoard from '../assets/component/DashBoard'
import AddButton from '../assets/component/AddButton'
import Toast from '../assets/component/Toast'
import { createIncome } from '../services/incomeService'



const IncomePage = () => {
    
    const [addDescription, setAddDescription] = useState('');
    const [incomeAmount, setIncomeAmount] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const handleSubmit = async () => {
        // Validation
        if (!addDescription || !incomeAmount || !category || !date) {
            setToast({ message: 'Please fill in all fields', type: 'error' });
            return;
        }

        if (parseFloat(incomeAmount) <= 0) {
            setToast({ message: 'Amount must be greater than 0', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            const incomeData = {
                title: addDescription,
                amount: parseFloat(incomeAmount),
                category: category,
                date: new Date(date).toISOString(),
            };

            await createIncome(incomeData);
            
            setToast({ message: 'Income added successfully!', type: 'success' });
            
            // Clear form
            setAddDescription('');
            setIncomeAmount('');
            setCategory('');
            setDate('');
        } catch (error) {
            console.error('Error creating income:', error);
            setToast({ 
                message: error.message || 'Failed to add income. Please try again.', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className='bg-hero-pattern w-full min-h-screen bg-center bg-cover absolute top-0 left-0'>
        <DashBar/>
        <div className='px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12 max-w-7xl mx-auto flex flex-col relative z-10 items-center justify-center'>
            <header className='border border-slate-700 rounded-2xl p-3 sm:p-4 md:p-5 w-full sm:max-w-md md:max-w-lg lg:max-w-2xl'>
                <h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-white'>Add Income</h1>
                <p className='text-center text-sm sm:text-base text-[#8080FF] mt-1'>Track your earnings and income sources</p>
                <div className='w-full bg-gray-400/18 p-4 sm:p-5 md:p-6 rounded-2xl shadow-light-100/10 mt-4'>
                    <div>
                        <IncomeDetails text = "Title"/>
                    <Description addDescription = {addDescription} setAddDescription = {setAddDescription} />
                    <IncomeDetails text = "Amount" />
                    <Amount incomeAmount = {incomeAmount} setIncomeAmount = {setIncomeAmount} />
                    <IncomeDetails text = "Category"/>
                    <IncomeSelect value={category} onChange={setCategory} />
                    <IncomeDetails text = "Date"/>
                    <CalanderDate value={date} onChange={setDate} />
                    </div>
                    <div className='flex justify-center'>
                        <AddButton text = "Add Income" onClick={handleSubmit} loading={loading} />
                    </div>
                </div>
                
            </header>
        </div>
        {toast && (
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
            />
        )}
    </div>
  )
}

export default IncomePage
