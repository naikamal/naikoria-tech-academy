"""
AI Agent Orchestrator for Naikoria Tech Academy
Routes requests to appropriate LangGraph agents
"""
from typing import Dict, Any, Optional
import structlog
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolExecutor
from langchain.schema import BaseMessage, HumanMessage, AIMessage

from .agents import (
    PersonalTutorAgent,
    ContentCuratorAgent,
    LearningAnalyticsAgent,
    AssignmentGraderAgent,
    LectureTranscriptionAgent,
    DiscussionModeratorAgent
)
from .state import AgentState
from config import settings

logger = structlog.get_logger()

class AgentOrchestrator:
    """Orchestrates AI agents and routes requests"""
    
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4",
            api_key=settings.openai_api_key,
            temperature=0.3
        )
        
        self.agents = {}
        self.execution_history = []
    
    async def initialize(self):
        """Initialize all AI agents"""
        try:
            # Initialize individual agents
            self.agents = {
                'personal_tutor': PersonalTutorAgent(self.llm),
                'content_curator': ContentCuratorAgent(self.llm),
                'analytics': LearningAnalyticsAgent(self.llm),
                'assignment_grader': AssignmentGraderAgent(self.llm),
                'transcription': LectureTranscriptionAgent(self.llm),
                'moderator': DiscussionModeratorAgent(self.llm),
            }
            
            # Initialize each agent
            for agent_name, agent in self.agents.items():
                await agent.initialize()
                logger.info(f"✅ {agent_name} agent initialized")
            
            logger.info("🤖 All AI agents initialized successfully")
            
        except Exception as e:
            logger.error("Failed to initialize agents", error=str(e))
            raise
    
    async def route_request(self, agent_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Route request to appropriate agent"""
        try:
            if agent_type not in self.agents:
                raise ValueError(f"Unknown agent type: {agent_type}")
            
            agent = self.agents[agent_type]
            
            # Create initial state
            state = AgentState(
                messages=[HumanMessage(content=str(data))],
                context=data,
                user_id=data.get('user_id'),
                course_id=data.get('course_id'),
                session_data={}
            )
            
            # Process with agent
            result = await agent.process(state)
            
            # Record execution
            execution_record = {
                'agent_type': agent_type,
                'input_data': data,
                'output_data': result,
                'success': True,
                'timestamp': None  # Will be set by database
            }
            self.execution_history.append(execution_record)
            
            logger.info(
                "Agent request processed",
                agent_type=agent_type,
                user_id=data.get('user_id')
            )
            
            return result
            
        except Exception as e:
            logger.error(
                "Agent request failed",
                agent_type=agent_type,
                error=str(e),
                user_id=data.get('user_id')
            )
            
            # Record failed execution
            execution_record = {
                'agent_type': agent_type,
                'input_data': data,
                'output_data': {'error': str(e)},
                'success': False,
                'timestamp': None
            }
            self.execution_history.append(execution_record)
            
            raise
    
    async def get_status(self) -> Dict[str, Any]:
        """Get status of all agents"""
        status = {
            'agents': {},
            'total_executions': len(self.execution_history),
            'successful_executions': sum(1 for exec in self.execution_history if exec['success']),
            'failed_executions': sum(1 for exec in self.execution_history if not exec['success'])
        }
        
        for agent_name, agent in self.agents.items():
            status['agents'][agent_name] = {
                'status': 'active',
                'description': agent.description,
                'capabilities': agent.capabilities
            }
        
        return status
    
    async def record_feedback(
        self, 
        agent_type: str,
        execution_id: str,
        rating: int,
        feedback: str,
        user_id: int
    ):
        """Record feedback for agent performance"""
        feedback_record = {
            'agent_type': agent_type,
            'execution_id': execution_id,
            'rating': rating,
            'feedback': feedback,
            'user_id': user_id,
            'timestamp': None
        }
        
        # In production, save to database
        logger.info(
            "Agent feedback recorded",
            agent_type=agent_type,
            rating=rating,
            user_id=user_id
        )
    
    async def get_agent_recommendations(self, user_data: Dict[str, Any]) -> List[str]:
        """Get AI-powered recommendations for user"""
        try:
            # Use analytics agent to generate recommendations
            result = await self.route_request(
                agent_type="analytics",
                data={
                    "action": "generate_recommendations",
                    "user_data": user_data,
                    "user_id": user_data.get("user_id")
                }
            )
            
            return result.get("recommendations", [])
            
        except Exception as e:
            logger.error("Failed to get recommendations", error=str(e))
            return []