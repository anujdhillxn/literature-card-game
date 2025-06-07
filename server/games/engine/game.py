"""
Game implementation for Literature card game.
Manages a complete game session including players, turns, and game logic.
"""

import random
from .card import ALL_CARDS, get_set_cards, get_set_name, get_set_number
from .player import LiteraturePlayer, Player
# Game state constants
NOT_STARTED = "not_started"
IN_PROGRESS = "in_progress"
ENDED = "ended"

class Game:
    """Represents a Literature card game."""
    
    def __init__(self, game_id):
        """
        Initialize a new game.
        
        Args:
            game_id: Unique identifier for the game
        """
        self.game_id = game_id
        self.players = {} # Map player IDs to Player objects
        self.current_turn_player_id = None
        self.claimed_sets = {}  # Map set numbers to the team that claimed it
        self.scores = {1: 0, 2: 0}  # Map team IDs to scores (teams are 1 and 2)
        self.state = NOT_STARTED
        self.winning_team = None
        self.last_ask = None  # Details about the most recent ask
    
    def add_player(self, player_id, player_name, player_token):
        """
        Create a new player instance.
        
        Args:
            player_id: Unique identifier for the player
            player_name: Name of the player
            player_token: Unique token for the player
            team: Team number (1 or 2)
            
        Returns:
            Player: The created player object
        """
        team = 1 if len(self.players) % 2 == 0 else 2
        if len(self.players) >= 6:
            raise ValueError("Cannot add more than 6 players to the game")
        player = LiteraturePlayer(player_id, player_name, player_token, team)
        self.players[player_id] = player
        return player
    
    def remove_player(self, player_id):
        """
        Remove a player from the game.
        
        Args:
            player_id: Unique identifier for the player
            
        Raises:
            ValueError: If the player does not exist
        """
        if player_id in self.players:
            del self.players[player_id]
            if self.current_turn_player_id == player_id:
                self.current_turn_player_id = None
    
    def get_player(self, player_id):
        """
        Get a player by ID.
        
        Args:
            player_id: Player's unique identifier
            
        Returns:
            Player: The player object or None if not found
        """
        if player_id in self.players:
            return self.players[player_id]
        raise ValueError(f"Player with ID {player_id} not found")
    
    def get_player_by_token(self, token):
        """
        Get a player by their token.
        
        Args:
            token: Player's unique token
            
        Returns:
            Player: The player object or None if not found
        """
        for player in self.players.values():
            if player.token == token:
                return player
        return None
    
    def get_team_players(self, team):
        """
        Get all players belonging to a specific team.
        
        Args:
            team (int): Team number (1 or 2)
            
        Returns:
            list: List of Player objects in the team
        """
        return [player for player in self.players.values() if player.team == team]
    
    def start_game(self):
        """
        Start the game with the provided players and a randomly selected starting player.
        Raises:
            ValueError: If there are not exactly 3 players on each team
                      or if the game has already started
        
        Returns:
            str: ID of the starting player
        """
        if self.state != NOT_STARTED:
            raise ValueError("Game has already started or ended")
            
        # Count players on each team
        team1_count = sum(1 for p in self.players.values() if p.team == 1)
        team2_count = sum(1 for p in self.players.values() if p.team == 2)
        
        if team1_count != 3 or team2_count != 3:
            raise ValueError(f"Each team must have exactly 3 players (Team 1: {team1_count}, Team 2: {team2_count})")
            
        if len(self.players) != 6: raise ValueError("Exactly 6 players required")
        starting_player = random.choice(list(self.players.values()))
        self.current_turn_player_id = starting_player.id
        
        self.deal_cards()

        self.state = IN_PROGRESS
    
    def deal_cards(self):
        """
        Deal cards to all players at the start of the game.
        
        Each player receives 9 cards from a shuffled deck.
        """
        deck = list(ALL_CARDS)
        random.shuffle(deck)
        
        for player in self.players.values():
            player.hand = set(deck[:9])
            deck = deck[9:]
    
    def end_game(self):
        """
        End the game and determine the winner.
        """
        self.state = ENDED
        
        # Determine winner by score
        if self.scores[1] > self.scores[2]:
            self.winning_team = 1
        elif self.scores[2] > self.scores[1]:
            self.winning_team = 2
        else:
            self.winning_team = None  # It's a tie
    
    def get_current_player(self):
        """
        Get the player whose turn it currently is.
        
        Returns:
            Player: The current player or None if game not started
        """
        if self.current_turn_player_id is not None:
            return self.get_player(self.current_turn_player_id)
        return None
    
    def get_cards_held_by_team(self, team):
        """
        Get all cards held by a specific team.
        
        Args:
            team (int): Team number (1 or 2)
        
        Returns:
            set: Set of cards held by the team
        """
        cards = set()
        for player in self.get_team_players(team):
            cards.update(player.hand)
        return cards
    
    def ask_for_card(self, asking_player_id, asked_player_id, card):
        """
        Handle a player asking another player for a specific card.
        
        Args:
            asking_player_id: ID of player asking for the card
            asked_player_id: ID of player being asked
            card (str): The card being requested
        
        Raises:
            ValueError: If it's not the asking player's turn or other validation fails
        """
        if card not in ALL_CARDS:
            raise ValueError("Invalid card requested.")
        # Get player objects
        asking_player = self.get_player(asking_player_id)
        asked_player = self.get_player(asked_player_id)

        if asking_player.has_card(card):
            raise ValueError("You already hold that card.")
        
        set_number = get_set_number(card)
        if set_number in self.claimed_sets:
            raise ValueError(f"Set {set_number} has already been claimed.")
        
        set_cards = get_set_cards(set_number)
        if not any(c in asking_player.hand for c in set_cards):
            raise ValueError("You must hold a card from the same set to ask for this one.")
        
        # Verify players are on different teams
        if asking_player.team == asked_player.team:
            raise ValueError("Cannot ask a player on your own team for cards")
        
        if len(asked_player.hand) == 0:
            raise ValueError(f"{asked_player.name} has no cards to ask for")
        
        success = asked_player.has_card(card)
        
        if success:
            asked_player.remove_card(card)
            asking_player.add_card(card)
        else:
            self.current_turn_player_id = asked_player_id
        self.last_ask = {
            'askingPlayerId': asking_player_id,
            'askedPlayerId': asked_player_id,
            'card': card,
            'success': success
        }
        
    
    def claim_set(self, set_number, declaring_player_id):
        """
        Record that a team has successfully claimed a set.
        
        Args:
            set_number (int): Number of the set being claimed (1-9)
            team (int): Team number (1 or 2) claiming the set
            declaring_player_id: ID of the player who made the declaration
            
        Raises:
            ValueError: If set number or team is invalid or game is not active
        """
            
        if set_number < 1 or set_number > 9:
            raise ValueError("Set number must be between 1 and 9")
            
        if set_number in self.claimed_sets:
            raise ValueError(f"Set {set_number} has already been claimed by team {self.claimed_sets[set_number]}")
        
        declaring_player = self.get_player(declaring_player_id)
        if not declaring_player:
            raise ValueError("Invalid declaring player ID")

        cards_needed = get_set_cards(set_number)
        cards_held = self.get_cards_held_by_team(declaring_player.team)

        for player in self.players.values():
            player.hand = set([card for card in player.hand if card not in cards_needed])
    
        if cards_needed.issubset(cards_held):
            winning_team = declaring_player.team
        else:
            winning_team = 2 if declaring_player.team == 1 else 1

        self.claimed_sets[set_number] = winning_team
        self.scores[winning_team] += 1   
        # Check if the game has ended
        if len(self.claimed_sets) == 9:  # All sets have been claimed
            self.end_game()
    
    def pass_turn_to_teammate(self, passer_id, teammate_id):
        """        
        Pass the turn to a teammate.
        Args:
            passer_id: ID of the player passing the turn
            teammate_id: ID of the teammate to pass the turn to
        Raises:
            ValueError: If the game is not in progress, or if the players are not teammates
        """
        passer_player = self.get_player(passer_id)
        teammate_player = self.get_player(teammate_id)

        if passer_player.team != teammate_player.team:
            raise ValueError("Cannot pass turn to a player on a different team")

        if len(passer_player.hand) > 0:
            raise ValueError("Cannot pass turn while holding cards")
        
        if passer_player.id == teammate_player.id:
            raise ValueError("Cannot pass turn to yourself")
        
        self.current_turn_player_id = teammate_id
    
    def register_pre_game_action(self, actor_id, is_actor_host, action):
        if self.state != NOT_STARTED:
            raise ValueError("Game has already started or ended")
        action_type = action.get('type')
        if action_type == 'change_team':
            new_team = action.get('new_team')
            player_id = action.get('player_id')
            if not new_team or not player_id:
                raise ValueError("Invalid move data for change_team")
            if actor_id != player_id and not is_actor_host:
                raise ValueError("Only the player or host can change team")
            player = self.get_player(player_id)
            player.team = new_team
        else:
            raise ValueError(f"Unknown pre-game action type: {action_type}")
    
    def register_in_game_action(self, actor_id, action):
        if self.state != IN_PROGRESS:
            raise ValueError("Game is not active")
        action_type = action.get('type')
        if actor_id != self.current_turn_player_id:
            raise ValueError(f"Not {self.get_player(actor_id).name}'s turn")
        if action_type == 'ask_card':
            asked_player_id = action.get('asked_player_id')
            card = action.get('card')
            if not asked_player_id or not card:
                raise ValueError("Invalid move data for ask_card")
            self.ask_for_card(actor_id, asked_player_id, card)
        elif action_type == 'claim_set':
            set_number = action.get('set_number')
            if not set_number:
                raise ValueError("Invalid move data for claim_set")
            self.claim_set(set_number, actor_id)
        elif action_type == 'pass_turn':
            teammate_id = action.get('teammate_id')
            if not teammate_id:
                raise ValueError("Invalid move data for pass_turn")
            self.pass_turn_to_teammate(actor_id, teammate_id)
        else:
            raise ValueError(f"Unknown move type: {action_type}")
    
    def to_dict(self, asker_id):
        """
        Return a dictionary representation of the game.
        
        Args:
            asker_id: ID of the player requesting the game state
        
        Returns:
            dict: Game data for serialization
        """
        players_data = []
        for player in self.players.values():
            player_data = player.to_dict()
            include_hands = (asker_id and self.state == IN_PROGRESS and player.id == asker_id)
            if not include_hands:
                # Remove the actual cards, but keep the count
                player_data['hand'] = []
            players_data.append(player_data)
          
        return {
            'gameId': self.game_id,
            'players': players_data,
            'currentPlayerId': self.current_turn_player_id,
            'claimedSets': self.claimed_sets,
            'scores': self.scores,
            'state': self.state,
            'winningTeam': self.winning_team,
            'lastAsk': self.last_ask
        }