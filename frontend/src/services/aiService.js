import api from './api'

export const sendChatMessage = (message) => api.post('/api/ai/chat', { message })
export const fetchInsights = (params) => api.get('/api/ai/insights', { params })
