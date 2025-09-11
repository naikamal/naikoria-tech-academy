from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.

@api_view(['GET'])
def dashboard_analytics(request):
    return Response({"message": "Dashboard analytics feature coming soon"})

class UserActivityView(APIView):
    def get(self, request):
        return Response({"activity": [], "message": "User activity analytics coming soon"})

@api_view(['GET'])
def course_analytics(request, course_id):
    return Response({"message": "Course analytics feature coming soon"})

@api_view(['GET'])
def course_student_analytics(request, course_id):
    return Response({"message": "Course student analytics feature coming soon"})

@api_view(['GET'])
def platform_analytics(request):
    return Response({"message": "Platform analytics feature coming soon"})
