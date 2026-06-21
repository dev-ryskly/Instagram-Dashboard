from services.composio_client import ComposioClient


def get_publishing_limit():
    client = ComposioClient()

    result = client.get_instagram_publishing_limit()

    data = result.get("data", {}).get("data", [])

    if not data:
        return {
            "quota_total": 0,
            "quota_usage": 0,
            "quota_remaining": 0,
            "quota_duration": 0,
        }

    quota = data[0]

    total = quota.get("config", {}).get(
        "quota_total",
        0,
    )

    usage = quota.get(
        "quota_usage",
        0,
    )

    return {
        "quota_total": total,
        "quota_usage": usage,
        "quota_remaining": total - usage,
        "quota_duration": quota.get(
            "config",
            {},
        ).get(
            "quota_duration",
            0,
        ),
    }