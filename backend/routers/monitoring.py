"""
Monitoring Router
WebSocket endpoints for real-time monitoring and communication
"""

import json
import logging
from typing import Dict, Any
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from datetime import datetime
import random

from websockets.manager import connection_manager
from services.entanglement_map import get_entanglement_analysis, get_entangled_metrics, detect_anomaly
from services.probabilistic_analyzer import analyze_root_cause, get_superposition_confidence, get_quantum_recommendations
from services.cognition_engine import run_parallel_analysis, get_cognition_summary
from services.optimization_model import find_optimal_solution

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/monitoring", tags=["monitoring"])

def generate_system_metrics() -> Dict[str, float]:
    """
    Generate realistic system metrics for demonstration
    """
    # Base metrics with some randomness
    base_metrics = {
        "cpu_usage": random.uniform(20, 95),  # Sometimes high to trigger anomalies
        "memory_usage": random.uniform(30, 90),
        "disk_usage": random.uniform(25, 85),
        "network_io": random.uniform(100, 1200),
        "database_connections": random.uniform(10, 90),
        "cache_hit_rate": random.uniform(60, 95),
        "active_users": random.uniform(1000, 12000),
        "api_latency_p99": random.uniform(100, 1200),
        "error_rate": random.uniform(0.1, 8.0),
        "request_rate": random.uniform(200, 1500)
    }
    
    return base_metrics

async def broadcast_superposition_analysis():
    """
    Generate metrics, analyze for anomalies, and broadcast superposition state.
    """
    try:
        # Generate current system metrics
        current_metrics = generate_system_metrics()
        
        # Analyze for anomalies and entanglement
        entanglement_analysis = get_entanglement_analysis(current_metrics)
        
        # Perform probabilistic root cause analysis
        root_cause_probabilities = analyze_root_cause(current_metrics)
        superposition_confidence = get_superposition_confidence(root_cause_probabilities)
        quantum_recommendations = get_quantum_recommendations(root_cause_probabilities)
        
        # Run parallel cognition analysis
        cognition_analysis = await run_parallel_analysis(root_cause_probabilities)
        cognition_summary = get_cognition_summary(cognition_analysis)
        
        # Find optimal solution if root cause is confirmed
        optimal_solution = None
        if cognition_summary["confirmed_root_cause"]:
            optimal_solution = find_optimal_solution(cognition_summary["confirmed_root_cause"])
        
        # Determine if we have anomalies
        has_anomalies = entanglement_analysis["has_anomalies"]
        
        if has_anomalies:
            # Send superposition anomaly message
            message = {
                "type": "superposition_anomaly",
                "payload": current_metrics,
                "superposition_state": {
                    "probabilities": root_cause_probabilities,
                    "confidence": superposition_confidence,
                    "recommendations": quantum_recommendations,
                    "primaryAnomaly": entanglement_analysis["primary_anomaly"],
                    "anomalyLevel": entanglement_analysis["primary_anomaly_level"],
                    "entangledMetrics": entanglement_analysis["entangled_metrics"],
                    "confirmed_root_cause": cognition_summary["confirmed_root_cause"],
                    "confirmed_details": cognition_summary["confirmed_details"],
                    "confirmed_severity": cognition_summary["confirmed_severity"],
                    "all_confirmed_causes": cognition_summary["all_confirmed_causes"],
                    "investigation_confidence": cognition_summary["investigation_confidence"],
                    "total_investigation_time": cognition_summary["total_investigation_time"],
                    "investigation_timestamp": cognition_summary["investigation_timestamp"],
                    "optimal_solution": optimal_solution
                },
                "timestamp": datetime.now().isoformat()
            }
        else:
            # Send normal system status
            message = {
                "type": "system_status",
                "payload": current_metrics,
                "superposition_state": {
                    "probabilities": {},
                    "confidence": 0.0,
                    "recommendations": [],
                    "primaryAnomaly": None,
                    "anomalyLevel": None,
                    "entangledMetrics": [],
                    "confirmed_root_cause": None,
                    "confirmed_details": None,
                    "confirmed_severity": None,
                    "all_confirmed_causes": [],
                    "investigation_confidence": 0.0,
                    "total_investigation_time": 0.0,
                    "investigation_timestamp": datetime.now().isoformat(),
                    "optimal_solution": None
                },
                "timestamp": datetime.now().isoformat()
            }
        
        # Broadcast to all connected clients
        await connection_manager.broadcast(message)
        logger.info(f"Broadcasted superposition analysis with cognition and optimization results: "
                   f"{len(root_cause_probabilities)} potential causes, "
                   f"confirmed: {cognition_summary['confirmed_root_cause']}, "
                   f"optimal solution: {optimal_solution['action'] if optimal_solution else 'None'}")
        
    except Exception as e:
        logger.error(f"Error in broadcast_superposition_analysis: {e}")

async def periodic_metric_broadcast():
    """
    Periodically broadcast entangled metrics to all connected clients
    """
    import asyncio
    while True:
        try:
            await asyncio.sleep(5)  # Broadcast every 5 seconds
            await broadcast_superposition_analysis()
        except Exception as e:
            logger.error(f"Error in periodic metric broadcast: {e}")
            await asyncio.sleep(1)  # Wait before retrying

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time monitoring
    
    Handles:
    - New client connections
    - Message broadcasting
    - Connection management
    - Real-time updates
    """
    client_info = {
        "user_agent": websocket.headers.get("user-agent", "unknown"),
        "origin": websocket.headers.get("origin", "unknown"),
        "connected_at": datetime.now().isoformat()
    }
    
    try:
        # Accept the connection
        await connection_manager.connect(websocket, client_info)
        
        # Send initial system status with entangled metrics
        await broadcast_superposition_analysis()
        
        # Start periodic metric broadcasting
        import asyncio
        broadcast_task = asyncio.create_task(periodic_metric_broadcast())
        
        # Keep the connection alive and handle messages
        while True:
            try:
                # Wait for messages from the client
                data = await websocket.receive_text()
                
                try:
                    message = json.loads(data)
                    await handle_client_message(websocket, message)
                except json.JSONDecodeError:
                    # Handle non-JSON messages
                    await connection_manager.send_personal_message({
                        "type": "error",
                        "message": "Invalid JSON format",
                        "timestamp": datetime.now().isoformat()
                    }, websocket)
                
            except WebSocketDisconnect:
                logger.info("Client disconnected from WebSocket")
                break
            except Exception as e:
                logger.error(f"Error handling WebSocket message: {e}")
                await connection_manager.send_personal_message({
                    "type": "error",
                    "message": f"Server error: {str(e)}",
                    "timestamp": datetime.now().isoformat()
                }, websocket)
                
    except WebSocketDisconnect:
        logger.info("WebSocket connection closed")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        # Clean up the connection
        if 'broadcast_task' in locals():
            broadcast_task.cancel()
        connection_manager.disconnect(websocket)

async def handle_client_message(websocket: WebSocket, message: Dict[str, Any]) -> None:
    """
    Handle incoming messages from WebSocket clients
    
    Args:
        websocket: The WebSocket connection
        message: The parsed message from the client
    """
    message_type = message.get("type", "unknown")
    
    try:
        if message_type == "ping":
            # Respond to ping with pong
            await connection_manager.send_personal_message({
                "type": "pong",
                "timestamp": datetime.now().isoformat()
            }, websocket)
            
        elif message_type == "subscribe":
            # Handle subscription requests
            subscription_type = message.get("subscription", "all")
            await connection_manager.send_personal_message({
                "type": "subscription_confirmed",
                "subscription": subscription_type,
                "message": f"Subscribed to {subscription_type} updates",
                "timestamp": datetime.now().isoformat()
            }, websocket)
            
        elif message_type == "request_status":
            # Send current system status
            await connection_manager.send_personal_message({
                "type": "system_status",
                "status": "online",
                "details": {
                    "active_connections": connection_manager.get_connection_count(),
                    "uptime": "operational",
                    "timestamp": datetime.now().isoformat()
                }
            }, websocket)
            
        elif message_type == "request_connections":
            # Send connection information
            connections = connection_manager.get_connection_info()
            await connection_manager.send_personal_message({
                "type": "connection_info",
                "connections": connections,
                "total_connections": len(connections),
                "timestamp": datetime.now().isoformat()
            }, websocket)
            
        else:
            # Echo unknown message types back to sender
            await connection_manager.send_personal_message({
                "type": "message_received",
                "original_message": message,
                "timestamp": datetime.now().isoformat()
            }, websocket)
            
    except Exception as e:
        logger.error(f"Error handling client message: {e}")
        await connection_manager.send_personal_message({
            "type": "error",
            "message": f"Error processing message: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }, websocket)

@router.get("/status")
async def get_monitoring_status():
    """
    Get current monitoring system status
    
    Returns:
        Current status of the monitoring system
    """
    return {
        "status": "operational",
        "active_connections": connection_manager.get_connection_count(),
        "connection_info": connection_manager.get_connection_info(),
        "timestamp": datetime.now().isoformat(),
        "features": [
            "Real-time WebSocket communication",
            "Connection management",
            "Message broadcasting",
            "System status updates",
            "Agent monitoring",
            "Task tracking"
        ]
    }

@router.post("/broadcast")
async def broadcast_message(message: Dict[str, Any]):
    """
    Broadcast a message to all connected WebSocket clients
    
    Args:
        message: The message to broadcast
        
    Returns:
        Confirmation of broadcast
    """
    try:
        await connection_manager.broadcast({
            "type": "admin_broadcast",
            "message": message,
            "timestamp": datetime.now().isoformat()
        })
        
        return {
            "status": "success",
            "message": "Broadcast sent successfully",
            "recipients": connection_manager.get_connection_count(),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error broadcasting message: {e}")
        raise HTTPException(status_code=500, detail=f"Broadcast failed: {str(e)}")

@router.post("/system-status")
async def update_system_status(status: str, details: Dict[str, Any] = None):
    """
    Update and broadcast system status
    
    Args:
        status: The new system status
        details: Optional additional status details
        
    Returns:
        Confirmation of status update
    """
    try:
        await connection_manager.broadcast_system_status(status, details)
        
        return {
            "status": "success",
            "message": f"System status updated to: {status}",
            "recipients": connection_manager.get_connection_count(),
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error updating system status: {e}")
        raise HTTPException(status_code=500, detail=f"Status update failed: {str(e)}")
