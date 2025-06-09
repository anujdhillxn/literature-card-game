// src/components/Room/PlayerList.tsx
import React from 'react';
import { type LiteraturePlayer, type RoomState } from '../../../types';

interface PlayerListProps {
    team: 1 | 2;
    players: LiteraturePlayer[];
    userId: string;
    currentPlayerId: string | null;
    selectedPlayerId: string | null;
    isPlaying: boolean;
    currentUserTeam: 1 | 2 | undefined;
    onSelectPlayer: (playerId: string) => void;
    isHost?: boolean;
    onMakeHost?: (playerId: string) => void;
    hostId?: string;
    roomState?: RoomState
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
    onMakeHost,
    roomState,
}) => {
    const teamPlayers = players.filter(p => p.team === team);
    const hostId = roomState?.hostId || '';
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
                    const disconnected = roomState && !(roomState?.connectedPlayers.includes(p.id));
                    return (
                        <li
                            key={p.id}
                            className={`player ${isSelected ? 'selected' : ''} ${isCurrentUser ? 'you' : ''} ${isCurrentTurn ? 'current-turn' : ''} ${disconnected ? 'disconnected' : ''}`}
                            onClick={() => canBeSelected ? onSelectPlayer(p.id) : null}
                        >
                            {p.name} {isPlaying && `(${p.card_count} cards)`}
                            {isCurrentUser && <span className="you-badge">You</span>}
                            {p.id === hostId && <span className="host-badge">Host</span>}
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