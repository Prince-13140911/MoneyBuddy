import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from 'recharts'

const COLORS = ['#6366F1', '#14B8A6', '#F59E0B', '#EC4899', '#EF4444', '#94A3B8']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const i = payload[0].payload.index
    return (
      <div className="rounded-xl px-3 py-2 text-xs shadow-xl"
        style={{ background: 'var(--dropdown-bg)', border: '1px solid var(--border)', color: 'var(--body-text)' }}>
        <p className="font-semibold mb-0.5">{payload[0].name}</p>
        <p style={{ color: COLORS[i % COLORS.length] }} className="font-bold">
          ₹{Number(payload[0].value).toLocaleString('en-IN')}
        </p>
        <p className="text-slate-400 text-[10px]">
          {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%
        </p>
      </div>
    )
  }
  return null
}

const ActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  return (
    <g>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius - 4} outerRadius={outerRadius + 7}
        startAngle={startAngle} endAngle={endAngle} fill={fill}
        style={{ filter: `drop-shadow(0 0 10px ${fill}90)` }} />
    </g>
  )
}

export default function CategoryPieChart({ data, height = 260 }) {
  const [activeIdx, setActiveIdx] = useState(null)

  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        No expenses recorded yet
      </div>
    )
  }

  const total = data.reduce((s, d) => s + d.value, 0)
  const enriched = data.map((d, i) => ({ ...d, index: i, total }))
  const active = activeIdx !== null ? enriched[activeIdx] : null

  return (
    <div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={enriched}
              cx="50%" cy="50%"
              innerRadius={65} outerRadius={95}
              paddingAngle={3}
              dataKey="value"
              activeIndex={activeIdx ?? undefined}
              activeShape={<ActiveShape />}
              onMouseEnter={(_, i) => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
              onClick={(_, i) => setActiveIdx(activeIdx === i ? null : i)}
            >
              {enriched.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent"
                  style={{ cursor: 'pointer' }}
                  opacity={activeIdx !== null && activeIdx !== i ? 0.45 : 1} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingBottom: '4px' }}>
          <div className="text-center">
            {active ? (
              <>
                <p className="text-[10px] text-slate-500 leading-none mb-1">{active.name}</p>
                <p className="text-sm font-black leading-none" style={{ color: COLORS[activeIdx % COLORS.length] }}>
                  ₹{Number(active.value).toLocaleString('en-IN')}
                </p>
                <p className="text-[9px] text-slate-500 mt-0.5">{((active.value / total) * 100).toFixed(0)}%</p>
              </>
            ) : (
              <>
                <p className="text-[10px] text-slate-500 leading-none mb-1">Total</p>
                <p className="text-sm font-black leading-none" style={{ color: 'var(--body-text)' }}>
                  ₹{Number(total).toLocaleString('en-IN')}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-1">
        {enriched.map((d, i) => (
          <button key={d.name}
            className="flex items-center gap-1.5 text-[11px] transition-opacity"
            style={{ opacity: activeIdx !== null && activeIdx !== i ? 0.38 : 1 }}
            onMouseEnter={() => setActiveIdx(i)}
            onMouseLeave={() => setActiveIdx(null)}
            onClick={() => setActiveIdx(activeIdx === i ? null : i)}
          >
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
            <span style={{ color: 'var(--label-text)' }}>{d.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
