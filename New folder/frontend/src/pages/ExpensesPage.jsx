import React, { useState } from 'react'
import DashBar from '../assets/component/DashBar'
import ExpenseDetails from '../assets/component/ExpenseDetails'
import ExpenseTitle from '../assets/component/ExpenseTitle'
import ExpenseAmount from '../assets/component/ExpenseAmount'
import ExpenseSelect from '../assets/component/ExpenseSelect'
import ExpneseCalander from '../assets/component/ExpneseCalander'
import ExpenseSourceSelect from '../assets/component/ExpenseSourceSelect'
import ExpenseNotes from '../assets/component/ExpenseNotes'
import AddButton from '../assets/component/AddButton'
import HoverCard from '../assets/component/HoverCard'
import Toast from '../assets/component/Toast'
import { createExpense } from '../services/expenseService'

const ExpensesPage = () => {

    const [title, setTitle] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [category, setCategory] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const handleSubmit = async () => {
        // Validation
        if (!title || !expenseAmount || !category || !date) {
            setToast({ message: 'Please fill in all required fields', type: 'error' });
            return;
        }

        if (parseFloat(expenseAmount) <= 0) {
            setToast({ message: 'Amount must be greater than 0', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            const expenseData = {
                title: title,
                amount: parseFloat(expenseAmount),
                category: category,
                payment_method: paymentMethod || null,
                note: notes || null,
                date: new Date(date).toISOString(),
            };

            await createExpense(expenseData);
            
            setToast({ message: 'Expense added successfully!', type: 'success' });
            
            // Clear form
            setTitle('');
            setExpenseAmount('');
            setCategory('');
            setPaymentMethod('');
            setDate('');
            setNotes('');
        } catch (error) {
            console.error('Error creating expense:', error);
            setToast({ 
                message: error.message || 'Failed to add expense. Please try again.', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className='pattern'>
        <DashBar/>
        <div className='wrapper flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12'>
            <header className='border border-slate-700 rounded-2xl p-3 sm:p-4 md:p-5 w-full sm:max-w-md md:max-w-lg lg:max-w-2xl'>
                <h1 className='text-xl sm:text-2xl md:text-3xl font-bold text-white'>Add Expenses</h1>
                <p className='text-center text-sm sm:text-base text-[#0353a4] mt-1'>Track your expenses and sources</p>
                <div className='w-full bg-gray-400/18 p-4 sm:p-5 md:p-6 rounded-2xl shadow-light-100/10 mt-4'>
                    <div>
                        <ExpenseDetails text= "Title" />
                    <ExpenseTitle title={title} setTitle={setTitle} />
                    <ExpenseDetails text= "Amount" />
                    <ExpenseAmount expenseAmount = {expenseAmount} setExpenseAmount = {setExpenseAmount} />
                    <ExpenseDetails text= "Category" />
                    <ExpenseSelect value={category} onChange={setCategory} />
                    <ExpenseDetails text= "Date" />
                    <ExpneseCalander value={date} onChange={setDate} />
                    <ExpenseDetails text= "Payment Method" />
                    <ExpenseSourceSelect value={paymentMethod} onChange={setPaymentMethod} />
                    <ExpenseDetails text= "Note(Optional)" />
                    <ExpenseNotes notes={notes} setNotes ={setNotes} />
                    </div>
                    <div className='flex justify-center'>
                        <AddButton text = "Add Expenses" onClick={handleSubmit} loading={loading} />
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

export default ExpensesPage
