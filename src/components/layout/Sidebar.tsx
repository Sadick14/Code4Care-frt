import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, BookOpen, Brain, Building2, Pill, Settings, Trash2, LogOut, Globe, X, Sparkles } from "lucide-react";
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

const CHATBOT_AVATAR_SRC = "/chatbot.jpg";

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
    <div className="flex flex-col h-full bg-gradient-to-b from-sidebar to-sidebar-accent/30 text-sidebar-foreground border-r border-sidebar-border shadow-xl overflow-hidden">
      {/* Premium Header */}
      <div className="relative isolate p-6 overflow-hidden">
        <div className="absolute inset-0 bg-[#0048ff]" />
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 overflow-hidden shadow-lg shadow-black/15">
              <img
                src={CHATBOT_AVATAR_SRC}
                alt={`${botName} avatar`}
                className="h-full w-full object-cover object-top"
              />
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
            <h3 className="text-[10px] font-bold text-sidebar-foreground/50 uppercase tracking-[0.2em] mb-4 px-3">
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
                    className={`w-full group z-0 flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden ${
                      isActive ? 'text-white shadow-lg shadow-blue-200/70' : 'text-sidebar-foreground/75 hover:bg-[#E8ECFF] hover:text-[#0048ff]'
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav"
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0048ff] to-[#0066ff]"
                      />
                    )}
                    <Icon className={`relative z-10 w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:translate-x-1'}`} />
                    <span className="relative z-10 font-semibold text-sm">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <Separator className="bg-sidebar-border" />

          <div>
            <h3 className="text-[10px] font-bold text-sidebar-foreground/50 uppercase tracking-[0.2em] mb-4 px-3">
              {t('common.actions', 'Privacy & Data')}
            </h3>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start rounded-2xl h-12 text-sidebar-foreground/75 hover:bg-red-50 hover:text-red-500 group" 
                onClick={onClearChat}
              >
                <div className="w-8 h-8 rounded-lg bg-sidebar-accent/60 flex items-center justify-center mr-3 group-hover:bg-red-100 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </div>
                {t('common.clearChat', 'Clear Conversation')}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start rounded-2xl h-12 text-sidebar-foreground/75 hover:bg-red-50 hover:text-red-500 group" 
                onClick={onLogout}
              >
                <div className="w-8 h-8 rounded-lg bg-sidebar-accent/60 flex items-center justify-center mr-3 group-hover:bg-red-100 transition-colors">
                  <LogOut className="w-4 h-4" />
                </div>
                {t('common.logout', 'End Session')}
              </Button>
            </div>
          </div>

          <Separator className="bg-sidebar-border" />

          <div className="pb-8">
            <h3 className="text-[10px] font-bold text-sidebar-foreground/50 uppercase tracking-[0.2em] mb-4 px-3 flex items-center gap-2">
              <Globe className="w-3 h-3" />
              {t('settings.language')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    i18n.resolvedLanguage?.split('-')[0] === lang.code
                      ? 'bg-gradient-to-r from-[#0048ff] to-[#0066ff] text-white border-[#0048ff] shadow-md shadow-blue-200/70' 
                      : 'bg-sidebar text-sidebar-foreground/70 border-sidebar-border hover:border-[#0048ff] hover:bg-[#E8ECFF] hover:text-[#0048ff]'
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
      <div className="p-6 bg-sidebar-accent/60 mt-auto border-t border-sidebar-border">
        <div className="flex items-center gap-2 text-sidebar-foreground/60 text-[10px] font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3 text-sidebar-primary" />
            Powered by PPAG
         </div>
      </div>
    </div>
  );
};
