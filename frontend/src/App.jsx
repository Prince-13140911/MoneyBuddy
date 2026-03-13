import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import useAuthStore from './store/useAuthStore'
import useThemeStore from './store/useThemeStore'
import AppLayout from './components/layout/AppLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AIAdvisor from './pages/AIAdvisor'
import ExpenseTracker from './pages/ExpenseTracker'
import BudgetPlanner from './pages/BudgetPlanner'
import SavingsGoals from './pages/SavingsGoals'
import SmartBudgetAssistant from './pages/SmartBudgetAssistant'
import ExploreAITools from './pages/ExploreAITools'
import AISpendingAnalysis from './pages/AISpendingAnalysis'
import FinancialSimulator from './pages/FinancialSimulator'
import InvestmentJourney from './pages/InvestmentJourney'

function PrivateRoute({ children }) {
  const token = useAuthStore((s) => s.token)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  const theme = useThemeStore((s) => s.theme)
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

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
        <Route path="/smart-budget" element={<SmartBudgetAssistant />} />
        <Route path="/savings" element={<SavingsGoals />} />
        <Route path="/explore" element={<ExploreAITools />} />
        <Route path="/ai-spending" element={<AISpendingAnalysis />} />
        <Route path="/simulator" element={<FinancialSimulator />} />
        <Route path="/investment-journey" element={<InvestmentJourney />} />
      </Route>
    </Routes>
  )
}
