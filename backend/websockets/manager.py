"""
WebSocket Connection Manager
Handles WebSocket connections for real-time communication
"""

import json
import logging
from typing import List, Dict, Any
from fastapi import WebSocket, WebSocketDisconnect
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConnectionManager:
    """
    Manages WebSocket connections for real-time communication
    """
    
    def __init__(self):
        """Initialize the connection manager"""
        self.active_connections: List[WebSocket] = []
        self.connection_metadata: Dict[WebSocket, Dict[str, Any]] = {}
    
    async def connect(self, websocket: WebSocket, client_info: Dict[str, Any] = None) -> None:
        """
        Accept a new WebSocket connection
        
        Args:
            websocket: The WebSocket connection
            client_info: Optional client information
        """
        await websocket.accept()
        self.active_connections.append(websocket)
        
        # Store client metadata
        metadata = {
            "connected_at": datetime.now().isoformat(),
            "client_info": client_info or {},
            "connection_id": id(websocket)
        }
        self.connection_metadata[websocket] = metadata
        
        logger.info(f"New WebSocket connection established. Total connections: {len(self.active_connections)}")
        
        # Send welcome message
        await self.send_personal_message({
            "type": "connection_established",
            "message": "Connected to Quantum Brain WebSocket",
            "timestamp": datetime.now().isoformat(),
            "connection_id": metadata["connection_id"]
        }, websocket)
    
    def disconnect(self, websocket: WebSocket) -> None:
        """
        Remove a WebSocket connection
        
        Args:
            websocket: The WebSocket connection to remove
        """
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            
        if websocket in self.connection_metadata:
            metadata = self.connection_metadata.pop(websocket)
            logger.info(f"WebSocket connection {metadata['connection_id']} disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: Dict[str, Any], websocket: WebSocket) -> None:
        """
        Send a message to a specific WebSocket connection
        
        Args:
            message: The message to send
            websocket: The target WebSocket connection
        """
        try:
            await websocket.send_text(json.dumps(message))
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")
            self.disconnect(websocket)
    
    async def broadcast(self, message: Dict[str, Any], exclude: WebSocket = None) -> None:
        """
        Broadcast a message to all active connections
        
        Args:
            message: The message to broadcast
            exclude: Optional WebSocket connection to exclude from broadcast
        """
        if not self.active_connections:
            logger.warning("No active connections to broadcast to")
            return
        
        # Add timestamp if not present
        if "timestamp" not in message:
            message["timestamp"] = datetime.now().isoformat()
        
        disconnected_connections = []
        
        for connection in self.active_connections:
            if connection == exclude:
                continue
                
            try:
                await connection.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error broadcasting to connection: {e}")
                disconnected_connections.append(connection)
        
        # Clean up disconnected connections
        for connection in disconnected_connections:
            self.disconnect(connection)
    
    async def broadcast_system_status(self, status: str, details: Dict[str, Any] = None) -> None:
        """
        Broadcast system status update to all connections
        
        Args:
            status: The system status (online, offline, maintenance, etc.)
            details: Optional additional status details
        """
        message = {
            "type": "system_status",
            "status": status,
            "details": details or {},
            "timestamp": datetime.now().isoformat()
        }
        
        await self.broadcast(message)
        logger.info(f"System status broadcasted: {status}")
    
    async def broadcast_agent_update(self, agent_id: str, agent_data: Dict[str, Any]) -> None:
        """
        Broadcast agent status update to all connections
        
        Args:
            agent_id: The agent identifier
            agent_data: The agent data to broadcast
        """
        message = {
            "type": "agent_update",
            "agent_id": agent_id,
            "data": agent_data,
            "timestamp": datetime.now().isoformat()
        }
        
        await self.broadcast(message)
        logger.info(f"Agent update broadcasted for agent: {agent_id}")
    
    async def broadcast_task_update(self, task_id: str, task_data: Dict[str, Any]) -> None:
        """
        Broadcast task status update to all connections
        
        Args:
            task_id: The task identifier
            task_data: The task data to broadcast
        """
        message = {
            "type": "task_update",
            "task_id": task_id,
            "data": task_data,
            "timestamp": datetime.now().isoformat()
        }
        
        await self.broadcast(message)
        logger.info(f"Task update broadcasted for task: {task_id}")
    
    def get_connection_count(self) -> int:
        """
        Get the number of active connections
        
        Returns:
            Number of active WebSocket connections
        """
        return len(self.active_connections)
    
    def get_connection_info(self) -> List[Dict[str, Any]]:
        """
        Get information about all active connections
        
        Returns:
            List of connection metadata
        """
        return [
            {
                "connection_id": metadata["connection_id"],
                "connected_at": metadata["connected_at"],
                "client_info": metadata["client_info"]
            }
            for metadata in self.connection_metadata.values()
        ]

# Global connection manager instance
connection_manager = ConnectionManager()
