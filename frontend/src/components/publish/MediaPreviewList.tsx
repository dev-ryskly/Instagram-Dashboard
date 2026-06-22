import { useEffect, useState } from 'react'

interface MediaPreviewListProps {
  files: File[]
  onRemoveFile: (index: number) => void
}

export default function MediaPreviewList({ files, onRemoveFile }: MediaPreviewListProps) {
  const [previews, setPreviews] = useState<{ url: string; isVideo: boolean }[]>([])

  useEffect(() => {
    // Generate object URLs for previews
    const urls = files.map((file) => {
      const url = URL.createObjectURL(file)
      const isVideo = file.type.startsWith('video/') || file.name.toLowerCase().endsWith('.mp4') || file.name.toLowerCase().endsWith('.mov')
      return { url, isVideo }
    })
    setPreviews(urls)

    // Cleanup on unmount or files change
    return () => {
      urls.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [files])

  if (files.length === 0) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <label className="form-label">Selected Files ({files.length})</label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 'var(--space-3)',
          background: 'var(--bg-elevated)',
          padding: 'var(--space-3)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}
      >
        {files.map((file, idx) => {
          const preview = previews[idx]
          if (!preview) return null

          return (
            <div
              key={idx}
              className="media-preview-card"
              style={{
                position: 'relative',
                aspectRatio: '1/1',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                background: 'var(--bg-surface)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Media viewer */}
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                {preview.isVideo ? (
                  <video
                    src={preview.url}
                    muted
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <img
                    src={preview.url}
                    alt={file.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => onRemoveFile(idx)}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    lineHeight: 1,
                  }}
                  title="Remove file"
                >
                  ✕
                </button>
              </div>

              {/* Filename footer */}
              <div
                style={{
                  fontSize: '0.7rem',
                  padding: 'var(--space-1) var(--space-2)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  background: 'var(--bg-surface)',
                  borderTop: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                }}
                title={file.name}
              >
                {file.name}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
