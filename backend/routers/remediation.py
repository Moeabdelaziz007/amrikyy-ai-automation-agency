"""
Remediation API Router
API endpoints for executing automated remediation actions
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging
from datetime import datetime

from services.remediation_service import execute_remediation

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/remediation", tags=["remediation"])

class RemediationRequest(BaseModel):
    """Request model for remediation execution"""
    action: str
    target: Optional[str] = ""
    parameters: Optional[Dict[str, Any]] = {}

class RemediationResponse(BaseModel):
    """Response model for remediation execution"""
    status: str
    action: str
    target: str
    details: str
    duration: float
    timestamp: str

@router.post("/execute", response_model=RemediationResponse)
async def execute_remediation_action(request: RemediationRequest):
    """
    Execute a remediation action
    
    Args:
        request: Remediation request containing action and parameters
        
    Returns:
        RemediationResponse with execution results
    """
    try:
        logger.info(f"Received remediation request: {request.action}")
        
        # Execute the remediation action
        result = await execute_remediation(request.action, request.target)
        
        # Convert to response model
        response = RemediationResponse(
            status=result.status,
            action=result.action,
            target=result.target,
            details=result.details,
            duration=result.duration,
            timestamp=result.timestamp.isoformat()
        )
        
        logger.info(f"Remediation action completed: {request.action} - {result.status}")
        return response
        
    except Exception as e:
        logger.error(f"Error executing remediation action {request.action}: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to execute remediation action: {str(e)}"
        )

@router.get("/actions")
async def get_available_actions():
    """
    Get list of available remediation actions
    
    Returns:
        List of available remediation actions
    """
    from services.remediation_service import REMEDIATION_FUNCTIONS
    
    actions = []
    for action_name, function in REMEDIATION_FUNCTIONS.items():
        actions.append({
            "action": action_name,
            "function": function.__name__,
            "description": function.__doc__ or "No description available"
        })
    
    return {
        "available_actions": actions,
        "total_count": len(actions),
        "timestamp": datetime.now().isoformat()
    }

@router.get("/status")
async def get_remediation_status():
    """
    Get remediation service status
    
    Returns:
        Service status information
    """
    return {
        "status": "operational",
        "service": "remediation",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "features": [
            "Automated remediation execution",
            "Action parameter validation",
            "Execution result tracking",
            "Error handling and logging"
        ]
    }
