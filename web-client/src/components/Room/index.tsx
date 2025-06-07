// src/components/Room/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import useWebSocket from '../../hooks/useWebSocket';
import type {
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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleMessage = useCallback((data: WebSocketMessage): void => {
        if (data.success) {
            setRoomState(data.currentState);
        }
        else {
            setErrorMessage(data.error);
        }
    }, []);

    const { status, error, sendMessage, closeConnection } = useWebSocket(
        roomId,
        { userToken, username },
        handleMessage
    );

    const displayError = error || errorMessage;

    const userId = roomState?.receiverId;
    const isHost = roomState?.hostId === userId;
    const gameStarted = roomState?.game?.state === 'in_progress';
    const gameEnded = roomState?.game?.state === 'ended';

    useEffect((): (() => void) => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(null), 5000);
            return () => clearTimeout(timer);
        }
        return () => { }; // Return empty function when no timer is set
    }, [errorMessage]);

    // Action handlers

    const handleStartGame = (): void => {
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
        const action: ChangeHostAction = {
            type: 'change_host',
            new_host_id: newHostId,
            room_id: roomId
        };
        sendMessage(action);
    };

    const handleChangeTeam = (newTeam: 1 | 2): void => {
        const action: ChangeTeamAction = {
            type: 'change_team',
            player_id: userId!,
            new_team: newTeam,
            room_id: roomId
        };
        sendMessage(action);
    };

    const handleGameAction = (moveData: AskCardMove | ClaimSetMove | PassTurnMove): void => {
        const action: MakeMoveAction = {
            type: 'make_move',
            room_id: roomId,
            move_data: moveData
        };
        sendMessage(action);
    }
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
        if (gameStarted) {
            return (
                <GameBoard
                    roomId={roomId}
                    userId={userId}
                    roomState={roomState}
                    errorMessage={displayError}
                    onLeaveRoom={handleLeaveRoom}
                    onGameAction={handleGameAction}
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
            />
        );
    }

    return <div className='room'>
        {currentState()}
    </div>
};

export default Room;