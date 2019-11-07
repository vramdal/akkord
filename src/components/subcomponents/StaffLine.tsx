import {PositionInStaff, positionInStaffToY} from "./Utils";
import React from "react";

interface StaffLineProps {
    position: PositionInStaff;
    width: number;
    x: number;
}

export const StaffLine = (props: StaffLineProps) => (
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