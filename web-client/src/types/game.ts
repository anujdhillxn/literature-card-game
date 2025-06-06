// src/types/game.ts
export type Card = string; // Format: "AC1", "2H5", etc.

export type Player = {
    id: number;
    name: string;
    team: 1 | 2;
    hand?: Card[];
    card_count: number;
    is_host?: boolean;
};

export type GameState = {
    game_id: string;
    players: Player[];
    current_player_id: number | null;
    current_team: 1 | 2 | null;
    claimed_sets: Record<number, 1 | 2>;
    scores: Record<number, number>;
    state: "not_started" | "in_progress" | "ended";
    winning_team: 1 | 2 | null;
    last_action: any;
};

export type RoomState = {
    room_id: string;
    host_id: number;
    players: Player[];
    game: GameState;
};

export type WebSocketMessage = {
    currentState?: RoomState;
    lastAction?: any;
    success?: boolean;
    error?: string;
};

// Set names constant
export const SET_NAMES = [
    "LOWER_CLUBS",
    "HIGHER_CLUBS",
    "LOWER_DIAMONDS",
    "HIGHER_DIAMONDS",
    "LOWER_HEARTS",
    "HIGHER_HEARTS",
    "LOWER_SPADES",
    "HIGHER_SPADES",
    "SEVENS_AND_JOKERS",
];
