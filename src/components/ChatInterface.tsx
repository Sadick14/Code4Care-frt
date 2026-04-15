import { useState, useRef, useEffect, useMemo } from "react";
import { Send, Sparkles, Mic, Clock, User, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useApp } from "@/providers/AppProvider";
import { ChatbotSession } from "@/services/chatbotService";
import { logger } from "@/utils/logger";

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  options?: string[];
  mode?: 'chatbot' | 'consultant';
}

interface ChatInterfaceProps {
  onRequestFollowUpId: () => void;
  clearTrigger?: number;
}

export function ChatInterface({ 
  onRequestFollowUpId, 
  clearTrigger = 0 
}: ChatInterfaceProps) {
  const { t, i18n } = useTranslation();
  const { nickname, botName, sessionId, consultantMode } = useApp();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  
  const chatSession = useMemo(() => new ChatbotSession(i18n.language), [sessionId, i18n.language]);
  const STORAGE_KEY = `room1221_chat_${sessionId}`;

  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(STORAGE_KEY);
      if (storedMessages && messages.length === 0) {
        const parsed = JSON.parse(storedMessages);
        setMessages(parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      } else if (messages.length === 0) {
        const initialText = consultantMode ? t('chat.consultantMessage') : t('chat.initialMessage');
        const quickReplies = t('chat.quickReplies', { returnObjects: true }) as Record<string, string>;
        setMessages([{
          id: '1',
          text: initialText,
          sender: 'bot',
          timestamp: new Date(),
          options: Object.values(quickReplies),
          mode: consultantMode ? 'consultant' : 'chatbot'
        }]);
      }
    } catch (error) {
      logger.error('Error loading chat history:', error);
    }
  }, [sessionId, clearTrigger, consultantMode, t, i18n.language]);

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

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text: inputValue, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    const sentText = inputValue;
    setInputValue("");
    setIsTyping(true);
    setTimeout(() => {
      const botResponseText = chatSession.getResponse(sentText, consultantMode);
      const botMsg: Message = { id: (Date.now() + 1).toString(), text: botResponseText, sender: 'bot', timestamp: new Date(), mode: consultantMode ? 'consultant' : 'chatbot' };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8faff]">
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
           <div className="flex flex-col items-center justify-center py-10 opacity-40 select-none grayscale">
              <ShieldCheck className="w-12 h-12 text-blue-600 mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] font-mono">{t('common.privacyFirst')}</p>
           </div>

          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm ${
                    message.sender === 'bot' 
                        ? (message.mode === 'consultant' ? 'bg-emerald-600' : 'bg-blue-600') 
                        : 'bg-white border border-slate-100'
                }`}>
                    {message.sender === 'bot' ? <Sparkles className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-slate-400" />}
                </div>

                <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                  <div className={`p-4 rounded-[24px] shadow-sm relative group ${
                    message.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : (message.mode === 'consultant' ? 'bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-tl-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none')
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  
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
                          onClick={() => { setInputValue(option); setTimeout(handleSend, 50); }}
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
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
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
            onClick={handleSend}
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