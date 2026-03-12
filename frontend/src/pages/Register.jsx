import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, User, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerUser } from '../services/authService'
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
      toast.success(`Welcome to FinPilot, ${res.data.data.user.name}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
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
          <span className="text-lg font-bold gradient-text">FinPilot</span>
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
                className="input-field pl-9"
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
                className="input-field pl-9"
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
                className="input-field pl-9"
                placeholder="Min. 6 characters"
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 mt-2">
            {loading ? 'Creating account...' : <><span>Create Account</span><ArrowRight size={15} /></>}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
