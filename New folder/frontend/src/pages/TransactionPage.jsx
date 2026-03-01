import React, { useState, useEffect } from 'react'
import DashBar from '../assets/component/DashBar'
import Toast from '../assets/component/Toast'
import { getAllTransactions } from '../services/transactionService'



const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setToast({ 
        message: error.message || 'Failed to load transactions', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatAmount = (amount, type) => {
    const prefix = type === 'income' ? '+' : '-';
    const color = type === 'income' ? 'text-green-400' : 'text-red-400';
    return <span className={color}>{prefix}${parseFloat(amount).toFixed(2)}</span>;
  };

  // for dashbord
  

  return (
    <div className='pattern '>
        <DashBar/>
        <div className='wrapper flex items-center justify-center '>
            <div className='w-full max-w-4xl'>
                <h1 className='text-center mb-6'>Transaction History</h1>
                
                {loading ? (
                  <div className='text-white text-center py-10'>
                    <p>Loading transactions...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className='text-white text-center py-10'>
                    <p>No transactions found. Start by adding income or expenses!</p>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className='text-white flex justify-between px-6 py-3 bg-dark-100/50 rounded-t-xl border-b border-slate-700'>
                      <div className='flex-1'>
                        <span className='font-semibold'>Title</span>
                      </div>
                      <div className='w-32 text-center'>
                        <span className='font-semibold'>Category</span>
                      </div>
                      <div className='w-32 text-center'>
                        <span className='font-semibold'>Date</span>
                      </div>
                      <div className='w-32 text-right'>
                        <span className='font-semibold'>Amount</span>
                      </div>
                    </div>

                    {/* Transaction List */}
                    <div className='bg-dark-100/30 rounded-b-xl'>
                      {transactions.map((transaction, index) => (
                        <div 
                          key={transaction.id} 
                          className={`flex justify-between px-6 py-4 text-white hover:bg-light-100/5 transition ${
                            index !== transactions.length - 1 ? 'border-b border-slate-700/50' : ''
                          }`}
                        >
                          <div className='flex-1'>
                            <span className='font-medium'>{transaction.title || 'Untitled'}</span>
                            {transaction.type && (
                              <span className={`ml-2 text-xs px-2 py-1 rounded ${
                                transaction.type === 'income' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {transaction.type}
                              </span>
                            )}
                          </div>
                          <div className='w-32 text-center text-slate-300'>
                            {transaction.category}
                          </div>
                          <div className='w-32 text-center text-slate-400'>
                            {formatDate(transaction.date)}
                          </div>
                          <div className='w-32 text-right font-semibold'>
                            {formatAmount(transaction.amount, transaction.type)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className='mt-4 p-4 bg-dark-100/50 rounded-xl text-white'>
                      <p className='text-sm text-slate-400'>
                        Total Transactions: <span className='text-white font-semibold'>{transactions.length}</span>
                      </p>
                    </div>
                  </>
                )}
            </div>
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

export default TransactionPage
