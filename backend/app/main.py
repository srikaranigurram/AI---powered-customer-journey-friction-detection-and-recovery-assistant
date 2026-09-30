import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.api.v1.router import api_router

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("app")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    logger.info("Initializing database tables...")
    try:
        init_db()
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
    yield
    logger.info("Shutting down application...")


app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "Backend & Database API for AI-Powered Customer Journey Friction Detection and Recovery Assistant.\n\n"
        "Provides foundational endpoints for:\n"
        "- Customer Profiles & Journey Telemetry Ingestion\n"
        "- ML Friction & Abandonment Prediction Storage (XGBoost)\n"
        "- Gemini AI Explanation & Recovery Intervention Tracking\n"
        "- React Analytics Dashboard Aggregation"
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Root"])
def root():
    return {
        "project": settings.APP_NAME,
        "status": "online",
        "docs_url": "/docs",
        "api_v1_prefix": settings.API_V1_PREFIX
    }
