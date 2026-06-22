import { useState } from 'react'
import PublishMediaForm from '../components/publish/PublishMediaForm'
import type { PublishAndTrackResponse } from '../api/publishAndTrack'

export default function PublishAndTrack() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PublishAndTrackResponse | null>(null)

  const handleSuccess = (response: PublishAndTrackResponse) => {
    setResult(response)
    setError(null)
  }

  const handleError = (errMsg: string) => {
    setError(errMsg)
    setResult(null)
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
            <span className="card-title">Media Details</span>
          </div>

          <PublishMediaForm
            onSuccess={handleSuccess}
            onError={handleError}
            onLoadingChange={setLoading}
          />
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
