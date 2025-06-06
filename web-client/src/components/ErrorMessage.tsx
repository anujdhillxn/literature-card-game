// src/components/ErrorMessage.tsx
import React from 'react';

type ErrorMessageProps = {
    message: string | null;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    if (!message) return null;

    return (
        <div style={{ color: 'red', marginBottom: '1rem' }}>{message}</div>
    );
};

export default ErrorMessage;