import React from 'react';
import logo from './logo.svg';
import './App.css';
import Staff from './Staff';
import { BaseTone, Tone } from './Notes';

function TSXApp() {
    const tone1: Tone = {
        baseTone: BaseTone.A,
        octave: 0
    };
    const tone2: Tone = {
        baseTone: BaseTone.H,
        octave: 0
    };
    const tone3: Tone = {
        baseTone: BaseTone.D,
        octave: 0
    };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Staff tones={[tone1, tone3, tone2]}/>
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
