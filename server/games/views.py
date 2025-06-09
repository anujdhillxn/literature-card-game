from django.http import JsonResponse
from games.room_manager import RoomManager
from rest_framework.views import APIView
import json
from rest_framework.permissions import AllowAny
# Create your views here.
class CreateRoomView(APIView):
    def post(self, request):
        game_type = request.data.get('game_type')
        room = RoomManager.get_instance().create_room(game_type)
        return JsonResponse({'room_id': room.room_id})
    

class ListRoomsView(APIView):
    permission_classes = [AllowAny]  # Override default permission classes
    authentication_classes = []  # Override default authentication classes
    def get(self, request):
        rooms = RoomManager.get_instance().list_available_rooms()
        return JsonResponse({'rooms': rooms})