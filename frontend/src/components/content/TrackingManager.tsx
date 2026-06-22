import { useEffect, useState } from 'react'

import {
  getTrackingConfig,
  updateTrackingConfig,
  PERMANENT_TRACKING_URL,
  type TrackingConfig,
} from '../../api/trackingConfig'

type TrackingManagerProps = {
  /** The reel shown in the current modal. */
  reelId: string
}

export default function TrackingManager({ reelId }: TrackingManagerProps) {
  const [config, setConfig] = useState<TrackingConfig | null>(null)
  const [destinationUrl, setDestinationUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isBusy, setIsBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    getTrackingConfig()
      .then((cfg) => {
        setConfig(cfg)
        setDestinationUrl(cfg.destination_url || '')
      })
      .catch(() => setErrorMsg('Failed to load tracking config'))
      .finally(() => setLoading(false))
  }, [])

  // ── derived state ─────────────────────────────────────────────
  const isThisReelActive =
    config?.tracking_enabled === true && config?.active_reel_id === reelId

  const isTrackingActive = config?.tracking_enabled === true

  // ── actions ───────────────────────────────────────────────────

  const handleTrackThisReel = async () => {
    setIsBusy(true)
    setErrorMsg(null)
    const existingUrl = destinationUrl.trim() || config?.destination_url || 'https://studojo.com'
    try {
      const updated = await updateTrackingConfig({
        active_reel_id: reelId,
        tracking_enabled: true,
        destination_url: existingUrl,
      })
      setConfig(updated)
      setDestinationUrl(updated.destination_url)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to enable tracking')
    } finally {
      setIsBusy(false)
    }
  }

  const handleStopTracking = async () => {
    setIsBusy(true)
    setErrorMsg(null)
    const existingUrl = destinationUrl.trim() || config?.destination_url || 'https://studojo.com'
    try {
      const updated = await updateTrackingConfig({
        tracking_enabled: false,
        destination_url: existingUrl,
      })
      setConfig(updated)
      setDestinationUrl(updated.destination_url)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to stop tracking')
    } finally {
      setIsBusy(false)
    }
  }

  const handleSaveDestination = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const targetUrl = destinationUrl.trim()
    if (!targetUrl) {
      setErrorMsg('destination_url cannot be empty')
      return
    }
    setIsBusy(true)
    setErrorMsg(null)
    try {
      const updated = await updateTrackingConfig({
        destination_url: targetUrl,
        active_reel_id: config?.active_reel_id,
        tracking_enabled: config?.tracking_enabled,
      })
      setConfig(updated)
      setDestinationUrl(updated.destination_url)
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update destination URL')
    } finally {
      setIsBusy(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(PERMANENT_TRACKING_URL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // ── render ────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="tracking-manager tracking-manager--loading">
        <div className="skeleton" style={{ height: '60px', borderRadius: 'var(--radius-md)' }} />
      </div>
    )
  }

  return (
    <div className="tracking-manager">

      {/* ── Global tracking status ─────────────────────────────── */}
      {isThisReelActive ? (
        <div className="tracking-manager__header">
          <span className="badge badge-success">🟢 Tracking Active</span>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
            Clicks on your bio link are attributed to this reel
          </span>
        </div>
      ) : isTrackingActive && config ? (
        <div className="tracking-manager__header">
          <span className="badge badge-muted">⚪ Tracking Disabled for this reel</span>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>
            Currently tracking: {config.active_reel_id ?? 'another reel'}
          </span>
        </div>
      ) : (
        <div className="tracking-manager__header">
          <span className="badge badge-muted">⚪ Tracking Disabled</span>
        </div>
      )}

      {/* ── Destination URL ────────────────────────────────────── */}
      <form onSubmit={handleSaveDestination} className="tracking-manager__form">
        <label className="form-label" htmlFor="destination-url-input">
          Destination URL
        </label>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <input
            id="destination-url-input"
            type="text"
            className="form-input"
            value={destinationUrl}
            onChange={(e) => setDestinationUrl(e.target.value)}
            placeholder="https://studojo.com"
            disabled={isBusy}
            style={{ flex: 1 }}
          />
          <button
            type="submit"
            className="btn-secondary"
            disabled={isBusy || !destinationUrl.trim() || destinationUrl === config?.destination_url}
            style={{ whiteSpace: 'nowrap' }}
          >
            Save URL
          </button>
        </div>
      </form>

      {/* ── Permanent bio link ─────────────────────────────────── */}
      <div className="tracking-manager__link-container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
        <label className="form-label">Permanent Bio Link</label>
        <div className="tracking-manager__link-box">
          <input
            type="text"
            className="form-input tracking-manager__input"
            value={PERMANENT_TRACKING_URL}
            readOnly
            aria-label="Permanent tracking URL"
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={handleCopy}
            disabled={isBusy}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* ── Error ─────────────────────────────────────────────── */}
      {errorMsg && (
        <div className="error-banner" style={{ marginTop: 'var(--space-2)' }}>
          {errorMsg}
        </div>
      )}

      {/* ── Actions ───────────────────────────────────────────── */}
      <div className="tracking-manager__actions">
        {!isThisReelActive && (
          <button
            type="button"
            className="btn-primary"
            onClick={handleTrackThisReel}
            disabled={isBusy}
          >
            {isBusy ? 'Updating...' : 'Track This Reel'}
          </button>
        )}

        {isTrackingActive && (
          <button
            type="button"
            className="btn-secondary"
            onClick={handleStopTracking}
            disabled={isBusy}
            style={{ color: 'var(--error)' }}
          >
            {isBusy ? 'Stopping...' : 'Stop Tracking'}
          </button>
        )}
      </div>
    </div>
  )
}
