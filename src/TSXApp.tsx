import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Staff from "./components/Staff";
import {createTone} from "./domain/Tone";
import {BaseTone, NoteValues, Position} from "./domain/Types";
import {majorThree} from "./domain/Functions";
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
  return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Staff preferredAccidentals={{[BaseTone.HFlat]: "flat"}}>
          <Chord tones={majorThree(root, NoteValues.HALF, Position.ROOT)}/>
          <Chord tones={majorThree(root, NoteValues.HALF, Position.FIRST_INVERSION)}/>
          <Chord tones={majorThree(root, NoteValues.HALF, Position.SECOND_INVERSION)}/>
          <Chord tones={[{baseTone: BaseTone.HFlat, octave: 0}]}/>
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
