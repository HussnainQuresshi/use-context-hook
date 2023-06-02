/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { createContext } from "use-context-selector-v2";

const context = {};

export const Context = createContext(context);

export function ContextProvider(props) {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("hello world");
  return (
    <Context.Provider
      value={{
        count,
        setCount,
        text,
        setText,
      }}
    >
      {props.children}
    </Context.Provider>
  );
}
