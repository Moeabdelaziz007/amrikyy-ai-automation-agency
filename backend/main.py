"""
Quantum Brain - FastAPI Backend
Main application entry point for the Axon + Quantum-Brain project
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from dotenv import load_dotenv

# Import routers
from routers import monitoring, remediation, quantum_api

# Load environment variables
load_dotenv()

# Environment variables for security
API_KEY = os.getenv("BACKEND_API_KEY", "default-dev-key")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
DEBUG_MODE = os.getenv("DEBUG_MODE", "true").lower() == "true"

# Initialize FastAPI application
app = FastAPI(
    title="Quantum Brain API",
    description="Backend API for Axon + Quantum-Brain AI Project",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001",
        "https://*.replit.dev",  # Replit URLs
        "https://*.repl.co"       # Alternative Replit URLs
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(monitoring.router)
app.include_router(remediation.router)
app.include_router(quantum_api.router)

# Health check endpoint
@app.get("/")
async def root():
    """
    Root endpoint - Health check
    Returns the status of the Quantum Brain backend
    """
    return {"status": "Quantum Brain is online"}

# API Authentication endpoint
@app.post("/api/auth/verify")
async def verify_api_key(api_key: str):
    """
    Verify API key for frontend authentication
    """
    if api_key == API_KEY:
        return {"valid": True, "message": "API key verified"}
    else:
        raise HTTPException(status_code=401, detail="Invalid API key")

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint
    Returns detailed system status
    """
    return {
        "status": "healthy",
        "service": "Quantum Brain API",
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "development")
    }

# API status endpoint
@app.get("/api/status")
async def api_status():
    """
    API status endpoint
    Returns API information and available endpoints
    """
    return {
        "api": "Quantum Brain",
        "status": "operational",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "redoc": "/redoc"
        },
        "features": [
            "Agent Management",
            "Real-time WebSocket Communication",
            "Task Processing",
            "System Monitoring"
        ]
    }

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """
    Global exception handler for unhandled errors
    """
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred",
            "status": "error"
        }
    )

if __name__ == "__main__":
    # Run the application
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
