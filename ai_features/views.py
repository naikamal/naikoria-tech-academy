from django.shortcuts import render
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import json
import requests

# Use free AI alternatives instead of paid OpenAI

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_quiz(request):
    try:
        data = request.data
        topic = data.get('topic', '')
        difficulty = data.get('difficulty', 'intermediate')
        num_questions = min(data.get('num_questions', 5), 10)  # Max 10 questions
        
        if not topic:
            return Response({'error': 'Topic is required'}, status=400)
        
        prompt = f"""
        Create a {difficulty} level quiz about {topic} with {num_questions} multiple choice questions.
        
        Return the response in this JSON format:
        {{
            "title": "Quiz Title",
            "questions": [
                {{
                    "question": "Question text?",
                    "options": ["A", "B", "C", "D"],
                    "correct_answer": 0,
                    "explanation": "Why this is correct"
                }}
            ]
        }}
        """
        
        # Generate quiz using free template-based system (no API calls needed)
        try:
            # Free quiz generation using predefined templates
            quiz_templates = {
                'python': {
                    'beginner': [
                        {
                            'question': 'What is the correct way to print "Hello World" in Python?',
                            'options': ['print("Hello World")', 'echo "Hello World"', 'console.log("Hello World")', 'System.out.println("Hello World")'],
                            'correct_answer': 0,
                            'explanation': 'print() is the built-in function to display output in Python.'
                        },
                        {
                            'question': 'Which of the following is a Python data type?',
                            'options': ['int', 'string', 'boolean', 'All of the above'],
                            'correct_answer': 3,
                            'explanation': 'Python supports int, str (string), bool (boolean), and many other data types.'
                        }
                    ],
                    'intermediate': [
                        {
                            'question': 'What is the purpose of the __init__ method in Python?',
                            'options': ['To initialize object attributes', 'To delete objects', 'To import modules', 'To handle errors'],
                            'correct_answer': 0,
                            'explanation': '__init__ is the constructor method that initializes new objects when they are created.'
                        }
                    ]
                },
                'mathematics': {
                    'beginner': [
                        {
                            'question': 'What is 2 + 2?',
                            'options': ['3', '4', '5', '6'],
                            'correct_answer': 1,
                            'explanation': 'Basic addition: 2 + 2 = 4'
                        }
                    ]
                }
            }
            
            # Find matching template or create generic questions
            topic_key = topic.lower()
            if 'python' in topic_key:
                questions = quiz_templates['python'].get(difficulty.lower(), quiz_templates['python']['beginner'])
            elif 'math' in topic_key:
                questions = quiz_templates['mathematics'].get(difficulty.lower(), quiz_templates['mathematics']['beginner'])
            else:
                # Generic template for any topic
                questions = [
                    {
                        'question': f'What is a fundamental concept in {topic}?',
                        'options': ['Basic principles', 'Advanced techniques', 'Both A and B', 'None of the above'],
                        'correct_answer': 2,
                        'explanation': f'Understanding both basic principles and advanced techniques is important in {topic}.'
                    }
                ]
            
            quiz_data = {
                'title': f'{difficulty.title()} {topic} Quiz',
                'questions': questions[:num_questions]
            }
            
            return Response({
                "success": True,
                "quiz": quiz_data,
                "generated_by": "Naikoria Quiz Generator (Free)",
                "note": "Template-based quiz generation - no paid APIs used!"
            })
            
        except Exception as e:
            return Response({'error': f'Quiz generation failed: {str(e)}'}, status=500)
            
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
def generate_summary(request):
    return Response({"message": "AI summary generation feature coming soon"})

@api_view(['POST'])
def generate_course_outline(request):
    return Response({"message": "AI course outline generation feature coming soon"})

@api_view(['POST'])
def ai_tutor_chat(request):
    return Response({"message": "AI tutor chat feature coming soon"})

@api_view(['POST'])
def explain_concept(request):
    return Response({"message": "AI concept explanation feature coming soon"})

@api_view(['POST'])
def analyze_transcript(request):
    return Response({"message": "AI transcript analysis feature coming soon"})

@api_view(['POST'])
def analyze_assignment(request):
    return Response({"message": "AI assignment analysis feature coming soon"})

@api_view(['GET'])
def agent_status(request):
    return Response({"message": "AI agent status feature coming soon"})

@api_view(['POST'])
def agent_feedback(request):
    return Response({"message": "AI agent feedback feature coming soon"})
