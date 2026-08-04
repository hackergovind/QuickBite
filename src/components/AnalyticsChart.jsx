import React from 'react'

// Simple SVG bar chart — no external library needed
export function BarChart({ data, title, valuePrefix = '', valueSuffix = '', color = '#F97316', height = 200 }) {
  const max = Math.max(...data.map(d => d.value), 1)

  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl p-5 border border-gray-100 dark:border-dark-700">
      {title && <h3 className="font-bold text-dark-900 dark:text-white mb-5 text-sm">{title}</h3>}
      <div className="flex items-end gap-2" style={{ height }}>
        {data.map((d, i) => {
          const pct = (d.value / max) * 100
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full flex items-end" style={{ height: height - 40 }}>
                <div
                  className="w-full rounded-t-lg transition-all duration-700 cursor-pointer group-hover:opacity-80"
                  style={{ height: `${pct}%`, background: d.color || color, minHeight: 4 }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-dark-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {valuePrefix}{d.value}{valueSuffix}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center leading-tight" style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {d.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Simple SVG line chart
export function LineChart({ data, title, color = '#F97316' }) {
  if (!data || data.length < 2) return null
  const values = data.map(d => d.value)
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  const W = 400
  const H = 120
  const pad = 20
  const step = (W - pad * 2) / (data.length - 1)

  const points = data.map((d, i) => ({
    x: pad + i * step,
    y: H - pad - ((d.value - min) / range) * (H - pad * 2),
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${pathD} L ${points[points.length - 1].x} ${H - pad} L ${points[0].x} ${H - pad} Z`

  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl p-5 border border-gray-100 dark:border-dark-700">
      {title && <h3 className="font-bold text-dark-900 dark:text-white mb-4 text-sm">{title}</h3>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#lineGrad)" />
        <path d={pathD} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill={color} className="cursor-pointer">
            <title>{data[i].label}: {data[i].value}</title>
          </circle>
        ))}
      </svg>
      <div className="flex justify-between mt-2">
        {data.map((d, i) => (
          <span key={i} className="text-xs text-gray-400 dark:text-gray-500">{d.label}</span>
        ))}
      </div>
    </div>
  )
}

// Stats card
export function StatCard({ label, value, sub, icon, color = 'primary', trend }) {
  const colors = {
    primary: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  }

  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl p-5 border border-gray-100 dark:border-dark-700">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colors[color]}`}>{icon}</div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend > 0 ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-dark-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </div>
  )
}
