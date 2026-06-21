import { useEffect, useState } from 'react'
import { getTrackingLinks, createTrackingLink, deleteTrackingLink, type ReelLink } from '../../api/tracking'

type TrackingManagerProps = {
  reelId: string
}

export default function TrackingManager({ reelId }: TrackingManagerProps) {
  const [status, setStatus] = useState<'loading' | 'enabled' | 'disabled' | 'error'>('loading')
  const [link, setLink] = useState<ReelLink | null>(null)
  
  // Form state
  const [campaignName, setCampaignName] = useState('')
  const [destinationUrl, setDestinationUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isDisabling, setIsDisabling] = useState(false)

  useEffect(() => {
    getTrackingLinks()
      .then((links) => {
        const found = links.find((l) => l.reel_id === reelId)
        if (found) {
          setLink(found)
          setStatus('enabled')
        } else {
          setStatus('disabled')
        }
      })
      .catch(() => {
        setStatus('error')
        setErrorMsg('Failed to check tracking status')
      })
  }, [reelId])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)

    try {
      const slug = Math.random().toString(36).substring(2, 8)
      const newLink = await createTrackingLink({
        reel_id: reelId,
        campaign_name: campaignName,
        slug,
        destination_url: destinationUrl,
      })
      
      setLink(newLink)
      setStatus('enabled')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('An unknown error occurred')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopy = () => {
    if (link) {
      const trackingUrl = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}/r/${link.slug}`
      navigator.clipboard.writeText(trackingUrl).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  const handleDisable = async () => {
    setIsDisabling(true)
    setErrorMsg(null)
    
    try {
      await deleteTrackingLink(reelId)
      setLink(null)
      setStatus('disabled')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message)
      } else {
        setErrorMsg('An unknown error occurred while disabling tracking')
      }
      setStatus('error')
    } finally {
      setIsDisabling(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="tracking-manager tracking-manager--loading">
        <div className="skeleton" style={{ height: '80px', borderRadius: 'var(--radius-md)' }} />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="tracking-manager tracking-manager--error">
        <div className="error-banner">{errorMsg}</div>
      </div>
    )
  }

  if (status === 'enabled' && link) {
    const trackingUrl = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}/r/${link.slug}`
    
    return (
      <div className="tracking-manager tracking-manager--enabled">
        <div className="tracking-manager__header">
          <span className="badge badge-success">🟢 Tracking Enabled</span>
        </div>
        
        <div className="tracking-manager__link-box">
          <input
            type="text"
            className="form-input tracking-manager__input"
            value={trackingUrl}
            readOnly
          />
          <button
            type="button"
            className="btn-secondary"
            onClick={handleCopy}
            disabled={isDisabling}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleDisable}
            disabled={isDisabling}
            style={{ color: 'var(--error)' }}
          >
            {isDisabling ? 'Disabling...' : 'Disable'}
          </button>
        </div>
        
        <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: 'var(--space-2)' }}>
          Campaign: {link.campaign_name}
        </p>
      </div>
    )
  }

  return (
    <div className="tracking-manager tracking-manager--disabled">
      <div className="tracking-manager__header">
        <span className="badge badge-muted">⚪ Tracking Disabled</span>
      </div>

      <form className="tracking-manager__form" onSubmit={handleCreate}>
        <div className="result-field">
          <label className="text-muted" style={{ fontSize: '0.8rem' }}>Campaign Name</label>
          <input
            type="text"
            className="form-input"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="e.g. Summer Sale 2026"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="result-field">
          <label className="text-muted" style={{ fontSize: '0.8rem' }}>Destination URL</label>
          <input
            type="url"
            className="form-input"
            value={destinationUrl}
            onChange={(e) => setDestinationUrl(e.target.value)}
            placeholder="https://yourstore.com/product"
            required
            disabled={isSubmitting}
          />
        </div>

        {errorMsg && <div className="error-banner" style={{ marginTop: 'var(--space-2)' }}>{errorMsg}</div>}

        <button
          type="submit"
          className="btn-primary tracking-manager__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enabling...' : 'Enable Tracking'}
        </button>
      </form>
    </div>
  )
}
