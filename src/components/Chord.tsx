import {BaseTone, MIDINote, NoteValue, NoteValues, Tone} from "../domain/Types";
import {Side, ToneInfo} from "./subcomponents/Types";
import {Note, NoteProps, StemSide} from "./subcomponents/Note";
import {getAccidental} from "../domain/Tone";
import {cluster, flattenArray, PositionInStaff} from "./subcomponents/Utils";
import {AccidentalProps, Sharp} from "./subcomponents/Accidentals";
import React, {useContext} from "react";
import {Cursor, CursorContext} from "./subcomponents/Cursor";
import {Stem} from "./subcomponents/Stem";

interface ChordProps {
    tones: Array<Tone>;
    noteValue: NoteValue;
}

const mapToneToStaffPosition = (tone: Tone): PositionInStaff => {
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
const compareMIDINotes = (MIDINoteA: MIDINote, MIDINoteB: MIDINote) =>
    MIDINoteA.valueOf() - MIDINoteB.valueOf();
const compareToneInfos = (
    toneInfoA: { midiNote: MIDINote },
    toneInfoB: { midiNote: MIDINote }
) => compareMIDINotes(toneInfoA.midiNote, toneInfoB.midiNote);
const determineStemSide = (note: ToneInfo,
                           positionInCluster: number,
                           cluster: Array<ToneInfo>,
                           stemSideForChord: StemSide
) => {
    if (cluster.length === 1) {
        return stemSideForChord;
    } else {
        return (positionInCluster % 2 === 0 && Side.RIGHT) || Side.LEFT;
    }
};
export const Chord = (props: ChordProps) => {
    const partialToneInfos: Array<ToneInfo> = props.tones.map((tone: Tone) => ({
        ...tone,
        midiNote: toneToMidiNote(tone),
        strKey: toneToStrKey(tone),
        staffPosition: mapToneToStaffPosition(tone),
        accidental: getAccidental(tone),
    })).sort(compareToneInfos);

    const noteClusters: Array<Array<ToneInfo>> = cluster(partialToneInfos, 1);
    const accidentalClusters: Array<Array<ToneInfo>> = cluster(partialToneInfos.filter(toneInfo => toneInfo.accidental), 2);

    const stemSideForChord = partialToneInfos[partialToneInfos.length - 1].staffPosition < 5 ? Side.LEFT : Side.RIGHT;

    const notesProps: Array<NoteProps> = flattenArray<NoteProps>(
        noteClusters.map((cluster, clusterIdx) => {
            return cluster.map(
                (toneInfo, positionInCluster) => ({
                    toneInfo: {
                        ...toneInfo,
                    },
                    isTop: clusterIdx === noteClusters.length - 1 && positionInCluster === cluster.length - 1,
                    isBottom: clusterIdx === 0 && positionInCluster === 0,
                    stemSide: determineStemSide(toneInfo, positionInCluster, cluster, stemSideForChord),
                    noteValue: props.noteValue,
                    accidental: toneInfo.accidental,
                })
            )
        }));

    const accidentalsProps: Array<AccidentalProps> = flattenArray<AccidentalProps>(
        accidentalClusters.map((cluster, clusterIdx) => {
            return cluster.map(
                (toneInfo: ToneInfo, positionInCluster: number) => ({
                    accidental: "sharp",
                    isTop: clusterIdx === accidentalClusters.length - 1 && positionInCluster === cluster.length - 1,
                    isBottom: clusterIdx === 0 && positionInCluster === 0,
                    staffPosition: toneInfo.staffPosition,
                    column: positionInCluster % 3,
                    strKey: `${toneInfo.strKey}-accidental`,
                })
            )
        }));

    const staffPositions = notesProps.map(noteProps => noteProps.toneInfo.staffPosition);

    // const minStaffPosition = Math.min(...staffPositions);
    // const maxStaffPosition = Math.max(...staffPositions);

    const accidentalsStackWidth = 34;
    const noteHeadsStackWidth = 27;
    const stemWidth = 1;

    const cursor = useContext(CursorContext);

    const accidentalsStartX = cursor.x;
    const numAccidentalColumns = Math.max(0, ...(accidentalsProps.map(accidentalProps => accidentalProps.column + 1)));
    const leftNoteHeadsStartX = accidentalsStartX + (numAccidentalColumns) * accidentalsStackWidth;
    const stemX = (notesProps.find(noteProps => noteProps.stemSide === Side.RIGHT) ? leftNoteHeadsStartX + noteHeadsStackWidth : leftNoteHeadsStartX);
    const rightNodeHeadsStartX = stemX + stemWidth;
    // const endX = rightNodeHeadsStartX + noteHeadsStackWidth;
    // console.log("accidentalsStartX, leftNoteHeadsStartX, stemX, rightNodeHeadsStartX, numAccidentalColumns = ", accidentalsStartX, leftNoteHeadsStartX, stemX, rightNodeHeadsStartX, numAccidentalColumns);

    // TODO: Test accidentals
    return (
        <>
            {/*<rect*/}
            {/*    x={cursor.x}*/}
            {/*    y={0}*/}
            {/*    width={endX}*/}
            {/*    height={positionInStaffToY(12) + 2}*/}
            {/*    stroke={'white'}*/}
            {/*    fill={'transparent'}*/}
            {/*    strokeWidth={2}*/}
            {/*    className={'outline'}*/}
            {/*>*/}
            {/*</rect>*/}
            <Cursor x={accidentalsStartX}>
                {accidentalsProps.map((accidentalProps: AccidentalProps) => (
                    accidentalProps.accidental === "sharp"
                    && <Sharp {...accidentalProps} key={accidentalProps.strKey}/>
                ))}
            </Cursor>
            <Cursor x={leftNoteHeadsStartX}>
                {notesProps.filter(noteProps => noteProps.stemSide === Side.RIGHT).map((noteProps: NoteProps) => (
                    <Note key={noteProps.toneInfo.strKey} {...noteProps} />
                ))}
            </Cursor>
            <Cursor x={stemX}>
                <Stem sortedNotePositions={staffPositions} noteValue={props.noteValue}/>
            </Cursor>
            <Cursor x={rightNodeHeadsStartX}>
                {notesProps.filter(noteProps => noteProps.stemSide === Side.LEFT).map((noteProps: NoteProps) => (
                    <Note key={noteProps.toneInfo.strKey} {...noteProps} />
                ))}
            </Cursor>

        </>
    );
};

Chord.defaultProps = {
    noteValue: NoteValues.QUARTER
};