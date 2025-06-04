"""
Room implementation for Literature card game.
Manages a lobby where players can join before the game starts.
"""

import random
import string
from .engine.game import NOT_STARTED, Game
from .engine.player import Player

class Room:
    """Represents a game room where players can join before starting a game."""
    
    def __init__(self, host_id, room_id=None):
        """
        Initialize a new room.
        
        Args:
            host_id: Unique identifier for the host player
            host_name (str): Display name of the host
            room_id (str, optional): Room identifier. If None, one will be generated.
        """
        self.room_id = room_id or self._generate_room_id()
        self.host_id = host_id
        self.players = {}  # player_id -> Player object
        self.game = Game(self.room_id)
        
        host_player = Player(host_id, host_id, team=1)  # Host starts on team 1
        self.add_player(host_player)
    
    def _generate_room_id(self, length=6):
        """Generate a random room ID."""
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
    
    def add_player(self, player):
        """
        Add a player to the room.
        
        Args:
            player (Player): Player object to add
            
        Raises:
            ValueError: If the room is full or the player ID already exists
            
        Returns:
            Player: The added player
        """
        if self.game.state != NOT_STARTED:
            raise ValueError("Cannot join this room")
            
        if len(self.players) >= 6:
            raise ValueError("Room is full")
            
        if player.id in self.players:
            raise ValueError("Player already in room")
        
        self.players[player.id] = player
            
        return player
    
    def remove_player(self, remove_requester_id, player_id):
        """
        Remove a player from the room.
        
        Args:
            player_id: ID of player to remove

            remove_requester_id: ID of player requesting removal (must be host or player themselves)
        Raises:
            ValueError: If the player doesn't exist or the requester is not authorized
        """
        if player_id not in self.players:
            raise ValueError("Player not found")
        
        if remove_requester_id != player_id and not self.is_host(remove_requester_id):
            raise ValueError("Only the host or the player themselves can be removed")
        
        del self.players[player_id]
            
        if player_id == self.host_id and self.players:
            self.host_id = next(iter(self.players.keys()))
    
    def change_team(self, change_requester_id, player_id, new_team):
        """
        Move a player to a different team.
        
        Args:
            player_id: ID of player to move
            new_team (int): Team to move to (1 or 2)
            
        Raises:
            ValueError: If the player doesn't exist or the team is invalid/full
        """

        if player_id not in self.players:
            raise ValueError("Player not found")

        if change_requester_id != player_id and not self.is_host(change_requester_id):
            raise ValueError("Only the host or the player themselves can change teams")
            
        if new_team not in (1, 2):
            raise ValueError("Invalid team number")
            
        self.players[player_id].team = new_team
    
    def start_game(self, start_requester_id):
        """
        Start the game with current players.
        Args:
            start_requester_id: ID of player requesting to start the game (must be host)
        Raises:
            ValueError: If the requester is not the host or if there are not enough players
        """
        if not self.is_host(start_requester_id):
            raise ValueError("Only the host can start the game")
        self.game.start_game(self.players)
    
    def change_host(self, change_requester_id, new_host_id):
        """
        Change the host of the room.
        Args:
            change_requester_id: ID of player requesting the change (must be current host)
            new_host_id: ID of the new host player
        Raises:
            ValueError: If the requester is not the current host or if the new host is not in the room
        """
        if not self.is_host(change_requester_id):
            raise ValueError("Only the current host can change the host")
        if new_host_id not in self.players:
            raise ValueError("New host must be a player in the room")
        if new_host_id == change_requester_id:
            raise ValueError("Cannot change host to the same player")
        self.host_id = new_host_id

    def register_action(self, action):
        """
        Register an action from a player.
        """
        actor_id = action.get('actor_id')
        if actor_id not in self.players:
            raise ValueError("Player not found in room")
        action_type = action.get('type')
        if action_type == 'start_game':
            self.start_game(actor_id)
        elif action_type == 'change_team':
            player_id = action.get('player_id')
            new_team = action.get('new_team')
            self.change_team(actor_id, player_id, new_team)
        elif action_type == 'remove_player':
            player_id = action.get('player_id')
            self.remove_player(actor_id, player_id)
        elif action_type == 'change_host':
            new_host_id = action.get('new_host_id')
            self.change_host(actor_id, new_host_id)
        elif action_type == 'make_move':
            move_data = action.get('move_data')
            self.game.make_move(actor_id, move_data)
        else:
            raise ValueError("Unknown action type")
    
    def get_player(self, player_id):
        """Get a player by ID."""
        return self.players.get(player_id)
    
    def is_host(self, player_id):
        """Check if a player is the host."""
        return player_id == self.host_id
    
    def to_dict(self):
        """
        Return a dictionary representation of the room.
        
        Returns:
            dict: Room data for serialization
        """
        players_data = []
        for player_id, player in self.players.items():
            players_data.append({
                'id': player_id,
                'name': player.name,
                'team': player.team,
                'is_host': player_id == self.host_id
            })
            
        return {
            'room_id': self.room_id,
            'host_id': self.host_id,
            'players': players_data,
            'status': self.game.state,
            'game': self.game.to_dict() if self.game else {}
        }