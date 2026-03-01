import apiClient from './apiClient';

const TRANSACTION_ENDPOINT = '/api/transactions';

/**
 * Get all transactions (combined income and expenses)
 * @returns {Promise<Array>} List of all transactions
 */
export const getAllTransactions = async () => {
  const response = await apiClient.get(`${TRANSACTION_ENDPOINT}/`);
  return response.data;
};
