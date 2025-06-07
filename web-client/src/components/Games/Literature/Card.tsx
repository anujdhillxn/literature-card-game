// src/components/Room/Card.tsx
import React from 'react';
import { type Card as CardType } from '../../../types';

interface CardProps {
    card: CardType;
    isSelected?: boolean;
    disabled?: boolean;
    displayOnly?: boolean;
    onSelect?: (card: CardType) => void;
}

const Card = ({
    card,
    isSelected = false,
    disabled = false,
    displayOnly = false,
    onSelect
}: CardProps): React.JSX.Element => {
    const rank = card[0];
    const suit = card[1];

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

    const handleClick = () => {
        if (!disabled && !displayOnly && onSelect) {
            onSelect(card);
        }
    };

    return (
        <div
            className={`card ${color} ${isSelected ? "selected" : ""} ${disabled ? "disabled" : ""} ${displayOnly ? "display-only" : ""}`}
            onClick={handleClick}
        >
            <span className="rank">{displayRank}</span>
            <span className="suit">{suitSymbol}</span>
        </div>
    );
};

export default Card;