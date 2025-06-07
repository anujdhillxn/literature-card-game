import React from 'react';
import type { ChangeTeamAction, PreGameAction, RoomState } from '../../../types';
import PlayerList from './PlayerList';

interface PreGameProps {
    roomState: RoomState;
    onGameAction: (action: PreGameAction) => void;
    onChangeHost: (hostId: string) => void;
    onStartGame: () => void;
}

const PreGame: React.FC<PreGameProps> = ({
    roomState,
    onGameAction,
    onChangeHost,
    onStartGame,
}) => {
    const userId = roomState.receiverId;
    const hostId = roomState.hostId;
    const isHost = userId === hostId;
    const currentPlayer = roomState.game.players.find(p => p.id === userId);
    const currentTeam = currentPlayer ? currentPlayer.team : undefined;
    const team1PlayerCount = roomState.game.players.filter(p => p.team === 1).length;
    const team2PlayerCount = roomState.game.players.filter(p => p.team === 2).length;

    const canStartGame = team1PlayerCount === 3 && team2PlayerCount === 3;

    const onChangeTeam = (team: 1 | 2): void => {
        const action: ChangeTeamAction = {
            type: 'change_team',
            player_id: userId,
            new_team: team,
        }
        onGameAction(action);
    };

    return (
        <div className="pre-game">

            <div className="game-info">
                <h3>Game Rules</h3>
                <ul className="game-rules">
                    <li>Each team needs exactly 3 players</li>
                    <li>The game has 9 sets of cards to collect</li>
                    <li>Players ask opponents for specific cards</li>
                    <li>Players can only ask for a card if they possess another card in the same set</li>
                    <li>If the asked player has the card, they give it to the asking player and their turn continues</li>
                    <li>If the asked player does not have the card, the asked player gets the next turn</li>
                    <li>Teams claim sets once they have all cards in a set</li>
                    <li>If the claim is successful, the team gets a point, otherwise the opposing team gets a point</li>
                    <li>The team with the most sets at the end wins</li>
                </ul>
            </div>
            <div className="room-controls">
                {isHost && (
                    <button
                        onClick={onStartGame}
                        disabled={!canStartGame}
                        className="start-btn"
                    >
                        Start Game
                    </button>
                )}
            </div>
            <div className="team-selection">
                {currentTeam !== 1 && (
                    <button onClick={() => onChangeTeam(1)}>
                        Join Team 1
                    </button>
                )}

                {currentTeam !== 2 && (
                    <button onClick={() => onChangeTeam(2)}>
                        Join Team 2
                    </button>
                )}
            </div>
            <div className="teams-container">
                <PlayerList
                    team={1}
                    players={roomState.game.players}
                    userId={userId}
                    currentPlayerId={null}
                    selectedPlayerId={null}
                    isPlaying={false}
                    currentUserTeam={currentTeam}
                    onSelectPlayer={() => { }}
                    isHost={isHost}
                    onMakeHost={onChangeHost}
                    hostId={hostId}
                />

                <PlayerList
                    team={2}
                    players={roomState.game.players}
                    userId={userId}
                    currentPlayerId={null}
                    selectedPlayerId={null}
                    isPlaying={false}
                    currentUserTeam={currentTeam}
                    onSelectPlayer={() => { }}
                    isHost={isHost}
                    onMakeHost={onChangeHost}
                    hostId={hostId}
                />
            </div>




        </div>
    );
};

export default PreGame;