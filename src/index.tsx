import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import DataStateProvider from "./components/context/DataStateProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <DataStateProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </DataStateProvider>
);

reportWebVitals();
