import {MIDINote, NoteValue, NoteValues, Tone} from "../domain/Types";
import {Side, ToneInfo} from "./subcomponents/Types";
import {Note, NoteProps, StemSide} from "./subcomponents/Note";
import {cluster, flattenArray} from "./subcomponents/Utils";
import {AccidentalProps, Flat, PreferredAccidentalsContext, Sharp} from "./subcomponents/Accidentals";
import React, {useContext} from "react";
import {Cursor, CursorContext} from "./subcomponents/Cursor";
import {Stem} from "./subcomponents/Stem";
import {toneToToneInfo} from "../domain/ToneInfo";
import { ChordSpec, ChordSpecWithInversion, NamedChordSpec } from "../controls/ControlPanel";

interface ChordProps extends ChordSpec {
  onClick?: () => void;
  onShiftClick ?: () => void
}

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
    const preferredAccidentalsReplacer = useContext(PreferredAccidentalsContext);
    const partialToneInfos: Array<ToneInfo> = props.tones.map(toneToToneInfo).map(preferredAccidentalsReplacer.replacer).sort(compareToneInfos);

    const noteClusters: Array<Array<ToneInfo>> = cluster(partialToneInfos, 1);
    const accidentalClusters: Array<Array<ToneInfo>> = cluster(partialToneInfos.filter(toneInfo => toneInfo.accidental), 2);

    const stemSideForChord = partialToneInfos[partialToneInfos.length - 1].staffPosition < 6 ? Side.LEFT : Side.RIGHT;

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
                    accidental: toneInfo.accidental,
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
    return <g onClick={(event) => {
      if (event.shiftKey && props.onShiftClick) {
        props.onShiftClick();
      } else if (props.onClick) {
        props.onClick();
      }
    }}>
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
            {accidentalsProps.map((accidentalProps: AccidentalProps) => accidentalProps.accidental === "sharp"
                && <Sharp {...accidentalProps} key={accidentalProps.strKey}/>
                || accidentalProps.accidental === "flat"
                && <Flat {...accidentalProps} key={accidentalProps.strKey}/>)}
        </Cursor>
        <Cursor x={leftNoteHeadsStartX}>
            {notesProps.filter(noteProps => noteProps.stemSide === Side.RIGHT).map((noteProps: NoteProps) => <Note key={noteProps.toneInfo.strKey} {...noteProps} />)}
        </Cursor>
        <Cursor x={stemX}>
            <Stem sortedNotePositions={staffPositions} noteValue={props.noteValue}/>
        </Cursor>
        <Cursor x={rightNodeHeadsStartX}>
            {notesProps.filter(noteProps => noteProps.stemSide === Side.LEFT).map((noteProps: NoteProps) => <Note key={noteProps.toneInfo.strKey} {...noteProps} />)}
        </Cursor>

    </g>;
};

Chord.defaultProps = {
    noteValue: NoteValues.QUARTER
};
