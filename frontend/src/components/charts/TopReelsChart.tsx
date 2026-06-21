import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { DashboardReelSummary } from '../../api/dashboard'

type TopReelsChartProps = {
  reels: DashboardReelSummary[]
}

type ChartEntry = {
  name: string
  clicks: number
}

type TooltipPayload = {
  name: string
  value: number
  color: string
}

type CustomTooltipProps = {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="card" style={{ padding: 'var(--space-3) var(--space-4)', minWidth: '140px' }}>
      <p className="section-title" style={{ marginBottom: 'var(--space-1)' }}>{label}</p>
      <p style={{ color: 'var(--accent-text)', fontWeight: 600, margin: 0 }}>
        {payload[0].value.toLocaleString()} clicks
      </p>
    </div>
  )
}

export default function TopReelsChart({ reels }: TopReelsChartProps) {
  if (reels.length === 0) {
    return (
      <div className="card">
        <p className="text-muted">No reels tracked yet.</p>
      </div>
    )
  }

  const data: ChartEntry[] = reels.map((reel) => ({
    name: reel.campaign_name,
    clicks: reel.total_clicks,
  }))

  return (
    <div className="card" style={{ padding: 'var(--space-6)' }}>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
          barCategoryGap="35%"
        >
          <XAxis
            dataKey="name"
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--border)' }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          />
          <Bar
            dataKey="clicks"
            fill="url(#barGradient)"
            radius={[6, 6, 0, 0]}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c026d3" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
