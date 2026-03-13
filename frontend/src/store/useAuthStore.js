import { create } from 'zustand'

function getStoredUser() {
  try {
    const rawUser = localStorage.getItem('user')
    return rawUser ? JSON.parse(rawUser) : null
  } catch {
    localStorage.removeItem('user')
    return null
  }
}

function getStoredToken() {
  const token = localStorage.getItem('token')
  return token || null
}

const useAuthStore = create((set) => ({
  user: getStoredUser(),
  token: getStoredToken(),

  login: (user, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },
}))

export default useAuthStore
