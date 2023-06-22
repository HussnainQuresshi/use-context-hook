import React from "react";
import { useContextHook } from "use-context-hook";
import { Context } from "../../context";

export default function ComponentA() {
  const { count, setCount } = useContextHook(Context, {
    count: 1,
    setCount: 1,
  });
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
