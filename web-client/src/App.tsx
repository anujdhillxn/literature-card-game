// src/App.tsx
import { useEffect, useState } from 'react';
import Login from './components/Login';
import Lobby from './components/Lobby';
import Room from './components/Room';
import './App.css';
function App() {
  const [username, setUsername] = useState<string>('');
  const [userToken, setUserToken] = useState<number | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    const token = urlParams.get('token');
    const name = urlParams.get('username');
    if (roomId) {
      setCurrentRoomId(roomId);
    }
    if (token) {
      const parsedToken = parseInt(token, 10);
      if (!isNaN(parsedToken)) {
        setUserToken(parsedToken);
      }
    }
    if (name) {
      setUsername(name);
    }
  }, []);

  const handleLogin = (username: string, userToken: number) => {
    setUsername(username);
    setUserToken(userToken);
    const url = new URL(window.location.href);
    url.searchParams.set('token', userToken?.toString() || '');
    url.searchParams.set('username', username);
    window.history.pushState({}, '', url);

  };

  const handleRoomJoin = (roomId: string) => {
    // Update URL with room ID and token
    const url = new URL(window.location.href);
    url.searchParams.set('room', roomId);
    window.history.pushState({}, '', url);

    setCurrentRoomId(roomId);
  };

  const handleLeaveRoom = () => {
    // Remove params from URL when leaving room
    const url = new URL(window.location.href);
    url.searchParams.delete('room');
    window.history.pushState({}, '', url);

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