import os
from typing import Any

from composio import Composio
from dotenv import load_dotenv

load_dotenv()


class ComposioClient:
    def __init__(self) -> None:
        self.api_key = os.getenv("COMPOSIO_API_KEY")

        if not self.api_key:
            raise RuntimeError("COMPOSIO_API_KEY is required")

        self.user_id = os.getenv("COMPOSIO_USER_ID")

        if not self.user_id:
            raise RuntimeError("COMPOSIO_USER_ID is required")

        self.client = Composio(api_key=self.api_key)

    def is_configured(self) -> bool:
        return bool(self.api_key)

    def get_connection_status(self) -> dict[str, Any]:
        return {
            "configured": self.is_configured(),
            "provider": "composio",
            "user_id": self.user_id,
        }

    def get_instagram_connection(self) -> dict[str, Any]:
        return {
            "auth_config": "instagram",
            "connected": True,
            "user_id": self.user_id,
        }

    def get_instagram_profile(self) -> dict[str, Any]:
        result = self.client.tools.execute(
            "INSTAGRAM_GET_USER_INFO",
            {"ig_user_id": "me"},
            user_id=self.user_id,
        )

        data = result.get("data", {})

        return {
            "username": data.get("username"),
            "account_type": data.get("account_type"),
            "biography": data.get("biography"),
            "followers_count": data.get("followers_count"),
            "follows_count": data.get("follows_count"),
            "media_count": data.get("media_count"),
            "instagram_id": data.get("id"),
        }

    def get_instagram_posts(self) -> list[dict[str, Any]]:
        result = self.client.tools.execute(
            "INSTAGRAM_GET_IG_USER_MEDIA",
            {"ig_user_id": "me"},
            user_id=self.user_id,
        )

        return result.get("data", {}).get("data", [])

    def get_instagram_post_insights(
        self,
        media_id: str,
        metrics: list[str],
    ) -> dict[str, Any]:
        result = self.client.tools.execute(
            "INSTAGRAM_GET_IG_MEDIA_INSIGHTS",
            {
                "ig_media_id": media_id,
                "metric": metrics,
            },
            user_id=self.user_id,
        )

        print("INSTAGRAM POST INSIGHTS:")
        print(result)

        return result

    def get_instagram_analytics(self) -> dict[str, Any]:
        result = self.client.tools.execute(
            "INSTAGRAM_GET_USER_INSIGHTS",
            {
                "ig_user_id": "me",
            },
            user_id=self.user_id,
        )

        return result