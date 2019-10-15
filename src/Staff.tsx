import React, {useContext} from "react";
import {BaseTone, NoteValues, Tone} from "./Notes";

type PositionInStaff = number;

type MIDINote = number;

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
        y={positionInStaffToY(props.position) + 1}
        x={props.x}
        key={props.position}
        width={props.width}
        height="4"
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

const NoteHead = ({x, positionInStaff, noteValue}: NoteHeadProps) => {
  const rx = 15;
  const ry = 11;
  const y = positionInStaffToY(positionInStaff) + 3;
  const maskId = `noteHeadMask${x}${positionInStaff}`;
  return (
      <>
        <mask id={maskId} maskContentUnits="userSpaceOnUse" maskUnits="userSpaceOnUse">
          <rect x={x - rx - 3} y={y - ry - 3} width={rx * 2 + x} height={ry*2 + y}  fill={"white"}/>
          <ellipse
              cx={x}
              cy={y}
              rx={rx - 2}
              ry={ry - 3}
              fill="black"
              transform="rotate(-30, 20, 20)"
          />
        </mask>

        <ellipse
            cx={x}
            cy={y}
            rx={rx}
            ry={ry}
            className={"note__head"}
            // fillOpacity={noteValue >= 0.5 ? 0 : 1}
            strokeOpacity={1}
            strokeWidth={5}
            stroke={"red"}
            fill={"yellow"}
            mask={`url(#${maskId})`}
        />
      </>
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

export enum Side {
  LEFT = "LEFT",
  RIGHT = "RIGHT"
}

type StemSide = Side;

interface NoteProps {
  toneInfo: ToneInfo;
  isTop: boolean;
  isBottom: boolean;
  stemSide: StemSide;
  noteValue: NoteValue;
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

const Note = ({ toneInfo, stemSide, isBottom, isTop, noteValue }: NoteProps) => {
  const { staffPosition } = toneInfo;
  const xOffset = stemSide === Side.RIGHT ? -12 : +17;
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
        throw new Error();
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
    MIDINoteA - MIDINoteB;

//const compareTones = (toneA: Tone, toneB: Tone) => toneToMidiNote(toneA) - toneToMidiNote(toneB);

const compareToneInfos = (
    toneInfoA: { midiNote: MIDINote },
    toneInfoB: { midiNote: MIDINote }
) => compareMIDINotes(toneInfoA.midiNote, toneInfoB.midiNote);

interface ToneInfo extends Tone {
  midiNote: MIDINote;
  strKey: string;
  staffPosition: PositionInStaff;
}

const CursorContext = React.createContext({x: 50});

const Cursor = (props: {x: number, children: any}) =>
    <CursorContext.Provider value={{x: props.x}}>
      {props.children}
    </CursorContext.Provider>
;

interface ChordProps {
  tones: Array<Tone>;
}

function cluster(toneInfos: Array<ToneInfo>) {
  const clusters: Array<Array<ToneInfo>> = [];
  let currentCluster: Array<ToneInfo> = [];
  for (let i = 0; i < toneInfos.length; i++) {
    const currentTone = toneInfos[i];
    const previousTone = i > 0 && toneInfos[i - 1];
    if (previousTone && (previousTone.staffPosition - currentTone.staffPosition > 1)) {
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
                           cluster: Array<ToneInfo>
) => {
  if (cluster.length === 1) {
    return note.staffPosition > 5 ? Side.LEFT : Side.RIGHT;
  } else {
    return (positionInCluster % 2 === 0 && Side.RIGHT) || Side.LEFT;
  }
};

export const Chord = (props: ChordProps) => {
  const partialToneInfos: Array<ToneInfo> = props.tones.map((tone: Tone) => ({
    ...tone,
    midiNote: toneToMidiNote(tone),
    strKey: toneToStrKey(tone),
    staffPosition: mapToneToStaffPosition(tone)
  })).sort(compareToneInfos);

  const clusters = cluster(partialToneInfos);

  const notesProps: Array<NoteProps> = flattenArray<NoteProps>(
      clusters.map((cluster, clusterIdx) => {
        return cluster.map(
            (toneInfo, positionInCluster) => ({
              toneInfo: {
                ...toneInfo,
              },
              isTop: clusterIdx === clusters.length - 1 && positionInCluster === cluster.length - 1,
              isBottom: clusterIdx === 0 && positionInCluster === 0,
              stemSide: determineStemSide(toneInfo, positionInCluster, cluster),
              noteValue: props.noteValue
            })
        )
      }));
  const staffPositions = notesProps.map(noteProps => noteProps.toneInfo.staffPosition);

  return (
      <>
        {notesProps.map((noteProps: NoteProps) => (
            <Note key={noteProps.toneInfo.strKey} {...noteProps} />
        ))}
        <Stem sortedNotePositions={staffPositions} noteValue={props.noteValue}/>
      </>
  );
};

Chord.defaultProps = {
  noteValue: NoteValues.QUARTER
};

export default (props: {children: Array<any>}) => {
  const staffWidth = (React.Children.count(props.children) * 100 + 100) || 0;
  return (
      <div className={"staff"}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={staffWidth}
            height="300"
            className={"staff"}
        >
          {[1, 3, 5, 7, 9].map(lineIdx => (
              <StaffLine key={lineIdx} position={lineIdx} width={staffWidth} />
          ))}
          {React.Children.map(props.children,(child, idx) =>
              <Cursor x={50 + idx * 100} key={`child-${idx}`}>
                {child}
              </Cursor>
          )}
        </svg>
      </div>
  );
};

export const _testing = { Note, LedgerLines, cluster };
