import React from "react";
import { BaseTone, MIDIOctave, NoteValue, NoteValues, Position, Tone } from "../domain/Types";
import { dominantSevenFour, majorThree, minorThree } from "../domain/Functions";
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
  const addChord = (chordSpec: NamedChordSpec & ChordSpecWithInversion) => {
    props.addChord(chordSpec);
  };

  return <>
    <div className={'chord-button-row'}>
      {Object.values(BaseTone).map((baseTone: BaseTone, idx: number) => {
        const root = {baseTone, octave: 0 as MIDIOctave};
        const major = majorThree(root, Position.ROOT);
        const baseName = baseTone.replace("Sharp", "#").replace("Flat", "♭");
        return <React.Fragment key={idx}>
          <ChordButton chordSpec={{
            tones: major,
            noteValue: NoteValues.HALF,
            name: baseName,
            inversion: Position.ROOT,
            rootTones: major
          }} onClick={addChord}/>
        </React.Fragment>
      })}
    </div>
    <div className={'chord-button-row'}>
      {Object.values(BaseTone).map((baseTone: BaseTone, idx: number) => {
        const root = {baseTone, octave: 0 as MIDIOctave};
        const minor = minorThree(root, Position.ROOT);
        const baseName = baseTone.replace("Sharp", "#").replace("Flat", "♭");
        return <ChordButton key={idx} chordSpec={{
          tones: minor,
          noteValue: NoteValues.HALF,
          name: baseName + "m",
          inversion: Position.ROOT,
          rootTones: minor
        }} onClick={addChord}/>
      })}
    </div>
    <div className={'chord-button-row'}>
      {Object.values(BaseTone).map((baseTone: BaseTone, idx: number) => {
        const root = {baseTone, octave: 0 as MIDIOctave};
        const maj7 = dominantSevenFour(root, Position.ROOT);
        const baseName = baseTone.replace("Sharp", "#").replace("Flat", "♭");
        return <ChordButton key={idx} chordSpec={{
          tones: maj7,
          noteValue: NoteValues.HALF,
          name: baseName + "7",
          inversion: Position.ROOT,
          rootTones: maj7
        }} onClick={addChord}/>
      })}

    </div>
  </>;
};
