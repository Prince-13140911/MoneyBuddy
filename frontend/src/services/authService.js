// ── MOCK AUTH SERVICE (no backend required) ──────────────────────────
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))

const DEMO_USER = { _id: 'demo-user-001', name: 'Demo User', email: 'demo@moneybuddy.app' }
const DEMO_PASS = 'demo1234'

function loadUsers() {
  try {
    const rawUsers = localStorage.getItem('fp_users')
    return rawUsers ? JSON.parse(rawUsers) : []
  } catch {
    localStorage.removeItem('fp_users')
    return []
  }
}

function seedDemoAccount() {
  const users = loadUsers()
  if (!users.find((u) => u.email === DEMO_USER.email)) {
    users.push({ ...DEMO_USER, password: DEMO_PASS })
    localStorage.setItem('fp_users', JSON.stringify(users))
  }
}

export const demoLogin = async () => {
  seedDemoAccount()
  await delay(300)
  const token = btoa(JSON.stringify({ id: DEMO_USER._id, email: DEMO_USER.email }))
  return { data: { data: { user: DEMO_USER, token } } }
}

export const registerUser = async ({ name, email, password }) => {
  await delay(500)
  const users = loadUsers()
  if (users.find((u) => u.email === email)) {
    throw { response: { data: { message: 'Email already registered' } } }
  }
  const user = { _id: crypto.randomUUID(), name, email }
  users.push({ ...user, password })
  localStorage.setItem('fp_users', JSON.stringify(users))
  const token = btoa(JSON.stringify({ id: user._id, email }))
  return { data: { data: { user, token } } }
}

export const loginUser = async ({ email, password }) => {
  await delay(400)
  const users = loadUsers()
  const found = users.find((u) => u.email === email && u.password === password)
  if (!found) {
    throw { response: { data: { message: 'Invalid email or password' } } }
  }
  const user = { _id: found._id, name: found.name, email: found.email }
  const token = btoa(JSON.stringify({ id: user._id, email }))
  return { data: { data: { user, token } } }
}
