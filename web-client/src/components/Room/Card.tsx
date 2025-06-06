// src/components/Room/Card.tsx
import React from 'react';
import { type Card as CardType } from '../../types';

interface CardProps {
    card: CardType;
    isSelected: boolean;
    disabled?: boolean;
    onSelect: (card: CardType) => void;
}

const Card = ({ card, isSelected, disabled, onSelect }: CardProps): React.JSX.Element => {
    const rank = card[0];
    const suit = card[1];
    const setNumber = parseInt(card[2], 10);

    let suitSymbol = "";
    let color = "";

    switch (suit) {
        case "C":
            suitSymbol = "♣";
            color = "black";
            break;
        case "D":
            suitSymbol = "♦";
            color = "red";
            break;
        case "H":
            suitSymbol = "♥";
            color = "red";
            break;
        case "S":
            suitSymbol = "♠";
            color = "black";
            break;
        case "R":
            return <span className="card joker red">JOKER</span>;
        case "B":
            return <span className="card joker black">JOKER</span>;
    }

    let displayRank = rank;
    if (rank === "1") displayRank = "10";

    return (
        <div
            className={`card ${color} ${isSelected ? "selected" : ""} ${disabled ? "disabled" : ""}`}
            onClick={() => !disabled && onSelect(card)}
        >
            <span className="rank">{displayRank}</span>
            <span className="suit">{suitSymbol}</span>
            <span className="set">Set {setNumber}</span>
        </div>
    );
};

export default Card;