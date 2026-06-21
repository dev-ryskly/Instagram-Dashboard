import { useEffect, useMemo, useState } from 'react'

import { getContent } from '../api/content'
import type { InstagramContent } from '../api/content'
import { getTrackingLinks } from '../api/tracking'
import ContentCard from '../components/content/ContentCard'
import ReelDetailModal from '../components/content/ReelDetailModal'

export default function ContentLibrary() {
  const [items, setItems] = useState<InstagramContent[]>([])
  const [trackedIds, setTrackedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<InstagramContent | null>(null)

  useEffect(() => {
    Promise.all([
      getContent(),
      getTrackingLinks().catch(() => []) // fail gracefully if tracking API fails
    ])
      .then(([contentItems, trackingLinks]) => {
        setItems(contentItems)
        setTrackedIds(new Set(trackingLinks.map((l) => l.reel_id)))
      })
      .catch(() => setError('Failed to load content'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter((item) =>
      (item.caption ?? '').toLowerCase().includes(q)
    )
  }, [items, query])

  return (
    <>
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Content Library</h1>
            <p className="page-subtitle">Your Instagram posts and reels</p>
          </div>

          <div className="search-wrap">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="search-input"
              type="search"
              placeholder="Search by caption..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search content by caption"
            />
          </div>
        </div>

        {loading && (
          <div className="content-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div className="skeleton" style={{ aspectRatio: '1/1', width: '100%' }} />
                <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', background: 'var(--bg-surface)' }}>
                  <div className="skeleton" style={{ height: '14px', width: '90%' }} />
                  <div className="skeleton" style={{ height: '14px', width: '70%' }} />
                  <div className="skeleton" style={{ height: '14px', width: '50%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="error-banner">{error}</div>
        )}

        {!loading && !error && (
          <div className="content-grid">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  hasTracking={trackedIds.has(item.id)}
                  onClick={setSelectedItem}
                />
              ))
            ) : (
              <div className="empty-state">
                {query ? `No results for "${query}"` : 'No content found.'}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedItem && (
        <ReelDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  )
}
