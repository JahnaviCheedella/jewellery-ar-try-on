from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import Base, engine
from .routers import analytics, categories, jewellery

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nandi Jewellers AR API", version="1.0.0")

origins = [settings.FRONTEND_URL]
if settings.ENVIRONMENT == "development":
    origins.append("http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set(origins)),
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

app.include_router(categories.router)
app.include_router(jewellery.router)
app.include_router(analytics.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "nandi-jewellers-ar-api"}
