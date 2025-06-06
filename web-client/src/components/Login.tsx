// src/components/Login.tsx
import React, { useState } from 'react';
import { generateRandomUserId } from '../services/api';
import ErrorMessage from './ErrorMessage';

type LoginProps = {
    onLogin: (username: string, userId: number) => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleLogin = () => {
        if (!username.trim()) {
            setError('Username cannot be empty');
            return;
        }

        const newId = generateRandomUserId();
        onLogin(username, newId);
    };

    return (
        <div>
            <ErrorMessage message={error} />
            <label>
                Username:{' '}
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </label>
            <button style={{ marginLeft: 8 }} onClick={handleLogin}>
                Log In
            </button>
        </div>
    );
};

export default Login;