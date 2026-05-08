import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboard } from './EnhancedAdminDashboard';
import { AdminUserManagement } from './AdminUserManagement';
import { AdminSafetyManagement } from './AdminSafetyManagement';
import { AdminSystemHealth } from './AdminSystemHealth';
import { AdminReports } from './AdminReports';
import { StaffSession } from '@/services/staffAccessService';

type AdminSection = 'dashboard' | 'users' | 'safety' | 'reports' | 'health';

interface AdminPanelProps {
  selectedLanguage: string;
  onLogout: () => void;
  session: StaffSession;
}

export function AdminPanel({ selectedLanguage, onLogout, session }: AdminPanelProps) {
  const [currentSection, setCurrentSection] = useState<AdminSection>('dashboard');

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <AdminDashboard selectedLanguage={selectedLanguage} session={session} />;
      case 'users':
        return <AdminUserManagement selectedLanguage={selectedLanguage} session={session} />;
      case 'safety':
        return <AdminSafetyManagement selectedLanguage={selectedLanguage} accessToken={session.accessToken} />;
      case 'health':
        return <AdminSystemHealth selectedLanguage={selectedLanguage} accessToken={session.accessToken} />;
      case 'reports':
        return <AdminReports selectedLanguage={selectedLanguage} accessToken={session.accessToken} />;
      default:
        return <AdminDashboard selectedLanguage={selectedLanguage} />;
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[280px] flex-shrink-0 border-r border-[#E8ECFF] bg-white overflow-y-auto">
        <AdminSidebar
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          onLogout={onLogout}
          isMobile={false}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
