import React from "react";
import { ChordSpecWithInversion, NamedChordSpec } from "./ControlPanel";

interface ChordButtonProps {
    chordSpec: NamedChordSpec & ChordSpecWithInversion;
    onClick: (chordSpec: NamedChordSpec & ChordSpecWithInversion) => void;
}

export const ChordButton = (props : ChordButtonProps) => {
    return <button className={'chord-button'} onClick={() => props.onClick(props.chordSpec)}>{props.chordSpec.name}</button>
};
