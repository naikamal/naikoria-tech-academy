"""
Agent State Management for LangGraph
"""
from typing import TypedDict, List, Dict, Any, Optional
from langchain.schema import BaseMessage

class AgentState(TypedDict):
    """State shared across all agents"""
    messages: List[BaseMessage]
    context: Dict[str, Any]
    user_id: Optional[int]
    course_id: Optional[int]
    session_data: Dict[str, Any]
    
    # Agent-specific data
    analysis_results: Optional[Dict[str, Any]]
    generated_content: Optional[Dict[str, Any]]
    recommendations: Optional[List[str]]
    confidence_score: Optional[float]
    
    # Error handling
    error_message: Optional[str]
    retry_count: int