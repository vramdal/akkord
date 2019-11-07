import React, {useContext} from "react";
import {Accidental, addToTone, BaseTone, getAccidental, MIDINote, NoteValues, Tone} from "./Notes";
import {ReactElementLike} from "prop-types";

type PositionInStaff = number;


export enum Side {
    LEFT = "LEFT",
    RIGHT = "RIGHT"
}

interface StaffLineProps {
  position: PositionInStaff;
  width: number;
  x: number;
}

const LINE_HEIGHT = 12;

function positionInStaffToY(position: PositionInStaff) {
  return position * LINE_HEIGHT;
}

const StaffLine = (props: StaffLineProps) => (
    <rect
        y={positionInStaffToY(props.position) + 2}
        x={props.x}
        key={props.position}
        width={props.width}
        height="1"
        className={"staff__line"}
    />
);

StaffLine.defaultProps = {
  width: 200,
  x: 0
};

interface NoteHeadProps {
  x: number;
  positionInStaff: PositionInStaff;
  noteValue: NoteValue;
}

const maskReference = (noteValue: NoteValue) : string | undefined => {
  if (noteValue < 0.5) {
    return undefined;
  } else if (noteValue < 1) {
    return `url(#hollowNoteHeadMask${Side.LEFT})`;
  } else {
    return `url(#hollowNoteHeadMask${Side.RIGHT})`;
  }
};

const NoteHead = ({x, positionInStaff, noteValue}: NoteHeadProps) => {
  const rx = 15;
  const ry = 11;
  const y = positionInStaffToY(positionInStaff);
  return (
      <ellipse
          cx={x + rx}
          cy={y + 2}
          rx={rx}
          ry={ry}
          className={"note__head"}
          fill={"white"}
          strokeWidth={0}
          mask={maskReference(noteValue)}
      />
  );
};

interface StemProps {
  sortedNotePositions: Array<PositionInStaff>,
  noteValue: NoteValue;
}

const Stem = ({sortedNotePositions}: StemProps) => {
  const topNotePosition = sortedNotePositions[0];
  const bottomNotePosition = sortedNotePositions[sortedNotePositions.length - 1];
  const stemDirection : "up" | "down" = (bottomNotePosition > 5 && bottomNotePosition < 14) ? "up" : "down";
  const startPosition = stemDirection === "up" ? bottomNotePosition - 8 : bottomNotePosition;
  const endPosition = stemDirection === "down" ? topNotePosition + 8 : topNotePosition;
  const y = positionInStaffToY(startPosition) + 5;
  const length = positionInStaffToY(endPosition) - y;
  const cursor = useContext(CursorContext);
  return (
      <rect
          y={positionInStaffToY(startPosition) + 5}
          x={cursor.x}
          width={4}
          height={length}
          className={"staff__line"}
      />
  );
};

type StemSide = Side;

interface NoteProps {
  toneInfo: ToneInfo;
  isTop: boolean;
  isBottom: boolean;
  stemSide: StemSide;
  noteValue: NoteValue;
  accidental?: Accidental;
}

interface ExtensionLinesProps {
  maxExtent: PositionInStaff;
  x: number;
}

const LedgerLines = (props: ExtensionLinesProps) => {
  let positions: Array<number> = [];
  if (props.maxExtent >= 11) {
    positions = new Array(props.maxExtent - 10)
        .fill(0)
        .map((position, idx) => idx + 11)
        .filter(pos => pos % 2 !== 0);
  } else if (props.maxExtent < 0) {
    positions = new Array(props.maxExtent * -1)
        .fill(0)
        .map((position, idx) => idx * -1 - 1)
        .filter(pos => pos % 2 !== 0);
  }
  return (
      <>
        {positions.map(position => (
            <StaffLine
                key={position}
                position={position}
                x={props.x - 5}
                width={40}
            />
        ))}
      </>
  );
};

interface AccidentalProps {
  staffPosition: PositionInStaff;
  accidental: Accidental
  isTop: boolean;
  isBottom: boolean;
  column: number;
  strKey: string;
}

const Sharp = ({staffPosition, column}: AccidentalProps) => {
  const cursor = useContext(CursorContext);
  const startY = positionInStaffToY(staffPosition - 1);
  // const endY = positionInStaffToY(staffPosition + 2);
  const xOffset = (30 * column);
  // const length = endY - startY - 3;
  return <use xlinkHref="#sharp" x={cursor.x + xOffset}  y={startY} />
};

const Note = ({ toneInfo, isBottom, isTop, noteValue}: NoteProps) => {
  const { staffPosition } = toneInfo;
  const cursor = useContext(CursorContext);
  return (
      <>
        {(((isBottom && staffPosition >= 11) || (isTop && staffPosition < 0)) && (
            <LedgerLines maxExtent={staffPosition} x={cursor.x} />
        )) ||
        undefined}
        <NoteHead
            key={toneInfo.strKey}
            x={cursor.x}
            positionInStaff={staffPosition}
            noteValue={noteValue}
        />
      </>
  );
};

Note.defaultProps = {
  isTop: true,
  isBottom: true,
  noteValue: NoteValues.QUARTER
};

type NoteValue = number;

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

//const compareTones = (toneA: Tone, toneB: Tone) => toneToMidiNote(toneA) - toneToMidiNote(toneB);

const compareToneInfos = (
    toneInfoA: { midiNote: MIDINote },
    toneInfoB: { midiNote: MIDINote }
) => compareMIDINotes(toneInfoA.midiNote, toneInfoB.midiNote);

interface ToneInfo extends Tone {
  midiNote: MIDINote;
  strKey: string;
  staffPosition: PositionInStaff;
  accidental: Accidental
}

const CursorContext = React.createContext({x: 0});

const Cursor = (props: {x: number, children: any}) =>
    <CursorContext.Provider value={{x: props.x}}>
      {props.children}
    </CursorContext.Provider>
;

// interface ChordProps {
//   tones: Array<Tone>;
// }

function cluster<Placed extends {staffPosition: PositionInStaff}>(objectsInStaff: Array<Placed>, maxDiffInCluster = 1) {
  const clusters: Array<Array<Placed>> = [];
  let currentCluster: Array<Placed> = [];
  for (let i = 0; i < objectsInStaff.length; i++) {
    const currentTone = objectsInStaff[i];
    const previousTone = i > 0 && objectsInStaff[i - 1];
    if (previousTone && (previousTone.staffPosition - currentTone.staffPosition > maxDiffInCluster)) {
      // End cluster
      clusters.push(currentCluster);
      currentCluster = [];
    }
    currentCluster.push(currentTone);
  }
  clusters.push(currentCluster);
  return clusters;
}

function flattenArray<T>(arrays: Array<Array<T>>): Array<T> {
  const result: Array<T> = [];
  return result.concat.apply([], arrays);
}

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
            (toneInfo : ToneInfo, positionInCluster : number) => ({
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
          { accidentalsProps.map((accidentalProps: AccidentalProps) => (
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

const HollowNoteHeadMask = ({ direction } : {direction: Side }) => (
    <mask id={ `hollowNoteHeadMask${direction}`}
          maskContentUnits="objectBoundingBox"
          maskUnits="objectBoundingBox"
    >
      <rect x="0" y="0" width="1" height="1" fill="white"/>
      <ellipse cx=".5" cy=".5" rx=".25" ry=".4"
               fill="black"
               transform={`rotate(${40 * (direction === Side.LEFT ? 1 : -1)}, .5, .5)`}/>
    </mask>

);


const SharpSymbolDefinition = () => <symbol id={"sharp"} width={40} height={LINE_HEIGHT * 2.5}
                                            viewBox={`0 0 10 20`}>
  <g className={"sharp"} stroke="white" strokeWidth={2.5}>
    <line x1={2} x2={2} y1={1} y2={20} strokeWidth={1.5}/>
    <line x1={8} x2={8} y1={0} y2={19} strokeWidth={1.5}/>
    <line x1={0} x2={10} y1={6} y2={3} strokeWidth={3.5}/>
    <line x1={0} x2={10} y1={16} y2={13} strokeWidth={3.5}/>
  </g>
</symbol>;

interface ElementOnStaff extends ReactElementLike {
  staffPosition: PositionInStaff
}

export default (props: {children: Array<ElementOnStaff>}) => {
  const staffWidth = (React.Children.count(props.children) * 150 + 100) || 0;
  return (
      <div className={"staff"}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={staffWidth}
            height={"300"}
            className={"staff"}
        >
          <HollowNoteHeadMask direction={Side.LEFT}/>
          <HollowNoteHeadMask direction={Side.RIGHT}/>
          <SharpSymbolDefinition/>


          {[1, 3, 5, 7, 9].map(lineIdx => (
              <StaffLine key={lineIdx} position={lineIdx} width={staffWidth}/>
          ))}
          {React.Children.map(props.children, (child, idx) =>
              <Cursor x={idx * 150} key={`child-${idx}`}>
                {child}
              </Cursor>
          )}
        </svg>
      </div>
  );
};

export enum Position {
  ROOT = 0,
  FIRST_INVERSION = 1,
  SECOND_INVERSION = 2
}


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

export const _testing = { Note, LedgerLines, cluster };
