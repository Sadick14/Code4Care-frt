import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

interface ModernChatInterfaceProps {
  sessionId: string;
  nickname?: string;
  onMessagesChange: (messages: Message[]) => void;
}

const CHATBOT_AVATAR_SRC = "/chat2.png";

export function ModernChatInterface({ sessionId, nickname, onMessagesChange }: ModernChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadMessages();
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Improved scrolling with delay for animations and layout
    const scrollTimer = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: "smooth",
          block: "end",
          inline: "nearest"
        });
      }
    }, 100);

    return () => clearTimeout(scrollTimer);
  }, [messages, isTyping]);

  useEffect(() => {
    onMessagesChange(messages);
    saveMessages();
  }, [messages]);

  const loadMessages = () => {
    const stored = localStorage.getItem(`chat_${sessionId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setMessages(parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })));
    } else {
      // Initial welcome message
      const welcomeMsg: Message = {
        id: '1',
        text: `Hello${nickname ? ` ${nickname}` : ''}! 👋 I'm your AI assistant. How can I help you today?`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([welcomeMsg]);
    }
  };

  const saveMessages = () => {
    localStorage.setItem(`chat_${sessionId}`, JSON.stringify(messages));
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    
    // Auto-resize textarea back
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Simulate AI response
    setIsTyping(true);
    
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(userMessage.text),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateAIResponse = (_userText: string): string => {
    const responses = [
      "That's an interesting question! Let me help you with that.",
      "I understand what you're asking. Here's what I think...",
      "Great question! Based on what you've told me, I would suggest...",
      "I can definitely help with that. Let me explain...",
      "Thanks for sharing that. Here's my perspective..."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6" style={{ backgroundColor: '#F8F9FB' }}>
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%]">
                  {message.sender === 'ai' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#00C27A' }}>
                      <img
                        src={CHATBOT_AVATAR_SRC}
                        alt="Chatbot avatar"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  )}
                  
                  <div
                    className={`rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 ${
                      message.sender === 'user'
                        ? 'rounded-tr-sm'
                        : 'rounded-tl-sm'
                    }`}
                    style={{
                      backgroundColor: message.sender === 'user' ? '#00C27A' : 'white',
                      color: message.sender === 'user' ? 'white' : '#1A1A1A',
                      boxShadow: message.sender === 'ai' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    <p className="text-sm sm:text-base whitespace-pre-wrap break-words">{message.text}</p>
                    <p className={`text-xs mt-1.5 ${message.sender === 'user' ? 'text-green-100' : 'text-gray-400'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: '#E5E7EB' }}>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#1A1A1A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#00C27A' }}>
                  <img
                    src={CHATBOT_AVATAR_SRC}
                    alt="Chatbot avatar"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-white px-3 sm:px-4 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleTextareaChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="resize-none min-h-[44px] max-h-[150px] pr-4 text-sm sm:text-base"
                rows={1}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="h-11 w-11 rounded-xl flex-shrink-0 hover:opacity-90 transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#00C27A' }}
            >
              {isTyping ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}