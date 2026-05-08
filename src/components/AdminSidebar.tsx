import { BarChart3, Users, LogOut, X, AlertCircle, FileText, Database } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { motion } from 'motion/react';

type AdminSection = 'dashboard' | 'users' | 'safety' | 'reports' | 'health';

interface AdminSidebarProps {
  currentSection: AdminSection;
  setCurrentSection: (section: AdminSection) => void;
  onLogout: () => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({
  currentSection,
  setCurrentSection,
  onLogout,
  isMobile = false,
  onClose
}: AdminSidebarProps) {
  const navigationItems = [
    { id: 'dashboard' as AdminSection, label: 'Analytics Dashboard', icon: BarChart3, desc: 'View metrics & insights' },
    { id: 'users' as AdminSection, label: 'User Management', icon: Users, desc: 'Manage user accounts' },
    { id: 'safety' as AdminSection, label: 'Safety & Crisis', icon: AlertCircle, desc: 'Monitor incidents' },
    //{ id: 'reports' as AdminSection, label: 'Reports', icon: FileText, desc: 'Generate reports' },
    { id: 'health' as AdminSection, label: 'System Health', icon: Database, desc: 'Technical metrics' },
  ];

  return (
    <div className="flex flex-col h-full bg-white text-gray-900">
      {/* Header */}
      <div className="p-6 border-b border-[#E8ECFF]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight text-gray-900">Room 1221</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
          {isMobile && onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-gray-900">
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest px-3 mb-4">
            Management
          </div>

          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => {
                  setCurrentSection(item.id);
                  onClose?.();
                }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full group rounded-lg px-3 py-3 transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <div className="text-left flex-1">
                    <div className={`text-sm font-semibold ${isActive ? 'text-blue-600' : 'text-gray-700'}`}>
                      {item.label}
                    </div>
                    <div className={`text-[11px] ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                      {item.desc}
                    </div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="w-1.5 h-1.5 rounded-full bg-blue-600"
                    />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>

      <Separator className="bg-[#E8ECFF]" />

      {/* Footer */}
      <div className="p-4">
        <Button
          onClick={onLogout}
          className="w-full rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 gap-2 font-semibold"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
