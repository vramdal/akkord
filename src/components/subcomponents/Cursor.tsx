import React, { Context, useContext } from "react";

export const CursorContext: Context<{x: number}> = React.createContext({x: 0});
export const Cursor = (props: { x: number, children: any }) => {
    const currentCursorPos = useContext(CursorContext).x;
    return <CursorContext.Provider value={{x: props.x + currentCursorPos}}>
        {props.children}
    </CursorContext.Provider>;
  }
;
