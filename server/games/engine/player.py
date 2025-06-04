"""
Player implementation for Literature card game.
"""

class Player:
    """Represents a player in the Literature card game."""

    def __init__(self, id, name, team):
        """
        Initialize a player.
        
        Args:
            id: Unique identifier for the player
            name (str): Player's display name
            team (int): Team number (1 or 2)
        """
        self.id = id
        self.name = name
        self.team = team
        self.hand = set()  # Cards the player currently holds
        
    def add_card(self, card):
        """
        Add a card to the player's hand.
        
        Args:
            card (str): Card to add to the hand
        """
        self.hand.add(card)
    
    def remove_card(self, card):
        """
        Remove a card from the player's hand.
        
        Args:
            card (str): Card to remove from the hand
            
        Returns:
            bool: True if card was in hand and removed, False otherwise
        """
        if card in self.hand:
            self.hand.remove(card)
            return True
        return False
    
    def has_card(self, card):
        """
        Check if player has a specific card.
        
        Args:
            card (str): Card to check for
            
        Returns:
            bool: True if the card is in the player's hand
        """
        return card in self.hand
    
    def to_dict(self):
        """
        Return a dictionary representation of the player.
        
        Returns:
            dict: Player data for serialization
        """
    
        return {
            'id': self.id,
            'name': self.name,
            'team': self.team,
            'hand': list(self.hand),
            'card_count': len(self.hand)
        }
    
    def __str__(self):
        """String representation of the player."""
        return f"Player {self.name} (Team {self.team}): {len(self.hand)} cards"