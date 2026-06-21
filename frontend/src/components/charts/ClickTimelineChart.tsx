import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

import type { TimelinePoint } from '../../api/reelTimeline'

type ClickTimelineChartProps = {
  data: TimelinePoint[]
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

type TooltipPayloadItem = {
  value: number
}

type CustomTooltipProps = {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label ? formatDate(label) : ''}</p>
      <p className="chart-tooltip__value">
        {payload[0].value} click{payload[0].value !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

export default function ClickTimelineChart({ data }: ClickTimelineChartProps) {
  if (data.length === 0) {
    return (
      <div className="chart-empty">
        No tracking data available yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart
        data={data}
        margin={{ top: 8, right: 16, left: -8, bottom: 0 }}
      >
        <defs>
          <linearGradient id="timelineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-alt)" />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />

        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          dy={6}
        />

        <YAxis
          allowDecimals={false}
          tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={28}
        />

        <Tooltip
          content={<CustomTooltip />}
          cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1 }}
        />

        <Line
          type="monotone"
          dataKey="clicks"
          stroke="url(#timelineGradient)"
          strokeWidth={2.5}
          dot={{ fill: 'var(--accent)', strokeWidth: 0, r: 3 }}
          activeDot={{ fill: 'var(--accent-alt)', strokeWidth: 0, r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
