import uuid

from sqlalchemy.orm import Session

from repositories.reel_link_repository import create_reel_link
from services.media_service import create_media
from services.publish_media_service import publish_media


def publish_and_track(
    db: Session,
    image_url: str | None,
    video_url: str | None,
    caption: str | None,
    media_type: str | None,
    campaign_name: str,
    destination_url: str,
) -> dict:
    media_result = create_media(
        image_url=image_url,
        video_url=video_url,
        caption=caption,
        media_type=media_type,
    )

    creation_id = media_result.get("data", {}).get("id")

    if not creation_id:
        raise ValueError(
            f"Failed to extract creation_id from media result: {media_result}"
        )

    publish_result = publish_media(creation_id=creation_id)

    reel_id = publish_result.get("data", {}).get("id")

    if not reel_id:
        raise ValueError(
            f"Failed to extract reel_id from publish result: {publish_result}"
        )

    slug = uuid.uuid4().hex[:8]

    create_reel_link(
        db=db,
        reel_id=reel_id,
        campaign_name=campaign_name,
        slug=slug,
        destination_url=destination_url,
    )

    return {
        "reel_id": reel_id,
        "slug": slug,
        "tracking_url": f"/r/{slug}",
        "instagram_publish_result": publish_result,
    }
