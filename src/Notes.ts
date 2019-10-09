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

export type MIDIOctave = -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 6; // https://en.wikipedia.org/wiki/Octave#Notation

export interface Tone {
  baseTone: BaseTone;
  octave: MIDIOctave;
}

export {};
