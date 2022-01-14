import React from "react";
import { BaseTone, MIDIOctave, NoteValue, NoteValues, Position, Tone } from "../domain/Types";
import { majorThree, minorThree } from "../domain/Functions";
import { ChordButton } from "./ChordButton";

interface ControlPanelProps {
  setChords: (chords: Array<NamedChordSpec & ChordSpecWithInversion>) => void,
  addChord: (chord: NamedChordSpec & ChordSpecWithInversion) => void
}

export interface NamedChordSpec extends ChordSpec {
  name: String;
}

export interface ChordSpec {
  tones: Array<Tone>;
  noteValue: NoteValue;
}

export interface ChordSpecWithInversion extends ChordSpec {
  inversion: Position;
  rootTones: Array<Tone>
}

export const ControlPanel = (props: ControlPanelProps) => {
  return <div>
    {Object.values(BaseTone).map((baseTone: BaseTone, idx: number) => {
      const root = {baseTone, octave: 0 as MIDIOctave};
      const major = majorThree(root, Position.ROOT);
      const minor = minorThree(root, Position.ROOT);
      /*
                  const setChord = (chordSpec: NamedChordSpec & ChordSpecWithInversion) => props.setChords([
                      chordSpec
                  ]);
      */
      const addChord = (chordSpec: NamedChordSpec & ChordSpecWithInversion) => {
        props.addChord(chordSpec);
      };
      const baseName = baseTone.replace("Sharp", "#").replace("Flat", "♭");
      return <React.Fragment key={idx}>
        <ChordButton chordSpec={{
          tones: major,
          noteValue: NoteValues.HALF,
          name: baseName,
          inversion: Position.ROOT,
          rootTones: major
        }} onClick={addChord}/>
        <ChordButton chordSpec={{
          tones: minor,
          noteValue: NoteValues.HALF,
          name: baseName + "m",
          inversion: Position.ROOT,
          rootTones: minor
        }} onClick={addChord}/>
      </React.Fragment>
    })}
  </div>;
};
