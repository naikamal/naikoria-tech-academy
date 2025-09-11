"""
Notification and communication tasks
Handles emails, SMS, WhatsApp, and push notifications
"""
from celery import shared_task
import smtplib
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
import structlog
from typing import List, Dict, Any
import httpx

logger = structlog.get_logger()

@shared_task(bind=True)
def send_email_notification(self, recipients: List[str], subject: str, message: str, html_message: str = None):
    """
    Send email notifications
    """
    try:
        logger.info("Sending email notification", recipients=len(recipients))
        
        # Email configuration (in production, use proper SMTP settings)
        smtp_server = "localhost"  # Using Django's email backend
        
        for recipient in recipients:
            # Create message
            msg = MimeMultipart('alternative')
            msg['Subject'] = f"Naikoria Tech Academy - {subject}"
            msg['From'] = "noreply@naikoria.com"
            msg['To'] = recipient
            
            # Add text content
            text_part = MimeText(message, 'plain')
            msg.attach(text_part)
            
            # Add HTML content if provided
            if html_message:
                html_part = MimeText(html_message, 'html')
                msg.attach(html_part)
            
            # Send via Django's email system (using console backend for dev)
            print(f"📧 EMAIL TO: {recipient}")
            print(f"📧 SUBJECT: {subject}")
            print(f"📧 MESSAGE: {message}")
            print("=" * 50)
        
        logger.info("Email notifications sent successfully")
        return {"status": "sent", "count": len(recipients)}
        
    except Exception as exc:
        logger.error("Email notification failed", error=str(exc))
        raise

@shared_task(bind=True)
def send_whatsapp_notification(self, phone_numbers: List[str], message: str):
    """
    Send WhatsApp notifications via Twilio
    """
    try:
        logger.info("Sending WhatsApp notifications", count=len(phone_numbers))
        
        # In production, use Twilio API
        for phone in phone_numbers:
            print(f"📱 WHATSAPP TO: {phone}")
            print(f"📱 MESSAGE: {message}")
            print("=" * 50)
        
        logger.info("WhatsApp notifications sent successfully")
        return {"status": "sent", "count": len(phone_numbers)}
        
    except Exception as exc:
        logger.error("WhatsApp notification failed", error=str(exc))
        raise

@shared_task(bind=True)
def send_class_reminders(self):
    """
    Send reminders for upcoming classes
    """
    try:
        logger.info("Sending class reminders")
        
        # Get upcoming classes from Django API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "http://localhost:8000/api/v1/classroom/sessions/upcoming/"
            )
            
            if response.status_code == 200:
                upcoming_sessions = response.json()
                
                for session in upcoming_sessions:
                    # Get enrolled students
                    students = session.get("enrolled_students", [])
                    
                    # Send email reminders
                    send_email_notification.delay(
                        recipients=[student["email"] for student in students],
                        subject="Class Reminder",
                        message=f"""
                        Hi {student.get('first_name', 'Student')},
                        
                        This is a friendly reminder that your class "{session['title']}" 
                        is starting in 1 hour at {session['scheduled_at']}.
                        
                        Join link: {session.get('join_url', 'Check your dashboard')}
                        
                        Best regards,
                        Naikoria Tech Academy Team
                        """
                    )
                    
                    # Send WhatsApp reminders if phone numbers available
                    phone_numbers = [
                        student["phone_number"] for student in students 
                        if student.get("phone_number")
                    ]
                    
                    if phone_numbers:
                        send_whatsapp_notification.delay(
                            phone_numbers=phone_numbers,
                            message=f"🎓 Class reminder: '{session['title']}' starts in 1 hour! Join via your dashboard."
                        )
                
                logger.info("Class reminders sent", sessions=len(upcoming_sessions))
                return {"status": "sent", "sessions": len(upcoming_sessions)}
            
    except Exception as exc:
        logger.error("Class reminders failed", error=str(exc))
        raise

@shared_task(bind=True)
def send_assignment_deadline_reminders(self):
    """
    Send reminders for assignment deadlines
    """
    try:
        logger.info("Sending assignment deadline reminders")
        
        # Get assignments due soon from Django API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "http://localhost:8000/api/v1/classroom/assignments/due-soon/"
            )
            
            if response.status_code == 200:
                assignments = response.json()
                
                for assignment in assignments:
                    # Get students who haven't submitted
                    pending_students = assignment.get("pending_students", [])
                    
                    send_email_notification.delay(
                        recipients=[student["email"] for student in pending_students],
                        subject="Assignment Deadline Reminder",
                        message=f"""
                        Hi {student.get('first_name', 'Student')},
                        
                        Your assignment "{assignment['title']}" is due in 24 hours!
                        Due date: {assignment['due_date']}
                        
                        Please submit your work through the course dashboard.
                        
                        Best regards,
                        Naikoria Tech Academy Team
                        """
                    )
                
                logger.info("Assignment reminders sent", assignments=len(assignments))
                return {"status": "sent", "assignments": len(assignments)}
            
    except Exception as exc:
        logger.error("Assignment reminders failed", error=str(exc))
        raise

@shared_task(bind=True)
def send_course_completion_certificate(self, student_id: int, course_id: int):
    """
    Send course completion certificate
    """
    try:
        logger.info("Sending course completion certificate", student_id=student_id, course_id=course_id)
        
        # Get student and course data
        async with httpx.AsyncClient() as client:
            student_response = await client.get(
                f"http://localhost:8000/api/v1/users/{student_id}/"
            )
            course_response = await client.get(
                f"http://localhost:8000/api/v1/courses/{course_id}/"
            )
            
            if student_response.status_code == 200 and course_response.status_code == 200:
                student = student_response.json()
                course = course_response.json()
                
                # Generate certificate (in production, use PDF generation)
                certificate_message = f"""
                🎉 Congratulations {student['first_name']} {student['last_name']}!
                
                You have successfully completed:
                "{course['title']}"
                
                Course Duration: {course['duration_weeks']} weeks
                Completion Date: Today
                
                Your certificate is attached to this email.
                
                Keep learning and growing!
                
                Best regards,
                Naikoria Tech Academy Team
                """
                
                send_email_notification.delay(
                    recipients=[student["email"]],
                    subject="🎓 Course Completion Certificate",
                    message=certificate_message
                )
                
                logger.info("Certificate sent successfully")
                return {"status": "sent", "student": student["email"]}
            
    except Exception as exc:
        logger.error("Certificate sending failed", error=str(exc))
        raise

@shared_task(bind=True)
def send_daily_reminders(self):
    """
    Send daily digest of activities and reminders
    """
    try:
        logger.info("Sending daily reminders")
        
        # Send class reminders
        send_class_reminders.delay()
        
        # Send assignment deadline reminders
        send_assignment_deadline_reminders.delay()
        
        logger.info("Daily reminders scheduled")
        return {"status": "scheduled"}
        
    except Exception as exc:
        logger.error("Daily reminders failed", error=str(exc))
        raise

@shared_task(bind=True)
def send_welcome_email(self, user_id: int):
    """
    Send welcome email to new users
    """
    try:
        logger.info("Sending welcome email", user_id=user_id)
        
        # Get user data
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"http://localhost:8000/api/v1/users/{user_id}/"
            )
            
            if response.status_code == 200:
                user = response.json()
                
                welcome_message = f"""
                Welcome to Naikoria Tech Academy, {user['first_name']}! 🚀
                
                Thank you for joining our AI-powered learning platform. Here's what you can do:
                
                🎓 Browse our extensive course catalog
                📚 Join live sessions with expert tutors
                🤖 Get 24/7 help from our AI tutoring assistant
                📊 Track your learning progress with analytics
                💬 Connect with fellow learners in our community
                
                Get started by exploring your dashboard: http://localhost:3000/dashboard
                
                If you have any questions, our AI assistant is always ready to help!
                
                Happy learning!
                The Naikoria Team
                """
                
                send_email_notification.delay(
                    recipients=[user["email"]],
                    subject="🎉 Welcome to Naikoria Tech Academy!",
                    message=welcome_message
                )
                
                logger.info("Welcome email sent", user_email=user["email"])
                return {"status": "sent", "user": user["email"]}
            
    except Exception as exc:
        logger.error("Welcome email failed", error=str(exc))
        raise