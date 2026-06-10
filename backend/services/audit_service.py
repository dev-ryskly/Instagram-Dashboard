from typing import Any

from services.analytics_service import get_analytics
from services.instagram_service import get_posts
from services.instagram_service import get_profile


def get_audit() -> dict[str, Any]:
    return {
        "profile": get_profile(),
        "posts": get_posts(),
        "analytics": get_analytics(),
        "summary": "Follower growth is positive. Engagement is increasing. Profile visits have improved over the last week.",
    }