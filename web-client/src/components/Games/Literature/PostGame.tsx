// src/components/Room/GameOver.tsx
import React from 'react';
import { type RoomState } from '../../../types';
import { SET_NAMES } from '../../../utils/cardHelpers';

interface PostGameProps {
    roomState: RoomState;
    onLeaveRoom: () => void;
}

const PostGame: React.FC<PostGameProps> = ({
    roomState,
    onLeaveRoom
}) => {
    return (
        <div className="game-ended">
            <h2>Game Over - Room: {roomState.room_id}</h2>

            <div className="game-result">
                <h3>Final Score</h3>
                <div className="score">
                    <div className="team1">Team 1: {roomState.game.scores[1]}</div>
                    <div className="team2">Team 2: {roomState.game.scores[2]}</div>
                </div>

                <h3>Winner</h3>
                <div className="winner">
                    {roomState.game.winningTeam ?
                        `Team ${roomState.game.winningTeam} wins!` :
                        "It's a tie!"}
                </div>
            </div>

            <div className="claimed-sets">
                <h3>Claimed Sets</h3>
                <div className="sets-grid">
                    {SET_NAMES.map((name, index) => {
                        const setNumber = index + 1;
                        const team = roomState.game.claimedSets[setNumber];
                        return (
                            <div
                                key={setNumber}
                                className={`set ${team ? `team${team}` : ''}`}
                            >
                                <div className="set-number">Set {setNumber}</div>
                                <div className="set-name">{name}</div>
                                {team && <div className="claimed-by">Team {team}</div>}
                            </div>
                        );
                    })}
                </div>
            </div>

            <button onClick={onLeaveRoom}>Leave Room</button>
        </div>
    );
};

export default PostGame;