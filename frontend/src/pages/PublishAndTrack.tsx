import { useState } from 'react'

import { publishAndTrack } from '../api/publishAndTrack'
import type { PublishAndTrackResponse } from '../api/publishAndTrack'

type FormState = {
  image_url: string
  video_url: string
  caption: string
  campaign_name: string
  destination_url: string
}

const INITIAL_FORM: FormState = {
  image_url: '',
  video_url: '',
  caption: '',
  campaign_name: '',
  destination_url: '',
}

export default function PublishAndTrack() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PublishAndTrackResponse | null>(null)

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await publishAndTrack({
        image_url: form.image_url || undefined,
        video_url: form.video_url || undefined,
        caption: form.caption || undefined,
        campaign_name: form.campaign_name,
        destination_url: form.destination_url,
      })

      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Publish &amp; Track</h1>
          <p className="page-subtitle">Publish a reel and generate a tracking link in one step</p>
        </div>
      </div>

      <div className="grid-panel">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Reel Details</span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-field">
              <label className="form-label" htmlFor="image_url">Image URL</label>
              <input
                id="image_url"
                name="image_url"
                type="url"
                className="form-input"
                placeholder="https://example.com/image.jpg"
                value={form.image_url}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="video_url">Video URL</label>
              <input
                id="video_url"
                name="video_url"
                type="url"
                className="form-input"
                placeholder="https://example.com/video.mp4"
                value={form.video_url}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="caption">Caption</label>
              <textarea
                id="caption"
                name="caption"
                className="form-input form-textarea"
                placeholder="Write your caption..."
                value={form.caption}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="divider" style={{ margin: '0' }} />

            <div className="form-field">
              <label className="form-label" htmlFor="campaign_name">
                Campaign Name <span className="text-accent">*</span>
              </label>
              <input
                id="campaign_name"
                name="campaign_name"
                type="text"
                className="form-input"
                placeholder="e.g. summer-launch"
                value={form.campaign_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="destination_url">
                Destination URL <span className="text-accent">*</span>
              </label>
              <input
                id="destination_url"
                name="destination_url"
                type="url"
                className="form-input"
                placeholder="https://yoursite.com/landing"
                value={form.destination_url}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Publishing...' : 'Publish & Track'}
            </button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {error && (
            <div className="error-banner">{error}</div>
          )}

          {result && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">Published Successfully</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="result-field">
                  <span className="form-label">Reel ID</span>
                  <span className="mono text-muted">{result.reel_id}</span>
                </div>

                <div className="result-field">
                  <span className="form-label">Slug</span>
                  <span className="mono text-accent">/{result.slug}</span>
                </div>

                <div className="result-field">
                  <span className="form-label">Tracking URL</span>
                  <span className="mono text-muted">{result.tracking_url}</span>
                </div>
              </div>
            </div>
          )}

          {!error && !result && !loading && (
            <div className="card" style={{ opacity: 0.5 }}>
              <p className="text-muted" style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
                Results will appear here after publishing.
              </p>
            </div>
          )}

          {loading && (
            <div className="card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div className="skeleton" style={{ height: '16px', width: '40%' }} />
                <div className="skeleton" style={{ height: '16px', width: '70%' }} />
                <div className="skeleton" style={{ height: '16px', width: '55%' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
