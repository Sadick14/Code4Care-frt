import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, MessageSquare, BookOpen, Brain, Building2, Pill, Settings, Trash2, LogOut, Globe, X, Sparkles } from "lucide-react";
import { useApp } from '@/providers/AppProvider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { motion } from "motion/react";

interface SidebarProps {
  currentSection: string;
  setCurrentSection: (section: any) => void;
  onClose?: () => void;
  onClearChat: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentSection, 
  setCurrentSection, 
  onClose,
  onClearChat,
  onLogout
}) => {
  const { t, i18n } = useTranslation();
  const { botName } = useApp();

  const navigationItems = [
    { id: 'chat', label: t('nav.chat'), icon: MessageSquare },
    { id: 'story', label: t('nav.story'), icon: BookOpen },
    { id: 'myths', label: t('nav.myths'), icon: Brain },
    { id: 'support', label: t('nav.support'), icon: Building2 },
    { id: 'pharmacy', label: t('nav.pharmacy'), icon: Pill },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'twi', label: 'Twi' },
    { code: 'ewe', label: 'Ewe' },
    { code: 'ga', label: 'Ga' }
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-100 shadow-xl overflow-hidden">
      {/* Premium Header */}
      <div className="relative p-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600 to-indigo-700 -z-10" />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
               <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
               <h2 className="text-white font-bold text-lg leading-tight">{botName}</h2>
               <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Encrypted</span>
               </div>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-xl" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-3">
              {t('nav.navigation', 'Main Navigation')}
            </h3>
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setCurrentSection(item.id); onClose?.(); }}
                    className={`w-full group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                      isActive ? 'text-white' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 -z-10 shadow-lg shadow-blue-100"
                      />
                    )}
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:translate-x-1'}`} />
                    <span className="font-semibold text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <Separator className="bg-slate-100" />

          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-3">
              {t('common.actions', 'Privacy & Data')}
            </h3>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start rounded-2xl h-12 text-slate-600 hover:bg-red-50 hover:text-red-500 group" 
                onClick={onClearChat}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-red-100 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </div>
                {t('common.clearChat', 'Clear Conversation')}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start rounded-2xl h-12 text-slate-600 hover:bg-red-50 hover:text-red-500 group" 
                onClick={onLogout}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover:bg-red-100 transition-colors">
                  <LogOut className="w-4 h-4" />
                </div>
                {t('common.logout', 'End Session')}
              </Button>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          <div className="pb-8">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 px-3 flex items-center gap-2">
              <Globe className="w-3 h-3" />
              {t('settings.language')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    i18n.language === lang.code 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                      : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200 hover:bg-blue-50/50'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer Branding */}
      <div className="p-6 bg-slate-50 mt-auto">
         <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-blue-500" />
            Powered by PPAG
         </div>
      </div>
    </div>
  );
};
