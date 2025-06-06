// src/hooks/useWebSocket.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import type { WebSocketMessage, GameAction } from '../types';

type WebSocketStatus = 'connecting' | 'open' | 'closed' | 'error';

interface UseWebSocketResult {
    status: WebSocketStatus;
    error: string | null;
    sendMessage: (data: GameAction) => void;
    closeConnection: () => void;
}

/**
 * WebSocket hook for connecting to a game room
 * 
 * @param roomId - The room ID to connect to
 * @param userInfo - User information containing userId and username
 * @param onMessage - Callback for handling messages
 * @returns Object with connection status, error state, and methods to send/close
 */
const useWebSocket = (
    roomId: string | null,
    userInfo: { userId: number | null; username?: string },
    onMessage?: (data: WebSocketMessage) => void
): UseWebSocketResult => {
    const [status, setStatus] = useState<WebSocketStatus>('closed');
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const { userId, username } = userInfo;
    // Connect to WebSocket
    useEffect(() => {
        console.log(`useWebSocket: roomId=${roomId}, userId=${userId}, username=${username}`);
        if (!roomId || userId === null || !username) return;
        // Close any existing connection
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        const url = `ws://localhost:8000/ws/room/${roomId}/${userId}/${encodeURIComponent(username)}/`;
        setStatus('connecting');
        console.log(`Opening WebSocket connection to room ${roomId} as user ${userId}`);

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log(`Connected to room ${roomId}`);
            setStatus('open');
            setError(null);
        };

        ws.onmessage = (event) => {
            let parsedData: any;

            try {
                parsedData = JSON.parse(event.data);
            } catch (err) {
                parsedData = event.data;
            }

            if (onMessage) onMessage(parsedData);
        };

        ws.onerror = (event) => {
            console.error('WebSocket error:', event);
            setStatus('error');
            setError('WebSocket encountered an error');
        };

        ws.onclose = (event) => {
            console.log(`WebSocket for room ${roomId} closed:`, event);
            setStatus('closed');
            if (!event.wasClean) {
                setError('Connection closed unexpectedly');
            }
        };

        // Cleanup on unmount or room/user change
        return () => {
            console.log(`Cleaning up WebSocket for room ${roomId}`);
            ws.close();
            wsRef.current = null;
        };
    }, [roomId, userId, username, onMessage]);

    // Send message method
    const sendMessage = useCallback((data: GameAction) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            setError('WebSocket is not connected');
            return;
        }

        const message = typeof data === 'string' ? data : JSON.stringify(data);
        wsRef.current.send(message);
    }, []);

    // Close connection method
    const closeConnection = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
            setStatus('closed');
        }
    }, []);

    return { status, error, sendMessage, closeConnection };
};

export default useWebSocket;