// src/types/actions.ts
import type { Card } from "./game";

export type AddPlayerAction = {
    type: "add_player";
    actor_id: number;
    room_id: string;
};

export type ChangeTeamAction = {
    type: "change_team";
    actor_id: number;
    player_id: number;
    new_team: 1 | 2;
    room_id: string;
};

export type StartGameAction = {
    type: "start_game";
    actor_id: number;
    room_id: string;
};

export type RemovePlayerAction = {
    type: "remove_player";
    actor_id: number;
    player_id: number;
    room_id: string;
};

export type ChangeHostAction = {
    type: "change_host";
    actor_id: number;
    new_host_id: number;
    room_id: string;
};

export type MakeMoveAction = {
    type: "make_move";
    actor_id: number;
    room_id: string;
    move_data: AskCardMove | ClaimSetMove | PassTurnMove;
};

// Game move types
export type AskCardMove = {
    move_type: "ask_card";
    asked_player_id: number;
    card: Card;
};

export type ClaimSetMove = {
    move_type: "claim_set";
    set_number: number;
};

export type PassTurnMove = {
    move_type: "pass_turn";
    teammate_id: number;
};

export type GameAction =
    | AddPlayerAction
    | ChangeTeamAction
    | StartGameAction
    | RemovePlayerAction
    | ChangeHostAction
    | MakeMoveAction;
