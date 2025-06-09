from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .room_manager import RoomManager
from asgiref.sync import sync_to_async

room_manager = RoomManager.get_instance()
class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.user_token = self.scope["url_route"]["kwargs"]["user_token"]
        username = self.scope["url_route"]["kwargs"]["username"]
        self.room_group_name = f"room_{self.room_id}"
        print(f"Connecting user {username} to room {self.room_id}")
        await self.accept()
        action = {
            "type": "add_player",
            "action_token": self.user_token,
            "player_name": username,
            "room_id": self.room_id
        }
        try:
            await sync_to_async(room_manager.register_action)(action)
            await self.channel_layer.group_add(self.room_group_name, self.channel_name)
            await self.update_room()
        except ValueError as e:
            print(f"Error joining room: {e}")
            await self.update_self(str(e), True)
            await self.close()

    async def disconnect(self, close_code):
        try:
            action = {
                    "type": "exit_room",
                    "action_token": self.user_token,
                    "room_id": self.room_id
                }
            await sync_to_async(room_manager.register_action)(action)
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
            await self.update_room()
        except ValueError as e:
            print(f"Error during disconnect: {e}")

    async def receive(self, text_data):
        try:
            action = json.loads(text_data)
            action["action_token"] = self.user_token
            action["room_id"] = self.room_id
            room_manager.register_action(action)
            await self.update_room()
        except ValueError as e:
            print(f"Error processing message: {e}")
            await self.update_self(str(e))

    async def room_message(self, event):
        """Handle messages sent to the room group."""
        room = room_manager.get_room(self.room_id)
        if room and self.user_token in room.connected_players:
            await self.send(text_data=json.dumps(
                {
                    "success": True,
                    "currentState": room.to_dict(self.user_token),
                }
            ))

    async def update_room(self):
        """Send the current state of the room to all connected users."""
        await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "room.message",
                }
            )

    async def update_self(self, error, disconnect=False):
        """Send an update to the user about their action."""
        await self.send(text_data=json.dumps(
            {
                "success": False,
                "error": error,
                "disconnect": disconnect
            }
        ))