from services.composio_client import ComposioClient


def get_analytics():
    client = ComposioClient()

    result = client.get_instagram_analytics()

    raw_metrics = result.get("data", {}).get("data", [])

    metrics = []

    for metric in raw_metrics:
        metrics.append(
            {
                "name": metric.get("name", ""),
                "title": metric.get("title", ""),
                "description": metric.get("description", ""),
                "values": [
                    {
                        "date": value.get("end_time", "")[:10],
                        "value": value.get("value", 0),
                    }
                    for value in metric.get("values", [])
                ],
            }
        )

    return {
        "metrics": metrics,
    }