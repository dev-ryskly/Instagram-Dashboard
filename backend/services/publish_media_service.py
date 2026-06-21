from services.composio_client import ComposioClient


def publish_media(
    creation_id: str,
):
    client = ComposioClient()

    return client.publish_instagram_media(
        creation_id=creation_id,
    )