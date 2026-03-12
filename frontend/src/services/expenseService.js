import api from './api'

export const fetchTransactions = (params) => api.get('/api/transactions', { params })
export const createTransaction = (data) => api.post('/api/transactions', data)
export const updateTransaction = (id, data) => api.put(`/api/transactions/${id}`, data)
export const deleteTransaction = (id) => api.delete(`/api/transactions/${id}`)
export const fetchSummary = (params) => api.get('/api/transactions/summary', { params })
