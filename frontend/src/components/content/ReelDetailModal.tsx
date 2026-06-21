import { useEffect, useState } from 'react'

import type { InstagramContent } from '../../api/content'
import { getReelDetail } from '../../api/reelDetail'
import type { ReelDetail } from '../../api/reelDetail'
import { getReelTimeline } from '../../api/reelTimeline'
import type { TimelinePoint } from '../../api/reelTimeline'
import ClickTimelineChart from '../charts/ClickTimelineChart'
import ReelDetailStat from './ReelDetailStat'
import TrackingManager from './TrackingManager'

type ReelDetailModalProps = {
  item: InstagramContent
  onClose: () => void
}

export default function ReelDetailModal({ item, onClose }: ReelDetailModalProps) {
  const [detail, setDetail] = useState<ReelDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(true)
  const [detailError, setDetailError] = useState<string | null>(null)

  const [timeline, setTimeline] = useState<TimelinePoint[]>([])
  const [timelineLoading, setTimelineLoading] = useState(true)
  const [timelineError, setTimelineError] = useState<string | null>(null)

  // Fetch detail metrics and timeline in parallel
  useEffect(() => {
    getReelDetail(item.id)
      .then(setDetail)
      .catch(() => setDetailError('Could not load reel metrics'))
      .finally(() => setDetailLoading(false))

    getReelTimeline(item.id)
      .then(setTimeline)
      .catch(() => setTimelineError('Could not load click timeline'))
      .finally(() => setTimelineLoading(false))
  }, [item.id])

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const formattedTime = item.timestamp
    ? new Date(item.timestamp).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const conversionRateDisplay = detail
    ? `${(detail.conversion_rate * 100).toFixed(2)}%`
    : null

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Reel detail"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal">

        {/* ── Header ── */}
        <div className="modal__header">
          <h2 className="modal__title">Reel Detail</h2>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ── Body: thumbnail + metrics ── */}
        <div className="modal__body">

          {/* Left — thumbnail */}
          <div>
            {item.thumbnail_url ? (
              <img
                className="modal__thumb"
                src={item.thumbnail_url}
                alt={item.caption ?? 'Reel thumbnail'}
              />
            ) : (
              <div className="modal__thumb-placeholder">▶</div>
            )}
          </div>

          {/* Right — meta + stat grids */}
          <div className="modal__meta">
            <p className="modal__caption">
              {item.caption ?? <span className="text-muted">No caption</span>}
            </p>

            {formattedTime && (
              <time className="modal__time">{formattedTime}</time>
            )}

            <div className="modal__divider" />

            {/* Metrics loading skeleton */}
            {detailLoading && (
              <div className="stat-grid">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="detail-stat">
                    <div className="skeleton" style={{ height: '10px', width: '60%' }} />
                    <div className="skeleton" style={{ height: '22px', width: '80%', marginTop: '4px' }} />
                  </div>
                ))}
              </div>
            )}

            {/* Metrics error */}
            {detailError && !detailLoading && (
              <div className="error-banner">{detailError}</div>
            )}

            {/* Metrics grid */}
            {detail && !detailLoading && (
              <>
                <p className="section-title" style={{ marginBottom: 'var(--space-2)' }}>
                  Instagram Insights
                </p>
                <div className="stat-grid">
                  <ReelDetailStat label="Views"    value={detail.views.toLocaleString()} />
                  <ReelDetailStat label="Reach"    value={detail.reach.toLocaleString()} />
                  <ReelDetailStat label="Likes"    value={detail.likes.toLocaleString()} />
                  <ReelDetailStat label="Comments" value={detail.comments.toLocaleString()} />
                  <ReelDetailStat label="Shares"   value={detail.shares.toLocaleString()} />
                  <ReelDetailStat label="Saves"    value={detail.saves.toLocaleString()} />
                </div>

                <p className="section-title" style={{ margin: 'var(--space-4) 0 var(--space-2)' }}>
                  Tracking
                </p>
                <div className="stat-grid">
                  <ReelDetailStat
                    label="Clicks"
                    value={detail.click_count.toLocaleString()}
                    variant="accent"
                  />
                  <ReelDetailStat
                    label="Conversions"
                    value={detail.conversion_count.toLocaleString()}
                    variant="accent"
                  />
                  <ReelDetailStat
                    label="Conv. Rate"
                    value={conversionRateDisplay!}
                    variant="success"
                  />
                </div>

                <TrackingManager reelId={item.id} />

                {item.permalink && (
                  <a
                    href={item.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ marginTop: 'var(--space-4)', textDecoration: 'none', width: 'fit-content' }}
                  >
                    View on Instagram ↗
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Click Timeline — full-width below body ── */}
        <div className="modal__chart">
          <p className="modal__chart-title">Click Timeline</p>

          {timelineLoading && (
            <div className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-md)' }} />
          )}

          {timelineError && !timelineLoading && (
            <div className="error-banner">{timelineError}</div>
          )}

          {!timelineLoading && !timelineError && (
            <ClickTimelineChart data={timeline} />
          )}
        </div>

      </div>
    </div>
  )
}
