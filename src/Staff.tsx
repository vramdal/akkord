import React from "react";
import {BaseTone, Tone} from "./Notes";

type PositionInStaff = number;

type MIDINote = number;

interface StaffLineProps {
    position: PositionInStaff,
    width: number,
    x: number,
}

function positionInStaffToY(position: PositionInStaff) {
    return position * 12 + 12;
}

const StaffLine = (props: StaffLineProps) => (
    <rect y={positionInStaffToY(props.position) + 1} x={props.x} key={props.position} width={props.width} height="4" className={'staff__line'}/>
)

StaffLine.defaultProps = {
    width: 200,
    x: 0
}

interface NoteHeadProps {
    x: number,
    positionInStaff: PositionInStaff,
}

const NoteHead = (props: NoteHeadProps) => (
    <ellipse data-testid={`x:${props.x},pos:${props.positionInStaff}`} cx={props.x} cy={positionInStaffToY(props.positionInStaff) + 3} rx={11} ry={11} className={'note__head'}/>
)

interface NoteProps {
    tone: Tone,
    x: number,
    hasNeighbor: boolean
}

interface ExtensionLinesProps {
    maxExtent: PositionInStaff,
    x: number
}

const ExtensionLines = (props: ExtensionLinesProps) => {
    let positions: Array<number> = [];
    if (props.maxExtent >= 11) {
        positions = new Array(props.maxExtent - 10).fill(0).map((position, idx) => idx + 11).filter(pos => pos % 2 === 1);
    } else if (props.maxExtent < 0) {
        positions = new Array(props.maxExtent * -1).fill(0).map((position, idx) => idx * -1).filter(pos => pos % 2 === 1);
    }
    console.log('positions', positions);  // eslint-disable-line no-console

    return <>
        {positions.map(position => <StaffLine key={position} position={position} x={props.x - 20} width={40}/>)}
    </>;
}

export const Note = ({tone, x, hasNeighbor}: NoteProps) => {
    let positionInStaff = mapToneToStaffPosition(tone);
    const neighborOffset = hasNeighbor && positionInStaff % 2 === 0;
    return (
        <>
            { (positionInStaff >= 11 || positionInStaff < 0) && <ExtensionLines maxExtent={positionInStaff} x={x}/> }
            <NoteHead key={tone.baseTone + tone.octave} x={x + (neighborOffset ? 22 : 0)} positionInStaff={positionInStaff}/>
        </>
    )
}

Note.defaultProps = {
    hasNeighbor: false
}


interface ChordProps {
    tones: Array<Tone>
}

const mapToneToStaffPosition = (tone: Tone) : PositionInStaff => {
    const getBasePosition = () => {
        switch (tone.baseTone) {
            case BaseTone.C: case BaseTone.CSharp: return 11;
            case BaseTone.D: case BaseTone.DSharp: return 10;
            case BaseTone.E: case BaseTone.EFlat: return 9;
            case BaseTone.F: case BaseTone.FSharp: return 8;
            case BaseTone.G: case BaseTone.GFlat: case BaseTone.GSharp: return 7;
            case BaseTone.A: case BaseTone.AFlat: case BaseTone.ASharp: return 6;
            case BaseTone.H: case BaseTone.HFlat: return 5;
            default: throw new Error();
        }
    }
    return getBasePosition() - tone.octave * 7;
}


const toneToMidiNote = (tone: Tone): MIDINote => {
    const baseTones = [BaseTone.C, BaseTone.CSharp, BaseTone.D, BaseTone.DSharp, BaseTone.E, BaseTone.F, BaseTone.FSharp, BaseTone.G, BaseTone.GSharp, BaseTone.A, BaseTone.ASharp, BaseTone.H];

    const getNormalizedBaseTone = (baseTone: BaseTone) => {
        switch (baseTone) {
            case BaseTone.EFlat: return BaseTone.DSharp;
            case BaseTone.GFlat: return BaseTone.FSharp;
            case BaseTone.AFlat: return BaseTone.GSharp;
            case BaseTone.HFlat: return BaseTone.ASharp;
            default: return baseTone;
        }
    }

    const baseTone = getNormalizedBaseTone(tone.baseTone);
    const midiNote: MIDINote = baseTones.findIndex(currentBaseTone => currentBaseTone == baseTone) + 12 + tone.octave * 12;

    return midiNote;
}

const toneToStrKey = (tone: Tone) => tone.baseTone + tone.octave;

const compareMIDINotes = (MIDINoteA: MIDINote, MIDINoteB: MIDINote) => MIDINoteA - MIDINoteB;

//const compareTones = (toneA: Tone, toneB: Tone) => toneToMidiNote(toneA) - toneToMidiNote(toneB);

const compareToneInfos = (toneInfoA: ToneInfo, toneInfoB: ToneInfo) => compareMIDINotes(toneInfoA.midiNote, toneInfoB.midiNote);

interface ToneInfo extends Tone {
    midiNote: MIDINote,
    strKey: string,
    staffPosition: PositionInStaff,
}

interface ChordProps {
    tones: Array<Tone>
}

export const Chord = (props: ChordProps) => {
    const toneInfos: Array<ToneInfo> = props.tones.map(tone => ({
        ...tone,
        midiNote: toneToMidiNote(tone),
        strKey: toneToStrKey(tone),
        staffPosition: mapToneToStaffPosition(tone),
    }));
    debugger;
    const sortedTones = toneInfos.sort(compareToneInfos);
    const neighbors = sortedTones.map((tone: ToneInfo, idx: number, tones: Array<ToneInfo>) => {
        const hasNeighbor = (idx > 0 && tones[idx - 1].staffPosition === tone.staffPosition + 1) ||
            (idx < tones.length - 1 && tones[idx + 1].staffPosition === tone.staffPosition - 1);
        return hasNeighbor;
    });

    return <>
        {sortedTones.map((tone: ToneInfo, idx : number) => (<Note key={tone.strKey} x={50} tone={tone} hasNeighbor={neighbors[idx]}/>))}
    </>
};


export default (props: ChordProps) => {

    return <div className={'staff'}>
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" className={'staff'}>
            {
                [1, 3, 5, 7, 9].map(lineIdx => (<StaffLine key={lineIdx} position={lineIdx}/>))
            }
            <Chord tones={props.tones}/>
        </svg>
    </div>
}

