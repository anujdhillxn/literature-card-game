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
    // Get room from URL (safe to keep in URL)
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    if (roomId) {
      setCurrentRoomId(roomId);
    }

    // Get user data from localStorage (more private)
    const savedUsername = localStorage.getItem('username');
    const savedToken = localStorage.getItem('authUserToken') || localStorage.getItem('anonUserToken');

    if (savedUsername) {
      setUsername(savedUsername);
    }

    if (savedToken) {
      const parsedToken = parseInt(savedToken, 10);
      if (!isNaN(parsedToken)) {
        setUserToken(parsedToken);
      }
    }
  }, []);

  const handleLogin = (username: string, userToken: number) => {
    // Save to state
    setUsername(username);
    setUserToken(userToken);

    // Save to localStorage
    // localStorage.setItem('username', username);
    // localStorage.setItem('anonUserToken', userToken.toString());
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