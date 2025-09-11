"""
WebSocket Connection Manager for Real-time Features
Handles live sessions, chat, and real-time collaboration
"""
from typing import Dict, List, Set
from fastapi import WebSocket
import json
import structlog

logger = structlog.get_logger()

class ConnectionManager:
    """Manages WebSocket connections and rooms"""
    
    def __init__(self):
        # Store active connections by room
        self.rooms: Dict[str, Set[WebSocket]] = {}
        # Store connection metadata
        self.connections: Dict[WebSocket, Dict[str, str]] = {}
    
    async def connect(self, websocket: WebSocket, room_id: str, user_data: Dict = None):
        """Accept WebSocket connection and add to room"""
        await websocket.accept()
        
        # Add to room
        if room_id not in self.rooms:
            self.rooms[room_id] = set()
        self.rooms[room_id].add(websocket)
        
        # Store connection metadata
        self.connections[websocket] = {
            "room_id": room_id,
            "user_data": user_data or {}
        }
        
        logger.info(
            "WebSocket connected",
            room_id=room_id,
            connections_in_room=len(self.rooms[room_id])
        )
        
        # Notify room about new connection
        await self.broadcast_to_room(room_id, {
            "type": "user_joined",
            "room_id": room_id,
            "user_data": user_data,
            "total_connections": len(self.rooms[room_id])
        }, exclude_sender=websocket)
    
    def disconnect(self, websocket: WebSocket, room_id: str):
        """Remove WebSocket connection"""
        # Remove from room
        if room_id in self.rooms:
            self.rooms[room_id].discard(websocket)
            if not self.rooms[room_id]:  # Remove empty room
                del self.rooms[room_id]
        
        # Remove connection metadata
        user_data = self.connections.get(websocket, {}).get("user_data", {})
        if websocket in self.connections:
            del self.connections[websocket]
        
        logger.info(
            "WebSocket disconnected",
            room_id=room_id,
            connections_in_room=len(self.rooms.get(room_id, set()))
        )
        
        # Notify room about disconnection
        if room_id in self.rooms:
            import asyncio
            asyncio.create_task(self.broadcast_to_room(room_id, {
                "type": "user_left",
                "room_id": room_id,
                "user_data": user_data,
                "total_connections": len(self.rooms[room_id])
            }))
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send message to specific WebSocket"""
        try:
            await websocket.send_text(message)
        except Exception as e:
            logger.error("Failed to send personal message", error=str(e))
    
    async def send_json_to_websocket(self, data: dict, websocket: WebSocket):
        """Send JSON data to specific WebSocket"""
        try:
            await websocket.send_json(data)
        except Exception as e:
            logger.error("Failed to send JSON to websocket", error=str(e))
    
    async def broadcast_to_room(self, room_id: str, data: dict, exclude_sender: WebSocket = None):
        """Broadcast message to all connections in room"""
        if room_id not in self.rooms:
            return
        
        disconnected = set()
        
        for websocket in self.rooms[room_id].copy():
            if exclude_sender and websocket == exclude_sender:
                continue
                
            try:
                await websocket.send_json(data)
            except Exception as e:
                logger.error(
                    "Failed to send to websocket",
                    error=str(e),
                    room_id=room_id
                )
                disconnected.add(websocket)
        
        # Clean up disconnected sockets
        for websocket in disconnected:
            self.disconnect(websocket, room_id)
    
    async def broadcast_to_all(self, data: dict):
        """Broadcast message to all active connections"""
        for room_id in list(self.rooms.keys()):
            await self.broadcast_to_room(room_id, data)
    
    def get_room_connections(self, room_id: str) -> int:
        """Get number of connections in room"""
        return len(self.rooms.get(room_id, set()))
    
    def get_all_rooms(self) -> Dict[str, int]:
        """Get all active rooms and connection counts"""
        return {room_id: len(connections) for room_id, connections in self.rooms.items()}
    
    @property
    def active_connections(self) -> int:
        """Total number of active connections"""
        return len(self.connections)