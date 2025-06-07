import { type JSX } from 'react';
import LiteratureGame from './Literature';
import type { RoomActions, RoomState } from '../../types';

export interface GameProps {
    roomState: RoomState;
    roomActions: RoomActions;
}
const Game = (props: GameProps): JSX.Element => {
    const gameType = props.roomState.type;
    switch (gameType) {
        case 'literature':
            return (
                <LiteratureGame
                    roomState={props.roomState}
                    roomActions={props.roomActions}
                />
            );
        default:
            return <div className="error">Unsupported game type: {gameType}</div>;
    }
}

export default Game;