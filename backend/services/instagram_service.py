from typing import Any

from services.composio_client import ComposioClient


def get_profile() -> dict[str, Any]:
    client = ComposioClient()
    return client.get_instagram_profile()


def get_posts() -> list[dict[str, Any]]:
    client = ComposioClient()
    return client.get_instagram_posts()