import { create } from 'zustand'
import {
  fetchTransactions,
  createTransaction,
  deleteTransaction,
  fetchSummary,
} from '../services/expenseService'

const useExpenseStore = create((set) => ({
  transactions: [],
  summary: {},
  loading: false,

  loadTransactions: async (params) => {
    set({ loading: true })
    try {
      const res = await fetchTransactions(params)
      set({ transactions: res.data.data })
    } catch {
      // silently fail — user sees empty state
    } finally {
      set({ loading: false })
    }
  },

  addTransaction: async (data) => {
    const res = await createTransaction(data)
    set((s) => ({ transactions: [res.data.data, ...s.transactions] }))
    return res.data.data
  },

  removeTransaction: async (id) => {
    await deleteTransaction(id)
    set((s) => ({ transactions: s.transactions.filter((t) => t._id !== id) }))
  },

  loadSummary: async (params) => {
    try {
      const res = await fetchSummary(params)
      set({ summary: res.data.data })
    } catch {
      // silently fail
    }
  },
}))

export default useExpenseStore
