import React from 'react';
import type { RoomState } from '../../types';

interface LiteratureGameProps {
    roomState: RoomState;
}

const LiteratureGame = (LiteratureGameProps: props): JSX.Element => {

    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
    const [selectedCard, setSelectedCard] = useState<Card | null>(null);
    const [selectedSet, setSelectedSet] = useState<number | null>(null);
    const handleAskCard = (): void => {
        if (!selectedPlayer || !selectedCard) return;

        const moveData: AskCardMove = {
            move_type: 'ask_card',
            asked_player_id: selectedPlayer,
            card: selectedCard
        };
        handleGameAction(moveData);
        setSelectedPlayer(null);
        setSelectedCard(null);
    };

    const handleClaimSet = (): void => {
        if (!selectedSet) return;

        const moveData: ClaimSetMove = {
            move_type: 'claim_set',
            set_number: selectedSet
        };
        handleGameAction(moveData);
        setSelectedSet(null);
    };

    const handlePassTurn = (teammateId: string): void => {
        const moveData: PassTurnMove = {
            move_type: 'pass_turn',
            teammate_id: teammateId
        };
        handleGameAction(moveData);
    }

    const handleCancelAction = (): void => {
        setSelectedPlayer(null);
        setSelectedCard(null);
        setSelectedSet(null);
    };

}