const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface ReelDetail {
  reel_id: string
  views: number
  reach: number
  likes: number
  comments: number
  shares: number
  saves: number
  click_count: number
  conversion_count: number
  conversion_rate: number
}

export async function getReelDetail(mediaId: string): Promise<ReelDetail> {
  const response = await fetch(
    `${BASE_URL}/instagram/reels/${encodeURIComponent(mediaId)}/detail`
  )

  if (!response.ok) {
    throw new Error(
      `Failed to fetch reel detail: ${response.status} ${response.statusText}`
    )
  }

  return response.json() as Promise<ReelDetail>
}
