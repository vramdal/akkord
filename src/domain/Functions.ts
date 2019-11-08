import {Accidental, NoteValue, Position, Tone} from "./Types";
import {addToTone} from "./Tone";
import {PreferredAccidentalsMap, ToneInfo} from "../components/subcomponents/Types";
import {PositionInStaff} from "../components/subcomponents/Utils";

export const majorThree = (root : Tone, noteValue : NoteValue, position = Position.ROOT): Array<Tone> => {
    const first = addToTone(root, position > 0 ? 6 : 0);
    const second = addToTone(root, 2 + (position > 1 ? 6 : 0));
    const third = addToTone(root, 2 + 1.5);
    return [first, second, third];
};

export const minorThree = (root : Tone, noteValue : NoteValue, position = Position.ROOT): Array<Tone> => {
    const first = addToTone(root, position > 0 ? 6 : 0);
    const second = addToTone(root, 1.5 + (position > 1 ? 6 : 0));
    const third = addToTone(root, 2 + 1.5);
    return [first, second, third];
};

type PartialToneInfo = Pick<ToneInfo, 'baseTone' | 'accidental' | 'staffPosition'>;

export const toneInfoAccidentalTranslator = <T extends PartialToneInfo>(map: PreferredAccidentalsMap): (toneInfo: T) => T => {
    const needsReplacement = (tone: T) : boolean => {
        return Boolean(map[tone.baseTone] && tone.accidental && tone.accidental !== map[tone.baseTone]);
    };
    const replace = (toneInfo: T) : {staffPosition: PositionInStaff, accidental: Accidental} => ({
        staffPosition: toneInfo.accidental === "sharp" ? toneInfo.staffPosition - 1 : toneInfo.staffPosition + 1,
        accidental: toneInfo.accidental === "sharp" ? "flat" : "sharp"
    });

    return (toneInfo: T): T => {
        return needsReplacement(toneInfo) ? {...toneInfo, ...(replace(toneInfo))} : toneInfo;
    };
} ;
