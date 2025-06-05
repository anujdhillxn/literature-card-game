from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path("ws/room/<str:room_id>/<str:user_id>/<str:user_name>/", consumers.RoomConsumer.as_asgi()),
]
