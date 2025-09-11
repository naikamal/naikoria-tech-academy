"""
Naikoria Tech Academy - FastAPI AI Service
Real-time Features & AI Agents powered by LangGraph
"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import structlog
import redis.asyncio as redis
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Import our modules
from config import settings
from auth import verify_token, get_current_user
from ai_agents import AgentOrchestrator
from websocket_manager import ConnectionManager
from database import init_database

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Global instances
redis_client = None
agent_orchestrator = None
websocket_manager = ConnectionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan management"""
    global redis_client, agent_orchestrator
    
    # Startup
    logger.info("🚀 Starting Naikoria AI Service...")
    
    # Initialize Redis
    redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    
    # Initialize AI Agent Orchestrator
    agent_orchestrator = AgentOrchestrator()
    await agent_orchestrator.initialize()
    
    # Initialize database
    await init_database()
    
    logger.info("✅ Naikoria AI Service started successfully")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down Naikoria AI Service...")
    await redis_client.close()
    logger.info("✅ Shutdown complete")

# Create FastAPI app
app = FastAPI(
    title="Naikoria Tech Academy - AI Service",
    description="AI-Powered Real-time Features and LangGraph Agents",
    version="1.0.0",
    docs_url="/ai/docs",
    redoc_url="/ai/redoc",
    openapi_url="/ai/openapi.json",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = {}
    user_id: int
    course_id: Optional[int] = None

class AgentResponse(BaseModel):
    response: str
    agent_type: str
    confidence: Optional[float] = None
    suggestions: Optional[List[str]] = []
    metadata: Optional[Dict[str, Any]] = {}

class QuizGenerationRequest(BaseModel):
    content: str
    course_id: int
    difficulty: str = "intermediate"
    num_questions: int = 5

# Root endpoint
@app.get("/")
async def root():
    return {
        "service": "Naikoria AI Service",
        "version": "1.0.0",
        "status": "running",
        "features": [
            "AI Tutoring Assistant",
            "Content Generation",
            "Real-time Chat",
            "WebSocket Support",
            "LangGraph Agents"
        ]
    }

# Health check
@app.get("/health")
async def health_check():
    try:
        # Check Redis connection
        await redis_client.ping()
        
        return {
            "status": "healthy",
            "services": {
                "redis": "connected",
                "agents": "ready",
                "websockets": f"{len(websocket_manager.active_connections)} connections"
            }
        }
    except Exception as e:
        logger.error("Health check failed", error=str(e))
        raise HTTPException(status_code=503, detail="Service unavailable")

# AI Agent endpoints
@app.post("/ai/tutor/chat", response_model=AgentResponse)
async def ai_tutor_chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """Personal AI Tutor - 24/7 student support"""
    try:
        response = await agent_orchestrator.route_request(
            agent_type="personal_tutor",
            data={
                "message": request.message,
                "context": request.context,
                "user_id": request.user_id,
                "course_id": request.course_id
            }
        )
        
        return AgentResponse(
            response=response["answer"],
            agent_type="personal_tutor",
            confidence=response.get("confidence"),
            suggestions=response.get("suggestions", []),
            metadata=response.get("metadata", {})
        )
    except Exception as e:
        logger.error("AI tutor chat failed", error=str(e))
        raise HTTPException(status_code=500, detail="AI service error")

@app.post("/ai/generate/quiz")
async def generate_quiz(
    request: QuizGenerationRequest,
    current_user: dict = Depends(get_current_user)
):
    """Content Curator Agent - Generate quiz questions"""
    try:
        if current_user.get("user_type") != "tutor":
            raise HTTPException(status_code=403, detail="Only tutors can generate quizzes")
        
        response = await agent_orchestrator.route_request(
            agent_type="content_curator",
            data={
                "action": "generate_quiz",
                "content": request.content,
                "course_id": request.course_id,
                "difficulty": request.difficulty,
                "num_questions": request.num_questions,
                "user_id": current_user["user_id"]
            }
        )
        
        return {
            "questions": response["questions"],
            "metadata": response.get("metadata", {}),
            "agent_type": "content_curator"
        }
    except Exception as e:
        logger.error("Quiz generation failed", error=str(e))
        raise HTTPException(status_code=500, detail="Quiz generation error")

@app.post("/ai/analyze/assignment")
async def analyze_assignment(
    assignment_data: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    """Assignment Grader Agent - Analyze and grade assignments"""
    try:
        response = await agent_orchestrator.route_request(
            agent_type="assignment_grader",
            data={
                "assignment": assignment_data,
                "user_id": current_user["user_id"]
            }
        )
        
        return {
            "score": response["score"],
            "feedback": response["feedback"],
            "suggestions": response.get("suggestions", []),
            "rubric_breakdown": response.get("rubric_breakdown", {}),
            "agent_type": "assignment_grader"
        }
    except Exception as e:
        logger.error("Assignment analysis failed", error=str(e))
        raise HTTPException(status_code=500, detail="Assignment analysis error")

# WebSocket endpoints for real-time features
@app.websocket("/ws/chat/{room_id}")
async def websocket_chat(websocket: WebSocket, room_id: str):
    """Real-time chat for live sessions"""
    await websocket_manager.connect(websocket, room_id)
    try:
        while True:
            # Receive message
            data = await websocket.receive_json()
            
            # Process message through AI if needed
            if data.get("ai_assist"):
                ai_response = await agent_orchestrator.route_request(
                    agent_type="discussion_moderator",
                    data={
                        "message": data["message"],
                        "room_id": room_id,
                        "user_id": data["user_id"]
                    }
                )
                data["ai_suggestions"] = ai_response.get("suggestions", [])
            
            # Broadcast to room
            await websocket_manager.broadcast_to_room(room_id, data)
            
    except Exception as e:
        logger.error("WebSocket chat error", error=str(e), room_id=room_id)
    finally:
        websocket_manager.disconnect(websocket, room_id)

@app.websocket("/ws/live-session/{session_id}")
async def websocket_live_session(websocket: WebSocket, session_id: str):
    """Real-time live session features"""
    await websocket_manager.connect(websocket, f"session_{session_id}")
    try:
        while True:
            data = await websocket.receive_json()
            
            # Handle different message types
            if data["type"] == "whiteboard_update":
                await websocket_manager.broadcast_to_room(
                    f"session_{session_id}", 
                    data, 
                    exclude_sender=websocket
                )
            elif data["type"] == "poll_response":
                # Process poll response
                await handle_poll_response(session_id, data)
            elif data["type"] == "question":
                # Route to AI tutor for instant help
                ai_response = await agent_orchestrator.route_request(
                    agent_type="personal_tutor",
                    data={
                        "message": data["message"],
                        "session_id": session_id,
                        "user_id": data["user_id"]
                    }
                )
                await websocket.send_json({
                    "type": "ai_response",
                    "response": ai_response["answer"],
                    "agent_type": "personal_tutor"
                })
                
    except Exception as e:
        logger.error("Live session WebSocket error", error=str(e), session_id=session_id)
    finally:
        websocket_manager.disconnect(websocket, f"session_{session_id}")

async def handle_poll_response(session_id: str, data: Dict[str, Any]):
    """Handle poll responses in live sessions"""
    # Store poll response in Redis
    poll_key = f"poll:{session_id}:{data['poll_id']}"
    await redis_client.hincrby(poll_key, data["selected_option"], 1)
    
    # Get updated results
    results = await redis_client.hgetall(poll_key)
    
    # Broadcast updated results
    await websocket_manager.broadcast_to_room(f"session_{session_id}", {
        "type": "poll_update",
        "poll_id": data["poll_id"],
        "results": results
    })

# Agent status and management
@app.get("/ai/agents/status")
async def get_agent_status(current_user: dict = Depends(get_current_user)):
    """Get status of all AI agents"""
    if current_user.get("user_type") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return await agent_orchestrator.get_status()

@app.post("/ai/agents/feedback")
async def submit_agent_feedback(
    feedback_data: Dict[str, Any],
    current_user: dict = Depends(get_current_user)
):
    """Submit feedback for AI agent responses"""
    try:
        await agent_orchestrator.record_feedback(
            agent_type=feedback_data["agent_type"],
            execution_id=feedback_data["execution_id"],
            rating=feedback_data["rating"],
            feedback=feedback_data.get("feedback", ""),
            user_id=current_user["user_id"]
        )
        
        return {"message": "Feedback recorded successfully"}
    except Exception as e:
        logger.error("Feedback submission failed", error=str(e))
        raise HTTPException(status_code=500, detail="Feedback submission error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_config=None  # Use our structured logging
    )