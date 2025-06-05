from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .room_manager import RoomManager
from asgiref.sync import sync_to_async

room_manager = RoomManager.get_instance()
class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.user_id = int(self.scope["url_route"]["kwargs"]["user_id"])
        self.user_name = self.scope["url_route"]["kwargs"]["user_name"]
        self.room_group_name = f"room_{self.room_id}"
        print(f"Connecting user {self.user_id} to room {self.room_id}")
        await self.accept()
        action = {
            "type": "add_player",
            "actor_id": self.user_id,
            "actor_name": self.user_name,
            "room_id": self.room_id
        }
        try:
            await sync_to_async(room_manager.register_action)(action)
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.update_room(action)
            print(f"User {self.user_id} joined room {self.room_id}")
        except ValueError as e:
            print(f"Error joining room: {e}")
            await self.update_self(action, str(e))
            await self.close()

    async def disconnect(self, close_code):
        try:
            action = {
                    "type": "remove_player",
                    "actor_id": self.user_id,
                    "player_id": self.user_id,
                    "room_id": self.room_id
                }
            room_manager.register_action(action)
            await self.update_room(action)
        except ValueError:
            pass
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            action = json.loads(text_data)
            room_manager.register_action(action)
            print(self.user_id, "received action:", action)
            await self.update_room(action)
        except ValueError as e:
            print(f"Error processing message: {e}")
            await self.send(text_data=json.dumps({"error": str(e)}))

    async def room_message(self, action):
        await self.send(text_data=json.dumps(
            {
                "success": True,
                "currentState": room_manager.get_room(self.room_id).to_dict(self.user_id),
                "lastAction": action.get("action", None),
            }
        ))

    async def update_room(self, action):
        """Send the current state of the room to all connected users."""
        await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "room.message",
                    "action": action,
                }
            )

    async def update_self(self, action, error):
        """Send an update to the user about their action."""
        await self.send(text_data=json.dumps(
            {
                "success": False,
                "error": error,
                "failedAction": action,
            }
        ))