import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, TrendingUp, Shield, Brain, ArrowRight, Star, Target, BarChart3 } from 'lucide-react'

const features = [
  { icon: Brain, title: 'AI Financial Advisor', desc: 'Get personalized advice powered by GPT-4. Ask anything — from budgeting tips to investment basics.' },
  { icon: TrendingUp, title: 'Smart Analytics', desc: 'Interactive charts and real-time insights that show exactly where your money goes each month.' },
  { icon: Target, title: 'Savings Goals', desc: 'Set financial goals, track your progress, and get AI tips to reach them faster than you thought possible.' },
  { icon: Shield, title: 'Budget Protection', desc: "Set spending limits per category and get instant alerts before you blow your budget." },
]

const steps = [
  { step: '01', title: 'Create Your Account', desc: 'Sign up in 30 seconds. No credit card required. Start tracking instantly.' },
  { step: '02', title: 'Log Your Spending', desc: 'Add income and expenses by category. FinPilot builds a clear picture of your finances.' },
  { step: '03', title: 'Get AI Insights', desc: 'Your AI co-pilot analyzes the data and gives you actionable advice, 24/7.' },
]

const testimonials = [
  { name: 'Sarah K.', role: 'Computer Science Student', quote: "FinPilot helped me save $300 this month just by showing where I was overspending. The AI advice is genuinely useful!", rating: 5 },
  { name: 'Marcus T.', role: 'Recent Graduate', quote: "Finally an app that actually understands my budget. The AI advisor answered questions my bank never could.", rating: 5 },
  { name: 'Priya M.', role: 'Young Professional', quote: "The dashboard is beautiful and the budget planner is incredibly powerful. I'm in total control of my money now.", rating: 5 },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-slate-100 overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 glass-card rounded-none border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/30">
            <Zap size={15} className="text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">FinPilot</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm py-2 px-4">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-8 text-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-24 left-1/3 w-96 h-96 bg-primary/6 rounded-full blur-3xl" />
          <div className="absolute top-48 right-1/4 w-80 h-80 bg-secondary/6 rounded-full blur-3xl" />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <Zap size={11} /> AI-Powered Finance for Students &amp; Professionals
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Your AI<br />
            <span className="gradient-text">Financial Co-Pilot</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Track spending, plan budgets, and get personalized AI advice — all in one sleek dashboard built for the next generation of smart spenders.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn-primary text-base px-8 py-4">
              Start Managing Money <ArrowRight size={17} />
            </Link>
            <Link to="/login" className="btn-ghost text-base px-8 py-4">
              Try AI Advisor
            </Link>
          </div>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          className="flex items-center justify-center gap-10 mt-20 flex-wrap"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.7 }}
        >
          {[
            ['$2.4M+', 'Tracked monthly'],
            ['50K+', 'Students saving'],
            ['94%', 'Smarter decisions'],
            ['4.9 ★', 'Average rating'],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-black gradient-text">{val}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Everything you need to <span className="gradient-text">master your money</span>
            </h2>
            <p className="text-slate-400">Powerful tools, beautifully designed for your financial journey.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                className="glass-card p-6 hover:border-primary/25 transition-all duration-300 cursor-default"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center mb-4">
                  <Icon size={22} className="text-primary" />
                </div>
                <h3 className="font-bold text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-8" style={{ background: 'rgba(15,23,42,0.4)' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            Get started in <span className="gradient-text">3 simple steps</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="text-5xl font-black gradient-text mb-4 opacity-25">{step}</div>
                <h3 className="font-bold text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Loved by <span className="gradient-text">students &amp; professionals</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, quote, rating }, i) => (
              <motion.div
                key={name}
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex mb-3">
                  {Array.from({ length: rating }).map((_, j) => (
                    <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">"{quote}"</p>
                <div>
                  <p className="font-semibold text-slate-100 text-sm">{name}</p>
                  <p className="text-xs text-slate-500">{role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-8 text-center">
        <motion.div
          className="glass-card max-w-2xl mx-auto p-14 border border-primary/20"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(20,184,166,0.07) 100%)' }}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <BarChart3 size={36} className="text-primary mx-auto mb-4 opacity-70" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to take <span className="gradient-text">financial control?</span>
          </h2>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            Join thousands of students already making smarter financial decisions with FinPilot.
          </p>
          <Link to="/register" className="btn-primary text-base px-10 py-4">
            Start for Free <ArrowRight size={17} />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-8 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Zap size={11} className="text-white" />
          </div>
          <span className="font-bold gradient-text">FinPilot</span>
        </div>
        <p className="text-xs text-slate-600">© 2026 FinPilot — Built at Hackathon 🚀</p>
      </footer>
    </div>
  )
}
