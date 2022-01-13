import {Accidental, NoteValue, NoteValues} from "../../domain/Types";
import {PositionInStaff, positionInStaffToY} from "./Utils";
import React, {useContext} from "react";
import {StaffLine} from "./StaffLine";
import {Side, ToneInfo} from "./Types";
import {CursorContext} from "./Cursor";

interface NoteHeadProps {
    x: number;
    positionInStaff: PositionInStaff;
    noteValue: NoteValue;
}

const maskReference = (noteValue: NoteValue): string | undefined => {
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
            onClick={() => console.log("Klikk", noteValue)}
        />
    );
};

export interface NoteProps {
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

export const LedgerLines = (props: ExtensionLinesProps) => {
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
export const Note = ({toneInfo, isBottom, isTop, noteValue}: NoteProps) => {
    const {staffPosition} = toneInfo;
    const cursor = useContext(CursorContext);
    return (
        <>
            {(((isBottom && staffPosition >= 11) || (isTop && staffPosition < 0)) && (
                <LedgerLines maxExtent={staffPosition} x={cursor.x}/>
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
export type StemSide = Side;
