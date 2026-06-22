const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface TrackingConfig {
  active_reel_id: string | null
  tracking_enabled: boolean
  destination_url: string
}

export interface UpdateTrackingConfigRequest {
  active_reel_id?: string | null
  tracking_enabled?: boolean
  destination_url?: string
}

export const PERMANENT_TRACKING_URL = `${BASE_URL}/r/studojo`

export async function getTrackingConfig(): Promise<TrackingConfig> {
  const response = await fetch(`${BASE_URL}/tracking-config`)

  if (!response.ok) {
    throw new Error(`Failed to fetch tracking config: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<TrackingConfig>
}

export async function updateTrackingConfig(
  updates: UpdateTrackingConfigRequest,
): Promise<TrackingConfig> {
  const response = await fetch(`${BASE_URL}/tracking-config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    let errorMsg = `Failed to update tracking config: ${response.status} ${response.statusText}`
    try {
      const data = await response.json()
      if (data && data.detail) {
        errorMsg = data.detail
      } else if (data && data.message) {
        errorMsg = data.message
      }
    } catch {
      // Use fallback
    }
    throw new Error(errorMsg)
  }

  return response.json() as Promise<TrackingConfig>
}
