// src/components/Room/GameBoard.tsx
import React, { useState } from 'react';
import { type AskCardMove, type Card as CardType, type ClaimSetMove, type InGameAction, type PassTurnMove, type RoomState } from '../../../types';
import PlayerList from './PlayerList';
import SetGrid from './SetGrid';
import Card from './Card';
import LastAsk from './LastAsk';
import { ALL_CARDS, getPlayerName, getPlayerTeam, SET_NAMES } from '../../../utils/cardHelpers';

interface InGameProps {
    roomState: RoomState;
    onLeaveRoom: () => void;
    onGameAction: (action: InGameAction) => void;
}

const InGame: React.FC<InGameProps> = ({
    roomState,
    onGameAction
}) => {
    const userId = roomState.receiverId;
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
    const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
    const [selectedSet, setSelectedSet] = useState<number | null>(null);

    const onAskCard = (): void => {
        if (!selectedPlayer || !selectedCard) return;

        const moveData: AskCardMove = {
            type: 'ask_card',
            asked_player_id: selectedPlayer,
            card: selectedCard
        };
        onGameAction(moveData);
        setSelectedPlayer(null);
        setSelectedCard(null);
    };

    const onClaimSet = (): void => {
        if (!selectedSet) return;

        const moveData: ClaimSetMove = {
            type: 'claim_set',
            set_number: selectedSet
        };
        onGameAction(moveData);
        setSelectedSet(null);
    };

    const onPassTurn = (teammateId: string): void => {
        const moveData: PassTurnMove = {
            type: 'pass_turn',
            teammate_id: teammateId
        };
        onGameAction(moveData);
    }

    const onCancelAction = (): void => {
        setSelectedPlayer(null);
        setSelectedCard(null);
        setSelectedSet(null);
    };
    const currentPlayer = roomState.game.players.find(p => p.id === userId);
    const isMyTurn = currentPlayer?.id === roomState.game.currentPlayerId;
    console.log(roomState);
    return (
        <div className="game-active">
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
                    players={roomState.game.players}
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
                        onSelectPlayer={setSelectedPlayer}
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
                        onSelectPlayer={setSelectedPlayer}
                        roomState={roomState}
                    />
                </div>
                <SetGrid
                    claimedSets={roomState.game.claimedSets}
                    canClaimSets={isMyTurn}
                    selectedSet={selectedSet}
                    onSelectSet={setSelectedSet}
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
                                                        onSelect={setSelectedCard}
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

export default InGame;