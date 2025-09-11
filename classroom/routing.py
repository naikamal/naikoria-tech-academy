from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
    re_path(r'ws/live-session/(?P<session_id>\w+)/$', consumers.LiveSessionConsumer.as_asgi()),
    re_path(r'ws/whiteboard/(?P<session_id>\w+)/$', consumers.WhiteboardConsumer.as_asgi()),
]