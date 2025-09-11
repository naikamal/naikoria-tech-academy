import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import LiveSession, Chat

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        username = text_data_json['username']
        
        # Save message to database
        await self.save_message(username, message)
        
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username,
                'timestamp': str(timezone.now())
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'username': event['username'],
            'timestamp': event['timestamp']
        }))
    
    @database_sync_to_async
    def save_message(self, username, message):
        try:
            user = User.objects.get(username=username)
            session = LiveSession.objects.get(id=self.room_name)
            Chat.objects.create(
                session=session,
                user=user,
                message=message
            )
        except (User.DoesNotExist, LiveSession.DoesNotExist):
            pass

class LiveSessionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.session_group_name = f'live_session_{self.session_id}'

        await self.channel_layer.group_add(
            self.session_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.session_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        
        # Broadcast to all participants in the session
        await self.channel_layer.group_send(
            self.session_group_name,
            {
                'type': 'session_update',
                'data': data
            }
        )

    async def session_update(self, event):
        await self.send(text_data=json.dumps(event['data']))

class WhiteboardConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.whiteboard_group_name = f'whiteboard_{self.session_id}'

        await self.channel_layer.group_add(
            self.whiteboard_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.whiteboard_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        
        # Broadcast whiteboard updates to all participants
        await self.channel_layer.group_send(
            self.whiteboard_group_name,
            {
                'type': 'whiteboard_update',
                'data': data
            }
        )

    async def whiteboard_update(self, event):
        await self.send(text_data=json.dumps(event['data']))