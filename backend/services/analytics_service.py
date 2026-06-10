from typing import Any


def get_analytics() -> dict[str, list[dict[str, Any]]]:
    return {
        "follower_growth": [
            {"date": "2025-08-01", "value": 1200},
            {"date": "2025-08-02", "value": 1215},
            {"date": "2025-08-03", "value": 1230},
            {"date": "2025-08-04", "value": 1240},
            {"date": "2025-08-05", "value": 1250},
        ],
        "engagement_trend": [
            {"date": "2025-08-01", "value": 210},
            {"date": "2025-08-02", "value": 245},
            {"date": "2025-08-03", "value": 198},
            {"date": "2025-08-04", "value": 276},
            {"date": "2025-08-05", "value": 290},
        ],
        "profile_visits_trend": [
            {"date": "2025-08-01", "value": 70},
            {"date": "2025-08-02", "value": 85},
            {"date": "2025-08-03", "value": 78},
            {"date": "2025-08-04", "value": 95},
            {"date": "2025-08-05", "value": 102},
        ],
    }