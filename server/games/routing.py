from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/room/<str:room_id>/<str:user_token>/<str:username>/", consumers.RoomConsumer.as_asgi()),
]
