// ── MOCK BUDGET SERVICE (localStorage) ──────────────────────────────
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))
const BUDGET_KEY = 'fp_budgets'
const GOAL_KEY   = 'fp_goals'

const DEMO_BUDGET = {
  _id: 'budget1',
  month: new Date().toISOString().slice(0, 7),
  limits: { Food: 300, Transport: 150, Entertainment: 100, Shopping: 200, Bills: 1000, Other: 150 },
}

const DEMO_GOALS = [
  { _id: 'goal1', title: 'Emergency Fund', targetAmount: 5000, savedAmount: 2200, deadline: '2026-12-01' },
  { _id: 'goal2', title: 'Vacation',       targetAmount: 2000, savedAmount: 850,  deadline: '2026-08-01' },
  { _id: 'goal3', title: 'New Laptop',     targetAmount: 1200, savedAmount: 600,  deadline: '2026-06-01' },
]

function parseStoredValue(key, fallbackValue) {
  try {
    const rawValue = localStorage.getItem(key)
    return rawValue ? JSON.parse(rawValue) : fallbackValue
  } catch {
    localStorage.removeItem(key)
    return fallbackValue
  }
}

const loadBudgets = () => parseStoredValue(BUDGET_KEY, [DEMO_BUDGET])
const loadGoals   = () => parseStoredValue(GOAL_KEY, DEMO_GOALS)
const saveBudgets = (d) => localStorage.setItem(BUDGET_KEY, JSON.stringify(d))
const saveGoals   = (d) => localStorage.setItem(GOAL_KEY,   JSON.stringify(d))

export const fetchBudgets = async () => {
  await delay()
  return { data: { data: loadBudgets() } }
}

export const saveBudget = async (data) => {
  await delay()
  const updated = { ...DEMO_BUDGET, ...data, _id: data._id || crypto.randomUUID() }
  saveBudgets([updated])
  return { data: { data: updated } }
}

export const fetchGoals = async () => {
  await delay()
  return { data: { data: loadGoals() } }
}

export const createGoal = async (data) => {
  await delay()
  const goal = { ...data, _id: crypto.randomUUID() }
  saveGoals([goal, ...loadGoals()])
  return { data: { data: goal } }
}

export const updateGoal = async (id, data) => {
  await delay()
  const goals = loadGoals().map((g) => (g._id === id ? { ...g, ...data } : g))
  saveGoals(goals)
  return { data: { data: goals.find((g) => g._id === id) } }
}

export const deleteGoal = async (id) => {
  await delay()
  saveGoals(loadGoals().filter((g) => g._id !== id))
  return { data: {} }
}
