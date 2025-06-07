// src/types/actions.ts
import type { Card } from "./game";

export type AddPlayerActionPayload = {
    type: "add_player";
    room_id: string;
};

export type ChangeTeamActionPayload = {
    type: "change_team";
    player_id: string;
    new_team: 1 | 2;
    room_id: string;
};

export type StartGameActionPayload = {
    type: "start_game";
    room_id: string;
};

export type RemovePlayerActionPayload = {
    type: "remove_player";
    player_id: string;
    room_id: string;
};

export type ChangeHostActionPayload = {
    type: "change_host";
    new_host_id: string;
    room_id: string;
};

export type MakeMoveActionPayload = {
    type: "make_move";
    room_id: string;
    move_data: AskCardMove | ClaimSetMove | PassTurnMove;
};

// Game move types
export type AskCardMove = {
    move_type: "ask_card";
    asked_player_id: string;
    card: Card;
};

export type ClaimSetMove = {
    move_type: "claim_set";
    set_number: number;
};

export type PassTurnMove = {
    move_type: "pass_turn";
    teammate_id: string;
};

export type RoomActionPayload =
    | AddPlayerActionPayload
    | ChangeTeamActionPayload
    | StartGameActionPayload
    | RemovePlayerActionPayload
    | ChangeHostActionPayload
    | MakeMoveActionPayload;

export type RoomActions = {
    onStartGame: () => void;
    onLeaveRoom: () => void;
    onChangeHost: (newHostId: string) => void;
    onChangeTeam: (newTeam: 2 | 1) => void;
    onGameAction: (moveData: AskCardMove | ClaimSetMove | PassTurnMove) => void;
};
