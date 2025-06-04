"""
Card representation for Literature card game.
Each card is represented as a 3-character string:
- First character: Rank (A, 2-9, 1(for 10), J, Q, K)
- Second character: Suit (C, D, H, S) or type for Jokers (R, B)
- Third character: Set number (1-9)

Sets:
1. LOWER_CLUBS - A, 2, 3, 4, 5, 6 of Clubs
2. HIGHER_CLUBS - 8, 9, 10, J, Q, K of Clubs
3. LOWER_DIAMONDS - A, 2, 3, 4, 5, 6 of Diamonds
4. HIGHER_DIAMONDS - 8, 9, 10, J, Q, K of Diamonds
5. LOWER_HEARTS - A, 2, 3, 4, 5, 6 of Hearts
6. HIGHER_HEARTS - 8, 9, 10, J, Q, K of Hearts
7. LOWER_SPADES - A, 2, 3, 4, 5, 6 of Spades
8. HIGHER_SPADES - 8, 9, 10, J, Q, K of Spades
9. SEVENS_AND_JOKERS - 7 of all suits and the two jokers
"""

# Individual cards with set number as third character
# Clubs (C)
ACE_CLUBS = "AC1"
TWO_CLUBS = "2C1"
THREE_CLUBS = "3C1"
FOUR_CLUBS = "4C1"
FIVE_CLUBS = "5C1"
SIX_CLUBS = "6C1"
SEVEN_CLUBS = "7C9"
EIGHT_CLUBS = "8C2"
NINE_CLUBS = "9C2"
TEN_CLUBS = "1C2"  # Using '1' for 10 to keep consistent 3-char length
JACK_CLUBS = "JC2"
QUEEN_CLUBS = "QC2"
KING_CLUBS = "KC2"

# Diamonds (D)
ACE_DIAMONDS = "AD3"
TWO_DIAMONDS = "2D3"
THREE_DIAMONDS = "3D3"
FOUR_DIAMONDS = "4D3"
FIVE_DIAMONDS = "5D3"
SIX_DIAMONDS = "6D3"
SEVEN_DIAMONDS = "7D9"
EIGHT_DIAMONDS = "8D4"
NINE_DIAMONDS = "9D4"
TEN_DIAMONDS = "1D4"
JACK_DIAMONDS = "JD4"
QUEEN_DIAMONDS = "QD4"
KING_DIAMONDS = "KD4"

# Hearts (H)
ACE_HEARTS = "AH5"
TWO_HEARTS = "2H5"
THREE_HEARTS = "3H5"
FOUR_HEARTS = "4H5"
FIVE_HEARTS = "5H5"
SIX_HEARTS = "6H5"
SEVEN_HEARTS = "7H9"
EIGHT_HEARTS = "8H6"
NINE_HEARTS = "9H6"
TEN_HEARTS = "1H6"
JACK_HEARTS = "JH6"
QUEEN_HEARTS = "QH6"
KING_HEARTS = "KH6"

# Spades (S)
ACE_SPADES = "AS7"
TWO_SPADES = "2S7"
THREE_SPADES = "3S7"
FOUR_SPADES = "4S7"
FIVE_SPADES = "5S7"
SIX_SPADES = "6S7"
SEVEN_SPADES = "7S9"
EIGHT_SPADES = "8S8"
NINE_SPADES = "9S8"
TEN_SPADES = "1S8"
JACK_SPADES = "JS8"
QUEEN_SPADES = "QS8"
KING_SPADES = "KS8"

# Jokers
RED_JOKER = "JR9"
BLACK_JOKER = "JB9"

# All cards in a deck
ALL_CARDS = set([
    # Clubs
    ACE_CLUBS, TWO_CLUBS, THREE_CLUBS, FOUR_CLUBS, FIVE_CLUBS, SIX_CLUBS,
    SEVEN_CLUBS, EIGHT_CLUBS, NINE_CLUBS, TEN_CLUBS, JACK_CLUBS, QUEEN_CLUBS, KING_CLUBS,
    # Diamonds
    ACE_DIAMONDS, TWO_DIAMONDS, THREE_DIAMONDS, FOUR_DIAMONDS, FIVE_DIAMONDS, SIX_DIAMONDS,
    SEVEN_DIAMONDS, EIGHT_DIAMONDS, NINE_DIAMONDS, TEN_DIAMONDS, JACK_DIAMONDS, QUEEN_DIAMONDS, KING_DIAMONDS,
    # Hearts
    ACE_HEARTS, TWO_HEARTS, THREE_HEARTS, FOUR_HEARTS, FIVE_HEARTS, SIX_HEARTS,
    SEVEN_HEARTS, EIGHT_HEARTS, NINE_HEARTS, TEN_HEARTS, JACK_HEARTS, QUEEN_HEARTS, KING_HEARTS,
    # Spades
    ACE_SPADES, TWO_SPADES, THREE_SPADES, FOUR_SPADES, FIVE_SPADES, SIX_SPADES,
    SEVEN_SPADES, EIGHT_SPADES, NINE_SPADES, TEN_SPADES, JACK_SPADES, QUEEN_SPADES, KING_SPADES,
    # Jokers
    RED_JOKER, BLACK_JOKER
])

# Literature game sets - each set has exactly 6 cards
LOWER_CLUBS = set([ACE_CLUBS, TWO_CLUBS, THREE_CLUBS, FOUR_CLUBS, FIVE_CLUBS, SIX_CLUBS])
HIGHER_CLUBS = set([EIGHT_CLUBS, NINE_CLUBS, TEN_CLUBS, JACK_CLUBS, QUEEN_CLUBS, KING_CLUBS])

LOWER_DIAMONDS = set([ACE_DIAMONDS, TWO_DIAMONDS, THREE_DIAMONDS, FOUR_DIAMONDS, FIVE_DIAMONDS, SIX_DIAMONDS])
HIGHER_DIAMONDS = set([EIGHT_DIAMONDS, NINE_DIAMONDS, TEN_DIAMONDS, JACK_DIAMONDS, QUEEN_DIAMONDS, KING_DIAMONDS])

LOWER_HEARTS = set([ACE_HEARTS, TWO_HEARTS, THREE_HEARTS, FOUR_HEARTS, FIVE_HEARTS, SIX_HEARTS])
HIGHER_HEARTS = set([EIGHT_HEARTS, NINE_HEARTS, TEN_HEARTS, JACK_HEARTS, QUEEN_HEARTS, KING_HEARTS])

LOWER_SPADES = set([ACE_SPADES, TWO_SPADES, THREE_SPADES, FOUR_SPADES, FIVE_SPADES, SIX_SPADES])
HIGHER_SPADES = set([EIGHT_SPADES, NINE_SPADES, TEN_SPADES, JACK_SPADES, QUEEN_SPADES, KING_SPADES])

SEVENS_AND_JOKERS = set([SEVEN_CLUBS, SEVEN_DIAMONDS, SEVEN_HEARTS, SEVEN_SPADES, RED_JOKER, BLACK_JOKER])

# All sets for the game
ALL_SETS = [
    LOWER_CLUBS,      # Set 1
    HIGHER_CLUBS,     # Set 2
    LOWER_DIAMONDS,   # Set 3
    HIGHER_DIAMONDS,  # Set 4
    LOWER_HEARTS,     # Set 5
    HIGHER_HEARTS,    # Set 6
    LOWER_SPADES,     # Set 7
    HIGHER_SPADES,    # Set 8
    SEVENS_AND_JOKERS # Set 9
]

set_names = [
        "LOWER_CLUBS", "HIGHER_CLUBS", 
        "LOWER_DIAMONDS", "HIGHER_DIAMONDS",
        "LOWER_HEARTS", "HIGHER_HEARTS",
        "LOWER_SPADES", "HIGHER_SPADES",
        "SEVENS_AND_JOKERS"
    ]

# Helper function to get set number from card
def get_set_number(card):
    """Return the set number (1-9) from a card string"""
    return int(card[2])

# Helper function to get set name from set number
def get_set_name(set_number):
    """Return the set name from a set number (1-9)"""
    return set_names[set_number-1]

def get_set_cards(set_number):
    """Return the set of cards for a given set number (1-9)"""
    if 1 <= set_number <= 9:
        return ALL_SETS[set_number - 1]
    else:
        raise ValueError("Set number must be between 1 and 9")