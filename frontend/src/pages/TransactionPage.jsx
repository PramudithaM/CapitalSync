import React, { useState, useEffect } from 'react';
import DashBar from '../assets/component/DashBar';
import Toast from '../assets/component/Toast';
import SearchBar from '../assets/component/SearchBar';
import apiClient from '../services/apiClient';
import { getAllTransactions } from '../services/transactionService';

const TransactionPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const [searchFilters, setSearchFilters] = useState({
        category: '',
        date: '',
        type: '',
        price: ''
    });

    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const transactionsPerPage = 50;

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await apiClient.get('/api/categories/');
                // Backend returns a flat array of strings
                setCategories(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error('Failed to fetch categories', error);
            }
        };
        fetchCategories();
    }, []);

    // Reset to page 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchFilters]);

    // Fetch transactions when page or filters change
    useEffect(() => {
        fetchTransactions(currentPage, searchFilters);
    }, [currentPage, searchFilters]);

    const fetchTransactions = async (page = 1, filters = {}) => {
        setLoading(true);
        try {
            const data = await getAllTransactions(page, transactionsPerPage, filters);
            setTransactions(data.items || []);
            setTotalPages(data.total_pages || 1);
        } catch (error) {
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
        return new Date(dateString).toLocaleDateString('en-US', {
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

    return (
        <div className="pattern">
            <DashBar />

            <div className="wrapper flex flex-col items-center justify-center w-full max-w-5xl mx-auto py-6">

                <SearchBar
                    searchFilters={searchFilters}
                    setSearchFilters={setSearchFilters}
                    categories={categories}
                />

                <h1 className="text-center mb-6 text-white text-2xl font-semibold">
                    Transaction History
                </h1>

                {loading ? (
                    <div className="text-white text-center py-10">
                        <p>Loading transactions...</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-white text-center py-10">
                        <p>No transactions found.</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="text-white flex justify-between px-6 py-3 bg-dark-100/50 rounded-t-xl border-b border-slate-700 w-full">
                            <div className="flex-1 font-semibold">Title</div>
                            <div className="w-32 text-center font-semibold">Category</div>
                            <div className="w-32 text-center font-semibold">Date</div>
                            <div className="w-32 text-right font-semibold">Amount</div>
                        </div>

                        {/* Rows */}
                        <div className="bg-dark-100/30 rounded-b-xl w-full">
                            {transactions.map((transaction, index) => (
                                <div
                                    key={transaction.id}
                                    className={`flex justify-between px-6 py-4 text-white hover:bg-light-100/5 transition ${index !== transactions.length - 1 ? 'border-b border-slate-700/50' : ''
                                        }`}
                                >
                                    <div className="flex-1">
                                        <span className="font-medium">{transaction.title || 'Untitled'}</span>
                                        <span className={`ml-2 text-xs px-2 py-1 rounded ${transaction.type === 'income'
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {transaction.type}
                                        </span>
                                    </div>
                                    <div className="w-32 text-center text-slate-300">{transaction.category}</div>
                                    <div className="w-32 text-center text-slate-400">{formatDate(transaction.date)}</div>
                                    <div className="w-32 text-right font-semibold">{formatAmount(transaction.amount, transaction.type)}</div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-6 text-white w-full">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-slate-700 rounded disabled:opacity-50"
                            >
                                ← Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-slate-700 rounded disabled:opacity-50"
                            >
                                Next →
                            </button>
                        </div>

                        <div className="mt-4 p-4 bg-dark-100/50 rounded-xl text-white w-full">
                            <p className="text-sm text-slate-400">
                                Showing page{' '}
                                <span className="text-white font-semibold">{currentPage}</span> of{' '}
                                <span className="text-white font-semibold">{totalPages}</span>
                            </p>
                        </div>
                    </>
                )}
            </div>

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    );
};

export default TransactionPage;