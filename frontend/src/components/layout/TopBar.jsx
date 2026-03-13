import { useLocation, useNavigate } from 'react-router-dom'
import { Bell, TrendingDown, Target, Brain, CheckCircle, AlertTriangle, X, User, LogOut, Settings, Sun, Moon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import useAuthStore from '../../store/useAuthStore'
import useThemeStore from '../../store/useThemeStore'

const titles = {
  '/dashboard':    'Dashboard',
  '/ai-advisor':   'AI Advisor',
  '/expenses':     'Expense Tracker',
  '/budget':       'Budget Planner',
  '/smart-budget': 'Smart Budgeting Assistant',
  '/savings':      'Savings Goals',
  '/explore':      'Explore AI Tools',
}

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'alert',
    icon: AlertTriangle,
    iconColor: '#F59E0B',
    iconBg: 'rgba(245,158,11,0.12)',
    title: 'Budget Alert: Food',
    desc: 'You have used 85% of your Food budget this month.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'expense',
    icon: TrendingDown,
    iconColor: '#F43F5E',
    iconBg: 'rgba(244,63,94,0.12)',
    title: 'New Expense Added',
    desc: 'Groceries — ₹120 logged under Food.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 3,
    type: 'goal',
    icon: Target,
    iconColor: '#22C55E',
    iconBg: 'rgba(34,197,94,0.12)',
    title: 'Goal Milestone',
    desc: "Emergency Fund is 44% complete. You're on track! 🎯",
    time: '3 hr ago',
    read: false,
  },
  {
    id: 4,
    type: 'ai',
    icon: Brain,
    iconColor: '#7C3AED',
    iconBg: 'rgba(124,58,237,0.12)',
    title: 'AI Insight Ready',
    desc: 'Cook 2 more meals at home this week to save ₹200 this month.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 5,
    type: 'success',
    icon: CheckCircle,
    iconColor: '#06B6D4',
    iconBg: 'rgba(6,182,212,0.12)',
    title: 'Monthly Summary',
    desc: 'Spending is down 12% vs last month. Great work! 🚀',
    time: '2 days ago',
    read: true,
  },
]

export default function TopBar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const panelRef = useRef(null)
  const profileRef = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Close notification panel on outside click
  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Close profile panel on outside click
  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    if (profileOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [profileOpen])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function toggleOpen() {
    setOpen((v) => !v)
    // Mark all as read when opening
    if (!open) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }
  }

  function dismiss(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <header className="flex items-center justify-between px-8 py-5" style={{ borderBottom: '1px solid var(--topbar-border)' }}>
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--body-text)' }}>{titles[pathname] || 'MoneyBuddy'}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative" ref={panelRef}>
          <button
            onClick={toggleOpen}
            className="relative w-10 h-10 rounded-xl glass-card flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #3B82F6)' }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {open && (
            <div
              className="absolute right-0 top-12 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
              style={{
                background: 'var(--dropdown-bg)',
                border: '1px solid var(--dropdown-border)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--divider)' }}>
                <span className="text-sm font-semibold text-slate-200">Notifications</span>
                {notifications.length > 0 && (
                  <button
                    onClick={() => setNotifications([])}
                    className="text-[11px] text-slate-500 hover:text-primary transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <CheckCircle size={28} className="mx-auto mb-2 text-slate-600" />
                    <p className="text-xs text-slate-500">All caught up!</p>
                  </div>
                ) : (
                  notifications.map(({ id, icon: Icon, iconColor, iconBg, title, desc, time, read }) => (
                    <div
                      key={id}
                      className="flex items-start gap-3 px-4 py-3 transition-colors group" style={{ borderBottom: '1px solid var(--divider)' }}
                      style={{ opacity: read ? 0.7 : 1 }}
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: iconBg }}>
                        <Icon size={14} style={{ color: iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-200 leading-tight">{title}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
                        <p className="text-[10px] text-slate-600 mt-1">{time}</p>
                      </div>
                      <button
                        onClick={() => dismiss(id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-slate-400 flex-shrink-0"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl glass-card flex items-center justify-center transition-all duration-300 hover:scale-110"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark'
            ? <Sun size={17} className="text-amber-400" />
            : <Moon size={17} className="text-primary" />}
        </button>

        {/* Profile Button */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
          >
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 top-12 w-64 rounded-2xl shadow-2xl z-50 overflow-hidden"
              style={{
                background: 'var(--dropdown-bg)',
                border: '1px solid var(--dropdown-border)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}
            >
              {/* User info header */}
              <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--divider)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-100 truncate">{user?.name || 'User'}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email || ''}</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-2">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-slate-100 transition-colors"
                >
                  <User size={15} className="text-slate-500" />
                  My Profile
                </button>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-slate-100 transition-colors"
                >
                  <Settings size={15} className="text-slate-500" />
                  Settings
                </button>
              </div>

              {/* Logout */}
              <div className="py-2" style={{ borderTop: '1px solid var(--divider)' }}>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
