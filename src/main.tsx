import React from "react";
import { createRoot } from "react-dom/client";
import "./i18n/i18n"; // Initialize i18n
import { AppProvider } from "./providers/AppProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </AppProvider>
  </React.StrictMode>
);