import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboard } from './EnhancedAdminDashboard';
import { AdminUserManagement } from './AdminUserManagement';
import { AdminContentManagement } from './AdminContentManagement';
import { AdminSafetyManagement } from './AdminSafetyManagement';
import { AdminSystemHealth } from './AdminSystemHealth';
import { AdminReports } from './AdminReports';

type AdminSection = 'dashboard' | 'users' | 'content' | 'safety' | 'reports' | 'settings' | 'health';

interface AdminPanelProps {
  selectedLanguage: string;
  onLogout: () => void;
}

export function AdminPanel({ selectedLanguage, onLogout }: AdminPanelProps) {
  const [currentSection, setCurrentSection] = useState<AdminSection>('dashboard');

  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return <AdminDashboard selectedLanguage={selectedLanguage} />;
      case 'users':
        return <AdminUserManagement selectedLanguage={selectedLanguage} />;
      case 'content':
        return <AdminContentManagement selectedLanguage={selectedLanguage} />;
      case 'safety':
        return <AdminSafetyManagement selectedLanguage={selectedLanguage} />;
      case 'health':
        return <AdminSystemHealth selectedLanguage={selectedLanguage} />;
      case 'reports':
        return <AdminReports selectedLanguage={selectedLanguage} />;
      case 'settings':
        return (
          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Configuration</h1>
              <p className="text-gray-500">System settings and preferences</p>
            </div>
            <div className="bg-white border border-[#E8ECFF] rounded-lg p-6 text-gray-500">
              <p>Configuration panel coming soon...</p>
            </div>
          </div>
        );
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
