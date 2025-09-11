from django.urls import path
from . import views

app_name = 'forum'

urlpatterns = [
    # Forum topics and discussions
    path('topics/', views.TopicListView.as_view(), name='topic_list'),
    path('topics/<int:pk>/', views.TopicDetailView.as_view(), name='topic_detail'),
    path('topics/create/', views.TopicCreateView.as_view(), name='topic_create'),
    
    # Posts and replies
    path('topics/<int:topic_id>/posts/', views.PostListView.as_view(), name='post_list'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post_detail'),
    path('posts/create/', views.PostCreateView.as_view(), name='post_create'),
]