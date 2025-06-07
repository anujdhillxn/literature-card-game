import { type JSX } from 'react';
import PreGame from './PreGame';
import PostGame from './PostGame';
import InGame from './InGame';
import type { GameProps } from '..';

const Game = (props: GameProps): JSX.Element => {
    const userId = props.roomState.receiverId;
    const gameStarted = props.roomState.game.state === 'in_progress';
    const gameEnded = props.roomState.game.state === 'ended';
    if (!userId) {
        return <div className="error">Error: User ID not found in room state.</div>;
    }
    if (gameEnded) {
        return (
            <PostGame
                roomState={props.roomState}
                onLeaveRoom={props.roomActions.onLeaveRoom}
            />
        );
    }
    if (gameStarted) {
        return (
            <InGame
                roomState={props.roomState}
                onLeaveRoom={props.roomActions.onLeaveRoom}
                onGameAction={props.roomActions.onInGameAction}
            />
        );
    }
    return (
        <PreGame
            roomState={props.roomState}
            onGameAction={props.roomActions.onPreGameAction}
            onChangeHost={props.roomActions.onChangeHost}
            onStartGame={props.roomActions.onStartGame}
        />
    );

}
export default Game;