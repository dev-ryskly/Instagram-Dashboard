import { useRef, useState } from 'react'

interface MediaPickerProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

export default function MediaPicker({ onFilesSelected, disabled }: MediaPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesSelected(Array.from(e.target.files))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (disabled) return

    if (e.dataTransfer.files) {
      onFilesSelected(Array.from(e.dataTransfer.files))
    }
  }

  return (
    <div
      className={`media-picker-dropzone ${isDragOver ? 'media-picker-dropzone--dragover' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        border: '2px dashed var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-8) var(--space-4)',
        textAlign: 'center',
        background: isDragOver ? 'var(--bg-elevated)' : 'var(--bg-surface)',
        transition: 'all var(--duration) var(--ease)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-3)'
      }}
      onClick={disabled ? undefined : handleButtonClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.mp4,.mov"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />
      <div style={{ fontSize: '2rem', opacity: 0.7 }}>📁</div>
      <div>
        <p style={{ fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
          Drag & drop your files here, or click to browse
        </p>
        <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: 'var(--space-1)', marginBottom: 0 }}>
          Supports JPEG, PNG, MP4, MOV (Single or Multiple)
        </p>
      </div>
      <button
        type="button"
        className="btn-secondary"
        onClick={(e) => {
          e.stopPropagation()
          handleButtonClick()
        }}
        disabled={disabled}
        style={{ marginTop: 'var(--space-2)' }}
      >
        Select Media
      </button>
    </div>
  )
}
