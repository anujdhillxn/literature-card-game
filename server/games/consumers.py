from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .room_manager import RoomManager

class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        self.user_id = int(self.scope["url_route"]["kwargs"]["user_id"])
        self.room_group_name = f"room_{self.room_id}"

        try:
            RoomManager.get_instance().join_room(self.room_id, self.user_id)
        except ValueError as e:
            await self.send(text_data=json.dumps({"error": str(e)}))
            await self.close()
            return

        # Join group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "room.message",
                "message": f"User {self.user_id} joined room {self.room_id}",
            }
        )

    async def disconnect(self, close_code):
        try:
            RoomManager.get_instance().leave_room(self.user_id)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "system_message",
                    "text": f"User {self.user_id} left room"
                }
            )
        except ValueError:
            pass
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        try:
            RoomManager.get_instance().register_action(json.loads(text_data))
            room_state = RoomManager.get_instance().get_room(self.room_id).to_dict()
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "room.message",
                    "message": json.dumps({"current_state": room_state}),
                }
            )
        except ValueError as e:
            await self.send(text_data=json.dumps({"error": str(e)}))

    async def room_message(self, event):
        await self.send(text_data=event["message"])
