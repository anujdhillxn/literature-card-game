// src/components/Room/GameBoard.tsx
import React from 'react';
import { type Card as CardType, type Player, type RoomState } from '../../types';
import PlayerList from './PlayerList';
import SetGrid from './SetGrid';
import Card from './Card';
import LastAction from './LastAction';
import ErrorMessage from '../ErrorMessage';
import { generateAllCards, getPlayerName } from '../../utils/cardHelpers';

interface GameBoardProps {
    roomId: string;
    userId: number;
    roomState: RoomState;
    isMyTurn: boolean;
    errorMessage: string | null;
    selectedPlayer: number | null;
    selectedCard: CardType | null;
    selectedSet: number | null;
    currentPlayer?: Player;
    onSelectPlayer: (playerId: number) => void;
    onSelectCard: (card: CardType) => void;
    onSelectSet: (setId: number) => void;
    onAskCard: () => void;
    onClaimSet: () => void;
    onPassTurn: (teammateId: number) => void;
    onLeaveRoom: () => void;
    onCancelAction: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
    roomId,
    userId,
    roomState,
    isMyTurn,
    errorMessage,
    selectedPlayer,
    selectedCard,
    selectedSet,
    currentPlayer,
    onSelectPlayer,
    onSelectCard,
    onSelectSet,
    onAskCard,
    onClaimSet,
    onPassTurn,
    onLeaveRoom,
    onCancelAction
}) => {
    return (
        <div className="room game-active">
            {errorMessage && <ErrorMessage message={errorMessage} />}
            <h2>Room: {roomId}</h2>
            <div className="game-status">
                <div className="turn-indicator">
                    Current Turn: <strong>{getPlayerName(roomState.game.players, roomState.game.current_player_id!)}</strong> (Team {roomState.game.current_team})
                    {isMyTurn && <span className="your-turn"> - Your Turn!</span>}
                </div>

                <div className="score">
                    <div className="team1">Team 1: {roomState.game.scores[1]}</div>
                    <div className="team2">Team 2: {roomState.game.scores[2]}</div>
                </div>
            </div>

            <div className="last-action">
                <LastAction
                    lastAction={roomState.game.last_action}
                    players={roomState.game.players}
                />
            </div>

            <div className="game-board">
                <div className="teams-panel">
                    <PlayerList
                        team={1}
                        players={roomState.game.players}
                        userId={userId}
                        currentPlayerId={roomState.game.current_player_id}
                        selectedPlayerId={selectedPlayer}
                        isPlaying={true}
                        currentUserTeam={currentPlayer?.team}
                        onSelectPlayer={onSelectPlayer}
                    />

                    <SetGrid
                        claimedSets={roomState.game.claimed_sets}
                        canClaimSets={isMyTurn}
                        selectedSet={selectedSet}
                        onSelectSet={onSelectSet}
                        onClaimSet={onClaimSet}
                    />

                    <PlayerList
                        team={2}
                        players={roomState.game.players}
                        userId={userId}
                        currentPlayerId={roomState.game.current_player_id}
                        selectedPlayerId={selectedPlayer}
                        isPlaying={true}
                        currentUserTeam={currentPlayer?.team}
                        onSelectPlayer={onSelectPlayer}
                    />
                </div>

                <div className="your-hand">
                    <h3>Your Hand</h3>
                    {!currentPlayer?.hand?.length ? (
                        <div className="no-cards">
                            You have no cards.
                            {isMyTurn && (
                                <div className="pass-turn">
                                    <h4>Pass your turn to:</h4>
                                    <div className="teammate-options">
                                        {roomState.game.players
                                            .filter(p => p.team === currentPlayer?.team && p.id !== userId)
                                            .map(p => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => onPassTurn(p.id)}
                                                >
                                                    {p.name}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="cards-container">
                            {generateAllCards().map(card => {
                                const isInHand = currentPlayer?.hand?.includes(card);
                                return (
                                    <div key={card} className="card-wrapper">
                                        <Card
                                            card={card}
                                            isSelected={selectedCard === card}
                                            onSelect={onSelectCard}
                                            disabled={Boolean(isInHand)} // Pass disabled state to Card
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {isMyTurn && selectedPlayer && selectedCard && (
                    <div className="action-controls">
                        <button onClick={onAskCard}>
                            Ask {getPlayerName(roomState.game.players, selectedPlayer)} for {selectedCard}
                        </button>
                        <button onClick={onCancelAction}>
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <button onClick={onLeaveRoom} className="leave-btn">Leave Room</button>
        </div>
    );
};

export default GameBoard;