import React from "react";
import { ChordSpec, ChordSpecWithInversion, NamedChordSpec } from "./ControlPanel";

interface ChordButtonProps {
    chordSpec: NamedChordSpec & ChordSpecWithInversion;
    onClick: (chordSpec: NamedChordSpec & ChordSpecWithInversion) => void;
}

export const ChordButton = (props : ChordButtonProps) => {
    return <button onClick={() => props.onClick(props.chordSpec)}>{props.chordSpec.name}</button>
};
