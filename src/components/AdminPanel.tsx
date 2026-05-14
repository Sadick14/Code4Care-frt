import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AdminSidebar, AdminSection } from './AdminSidebar';
import { OverviewPage } from './admin/OverviewPage';
import { UsersSessionsPage } from './admin/UsersSessionsPage';
import { ConversationsPage } from './admin/ConversationsPage';
import { SafetyCrisisPage } from './admin/SafetyCrisisPage';
import { FeatureEngagementPage } from './admin/FeatureEngagementPage';
import { SupportPage } from './admin/SupportPage';
import { KnowledgeBasePage } from './admin/KnowledgeBasePage';
import { AdminAuditPage } from './admin/AdminAuditPage';
import { AdminManagementPage } from './admin/AdminManagementPage';
import { StaffSession } from '@/services/staffAccessService';

interface AdminPanelProps {
  selectedLanguage: string;
  onLogout: () => void;
  session: StaffSession;
}

export function AdminPanel({ selectedLanguage, onLogout, session }: AdminPanelProps) {
  const [currentSection, setCurrentSection] = useState<AdminSection>('overview');

  const renderContent = () => {
    switch (currentSection) {
      case 'overview':      return <OverviewPage session={session} />;
      case 'users':         return <UsersSessionsPage session={session} />;
      case 'conversations': return <ConversationsPage session={session} />;
      case 'safety':        return <SafetyCrisisPage session={session} />;
      case 'audit':           return <AdminAuditPage session={session} />;
      case 'admin-accounts':  return <AdminManagementPage session={session} />;
      default:                return <OverviewPage session={session} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[260px] flex-shrink-0 border-r border-[#E8ECFF] bg-white overflow-y-auto">
        <AdminSidebar
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          onLogout={onLogout}
          isMobile={false}
          role={session.role}
        />
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
