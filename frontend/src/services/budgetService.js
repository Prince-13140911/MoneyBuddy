import api from './api'

export const fetchBudgets = (params) => api.get('/api/budgets', { params })
export const saveBudget = (data) => api.post('/api/budgets', data)
export const fetchGoals = () => api.get('/api/goals')
export const createGoal = (data) => api.post('/api/goals', data)
export const updateGoal = (id, data) => api.put(`/api/goals/${id}`, data)
export const deleteGoal = (id) => api.delete(`/api/goals/${id}`)
