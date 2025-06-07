// src/components/Lobby.tsx
import React, { useState } from 'react';
import { createRoom } from '../services/api';
import ErrorMessage from './ErrorMessage';

type LobbyProps = {
    username: string;
    onRoomJoin: (roomId: string) => void;
};

const Lobby: React.FC<LobbyProps> = ({ username, onRoomJoin }) => {
    const [roomToJoin, setRoomToJoin] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleCreateRoom = async () => {
        try {
            const roomId = await createRoom();
            onRoomJoin(roomId);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleJoinRoom = () => {
        if (!roomToJoin.trim()) {
            setError('Room ID cannot be empty');
            return;
        }
        onRoomJoin(roomToJoin.trim());
    };

    return (
        <div style={{ marginTop: 20 }}>
            <ErrorMessage message={error} />
            <p>
                Logged in as: <b>{username}</b>
            </p>
            <button onClick={handleCreateRoom}>Create Room</button>

            <div style={{ marginTop: 20 }}>
                <label>
                    Join Room ID:{' '}
                    <input
                        type="text"
                        value={roomToJoin}
                        onChange={(e) => setRoomToJoin(e.target.value)}
                        placeholder="e.g. ABCD12"
                    />
                </label>
                <button style={{ marginLeft: 8 }} onClick={handleJoinRoom}>
                    Join Room
                </button>
            </div>
        </div>
    );
};

export default Lobby;