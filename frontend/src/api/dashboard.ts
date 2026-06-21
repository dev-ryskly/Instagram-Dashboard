const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export interface DashboardReelSummary {
  reel_id: string;
  campaign_name: string;
  slug: string;
  total_clicks: number;
  total_conversions: number;
  conversion_rate: number;
}

export interface RecentClick {
  reel_id: string;
  slug: string;
  visited_at: string;
}

export interface DashboardResponse {
  total_reels: number;
  total_clicks: number;
  total_conversions: number;
  conversion_rate: number;
  top_reels: DashboardReelSummary[];
  recent_clicks: RecentClick[];
}

export async function getDashboard(): Promise<DashboardResponse> {
  const response = await fetch(`${BASE_URL}/dashboard`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch dashboard: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<DashboardResponse>;
}
