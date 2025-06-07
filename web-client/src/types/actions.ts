// src/types/actions.ts
import type { Card } from "./game";

export type AddPlayerAction = {
    type: "add_player";
    room_id: string;
};

export type ChangeTeamAction = {
    type: "change_team";
    player_id: string;
    new_team: 1 | 2;
    room_id: string;
};

export type StartGameAction = {
    type: "start_game";
    room_id: string;
};

export type RemovePlayerAction = {
    type: "remove_player";
    player_id: string;
    room_id: string;
};

export type ChangeHostAction = {
    type: "change_host";
    new_host_id: string;
    room_id: string;
};

export type MakeMoveAction = {
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

export type RoomAction =
    | AddPlayerAction
    | ChangeTeamAction
    | StartGameAction
    | RemovePlayerAction
    | ChangeHostAction
    | MakeMoveAction;
