// src/components/Room/LastAction.tsx
import React from 'react';
import { type Ask, type Player } from '../../../types';
import Card from './Card';
import { getPlayerName } from '../../../utils/cardHelpers';

interface LastAskProps {
    lastAsk: Ask | null;
    players: Player[]
}

const LastAsk: React.FC<LastAskProps> = ({ players, lastAsk }) => {
    if (!lastAsk) return <div className="action">No cards have been asked yet.</div>;
    const askingPlayerName = getPlayerName(players, lastAsk.askingPlayerId);
    const askedPlayerName = getPlayerName(players, lastAsk.askedPlayerId);
    return <div className="action">
        <strong>{askingPlayerName}</strong> asked <strong>{askedPlayerName}</strong> for {Card({ card: lastAsk.card, isSelected: false, onSelect: () => { } })}
        {lastAsk.success ? ' and got it!' : ' but they didn\'t have it.'}
    </div>

};

export default LastAsk;