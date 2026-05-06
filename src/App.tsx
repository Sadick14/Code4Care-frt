import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { Sheet, SheetContent } from "./components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./components/ui/alert-dialog";
import { motion, AnimatePresence } from "motion/react";

import { useApp } from "@/providers/AppProvider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ChatInterface } from "./components/ChatInterface";
import { StoryMode } from "./components/StoryMode";
import { MythBusters } from "./components/MythBusters";
import { SupportAndClinics } from "./components/SupportAndClinics";
import { Pharmacy } from "./components/Pharmacy";
import { SettingsPage } from "./components/SettingsPage";
import { PanicScreen } from "./components/PanicScreen";
import { NicknameModal } from "./components/NicknameModal";
import { FollowUpId } from "./components/FollowUpId";
import OnboardingScreen from "./components/OnboardingScreen";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { UserEngagementService } from "@/services/userEngagementService";

type Section = "chat" | "story" | "myths" | "support" | "pharmacy" | "settings";

function AppContent() {
  const { t, i18n } = useTranslation();
  const { 
    hasSeenOnboarding, setHasSeenOnboarding,
    nickname, setNickname,
    setBotName,
    setAgeRange,
    setGenderIdentity,
    setRegion,
    sessionId, setSessionId,
    resetAll,
    consultantMode,
    setConsultantMode
  } = useApp();

  const [currentSection, setCurrentSection] = useState<Section>("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPanicScreen, setShowPanicScreen] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(!nickname);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [clearChatTrigger, setClearChatTrigger] = useState(0);
  const sessionStartedAtRef = useRef(Date.now());
  const sessionEndedRef = useRef(false);

  // Sync nickname modal visibility with global state
  useEffect(() => {
    setShowNicknameModal(!nickname && hasSeenOnboarding);
  }, [nickname, hasSeenOnboarding]);

  useEffect(() => {
    if (!hasSeenOnboarding) {
      return;
    }

    sessionStartedAtRef.current = Date.now();
    sessionEndedRef.current = false;
    UserEngagementService.logNonBlocking(
      UserEngagementService.trackSession(
        UserEngagementService.buildSessionPayload(sessionId, 'continue', true),
      ),
      'Failed to track session continue event',
    );

    return () => {
      if (sessionEndedRef.current) {
        return;
      }

      sessionEndedRef.current = true;
      const durationSeconds = Math.max(0, Math.round((Date.now() - sessionStartedAtRef.current) / 1000));
      UserEngagementService.logNonBlocking(
        UserEngagementService.trackSession(
          UserEngagementService.buildSessionPayload(sessionId, 'end', true, durationSeconds),
        ),
        'Failed to track session end event',
      );
    };
  }, [hasSeenOnboarding, sessionId]);

  const handleClearChat = () => {
    localStorage.removeItem(`room1221_chat_${sessionId}`);
    setSessionId(Date.now().toString());
    setClearChatTrigger(prev => prev + 1);
    setShowClearDialog(false);
    toast.success(t('chat.clearChatMsg', 'Chat history cleared'));
  };

  const handleLogout = () => {
    sessionEndedRef.current = true;
    const durationSeconds = Math.max(0, Math.round((Date.now() - sessionStartedAtRef.current) / 1000));
    UserEngagementService.logNonBlocking(
      UserEngagementService.trackSession(
        UserEngagementService.buildSessionPayload(sessionId, 'end', hasSeenOnboarding, durationSeconds),
      ),
      'Failed to track session logout event',
    );
    resetAll();
    setShowLogoutDialog(false);
    setCurrentSection("chat");
    toast.success(t('chat.logoutSuccess', 'Logged out successfully'));
  };

  if (!hasSeenOnboarding) {
    return (
      <OnboardingScreen
        onComplete={({ botName: nextBotName, ageRange: nextAgeRange, genderIdentity: nextGenderIdentity, region: nextRegion }) => {
          const languageCode = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];
          setBotName(nextBotName);
          setAgeRange(nextAgeRange);
          setGenderIdentity(nextGenderIdentity);
          setRegion(nextRegion);
          setHasSeenOnboarding(true);
          UserEngagementService.logNonBlocking(
            UserEngagementService.captureDemographics({
              session_id: sessionId,
              bot_name: nextBotName,
              age_range: nextAgeRange,
              gender_identity: nextGenderIdentity,
              region: nextRegion,
              language: languageCode,
            }),
            'Failed to capture onboarding demographics',
          );
          UserEngagementService.logNonBlocking(
            UserEngagementService.updateUserSettings({
              session_id: sessionId,
              nickname: nickname || '',
              language: languageCode,
              chat_retention: '24h',
              analytics_consent: true,
              consultant_mode_enabled: consultantMode,
            }),
            'Failed to initialize user settings',
          );
        }}
      />
    );
  }

  if (showPanicScreen) {
    return <PanicScreen onExit={() => setShowPanicScreen(false)} />;
  }

  return (
    <div className="flex h-[100dvh] lg:h-screen overflow-hidden bg-white">
      <Toaster position="top-center" toastOptions={{ className: 'rounded-2xl' }} />
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] flex-shrink-0">
        <Sidebar 
          currentSection={currentSection} 
          setCurrentSection={setCurrentSection}
          onClearChat={() => setShowClearDialog(true)}
          onLogout={() => setShowLogoutDialog(true)}
        />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[300px]">
          <Sidebar 
            currentSection={currentSection} 
            setCurrentSection={setCurrentSection}
            onClose={() => setSidebarOpen(false)}
            onClearChat={() => setShowClearDialog(true)}
            onLogout={() => setShowLogoutDialog(true)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-[100dvh] lg:h-screen overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          onPanicClick={() => setShowPanicScreen(true)}
          onFollowUpClick={() => setShowFollowUpModal(true)}
        />

        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {currentSection === "chat" && (
                <ChatInterface 
                  onRequestFollowUpId={() => setShowFollowUpModal(true)}
                  clearTrigger={clearChatTrigger}
                />
              )}
              {currentSection === "story" && <StoryMode />}
              {currentSection === "myths" && <MythBusters />}
              {currentSection === "support" && <SupportAndClinics />}
              {currentSection === "pharmacy" && <Pharmacy />}
              {currentSection === "settings" && (
                <SettingsPage
                  onClearChat={() => setShowClearDialog(true)}
                  onLogout={() => setShowLogoutDialog(true)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modals & Dialogs */}
      <NicknameModal 
        isOpen={showNicknameModal} 
        onClose={() => setShowNicknameModal(false)}
        onSubmit={(name) => { setNickname(name); setShowNicknameModal(false); }}
      />
      
      <FollowUpId isOpen={showFollowUpModal} onClose={() => setShowFollowUpModal(false)} />

      {/* Clear Chat Confirmation */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('chat.clearChat')}</AlertDialogTitle>
            <AlertDialogDescription>{t('chat.clearChatDesc', 'Are you sure? This will delete all messages in this session.')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearChat} className="rounded-xl bg-red-600 focus:ring-red-600">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Confirmation */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('chat.logoutTitle')}</AlertDialogTitle>
            <AlertDialogDescription>{t('chat.logoutDesc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="rounded-xl bg-red-600">
              {t('chat.logoutConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}