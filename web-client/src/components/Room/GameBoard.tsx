// src/components/Room/GameBoard.tsx
import React from 'react';
import { type Card as CardType, type Player, type RoomState } from '../../types';
import PlayerList from './PlayerList';
import SetGrid from './SetGrid';
import Card from './Card';
import LastAsk from './LastAsk';
import ErrorMessage from '../ErrorMessage';
import { ALL_CARDS, getPlayerName, getPlayerTeam, SET_NAMES } from '../../utils/cardHelpers';

interface GameBoardProps {
    roomId: string;
    userId: string;
    roomState: RoomState;
    isMyTurn: boolean;
    errorMessage: string | null;
    selectedPlayer: string | null;
    selectedCard: CardType | null;
    selectedSet: number | null;
    currentPlayer: Player;
    onSelectPlayer: (playerId: string) => void;
    onSelectCard: (card: CardType) => void;
    onSelectSet: (setId: number) => void;
    onAskCard: () => void;
    onClaimSet: () => void;
    onPassTurn: (teammateId: string) => void;
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
    console.log(roomState);
    return (
        <div className="game-active">
            {errorMessage && <ErrorMessage message={errorMessage} />}
            <h2>Room: {roomId}</h2>
            <button onClick={onLeaveRoom} className="leave-btn">Leave Room</button>
            <div className="game-status">
                <div className="turn-indicator">
                    Current Turn: <strong>{getPlayerName(roomState.game.players, roomState.game.currentPlayerId!)}</strong> (Team {getPlayerTeam(roomState.game.players, roomState.game.currentPlayerId!)})
                    {isMyTurn && <span className="your-turn"> - Your Turn!</span>}
                </div>

                <div className="score">
                    <div className="team1">Team 1: {roomState.game.scores[1]}</div>
                    <div className="team2">Team 2: {roomState.game.scores[2]}</div>
                </div>
            </div>

            <div className="last-action">
                <LastAsk
                    lastAsk={roomState.game.lastAsk}
                />
            </div>
            <div className="game-board">
                <div className="teams-panel">
                    <PlayerList
                        team={1}
                        players={roomState.game.players}
                        userId={userId}
                        currentPlayerId={roomState.game.currentPlayerId}
                        selectedPlayerId={selectedPlayer}
                        isPlaying={true}
                        currentUserTeam={currentPlayer?.team}
                        onSelectPlayer={onSelectPlayer}
                        roomState={roomState}
                    />

                    <PlayerList
                        team={2}
                        players={roomState.game.players}
                        userId={userId}
                        currentPlayerId={roomState.game.currentPlayerId}
                        selectedPlayerId={selectedPlayer}
                        isPlaying={true}
                        currentUserTeam={currentPlayer?.team}
                        onSelectPlayer={onSelectPlayer}
                        roomState={roomState}
                    />
                </div>
                <SetGrid
                    claimedSets={roomState.game.claimedSets}
                    canClaimSets={isMyTurn}
                    selectedSet={selectedSet}
                    onSelectSet={onSelectSet}
                    onClaimSet={onClaimSet}
                />

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
                            {currentPlayer.hand.map(card => (
                                <div key={card} className="card-wrapper">
                                    <Card
                                        card={card}
                                        isSelected={false}
                                        displayOnly={true}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {isMyTurn && selectedPlayer && (
                    <div className="card-selection-overlay">
                        <div className="card-selection-dialog">
                            <h3>Ask {getPlayerName(roomState.game.players, selectedPlayer)} for a card:</h3>
                            <div className="cards-selection-grid">
                                {SET_NAMES.map((setName, index) => {
                                    const startIndex = index * 6;
                                    const endIndex = startIndex + 6;

                                    return (
                                        <React.Fragment key={`set-${index + 1}`}>
                                            {ALL_CARDS.slice(startIndex, endIndex).map(card => (
                                                <div key={card} className="card-wrapper">
                                                    <Card
                                                        card={card}
                                                        isSelected={selectedCard === card}
                                                        onSelect={onSelectCard}
                                                        disabled={currentPlayer?.hand?.includes(card)}
                                                    />
                                                </div>
                                            ))}
                                            <div className="set-divider" data-set-name={setName}></div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                            <div className="dialog-actions">
                                <button
                                    className="ask-button"
                                    disabled={!selectedCard}
                                    onClick={onAskCard}
                                >
                                    Ask for Card
                                </button>
                                <button onClick={onCancelAction}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameBoard;