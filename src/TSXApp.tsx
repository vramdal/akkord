import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Staff, {Chord} from "./Staff";
import {BaseTone, NoteValues, Tone} from "./Notes";

function TSXApp() {
  const toneA1: Tone = {
    baseTone: BaseTone.A,
    octave: 1
  };
  const toneA0: Tone = {
    baseTone: BaseTone.A,
    octave: 0
  };
  // noinspection JSUnusedLocalSymbols
    const toneH0: Tone = {
    baseTone: BaseTone.H,
    octave: 0
  };
    // noinspection JSUnusedLocalSymbols
  const toneD0: Tone = {
    baseTone: BaseTone.D,
    octave: 0
  };
    // noinspection JSUnusedLocalSymbols
  const toneG0: Tone = {
    baseTone: BaseTone.G,
    octave: 0
  };
    // noinspection JSUnusedLocalSymbols
  const toneE0: Tone = {
    baseTone: BaseTone.E,
    octave: 0
  };
    // noinspection JSUnusedLocalSymbols
  const toneF0: Tone = {
    baseTone: BaseTone.F,
    octave: 0
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Staff>
          <Chord tones={[toneA1, toneA0]} noteValue={NoteValues.HALF} />
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
