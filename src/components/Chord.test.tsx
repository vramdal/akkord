import React from "react";
import "@testing-library/jest-dom/extend-expect";
import Staff from "./Staff";
// @ts-ignore
import TestRenderer from "react-test-renderer";
import { Chord } from "./Chord";
import { ToneInfo } from "./subcomponents/Types";
import { BaseTone, Position } from "../domain/Types";
import { inverseChord } from "../domain/Functions";

const toneA0 : ToneInfo = {
    baseTone: BaseTone.ASharp,
    octave: 0,
    midiNote: 13,
    strKey: "ASharp0",
    staffPosition: 6,
    accidental: "sharp",
};

describe('Chord', () => {

    const NOOP = () => {};

    it('should render a note with accidental', function () {
        const result = TestRenderer.create(<Staff>
            <Chord tones={[toneA0]} inverseChord={NOOP}/>
        </Staff>);

        expect(result.toJSON()).toMatchSnapshot();
    });

    it('should render a note and override its accidental', function () {
        const result = TestRenderer.create(<Staff preferredAccidentals={{[BaseTone.ASharp]: "flat"}}>
            <Chord tones={[toneA0]} inverseChord={NOOP}/>
        </Staff>);

        expect(result.toJSON()).toMatchSnapshot();
    });
});
