import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import DataStateProvider from "./components/context/DataStateProvider";
import { ThemeProvider } from "@manish774/smarty-ui";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ThemeProvider>
    <DataStateProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </DataStateProvider>
  </ThemeProvider>
);

reportWebVitals();
