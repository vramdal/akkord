import React, { useLayoutEffect, useState } from "react";
import logo from "./musical-notes.svg";
import "./App.css";
import Staff from "./components/Staff";
import { BaseTone, Position } from "./domain/Types";
import { inverseChord } from "./domain/Functions";
import { ChordSpecWithInversion, ControlPanel, NamedChordSpec } from "./controls/ControlPanel";
import { calculateTopAndBottomStaffLine, Chord } from "./components/Chord";

function TSXApp() {
  const [chords, setChords] = useState<Array<NamedChordSpec & ChordSpecWithInversion>>([] as Array<NamedChordSpec & ChordSpecWithInversion>);

  const [scrollTargetGroup, setScrollTargetGroupGroup] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (scrollTargetGroup) {
      const scrollTargetDomElements = document.querySelectorAll(`*[data-scrolltargetgroup = '${scrollTargetGroup}']`);
      const scrollTargetDomElement = scrollTargetDomElements[scrollTargetDomElements.length - 1];
      if (scrollTargetDomElement) {
        scrollTargetDomElement.scrollIntoView();
      }
    }
  }, [scrollTargetGroup])

  const addChord = (chord: NamedChordSpec & ChordSpecWithInversion) => {
    setChords([...chords, chord]);
    setScrollTargetGroupGroup("chord-" + (chords.length - 1))
  }

  const updateChord = (idx: number, chord: NamedChordSpec & ChordSpecWithInversion) => {
    const updatedChords = [...chords];
    updatedChords[idx] = chord;
    setChords(updatedChords);
  }

  const rotateChordInversion = (idx: number, delta: number) => {
    const chord = chords[idx];
    const positions = [Position.ROOT, Position.FIRST_INVERSION, Position.SECOND_INVERSION];
    let inversedPositionIdx = (chord.inversion + delta) % positions.length;
    const inversedChord = inverseChord(chord, positions[inversedPositionIdx]);
    updateChord(idx, inversedChord);
  }

  const [topStaffLine, bottomStaffLine] = calculateTopAndBottomStaffLine(chords);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <ControlPanel setChords={setChords} addChord={addChord}/>
        <Staff preferredAccidentals={{[BaseTone.HFlat]: "flat"}} topStaffLine={topStaffLine} bottomStaffLine={bottomStaffLine}>
          {chords.map((chord, idx) => <Chord tones={chord.tones} noteValue={chord.noteValue}
                                             key={idx}
                                             onClick={() => rotateChordInversion(idx, +1)}
                                             scrollTargetGroup={"chord-" + idx}
          />)}
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
