import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Bot, Receipt, PieChart, Target, LogOut, Zap } from 'lucide-react'
import useAuthStore from '../../store/useAuthStore'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/ai-advisor', icon: Bot, label: 'AI Advisor' },
  { to: '/expenses', icon: Receipt, label: 'Expenses' },
  { to: '/budget', icon: PieChart, label: 'Budget' },
  { to: '/savings', icon: Target, label: 'Savings' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col glass-card rounded-none border-r border-white/5 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
          <Zap size={18} className="text-white" />
        </div>
        <span className="text-xl font-bold gradient-text">FinPilot</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-primary/15 text-primary border border-primary/20'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-primary' : ''} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-medium"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
