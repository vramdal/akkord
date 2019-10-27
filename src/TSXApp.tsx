import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Staff, {Chord, MajorThree, MinorThree} from "./Staff";
import {BaseTone, createTone, NoteValues} from "./Notes";

function TSXApp() {
  const toneA1 = createTone({
    baseTone: BaseTone.A,
    octave: 1
  });
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
  return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Staff>
          <Chord tones={[{baseTone: BaseTone.C, octave: 0}]}/>
          <MajorThree startTone={createTone({baseTone: BaseTone.C, octave: 0})} noteValue={NoteValues.HALF} />
          <MinorThree startTone={createTone({baseTone: BaseTone.C, octave: 0})} noteValue={NoteValues.HALF} />
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
