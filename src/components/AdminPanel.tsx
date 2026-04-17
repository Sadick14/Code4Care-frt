import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboard } from './EnhancedAdminDashboard';
import { AdminUserManagement } from './AdminUserManagement';
import { AdminContentManagement } from './AdminContentManagement';
import { AdminSafetyManagement } from './AdminSafetyManagement';
import { AdminSystemHealth } from './AdminSystemHealth';
import { BarChart3, FileText } from 'lucide-react';

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
        return (
          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">Reports</h1>
              <p className="text-slate-400">Generate and view comprehensive reports</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { title: 'Monthly Activity Report', icon: <BarChart3 className="w-8 h-8" /> },
                { title: 'User Demographics Report', icon: <BarChart3 className="w-8 h-8" /> },
                { title: 'Safety Incidents Report', icon: <BarChart3 className="w-8 h-8" /> },
              ].map((report, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                >
                  <div className="text-white mb-3">{report.icon}</div>
                  <h3 className="font-semibold text-white mb-2">{report.title}</h3>
                  <p className="text-blue-100 text-sm">Click to generate</p>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6 p-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white">Configuration</h1>
              <p className="text-slate-400">System settings and preferences</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-slate-400">
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
