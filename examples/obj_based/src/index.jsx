import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ContextProvider } from "./context";
import ComponentA from "./components/componentA";
import ComponentB from "./components/componentB";

function App() {
  return (
    <StrictMode>
      <ContextProvider>
        <div className="App">
          <header className="container">
            <br />
            <br />
            <ComponentA />
            <br />
            <br />
            <ComponentB />
            <br />
            <br />
          </header>
        </div>
      </ContextProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById("root")).render(<App />);
