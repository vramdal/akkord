import {Accidental, MIDINote, Tone} from "../../domain/Types";
import {PositionInStaff} from "./Utils";

export enum Side {
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}

export interface ToneInfo extends Tone {
    midiNote: MIDINote;
    strKey: string;
    staffPosition: PositionInStaff;
    accidental: Accidental
}