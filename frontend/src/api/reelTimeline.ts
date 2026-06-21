const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface TimelinePoint {
  date: string
  clicks: number
}

export async function getReelTimeline(reelId: string): Promise<TimelinePoint[]> {
  const response = await fetch(
    `${BASE_URL}/reel-links/${encodeURIComponent(reelId)}/timeline`
  )

  if (!response.ok) {
    throw new Error(
      `Failed to fetch timeline: ${response.status} ${response.statusText}`
    )
  }

  return response.json() as Promise<TimelinePoint[]>
}
