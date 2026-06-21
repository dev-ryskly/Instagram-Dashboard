const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface PublishAndTrackRequest {
  image_url?: string;
  video_url?: string;
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
