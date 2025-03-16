export const initialFiles = {
  "/App.js": `import React, { useState } from 'react';
import './styles.css';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <h1>React Code Editor</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
        <p>
          Edit <code>App.js</code> and save to test
        </p>
      </div>
    </div>
  );
}
`,
  "/styles.css": `* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
}

.App {
  text-align: center;
  padding: 2rem;
}

h1 {
  margin-bottom: 1rem;
}

.card {
  padding: 2rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  max-width: 500px;
}

button {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  background-color: #0070f3;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #0051a2;
}

code {
  background-color: #eaeaea;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: monospace;
}
`,
  "/index.js": `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
`,
};
