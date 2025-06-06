// src/components/Room/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import useWebSocket from '../../hooks/useWebSocket';
import type {
    Card,
    RoomState,
    WebSocketMessage,
    ChangeTeamAction,
    StartGameAction,
    RemovePlayerAction,
    ChangeHostAction,
    MakeMoveAction,
    AskCardMove,
    ClaimSetMove,
    PassTurnMove
} from '../../types';
import GameBoard from './GameBoard';
import GameOver from './GameOver';
import PreGame from './PreGame';
import './Room.css';

interface RoomProps {
    roomId: string;
    userToken: number;
    username: string;
    onLeaveRoom: () => void;
}

const Room: React.FC<RoomProps> = ({ roomId, userToken, username, onLeaveRoom }) => {
    // State
    const [roomState, setRoomState] = useState<RoomState | null>(null);
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [selectedSet, setSelectedSet] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // Process WebSocket messages
    const handleMessage = useCallback((data: WebSocketMessage): void => {
        if (data.error) {
            setErrorMessage(data.error);
            return;
        }
        console.log("Received message:", data);
        if (data.currentState) {
            setRoomState(data.currentState);
        }
    }, []);

    // Connect to the room
    const { status, error, sendMessage, closeConnection } = useWebSocket(
        roomId,
        { userToken, username },
        handleMessage
    );

    // Combined error state
    const displayError = error || errorMessage;

    // Current player state
    const userId = roomState?.receiverId;
    const currentPlayer = roomState?.game?.players?.find(p => p.id === userId);
    const isHost = roomState?.hostId === userId;
    const isMyTurn = roomState?.game?.currentPlayerId === userId;
    const gameStarted = roomState?.game?.state === 'in_progress';
    const gameEnded = roomState?.game?.state === 'ended';

    console.log("Current Player:", currentPlayer);

    // Clear error message after 5 seconds
    useEffect((): (() => void) => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(null), 5000);
            return () => clearTimeout(timer);
        }
        return () => { }; // Return empty function when no timer is set
    }, [errorMessage]);

    // Action handlers
    const handleChangeTeam = (newTeam: 1 | 2): void => {
        const action: ChangeTeamAction = {
            type: 'change_team',
            player_id: userId!,
            new_team: newTeam,
            room_id: roomId
        };
        sendMessage(action);
    };

    const handleStartGame = (): void => {
        if (!isHost) return;

        const action: StartGameAction = {
            type: 'start_game',
            room_id: roomId
        };
        sendMessage(action);
    };

    const handleLeaveRoom = (): void => {
        const action: RemovePlayerAction = {
            type: 'remove_player',
            player_id: userId!,
            room_id: roomId
        };
        sendMessage(action);

        closeConnection();
        onLeaveRoom();
    };

    const handleChangeHost = (newHostId: string): void => {
        if (!isHost) return;

        const action: ChangeHostAction = {
            type: 'change_host',
            new_host_id: newHostId,
            room_id: roomId
        };
        sendMessage(action);
    };

    const handleAskCard = (): void => {
        if (!selectedPlayer || !selectedCard || !isMyTurn) return;

        const moveData: AskCardMove = {
            move_type: 'ask_card',
            asked_player_id: selectedPlayer,
            card: selectedCard
        };

        const action: MakeMoveAction = {
            type: 'make_move',
            room_id: roomId,
            move_data: moveData
        };
        sendMessage(action);

        setSelectedPlayer(null);
        setSelectedCard(null);
    };

    const handleClaimSet = (): void => {
        if (!selectedSet || !isMyTurn) return;

        const moveData: ClaimSetMove = {
            move_type: 'claim_set',
            set_number: selectedSet
        };

        const action: MakeMoveAction = {
            type: 'make_move',
            room_id: roomId,
            move_data: moveData
        };
        sendMessage(action);

        setSelectedSet(null);
    };

    const handlePassTurn = (teammateId: string): void => {
        if (!isMyTurn) return;

        const moveData: PassTurnMove = {
            move_type: 'pass_turn',
            teammate_id: teammateId
        };

        const action: MakeMoveAction = {
            type: 'make_move',
            room_id: roomId,
            move_data: moveData
        };
        sendMessage(action);
    };

    const handleCancelAction = (): void => {
        setSelectedPlayer(null);
        setSelectedCard(null);
        setSelectedSet(null);
    };

    // Render different views based on game state
    if (status === 'connecting' || !roomState) {
        return <div className="loading">Connecting to room {roomId}...</div>;
    }

    const currentState = () => {
        if (!userId) {
            return <div className="error">Error: User ID not found in room state.</div>;
        }
        if (gameEnded) {
            return (
                <GameOver
                    roomId={roomId}
                    roomState={roomState}
                    errorMessage={displayError}
                    onLeaveRoom={handleLeaveRoom}
                />
            );
        }
        if (gameStarted && currentPlayer) {
            return (
                <GameBoard
                    roomId={roomId}
                    userId={userId}
                    roomState={roomState}
                    isMyTurn={!!isMyTurn}
                    errorMessage={displayError}
                    selectedPlayer={selectedPlayer}
                    selectedCard={selectedCard}
                    selectedSet={selectedSet}
                    currentPlayer={currentPlayer}
                    onSelectPlayer={setSelectedPlayer}
                    onSelectCard={setSelectedCard}
                    onSelectSet={setSelectedSet}
                    onAskCard={handleAskCard}
                    onClaimSet={handleClaimSet}
                    onPassTurn={handlePassTurn}
                    onLeaveRoom={handleLeaveRoom}
                    onCancelAction={handleCancelAction}
                />
            );
        }
        return (
            <PreGame
                roomId={roomId}
                userId={userId}
                roomState={roomState}
                connectionStatus={status}
                isHost={!!isHost}
                errorMessage={displayError}
                onChangeTeam={handleChangeTeam}
                onChangeHost={handleChangeHost}
                onStartGame={handleStartGame}
                onLeaveRoom={handleLeaveRoom}
                currentTeam={currentPlayer?.team}
            />
        );
    }

    return <div className='room'>
        {currentState()}
    </div>
};

export default Room;