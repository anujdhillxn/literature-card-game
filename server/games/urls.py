from django.urls import path
from .views import CreateRoomView, ListRoomsView
urlpatterns = [
    path('create-room', CreateRoomView.as_view(), name='create_room'),
    path('list-rooms', ListRoomsView.as_view(), name='list_rooms'),
]