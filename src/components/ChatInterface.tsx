import { useState, useRef, useEffect, useMemo } from "react";
import { Send, Mic, Clock, User, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useApp } from "@/providers/AppProvider";
import { ChatbotSession, ChatCitation, SafetyFlag, requestChatCompletion } from "@/services/chatbotService";
import { logger } from "@/utils/logger";

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  options?: string[];
  mode?: 'chatbot' | 'consultant';
  citations?: ChatCitation[];
  safetyFlags?: SafetyFlag[];
  languageDetected?: string;
  responseTimeMs?: number;
  source?: 'api' | 'fallback';
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
  const { nickname, botName, sessionId, consultantMode, sessionDuration, ageRange, genderIdentity, region } = useApp();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [chatLanguage, setChatLanguage] = useState(i18n.resolvedLanguage?.split('-')[0] || i18n.language || 'en');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  const chatSession = useMemo(
    () => new ChatbotSession(i18n.language, { ageRange, genderIdentity, region }),
    [sessionId, i18n.language, ageRange, genderIdentity, region],
  );
  const STORAGE_KEY = `room1221_chat_${sessionId}`;

  const formatMetadataValue = (value: unknown) => {
    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>;
      const parts = [record.title, record.source, record.label, record.reason, record.message, record.excerpt, record.text, record.url, record.page]
        .filter((part) => typeof part === 'string' && part.trim().length > 0)
        .map((part) => String(part).trim());

      if (parts.length > 0) {
        return parts.join(' • ');
      }

      try {
        return JSON.stringify(value);
      } catch {
        return 'Additional details available';
      }
    }

    return 'Additional details available';
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
    const languageCode = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];
    const rebuiltSession = new ChatbotSession(languageCode, { ageRange, genderIdentity, region });

    return existingMessages.map((message, index) => {
      if (message.sender === 'user') {
        return message;
      }

      // Keep the first bot greeting localized with localized quick replies.
      if (index === 0 || message.options?.length) {
        return {
          ...message,
          ...getInitialMessage(),
          id: message.id,
          timestamp: message.timestamp,
          mode: message.mode || (consultantMode ? 'consultant' : 'chatbot'),
        };
      }

      // Rebuild historical bot responses against prior user prompt in selected language.
      const previousUser = [...existingMessages.slice(0, index)].reverse().find((msg) => msg.sender === 'user');
      if (!previousUser) {
        return message;
      }

      return {
        ...message,
        text: rebuiltSession.getResponse(previousUser.text, message.mode === 'consultant'),
        options: undefined,
      };
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

    const localFallbackText = chatSession.getResponse(outgoingMessage, consultantMode);
    const fallbackBotId = (Date.now() + 1).toString();

    setMessages(prev => [
      ...prev,
      {
        id: fallbackBotId,
        text: localFallbackText,
        sender: 'bot',
        timestamp: new Date(),
        mode: consultantMode ? 'consultant' : 'chatbot',
        citations: [],
        safetyFlags: [],
        source: 'fallback',
      },
    ]);

    try {
      const languageCode = (i18n.resolvedLanguage || i18n.language || 'en').split('-')[0];
      const response = await requestChatCompletion({
        message: outgoingMessage,
        language: languageCode,
        session_id: sessionId,
      });

      const answerText = response.answer.trim();

      if (answerText) {
        setMessages(prev => prev.map((message) => {
          if (message.id !== fallbackBotId) {
            return message;
          }

          return {
            ...message,
            text: answerText,
            citations: response.citations,
            safetyFlags: response.safety_flags,
            languageDetected: response.language_detected,
            responseTimeMs: response.response_time_ms,
            source: 'api',
          };
        }));
      } else {
        logger.warn('Chat API returned an empty answer, using local fallback.', response);
      }
    } catch (error) {
      logger.error('Chat API failed, keeping local fallback response:', error);
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
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>

                  {message.sender === 'bot' && (
                    <div className="mt-3 w-full space-y-2">
                      {message.safetyFlags && message.safetyFlags.length > 0 && (
                        <Alert variant="destructive" className="rounded-2xl border-red-200 bg-red-50/80 text-red-950 shadow-sm">
                          <AlertTitle className="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                            Safety flag
                          </AlertTitle>
                          <AlertDescription className="text-xs text-red-900/90">
                            {message.safetyFlags.map((flag, index) => (
                              <div key={`${message.id}-flag-${index}`} className="mt-1 first:mt-0">
                                {formatMetadataValue(flag)}
                              </div>
                            ))}
                          </AlertDescription>
                        </Alert>
                      )}

                      {message.citations && message.citations.length > 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
                          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                            Citations
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {message.citations.map((citation, index) => (
                              <span
                                key={`${message.id}-citation-${index}`}
                                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-600"
                              >
                                {formatMetadataValue(citation)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {(message.responseTimeMs !== undefined || message.languageDetected || message.source) && (
                        <p className="px-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                          {message.responseTimeMs !== undefined && `Answered in ${message.responseTimeMs} ms`}
                          {message.responseTimeMs !== undefined && message.languageDetected ? ' • ' : ''}
                          {message.languageDetected ? `Language: ${message.languageDetected}` : ''}
                          {message.source === 'fallback' ? `${message.responseTimeMs !== undefined || message.languageDetected ? ' • ' : ''}Fallback used` : ''}
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
              className="h-14 rounded-2xl pl-6 pr-14 bg-slate-50 border-slate-100 focus:bg-white focus:border-blue-400 transition-all text-sm font-medium"
            />
            <button
              onClick={() => { if(!recognitionRef.current) return; isListening ? recognitionRef.current.stop() : (recognitionRef.current.start(), setIsListening(true)); }}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-colors ${isListening ? 'bg-red-100 text-red-600' : 'text-slate-400 hover:text-blue-600'}`}
            >
              <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
            </button>
          </div>
          <Button
            onClick={() => { handleSend(); }}
            disabled={!inputValue.trim()}
            className="h-14 w-14 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-90 disabled:opacity-50"
          >
            <Send className="w-6 h-6 text-white" />
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