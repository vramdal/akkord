export enum BaseTone {
    C = "C",
    CSharp = "CSharp",
    D = "D",
    DSharp = "DSharp",
    E = "E",
    F = "F",
    FSharp = "FSharp",
    G = "G",
    GSharp = "GSharp",
    A = "A",
    ASharp = "ASharp",
    H = "H",
    DFlat = CSharp,
    EFlat = DSharp,
    GFlat = FSharp,
    AFlat = GSharp,
    HFlat = ASharp
}

export type Accidental = 'sharp' | 'flat' | null

export enum NoteValues {
    OCTUPLE = 8,
    LONGA = 4,
    BREVE = 2,
    WHOLE = 1,
    HALF = 1 / 2,
    QUARTER = 1 / 4,
    EIGHTH = 1 / 8,
    SIXTEENTH = 1 / 16,
    THIRTYSECOND = 1 / 32,
    SIXTYFOURTH = 1 / 64,
    HUNDREDTWENTYEIGHTH = 1 / 128,
    TWOHUNDREDFIFTYSIXTH = 1 / 256
}

export type MIDIOctave = -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Tone {
    baseTone: BaseTone;
    octave: MIDIOctave;
}// https://en.wikipedia.org/wiki/Octave#Notation

export type MIDINote = number;

export type NoteValue = number;

export enum Position {
    ROOT = 0,
    FIRST_INVERSION = 1,
    SECOND_INVERSION = 2
}
