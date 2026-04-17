import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./i18n/i18n"; // Initialize i18n
import { AppProvider } from "./providers/AppProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import App from "./App.tsx";
import AdminDashboardApp from "./AdminDashboardApp.tsx";
import "./index.css";

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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);