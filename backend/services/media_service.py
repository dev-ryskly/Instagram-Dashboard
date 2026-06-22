from services.composio_client import ComposioClient


def is_video_url(url: str) -> bool:
    lower_url = url.lower().split("?")[0]
    return any(lower_url.endswith(ext) for ext in [".mp4", ".mov", ".avi", ".mkv"])


def create_media(
    image_url: str | None,
    video_url: str | None,
    caption: str | None,
    media_type: str | None,
    media_urls: list[str] | None = None,
):
    client = ComposioClient()

    if media_type == "CAROUSEL" and media_urls:
        children_ids = []
        for url in media_urls:
            if is_video_url(url):
                res = client.create_instagram_media(
                    video_url=url,
                    is_carousel_item=True,
                )
            else:
                res = client.create_instagram_media(
                    image_url=url,
                    is_carousel_item=True,
                )
            cid = res.get("data", {}).get("id")
            if not cid:
                raise ValueError(f"Failed to create carousel item container for URL {url}: {res}")
            children_ids.append(cid)

        # Create carousel parent container
        return client.create_instagram_media(
            media_type="CAROUSEL",
            children=children_ids,
            caption=caption,
        )

    return client.create_instagram_media(
        image_url=image_url,
        video_url=video_url,
        caption=caption,
        media_type=media_type,
    )