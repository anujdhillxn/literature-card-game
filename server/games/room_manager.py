"""
Room manager for the Literature card game.
Handles room creation, lookup, and management.
"""

from .room import Room
from .engine.player import Player
from .engine.game import NOT_STARTED

available_game_types = ['literature', ]

class RoomManager:
    """Singleton manager for game rooms."""
    _instance = None
    
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = RoomManager()
        return cls._instance
    
    def __init__(self):
        self.rooms = {}  # room_id -> Room
        self.create_public_rooms()

    def create_public_rooms(self):
        """Create initial public rooms for the game."""
        for game_type in available_game_types:
            for _ in range(5):
                self.create_room(game_type, room_id = "Public_" + game_type + "_game_" + str(_))

    def register_action(self, action):
        """Register an action from a player and return the updated room state."""
        room_id = action.get("room_id")
        if not room_id:
            raise ValueError("Invalid action: missing room_id")
        room = self.get_room(room_id)
        if not room:
            raise ValueError("Room does not exist")
        room.register_action(action)
    
    def create_room(self, game_type, room_id=None):
        """Create a new room with the given host."""
         
        room = Room(game_type, room_id)
        self.rooms[room.room_id] = room
        return room
    
    def get_room(self, room_id):
        """Get a room by ID."""
        return self.rooms.get(room_id)
            
    def list_available_rooms(self):
        """List all rooms that haven't started games yet."""
        res = []
        for room in self.rooms.values():
            res.append({
                "room_id": room.room_id,
                "game_type": room.game_type,
            })
        return res