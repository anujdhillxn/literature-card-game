from django.urls import path
from .views import CreateRoomView
urlpatterns = [
    path('create-room', CreateRoomView.as_view(), name='create_room'),
]