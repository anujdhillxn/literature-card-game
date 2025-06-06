import type { Card } from "../types";

export const generateAllCards = (): Card[] => {
    const allCards: Card[] = [];

    // Generate standard cards
    const ranks = [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "1",
        "J",
        "Q",
        "K",
    ];
    const suits = ["H", "D", "C", "S"];
    const sets = ["1", "2"]; // Assuming you have 2 sets in your game

    for (const set of sets) {
        for (const suit of suits) {
            for (const rank of ranks) {
                allCards.push(`${rank}${suit}${set}`);
            }
        }
    }

    // Add Jokers if your game uses them
    allCards.push("JR1"); // Red Joker
    allCards.push("JB1"); // Black Joker

    return allCards;
};

export const getPlayerName = (
    players: Array<{ id: number; name: string }> | undefined,
    id: number
): string => {
    const player = players?.find((p) => p.id === id);
    return player?.name || `Player ${id}`;
};
