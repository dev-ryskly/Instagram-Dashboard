from typing import Any


class ComposioService:
    def get_instagram_profile(self) -> dict[str, Any]:
        # TODO: Replace this mock with the Composio API call for Instagram profile data.
        return {
            "followers": 1250,
            "following": 350,
            "engagement_rate": 6.2,
            "profile_visits": 420,
        }

    def get_instagram_posts(self) -> list[dict[str, Any]]:
        # TODO: Replace this mock with the Composio API call for Instagram posts.
        return [
            {
                "id": 1,
                "caption": "Summer campaign",
                "likes": 450,
                "comments": 23,
                "shares": 12,
                "saves": 34,
                "reach": 5200,
            }
        ]

    def get_instagram_analytics(self) -> dict[str, list[dict[str, Any]]]:
        # TODO: Replace this mock with the Composio API call for Instagram analytics.
        return {
            "follower_growth": [
                {"date": "2025-08-01", "value": 1200},
                {"date": "2025-08-02", "value": 1215},
                {"date": "2025-08-03", "value": 1230},
                {"date": "2025-08-04", "value": 1240},
                {"date": "2025-08-05", "value": 1250},
            ],
            "engagement_trend": [
                {"date": "2025-08-01", "value": 210},
                {"date": "2025-08-02", "value": 245},
                {"date": "2025-08-03", "value": 198},
                {"date": "2025-08-04", "value": 276},
                {"date": "2025-08-05", "value": 290},
            ],
            "profile_visits_trend": [
                {"date": "2025-08-01", "value": 70},
                {"date": "2025-08-02", "value": 85},
                {"date": "2025-08-03", "value": 78},
                {"date": "2025-08-04", "value": 95},
                {"date": "2025-08-05", "value": 102},
            ],
        }
