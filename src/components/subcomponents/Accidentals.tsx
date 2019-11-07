import {PositionInStaff, positionInStaffToY} from "./Utils";
import {Accidental} from "../../domain/Types";
import React, {useContext} from "react";
import {CursorContext} from "./Cursor";

export interface AccidentalProps {
    staffPosition: PositionInStaff;
    accidental: Accidental
    isTop: boolean;
    isBottom: boolean;
    column: number;
    strKey: string;
}

export const Sharp = ({staffPosition, column}: AccidentalProps) => {
    const cursor = useContext(CursorContext);
    const startY = positionInStaffToY(staffPosition - 1);
    // const endY = positionInStaffToY(staffPosition + 2);
    const xOffset = (30 * column);
    // const length = endY - startY - 3;
    return <use xlinkHref="#sharp" x={cursor.x + xOffset} y={startY}/>
};