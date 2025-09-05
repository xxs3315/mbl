import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { ThemeProvider } from "./providers/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
