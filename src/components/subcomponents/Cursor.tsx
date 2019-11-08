import React, {Context} from "react";

export const CursorContext: Context<{x: number}> = React.createContext({x: 0});
export const Cursor = (props: { x: number, children: any }) =>
    <CursorContext.Provider value={{x: props.x}}>
        {props.children}
    </CursorContext.Provider>
;