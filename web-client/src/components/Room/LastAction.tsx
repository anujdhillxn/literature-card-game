// src/components/Room/LastAction.tsx
import React from 'react';
import { type Player, type GameState } from '../../types';
import { getPlayerName } from '../../utils/cardHelpers';
import Card from './Card';

interface LastActionProps {
    lastAction: GameState['last_action'];
    players: Player[];
}

const LastAction: React.FC<LastActionProps> = ({ lastAction, players }) => {
    if (!lastAction) return null;

    const getPlayerNameFromId = (id: number) => getPlayerName(players, id);

    switch (lastAction.type) {
        case 'game_start':
            return (
                <div className="action">
                    Game started! <strong>{lastAction.starting_player_name}</strong> (Team {lastAction.starting_team}) goes first.
                </div>
            );
        case 'ask_card':
            return (
                <div className="action">
                    <strong>{lastAction.asking_player_name}</strong> asked <strong>{lastAction.asked_player_name}</strong> for {Card({ card: lastAction.card, isSelected: false, onSelect: () => { } })}
                    {lastAction.success ? ' and got it!' : ' but they didn\'t have it.'}
                </div>
            );
        case 'claim_set':
            return (
                <div className="action">
                    Team {lastAction.team} claimed <strong>{lastAction.set_name}</strong> (Set {lastAction.set})!
                </div>
            );
        case 'pass_turn':
            return (
                <div className="action">
                    <strong>{getPlayerNameFromId(lastAction.passer)}</strong> passed the turn to <strong>{lastAction.teammate_name}</strong>.
                </div>
            );
        case 'game_end':
            return (
                <div className="action">
                    Game over! {lastAction.winning_team ? `Team ${lastAction.winning_team} wins!` : "It's a tie!"}
                </div>
            );
        default:
            return <div className="action">Unknown action</div>;
    }
};

export default LastAction;