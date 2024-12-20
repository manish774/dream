import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import DataStateProvider from "./components/context/DataStateProvider";
import { ThemeProvider } from "@manish774/smarty-ui";
import { FirebaseConfigContextProvider } from "./context/FirebaseConfigContext";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <FirebaseConfigContextProvider>
    <ThemeProvider>
      <DataStateProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </DataStateProvider>
    </ThemeProvider>
  </FirebaseConfigContextProvider>
);

reportWebVitals();
