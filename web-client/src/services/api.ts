// src/services/api.ts
const API_BASE_URL = "http://localhost:8000/api";

export const createRoom = async (): Promise<string> => {
    const response = await fetch(`${API_BASE_URL}/games/create-room`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create room");
    }

    const data = await response.json();
    return data.room_id;
};

export const generateRandomUserId = (): number => {
    return Math.floor(Math.random() * 1_000_000_000);
};
