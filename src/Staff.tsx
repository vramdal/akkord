import React, {useContext} from "react";
import {addToTone, BaseTone, MIDINote, NoteValues, Tone, getAccidental, Accidental} from "./Notes";

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

function positionInStaffToY(position: PositionInStaff) {
  return position * 12 + 48;
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
  const y = positionInStaffToY(positionInStaff) + 3;
  return (
      <ellipse
          cx={x}
          cy={y}
          rx={rx}
          ry={ry}
          className={"note__head"}
          fill={"white"}
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
                x={props.x - 20}
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
  const endY = positionInStaffToY(staffPosition + 2);
  const xOffset = (30 * column);
  const length = endY - startY - 3;
  return <>
    <g className={'sharp'} stroke="black" width={4}>
      <rect
          y={startY}
          x={cursor.x - 14 + xOffset}
          height={length}
          width={2}
      />
      <rect
          y={startY - 5}
          x={cursor.x - 7 + xOffset}
          height={length}
          width={2}
      />
      <rect
          y={startY + 9}
          x={cursor.x + xOffset + 5}
          width={5}
          height={17}
          transform={`rotate(80, ${cursor.x + xOffset + 5}, ${startY + 3})`}/>

      />
      <rect
          y={startY + 26}
          x={cursor.x - 2 + xOffset + 5}
          width={5}
          height={17}
          transform={`rotate(80, ${cursor.x + xOffset + 5}, ${startY + 20})`}/>
      />
    </g>
  </>;
};

const Note = ({ toneInfo, isBottom, isTop, noteValue}: NoteProps) => {
  const { staffPosition } = toneInfo;
  const xOffset = 0;// (stemSide === Side.RIGHT ? +16 : -12);
  const cursor = useContext(CursorContext);
  return (
      <>
        {(((isBottom && staffPosition >= 11) || (isTop && staffPosition < 0)) && (
            <LedgerLines maxExtent={staffPosition} x={cursor.x + xOffset} />
        )) ||
        undefined}
        <NoteHead
            key={toneInfo.strKey}
            x={cursor.x + (xOffset)}
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

const CursorContext = React.createContext({x: 50});

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
              column: 3 - positionInCluster % 3,
              strKey: `${toneInfo.strKey}-accidental`,
            })
        )
      }));

  const staffPositions = notesProps.map(noteProps => noteProps.toneInfo.staffPosition);

  const accidentalsStackWidth = 27;
  const noteHeadsStackWidth = 12;
  const stemWidth = 4;

  const cursor = useContext(CursorContext);

  const accidentalsStartX = cursor.x;
  const numAccidentalColumns = Math.max(0, ...(accidentalsProps.map(accidentalProps => accidentalProps.column + 1)));
  const leftNoteHeadsStartX = accidentalsStartX + (numAccidentalColumns) * accidentalsStackWidth;
  const stemX = (notesProps.find(noteProps => noteProps.stemSide === Side.RIGHT) ? leftNoteHeadsStartX + noteHeadsStackWidth : leftNoteHeadsStartX);
  const rightNodeHeadsStartX = stemX + stemWidth + 12;
  console.log("accidentalsStartX, leftNoteHeadsStartX, stemX, rightNodeHeadsStartX, numAccidentalColumns = ", accidentalsStartX, leftNoteHeadsStartX, stemX, rightNodeHeadsStartX, numAccidentalColumns);

  // TODO: Test accidentals
  return (
      <>
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


export default (props: {children: any}) => {
  const staffWidth = (React.Children.count(props.children) * 150 + 100) || 0;
  return (
      <div className={"staff"}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={staffWidth}
            height="300"
            className={"staff"}
        >
          <HollowNoteHeadMask direction={Side.LEFT} />
          <HollowNoteHeadMask direction={Side.RIGHT} />

          {[1, 3, 5, 7, 9].map(lineIdx => (
              <StaffLine key={lineIdx} position={lineIdx} width={staffWidth} />
          ))}
          {React.Children.map(props.children,(child, idx) =>
              <Cursor x={50 + idx * 150} key={`child-${idx}`}>
                {child}
              </Cursor>
          )}
        </svg>
      </div>
  );
};

interface ScaleProps {
  startTone: Tone,
  noteValue: NoteValue
}

export const MajorThree = ({startTone, noteValue}: ScaleProps) => {
  const second = addToTone(startTone, 2);
  const third = addToTone(second, 1.5);
  const tones = [startTone, second, third];
  return <Chord tones={tones} noteValue={noteValue}/>
};

export const MinorThree = ({startTone, noteValue}: ScaleProps) => {
  const second = addToTone(startTone, 1.5);
  const third = addToTone(second, 2);
  const tones = [startTone, second, third];
  return <Chord tones={tones} noteValue={noteValue}/>
};

export const _testing = { Note, LedgerLines, cluster };
