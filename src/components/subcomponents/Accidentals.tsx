import {PositionInStaff, positionInStaffToY} from "./Utils";
import {Accidental} from "../../domain/Types";
import React, {useContext} from "react";
import {CursorContext} from "./Cursor";

export interface AccidentalProps {
    staffPosition: PositionInStaff;
    accidental: Accidental
    column: number;
    strKey: string;
};

const AccidentalUse = ({staffPosition, column, symbolId}: AccidentalProps & {symbolId: string})  => {
    const cursor = useContext(CursorContext);
    const startY = positionInStaffToY(staffPosition - 1);
    const xOffset = (30 * column);
    return <use xlinkHref={`#${symbolId}`} x={cursor.x + xOffset} y={startY} />
};

export const Sharp = (props: AccidentalProps) => {
    return <AccidentalUse {...props} symbolId={"sharp"}/>
};

export const Flat = (props: AccidentalProps) => {
    return <AccidentalUse {...props} symbolId={"flat"}/>
};