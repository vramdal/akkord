import {addToTone, _testing} from "./Tone";
import {BaseTone} from "./Types";

const toneAsMIDINote = _testing.toneAsMIDINote;

describe('addToTone', function () {
    it('should add 2 notes to C', function () {
        expect(addToTone({octave: 0, baseTone: BaseTone.C}, 2)).toEqual({octave: 0, baseTone: BaseTone.E})
    });
    it('should add 1.5 notes to F', function () {
        expect(addToTone({octave: 0, baseTone: BaseTone.E}, 1.5)).toEqual({octave: 0, baseTone: BaseTone.G})
    });
    it('should add 1.5 notes to CSharp', function () {
        expect(addToTone({octave: 1, baseTone: BaseTone.CSharp}, 1.5)).toEqual({octave: 1, baseTone: BaseTone.E})
    });
});

describe('toneAsMIDINote', function () {
    it('should give 0 for C0', function () {
        expect(toneAsMIDINote({octave: 0, baseTone: BaseTone.C})).toEqual(0);
    });
    it('should give 5 for F0', function () {
        expect(toneAsMIDINote({octave: 0, baseTone: BaseTone.F})).toEqual(5);
    });
    it('should give 16 for C1', function () {
        expect(toneAsMIDINote({octave: 1, baseTone: BaseTone.C})).toEqual(12);
    });
});