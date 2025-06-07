"""
Room implementation for Literature card game.
Manages a lobby where players can join before the game starts.
"""

import random
import string
import uuid
from .engine.game import IN_PROGRESS, NOT_STARTED, Game
from .engine.player import Player

class Room:
    """Represents a game room where players can join before starting a game."""
    
    def __init__(self, game_type = 'literature', room_id=None):
        """
        Initialize a new room.
        
        Args:
            host_id: Unique identifier for the host player
            host_name (str): Display name of the host
            room_id (str, optional): Room identifier. If None, one will be generated.
        """
        self.room_id = room_id or self._generate_room_id()
        self.game_type = game_type
        print(game_type, self.game_type)
        self.connected_players = {}  # token -> Player object
        self.game = self.create_game_instance()
        self.host_token = None
    
    def _generate_room_id(self, length=6):
        """Generate a random room ID."""
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
    
    def create_game_instance(self):
        """Create a new game instance based on the game type."""
        if self.game_type == 'literature':
            return Game(self.room_id)
        else:
            raise ValueError(f"Unsupported game type: {self.game_type}")
    
    def add_player(self, player_name, player_token):
        """
        Add a player to the room.
        
        Args:
            player (Player): Player object to add
            
        Raises:
            ValueError: If the room is full or the player ID already exists
            
        Returns:
            Player: The added player
        """ 
        if player_token in self.connected_players:
            raise ValueError("Player already in room")
        
        if not player_name:
            raise ValueError("Player name cannot be empty")
        if self.game.state == NOT_STARTED:
            player_id = str(uuid.uuid4())
            player = self.game.add_player(player_id, player_name, player_token)
        else:
            player = self.game.get_player_by_token(player_token)
            if not player:
                raise ValueError("Game has already started, cannot add new players")
        self.connected_players[player_token] = player
        if not self.host_token:
            self.host_token = player_token
    
    def remove_player(self, remove_requester, player_id):
        """
        Remove a player from the room.
        
        Args:
            player_id: ID of player to remove

            remove_requester_id: ID of player requesting removal (must be host or player themselves)
        Raises:
            ValueError: If the player doesn't exist or the requester is not authorized
        """
        player = self.get_player(player_id)
        if remove_requester.id != player_id and not self.is_host(remove_requester):
            raise ValueError("Only the host or the player themselves can be removed")
        
        del self.connected_players[player.token]
        if self.connected_players and self.is_host(player):
            self.host_token = next(iter(self.connected_players.keys()))

        if self.game.state == NOT_STARTED:
            self.game.remove_player(player.id)
    
    def start_game(self, start_requester):
        """
        Start the game with current players.
        Args:
            start_requester_id: ID of player requesting to start the game (must be host)
        Raises:
            ValueError: If the requester is not the host or if there are not enough players
        """
        if self.host_token != start_requester.token:
            raise ValueError("Only the host can start the game")
        self.game.start_game()
    
    def change_host(self, change_requester, new_host_id):
        """
        Change the host of the room.
        Args:
            change_requester_id: ID of player requesting the change (must be current host)
            new_host_id: ID of the new host player
        Raises:
            ValueError: If the requester is not the current host or if the new host is not in the room
        """
        if change_requester.token != self.host_token:
            raise ValueError("Only the current host can change the host")
        new_host = self.get_player(new_host_id)
        if new_host_id == change_requester.id:
            raise ValueError("Cannot change host to the same player")
        self.host_token = new_host.token

    def register_action(self, action):
        """
        Register an action from a player.
        """
        action_token = action.get('action_token')
        if not action_token:
            raise ValueError("Action token is required")
        action_type = action.get('type')
        if action_type == 'add_player':
            player_name = action.get('player_name')
            if not player_name:
                raise ValueError("Player name is required")
            self.add_player(player_name, action_token)
            actor = self.get_player_by_token(action_token)
            print(self.connected_players)
        else:
            actor = self.get_player_by_token(action_token)
            if action_type == 'start_game':
                self.start_game(actor)
            elif action_type == 'remove_player':
                player_id = action.get('player_id')
                self.remove_player(actor, player_id)
            elif action_type == 'exit_room':
                self.remove_player(actor, actor.id)
            elif action_type == 'change_host':
                new_host_id = action.get('new_host_id')
                self.change_host(actor, new_host_id)
            elif action_type == 'pre_game_action':
                pre_game_action = action.get('pre_game_action')
                print(action)
                if not pre_game_action:
                    raise ValueError("Pre-game action data is required")
                self.game.register_pre_game_action(actor.id, action_token == self.host_token, pre_game_action)
            elif action_type == 'in_game_action':
                in_game_action = action.get('in_game_action')
                self.game.register_in_game_action(actor.id, in_game_action)
            else:
                raise ValueError("Unknown action type")
        del action['action_token']
        action['actor_id'] = actor.id
    
    def get_player(self, player_id):
        """Get a player by ID."""
        # iterate through players to find the one with the given ID
        for player in self.connected_players.values():
            if player.id == player_id:
                return player
            
        raise ValueError("Player not found")
    
    def get_player_by_token(self, player_token, raise_if_not_found=True):
        """Get a player by their token."""
        if player_token not in self.connected_players:
            if raise_if_not_found:
                raise ValueError("Player not found with token: {}".format(player_token))
            return None
        return self.connected_players[player_token]
    
    def is_host(self, player):
        """Check if a player is the host."""
        return player.token == self.host_token
    
    def to_dict(self, asker_token):
        """
        Return a dictionary representation of the room.
        Args:
            asker_id (str, optional): ID of the player asking for the room data.
        Returns:
            dict: Room data for serialization
        """
        asker = self.get_player_by_token(asker_token, raise_if_not_found=False)
        host = self.get_player_by_token(self.host_token, raise_if_not_found=False)
        return {
            'room_id': self.room_id,
            'type': self.game_type,
            'hostId': host.id if host else None,
            'receiverId': asker.id,
            'connectedPlayers': [player.id for player in self.connected_players.values()],
            'game': self.game.to_dict(asker.id if asker else None),
        }