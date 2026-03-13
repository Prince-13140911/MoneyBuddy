import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl px-3 py-2 text-xs shadow-xl"
        style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', color: 'var(--body-text)' }}>
        <p className="font-semibold mb-1.5">{label}</p>
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2 mb-0.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.fill }} />
            <span className="text-slate-400">{p.name}:</span>
            <span className="font-bold" style={{ color: p.fill }}>₹{Number(p.value).toLocaleString('en-IN')}</span>
          </div>
        ))}
        {payload.length === 2 && (
          <p className={`text-[10px] mt-1.5 pt-1.5 border-t border-white/10 ${
            payload[1].value > payload[0].value ? 'text-red-400' : 'text-green-400'
          }`}>
            {payload[1].value > payload[0].value
              ? `⚠ Over by ₹${(payload[1].value - payload[0].value).toLocaleString('en-IN')}`
              : `✓ ₹${(payload[0].value - payload[1].value).toLocaleString('en-IN')} remaining`}
          </p>
        )}
      </div>
    )
  }
  return null
}

export default function BudgetBarChart({ data, height = 240 }) {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        No budget data yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
        <XAxis dataKey="category" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false}
          tickFormatter={(v) => v === 0 ? '0' : `₹${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
        <Legend formatter={(v) => <span style={{ color: 'var(--label-text)', fontSize: 11 }}>{v}</span>} />
        <Bar dataKey="budget" name="Budget" fill="#6366F1" radius={[5, 5, 0, 0]} animationDuration={700}>
          {data.map((_, i) => <Cell key={i} fill="rgba(99,102,241,0.65)" />)}
        </Bar>
        <Bar dataKey="spent" name="Spent" radius={[5, 5, 0, 0]} animationDuration={700}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.spent > d.budget ? '#F43F5E' : '#14B8A6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
