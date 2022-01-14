import {PositionInStaff, positionInStaffToY} from "./Utils";
import {Accidental} from "../../domain/Types";
import React, {Context, useContext, useMemo} from "react";
import {CursorContext} from "./Cursor";
import { PreferredAccidentalsMap, ScrollTarget, ToneInfo } from "./Types";
import {toneInfoAccidentalTranslator} from "../../domain/Functions";

export interface AccidentalProps extends ScrollTarget {
    staffPosition: PositionInStaff;
    accidental: Accidental
    column: number;
    strKey: string;
}

const AccidentalUse = ({staffPosition, column, symbolId, scrollTargetGroup}: AccidentalProps & {symbolId: string})  => {
    const cursor = useContext(CursorContext);
    const startY = positionInStaffToY(staffPosition - 1);
    const xOffset = (30 * column);
    return <use xlinkHref={`#${symbolId}`} x={cursor.x + xOffset} y={startY} data-scrolltargetgroup={scrollTargetGroup}/>
};

export const Sharp = (props: AccidentalProps) => {
    return <AccidentalUse {...props} symbolId={"sharp"}/>
};

export const Flat = (props: AccidentalProps) => {
    return <AccidentalUse {...props} symbolId={"flat"}/>
};

type ToneInfoTranslator = (tone: ToneInfo) => ToneInfo;

export const PreferredAccidentalsContext : Context<{replacer: ToneInfoTranslator}> = React.createContext({replacer: (_: any) => _});

export const PreferredAccidentalsContextProvider = (props: {preferredAccidentals: PreferredAccidentalsMap, children?: any}) => {
    const replacer = useMemo<ToneInfoTranslator>(() => toneInfoAccidentalTranslator(props.preferredAccidentals), [props.preferredAccidentals]);
    return <PreferredAccidentalsContext.Provider value={{replacer}}>
            {props.children}
        </PreferredAccidentalsContext.Provider>;
    }
;
