// src/components/Room/LastAction.tsx
import React from 'react';
import { type Ask } from '../../types';
import Card from './Card';

interface LastActionProps {
    lastAsk: Ask | null;
}

const LastAction: React.FC<LastActionProps> = ({ lastAsk }) => {
    if (!lastAsk) return <div className="action">No cards have been asked yet.</div>;

    return <div className="action">
        <strong>{lastAsk.askingPlayerId}</strong> asked <strong>{lastAsk.askedPlayerId}</strong> for {Card({ card: lastAsk.card, isSelected: false, onSelect: () => { } })}
        {lastAsk.success ? ' and got it!' : ' but they didn\'t have it.'}
    </div>

};

export default LastAction;