from contextlib import asynccontextmanager
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.init_db import init_db
from routes.dashboard import router as dashboard_router
from routes.integrations import router as integrations_router
from routes.instagram import router as instagram_router
from routes.tracking import router as tracking_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Instagram Analytics API",
    version="1.0.0",
    lifespan=lifespan,
)

_default_origins = "http://localhost:5173"
_origins = [
    o.strip()
    for o in os.getenv("ALLOWED_ORIGINS", _default_origins).split(",")
    if o.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)
app.include_router(instagram_router)
app.include_router(integrations_router)
app.include_router(tracking_router)


@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Instagram Analytics API",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }