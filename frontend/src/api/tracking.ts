const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface ReelLink {
  id: number
  reel_id: string
  campaign_name: string
  slug: string
  destination_url: string
}

export interface CreateReelLinkRequest {
  reel_id: string
  campaign_name: string
  slug: string
  destination_url: string
}

export async function getTrackingLinks(): Promise<ReelLink[]> {
  const response = await fetch(`${BASE_URL}/reel-links`)

  if (!response.ok) {
    throw new Error(`Failed to fetch tracking links: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<ReelLink[]>
}

export async function createTrackingLink(request: CreateReelLinkRequest): Promise<ReelLink> {
  const response = await fetch(`${BASE_URL}/reel-links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`Failed to create tracking link: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<ReelLink>
}

export async function deleteTrackingLink(reelId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/reel-links/${encodeURIComponent(reelId)}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Failed to delete tracking link: ${response.status} ${response.statusText}`)
  }
}
