const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface PublishAndTrackRequest {
  image_url?: string;
  video_url?: string;
  media_urls?: string[];
  caption?: string;
  media_type?: string;
  campaign_name: string;
  destination_url: string;
}

export interface PublishAndTrackResponse {
  reel_id: string;
  slug: string;
  tracking_url: string;
  instagram_publish_result: Record<string, unknown>;
}

export async function uploadMediaFiles(files: File[]): Promise<string[]> {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })

  const response = await fetch(`${BASE_URL}/instagram/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Failed to upload media files: ${response.status} ${response.statusText}`)
  }

  const data = await response.json() as { urls: string[] }
  return data.urls
}

export async function publishAndTrack(
  request: PublishAndTrackRequest
): Promise<PublishAndTrackResponse> {
  const response = await fetch(
    `${BASE_URL}/instagram/publish-and-track`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to publish and track: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<PublishAndTrackResponse>;
}
