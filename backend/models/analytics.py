from pydantic import BaseModel, Field


class AnalyticsPoint(BaseModel):
    date: str = Field(..., description="Date of the metric")
    value: int = Field(..., description="Metric value")


class InsightMetric(BaseModel):
    name: str = Field(..., description="Metric identifier")
    title: str = Field(..., description="Human readable metric name")
    description: str = Field(..., description="Metric description")
    values: list[AnalyticsPoint] = Field(
        default_factory=list,
        description="Metric values over time",
    )


class InstagramAnalytics(BaseModel):
    metrics: list[InsightMetric] = Field(
        default_factory=list,
        description="Instagram insights metrics",
    )