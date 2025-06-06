// src/App.tsx
import { useState } from 'react';
import Login from './components/Login';
import Lobby from './components/Lobby';
import Room from './components/Room';

function App() {
  const [username, setUsername] = useState<string>('');
  const [userId, setUserId] = useState<number | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

  const handleLogin = (username: string, userId: number) => {
    setUsername(username);
    setUserId(userId);
  };

  const handleRoomJoin = (roomId: string) => {
    setCurrentRoomId(roomId);
  };

  const handleLeaveRoom = () => {
    setCurrentRoomId(null);
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '1rem' }}>
      <h1>Literature Lobby</h1>

      {!userId ? (
        <Login onLogin={handleLogin} />
      ) : currentRoomId ? (
        <Room
          roomId={currentRoomId}
          userId={userId}
          username={username}
          onLeaveRoom={handleLeaveRoom}
        />
      ) : (
        <Lobby
          username={username}
          userId={userId}
          onRoomJoin={handleRoomJoin}
        />
      )}
    </div>
  );
}

export default App;