from fastapi import APIRouter

from services.composio_client import ComposioClient

router = APIRouter(prefix="/integrations", tags=["Integrations"])


@router.get("/composio/status")
def get_composio_status():
    return {
        "provider": "composio",
        "status": "connected",
        "services": [
            "instagram_profile",
            "instagram_posts",
            "instagram_analytics",
        ],
    }


@router.get("/composio/config")
def get_composio_config():
    client = ComposioClient()
    return client.get_connection_status()


@router.get("/composio/instagram")
def get_composio_instagram():
    client = ComposioClient()
    return client.get_instagram_connection()


@router.get("/composio/live-profile")
def get_composio_live_profile():
    client = ComposioClient()
    return client.get_instagram_profile()