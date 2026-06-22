import { useState } from 'react'
import MediaPicker from './MediaPicker'
import MediaPreviewList from './MediaPreviewList'
import CaptionInput from './CaptionInput'
import PublishButton from './PublishButton'
import { uploadMediaFile, publishAndTrack, type PublishAndTrackResponse } from '../../api/publishAndTrack'

export type PublishType = 'Reel' | 'Post' | 'Carousel'

interface PublishMediaFormProps {
  onSuccess: (res: PublishAndTrackResponse) => void
  onError: (errMsg: string) => void
  onLoadingChange: (loading: boolean) => void
}

export default function PublishMediaForm({ onSuccess, onError, onLoadingChange }: PublishMediaFormProps) {
  const [files, setFiles] = useState<File[]>([])
  const [caption, setCaption] = useState('')
  const [campaignName, setCampaignName] = useState('')
  const [destinationUrl, setDestinationUrl] = useState('')
  const [isBusy, setIsBusy] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleFilesSelected = (newFiles: File[]) => {
    setValidationError(null)
    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Auto-detect publishing type
  let publishType: PublishType | null = null
  if (files.length > 0) {
    if (files.length > 1) {
      publishType = 'Carousel'
    } else {
      const file = files[0]
      const isVideo = file.type.startsWith('video/') || file.name.toLowerCase().endsWith('.mp4') || file.name.toLowerCase().endsWith('.mov')
      publishType = isVideo ? 'Reel' : 'Post'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) {
      setValidationError('Please select at least one media file')
      return
    }

    setIsBusy(true)
    onLoadingChange(true)
    setValidationError(null)
    try {
      // 1. Upload files to translation layer in parallel
      const uploadResults = await Promise.all(
        files.map((file) => uploadMediaFile(file))
      )
      const uploadedUrls = uploadResults.map((r) => r.file_url)
      if (uploadedUrls.length === 0) {
        throw new Error('Upload failed: no URLs returned')
      }

      // 2. Map auto-detected types to API format
      let mediaTypeParam = ''
      let imageUrlParam: string | undefined = undefined
      let videoUrlParam: string | undefined = undefined
      let mediaUrlsParam: string[] | undefined = undefined

      if (publishType === 'Carousel') {
        mediaTypeParam = 'CAROUSEL'
        mediaUrlsParam = uploadedUrls
      } else if (publishType === 'Reel') {
        mediaTypeParam = 'REELS'
        videoUrlParam = uploadedUrls[0]
      } else {
        mediaTypeParam = 'IMAGE'
        imageUrlParam = uploadedUrls[0]
      }

      // 3. Publish and track
      const result = await publishAndTrack({
        image_url: imageUrlParam,
        video_url: videoUrlParam,
        media_urls: mediaUrlsParam,
        media_type: mediaTypeParam,
        caption: caption || undefined,
        campaign_name: campaignName.trim(),
        destination_url: destinationUrl.trim(),
      })

      onSuccess(result)
      // Reset form
      setFiles([])
      setCaption('')
      setCampaignName('')
      setDestinationUrl('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Publishing failed'
      onError(msg)
    } finally {
      setIsBusy(false)
      onLoadingChange(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Media Input Area */}
      <div className="form-field">
        <label className="form-label">Upload Media</label>
        <MediaPicker onFilesSelected={handleFilesSelected} disabled={isBusy} />
      </div>

      {/* Selected Media Previews */}
      <MediaPreviewList files={files} onRemoveFile={handleRemoveFile} />

      {/* Auto-detected Type Display */}
      {publishType && (
        <div
          style={{
            background: 'var(--bg-elevated)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid var(--border)',
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>Publishing Type:</span>
          <span
            className={`badge ${
              publishType === 'Reel'
                ? 'badge-purple'
                : publishType === 'Post'
                ? 'badge-success'
                : 'badge-info'
            }`}
            style={{ fontWeight: 600 }}
          >
            {publishType}
          </span>
        </div>
      )}

      {/* Caption Area */}
      <CaptionInput value={caption} onChange={setCaption} disabled={isBusy} />

      <div className="divider" style={{ margin: '0' }} />

      {/* Tracking Config fields */}
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
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          disabled={isBusy}
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
          value={destinationUrl}
          onChange={(e) => setDestinationUrl(e.target.value)}
          disabled={isBusy}
          required
        />
      </div>

      {/* Error banner from local validation */}
      {validationError && (
        <div className="error-banner" style={{ marginTop: 'var(--space-1)' }}>
          {validationError}
        </div>
      )}

      {/* Publish button */}
      <PublishButton loading={isBusy} disabled={files.length === 0} />
    </form>
  )
}
