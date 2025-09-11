#!/usr/bin/env python3
"""
Startup script for Naikoria AI Service
"""
import uvicorn
import os
import sys

def main():
    """Run the FastAPI service"""
    
    # Add current directory to Python path
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, current_dir)
    
    print("🚀 Starting Naikoria Tech Academy AI Service...")
    print("🤖 AI Agents: Personal Tutor, Content Curator, Assignment Grader")
    print("⚡ WebSocket: Real-time chat, live sessions, collaboration")
    print("📊 Analytics: Learning insights and recommendations")
    print("")
    print("🔗 Service URL: http://localhost:8001")
    print("📚 API Docs: http://localhost:8001/ai/docs")
    print("🔄 WebSocket Test: ws://localhost:8001/ws/chat/test-room")
    print("")
    
    # Run with uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info",
        access_log=True,
        workers=1  # Single worker for development
    )

if __name__ == "__main__":
    main()