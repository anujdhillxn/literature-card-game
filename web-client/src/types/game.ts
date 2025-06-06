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

export type Ask = {
    askingPlayerId: number;
    askedPlayerId: number;
    card: Card;
    success: boolean;
};

export type GameState = {
    gameId: string;
    players: Player[];
    currentPlayerId: number | null;
    claimedSets: Record<number, 1 | 2>;
    scores: Record<number, number>;
    state: "not_started" | "in_progress" | "ended";
    winningTeam: 1 | 2 | null;
    lastAsk: Ask | null;
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
