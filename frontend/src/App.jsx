import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/useAuthStore'
import AppLayout from './components/layout/AppLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AIAdvisor from './pages/AIAdvisor'
import ExpenseTracker from './pages/ExpenseTracker'
import BudgetPlanner from './pages/BudgetPlanner'
import SavingsGoals from './pages/SavingsGoals'

function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-advisor" element={<AIAdvisor />} />
        <Route path="/expenses" element={<ExpenseTracker />} />
        <Route path="/budget" element={<BudgetPlanner />} />
        <Route path="/savings" element={<SavingsGoals />} />
      </Route>
    </Routes>
  )
}
