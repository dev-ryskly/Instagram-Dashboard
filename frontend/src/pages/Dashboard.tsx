import { useEffect, useState } from 'react'

import { getDashboardV2 } from '../api/dashboardV2'
import type { DashboardV2Response, ReelDashboardItem } from '../api/dashboardV2'
import StatCard from '../components/dashboard/StatCard'

const MEDIA_TYPE_LABELS: Record<string, string> = {
  REELS: 'Reel',
  VIDEO: 'Video',
  IMAGE: 'Image',
  CAROUSEL_ALBUM: 'Carousel',
}

function ReelRow({ reel }: { reel: ReelDashboardItem }) {
  const conversionRateDisplay = `${(reel.conversion_rate * 100).toFixed(2)}%`
  const mediaLabel = MEDIA_TYPE_LABELS[reel.media_type] ?? reel.media_type

  return (
    <div className="reel-row">
      {/* Thumbnail */}
      <div className="reel-row__thumb-wrap">
        {reel.thumbnail_url ? (
          <img
            className="reel-row__thumb"
            src={reel.thumbnail_url}
            alt={reel.caption ?? 'Reel'}
            loading="lazy"
          />
        ) : (
          <div className="reel-row__thumb-placeholder">▶</div>
        )}
      </div>

      {/* Caption + type */}
      <div className="reel-row__info">
        <p className="reel-row__caption">
          {reel.caption ?? <span className="text-muted">No caption</span>}
        </p>
        <span className="badge badge-purple">{mediaLabel}</span>
      </div>

      {/* Instagram metrics */}
      <div className="reel-row__metric">
        <span className="reel-row__metric-label">Views</span>
        <span className="reel-row__metric-value">{reel.views.toLocaleString()}</span>
      </div>

      <div className="reel-row__metric">
        <span className="reel-row__metric-label">Likes</span>
        <span className="reel-row__metric-value">{reel.likes.toLocaleString()}</span>
      </div>

      {/* Tracking metrics */}
      <div className="reel-row__metric">
        <span className="reel-row__metric-label">Clicks</span>
        <span className="reel-row__metric-value reel-row__metric-value--accent">
          {reel.click_count.toLocaleString()}
        </span>
      </div>

      <div className="reel-row__metric">
        <span className="reel-row__metric-label">Conversions</span>
        <span className="reel-row__metric-value reel-row__metric-value--accent">
          {reel.conversion_count.toLocaleString()}
        </span>
      </div>

      <div className="reel-row__metric">
        <span className="reel-row__metric-label">Conv. Rate</span>
        <span className="reel-row__metric-value reel-row__metric-value--success">
          {conversionRateDisplay}
        </span>
      </div>

      {/* Tracking status */}
      <div className="reel-row__tracking">
        {reel.has_tracking ? (
          <span className="badge badge-success">🟢 Tracking Enabled</span>
        ) : (
          <span className="badge badge-muted">⚪ Tracking Disabled</span>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardV2Response | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDashboardV2()
      .then(setDashboard)
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="page">
        <p className="text-muted">Loading dashboard...</p>
      </div>
    )
  }

  if (error || !dashboard) {
    return (
      <div className="page">
        <div className="error-banner">{error ?? 'Failed to load dashboard'}</div>
      </div>
    )
  }

  const conversionRateDisplay = `${(dashboard.conversion_rate * 100).toFixed(2)}%`

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Real Instagram reel performance</p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="page-section">
        <p className="section-title">Overview</p>
        <div className="grid grid-cols-4">
          <StatCard
            label="Total Reels"
            value={dashboard.total_reels.toLocaleString()}
          />
          <StatCard
            label="Total Clicks"
            value={dashboard.total_clicks.toLocaleString()}
          />
          <StatCard
            label="Total Conversions"
            value={dashboard.total_conversions.toLocaleString()}
          />
          <StatCard
            label="Conversion Rate"
            value={conversionRateDisplay}
            sublabel="Conversions per click"
          />
        </div>
      </div>

      <div className="divider" />

      {/* Reels list */}
      <div className="page-section">
        <p className="section-title">All Reels</p>

        {dashboard.reels.length === 0 ? (
          <div className="card">
            <p className="text-muted">No Instagram reels found.</p>
          </div>
        ) : (
          <div className="reel-list">
            {/* Header row */}
            <div className="reel-row reel-row--header">
              <div className="reel-row__thumb-wrap" />
              <div className="reel-row__info">
                <span className="reel-row__header-label">Content</span>
              </div>
              <div className="reel-row__metric">
                <span className="reel-row__header-label">Views</span>
              </div>
              <div className="reel-row__metric">
                <span className="reel-row__header-label">Likes</span>
              </div>
              <div className="reel-row__metric">
                <span className="reel-row__header-label">Clicks</span>
              </div>
              <div className="reel-row__metric">
                <span className="reel-row__header-label">Conv.</span>
              </div>
              <div className="reel-row__metric">
                <span className="reel-row__header-label">Rate</span>
              </div>
              <div className="reel-row__tracking">
                <span className="reel-row__header-label">Tracking</span>
              </div>
            </div>

            {dashboard.reels.map((reel) => (
              <ReelRow key={reel.reel_id} reel={reel} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
