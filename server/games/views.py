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
        data = json.loads(request.body)
        user_id = data.get('user_id')
        if user_id is None:
            return JsonResponse({'message': 'Missing user_id'}, status=400)
        room = RoomManager.get_instance().create_room(user_id)
        return JsonResponse({'room_id': room.room_id})
    
