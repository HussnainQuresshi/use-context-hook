import React from "react";
import { useContextSelector } from "use-context-selector-v2";
import { Context } from "../../context";

export default function ComponentB() {
  const { text, setText } = useContextSelector(Context, (v) => ({
    text: v.text,
    setText: v.setText,
  }));
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
