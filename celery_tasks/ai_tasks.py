"""
AI-related background tasks
Handles content generation, analysis, and processing
"""
from celery import shared_task
import httpx
import json
import structlog
from typing import Dict, Any

logger = structlog.get_logger()

@shared_task(bind=True, max_retries=3)
def process_lecture_transcription(self, audio_file_path: str, session_id: str):
    """
    Transcribe lecture audio using AI
    """
    try:
        logger.info("Starting lecture transcription", session_id=session_id)
        
        # Call FastAPI AI service for transcription
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:8001/ai/analyze/transcript",
                json={
                    "audio_file": audio_file_path,
                    "session_id": session_id,
                    "action": "transcribe"
                },
                timeout=300.0  # 5 minutes timeout
            )
            
            if response.status_code == 200:
                result = response.json()
                
                # Store transcript in database (via Django API)
                await store_transcript_in_database(session_id, result)
                
                logger.info("Lecture transcription completed", session_id=session_id)
                return result
            else:
                logger.error("Transcription failed", status_code=response.status_code)
                raise Exception(f"Transcription failed: {response.status_code}")
                
    except Exception as exc:
        logger.error("Transcription task failed", error=str(exc))
        if self.request.retries < self.max_retries:
            raise self.retry(countdown=60 * (self.request.retries + 1))
        raise

@shared_task(bind=True)
def generate_quiz_questions(self, course_content: str, course_id: int, difficulty: str = "intermediate"):
    """
    Generate quiz questions from course content
    """
    try:
        logger.info("Generating quiz questions", course_id=course_id)
        
        # Call FastAPI AI service
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:8001/ai/generate/quiz",
                json={
                    "content": course_content,
                    "course_id": course_id,
                    "difficulty": difficulty,
                    "num_questions": 10
                },
                timeout=120.0
            )
            
            if response.status_code == 200:
                questions = response.json()
                
                # Store questions in database via Django API
                await store_quiz_questions(course_id, questions)
                
                logger.info("Quiz generation completed", course_id=course_id)
                return questions
            else:
                raise Exception(f"Quiz generation failed: {response.status_code}")
                
    except Exception as exc:
        logger.error("Quiz generation failed", error=str(exc))
        raise

@shared_task(bind=True)
def analyze_student_performance(self, student_id: int, course_id: int):
    """
    Analyze student performance and generate recommendations
    """
    try:
        logger.info("Analyzing student performance", student_id=student_id, course_id=course_id)
        
        # Get student data from Django API
        student_data = await fetch_student_data(student_id, course_id)
        
        # Call AI analytics service
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:8001/ai/analyze/performance",
                json={
                    "student_id": student_id,
                    "course_id": course_id,
                    "student_data": student_data
                },
                timeout=60.0
            )
            
            if response.status_code == 200:
                analysis = response.json()
                
                # Store analysis results
                await store_performance_analysis(student_id, course_id, analysis)
                
                logger.info("Performance analysis completed", student_id=student_id)
                return analysis
            else:
                raise Exception(f"Performance analysis failed: {response.status_code}")
                
    except Exception as exc:
        logger.error("Performance analysis failed", error=str(exc))
        raise

@shared_task(bind=True)
def grade_assignment_batch(self, assignment_submissions: list):
    """
    Grade multiple assignment submissions using AI
    """
    try:
        logger.info("Starting batch assignment grading", count=len(assignment_submissions))
        
        results = []
        
        for submission in assignment_submissions:
            # Call AI grading service
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "http://localhost:8001/ai/analyze/assignment",
                    json=submission,
                    timeout=120.0
                )
                
                if response.status_code == 200:
                    grade_result = response.json()
                    results.append({
                        "submission_id": submission["id"],
                        "grade": grade_result
                    })
                    
                    # Update submission in database
                    await update_submission_grade(submission["id"], grade_result)
                
        logger.info("Batch grading completed", graded=len(results))
        return results
        
    except Exception as exc:
        logger.error("Batch grading failed", error=str(exc))
        raise

@shared_task(bind=True)
def generate_course_summary(self, course_id: int):
    """
    Generate AI-powered course summary and key points
    """
    try:
        logger.info("Generating course summary", course_id=course_id)
        
        # Get course content from Django API
        course_data = await fetch_course_content(course_id)
        
        # Call AI summarization service
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:8001/ai/generate/summary",
                json={
                    "course_id": course_id,
                    "content": course_data["content"],
                    "action": "summarize_course"
                },
                timeout=180.0
            )
            
            if response.status_code == 200:
                summary = response.json()
                
                # Store summary in database
                await store_course_summary(course_id, summary)
                
                logger.info("Course summary generated", course_id=course_id)
                return summary
            else:
                raise Exception(f"Summary generation failed: {response.status_code}")
                
    except Exception as exc:
        logger.error("Course summary generation failed", error=str(exc))
        raise

# Helper functions for database operations
async def store_transcript_in_database(session_id: str, transcript_data: Dict[str, Any]):
    """Store transcript via Django API"""
    async with httpx.AsyncClient() as client:
        await client.post(
            "http://localhost:8000/api/v1/classroom/sessions/{}/transcript/",
            json=transcript_data
        )

async def store_quiz_questions(course_id: int, questions: Dict[str, Any]):
    """Store quiz questions via Django API"""
    async with httpx.AsyncClient() as client:
        await client.post(
            f"http://localhost:8000/api/v1/courses/{course_id}/quiz/",
            json=questions
        )

async def fetch_student_data(student_id: int, course_id: int):
    """Fetch student data from Django API"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://localhost:8000/api/v1/analytics/student/{student_id}/course/{course_id}/"
        )
        return response.json()

async def store_performance_analysis(student_id: int, course_id: int, analysis: Dict[str, Any]):
    """Store performance analysis via Django API"""
    async with httpx.AsyncClient() as client:
        await client.post(
            f"http://localhost:8000/api/v1/analytics/performance/",
            json={
                "student_id": student_id,
                "course_id": course_id,
                "analysis": analysis
            }
        )

async def update_submission_grade(submission_id: int, grade_data: Dict[str, Any]):
    """Update assignment submission grade via Django API"""
    async with httpx.AsyncClient() as client:
        await client.patch(
            f"http://localhost:8000/api/v1/classroom/submissions/{submission_id}/",
            json={
                "score": grade_data["score"],
                "feedback": grade_data["feedback"],
                "ai_graded": True
            }
        )

async def fetch_course_content(course_id: int):
    """Fetch course content from Django API"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://localhost:8000/api/v1/courses/{course_id}/content/"
        )
        return response.json()

async def store_course_summary(course_id: int, summary: Dict[str, Any]):
    """Store course summary via Django API"""
    async with httpx.AsyncClient() as client:
        await client.post(
            f"http://localhost:8000/api/v1/courses/{course_id}/summary/",
            json=summary
        )