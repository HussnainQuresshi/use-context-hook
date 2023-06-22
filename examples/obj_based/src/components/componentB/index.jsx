import React from "react";
import { useContextHook } from "use-context-hook";
import { Context } from "../../context";

export default function ComponentB() {
  const { text, setText } = useContextHook(Context, {
    text: 1,
    setText: 1,
  });

  return (
    <div>
      <div>This is Component B :{(Math.random() * 10000).toFixed(0)}</div>
      <div>Text: {text}</div>
      <br />
      <br />
      <input
        className="input"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
