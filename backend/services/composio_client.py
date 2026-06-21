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
            dangerously_skip_version_check=True,
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
            dangerously_skip_version_check=True,
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
            dangerously_skip_version_check=True,
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
            dangerously_skip_version_check=True,
        )

        print("INSTAGRAM ANALYTICS:")
        print(result)

        return result

    def get_instagram_publishing_limit(self) -> dict[str, Any]:
        result = self.client.tools.execute(
            "INSTAGRAM_GET_IG_USER_CONTENT_PUBLISHING_LIMIT",
            {
                "ig_user_id": "me",
                "fields": "quota_usage,config",
            },
            user_id=self.user_id,
            dangerously_skip_version_check=True,
        )

        print("INSTAGRAM PUBLISHING LIMIT:")
        print(result)

        return result

    def create_instagram_media(
        self,
        image_url: str | None,
        video_url: str | None,
        caption: str | None,
        media_type: str | None,
    ) -> dict[str, Any]:
        payload = {
            "ig_user_id": "me",
        }

        if image_url:
            payload["image_url"] = image_url

        if video_url:
            payload["video_url"] = video_url

        if caption:
            payload["caption"] = caption

        if media_type:
            payload["media_type"] = media_type

        print("INSTAGRAM MEDIA PAYLOAD:")
        print(payload)

        result = self.client.tools.execute(
            "INSTAGRAM_POST_IG_USER_MEDIA",
            payload,
            user_id=self.user_id,
            dangerously_skip_version_check=True,
        )

        print("INSTAGRAM CREATE MEDIA:")
        print(result)

        return result

    def publish_instagram_media(
        self,
        creation_id: str,
    ) -> dict[str, Any]:
        payload = {
            "ig_user_id": "me",
            "creation_id": creation_id,
            "max_wait_seconds": 120,
            "poll_interval_seconds": 3,
        }

        print("INSTAGRAM PUBLISH PAYLOAD:")
        print(payload)

        result = self.client.tools.execute(
            "INSTAGRAM_POST_IG_USER_MEDIA_PUBLISH",
            payload,
            user_id=self.user_id,
            dangerously_skip_version_check=True,
        )

        print("INSTAGRAM PUBLISH RESULT:")
        print(result)

        return result