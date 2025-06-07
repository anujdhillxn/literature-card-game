import type { Card } from "./game";

export type AddPlayerActionPayload = {
    type: "add_player";
};

export type StartGameActionPayload = {
    type: "start_game";
};

export type RemovePlayerActionPayload = {
    type: "remove_player";
    player_id: string;
};

export type ChangeHostActionPayload = {
    type: "change_host";
    new_host_id: string;
};

export type LiteratureInGameAction = AskCardMove | ClaimSetMove | PassTurnMove;
export type LiteraturePreGameAction = ChangeTeamAction;

export type PreGameAction = LiteraturePreGameAction;
export type InGameAction = LiteratureInGameAction;

export type InGameActionPayload = {
    type: "in_game_action";
    in_game_action: InGameAction;
};

export type PreGameActionPayload = {
    type: "pre_game_action";
    pre_game_action: PreGameAction;
};

// pre game actions
export type ChangeTeamAction = {
    type: "change_team";
    player_id: string;
    new_team: 1 | 2;
};

// in game moves
export type AskCardMove = {
    type: "ask_card";
    asked_player_id: string;
    card: Card;
};

export type ClaimSetMove = {
    type: "claim_set";
    set_number: number;
};

export type PassTurnMove = {
    type: "pass_turn";
    teammate_id: string;
};

export type RoomActionPayload =
    | AddPlayerActionPayload
    | StartGameActionPayload
    | RemovePlayerActionPayload
    | ChangeHostActionPayload
    | InGameActionPayload
    | PreGameActionPayload;

export type RoomActions = {
    onStartGame: () => void;
    onLeaveRoom: () => void;
    onChangeHost: (newHostId: string) => void;
    onInGameAction: (action: InGameAction) => void;
    onPreGameAction: (action: PreGameAction) => void;
};
