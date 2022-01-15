import {BaseTone, MIDINote, Tone} from "./Types";
import {ToneInfo} from "../components/subcomponents/Types";
import {getAccidental} from "./Tone";
import {PositionInStaff} from "../components/subcomponents/Utils";

export const mapToneToStaffPosition = (tone: Tone): PositionInStaff => {
    const getBasePosition = () => {
        switch (tone.baseTone) {
            case BaseTone.C:
            case BaseTone.CSharp:
                return 11;
            case BaseTone.D:
            case BaseTone.DSharp:
                return 10;
            case BaseTone.E:
            case BaseTone.EFlat:
                return 9;
            case BaseTone.F:
            case BaseTone.FSharp:
                return 8;
            case BaseTone.G:
            case BaseTone.GFlat:
            case BaseTone.GSharp:
                return 7;
            case BaseTone.A:
            case BaseTone.AFlat:
            case BaseTone.ASharp:
                return 6;
            case BaseTone.H:
            case BaseTone.HFlat:
                return 5;
            default:
                throw new Error("Invalid tone: " + JSON.stringify(tone));
        }
    };
    return getBasePosition() - tone.octave * 7;
};
const toneToMidiNote = (tone: Tone): MIDINote => {
    const baseTones = [
        BaseTone.C,
        BaseTone.CSharp,
        BaseTone.D,
        BaseTone.DSharp,
        BaseTone.E,
        BaseTone.F,
        BaseTone.FSharp,
        BaseTone.G,
        BaseTone.GSharp,
        BaseTone.A,
        BaseTone.ASharp,
        BaseTone.H
    ];

    const getNormalizedBaseTone = (baseTone: BaseTone) => {
        switch (baseTone) {
            case BaseTone.EFlat:
                return BaseTone.DSharp;
            case BaseTone.GFlat:
                return BaseTone.FSharp;
            case BaseTone.AFlat:
                return BaseTone.GSharp;
            case BaseTone.HFlat:
                return BaseTone.ASharp;
            default:
                return baseTone;
        }
    };

    const baseTone = getNormalizedBaseTone(tone.baseTone);
    // noinspection UnnecessaryLocalVariableJS
    const midiNote: MIDINote =
        baseTones.findIndex(currentBaseTone => currentBaseTone === baseTone) +
        12 +
        tone.octave * 12;

    return midiNote;
};
const toneToStrKey = (tone: Tone) => tone.baseTone + tone.octave;

export function toneToToneInfo(tone: Tone): ToneInfo {
    return {
        ...tone,
        midiNote: toneToMidiNote(tone),
        strKey: toneToStrKey(tone),
        staffPosition: mapToneToStaffPosition(tone),
        accidental: getAccidental(tone),
    };
}
