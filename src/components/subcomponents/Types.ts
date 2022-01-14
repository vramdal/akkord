import {Accidental, BaseTone, MIDINote, Tone} from "../../domain/Types";
import {PositionInStaff} from "./Utils";

export enum Side {
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}

export interface ScrollTarget {
    scrollTargetGroup?: string
}

export interface ToneInfo extends Tone {
    midiNote: MIDINote;
    strKey: string;
    staffPosition: PositionInStaff;
    accidental: Accidental,
}

export type PreferredAccidentalsMap = {
    [tone in BaseTone]?: Accidental;
};
