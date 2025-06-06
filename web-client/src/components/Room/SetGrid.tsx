// src/components/Room/SetGrid.tsx
import React from 'react';
import { SET_NAMES } from '../../utils/cardHelpers';

interface SetGridProps {
    claimedSets: Record<number, 1 | 2>;
    canClaimSets: boolean;
    selectedSet: number | null;
    onSelectSet: (setId: number) => void;
    onClaimSet?: () => void;
}

const SetGrid: React.FC<SetGridProps> = ({
    claimedSets,
    canClaimSets,
    selectedSet,
    onSelectSet,
    onClaimSet
}) => {
    return (
        <div className="claimed-sets">
            <h3>Sets</h3>
            <div className="sets-grid">
                {SET_NAMES.map((name, index) => {
                    const setNumber = index + 1;
                    const team = claimedSets[setNumber];
                    const isSelected = selectedSet === setNumber;
                    const canSelect = !team && canClaimSets;

                    return (
                        <div
                            key={setNumber}
                            className={`set ${team ? `team${team}` : ''} ${isSelected ? 'selected' : ''}`}
                            onClick={() => canSelect ? onSelectSet(setNumber) : null}
                        >
                            <div className="set-number">Set {setNumber}</div>
                            <div className="set-name">{name}</div>
                            {team && <div className="claimed-by">Team {team}</div>}
                        </div>
                    );
                })}
            </div>

            {canClaimSets && selectedSet && (
                <button
                    className="claim-btn"
                    onClick={onClaimSet}
                >
                    Claim Set {selectedSet}
                </button>
            )}
        </div>
    );
};

export default SetGrid;