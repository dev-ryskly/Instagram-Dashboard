from typing import Any


def get_profile() -> dict[str, Any]:
    return {
        "followers": 1250,
        "following": 350,
        "engagement_rate": 6.2,
        "profile_visits": 420,
    }


def get_posts() -> list[dict[str, Any]]:
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