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

const BaseTonesInOrder = [BaseTone.C, BaseTone.CSharp, BaseTone.D, BaseTone.DSharp, BaseTone.E, BaseTone.F, BaseTone.FSharp, BaseTone.G, BaseTone.GSharp, BaseTone.A, BaseTone.ASharp, BaseTone.H];

export type Accidental = 'sharp' | 'flat' | null

export type MIDIOctave = -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6; // https://en.wikipedia.org/wiki/Octave#Notation
export type MIDINote = number;

const OctavesInOrder : Array<MIDIOctave> = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];

export interface Tone {
  baseTone: BaseTone;
  octave: MIDIOctave;
}

export const createTone = (props: {
  baseTone: BaseTone,
  octave: MIDIOctave
}) : Tone => {
  return {
    baseTone: props.baseTone,
    octave: props.octave
  };
};


const toneAsMIDINote = (tone: Tone) : number => {
  const noteIndex = BaseTonesInOrder.findIndex((toneInList => toneInList === tone.baseTone));
  return noteIndex + tone.octave * 12;
};

export const addToTone = (tone: Tone, toneDelta: number) : Tone => {
  const MIDINote = toneAsMIDINote(tone);
  return toneFromNumber(MIDINote + toneDelta * 2);
};

const toneFromNumber = (number: MIDINote) : Tone => {
  const [quotient, remainder] = division(number.valueOf(), BaseTonesInOrder.length);
  return createTone({baseTone: BaseTonesInOrder[remainder], octave: OctavesInOrder[quotient + 5]});
};

export const getAccidental = (tone: Tone) : Accidental => {
  switch (tone.baseTone) {
    case BaseTone.GSharp:
    case BaseTone.FSharp:
    case BaseTone.CSharp:
    case BaseTone.ASharp:
    case BaseTone.DSharp:
      return "sharp";
    case BaseTone.AFlat:
    case BaseTone.DFlat:
    case BaseTone.EFlat:
    case BaseTone.GFlat:
    case BaseTone.HFlat:
      return "flat";
    default:
      return null;
  }
};


const division = (y : number, x : number) => {
  const quotient = Math.floor(y/x);
  const remainder = y % x;
  return [quotient, remainder];
};

export enum NoteValues {
  OCTUPLE = 8,
  LONGA = 4,
  BREVE = 2,
  WHOLE = 1,
  HALF = 1/2,
  QUARTER = 1/4,
  EIGHTH = 1/8,
  SIXTEENTH = 1/16,
  THIRTYSECOND = 1/32,
  SIXTYFOURTH = 1/64,
  HUNDREDTWENTYEIGHTH = 1/128,
  TWOHUNDREDFIFTYSIXTH = 1/256
}

export const _testing = {toneAsMIDINote};

export {};
