from typing import Any

from services.composio_service import ComposioService


class InstagramAuditRunner:
    def __init__(self, composio_service: ComposioService | None = None):
        self.composio_service = composio_service or ComposioService()

    def run_weekly_audit(self) -> dict[str, Any]:
        profile = self.composio_service.get_instagram_profile()
        posts = self.composio_service.get_instagram_posts()
        analytics = self.composio_service.get_instagram_analytics()

        summary = (
            f"Weekly audit collected {len(posts)} posts, "
            f"with {profile['followers']} followers and "
            f"{len(analytics['follower_growth'])} follower growth data points."
        )

        # TODO: Store the weekly audit results in the database.
        # TODO: Persist audit history for reporting and trend analysis.
        return {
            "profile": profile,
            "posts": posts,
            "analytics": analytics,
            "summary": summary,
        }
