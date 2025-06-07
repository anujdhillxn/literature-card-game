// src/types/game.ts
export type Card = string; // Format: "AC1", "2H5", etc.

export type Player = {
    id: string;
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
    type: string;
    players: Player[];
    currentPlayerId: string | null;
    claimedSets: Record<number, 1 | 2>;
    scores: Record<number, number>;
    state: "not_started" | "in_progress" | "ended";
    winningTeam: 1 | 2 | null;
    lastAsk: Ask | null;
};

export type RoomState = {
    room_id: string;
    hostId: string;
    players: Player[];
    game: GameState;
    receiverId: string;
};

export type WebSocketMessageSuccess = {
    currentState: RoomState;
    success: true;
};

export type WebSocketMessageError = {
    error: string;
    success: false;
};

export type WebSocketMessage = WebSocketMessageSuccess | WebSocketMessageError;
