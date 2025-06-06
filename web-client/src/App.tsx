// src/App.tsx
import { useState } from 'react';
import Login from './components/Login';
import Lobby from './components/Lobby';
import Room from './components/Room';
import './App.css';
function App() {
  const [username, setUsername] = useState<string>('');
  const [userToken, setUserToken] = useState<number | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

  const handleLogin = (username: string, userToken: number) => {
    setUsername(username);
    setUserToken(userToken);
  };

  const handleRoomJoin = (roomId: string) => {
    setCurrentRoomId(roomId);
  };

  const handleLeaveRoom = () => {
    setCurrentRoomId(null);
  };

  return (
    <div className="app-container">
      {!userToken || !username ? (
        <Login onLogin={handleLogin} />
      ) : currentRoomId ? (
        <Room
          roomId={currentRoomId}
          userToken={userToken}
          username={username}
          onLeaveRoom={handleLeaveRoom}
        />
      ) : (
        <Lobby
          username={username}
          onRoomJoin={handleRoomJoin}
        />
      )}
    </div>
  );
}

export default App;