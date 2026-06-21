const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface InstagramContent {
  id: string
  caption: string | null
  media_type: string
  media_url: string | null
  permalink: string | null
  thumbnail_url: string | null
  timestamp: string | null
  username: string | null
}

export async function getContent(): Promise<InstagramContent[]> {
  const response = await fetch(`${BASE_URL}/instagram/posts`)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch content: ${response.status} ${response.statusText}`
    )
  }

  return response.json() as Promise<InstagramContent[]>
}
