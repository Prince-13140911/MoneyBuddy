// ── MOCK EXPENSE SERVICE (localStorage) ─────────────────────────────
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))
const KEY = 'fp_transactions'

const DEMO_TRANSACTIONS = [
  { _id: 'demo1', title: 'Salary', amount: 3500, type: 'income',  category: 'Other',         date: new Date().toISOString() },
  { _id: 'demo2', title: 'Rent',   amount: 900,  type: 'expense', category: 'Bills',         date: new Date().toISOString() },
  { _id: 'demo3', title: 'Groceries', amount: 120, type: 'expense', category: 'Food',        date: new Date().toISOString() },
  { _id: 'demo4', title: 'Netflix', amount: 18,  type: 'expense', category: 'Entertainment', date: new Date().toISOString() },
  { _id: 'demo5', title: 'Uber',   amount: 35,   type: 'expense', category: 'Transport',    date: new Date().toISOString() },
  { _id: 'demo6', title: 'Amazon', amount: 65,   type: 'expense', category: 'Shopping',     date: new Date().toISOString() },
]

function parseTransactions(raw) {
  try {
    return JSON.parse(raw)
  } catch {
    localStorage.removeItem(KEY)
    return DEMO_TRANSACTIONS
  }
}

const load = () => {
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(DEMO_TRANSACTIONS))
    return DEMO_TRANSACTIONS
  }
  return parseTransactions(raw)
}
const save = (data) => localStorage.setItem(KEY, JSON.stringify(data))

export const fetchTransactions = async () => {
  await delay()
  return { data: { data: load() } }
}

export const createTransaction = async (data) => {
  await delay()
  const tx = { ...data, _id: crypto.randomUUID(), date: data.date || new Date().toISOString() }
  const all = [tx, ...load()]
  save(all)
  return { data: { data: tx } }
}

export const updateTransaction = async (id, data) => {
  await delay()
  const all = load().map((t) => (t._id === id ? { ...t, ...data } : t))
  save(all)
  return { data: { data: all.find((t) => t._id === id) } }
}

export const deleteTransaction = async (id) => {
  await delay()
  save(load().filter((t) => t._id !== id))
  return { data: {} }
}

export const fetchSummary = async () => {
  await delay(200)
  const expenses = load().filter((t) => t.type === 'expense')
  const summary = {}
  expenses.forEach(({ category, amount }) => {
    summary[category] = (summary[category] || 0) + amount
  })
  return { data: { data: summary } }
}
