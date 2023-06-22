/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { createContextHook } from "use-context-hook";

const context = {};

export const Context = createContextHook(context);

export function ContextProvider(props) {
  const [count, setCount] = useState(1);
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
