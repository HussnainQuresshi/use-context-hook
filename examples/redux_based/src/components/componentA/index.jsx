import React from "react";
import { useContextSelector } from "use-context-selector-v2";
import { Context } from "../../context";

export default function ComponentA() {
  const { count, setCount } = useContextSelector(Context, (v) => ({
    count: v.count,
    setCount: v.setCount,
  }));
  return (
    <div>
      <div>This is Component A :{(Math.random() * 10000).toFixed(0)}</div>
      <div>Count: {count}</div>
      <br />
      <br />
      <button className="button" onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
