// src/components/Room/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import useWebSocket from '../../hooks/useWebSocket';
import type {
    RoomState,
    WebSocketMessage,
    AskCardMove,
    ClaimSetMove,
    PassTurnMove,
    RoomActions,
    ChangeTeamActionPayload,
    StartGameActionPayload,
    RemovePlayerActionPayload,
    ChangeHostActionPayload,
    MakeMoveActionPayload
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
        const action: StartGameActionPayload = {
            type: 'start_game',
            room_id: roomId
        };
        sendMessage(action);
    };

    const handleLeaveRoom = (): void => {
        const action: RemovePlayerActionPayload = {
            type: 'remove_player',
            player_id: userId!,
            room_id: roomId
        };
        sendMessage(action);

        closeConnection();
        onLeaveRoom();
    };

    const handleChangeHost = (newHostId: string): void => {
        const action: ChangeHostActionPayload = {
            type: 'change_host',
            new_host_id: newHostId,
            room_id: roomId
        };
        sendMessage(action);
    };

    const handleChangeTeam = (newTeam: 1 | 2): void => {
        const action: ChangeTeamActionPayload = {
            type: 'change_team',
            player_id: userId!,
            new_team: newTeam,
            room_id: roomId
        };
        sendMessage(action);
    };

    const handleGameAction = (moveData: AskCardMove | ClaimSetMove | PassTurnMove): void => {
        const action: MakeMoveActionPayload = {
            type: 'make_move',
            room_id: roomId,
            move_data: moveData
        };
        sendMessage(action);
    }

    const roomActions: RoomActions = {
        onStartGame: handleStartGame,
        onLeaveRoom: handleLeaveRoom,
        onChangeHost: handleChangeHost,
        onChangeTeam: handleChangeTeam,
        onGameAction: handleGameAction
    };

    if (status === 'connecting' || !roomState) {
        return <><div className="loading">Connecting to room {roomId}...</div>        <div><button onClick={onLeaveRoom} className="leave-btn">Leave Room</button></div></>;
    }

    return <div className='room'>
        {errorMessage && <ErrorMessage message={errorMessage} />}
        <h2>Room: {roomId}</h2>
        <div><button onClick={onLeaveRoom} className="leave-btn">Leave Room</button></div>
        <Game connectionStatus={status} roomActions={roomActions} roomState={roomState} errorMessage={displayError} />
    </div>
};

export default Room;