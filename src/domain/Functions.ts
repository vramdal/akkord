import { Accidental, Position, Tone } from "./Types";
import { addToTone } from "./Tone";
import { PreferredAccidentalsMap, ToneInfo } from "../components/subcomponents/Types";
import { PositionInStaff } from "../components/subcomponents/Utils";
import { ChordSpecWithInversion } from "../controls/ControlPanel";

export const majorThree = (root: Tone, position = Position.ROOT): Array<Tone> => {
  return inverseThree([
      root,
      addToTone(root, 2),
      addToTone(root, 3.5)
    ],
    position
  );
  // const first = addToTone(root, position > 0 ? 6 : 0);
  // const second = addToTone(root, 2 + (position > 1 ? 6 : 0));
  // const third = addToTone(root, 2 + 1.5);
  // return [first, second, third];
};

export const minorThree = (root: Tone, position = Position.ROOT): Array<Tone> => {
  return inverseThree([
      root,
      addToTone(root, 1.5),
      addToTone(root, 3.5)
    ],
    position
  )
  // const first = addToTone(root, position > 0 ? 6 : 0);
  // const second = addToTone(root, 1.5 + (position > 1 ? 6 : 0));
  // const third = addToTone(root, 2 + 1.5);
  // return [first, second, third];
};

export const dominantSevenFour = (root: Tone, position = Position.ROOT): Array<Tone> => {
  return [...majorThree(root, position), addToTone(root, 5.0)]
}

export const inverseThree = (rootChordTones: Array<Tone>, position: Position): Array<Tone> => {
  if (position === Position.FIRST_INVERSION) {
    return [addToTone(rootChordTones[0], 6), rootChordTones[1], rootChordTones[2]]
  } else if (position === Position.SECOND_INVERSION) {
    return [addToTone(rootChordTones[0], 6), addToTone(rootChordTones[1], 6), rootChordTones[2]]
  } else {
    return rootChordTones;
  }
};

// TODO: Test for 7th chords
export const inverseFour = (rootChordTones: Array<Tone>, position: Position): Array<Tone> => {
  console.warn("inverse is not tested for 7th chords");
  if (position === Position.FIRST_INVERSION) {
    return [addToTone(rootChordTones[0], 6), rootChordTones[1], rootChordTones[2], rootChordTones[3]]
  } else if (position === Position.SECOND_INVERSION) {
    return [addToTone(rootChordTones[0], 6), addToTone(rootChordTones[1], 6), rootChordTones[2], rootChordTones[3]]
  } else if (position === Position.THIRD_INVERSION) {
    return [addToTone(rootChordTones[0], 6), addToTone(rootChordTones[1], 6), addToTone(rootChordTones[2], 6), rootChordTones[3]]
  } else {
    return rootChordTones;
  }
}

type PartialToneInfo = Pick<ToneInfo, 'baseTone' | 'accidental' | 'staffPosition'>;

export const toneInfoAccidentalTranslator = <T extends PartialToneInfo>(map: PreferredAccidentalsMap): (toneInfo: T) => T => {
  const needsReplacement = (tone: T): boolean => {
    return Boolean(map[tone.baseTone] && tone.accidental && tone.accidental !== map[tone.baseTone]);
  };
  const replace = (toneInfo: T): { staffPosition: PositionInStaff, accidental: Accidental } => ({
    staffPosition: toneInfo.accidental === "sharp" ? toneInfo.staffPosition - 1 : toneInfo.staffPosition + 1,
    accidental: toneInfo.accidental === "sharp" ? "flat" : "sharp"
  });

  return (toneInfo: T): T => {
    return needsReplacement(toneInfo) ? {...toneInfo, ...(replace(toneInfo))} : toneInfo;
  };
};

export const inverseChord = <T extends ChordSpecWithInversion>(chord: T, position: Position): T => {
  if (chord.tones.length === 3) {
    return {
      ...chord,
      inversion: position,
      tones: inverseThree(chord.rootTones, position),
    }
  } else if (chord.tones.length === 4) {
    return {
      ...chord,
      inversion: position,
      tones: inverseFour(chord.rootTones, position),
    }
  } else {
    throw Error("Only 3 or 4-tone chords are supported");
  }
}
