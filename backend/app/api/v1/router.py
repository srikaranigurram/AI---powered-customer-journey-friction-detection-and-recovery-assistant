from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    customers,
    journey_events,
    predictions,
    recovery,
    dashboard
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(customers.router, prefix="/customers", tags=["Customers"])
api_router.include_router(journey_events.router, prefix="/journey-events", tags=["Customer Journey Events"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["ML Predictions"])
api_router.include_router(recovery.router, prefix="/recovery", tags=["Gemini Recovery Actions"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["React Dashboard"])
