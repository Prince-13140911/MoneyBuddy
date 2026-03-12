import { create } from 'zustand'
import {
  fetchBudgets,
  saveBudget,
  fetchGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from '../services/budgetService'

const useBudgetStore = create((set) => ({
  budget: null,
  goals: [],
  loading: false,

  loadBudget: async (month) => {
    try {
      const res = await fetchBudgets({ month })
      set({ budget: res.data.data[0] || null })
    } catch {
      // silently fail
    }
  },

  upsertBudget: async (data) => {
    const res = await saveBudget(data)
    set({ budget: res.data.data })
  },

  loadGoals: async () => {
    set({ loading: true })
    try {
      const res = await fetchGoals()
      set({ goals: res.data.data })
    } catch {
      // silently fail
    } finally {
      set({ loading: false })
    }
  },

  addGoal: async (data) => {
    const res = await createGoal(data)
    set((s) => ({ goals: [res.data.data, ...s.goals] }))
  },

  updateGoalProgress: async (id, savedAmount) => {
    const res = await updateGoal(id, { savedAmount })
    set((s) => ({ goals: s.goals.map((g) => (g._id === id ? res.data.data : g)) }))
  },

  removeGoal: async (id) => {
    await deleteGoal(id)
    set((s) => ({ goals: s.goals.filter((g) => g._id !== id) }))
  },
}))

export default useBudgetStore
