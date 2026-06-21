import type { InstagramContent } from '../../api/content'

type ContentCardProps = {
  item: InstagramContent
  hasTracking?: boolean
  onClick: (item: InstagramContent) => void
}

const MEDIA_TYPE_LABELS: Record<string, string> = {
  REELS: 'Reel',
  IMAGE: 'Image',
  CAROUSEL_ALBUM: 'Carousel',
  VIDEO: 'Video',
}

export default function ContentCard({ item, hasTracking, onClick }: ContentCardProps) {
  const label = MEDIA_TYPE_LABELS[item.media_type] ?? item.media_type

  const formattedTime = item.timestamp
    ? new Date(item.timestamp).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <button
      type="button"
      className="content-card"
      onClick={() => onClick(item)}
      aria-label={`View details for ${item.caption ?? 'reel'}`}
      style={{ textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
    >
      {item.thumbnail_url ? (
        <img
          className="content-card__thumb"
          src={item.thumbnail_url}
          alt={item.caption ?? 'Instagram content'}
          loading="lazy"
        />
      ) : (
        <div className="content-card__thumb-placeholder">▶</div>
      )}

      <div className="content-card__body">
        <p className={`content-card__caption${!item.caption ? ' content-card__caption--empty' : ''}`}>
          {item.caption ?? 'No caption'}
        </p>

        <div className="content-card__footer">
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <span className="badge badge-purple">{label}</span>
            {hasTracking !== undefined && (
              hasTracking ? (
                <span className="badge badge-success">🟢 Tracking Enabled</span>
              ) : (
                <span className="badge badge-muted">⚪ Tracking Disabled</span>
              )
            )}
          </div>
          {formattedTime && (
            <time className="content-card__time" dateTime={item.timestamp ?? undefined}>
              {formattedTime}
            </time>
          )}
        </div>
      </div>
    </button>
  )
}
