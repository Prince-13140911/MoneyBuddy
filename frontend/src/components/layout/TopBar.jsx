import { useLocation } from 'react-router-dom'
import { Bell } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'

const titles = {
  '/dashboard': 'Dashboard',
  '/ai-advisor': 'AI Advisor',
  '/expenses': 'Expense Tracker',
  '/budget': 'Budget Planner',
  '/savings': 'Savings Goals',
}

export default function TopBar() {
  const { pathname } = useLocation()
  const user = useAuthStore((s) => s.user)

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-white/5">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">{titles[pathname] || 'FinPilot'}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
          <Bell size={17} />
        </button>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}
