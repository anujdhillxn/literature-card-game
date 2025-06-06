import type { Card } from "../types";

export const ALL_CARDS: Card[] = [
    // Set 1: LOWER_CLUBS
    "AC1",
    "2C1",
    "3C1",
    "4C1",
    "5C1",
    "6C1",

    // Set 2: HIGHER_CLUBS
    "8C2",
    "9C2",
    "1C2",
    "JC2",
    "QC2",
    "KC2",

    // Set 3: LOWER_DIAMONDS
    "AD3",
    "2D3",
    "3D3",
    "4D3",
    "5D3",
    "6D3",

    // Set 4: HIGHER_DIAMONDS
    "8D4",
    "9D4",
    "1D4",
    "JD4",
    "QD4",
    "KD4",

    // Set 5: LOWER_HEARTS
    "AH5",
    "2H5",
    "3H5",
    "4H5",
    "5H5",
    "6H5",

    // Set 6: HIGHER_HEARTS
    "8H6",
    "9H6",
    "1H6",
    "JH6",
    "QH6",
    "KH6",

    // Set 7: LOWER_SPADES
    "AS7",
    "2S7",
    "3S7",
    "4S7",
    "5S7",
    "6S7",

    // Set 8: HIGHER_SPADES
    "8S8",
    "9S8",
    "1S8",
    "JS8",
    "QS8",
    "KS8",

    // Set 9: SEVENS_AND_JOKERS
    "7C9",
    "7D9",
    "7H9",
    "7S9",
    "JR9",
    "JB9",
];

export const SET_NAMES = [
    "Lower Clubs",
    "Higher Clubs",
    "Lower Diamonds",
    "Higher Diamonds",
    "Lower Hearts",
    "Higher Hearts",
    "Lower Spades",
    "Higher Spades",
    "Sevens & Jokers",
];

export const getPlayerTeam = (
    players: Array<{ id: number; team: 1 | 2 }> | undefined,
    id: number
): 1 | 2 => {
    const player = players?.find((p) => p.id === id);
    return player?.team || 1; // Default to team 1 if not found
};

export const getPlayerName = (
    players: Array<{ id: number; name: string }> | undefined,
    id: number
): string => {
    const player = players?.find((p) => p.id === id);
    return player?.name || `Player ${id}`;
};
