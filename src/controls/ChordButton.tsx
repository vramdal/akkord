import React from "react";
import {ChordSpec} from "./ControlPanel";

interface ChordButtonProps {
    chordSpec: ChordSpec;
    onClick: (chordSpec: ChordSpec) => void;
}

export const ChordButton = (props : ChordButtonProps) => {
    return <button onClick={() => props.onClick(props.chordSpec)}>{props.chordSpec.name}</button>
};