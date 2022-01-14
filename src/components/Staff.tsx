import React from "react";
import {cluster, LINE_HEIGHT} from "./subcomponents/Utils";
import {StaffLine} from "./subcomponents/StaffLine";
import {LedgerLines, Note} from "./subcomponents/Note";
import {PreferredAccidentalsMap, Side} from "./subcomponents/Types";
import {Cursor} from "./subcomponents/Cursor";
import {PreferredAccidentalsContextProvider} from "./subcomponents/Accidentals";


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

const SharpSymbolDefinition = ({lineHeight} : {lineHeight: number}) => <symbol id={"sharp"} width={40} height={lineHeight * 2.5}
                                                                               viewBox={`0 0 10 20`}>
    <g className={"sharp"} stroke="white" strokeWidth={2.5}>
        <line x1={2} x2={2} y1={1} y2={20} strokeWidth={1.5}/>
        <line x1={8} x2={8} y1={0} y2={19} strokeWidth={1.5}/>
        <line x1={0} x2={10} y1={6} y2={3} strokeWidth={3.5}/>
        <line x1={0} x2={10} y1={16} y2={13} strokeWidth={3.5}/>
    </g>
</symbol>;

const FlatSymbolDefinition = ({lineHeight} : {lineHeight: number}) => <symbol id={"flat"} width={40} height={lineHeight * 2.5} viewBox={`5 0 10 20`}>
    <text
        x={0}
        y={20}
        lengthAdjust={"spacingAndGlyphs"}
        textLength={20}
        color={"white"}
        style={{font: "bold 30px sans-serif", fill: "white"}}
        strokeWidth={1.5}>♭</text>
</symbol>;

interface StaffProps {
    children?: any,
    preferredAccidentals?: PreferredAccidentalsMap
}

export default (props: StaffProps) => {
    const staffWidth = (React.Children.count(props.children) * 150 + 100) || 0;
    return (
        <div className={"staff"} style={{"overflowX": "scroll", "width": "100%"}}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width={staffWidth}
                height={"300"}
                className={"staff"}
            >
                <HollowNoteHeadMask direction={Side.LEFT}/>
                <HollowNoteHeadMask direction={Side.RIGHT}/>
                <SharpSymbolDefinition lineHeight={LINE_HEIGHT}/>
                <FlatSymbolDefinition lineHeight={LINE_HEIGHT}/>


                <PreferredAccidentalsContextProvider preferredAccidentals={props.preferredAccidentals || {}}>

                    {[1, 3, 5, 7, 9].map(lineIdx => (
                        <StaffLine key={lineIdx} position={lineIdx} width={staffWidth}/>
                    ))}
                    {React.Children.map(props.children, (child, idx) =>
                        <Cursor x={idx * 100} key={`child-${idx}`}>
                            {child}
                        </Cursor>
                    )}
                </PreferredAccidentalsContextProvider>
            </svg>
        </div>
    );
};

export const _testing = { Note, LedgerLines, cluster };
