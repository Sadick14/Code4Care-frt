import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";
import { AdminPanel } from "./components/AdminPanel";
import { AdminDashboardLogin } from "./components/AdminDashboardLogin";
import { ErrorBoundary } from "./components/ErrorBoundary";

function AdminDashboardAppContent() {
  const { i18n } = useTranslation();
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if admin session exists on mount
  useEffect(() => {
    const adminSession = localStorage.getItem('admin_session_token');
    if (adminSession) {
      setAdminLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleAdminLogin = () => {
    localStorage.setItem('admin_session_token', Date.now().toString());
    setAdminLoggedIn(true);
    toast.success('Admin access granted');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_session_token');
    setAdminLoggedIn(false);
    toast.success('Admin session ended');
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!adminLoggedIn) {
    return <AdminDashboardLogin onAdminLogin={handleAdminLogin} />;
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{ className: 'rounded-2xl' }} />
      <AdminPanel
        selectedLanguage={i18n.resolvedLanguage?.split('-')[0] || 'en'}
        onLogout={handleAdminLogout}
      />
    </>
  );
}

export default function AdminDashboardApp() {
  return (
    <ErrorBoundary>
      <AdminDashboardAppContent />
    </ErrorBoundary>
  );
}
