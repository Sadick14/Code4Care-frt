import React, { createContext, useContext, useState, useEffect } from 'react';
import { safeStorage } from '@/utils/safeStorage';
import { logger } from '@/utils/logger';

interface AppState {
  nickname: string | undefined;
  botName: string;
  sessionDuration: string;
  analyticsOptIn: boolean;
  sessionId: string;
  hasSeenOnboarding: boolean;
  consultantMode: boolean;
}

interface AppContextType extends AppState {
  setNickname: (name: string | undefined) => void;
  setBotName: (name: string) => void;
  setSessionDuration: (duration: string) => void;
  setAnalyticsOptIn: (optIn: boolean) => void;
  setSessionId: (id: string) => void;
  setHasSeenOnboarding: (seen: boolean) => void;
  setConsultantMode: (active: boolean) => void;
  resetAll: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nickname, setNickname] = useState<string | undefined>(() => safeStorage.getItem('room1221_nickname') || undefined);
  const [botName, setBotName] = useState<string>(() => safeStorage.getItem('room1221_botname') || 'Room 1221');
  const [sessionDuration, setSessionDuration] = useState<string>(() => safeStorage.getItem('room1221_duration') || '24h');
  const [analyticsOptIn, setAnalyticsOptIn] = useState<boolean>(() => safeStorage.getItem('room1221_analytics') !== 'false');
  const [sessionId, setSessionId] = useState<string>(() => Date.now().toString());
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(() => safeStorage.getItem('room1221_onboarding_complete') === 'true');
  const [consultantMode, setConsultantMode] = useState<boolean>(false);

  // Persistence effects
  useEffect(() => {
    if (nickname) safeStorage.setItem('room1221_nickname', nickname);
    else safeStorage.removeItem('room1221_nickname');
  }, [nickname]);

  useEffect(() => {
    safeStorage.setItem('room1221_botname', botName);
  }, [botName]);

  useEffect(() => {
    safeStorage.setItem('room1221_duration', sessionDuration);
  }, [sessionDuration]);

  useEffect(() => {
    safeStorage.setItem('room1221_analytics', analyticsOptIn.toString());
  }, [analyticsOptIn]);

  useEffect(() => {
    safeStorage.setItem('room1221_onboarding_complete', hasSeenOnboarding.toString());
  }, [hasSeenOnboarding]);

  const resetAll = () => {
    logger.info('Resetting all app state...');
    safeStorage.removeItem('room1221_nickname');
    safeStorage.removeItem('room1221_botname');
    safeStorage.removeItem('room1221_language');
    safeStorage.removeItem('room1221_duration');
    safeStorage.removeItem('room1221_analytics');
    safeStorage.removeItem('room1221_sessions');
    safeStorage.removeItem('room1221_panic_triggered');
    safeStorage.removeItem('room1221_onboarding_complete');
    
    setNickname(undefined);
    setBotName('Room 1221');
    setSessionDuration('24h');
    setAnalyticsOptIn(true);
    setSessionId(Date.now().toString());
    setHasSeenOnboarding(false);
    setConsultantMode(false);
  };

  const value = {
    nickname, setNickname,
    botName, setBotName,
    sessionDuration, setSessionDuration,
    analyticsOptIn, setAnalyticsOptIn,
    sessionId, setSessionId,
    hasSeenOnboarding, setHasSeenOnboarding,
    consultantMode, setConsultantMode,
    resetAll
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
