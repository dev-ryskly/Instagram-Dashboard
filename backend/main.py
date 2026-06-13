from contextlib import asynccontextmanager

from fastapi import FastAPI

from database.init_db import init_db
from routes.integrations import router as integrations_router
from routes.instagram import router as instagram_router


@asynccontextmanager
async def lifespan(app: FastAPI):
	init_db()
	yield


app = FastAPI(
	title="Instagram Analytics API",
	version="1.0.0",
	lifespan=lifespan,
)

app.include_router(instagram_router)
app.include_router(integrations_router)


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
