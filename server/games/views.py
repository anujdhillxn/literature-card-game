from django.http import JsonResponse
from games.room_manager import RoomManager
from rest_framework.views import APIView
import json
from rest_framework.permissions import AllowAny
# Create your views here.
class CreateRoomView(APIView):
    permission_classes = [AllowAny]  # Override default permission classes
    authentication_classes = []  # Override default authentication classes
    def post(self, request):
        room = RoomManager.get_instance().create_room()
        return JsonResponse({'room_id': room.room_id})
    
