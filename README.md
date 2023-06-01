# use-context-selector-v2

This package provides an exact replica of `useSelector` in Redux for React context. It allows you to avoid unnecessary re-renders by selectively watching only the imported state from the context.

## Installation

Before using this context, make sure you have the `use-context-selector-v2` package installed in your project. You can install it by running the following command:

```bash
npm install use-context-selector-v2
```

## Usage

To create and use the context in your React application, follow these steps:

1.  Import the necessary dependencies:

    ```js
    import React, { useState } from "react";
    import { createContext } from "use-context-selector-v2";
    ```

2.  Create the context:

    ```js
    export const Context = createContext(context);
    ```

3.  Create a provider component:

    ```js
    export function ContextProvider(props) {
      const [count, setCount] = useState(0);
      const [text, setText] = useState("");

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
    ```

4.  Wrap your application with the provider component:

    ```js
    function App() {
      return (
        <ContextProvider>
          <ComponentA />
          <ComponentB />
        </ContextProvider>
      );
    }
    export default App;
    ```

5.  Use the context in your components:

    ```js
    import React, { memo } from "react";
    import { useContextSelector } from "use-context-selector-v2";
    import { Context } from "../../context";

    export default memo(
    function ComponentA() {
     const { count, setCount } = useContextSelector(Context, [
       "count",
       "setCount",
     ]);

     return (
         <div>
          <br />
          <br />
          <div>This is Component A: {(Math.random() * 10000).toFixed(0)}</div>
          <div>Count: {count}</div>
          <onClick={() => setCount(count + 1)}>Increment</button>
          <br />
          <br />
         </div>
       );
     },
     () => true
    );
    ```

6.  Use the context in your components:

    ```js
    import React, { memo } from "react";
    import { useContextSelector } from "use-context-selector-v2";
    import { Context } from "../../context";

    export default memo(
      function ComponentB() {
        const { text, setText } = useContextSelector(Context, (_) => ({
          // redux pattern
          text: _.text,
          setText: _.setText,
        }));

        return (
          <div>
            <div>This is Component B: {(Math.random() * 10000).toFixed(0)}</div>
            <div>Text: {text}</div>
            <input value={text} onChange={(e) => setText(e.target.value)} />
          </div>
        );
      },
      () => true
    );
    ```

## Repository

This package is hosted on GitHub. You can find the repository at [https://github.com/HussnainQuresshi/use-context-selector](https://github.com/HussnainQuresshi/use-context-selector).

Feel free to explore the repository to find more information, contribute, or report any issues you encounter.

## Acknowledgements

This package was created with the help and inspiration from the article ["Use Context Selector Demystified"](https://dev.to/romaintrotard/use-context-selector-demystified-4f8e) by Romain Trotard. The article provides valuable insights into the usage of `use-context-selector` and served as a reference during the development of this package. I would like to express my gratitude to Romain Trotard for sharing their knowledge and contributing to the community.
