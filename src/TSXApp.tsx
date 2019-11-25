import React, {useState} from "react";
import logo from "./logo.svg";
import "./App.css";
import Staff from "./components/Staff";
import {createTone} from "./domain/Tone";
import {BaseTone, NoteValues, Position} from "./domain/Types";
import {majorThree} from "./domain/Functions";
import {ChordSpec, ControlPanel} from "./controls/ControlPanel";
import {Chord} from "./components/Chord";

function TSXApp() {
  // noinspection JSUnusedLocalSymbols
  const toneA1 = createTone({
    baseTone: BaseTone.A,
    octave: 1
  });
  // noinspection JSUnusedLocalSymbols
  const toneA0 = createTone( {
    baseTone: BaseTone.A,
    octave: 0
  });
  // noinspection JSUnusedLocalSymbols
  const toneH0 = createTone( {
    baseTone: BaseTone.H,
    octave: 0
  });
  // noinspection JSUnusedLocalSymbols
  const toneD0 = createTone({
    baseTone: BaseTone.D,
    octave: 0
  });
  // noinspection JSUnusedLocalSymbols
  const toneG0 = createTone({
    baseTone: BaseTone.G,
    octave: 0
  });
  // noinspection JSUnusedLocalSymbols
  const toneE0 = createTone({
    baseTone: BaseTone.E,
    octave: 0
  });
  // noinspection JSUnusedLocalSymbols
  const toneF0 = createTone({
    baseTone: BaseTone.F,
    octave: 0
  });
  const root = createTone({baseTone: BaseTone.D, octave: 0});
  const [chords, setChords] = useState(   [
      {tones: majorThree(root, Position.ROOT), noteValue: NoteValues.HALF, name: "D"} as ChordSpec
  ] as Array<ChordSpec>);

  return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ControlPanel setChords={setChords}/>
        <Staff preferredAccidentals={{[BaseTone.HFlat]: "flat"}}>
          {chords.map((chord, idx) => <Chord tones={chord.tones} noteValue={chord.noteValue} key={idx}/>)}
          {/*<Chord tones={majorThree(root, Position.ROOT)}/>*/}
          {/*<Chord tones={majorThree(root, Position.FIRST_INVERSION)}/>*/}
          {/*<Chord tones={majorThree(root, Position.SECOND_INVERSION)}/>*/}
          {/*<Chord tones={[{baseTone: BaseTone.HFlat, octave: 0}]}/>*/}
          {/*<Chord tones={[{baseTone: BaseTone.C, octave: 0}]}/>*/}
          {/*<Chord tones={[{baseTone: BaseTone.FSharp, octave: 0}, {baseTone: BaseTone.GSharp, octave: 0}, {baseTone: BaseTone.ASharp, octave: 0}]}/>*/}
        </Staff>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default TSXApp;
