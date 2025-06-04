"""
Game implementation for Literature card game.
Manages a complete game session including players, turns, and game logic.
"""

import random
from .card import ALL_CARDS, get_set_cards, get_set_name, get_set_number

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
        self.players = {}  # Will be populated in start_game
        self.current_turn_player_id = None
        self.claimed_sets = {}  # Map set numbers to the team that claimed it
        self.scores = {1: 0, 2: 0}  # Map team IDs to scores (teams are 1 and 2)
        self.state = NOT_STARTED
        self.winning_team = None
        self.last_action = None  # Details about the most recent action
    
    def get_player(self, player_id):
        """
        Get a player by ID.
        
        Args:
            player_id: Player's unique identifier
            
        Returns:
            Player: The player object or None if not found
        """
        return self.players.get(player_id)
    
    def get_team_players(self, team):
        """
        Get all players belonging to a specific team.
        
        Args:
            team (int): Team number (1 or 2)
            
        Returns:
            list: List of Player objects in the team
        """
        return [player for player in self.players.values() if player.team == team]
    
    def start_game(self, players):
        """
        Start the game with the provided players and a randomly selected starting player.
        
        Args:
            players: Dictionary of player_id -> Player objects
            
        Raises:
            ValueError: If there are not exactly 3 players on each team
                      or if the game has already started
        
        Returns:
            str: ID of the starting player
        """
        if self.state != NOT_STARTED:
            raise ValueError("Game has already started or ended")
            
        # Count players on each team
        team1_count = sum(1 for p in players.values() if p.team == 1)
        team2_count = sum(1 for p in players.values() if p.team == 2)
        
        if team1_count != 3 or team2_count != 3:
            raise ValueError(f"Each team must have exactly 3 players (Team 1: {team1_count}, Team 2: {team2_count})")
            
        if len(players) != 6: raise ValueError("Exactly 6 players required")
        self.players = players
        # Randomly select a starting player
        starting_player = random.choice(list(self.players.values()))
        self.current_turn_player_id = starting_player.id
        
        self.deal_cards()

        self.state = IN_PROGRESS
        self.record_action({
            'type': 'game_start',
            'starting_player': starting_player.id,
            'starting_player_name': starting_player.name,
            'starting_team': starting_player.team
        })
    
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
            
        self.record_action({
            'type': 'game_end',
            'scores': self.scores.copy(),
            'winning_team': self.winning_team
        })
    
    def record_action(self, action_data):
        """
        Record the most recent action.
        
        Args:
            action_data (dict): Data describing the action
        """
        self.last_action = action_data
    
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
        
        action_data = {
            'type': 'ask_card',
            'asking_player': asking_player_id,
            'asking_player_name': asking_player.name,
            'asked_player': asked_player_id,
            'asked_player_name': asked_player.name,
            'card': card,
            'success': success
        }
        
        if success:
            # Transfer card from asked player to asking player
            asked_player.remove_card(card)
            asking_player.add_card(card)
            action_data['transfer'] = True
            
            # Successful ask: asking player gets another turn
            # The current_turn_player_id stays the same
        else:
            # Unsuccessful ask: turn passes to the asked player
            self.current_turn_player_id = asked_player_id
            action_data['next_player'] = asked_player_id
            action_data['next_player_name'] = asked_player.name
        
        self.record_action(action_data)
    
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
        
        self.record_action({
            'type': 'claim_set',
            'set': set_number,
            'set_name': get_set_name(set_number),
            'team': winning_team,
            'declaring_player': declaring_player_id
        })
        
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
        self.record_action({
            'type': 'pass_turn',
            'passer': passer_id,
            'teammate': teammate_id,
            'teammate_name': teammate_player.name
        })
    
    def make_move(self, mover_id, move_data):
        """
        Process a player's move in the game.
        Args:
            action (dict): Action data containing:
        """
        if self.state != IN_PROGRESS:
            raise ValueError("Game is not active")
        move_type = move_data.get('move_type')
        if mover_id != self.current_turn_player_id:
            raise ValueError(f"Not {self.get_player(mover_id).name}'s turn")
        if move_type == 'ask_card':
            asked_player_id = move_data.get('asked_player_id')
            card = move_data.get('card')
            if not asked_player_id or not card:
                raise ValueError("Invalid move data for ask_card")
            self.ask_for_card(mover_id, asked_player_id, card)
        elif move_type == 'claim_set':
            set_number = move_data.get('set_number')
            if not set_number:
                raise ValueError("Invalid move data for claim_set")
            self.claim_set(set_number, mover_id)
        elif move_type == 'pass_turn':
            teammate_id = move_data.get('teammate_id')
            if not teammate_id:
                raise ValueError("Invalid move data for pass_turn")
            self.pass_turn_to_teammate(mover_id, teammate_id)
        else:
            raise ValueError(f"Unknown move type: {move_type}")
    
    def to_dict(self, include_hands=True):
        """
        Return a dictionary representation of the game.
        
        Args:
            include_hands (bool): Whether to include the cards in players' hands
                                 (typically true for the player's own view,
                                  false for other players)
        
        Returns:
            dict: Game data for serialization
        """
        players_data = []
        for player in self.players.values():
            player_data = player.to_dict()
            if not include_hands:
                # Remove the actual cards, but keep the count
                player_data['hand'] = []
            players_data.append(player_data)
        
        current_player = self.get_current_player()
        current_team = current_player.team if current_player else None
            
        return {
            'game_id': self.game_id,
            'players': players_data,
            'current_player_id': self.current_turn_player_id,
            'current_team': current_team,
            'claimed_sets': self.claimed_sets,
            'scores': self.scores,
            'state': self.state,
            'winning_team': self.winning_team,
            'last_action': self.last_action
        }