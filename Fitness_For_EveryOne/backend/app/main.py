"""FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.routers import auth_router, user_router, fitness_router, progress_router, ai_router

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="AI Personal Fitness for Everyone",
    description="AI-powered personalized fitness platform with workout plans, diet plans, recovery recommendations, and AI coaching.",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router.router)
app.include_router(user_router.router)
app.include_router(fitness_router.router)
app.include_router(progress_router.router)
app.include_router(ai_router.router)


@app.get("/health", tags=["System"])
def health_check():
    """Health check endpoint for deployment monitoring."""
    return {"status": "ok", "app": "AI Personal Fitness for Everyone", "version": "1.0.0"}
