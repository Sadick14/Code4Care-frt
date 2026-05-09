import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import "./i18n/i18n"; // Initialize i18n
import { AppProvider } from "./providers/AppProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import App from "./App.tsx";
import AdminDashboardApp from "./AdminDashboardApp.tsx";
import { NotFoundPage } from "./components/NotFoundPage";
import "./index.css";

registerSW({
  immediate: true,
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* User App */}
        <Route
          path="/"
          element={
            <AppProvider>
              <LanguageProvider>
                <App />
              </LanguageProvider>
            </AppProvider>
          }
        />

        {/* Admin Dashboard - Completely Separate */}
        <Route
          path="/dashboard/*"
          element={
            <AppProvider>
              <LanguageProvider>
                <AdminDashboardApp />
              </LanguageProvider>
            </AppProvider>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);