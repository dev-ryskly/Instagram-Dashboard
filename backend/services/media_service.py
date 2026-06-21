from services.composio_client import ComposioClient


def create_media(
    image_url: str | None,
    video_url: str | None,
    caption: str | None,
    media_type: str | None,
):
    client = ComposioClient()

    return client.create_instagram_media(
        image_url=image_url,
        video_url=video_url,
        caption=caption,
        media_type=media_type,
    )