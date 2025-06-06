"""
Room implementation for Literature card game.
Manages a lobby where players can join before the game starts.
"""

import random
import string
import uuid
from .engine.game import NOT_STARTED, Game
from .engine.player import Player

class Room:
    """Represents a game room where players can join before starting a game."""
    
    def __init__(self, room_id=None):
        """
        Initialize a new room.
        
        Args:
            host_id: Unique identifier for the host player
            host_name (str): Display name of the host
            room_id (str, optional): Room identifier. If None, one will be generated.
        """
        self.room_id = room_id or self._generate_room_id()
        self.players = {}  # token -> Player object
        self.game = Game(self.room_id)
        self.host_token = None
    
    def _generate_room_id(self, length=6):
        """Generate a random room ID."""
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
    
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
        if len(self.players) >= 6:
            raise ValueError("Room is full")
            
        if player_token in self.players:
            raise ValueError("Player already in room")
        
        if not player_name:
            raise ValueError("Player name cannot be empty")
        
        player_id = uuid.uuid4().hex
        player = Player(player_id, player_name, player_token, team=1 if len(self.players) % 2 == 0 else 2)
        if not self.host_token:
            self.host_token = player_token
        self.players[player_token] = player
    
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
        
        del self.players[player.token]
            
        if self.players and self.is_host(player):
            self.host_token = next(iter(self.players.keys()))
    
    def change_team(self, change_requester, player_id, new_team):
        """
        Move a player to a different team.
        
        Args:
            player_id: ID of player to move
            new_team (int): Team to move to (1 or 2)
            
        Raises:
            ValueError: If the player doesn't exist or the team is invalid/full
        """
        change_requester = self.get_player_by_token(change_requester.token)
        player = self.get_player(player_id)
        if change_requester.id != player_id and not self.is_host(change_requester):
            raise ValueError("Only the host or the player themselves can change teams")
            
        if new_team not in (1, 2):
            raise ValueError("Invalid team number")
            
        self.players[player.token].team = new_team
    
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
        self.game.start_game(self.players.values())
    
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
        else:
            actor = self.get_player_by_token(action_token)
            if action_type == 'start_game':
                self.start_game(actor)
            elif action_type == 'change_team':
                player_id = action.get('player_id')
                new_team = action.get('new_team')
                self.change_team(actor, player_id, new_team)
            elif action_type == 'remove_player':
                player_id = action.get('player_id')
                self.remove_player(actor, player_id)
            elif action_type == 'exit_room':
                self.remove_player(actor, actor.id)
            elif action_type == 'change_host':
                new_host_id = action.get('new_host_id')
                self.change_host(actor, new_host_id)
            elif action_type == 'make_move':
                move_data = action.get('move_data')
                self.game.make_move(actor.id, move_data)
            else:
                raise ValueError("Unknown action type")
        del action['action_token']
        action['actor_id'] = actor.id
    
    def get_player(self, player_id):
        """Get a player by ID."""
        # iterate through players to find the one with the given ID
        for player in self.players.values():
            if player.id == player_id:
                return player
            
        raise ValueError("Player not found")
    
    def get_player_by_token(self, player_token, raise_if_not_found=True):
        """Get a player by their token."""
        if player_token not in self.players:
            if raise_if_not_found:
                raise ValueError("Player not found with token: {}".format(player_token))
            return None
        return self.players[player_token]
    
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
        players_data = []
        host = self.get_player_by_token(self.host_token)
        for player in self.players.values():
            players_data.append({
                'id': player.id,
                'name': player.name,
                'team': player.team,
                'is_host': player.id == host.id,
            })
            
        return {
            'room_id': self.room_id,
            'hostId': host.id,
            'players': players_data,
            'receiverId': asker.id,
            'game': self.game.to_dict(asker.id if asker else None),
        }