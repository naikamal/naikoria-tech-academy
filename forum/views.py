from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.

class TopicListView(APIView):
    def get(self, request):
        return Response({"topics": [], "message": "Forum feature coming soon"})

class TopicDetailView(APIView):
    def get(self, request, pk):
        return Response({"topic": None, "message": "Forum topic details coming soon"})

class TopicCreateView(APIView):
    def post(self, request):
        return Response({"message": "Forum topic creation coming soon"})

class PostListView(APIView):
    def get(self, request, topic_id):
        return Response({"posts": [], "message": "Forum posts coming soon"})

class PostDetailView(APIView):
    def get(self, request, pk):
        return Response({"post": None, "message": "Forum post details coming soon"})

class PostCreateView(APIView):
    def post(self, request):
        return Response({"message": "Forum post creation coming soon"})
