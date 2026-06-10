from fastapi import FastAPI

from routes.instagram import router as instagram_router


app = FastAPI(
	title="Instagram Analytics API",
	version="1.0.0",
)

app.include_router(instagram_router)


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
