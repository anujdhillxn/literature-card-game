// src/components/Room/PlayerList.tsx
import React from 'react';
import { type Player } from '../../types';

interface PlayerListProps {
    team: 1 | 2;
    players: Player[];
    userId: number;
    currentPlayerId: number | null;
    selectedPlayerId: number | null;
    isPlaying: boolean;
    currentUserTeam: 1 | 2 | undefined;
    onSelectPlayer: (playerId: number) => void;
    isHost?: boolean;
    onMakeHost?: (playerId: number) => void;
}

const PlayerList: React.FC<PlayerListProps> = ({
    team,
    players,
    userId,
    currentPlayerId,
    selectedPlayerId,
    isPlaying,
    currentUserTeam,
    onSelectPlayer,
    isHost,
    onMakeHost
}) => {
    const teamPlayers = players.filter(p => p.team === team);

    if (!teamPlayers.length) {
        return (
            <div className={`team-container team${team}`}>
                <h3>Team {team}</h3>
                <p>No players</p>
            </div>
        );
    }

    return (
        <div className={`team-container team${team}`}>
            <h3>Team {team}</h3>
            <ul>
                {teamPlayers.map(p => {
                    const isCurrentUser = p.id === userId;
                    const isCurrentTurn = p.id === currentPlayerId;
                    const isSelected = p.id === selectedPlayerId;
                    const canBeSelected = !isCurrentUser && p.team !== currentUserTeam && isPlaying;

                    return (
                        <li
                            key={p.id}
                            className={`player ${isSelected ? 'selected' : ''} ${isCurrentUser ? 'you' : ''} ${isCurrentTurn ? 'current-turn' : ''}`}
                            onClick={() => canBeSelected ? onSelectPlayer(p.id) : null}
                        >
                            {p.name} {isPlaying && `(${p.card_count} cards)`}
                            {isCurrentUser && <span className="you-badge">You</span>}
                            {p.is_host && <span className="host-badge">Host</span>}
                            {isCurrentTurn && <span className="current-turn-badge">← Current Turn</span>}
                            {isHost && !isCurrentUser && !isPlaying && (
                                <button className="make-host-btn" onClick={() => onMakeHost?.(p.id)}>
                                    Make Host
                                </button>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default PlayerList;