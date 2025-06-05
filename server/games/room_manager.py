"""
Room manager for the Literature card game.
Handles room creation, lookup, and management.
"""

from .room import Room
from .engine.player import Player
from .engine.game import NOT_STARTED

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
        self.player_rooms = {}  # player_id -> room_id

    def register_action(self, action):
        """Register an action from a player and return the updated room state."""
        room_id = action.get("room_id")
        if not room_id:
            raise ValueError("Invalid action: missing room_id")
        room = self.get_room(room_id)
        if not room:
            raise ValueError("Room does not exist")
        room.register_action(action)
    
    def create_room(self, host_id):
        """Create a new room with the given host."""
        if host_id in self.player_rooms:
            self.leave_room(host_id)
            
        room = Room(host_id)
        self.rooms[room.room_id] = room
        self.player_rooms[host_id] = room.room_id
        return room
    
    def get_room(self, room_id):
        """Get a room by ID."""
        return self.rooms.get(room_id)
    
    def get_player_room(self, player_id):
        """Get the room a player is in."""
        room_id = self.player_rooms.get(player_id)
        if room_id:
            return self.rooms.get(room_id)
        else:
            raise ValueError("Player is not in any room")
            
    def list_available_rooms(self):
        """List all rooms that haven't started games yet."""
        return [room.to_dict() for room in self.rooms.values() 
                if room.game.state == NOT_STARTED]