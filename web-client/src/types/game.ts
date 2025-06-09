// src/types/game.ts
export type Card = string; // Format: "AC1", "2H5", etc.

export interface Player {
    id: string;
    name: string;
}

export interface LiteraturePlayer extends Player {
    team: 1 | 2;
    hand: Card[];
    card_count: number;
}

export type Ask = {
    askingPlayerId: string;
    askedPlayerId: string;
    card: Card;
    success: boolean;
};

export interface GameState {
    gameId: string;
    state: "not_started" | "in_progress" | "ended";
}

export interface LiteratureGameState extends GameState {
    players: LiteraturePlayer[];
    currentPlayerId: string | null;
    claimedSets: Record<number, 1 | 2>;
    scores: Record<number, number>;
    winningTeam: 1 | 2 | null;
    lastAsk: Ask | null;
}

export type GameType = "literature";

export interface BaseRoomState {
    room_id: string;
    hostId: string;
    connectedPlayers: string[];
    receiverId: string;
}

export interface LiteratureRoomState extends BaseRoomState {
    type: "literature";
    game: LiteratureGameState;
}

export type RoomState = LiteratureRoomState;

export type WebSocketMessageSuccess = {
    currentState: RoomState;
    success: true;
};

export type WebSocketMessageError = {
    error: string;
    success: false;
    disconnect?: boolean;
};

export type WebSocketMessage = WebSocketMessageSuccess | WebSocketMessageError;
