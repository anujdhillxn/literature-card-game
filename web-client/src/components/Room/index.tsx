// src/components/Room/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import useWebSocket from '../../hooks/useWebSocket';
import type {
    RoomState,
    WebSocketMessage,
    RoomActions,
    StartGameActionPayload,
    RemovePlayerActionPayload,
    ChangeHostActionPayload,
    InGameAction,
    InGameActionPayload,
    PreGameAction,
    PreGameActionPayload,
} from '../../types';
import ErrorMessage from '../ErrorMessage';
import './Room.css';
import Game from '../Games';
interface RoomProps {
    roomId: string;
    userToken: number;
    username: string;
    onLeaveRoom: () => void;
}

const Room: React.FC<RoomProps> = ({ roomId, userToken, username, onLeaveRoom }) => {
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

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    const handleStartGame = (): void => {
        const payload: StartGameActionPayload = {
            type: 'start_game',
        };
        sendMessage(payload);
    };

    const handleLeaveRoom = (): void => {
        const payload: RemovePlayerActionPayload = {
            type: 'remove_player',
            player_id: userId!,
        };
        sendMessage(payload);

        closeConnection();
        onLeaveRoom();
    };

    const handleChangeHost = (newHostId: string): void => {
        const payload: ChangeHostActionPayload = {
            type: 'change_host',
            new_host_id: newHostId,
        };
        sendMessage(payload);
    };

    const handleInGameAction = (action: InGameAction): void => {
        const payload: InGameActionPayload = {
            type: 'in_game_action',
            in_game_action: action
        };
        sendMessage(payload);
    }

    const handlePreGameAction = (action: PreGameAction): void => {
        const payload: PreGameActionPayload = {
            type: 'pre_game_action',
            pre_game_action: action
        }
        sendMessage(payload);
    }

    const roomActions: RoomActions = {
        onStartGame: handleStartGame,
        onLeaveRoom: handleLeaveRoom,
        onChangeHost: handleChangeHost,
        onInGameAction: handleInGameAction,
        onPreGameAction: handlePreGameAction
    };

    if (status === 'connecting' || !roomState) {
        return <><div className="loading">Connecting to room {roomId}...</div>        <div><button onClick={onLeaveRoom} className="leave-btn">Leave Room</button></div></>;
    }
    return <div className='room'>
        {errorMessage && <ErrorMessage message={displayError} />}
        <h2>Room: {roomId}</h2>
        <div><button onClick={onLeaveRoom} className="leave-btn">Leave Room</button></div>
        <Game roomActions={roomActions} roomState={roomState} />
    </div>
};

export default Room;