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

  const chordButtonRows = [
    {chordTonesFunc: majorThree, name: (baseName: string) => baseName},
    {chordTonesFunc: minorThree, name: (baseName: string) => baseName + "m"},
    {chordTonesFunc: dominantSevenFour, name: (baseName: string) => baseName + "7"}
  ];

  return <>
    {chordButtonRows.map(({chordTonesFunc, name}) =>
      <div className={'chord-button-row'} key={chordTonesFunc.name}>
        {Object.values(BaseTone).map((baseTone: BaseTone, idx: number) => {
          const root = {baseTone, octave: 0 as MIDIOctave};
          const chordTones = chordTonesFunc(root, Position.ROOT);
          const baseName = baseTone.replace("Sharp", "#").replace("Flat", "♭");
          return <ChordButton key={chordTones[0].baseTone} chordSpec={{
            tones: chordTones,
            noteValue: NoteValues.HALF,
            name: name(baseName),
            inversion: Position.ROOT,
            rootTones: chordTones
          }} onClick={addChord}/>
        })}
      </div>)}
  </>;
};
