import React, {useContext} from "react";
import {BaseTone, Tone} from "./Notes";

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
}

const NoteHead = (props: NoteHeadProps) => (
    <ellipse
        data-testid={`x:${props.x},pos:${props.positionInStaff}`}
        cx={props.x}
        cy={positionInStaffToY(props.positionInStaff) + 3}
        rx={15}
        ry={11}
        className={"note__head"}
    />
);

interface StemProps {
  sortedNotePositions: Array<PositionInStaff>,
}

const Stem = ({sortedNotePositions}: StemProps) => {
  const topNotePosition = sortedNotePositions[0];
  const bottomNotePosition = sortedNotePositions[sortedNotePositions.length - 1];
  const stemDirection : "up" | "down" = (bottomNotePosition > 5 && bottomNotePosition < 14) ? "up" : "down";
  const startPosition = stemDirection === "up" ? bottomNotePosition - 8 : bottomNotePosition;
  const endPosition = stemDirection === "down" ? topNotePosition + 8 : topNotePosition;
  const y = positionInStaffToY(startPosition) + 5;
  const length = positionInStaffToY(endPosition) - y;
  const xOffset = stemDirection === "down" ? -15 : +10;
  const cursor = useContext(CursorContext);
  return (
      <rect
          y={positionInStaffToY(startPosition) + 5}
          x={cursor.x + xOffset}
          width={4}
          height={length}
          className={"staff__line"}
      />
  );
};

interface NoteProps {
  toneInfo: ToneInChord;
  x: number;
  isTop: boolean;
  isBottom: boolean;
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

const Note = ({ toneInfo, x }: NoteProps) => {
  const { staffPosition, hasNeighbor, isBottom, isTop } = toneInfo;
  const neighborOffset = hasNeighbor && staffPosition % 2 === 0;
  return (
      <>
        {(((isBottom && staffPosition >= 11) || (isTop && staffPosition < 0)) && (
            <LedgerLines maxExtent={staffPosition} x={x} />
        )) ||
        undefined}
        <NoteHead
            key={toneInfo.strKey}
            x={x + (neighborOffset ? 22 : 0)}
            positionInStaff={staffPosition}
        />
      </>
  );
};

Note.defaultProps = {
  isTop: true,
  isBottom: true
};


interface ChordProps {
  tones: Array<Tone>;
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

interface ToneInChord extends ToneInfo {
  hasNeighbor: boolean;
  isTop: boolean;
  isBottom: boolean;
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

export const Chord = (props: ChordProps) => {
  const partialToneInfos: Array<ToneInfo> = props.tones.map((tone: Tone) => ({
    ...tone,
    midiNote: toneToMidiNote(tone),
    strKey: toneToStrKey(tone),
    staffPosition: mapToneToStaffPosition(tone)
  }));
  const cursor = useContext(CursorContext);
  const sortedTones = partialToneInfos.sort(compareToneInfos);
  const neighbors = sortedTones.map(
      (tone: ToneInfo, idx: number, tones: Array<ToneInfo>) => {
        // noinspection UnnecessaryLocalVariableJS
        const hasNeighbor =
            (idx > 0 && tones[idx - 1].staffPosition === tone.staffPosition + 1) ||
            (idx < tones.length - 1 &&
                tones[idx + 1].staffPosition === tone.staffPosition - 1);
        return hasNeighbor;
      }
  );
  const toneInfos: Array<ToneInChord> = partialToneInfos.map(
      (partialToneInfo, idx) => ({
        ...partialToneInfo,
        hasNeighbor: neighbors[idx],
        isTop: idx === partialToneInfos.length - 1,
        isBottom: idx === 0
      })
  );
  const staffPositions = toneInfos.map(toneInfo => toneInfo.staffPosition);
  // const topPosition : number = Math.min(...staffPositions);
  // const bottomPosition : number = Math.max(...staffPositions);

  return (
      <>
        {toneInfos.map((toneInfo: ToneInChord) => (
            <Note key={toneInfo.strKey} x={cursor.x} toneInfo={toneInfo} />
        ))}
        <Stem sortedNotePositions={staffPositions}/>
      </>
  );
};

export default (props: {children: Array<any>}) => {
  const staffWidth = props.children && props.children.length * 100 + 100 || 0;
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
          {props.children && props.children.map((child, idx) =>
              <Cursor x={50 + idx * 100} key={`child-${idx}`}>
                {child}
              </Cursor>
          )}
        </svg>
      </div>
  );
};

export const _testing = { Note, LedgerLines };
