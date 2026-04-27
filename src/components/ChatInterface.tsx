import { useState, useRef, useEffect } from "react";
import { Send, Mic, Clock, User, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import fetchSpeechAudio from '@/services/ttsService';

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useApp } from "@/providers/AppProvider";
import { ChatCitation, requestChatCompletion } from "@/services/chatbotService";
import { logger } from "@/utils/logger";
import { TypewriterMessage } from "./TypewriterMessage";

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  options?: string[];
  mode?: 'chatbot' | 'consultant';
  citations?: ChatCitation[];
  languageDetected?: string;
  responseTimeMs?: number;
}

interface ChatInterfaceProps {
  onRequestFollowUpId: () => void;
  clearTrigger?: number;
}

const CHATBOT_AVATAR_SRC = "/chatbot.jpg";

export function ChatInterface({ 
  onRequestFollowUpId, 
  clearTrigger = 0 
}: ChatInterfaceProps) {
  const { t, i18n } = useTranslation();
  const { nickname, botName, sessionId, consultantMode, sessionDuration } = useApp();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [chatLanguage, setChatLanguage] = useState(i18n.resolvedLanguage?.split('-')[0] || i18n.language || 'en');
  const [completedBotMessages, setCompletedBotMessages] = useState<Set<string>>(new Set());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const STORAGE_KEY = `room1221_chat_${sessionId}`;

  const langMap: Record<string, string> = { 'en': 'en-US', 'twi': 'en-GH', 'ewe': 'en-GH', 'ga': 'en-GH' };

  const speakText = (text: string, langCode?: string) => {
    // If remote TTS proxy is enabled, fetch audio and play it (better quality)
    const useRemote = import.meta.env.VITE_USE_REMOTE_TTS === 'true';
    if (useRemote) {
      fetchSpeechAudio(text, import.meta.env.VITE_TTS_VOICE || 'alloy')
        .then((url) => {
          const audio = new Audio(url);
          audio.play().catch((e) => logger.error('Audio play failed', e));
        })
        .catch((err) => {
          logger.error('Remote TTS failed, falling back to SpeechSynthesis', err);
          // fallback
          try {
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = langMap[langCode || chatLanguage] || 'en-US';
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utter);
          } catch (e) {
            logger.error('Speech synthesis failed', e);
          }
        });
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = langMap[langCode || chatLanguage] || (langCode || chatLanguage) || 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch (err) {
      logger.error('Speech synthesis failed', err);
    }
  };

  const getInitialMessage = () => {
    const initialText = consultantMode ? t('chat.consultantMessage') : t('chat.initialMessage');
    const quickReplies = t('chat.quickReplies', { returnObjects: true }) as Record<string, string>;

    return {
      id: '1',
      text: initialText,
      sender: 'bot' as const,
      timestamp: new Date(),
      options: Object.values(quickReplies),
      mode: consultantMode ? 'consultant' as const : 'chatbot' as const,
    };
  };

  const rebuildMessagesForLanguage = (existingMessages: Message[]) => {
    return existingMessages.map((message, index) => {
      // Keep the first bot greeting localized with localized quick replies.
      if (message.sender === 'bot' && (index === 0 || message.options?.length)) {
        return {
          ...message,
          ...getInitialMessage(),
          id: message.id,
          timestamp: message.timestamp,
          mode: message.mode || (consultantMode ? 'consultant' : 'chatbot'),
        };
      }

      return message;
    });
  };

  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(STORAGE_KEY);
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } else {
        setMessages([getInitialMessage()]);
      }
      setIsLoaded(true);
      setChatLanguage((i18n.resolvedLanguage || i18n.language || 'en').split('-')[0]);
    } catch (error) {
      logger.error('Error loading chat history:', error);
      setMessages([getInitialMessage()]);
      setIsLoaded(true);
    }
  }, [STORAGE_KEY, clearTrigger, consultantMode]);

  useEffect(() => {
    if (!isLoaded || messages.length === 0 || isTyping) {
      return;
    }

    const languageCode = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];
    if (languageCode === chatLanguage) {
      return;
    }

    setMessages((prev) => rebuildMessagesForLanguage(prev));
    setChatLanguage(languageCode);
  }, [i18n.language, i18n.resolvedLanguage, isLoaded, isTyping, messages.length, chatLanguage]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages, STORAGE_KEY]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      const langCodes: Record<string, string> = { 'en': 'en-US', 'twi': 'en-GH', 'ewe': 'en-GH', 'ga': 'en-GH' };
      recognitionRef.current.lang = langCodes[i18n.language] || 'en-US';
      recognitionRef.current.onresult = (event: any) => { setInputValue(event.results[0][0].transcript); setIsListening(false); };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [i18n.language]);

  const handleSend = async (presetMessage?: string) => {
    const outgoingMessage = (presetMessage ?? inputValue).trim();
    if (!outgoingMessage) return;

    const userMsg: Message = { id: Date.now().toString(), text: outgoingMessage, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const languageCode = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];
      const response = await requestChatCompletion({
        message: outgoingMessage,
        language: languageCode,
        session_id: sessionId,
      });

      const answerText = response.answer.trim();

      if (answerText) {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: answerText,
          sender: 'bot',
          timestamp: new Date(),
          mode: consultantMode ? 'consultant' : 'chatbot',
          citations: response.citations,
          languageDetected: response.language_detected,
          responseTimeMs: response.response_time_ms,
        };

        setMessages(prev => [...prev, botMsg]);
      } else {
        logger.warn('Chat API returned an empty answer.', response);
      }
    } catch (error) {
      logger.error('Chat API failed:', error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8faff]">
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
           <div className="rounded-3xl border border-[#CFE0FF] bg-gradient-to-r from-white to-[#EDF4FF] p-4 md:p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0048ff] to-[#00a3ff] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#0048ff]">{t('common.privacyFirst')}</p>
                    <p className="text-xs text-[#4A66A8]">{t('common.privacyNotice')}</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#4A66A8]">
                  <Clock className="w-3.5 h-3.5" />
                  {sessionDuration}
                </div>
              </div>
           </div>

          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm ${
                    message.sender === 'bot' 
                        ? (message.mode === 'consultant' ? 'bg-emerald-600' : 'bg-blue-600') 
                        : 'bg-white border border-slate-100'
                }`}>
                    {message.sender === 'bot' ? (
                      <img
                        src={CHATBOT_AVATAR_SRC}
                        alt={`${botName} avatar`}
                        className="h-full w-full object-cover object-top"
                      />
                    ) : <User className="w-5 h-5 text-slate-400" />}
                </div>

                <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  <div className={`p-4 rounded-[24px] shadow-sm relative group ${
                    message.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : (message.mode === 'consultant' ? 'bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-tl-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none')
                  }`}>
                    {message.sender === 'bot' ? (
                      <TypewriterMessage
                        text={message.text}
                        speed={15}
                        isCompleted={completedBotMessages.has(message.id)}
                        onComplete={() => {
                          setCompletedBotMessages(prev => new Set([...prev, message.id]));
                        }}
                      />
                    ) : (
                      <div className="text-sm leading-relaxed whitespace-pre-wrap chat-markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                      </div>
                    )}
                  </div>

                  {message.sender === 'bot' && (
                    <div className="mt-3 w-full space-y-2">
                      {(message.responseTimeMs !== undefined || message.languageDetected) && (
                        <p className="px-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                          {message.responseTimeMs !== undefined && `Answered in ${message.responseTimeMs} ms`}
                          {message.responseTimeMs !== undefined && message.languageDetected ? ' • ' : ''}
                          {message.languageDetected ? `Language: ${message.languageDetected}` : ''}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-1.5 flex items-center gap-2 px-1">
                      <span className="text-[10px] text-slate-400 font-medium">
                        {message.sender === 'bot' ? (message.mode === 'consultant' ? `${botName} Consultant` : botName) : (nickname || t('chat.anonymous'))}
                      </span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={() => speakText(message.text, message.languageDetected || chatLanguage)}
                        className="ml-2 p-1 rounded-md hover:bg-slate-100 transition-colors"
                        aria-label="Play response audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 5L6 9H2v6h4l5 4V5z" />
                          <path d="M19 5a4 4 0 010 14" />
                        </svg>
                      </button>
                  </div>

                  {message.options && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {message.options.map((option, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={() => { handleSend(option); }}
                          className="rounded-xl border-blue-100 text-blue-600 bg-white hover:bg-blue-50 text-xs py-1 h-9"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center shadow-sm">
                <img
                  src={CHATBOT_AVATAR_SRC}
                  alt={`${botName} avatar`}
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div className="bg-white border border-slate-100 rounded-[24px] rounded-tl-none px-6 py-4 flex gap-1.5">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      <div className="bg-white border-t border-slate-100 p-6 pb-8">
        <div className="max-w-3xl mx-auto flex gap-4 items-center">
          <div className="flex-1 relative group">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={t('chat.placeholder')}
              className="h-12 rounded-full pl-5 pr-14 bg-white border border-slate-100 shadow-sm focus:bg-white focus:border-blue-400 transition-all text-sm font-medium"
            />
            <button
              onClick={() => { if(!recognitionRef.current) return; isListening ? recognitionRef.current.stop() : (recognitionRef.current.start(), setIsListening(true)); }}
              className={`absolute right-16 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600' : 'text-slate-400 hover:text-blue-600'}`}
            >
              <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
            </button>
          </div>
          <Button
            onClick={() => { handleSend(); }}
            disabled={!inputValue.trim()}
            className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
        </div>
        
        <AnimatePresence>
            {messages.length > 5 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto mt-4 text-center">
                <button 
                    onClick={onRequestFollowUpId} 
                    className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-700 transition-colors"
                >
                {t('common.followUpKey')}
                </button>
            </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}