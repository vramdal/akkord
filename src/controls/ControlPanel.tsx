import React from "react";
import {BaseTone, MIDIOctave, NoteValue, NoteValues, Position, Tone} from "../domain/Types";
import {inverseThree, majorThree, minorThree} from "../domain/Functions";
import {ChordButton} from "./ChordButton";

interface ControlPanelProps {
    setChords: (chords: Array<ChordSpec>) => void
}

export interface ChordSpec {
    tones: Array<Tone>;
    noteValue: NoteValue;
    name: String;
}

export const ControlPanel = (props: ControlPanelProps) =>
{
    return <div>
        {Object.values(BaseTone).map((baseTone : BaseTone, idx: number) => {
            const root = {baseTone, octave: 0 as MIDIOctave};
            const major = majorThree(root, Position.ROOT);
            const minor = minorThree(root, Position.ROOT);
            const setChord = (chordSpec: ChordSpec) => props.setChords([
                chordSpec,
                {...chordSpec, tones: inverseThree(chordSpec.tones, Position.FIRST_INVERSION)},
                {...chordSpec, tones: inverseThree(chordSpec.tones, Position.SECOND_INVERSION)}

            ]);
            const baseName = baseTone.replace("Sharp", "#").replace("Flat", "♭");
            return <React.Fragment key={idx}>
                <ChordButton chordSpec={{tones: major, noteValue: NoteValues.HALF, name: baseName}} onClick={setChord}/>
                <ChordButton chordSpec={{tones: minor, noteValue: NoteValues.HALF, name: baseName + "m"}} onClick={setChord}/>
            </React.Fragment>
        })}
    </div>;
};