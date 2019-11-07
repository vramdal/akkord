import {Accidental, BaseTone, MIDINote, MIDIOctave, Tone} from "./Types";

const BaseTonesInOrder = [BaseTone.C, BaseTone.CSharp, BaseTone.D, BaseTone.DSharp, BaseTone.E, BaseTone.F, BaseTone.FSharp, BaseTone.G, BaseTone.GSharp, BaseTone.A, BaseTone.ASharp, BaseTone.H];

const OctavesInOrder : Array<MIDIOctave> = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];

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

const division = (y: number, x: number) => {
  const quotient = Math.floor(y / x);
  const remainder = y % x;
  return [quotient, remainder];
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


export const _testing = {toneAsMIDINote};

export {};
