import {NoteValue, Position, Tone} from "./Types";
import {addToTone} from "./Tone";

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
