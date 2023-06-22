import React, { StrictMode, useRef } from "react";
import { render, fireEvent, cleanup, screen } from "@testing-library/react";
import { createContext, useContextHook } from "../dist";

describe("multiple str", () => {
  afterEach(cleanup);
  it("should not re-render componentB", () => {
    const Context = createContext();
    const ComponentA = () => {
      const { count1, setCount1, complexObj } = useContextHook(Context, [
        "count1",
        "setCount1",
        "complexObj",
      ]);
      const renderCount = useRef(0);
      renderCount.current += 1;
      return (
        <div>
          <span>count1: {count1}</span>
          <button type="button" onClick={() => setCount1(count1 + 1)}>
            +1
          </button>
          <span>{renderCount.current}</span>
        </div>
      );
    };
    const ComponentB = () => {
      const { count2, complexObj } = useContextHook(Context, [
        "count2",
        "complexObj",
      ]);
      const renderCount = useRef(0);
      renderCount.current += 1;
      return (
        <div>
          <span>count2: {count2}</span>
          <span data-testid="counter2">{renderCount.current}</span>
        </div>
      );
    };
    const StateProvider = ({ children }) => {
      const [count1, setCount1] = React.useState(0);
      const [count2, setCount2] = React.useState(0);
      return (
        <Context.Provider
          value={{
            count1,
            count2,
            setCount1,
            setCount2,
            complexObj: {
              a: {
                b: {
                  c: {
                    d: {
                      e: {
                        f: {
                          g: {
                            h: {
                              i: {
                                j: {
                                  k: {
                                    l: {
                                      m: {
                                        n: {
                                          o: {
                                            p: {
                                              q: {
                                                r: {
                                                  s: {
                                                    t: {
                                                      u: {
                                                        v: {
                                                          w: {
                                                            x: { y: { z: 0 } },
                                                          },
                                                        },
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          }}
        >
          {children}
        </Context.Provider>
      );
    };
    const App = () => (
      <StrictMode>
        <StateProvider>
          <ComponentA />
          <ComponentB />
        </StateProvider>
      </StrictMode>
    );
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("counter2").textContent).toEqual("1");
    expect(container).toMatchSnapshot();
  });
});
