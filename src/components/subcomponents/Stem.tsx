import {PositionInStaff, positionInStaffToY} from "./Utils";
import React, {useContext} from "react";
import {NoteValue} from "../../domain/Types";
import {CursorContext} from "./Cursor";
import { ScrollTarget } from "./Types";

interface StemProps extends ScrollTarget {
    sortedNotePositions: Array<PositionInStaff>,
    noteValue: NoteValue;
}

export const Stem = ({sortedNotePositions, scrollTargetGroup}: StemProps) => {
    const topNotePosition = sortedNotePositions[0];
    const bottomNotePosition = sortedNotePositions[sortedNotePositions.length - 1];
    const stemDirection: "up" | "down" = (bottomNotePosition > 5 && bottomNotePosition < 14) ? "up" : "down";
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
            className={"stem__line"}
            data-scrolltargetgroup={scrollTargetGroup}
        />
    );
};
