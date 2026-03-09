import { useState, useEffect } from "react";
import { ChatInterface } from "./components/ChatInterface";
import { StoryMode } from "./components/StoryMode";
import { MythBusters } from "./components/MythBusters";
import { SupportAndClinics } from "./components/SupportAndClinics";
import { Pharmacy } from "./components/Pharmacy";
import { PanicButton } from "./components/PanicButton";
import { PanicScreen } from "./components/PanicScreen";
import { NicknameModal } from "./components/NicknameModal";
import { FollowUpId } from "./components/FollowUpId";
import OnboardingScreen from "./components/OnboardingScreen";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Shield, Menu, MessageSquare, BookOpen, Brain, Building2, Pill, Settings, Trash2, Clock, Globe, BarChart3, Edit2, Check, X, LogOut, AlertCircle, UserCheck } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "./components/ui/sheet";
import { ScrollArea } from "./components/ui/scroll-area";
import { Separator } from "./components/ui/separator";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";

type Section = "chat" | "story" | "myths" | "support" | "pharmacy" | "settings";

function AppContent() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(true);
  const [nickname, setNickname] = useState<string | undefined>();
  const [currentSection, setCurrentSection] = useState<Section>("chat");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [sessionDuration, setSessionDuration] = useState("24h");
  const [showPanicScreen, setShowPanicScreen] = useState(false);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [sessionId, setSessionId] = useState<string>(Date.now().toString());
  const [sessionTimer, setSessionTimer] = useState<Date | null>(null);
  const [clearChatTrigger, setClearChatTrigger] = useState(0); // Trigger chat clear
  // Desktop menu enhancement - default to open on desktop (ChatGPT-style behavior)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [analyticsOptIn, setAnalyticsOptIn] = useState(true);
  const [botName, setBotName] = useState("Room 1221");
  const [isEditingBotName, setIsEditingBotName] = useState(false);
  const [tempBotName, setTempBotName] = useState("");
  const [consultantMode, setConsultantMode] = useState(false);
  const [showConsultantDialog, setShowConsultantDialog] = useState(false);

  useEffect(() => {
    try {
      console.log('🔄 [APP] Loading initial data from localStorage...');
      
      // Check if user has seen onboarding
      const seenOnboarding = localStorage.getItem('room1221_onboarding_complete');
      
      if (seenOnboarding === 'true') {
        setHasSeenOnboarding(true);
        console.log('✅ [APP] User has seen onboarding');
      }
      
      // Load saved preferences (only on mount)
      const storedNickname = localStorage.getItem('room1221_nickname');
      const storedLanguage = localStorage.getItem('room1221_language');
      const storedDuration = localStorage.getItem('room1221_duration');
      const storedAnalytics = localStorage.getItem('room1221_analytics');
      const storedBotName = localStorage.getItem('room1221_botname');
      
      if (storedNickname) {
        setNickname(storedNickname);
        setShowNicknameModal(false);
        console.log('✅ [APP] Loaded nickname:', storedNickname);
      }
      if (storedLanguage) {
        setSelectedLanguage(storedLanguage);
        console.log('✅ [APP] Loaded language:', storedLanguage);
      }
      if (storedDuration) {
        setSessionDuration(storedDuration);
        console.log('✅ [APP] Loaded duration:', storedDuration);
      }
      if (storedAnalytics !== null) {
        setAnalyticsOptIn(storedAnalytics === 'true');
        console.log('✅ [APP] Loaded analytics opt-in:', storedAnalytics);
      }
      if (storedBotName) {
        setBotName(storedBotName);
        console.log('✅ [APP] Loaded bot name:', storedBotName);
      }

      setSessionTimer(new Date());
      console.log('✅ [APP] Initial data loaded successfully');
    } catch (error) {
      console.error('🔴 [APP] Error loading initial data from localStorage:', error);
      // Continue with default values
    }
  }, []); // Only run on mount

  // Desktop menu enhancement - Responsive sidebar behavior (ChatGPT-style)
  useEffect(() => {
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 1024; // lg breakpoint
      setIsDesktop(desktop);
      // On desktop, keep sidebar open by default; on mobile, keep it closed
      if (desktop && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Auto-delete handler based on session duration
    const checkInterval = setInterval(() => {
      const sessions = localStorage.getItem('room1221_sessions');
      if (!sessions) return;

      const parsed = JSON.parse(sessions);
      const now = new Date().getTime();
      
      Object.keys(parsed).forEach(key => {
        const session = parsed[key];
        const sessionTime = new Date(session.timestamp).getTime();
        let deleteAfter = 24 * 60 * 60 * 1000; // 24 hours default

        if (sessionDuration === '7d') {
          deleteAfter = 7 * 24 * 60 * 60 * 1000;
        } else if (sessionDuration === '30d') {
          deleteAfter = 30 * 24 * 60 * 60 * 1000;
        } else if (sessionDuration === '90d') {
          deleteAfter = 90 * 24 * 60 * 60 * 1000;
        }

        if (now - sessionTime > deleteAfter) {
          delete parsed[key];
        }
      });

      localStorage.setItem('room1221_sessions', JSON.stringify(parsed));
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [sessionDuration]);

  useEffect(() => {
    localStorage.setItem('room1221_language', selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    localStorage.setItem('room1221_duration', sessionDuration);
  }, [sessionDuration]);

  useEffect(() => {
    localStorage.setItem('room1221_analytics', analyticsOptIn.toString());
  }, [analyticsOptIn]);

  useEffect(() => {
    localStorage.setItem('room1221_botname', botName);
  }, [botName]);

  const handleOnboardingComplete = (selectedBotName: string) => {
    setBotName(selectedBotName);
    localStorage.setItem('room1221_botname', selectedBotName);
    localStorage.setItem('room1221_onboarding_complete', 'true');
    setHasSeenOnboarding(true);
  };

  const handleNicknameSubmit = (name: string) => {
    setNickname(name);
    localStorage.setItem('room1221_nickname', name);
    setShowNicknameModal(false);
    toast.success(getLocalizedMessage('welcomeMsg', name));
  };

  const handleSkipNickname = () => {
    setShowNicknameModal(false);
    toast.info(getLocalizedMessage('anonymousMsg'));
  };

  const handleClearChat = () => {
    console.log('🧹 [APP] Clearing chat...');
    // Remove chat from localStorage
    localStorage.removeItem(`room1221_chat_${sessionId}`);
    // Create new session ID
    const newSessionId = Date.now().toString();
    setSessionId(newSessionId);
    setSessionTimer(new Date());
    // Trigger chat component to reload with new session
    setClearChatTrigger(prev => prev + 1);
    setShowClearDialog(false);
    toast.success(getLocalizedMessage('clearChatMsg'));
    console.log('✅ [APP] Chat cleared, new session:', newSessionId);
  };

  const handlePanic = () => {
    setShowPanicScreen(true);
    localStorage.setItem('room1221_panic_triggered', Date.now().toString());
  };

  const handleExitPanic = () => {
    setShowPanicScreen(false);
  };

  const handleRequestFollowUpId = () => {
    setShowFollowUpModal(true);
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    toast.success(getLocalizedMessage('languageChanged'));
  };

  const handleBotNameChange = () => {
    if (tempBotName.trim()) {
      setBotName(tempBotName.trim());
      setIsEditingBotName(false);
      setTempBotName("");
      toast.success(getLocalizedMessage('botNameChanged'));
    }
  };

  const handleStartEditBotName = () => {
    setTempBotName(botName);
    setIsEditingBotName(true);
  };

  const handleCancelEditBotName = () => {
    setIsEditingBotName(false);
    setTempBotName("");
  };

  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.removeItem('room1221_nickname');
    localStorage.removeItem('room1221_botname');
    localStorage.removeItem('room1221_language');
    localStorage.removeItem('room1221_duration');
    localStorage.removeItem('room1221_analytics');
    localStorage.removeItem(`room1221_chat_${sessionId}`);
    localStorage.removeItem('room1221_sessions');
    localStorage.removeItem('room1221_panic_triggered');
    localStorage.removeItem('room1221_onboarding_complete');
    
    // Reset all states to defaults
    setNickname(undefined);
    setBotName("Room 1221");
    setSelectedLanguage("en");
    setSessionDuration("24h");
    setAnalyticsOptIn(true);
    setSessionId(Date.now().toString());
    setSessionTimer(new Date());
    setShowNicknameModal(true);
    setShowLogoutDialog(false);
    setCurrentSection("chat");
    setIsEditingBotName(false);
    setTempBotName("");
    setHasSeenOnboarding(false);
    
    toast.success(getLocalizedMessage('logoutSuccess'));
  };

  const getLocalizedMessage = (key: string, param?: string) => {
    const messages = {
      en: {
        welcomeMsg: `Welcome, ${param}! 👋`,
        anonymousMsg: 'Chatting anonymously',
        clearChatMsg: 'Chat cleared',
        languageChanged: 'Language updated',
        botNameChanged: 'Bot name updated',
        privacyNotice: `Your privacy matters. ${botName} never stores personal data.`,
        sessionTimerLabel: 'Auto-delete in:',
        settingsTitle: 'Settings & Privacy',
        chatHistory: 'Chat History',
        retentionSettings: 'Auto-Delete Settings',
        followUpKey: 'Follow-up Key',
        languageSettings: 'Language',
        dataForGood: 'Data for Good',
        analyticsDesc: 'Anonymous usage data helps improve SRHR education for youth.',
        shareData: 'Share anonymous data',
        botNameTitle: 'Bot Name',
        botNameDesc: 'Customize the name of your assistant',
        changeBotName: 'Change Bot Name',
        currentBotName: 'Current name:',
        enterNewName: 'Enter new bot name',
        saveName: 'Save Name',
        cancel: 'Cancel',
        logout: 'Logout',
        logoutTitle: 'Logout Confirmation',
        logoutDesc: 'Are you sure you want to logout? This will clear all your data including chat history, nickname, and settings.',
        logoutConfirm: 'Yes, Logout',
        logoutCancel: 'Cancel',
        logoutSuccess: 'Logged out successfully',
        navigation: 'Navigation',
        actions: 'Actions',
        clearChat: 'Clear Chat',
        privacyFirst: 'Privacy First',
        online: 'Online',
        yourNickname: 'Your Nickname',
        anonymousChatting: 'You are chatting anonymously',
        changeNickname: 'Change Nickname',
        setNickname: 'Set Nickname',
        chooseRetention: 'Choose how long to keep your chat history',
        chooseLanguage: 'Choose your preferred language',
        sidebarDescription: 'Navigate the app and manage your privacy settings',
        consultantMode: 'Chat with Consultant',
        consultantModeActive: 'Consultant Mode Active',
        consultantDesc: 'Connect with a Room 1221 consultant for personalized support',
        consultantConnected: 'Connected to consultant',
        endConsultant: 'End Consultant Chat'
      },
      twi: {
        welcomeMsg: `Akwaaba, ${param}! 👋`,
        anonymousMsg: 'Woreka nkɔmmɔ a wonnim wo',
        clearChatMsg: 'Wɔapopa nkɔmmɔbɔ no',
        languageChanged: 'Kasa asakra',
        botNameChanged: 'Bot din asakra',
        privacyNotice: `Wo kokoam ho hia. ${botName} nkora wo nsɛm koraa.`,
        sessionTimerLabel: 'Wɔbɛpopa wɔ:',
        settingsTitle: 'Nhyehyɛe ne Kokoam',
        chatHistory: 'Nkɔmmɔbɔ Abakɔsɛm',
        retentionSettings: 'Auto-Yi Fi Hɔ',
        followUpKey: 'Ɔdi-Akyi Safoa',
        languageSettings: 'Kasa',
        dataForGood: 'Data ma Papa',
        analyticsDesc: 'Anonymous data boa ma SRHR nkyerɛkyerɛ yɛ papa.',
        shareData: 'Kyɛ anonymous data',
        botNameTitle: 'Bot Din',
        botNameDesc: 'Sesa wo boafoɔ din',
        changeBotName: 'Sesa Bot Din',
        currentBotName: 'Din a ɛwɔ hɔ:',
        enterNewName: 'Kyerɛw bot din foforɔ',
        saveName: 'Kora Din',
        cancel: 'Gyae',
        logout: 'Fi Mu',
        logoutTitle: 'Fi Mu Nkrataa',
        logoutDesc: 'Wopɛ sɛ wofi mu ankasa? Eyi bɛyi wo data nyinaa afi hɔ a nka nkɔmmɔbɔ abakɔsɛm, din, ne nhyehyɛe.',
        logoutConfirm: 'Aane, Fi Mu',
        logoutCancel: 'Gyae',
        logoutSuccess: 'Woafi mu yie',
        navigation: 'Akwankyerɛ',
        actions: 'Nneyɛe',
        clearChat: 'Popa Nkɔmmɔbɔ',
        privacyFirst: 'Kokoam Di Kan',
        online: 'Wɔ Nkrataa',
        yourNickname: 'Wo Din Kakra',
        anonymousChatting: 'Woreka nkɔmmɔ a wonnim wo',
        changeNickname: 'Sesa Din Kakra',
        setNickname: 'Fa Din Kakra Si Hɔ',
        chooseRetention: 'Paw bere tenten a wɔbɛkora wo nkɔmmɔbɔ abakɔsɛm',
        chooseLanguage: 'Paw kasa a wopɛ',
        sidebarDescription: 'Kyinkyin app no mu na di wo kokoam ho nhyehyɛe so',
        consultantMode: 'Kasa ne Ɔfotufoɔ',
        consultantModeActive: 'Ɔfotufoɔ Mode Reyɛ Adwuma',
        consultantDesc: 'Kɔ Room 1221 ɔfotufoɔ nkyɛn na nya mmoa',
        consultantConnected: 'Wɔaka ɔfotufoɔ ho',
        endConsultant: 'Gyae Ɔfotufoɔ Nkɔmmɔbɔ'
      },
      ewe: {
        welcomeMsg: `Woezɔ, ${param}! 👋`,
        anonymousMsg: 'Èle nuƒoƒo me ɣaɣlalãtɔe',
        clearChatMsg: 'Wotutu nuƒoƒo la ɖa',
        languageChanged: 'Gbegbɔgblɔ trɔ',
        botNameChanged: 'Bot ŋkɔ trɔ',
        privacyNotice: `Wò ɣaɣladzraɖoƒe le vevie. ${botName} medzraa wò nyatakakawo ɖe eme o.`,
        sessionTimerLabel: 'Woatutu le:',
        settingsTitle: 'Ðoɖowɔwɔwo kple Ɣaɣlawo',
        chatHistory: 'Nuƒoƒo Ŋutinya',
        retentionSettings: 'Auto-Tutu Ðoɖowo',
        followUpKey: 'Kplɔla Safui',
        languageSettings: 'Gbegbɔgblɔ',
        dataForGood: 'Nyatakaka na Nyonyo',
        analyticsDesc: 'Anonymous nyatakaka kpena ɖe SRHR nufiafia ŋu.',
        shareData: 'Ma anonymous nyatakaka',
        botNameTitle: 'Bot ŋkɔ',
        botNameDesc: 'Trɔ wò kpeɖeŋutɔ ƒe ŋkɔ',
        changeBotName: 'Trɔ Bot ŋkɔ',
        currentBotName: 'Ŋkɔ si li fifia:',
        enterNewName: 'Ŋlɔ bot ŋkɔ yeye',
        saveName: 'Dzra ŋkɔ ɖo',
        cancel: 'Gblẽ',
        logout: 'Do Go',
        logoutTitle: 'Do Go Ðoɖo',
        logoutDesc: 'Èdi vavã be yeado go? Esia atutu wò nyatakaka katã abe nuƒoƒo ŋutinya, ŋkɔ, kple ɖoɖowo ene.',
        logoutConfirm: 'Ɛ̃, Do Go',
        logoutCancel: 'Gblẽ',
        logoutSuccess: 'Èdo go nyuie',
        navigation: 'Mɔfiame',
        actions: 'Nuwɔnawo',
        clearChat: 'Tutu Nuƒoƒo',
        privacyFirst: 'Ɣaɣla Gbã',
        online: 'Le Internet Dzi',
        yourNickname: 'Wò Ŋkɔ Kpui',
        anonymousChatting: 'Èle nuƒoƒo me ɣaɣlalãtɔe',
        changeNickname: 'Trɔ Ŋkɔ Kpui',
        setNickname: 'Ðo Ŋkɔ Kpui',
        chooseRetention: 'Tia ɣeyiɣi didime si woadzra wò nuƒoƒo ŋutinya ɖo',
        chooseLanguage: 'Tia gbegbɔgblɔ si nèlɔ̃ wu',
        sidebarDescription: 'Zɔ le app la me eye nàkpɔ wò ɣaɣladzraɖoƒe ɖoɖowo dzi',
        consultantMode: 'Ƒo Nu Kple Aɖaŋuɖola',
        consultantModeActive: 'Aɖaŋuɖola Mode Le Dɔ Wɔm',
        consultantDesc: 'Kpe ɖe Room 1221 aɖaŋuɖola ŋu na kpekpeɖeŋu tɔxɛ',
        consultantConnected: 'Wokpe ɖe aɖaŋuɖola ŋu',
        endConsultant: 'Wu Aɖaŋuɖola Nuƒoƒo Nu'
      },
      ga: {
        welcomeMsg: `Mɔɔ baa, ${param}! 👋`,
        anonymousMsg: 'O yɛɔ kɛ amɛ nyɛ oo',
        clearChatMsg: 'Wɔ yi nkɔmmɔbɔ fɛɛ',
        languageChanged: 'Kasa sesa',
        botNameChanged: 'Bot shikpon sesa',
        privacyNotice: `Wo kokoam kɛ hia. ${botName} ko wo nsɛm koraa hĩ.`,
        sessionTimerLabel: 'Wɔ yi fɛɛ wɔ:',
        settingsTitle: 'Nhyehyɛɛ lɛ Kokoam',
        chatHistory: 'Nkɔmmɔbɔ Abakɔsɛm',
        retentionSettings: 'Auto-Yi Fɛɛ',
        followUpKey: 'Ɔdi-Akyi Safoa',
        languageSettings: 'Kasa',
        dataForGood: 'Data ma Papa',
        analyticsDesc: 'Anonymous data boa ma SRHR nkyerɛkyerɛ yɛ papa.',
        shareData: 'Kyɛ anonymous data',
        botNameTitle: 'Bot Shikpon',
        botNameDesc: 'Sesa wo boafoɔ shikpon',
        changeBotName: 'Sesa Bot Shikpon',
        currentBotName: 'Shikpon ni ɛwɔ lɛ:',
        enterNewName: 'Ŋlɔ bot shikpon foforɔ',
        saveName: 'Kora Shikpon',
        cancel: 'Gbee',
        logout: 'Tswa Lɛ',
        logoutTitle: 'Tswa Lɛ Nkrataa',
        logoutDesc: 'O pɛ sɛ o tswa lɛ hewalɛ? Eyi yi wo data nyinaa fɛɛ nka nkɔmmɔbɔ abakɔsɛm, shikpon, lɛ nhyehyɛɛ.',
        logoutConfirm: 'Aane, Tswa Lɛ',
        logoutCancel: 'Gbee',
        logoutSuccess: 'Wo tswa lɛ yie',
        navigation: 'Akwankyerɛ',
        actions: 'Shishi',
        clearChat: 'Yi Nkɔmmɔbɔ Fɛɛ',
        privacyFirst: 'Kokoam Di Kɛɛ',
        online: 'Wɔ Internet',
        yourNickname: 'Wo Shikpon Kakra',
        anonymousChatting: 'O yɛɔ kɛ amɛ nyɛ oo',
        changeNickname: 'Sesa Shikpon Kakra',
        setNickname: 'To Shikpon Kakra',
        chooseRetention: 'Paw bere tenten ni wɔ kora wo nkɔmmɔbɔ abakɔsɛm',
        chooseLanguage: 'Paw kasa ni o pɛ',
        sidebarDescription: 'Kyinkyin app lɛ di wo kokoam nhyehyɛɛ',
        consultantMode: 'Yɛɔ kɛ Ɔfotufoɔ',
        consultantModeActive: 'Ɔfotufoɔ Mode Yɛɔ Adwuma',
        consultantDesc: 'Kɔ Room 1221 ɔfotufoɔ gbɔ nya mmoa',
        consultantConnected: 'Wɔ ka ɔfotufoɔ',
        endConsultant: 'Gbee Ɔfotufoɔ Yɛɔbɔɔ'
      }
    };

    const lang = messages[selectedLanguage as keyof typeof messages] || messages.en;
    return lang[key as keyof typeof lang] || '';
  };

  const getSessionTimeRemaining = () => {
    if (!sessionTimer) return '';

    const now = new Date().getTime();
    const sessionTime = sessionTimer.getTime();
    let deleteAfter = 24 * 60 * 60 * 1000;

    if (sessionDuration === '7d') {
      deleteAfter = 7 * 24 * 60 * 60 * 1000;
    } else if (sessionDuration === '30d') {
      deleteAfter = 30 * 24 * 60 * 60 * 1000;
    } else if (sessionDuration === '90d') {
      deleteAfter = 90 * 24 * 60 * 60 * 1000;
    }

    const remaining = deleteAfter - (now - sessionTime);
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    
    if (hours < 24) {
      return `${hours}h`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d`;
    }
  };

  const navigationItems = [
    { id: 'chat', label: { en: 'Chat', twi: 'Nkɔmmɔbɔ', ewe: 'Nuƒoƒo', ga: 'Yɛɔbɔɔ' }, icon: MessageSquare },
    { id: 'story', label: { en: 'Story Mode', twi: 'Asɛm Mode', ewe: 'Ŋutinyawo', ga: 'Ŋutinyawo' }, icon: BookOpen },
    { id: 'myths', label: { en: 'Myth Busters', twi: 'Nsɛm a Ɛnyɛ Nokware', ewe: 'Alakpatɔwo', ga: 'Alakpatɔwo' }, icon: Brain },
    { id: 'support', label: { en: 'Support & Clinics', twi: 'Adesua & Ayaresabea', ewe: 'Xaxa & Kliniko', ga: 'Bɔbɔi & Ayɔyɔ' }, icon: Building2 },
    { id: 'pharmacy', label: { en: 'Pharmacy', twi: 'Aduruyɛ', ewe: 'Atikewɔƒe', ga: 'Aduruyɛbea' }, icon: Pill },
    { id: 'settings', label: { en: 'Settings', twi: 'Nhyehyɛe', ewe: 'Ðoɖowɔwɔwo', ga: 'Ɔyeɛ' }, icon: Settings },
  ];

  // Show onboarding screen if user hasn't seen it
  if (!hasSeenOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} selectedLanguage={selectedLanguage} />;
  }

  if (showPanicScreen) {
    return <PanicScreen onExit={handleExitPanic} />;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      <Toaster 
        position="top-center"
        expand={false}
        duration={2000}
        toastOptions={{
          style: {
            marginTop: '60px',
          },
          className: 'rounded-2xl',
        }}
      />
      
      {/* Desktop Persistent Sidebar - ChatGPT-style behavior */}
      {isDesktop && sidebarOpen && (
        <aside className="hidden lg:flex flex-col w-[280px] border-r bg-white flex-shrink-0 h-screen" style={{ borderColor: '#E8ECFF' }}>
          <div className="p-4 border-b" style={{ background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-white" />
                <h2 className="text-white font-semibold">{botName}</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-white/20 rounded-xl"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-white/80 text-xs mt-1">{getLocalizedMessage('sidebarDescription')}</p>
          </div>
          
          <ScrollArea className="flex-1">
            {/* Navigation */}
            <div className="p-3">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">
                {getLocalizedMessage('navigation')}
              </h3>
              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const label = item.label[selectedLanguage as keyof typeof item.label] || item.label.en;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentSection(item.id as Section);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        currentSection === item.id
                          ? 'text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      style={currentSection === item.id ? { 
                        background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
                        boxShadow: '0 2px 8px rgba(0, 72, 255, 0.2)'
                      } : {}}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <Separator className="my-3" />

            {/* Chat Actions */}
            <div className="px-3 pb-3">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">
                {getLocalizedMessage('actions')}
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    setShowClearDialog(true);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {getLocalizedMessage('clearChat')}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  style={{ borderColor: '#ff4444' }}
                  onClick={() => {
                    setShowLogoutDialog(true);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {getLocalizedMessage('logout')}
                </Button>
              </div>
            </div>

            <Separator className="my-3" />

            {/* Auto-Delete Countdown - Desktop */}
            <div className="px-3 pb-3">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">
                {getLocalizedMessage('retentionSettings')}
              </h3>
              {sessionTimer && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-600">
                        {getLocalizedMessage('sessionTimerLabel')}
                      </span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: '#0048ff' }}>
                      {getSessionTimeRemaining()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full transition-all"
                      style={{ 
                        background: 'linear-gradient(90deg, #0048ff 0%, #0066ff 100%)',
                        width: '75%'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-3" />

            {/* Language Selection - Desktop */}
            <div className="px-3 pb-3">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">
                <Globe className="w-3 h-3 inline mr-1" />
                {getLocalizedMessage('languageSettings')}
              </h3>
              <div className="flex gap-2">
                {['en', 'twi', 'ewe', 'ga'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`flex-1 px-3 py-2 rounded-xl text-sm transition-all ${
                      selectedLanguage === lang
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={selectedLanguage === lang ? {
                      background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
                      boxShadow: '0 2px 8px rgba(0, 72, 255, 0.2)'
                    } : {}}
                  >
                    {lang === 'en' && 'EN'}
                    {lang === 'twi' && 'TWI'}
                    {lang === 'ewe' && 'EWE'}
                    {lang === 'ga' && 'GA'}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="my-3" />

            {/* Privacy Notice */}
            <div className="px-3 pb-3">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#E8ECFF' }}>
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#0048ff' }} />
                  <div>
                    <h4 className="text-xs font-semibold mb-1" style={{ color: '#0048ff' }}>
                      {getLocalizedMessage('privacyFirst')}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {getLocalizedMessage('privacyNotice')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b flex-shrink-0 sticky top-0 z-50" style={{ borderColor: '#E8ECFF', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)' }}>
          <div className="px-4 py-3 flex items-center justify-between gap-4">
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-3">
              {/* Mobile Sheet Sidebar */}
              <Sheet open={!isDesktop && sidebarOpen} onOpenChange={(open) => !isDesktop && setSidebarOpen(open)}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[320px] p-0">
                  <SheetHeader className="p-4 border-b" style={{ background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)' }}>
                    <SheetTitle className="text-white flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      {botName}
                    </SheetTitle>
                    <SheetDescription className="text-white/80 text-sm">
                      {getLocalizedMessage('sidebarDescription')}
                    </SheetDescription>
                  </SheetHeader>
                  
                  <ScrollArea className="h-[calc(100vh-80px)]">
                    {/* Navigation */}
                    <div className="p-3">
                      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">
                        {getLocalizedMessage('navigation')}
                      </h3>
                      <nav className="space-y-1">
                        {navigationItems.map((item) => {
                          const Icon = item.icon;
                          const label = item.label[selectedLanguage as keyof typeof item.label] || item.label.en;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setCurrentSection(item.id as Section);
                                setSidebarOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                                currentSection === item.id
                                  ? 'text-white'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                              style={currentSection === item.id ? { 
                                background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
                                boxShadow: '0 2px 8px rgba(0, 72, 255, 0.2)'
                              } : {}}
                            >
                              <Icon className="w-5 h-5" />
                              <span>{label}</span>
                            </button>
                          );
                        })}
                      </nav>
                    </div>

                    <Separator className="my-3" />

                    {/* Chat Actions */}
                    <div className="px-3 pb-3">
                      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">
                        {getLocalizedMessage('actions')}
                      </h3>
                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            setSidebarOpen(false);
                            setShowClearDialog(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {getLocalizedMessage('clearChat')}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                          style={{ borderColor: '#ff4444' }}
                          onClick={() => {
                            setSidebarOpen(false);
                            setShowLogoutDialog(true);
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          {getLocalizedMessage('logout')}
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    {/* Session Info */}
                    <div className="px-3 pb-3">
                      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">
                        {getLocalizedMessage('retentionSettings')}
                      </h3>
                      <div className="space-y-2">
                        {['24h', '7d', '30d', '90d'].map((duration) => (
                          <label
                            key={duration}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="duration"
                              value={duration}
                              checked={sessionDuration === duration}
                              onChange={(e) => setSessionDuration(e.target.value)}
                              className="w-4 h-4"
                              style={{ accentColor: '#0048ff' }}
                            />
                            <span className="text-sm">
                              {duration === '24h' && '24 hours'}
                              {duration === '7d' && '7 days'}
                              {duration === '30d' && '30 days'}
                              {duration === '90d' && '90 days'}
                            </span>
                          </label>
                        ))}
                      </div>

                      {sessionTimer && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-xs text-gray-600">
                                {getLocalizedMessage('sessionTimerLabel')}
                              </span>
                            </div>
                            <span className="text-xs font-semibold" style={{ color: '#0048ff' }}>
                              {getSessionTimeRemaining()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="h-1.5 rounded-full transition-all"
                              style={{ 
                                background: 'linear-gradient(90deg, #0048ff 0%, #0066ff 100%)',
                                width: '75%'
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator className="my-3" />

                    {/* Language Toggle */}
                    <div className="px-3 pb-3">
                      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 px-2">
                        <Globe className="w-3 h-3 inline mr-1" />
                        {getLocalizedMessage('languageSettings')}
                      </h3>
                      <div className="flex gap-2">
                        {['en', 'twi', 'ewe', 'ga'].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => handleLanguageChange(lang)}
                            className={`flex-1 px-3 py-2 rounded-xl text-sm transition-all ${
                              selectedLanguage === lang
                                ? 'text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            style={selectedLanguage === lang ? {
                              background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
                              boxShadow: '0 2px 8px rgba(0, 72, 255, 0.2)'
                            } : {}}
                          >
                            {lang === 'en' && 'EN'}
                            {lang === 'twi' && 'TWI'}
                            {lang === 'ewe' && 'EWE'}
                            {lang === 'ga' && 'GA'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-3" />

                    {/* Follow-up Key */}
                    <div className="px-3 pb-3">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setShowFollowUpModal(true);
                          setSidebarOpen(false);
                        }}
                      >
                        {getLocalizedMessage('followUpKey')}
                      </Button>
                    </div>

                    <Separator className="my-3" />

                    {/* Privacy Notice */}
                    <div className="px-3 pb-3">
                      <div className="p-3 rounded-xl" style={{ backgroundColor: '#E8ECFF' }}>
                        <div className="flex items-start gap-2">
                          <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#0048ff' }} />
                          <div>
                            <h4 className="text-xs font-semibold mb-1" style={{ color: '#0048ff' }}>
                              {getLocalizedMessage('privacyFirst')}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {getLocalizedMessage('privacyNotice')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Analytics Opt-in */}
                    <div className="px-3 pb-6">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-start gap-2 mb-2">
                          <BarChart3 className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-500" />
                          <div>
                            <h4 className="text-xs font-semibold mb-1" style={{ color: '#1A1A1A' }}>
                              {getLocalizedMessage('dataForGood')}
                            </h4>
                            <p className="text-xs text-gray-600 mb-2">
                              {getLocalizedMessage('analyticsDesc')}
                            </p>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={analyticsOptIn}
                                onChange={(e) => setAnalyticsOptIn(e.target.checked)}
                                className="w-4 h-4 rounded"
                                style={{ accentColor: '#0048ff' }}
                              />
                              <span className="text-xs text-gray-700">
                                {getLocalizedMessage('shareData')}
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </SheetContent>
              </Sheet>
              
              {/* Desktop Toggle Button */}
              {isDesktop && !sidebarOpen && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-xl hidden lg:flex"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}

            <div className="flex items-center gap-2">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center" 
                style={{ 
                  background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
                  boxShadow: '0 2px 8px rgba(0, 72, 255, 0.25)'
                }}
              >
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-lg" style={{ color: '#1A1A1A' }}>{botName}</h1>
              </div>
            </div>
          </div>

          {/* Center: Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#0048ff' }}></div>
            <span>{getLocalizedMessage('online')}</span>
          </div>

          {/* Right: Panic Button */}
          <PanicButton 
            onPanic={handlePanic}
            selectedLanguage={selectedLanguage}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            {currentSection === "chat" && (
              <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Consultant Mode Banner */}
                {consultantMode && (
                  <div className="flex-shrink-0 px-4 py-3 border-b" style={{ backgroundColor: "#E8FFF4", borderColor: "#10B981" }}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full animate-pulse bg-green-500"></div>
                        <UserCheck className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">
                          {getLocalizedMessage('consultantConnected')}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg text-xs"
                        style={{ borderColor: "#10B981", color: "#10B981" }}
                        onClick={() => {
                          setConsultantMode(false);
                          toast.info(getLocalizedMessage('endConsultant'));
                        }}
                      >
                        {getLocalizedMessage('endConsultant')}
                      </Button>
                    </div>
                  </div>
                )}
                
                <ChatInterface
                  selectedLanguage={selectedLanguage}
                  onRequestFollowUpId={handleRequestFollowUpId}
                  isGuest={!nickname}
                  username={nickname}
                  botName={botName}
                  sessionId={sessionId}
                  clearTrigger={clearChatTrigger}
                  consultantMode={consultantMode}
                />
                
                {/* Floating Consultant Mode Button - Only show when NOT in consultant mode */}
                {!consultantMode && (
                  <motion.button
                    onClick={() => setShowConsultantDialog(true)}
                    className="fixed bottom-24 right-6 z-50 rounded-full p-4 font-semibold text-white shadow-2xl group"
                    style={{
                      background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                      boxShadow: "0 8px 32px rgba(16, 185, 129, 0.4)",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  >
                    <UserCheck className="w-6 h-6" />
                  </motion.button>
                )}
              </div>
            )}
            {currentSection === "story" && (
              <StoryMode 
                selectedLanguage={selectedLanguage} 
                onNavigateToMyths={() => setCurrentSection('myths')}
              />
            )}
            {currentSection === "myths" && (
              <MythBusters selectedLanguage={selectedLanguage} />
            )}
            {currentSection === "support" && (
              <SupportAndClinics selectedLanguage={selectedLanguage} />
            )}
            {currentSection === "pharmacy" && (
              <Pharmacy selectedLanguage={selectedLanguage} />
            )}
            {currentSection === "settings" && (
              <div className="h-full overflow-y-auto" style={{ background: 'linear-gradient(to bottom, #FFFFFF 0%, #F8FAFE 100%)' }}>
                <div className="max-w-2xl mx-auto p-6">
                  <h2 className="text-2xl mb-6" style={{ color: '#0048ff' }}>
                    {getLocalizedMessage('settingsTitle')}
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Nickname Section */}
                    <div className="p-6 rounded-2xl" style={{ backgroundColor: 'white', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
                      <h3 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                        {getLocalizedMessage('yourNickname')}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {nickname || getLocalizedMessage('anonymousChatting')}
                      </p>
                      <Button
                        onClick={() => setShowNicknameModal(true)}
                        className="rounded-xl"
                        style={{ 
                          background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
                          boxShadow: '0 4px 16px rgba(0, 72, 255, 0.2)'
                        }}
                      >
                        {nickname ? getLocalizedMessage('changeNickname') : getLocalizedMessage('setNickname')}
                      </Button>
                    </div>

                    {/* Bot Name Section */}
                    <div className="p-6 rounded-2xl" style={{ backgroundColor: 'white', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
                      <h3 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                        {getLocalizedMessage('botNameTitle')}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {getLocalizedMessage('botNameDesc')}
                      </p>
                      
                      {!isEditingBotName ? (
                        <div>
                          <div className="mb-4 p-3 rounded-xl" style={{ backgroundColor: '#F8FAFE' }}>
                            <p className="text-sm text-gray-500 mb-1">
                              {getLocalizedMessage('currentBotName')}
                            </p>
                            <p className="font-semibold" style={{ color: '#0048ff' }}>
                              {botName}
                            </p>
                          </div>
                          <Button
                            onClick={handleStartEditBotName}
                            className="rounded-xl"
                            variant="outline"
                            style={{ borderColor: '#0048ff', color: '#0048ff' }}
                          >
                            <Edit2 className="w-4 h-4 mr-2" />
                            {getLocalizedMessage('changeBotName')}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Input
                            value={tempBotName}
                            onChange={(e) => setTempBotName(e.target.value)}
                            placeholder={getLocalizedMessage('enterNewName')}
                            className="rounded-xl"
                            maxLength={30}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleBotNameChange();
                              }
                            }}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={handleBotNameChange}
                              className="rounded-xl flex-1"
                              disabled={!tempBotName.trim()}
                              style={{ 
                                background: tempBotName.trim() 
                                  ? 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)' 
                                  : undefined,
                                boxShadow: tempBotName.trim() 
                                  ? '0 4px 16px rgba(0, 72, 255, 0.2)' 
                                  : undefined
                              }}
                            >
                              <Check className="w-4 h-4 mr-2" />
                              {getLocalizedMessage('saveName')}
                            </Button>
                            <Button
                              onClick={handleCancelEditBotName}
                              className="rounded-xl"
                              variant="outline"
                            >
                              <X className="w-4 h-4 mr-2" />
                              {getLocalizedMessage('cancel')}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Auto-Delete Settings */}
                    <div className="p-6 rounded-2xl" style={{ backgroundColor: 'white', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
                      <h3 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                        {getLocalizedMessage('retentionSettings')}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {getLocalizedMessage('chooseRetention')}
                      </p>
                      <div className="space-y-2">
                        {['24h', '7d', '30d', '90d'].map((duration) => (
                          <label
                            key={duration}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="duration-settings"
                              value={duration}
                              checked={sessionDuration === duration}
                              onChange={(e) => setSessionDuration(e.target.value)}
                              className="w-4 h-4"
                              style={{ accentColor: '#0048ff' }}
                            />
                            <span>
                              {duration === '24h' && '24 hours (default)'}
                              {duration === '7d' && '7 days'}
                              {duration === '30d' && '30 days'}
                              {duration === '90d' && '90 days'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Language Settings */}
                    <div className="p-6 rounded-2xl" style={{ backgroundColor: 'white', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
                      <h3 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                        {getLocalizedMessage('languageSettings')}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {getLocalizedMessage('chooseLanguage')}
                      </p>
                      <div className="flex gap-3">
                        {['en', 'twi', 'ewe', 'ga'].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => handleLanguageChange(lang)}
                            className={`flex-1 px-4 py-3 rounded-xl transition-all ${
                              selectedLanguage === lang
                                ? 'text-white'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                            }`}
                            style={selectedLanguage === lang ? {
                              background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
                              boxShadow: '0 4px 16px rgba(0, 72, 255, 0.2)'
                            } : {}}
                          >
                            {lang === 'en' && 'English'}
                            {lang === 'twi' && 'Twi'}
                            {lang === 'ewe' && 'Ewe'}
                            {lang === 'ga' && 'Ga'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Privacy & Analytics */}
                    <div className="p-6 rounded-2xl" style={{ backgroundColor: 'white', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)' }}>
                      <h3 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                        Privacy & Data
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-2">
                          <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#0048ff' }} />
                          <p className="text-sm text-gray-600">
                            {getLocalizedMessage('privacyNotice')}
                          </p>
                        </div>
                        <Separator />
                        <div>
                          <h4 className="text-sm font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                            {getLocalizedMessage('dataForGood')}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3">
                            {getLocalizedMessage('analyticsDesc')}
                          </p>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={analyticsOptIn}
                              onChange={(e) => setAnalyticsOptIn(e.target.checked)}
                              className="w-4 h-4 rounded"
                              style={{ accentColor: '#0048ff' }}
                            />
                            <span className="text-sm text-gray-700">
                              {getLocalizedMessage('shareData')}
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Logout Section */}
                    <div className="p-6 rounded-2xl" style={{ backgroundColor: 'white', boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)', borderColor: '#ffebee', borderWidth: '1px' }}>
                      <h3 className="font-semibold mb-2" style={{ color: '#1A1A1A' }}>
                        {getLocalizedMessage('logout')}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Clear all data and start fresh
                      </p>
                      <Button
                        onClick={() => setShowLogoutDialog(true)}
                        className="rounded-xl w-full"
                        variant="outline"
                        style={{ borderColor: '#ff4444', color: '#ff4444' }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {getLocalizedMessage('logout')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      </div>
      {/* End of main content area */}

      {/* Nickname Modal */}
      {showNicknameModal && (
        <NicknameModal
          isOpen={showNicknameModal}
          onSubmit={handleNicknameSubmit}
          onSkip={handleSkipNickname}
        />
      )}

      {/* Follow-up ID Modal */}
      {showFollowUpModal && (
        <FollowUpId
          isOpen={showFollowUpModal}
          onClose={() => setShowFollowUpModal(false)}
          selectedLanguage={selectedLanguage}
        />
      )}

      {/* Clear Chat Confirmation */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear current chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete all messages in the current conversation. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearChat}
              className="bg-red-500 hover:bg-red-600"
            >
              Clear Chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Confirmation */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: '#ff4444' }}>
              {getLocalizedMessage('logoutTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {getLocalizedMessage('logoutDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">
              {getLocalizedMessage('logoutCancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 rounded-xl"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {getLocalizedMessage('logoutConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Consultant Mode Dialog */}
      <AlertDialog open={showConsultantDialog} onOpenChange={setShowConsultantDialog}>
        <AlertDialogContent className="max-w-md rounded-3xl p-0 overflow-hidden border-0">
          <div style={{ background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" }} className="p-6 pb-8">
            <div className="flex items-center justify-center mb-4">
              <div 
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                style={{ boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)" }}
              >
                <UserCheck className="w-8 h-8 text-white" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-white text-2xl font-bold mb-2">
              {getLocalizedMessage('consultantMode')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-white/90 text-sm leading-relaxed">
              {getLocalizedMessage('consultantDesc')}
            </AlertDialogDescription>
          </div>
          
          <div className="p-6 bg-white">
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#E8FFF4" }}>
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    {selectedLanguage === 'en' && 'Personalized support from trained consultants'}
                    {selectedLanguage === 'twi' && 'Nkitahodi a wɔatetee fi akyerɛkyerɛfo a wɔatete wɔn hɔ'}
                    {selectedLanguage === 'ewe' && 'Kpekpeɖeŋu tɔxɛ tso aɖaŋutɔ siwo wofia nu'}
                    {selectedLanguage === 'ga' && 'Kpekpeɛ tɔɔ lɛ kɛ ablɔi kɛmi wohe fiɛɛ'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#E8FFF4" }}>
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    {selectedLanguage === 'en' && 'Your privacy and anonymity remain protected'}
                    {selectedLanguage === 'twi' && 'Wo kokoamsɛm ne wo ahintasɛm bɛkɔ so ayɛ ahobammɔ'}
                    {selectedLanguage === 'ewe' && 'Wò ŋukpeɖoɖo kple mawonuwuwu ganɔa dedinɔnɔ me'}
                    {selectedLanguage === 'ga' && 'Bi asuɔmi kɛ bi awiɛmi kɛ yi bɔɔ'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#E8FFF4" }}>
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    {selectedLanguage === 'en' && 'Continue your conversation seamlessly'}
                    {selectedLanguage === 'twi' && 'Kɔ so wo nkɔmmɔbɔ a ɛnkɔ so ntrɛw'}
                    {selectedLanguage === 'ewe' && 'Yi wò nuƒoƒo dzi bɔbɔe'}
                    {selectedLanguage === 'ga' && 'Kɛ bi kɔmi lɛ kɛ efɛɛfɛɛ'}
                  </p>
                </div>
              </div>
            </div>

            <AlertDialogFooter className="gap-3 sm:gap-3">
              <AlertDialogCancel 
                className="rounded-xl flex-1 sm:flex-1"
                style={{ borderColor: "#E5E7EB" }}
              >
                {selectedLanguage === 'en' && 'Cancel'}
                {selectedLanguage === 'twi' && 'Gyae'}
                {selectedLanguage === 'ewe' && 'Gbe'}
                {selectedLanguage === 'ga' && 'Kpaa'}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setConsultantMode(true);
                  setShowConsultantDialog(false);
                  toast.success(getLocalizedMessage('consultantConnected'));
                }}
                className="rounded-xl flex-1 sm:flex-1 text-white"
                style={{
                  background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3)",
                }}
              >
                <UserCheck className="w-4 h-4 mr-2" />
                {selectedLanguage === 'en' && 'Connect Now'}
                {selectedLanguage === 'twi' && 'Ka Ho Mprempren'}
                {selectedLanguage === 'ewe' && 'Ka Ðe Fifia'}
                {selectedLanguage === 'ga' && 'Kɛ Joŋ Nɔɔ'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Wrap the app with ErrorBoundary for better error handling
export default function App() {
  // Add global error listener to log all unhandled errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('🔴 GLOBAL ERROR:', event.error);
      console.error('🔴 ERROR MESSAGE:', event.message);
      console.error('🔴 ERROR SOURCE:', event.filename, 'Line:', event.lineno, 'Column:', event.colno);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('🔴 UNHANDLED PROMISE REJECTION:', event.reason);
      console.error('🔴 PROMISE:', event.promise);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Log app initialization
    console.log('✅ Room 1221 App initialized successfully');
    console.log('📱 User Agent:', navigator.userAgent);
    console.log('💾 LocalStorage available:', typeof Storage !== 'undefined');

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}