import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Bot, Receipt, PieChart, Target, LogOut, Zap, Sparkles,
  Brain, Wallet, ChevronDown, TrendingUp, Heart, BookOpen, BarChart3,
  Compass, Star, DollarSign,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import useAuthStore from '../../store/useAuthStore'

const GROUPS = [
  {
    id: 'finance',
    label: 'Finance',
    color: '#F59E0B',
    items: [
      { to: '/expenses',     icon: Receipt,  label: 'Expenses',     color: '#F43F5E' },
      { to: '/budget',       icon: PieChart, label: 'Budget',       color: '#F59E0B' },
      { to: '/smart-budget', icon: Brain,    label: 'Smart Budget', color: '#8B5CF6', badge: 'NEW' },
    ],
  },
  {
    id: 'ai',
    label: 'AI Tools',
    color: '#14B8A6',
    items: [
      { to: '/ai-advisor',        icon: Bot,        label: 'AI Advisor',          color: '#14B8A6', badge: 'AI' },
      { to: '/ai-spending',       icon: Brain,      label: 'Spending Analysis',   color: '#6366F1', badge: 'NEW' },
      { to: '/simulator',         icon: TrendingUp, label: 'Future Simulator',    color: '#06B6D4', badge: 'NEW' },
      { to: '/investment-journey',icon: DollarSign, label: 'Investment Journey',  color: '#10B981', badge: 'NEW' },
    ],
  },
  {
    id: 'goals',
    label: 'Goals',
    color: '#22C55E',
    items: [
      { to: '/savings', icon: Target, label: 'Savings Goals',  color: '#22C55E' },
      { to: '/explore', icon: Star,   label: 'Explore All',    color: '#F59E0B' },
    ],
  },
  {
    id: 'more',
    label: 'More Tools',
    color: '#6366F1',
    items: [
      { to: '/weekly-reports',  icon: BarChart3, label: 'Weekly Reports',         color: '#6366F1', badge: 'NEW' },
      { to: '/financial-health',icon: Heart,     label: 'Financial Health Score', color: '#F43F5E', badge: 'AI' },
      { to: '/learning-hub',    icon: BookOpen,  label: 'Learning Hub',           color: '#8B5CF6', badge: 'NEW' },
    ],
  },
]

function NavItem({ to, icon: Icon, label, color, badge }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 relative ${
          isActive ? 'text-slate-100' : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="activeNav"
              className="absolute inset-0 rounded-xl"
              style={{ background: `linear-gradient(135deg, ${color}22, ${color}10)`, border: `1px solid ${color}35` }}
              transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
            />
          )}
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
              style={{ background: `linear-gradient(to bottom, ${color}, ${color}80)`, boxShadow: `0 0 8px ${color}` }} />
          )}
          <div className="relative flex items-center gap-3 w-full">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: isActive ? `${color}20` : 'transparent' }}>
              <Icon size={14} style={{ color: isActive ? color : undefined }} />
            </div>
            <span className="flex-1 truncate">{label}</span>
            {badge && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background: `${color}25`, color, border: `1px solid ${color}40` }}>
                {badge}
              </span>
            )}
          </div>
        </>
      )}
    </NavLink>
  )
}

function NavGroup({ group, defaultOpen = false }) {
  const { pathname } = useLocation()
  const hasActive = group.items.some((i) => i.to === pathname)
  const [open, setOpen] = useState(defaultOpen || hasActive)

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-white/3 group"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-500 flex-1 text-left">
          {group.label}
        </span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={12} className="text-slate-600" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-0.5 space-y-0.5 pl-1">
              {group.items.map((item) => (
                <NavItem key={item.label} {...item} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col z-50"
      style={{ background: 'var(--sidebar-bg)', backdropFilter: 'blur(20px)', borderRight: '1px solid var(--sidebar-border)' }}>

      {/* glow accent at top */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(20,184,166,0.4), transparent)' }} />

      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid var(--divider)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg relative flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#6366F1,#14B8A6)', boxShadow: '0 0 20px rgba(99,102,241,0.45)' }}>
          <Zap size={17} className="text-white" />
          <span className="absolute inset-0 rounded-xl animate-ping opacity-20"
            style={{ background: 'linear-gradient(135deg,#6366F1,#14B8A6)' }} />
        </div>
        <div>
          <span className="text-lg font-extrabold gradient-text tracking-tight">MoneyBuddy</span>
          <p className="text-[10px] text-slate-600 -mt-0.5">AI Finance</p>
        </div>
      </div>

      {/* Scrollable Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-3">

        {/* Dashboard — standalone */}
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" color="#6366F1" />

        <div style={{ borderBottom: '1px solid var(--divider)', marginTop: '8px', marginBottom: '4px' }} />

        {/* Grouped sections */}
        {GROUPS.map((g) => (
          <NavGroup key={g.id} group={g} defaultOpen={g.id === 'finance'} />
        ))}

        <div style={{ borderBottom: '1px solid var(--divider)', marginTop: '4px', marginBottom: '4px' }} />

        {/* Explore AI Tools */}
        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 relative overflow-hidden ${
              isActive ? 'text-white' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(20,184,166,0.15))' }} />
              {isActive && (
                <div className="absolute inset-0 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(20,184,166,0.2))', border: '1px solid rgba(99,102,241,0.4)' }} />
              )}
              <div className="relative w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#6366F1,#14B8A6)' }}>
                <Compass size={13} className="text-white" />
              </div>
              <span className="relative flex-1">Explore AI Tools</span>
              <Sparkles size={12} className="relative text-secondary" />
            </>
          )}
        </NavLink>
      </nav>

      {/* User section */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid var(--divider)' }}>
        <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-xl hover:bg-white/5 transition-colors cursor-default">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#6366F1,#14B8A6)', boxShadow: '0 0 12px rgba(99,102,241,0.35)' }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-medium"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
