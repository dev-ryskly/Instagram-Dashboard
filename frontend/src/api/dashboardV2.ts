const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface ReelDashboardItem {
  reel_id: string
  thumbnail_url: string | null
  caption: string | null
  timestamp: string | null
  media_type: string
  views: number
  reach: number
  likes: number
  comments: number
  shares: number
  saves: number
  click_count: number
  conversion_count: number
  conversion_rate: number
  has_tracking: boolean
}

export interface DashboardV2Response {
  total_reels: number
  total_clicks: number
  total_conversions: number
  conversion_rate: number
  reels: ReelDashboardItem[]
}

export async function getDashboardV2(): Promise<DashboardV2Response> {
  const response = await fetch(`${BASE_URL}/dashboard/v2`)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch dashboard: ${response.status} ${response.statusText}`
    )
  }

  return response.json() as Promise<DashboardV2Response>
}
