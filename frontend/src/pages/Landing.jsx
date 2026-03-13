import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import {
  Zap, TrendingUp, Shield, Brain, ArrowRight, Star, Target,
  BarChart3, DollarSign, Sparkles, ChevronRight, Bot, Wallet
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    color: 'from-violet-500/20 to-violet-500/5',
    glow: 'rgba(139,92,246,0.35)',
    iconColor: '#8B5CF6',
    title: 'AI Financial Advisor',
    desc: 'Get personalized advice powered by GPT-4. Ask anything — from budgeting tips to investment basics.',
  },
  {
    icon: TrendingUp,
    color: 'from-teal-500/20 to-teal-500/5',
    glow: 'rgba(20,184,166,0.35)',
    iconColor: '#14B8A6',
    title: 'Smart Analytics',
    desc: 'Interactive charts and real-time insights that show exactly where your money goes each month.',
  },
  {
    icon: Target,
    color: 'from-rose-500/20 to-rose-500/5',
    glow: 'rgba(244,63,94,0.35)',
    iconColor: '#F43F5E',
    title: 'Savings Goals',
    desc: 'Set financial goals, track your progress, and get AI tips to reach them faster than ever.',
  },
  {
    icon: Shield,
    color: 'from-indigo-500/20 to-indigo-500/5',
    glow: 'rgba(99,102,241,0.35)',
    iconColor: '#6366F1',
    title: 'Budget Protection',
    desc: 'Set spending limits per category and receive instant alerts before you blow your budget.',
  },
]

const steps = [
  { step: '01', icon: Wallet, title: 'Create Your Account', desc: 'Sign up in 30 seconds. No credit card required. Start tracking instantly.' },
  { step: '02', icon: BarChart3, title: 'Log Your Spending', desc: 'Add income and expenses by category. MoneyBuddy builds a clear picture of your finances.' },
  { step: '03', icon: Bot, title: 'Get AI Insights', desc: 'Your AI co-pilot analyzes the data and gives you actionable advice, 24/7.' },
]

const testimonials = [
  { name: 'Sarah K.', role: 'CS Student', initials: 'SK', color: '#6366F1', quote: "MoneyBuddy helped me save ₹300 this month just by showing where I was overspending. The AI advice is genuinely useful!", rating: 5 },
  { name: 'Marcus T.', role: 'Recent Graduate', initials: 'MT', color: '#14B8A6', quote: "Finally an app that actually understands my budget. The AI advisor answered questions my bank never could.", rating: 5 },
  { name: 'Priya M.', role: 'Young Professional', initials: 'PM', color: '#F43F5E', quote: "The dashboard is beautiful and the budget planner is incredibly powerful. I'm in total control of my money now.", rating: 5 },
]

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

function MockDashboard() {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0 select-none" style={{ perspective: '900px' }}>
      <motion.div
        className="shimmer-card p-5 float-anim"
        style={{ transform: 'rotateY(-6deg) rotateX(4deg)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366F1,#14B8A6)' }}>
              <Zap size={11} className="text-white" />
            </div>
            <span className="text-xs font-bold text-slate-300">MoneyBuddy</span>
          </div>
          <span className="text-[10px] bg-teal-500/15 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20">Live</span>
        </div>

        <p className="text-[10px] text-slate-500 mb-1">Total Balance</p>
        <p className="text-2xl font-black text-slate-100 mb-1" style={{ fontVariantNumeric: 'tabular-nums' }}>₹12,480<span className="text-sm text-slate-500">.50</span></p>
        <p className="text-[10px] text-teal-400 flex items-center gap-1 mb-4"><TrendingUp size={10} /> +₹340 this month</p>

        <div className="flex items-end gap-1.5 h-14 mb-4">
          {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-sm"
              style={{ background: i === 5 ? 'linear-gradient(to top, #6366F1, #14B8A6)' : 'rgba(99,102,241,0.2)', height: `${h}%` }}
              initial={{ scaleY: 0, originY: 1 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.4 + i * 0.07, duration: 0.5, ease: 'easeOut' }}
            />
          ))}
        </div>

        <div className="flex gap-3 mb-4 flex-wrap">
          {[['Food', '#F43F5E', 42], ['Travel', '#6366F1', 28], ['Health', '#14B8A6', 30]].map(([label, color, pct]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
              <span className="text-[10px] text-slate-400">{label} {pct}%</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl p-2.5 flex items-start gap-2" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg,#6366F1,#14B8A6)' }}>
            <Bot size={10} className="text-white" />
          </div>
          <p className="text-[10px] text-slate-300 leading-relaxed">You spend 30% more on dining. Cook at home 3×/week to save ₹120/month. 🍳</p>
        </div>
      </motion.div>

      <motion.div
        className="absolute -top-4 -right-4 shimmer-card px-3 py-2 flex items-center gap-2 float-anim-delayed"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.4 }}
      >
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)' }}>
          <TrendingUp size={12} className="text-green-400" />
        </div>
        <div>
          <p className="text-[9px] text-slate-500">Savings Rate</p>
          <p className="text-xs font-bold text-green-400">+22%</p>
        </div>
      </motion.div>

      <motion.div
        className="absolute -bottom-4 -left-4 shimmer-card px-3 py-2 flex items-center gap-2 float-anim-slow"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
      >
        <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(20,184,166,0.15)', border: '1px solid rgba(20,184,166,0.25)' }}>
          <Target size={12} className="text-teal-400" />
        </div>
        <div>
          <p className="text-[9px] text-slate-500">Vacation Goal</p>
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1 rounded-full bg-slate-700 overflow-hidden">
              <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg,#6366F1,#14B8A6)' }} initial={{ width: 0 }} animate={{ width: '68%' }} transition={{ delay: 1.5, duration: 0.8 }} />
            </div>
            <p className="text-[9px] font-bold text-teal-400">68%</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Landing() {
  const featuresRef = useRef(null)
  const featuresInView = useInView(featuresRef, { once: true, margin: '-80px' })

  return (
    <div className="min-h-screen bg-background text-slate-100 overflow-x-hidden">

      {/* animated background */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="orb orb-1 w-[600px] h-[600px] -top-32 -left-32" />
        <div className="orb orb-2 w-[500px] h-[500px] top-1/3 right-0" style={{ animationDelay: '2s' }} />
        <div className="orb orb-3 w-[400px] h-[400px] bottom-0 left-1/3" style={{ animationDelay: '4s' }} />
      </div>

      {/* nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--topbar-border)' }}>
        <motion.div className="flex items-center gap-2.5" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#6366F1,#14B8A6)', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
            <Zap size={15} className="text-white" />
          </div>
          <span className="text-lg font-extrabold gradient-text tracking-tight">MoneyBuddy</span>
        </motion.div>
        <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/login" className="btn-ghost text-sm py-2 px-4">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm py-2 px-5 flex items-center gap-1.5">
            Get Started <Sparkles size={13} />
          </Link>
        </motion.div>
      </nav>

      {/* hero */}
      <section className="relative pt-32 pb-24 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-300">AI-Powered · Built for Gen Z &amp; Millennials</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black leading-[1.08] tracking-tight mb-6">
                Your Personal<br />
                <span style={{ background: 'linear-gradient(135deg,#6366F1 20%,#14B8A6 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  AI Co-Pilot
                </span><br />
                for Money
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-lg">
                Track spending, crush budgets, and get real-time AI financial advice —
                all in one sleek dashboard built for the next generation of smart spenders.
              </p>

              <div className="flex items-center gap-4 flex-wrap mb-12">
                <Link to="/register" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2"
                  style={{ boxShadow: '0 0 30px rgba(99,102,241,0.35)' }}>
                  Start for Free <ArrowRight size={17} />
                </Link>
                <Link to="/login" className="btn-ghost text-base px-8 py-3.5 flex items-center gap-2">
                  See Dashboard <ChevronRight size={17} />
                </Link>
              </div>

              <div className="flex items-center gap-1.5">
                {['SK','MT','PM','JL','AR'].map((initials, i) => (
                  <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-background"
                    style={{ background: `hsl(${i * 60 + 220},60%,50%)`, marginLeft: i === 0 ? 0 : -8 }}>
                    {initials}
                  </div>
                ))}
                <div className="ml-3">
                  <div className="flex items-center gap-1">
                    {Array.from({length:5}).map((_,i) => <Star key={i} size={11} className="text-amber-400 fill-amber-400" />)}
                    <span className="text-xs font-bold text-slate-200 ml-1">4.9</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Loved by 50K+ students</p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <MockDashboard />
          </motion.div>
        </div>
      </section>

      {/* stats ribbon */}
      <section className="relative py-10 px-8">
        <motion.div
          className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden"
          style={{ background: 'var(--stats-bg)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}
          initial="hidden" whileInView="visible" variants={stagger} viewport={{ once: true }}
        >
          {[
            { val: '₹2.4M+', label: 'Tracked monthly' },
            { val: '50K+',   label: 'Students saving' },
            { val: '94%',    label: 'Smarter decisions' },
            { val: '4.9★',   label: 'App rating' },
          ].map(({ val, label }) => (
            <motion.div key={label} variants={fadeUp} className="text-center py-7 px-4">
              <p className="text-2xl md:text-3xl font-black stat-glow mb-1"
                style={{ background: 'linear-gradient(135deg,#6366F1,#14B8A6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {val}
              </p>
              <p className="text-xs text-slate-500">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* features */}
      <section className="relative py-28 px-8" ref={featuresRef}>
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" animate={featuresInView ? 'visible' : 'hidden'} variants={fadeUp}>
            <span className="text-xs font-bold text-primary tracking-widest uppercase mb-3 block">Core Features</span>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Everything you need to <span className="gradient-text">master your money</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">Powerful tools, beautifully designed for every stage of your financial journey.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map(({ icon: Icon, color, glow, iconColor, title, desc }, i) => (
              <motion.div
                key={title}
                className="shimmer-card card-shine p-6 group cursor-default"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110`}
                  style={{ boxShadow: `0 0 20px ${glow}` }}>
                  <Icon size={22} style={{ color: iconColor }} />
                </div>
                <h3 className="font-bold text-slate-100 mb-2 text-base">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: iconColor }}>
                  Learn more <ChevronRight size={13} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="relative py-28 px-8" style={{ background: 'var(--section-alt-bg)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16">
            <span className="text-xs font-bold text-secondary tracking-widest uppercase mb-3 block">How it works</span>
            <h2 className="text-3xl md:text-4xl font-black">
              Up and running in <span className="gradient-text">3 simple steps</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {steps.map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div
                key={step}
                className="relative"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5"
                  style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(20,184,166,0.2))', border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 0 25px rgba(99,102,241,0.2)' }}>
                  <Icon size={20} className="text-primary" />
                </div>
                <p className="text-5xl font-black mb-2"
                  style={{ background: 'linear-gradient(135deg,#6366F1,#14B8A6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: 0.2 }}>
                  {step}
                </p>
                <h3 className="font-bold text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* testimonials */}
      <section className="relative py-28 px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <span className="text-xs font-bold text-primary tracking-widest uppercase mb-3 block">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-black">
              Loved by <span className="gradient-text">students &amp; professionals</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, initials, color, quote, rating }, i) => (
              <motion.div
                key={name}
                className="shimmer-card card-shine p-6"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                style={{ borderLeft: `2px solid ${color}` }}
              >
                <div className="flex mb-4">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-5 italic">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}>
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100 text-sm">{name}</p>
                    <p className="text-xs text-slate-500">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center shimmer-card p-16 overflow-hidden relative"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(20,184,166,0.08) 100%)' }}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute top-8 left-8 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25), transparent)' }} />
          <div className="absolute bottom-8 right-8 w-20 h-20 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.2), transparent)' }} />

          <div className="relative">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'linear-gradient(135deg,#6366F1,#14B8A6)', boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
              <Sparkles size={24} className="text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Ready to take <span className="gradient-text">financial control?</span>
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
              Join 50,000+ students already making smarter financial decisions. Free forever.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/register" className="btn-primary text-base px-10 py-4 flex items-center gap-2"
                style={{ boxShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
                Get Started Free <ArrowRight size={17} />
              </Link>
              <Link to="/login" className="btn-ghost text-base px-8 py-4">Sign In</Link>
            </div>
            <p className="text-xs text-slate-600 mt-6">No credit card required · Built with ❤️ at Hackathon</p>
          </div>
        </motion.div>
      </section>

      {/* footer */}
      <footer className="relative px-8 py-10" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#6366F1,#14B8A6)' }}>
              <Zap size={12} className="text-white" />
            </div>
            <span className="font-bold gradient-text">MoneyBuddy</span>
          </div>
          <p className="text-xs text-slate-600">© 2026 MoneyBuddy — AI Finance for Everyone 🚀</p>
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <Link to="/login" className="hover:text-slate-400 neon-underline transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-slate-400 neon-underline transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
