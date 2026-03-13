import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerUser, demoLogin } from '../services/authService'
import useAuthStore from '../store/useAuthStore'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const res = await registerUser(form)
      login(res.data.data.user, res.data.data.token)
      toast.success(`Welcome to MoneyBuddy, ${res.data.data.user.name}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    try {
      const res = await demoLogin()
      login(res.data.data.user, res.data.data.token)
      toast.success('👋 Welcome to the demo!')
      navigate('/dashboard')
    } catch {
      toast.error('Demo login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-primary/6 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-secondary/6 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="glass-card w-full max-w-md p-8 border border-primary/15"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Zap size={15} className="text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">MoneyBuddy</span>
        </Link>

        <h2 className="text-2xl font-bold text-slate-100 mb-1">Create your account</h2>
        <p className="text-slate-400 text-sm mb-8">Start your journey to smarter finances</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-field input-field-icon"
                placeholder="Your name"
                required
              />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field input-field-icon"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field input-field-icon"
                placeholder="Min. 6 characters"
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 mt-2">
            {loading ? 'Creating account...' : <><span>Create Account</span><ArrowRight size={15} /></>}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: 'var(--divider)' }} />
          </div>
          <div className="relative flex justify-center">
            <span className="px-3 text-xs text-slate-500" style={{ background: 'var(--glass-bg)' }}>or</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(20,184,166,0.15))', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}
        >
          <Sparkles size={15} />
          Demo Login — no sign up needed
        </button>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
