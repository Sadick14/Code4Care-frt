import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Mic } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";
import { getBotResponse, getFollowUpSuggestions } from "../services/chatbotService";

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  options?: string[];
  mode?: 'chatbot' | 'consultant'; // Track which mode generated this message
}

interface ChatInterfaceProps {
  selectedLanguage: string;
  onRequestFollowUpId: () => void;
  isGuest?: boolean;
  username?: string;
  botName?: string;
  sessionId?: string;
  clearTrigger?: number; // Used to trigger chat clear from parent
  consultantMode?: boolean; // Whether user is chatting with a consultant
}

export function ChatInterface({ 
  selectedLanguage, 
  onRequestFollowUpId, 
  isGuest = true, 
  username, 
  botName = "Room 1221",
  sessionId = "default",
  clearTrigger = 0,
  consultantMode = false
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const STORAGE_KEY = `room1221_chat_${sessionId}`;

  const content = {
    en: {
      placeholder: "Type your question...",
      send: "Send",
      voiceInput: "Tap to speak",
      voiceListening: "Listening...",
      statusGuest: "Anonymous chat",
      statusLoggedIn: "Logged in as",
      initialMessage: "Hi! I'm here to help you with any questions about sexual and reproductive health. Everything we discuss is private and confidential. What would you like to know?",
      consultantMessage: "Hi! I'm a Room 1221 consultant. I'm here to provide personalized support and guidance on sexual and reproductive health matters. Your conversation is completely private and confidential. How can I help you today?",
      quickReplies: [
        "Tell me about contraception",
        "What are STIs?",
        "What are signs of pregnancy?"
      ]
    },
    twi: {
      placeholder: "Kyerɛw wo nsɛm ha...",
      send: "Soma",
      voiceInput: "Mia sɛ wobɛkasa",
      voiceListening: "Meretie...",
      statusGuest: "Woreka nkɔmmɔ a wonnim wo",
      statusLoggedIn: "Wokɔ mu sɛ",
      initialMessage: "Akwaaba! Mewɔ ha sɛ meboa wo wɔ nsɛm a ɛfa nna ne awo ho akwahosan ho. Biribiara a yɛbɛka no yɛ kokoam. Dɛn na wopɛ sɛ wuhu?",
      consultantMessage: "Akwaaba! Meyɛ Room 1221 ɔfotufoɔ. Mewɔ ha sɛ mema wo mmoa ne akwankyerɛ wɔ nna ne awo ho akwahosan ho. Wo nkɔmmɔbɔ yɛ kokoam koraa. Mɛtumi aboa wo dɛn?",
      quickReplies: [
        "Ka contraception ho asɛm kyerɛ me",
        "STI yɛ dɛn?",
        "Nyinsɛn nsɛnkyerɛnne bɛn na ɛwɔ?"
      ]
    },
    ewe: {
      placeholder: "Ŋlɔ wò nyabiase ɖe afisia...",
      send: "Dɔ",
      voiceInput: "Zi be nàƒo nu",
      voiceListening: "Mele ɖoɖom...",
      statusGuest: "Èle nuƒoƒo me ɣaɣlalãtɔe",
      statusLoggedIn: "Ège ɖe eme abe",
      initialMessage: "Alo! Meli afii be makpe ɖe ŋuwò le nyabiase ɖesiaɖe si ku ɖe nɔnɔme kple vidzidzi ƒe lãmesɛ ŋuti. Nu sia nu si míaƒo nu tso eŋu nye ɣaɣla. Nuka nèdi be yeanya?",
      consultantMessage: "Alo! Menye Room 1221 aɖaŋuɖola. Meli afii be mana kpekpeɖeŋu kple mɔfiame tɔxɛ le nɔnɔme kple vidzidzi ƒe lãmesɛ ŋuti. Wò nuƒoƒo nye ɣaɣla bliboa. Aleke mate ŋu akpe ɖe ŋuwò egbe?",
      quickReplies: [
        "Gblɔ contraception ŋuti nam",
        "STI nye nuka?",
        "Fufɔfɔ ƒe dzesiwo kae nye?"
      ]
    },
    ga: {
      placeholder: "Ŋlɔ wo nsɛm lɛ...",
      send: "Shia",
      voiceInput: "Mi be o kasa",
      voiceListening: "Mi tie...",
      statusGuest: "O yɛɔ kɛ amɛ nyɛ oo",
      statusLoggedIn: "O kɔ mu",
      initialMessage: "Mɔɔ baa! Mi wɔ lɛ be mi boa wo wɔ bibi ni ɛfa nna lɛ awo akwahosan. Biribiara ni yɛ ka yɛ kokoam. Dɛn ni o pɛ sɛ o hu?",
      consultantMessage: "Mɔɔ baa! Mi yɛ Room 1221 ɔfotufoɔ. Mi wɔ lɛ be mi ma wo mmoa lɛ akwankyerɛ wɔ nna lɛ awo akwahosan. Wo yɛɔbɔɔ yɛ kokoam koraa. Mɛ tumi boa wo dɛn?",
      quickReplies: [
        "Ka contraception ho asɛm kyerɛ mi",
        "STI yɛ dɛn?",
        "Nyinsɛn nsɛnkyerɛnne bɛn ni ɛwɔ?"
      ]
    }
  };

  const lang = content[selectedLanguage as keyof typeof content] || content.en;

  useEffect(() => {
    // Update initial message when language changes or consultant mode changes
    const initialMsg = consultantMode ? lang.consultantMessage : lang.initialMessage;
    
    if (messages.length > 0 && messages[0].sender === 'bot') {
      setMessages(prev => {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          text: initialMsg,
          options: lang.quickReplies,
          mode: consultantMode ? 'consultant' : 'chatbot'
        };
        return updated;
      });
    } else if (messages.length === 0) {
      // Initial bot message
      setMessages([{
        id: '1',
        text: initialMsg,
        sender: 'bot',
        timestamp: new Date(),
        options: lang.quickReplies,
        mode: consultantMode ? 'consultant' : 'chatbot'
      }]);
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      
      // Set language based on selected language with fallbacks
      const langCodes: { [key: string]: string } = {
        'en': 'en-US',
        'twi': 'en-GH', // Fallback to English Ghana for Twi
        'ewe': 'en-GH',  // Fallback to English Ghana for Ewe
        'ga': 'en-GH'  // Fallback to English Ghana for Ga
      };
      recognitionRef.current.lang = langCodes[selectedLanguage] || 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [selectedLanguage, consultantMode]);

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

  // Load chat history from localStorage on mount and when clearTrigger changes
  useEffect(() => {
    console.log('🔄 [CHAT] Loading chat history from localStorage...');
    console.log('🔑 [CHAT] Storage key:', STORAGE_KEY);
    console.log('🔢 [CHAT] Clear trigger:', clearTrigger);
    
    try {
      const storedMessages = localStorage.getItem(STORAGE_KEY);
      
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
        console.log('✅ [CHAT] Loaded', messagesWithDates.length, 'messages from storage');
      } else {
        // Initialize with welcome message
        const welcomeMessage: Message = {
          id: '1',
          text: lang.initialMessage,
          sender: 'bot',
          timestamp: new Date(),
          options: lang.quickReplies,
          mode: 'chatbot'
        };
        setMessages([welcomeMessage]);
        console.log('✅ [CHAT] No stored messages, initialized with welcome message');
      }
    } catch (error) {
      console.error('🔴 [CHAT] Error loading messages from localStorage:', error);
      // Initialize with welcome message on error
      const welcomeMessage: Message = {
        id: '1',
        text: lang.initialMessage,
        sender: 'bot',
        timestamp: new Date(),
        options: lang.quickReplies,
        mode: 'chatbot'
      };
      setMessages([welcomeMessage]);
    }
  }, [clearTrigger, sessionId]); // Re-run when clearTrigger or sessionId changes

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      console.log('💾 [CHAT] Saving', messages.length, 'messages to localStorage');
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        console.log('✅ [CHAT] Messages saved successfully');
      } catch (error) {
        console.error('🔴 [CHAT] Error saving messages to localStorage:', error);
      }
    }
  }, [messages, STORAGE_KEY]);

  const handleSend = () => {
    try {
      console.log('📤 [CHAT] Sending message:', inputValue);
      
      if (!inputValue.trim()) {
        console.log('⚠️ [CHAT] Empty message, ignoring');
        return;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputValue,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      const sentMessage = inputValue; // Store before clearing
      setInputValue("");
      setIsTyping(true);

      console.log('✅ [CHAT] User message added to chat');

      // Simulate bot response with typing indicator
      setTimeout(() => {
        try {
          console.log('🤖 [CHAT] Getting bot response...');
          const botResponseText = getBotResponse(sentMessage, selectedLanguage, consultantMode);
          
          const botResponse: Message = {
            id: (Date.now() + 1).toString(),
            text: botResponseText,
            sender: 'bot',
            timestamp: new Date(),
            mode: consultantMode ? 'consultant' : 'chatbot'
          };
          
          setMessages(prev => [...prev, botResponse]);
          setIsTyping(false);
          console.log('✅ [CHAT] Bot response added successfully');
        } catch (error) {
          console.error('🔴 [CHAT] Error generating bot response:', error);
          
          // Add error message to chat
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: "I'm having trouble responding right now. Please try again in a moment.",
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
          setIsTyping(false);
        }
      }, 1500 + Math.random() * 1000);
    } catch (error) {
      console.error('🔴 [CHAT] Error in handleSend:', error);
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <div className="flex flex-col h-full relative" style={{ background: 'linear-gradient(to bottom, #FFFFFF 0%, #F8FAFE 100%)' }}>
      {/* Messages - Scrollable area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-2">
        <div className="max-w-3xl mx-auto space-y-4 pb-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] sm:max-w-[75%] ${message.sender === 'bot' ? 'space-y-3' : ''}`}>
                  {/* Bot Avatar with Custom Name */}
                  {message.sender === 'bot' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ 
                          background: message.mode === 'consultant'
                            ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                            : 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
                          boxShadow: message.mode === 'consultant'
                            ? '0 2px 8px rgba(16, 185, 129, 0.2)'
                            : '0 2px 8px rgba(0, 72, 255, 0.2)'
                        }}
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium" style={{ color: message.mode === 'consultant' ? '#059669' : '#0048ff' }}>
                        {message.mode === 'consultant' ? `👨‍⚕️ ${botName} Consultant` : `${botName}`}
                      </span>
                    </div>
                  )}
                  
                  <div
                    className={`rounded-3xl px-5 py-3.5 ${
                      message.sender === 'user' ? 'rounded-br-md' : 'rounded-tl-md'
                    }`}
                    style={{
                      backgroundColor: message.sender === 'user' 
                        ? '#0048ff' 
                        : message.mode === 'consultant'
                          ? '#F0FDF4'
                          : 'white',
                      color: message.sender === 'user' 
                        ? 'white' 
                        : message.mode === 'consultant'
                          ? '#065F46'
                          : '#1A1A1A',
                      border: message.mode === 'consultant' ? '1px solid #86EFAC' : 'none',
                      boxShadow: message.sender === 'bot' 
                        ? message.mode === 'consultant'
                          ? '0 2px 12px rgba(16, 185, 129, 0.1)'
                          : '0 2px 12px rgba(0, 0, 0, 0.06)' 
                        : '0 4px 16px rgba(0, 72, 255, 0.2)'
                    }}
                  >
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
                    <p className={`text-xs mt-2 ${
                      message.sender === 'user' 
                        ? 'text-blue-100' 
                        : message.mode === 'consultant'
                          ? 'text-green-600/60'
                          : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {/* Quick Reply Options */}
                  {message.options && (
                    <div className="flex flex-wrap gap-2 mt-3 ml-10">
                      {message.options.map((option, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleQuickReply(option)}
                          className="px-4 py-2.5 rounded-full text-sm transition-all hover:scale-105 active:scale-95"
                          style={{ 
                            backgroundColor: 'white',
                            color: '#0048ff',
                            border: '1.5px solid #E8ECFF',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                          }}
                        >
                          {option}
                        </motion.button>
                      ))}
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
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ 
                    background: consultantMode 
                      ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
                    boxShadow: consultantMode
                      ? '0 2px 8px rgba(16, 185, 129, 0.2)'
                      : '0 2px 8px rgba(0, 72, 255, 0.2)'
                  }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div 
                  className="rounded-3xl rounded-tl-md px-5 py-4"
                  style={{ 
                    backgroundColor: consultantMode ? '#F0FDF4' : 'white',
                    border: consultantMode ? '1px solid #86EFAC' : 'none',
                    boxShadow: consultantMode 
                      ? '0 2px 12px rgba(16, 185, 129, 0.1)'
                      : '0 2px 12px rgba(0, 0, 0, 0.06)' 
                  }}
                >
                  <div className="flex gap-1.5">
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce" 
                      style={{ 
                        backgroundColor: consultantMode ? '#10B981' : '#0048ff', 
                        animationDelay: '0ms' 
                      }}
                    ></div>
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce" 
                      style={{ 
                        backgroundColor: consultantMode ? '#10B981' : '#0048ff', 
                        animationDelay: '150ms' 
                      }}
                    ></div>
                    <div 
                      className="w-2 h-2 rounded-full animate-bounce" 
                      style={{ 
                        backgroundColor: consultantMode ? '#10B981' : '#0048ff', 
                        animationDelay: '300ms' 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed/Sticky at bottom */}
      <div className="flex-shrink-0 sticky bottom-0 p-4 bg-white border-t" style={{ borderColor: '#E8ECFF' }}>
        <div className="max-w-3xl mx-auto">
          {/* Voice Listening Indicator */}
          {isListening && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 flex items-center justify-center gap-2 py-2 px-4 rounded-full mx-auto w-fit"
              style={{ 
                background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
                boxShadow: '0 4px 16px rgba(0, 72, 255, 0.3)'
              }}
            >
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                <div className="w-1 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '450ms' }}></div>
                <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
              </div>
              <span className="text-white text-sm">{lang.voiceListening}</span>
            </motion.div>
          )}
          
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={lang.placeholder}
                className="rounded-full h-12 pr-12 border-2 transition-all focus:shadow-lg"
                style={{ 
                  borderColor: '#E8ECFF',
                  backgroundColor: '#F8FAFE'
                }}
              />
              <button
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
                  isListening 
                    ? 'animate-pulse' 
                    : 'hover:bg-blue-50'
                }`}
                onClick={handleVoiceInput}
                type="button"
                title={isListening ? lang.voiceListening : lang.voiceInput}
                style={{
                  backgroundColor: isListening ? '#E8ECFF' : 'transparent'
                }}
              >
                <Mic className={`w-5 h-5 ${isListening ? 'text-[#0048ff]' : 'text-gray-400'}`} />
              </button>
            </div>
            <Button
              onClick={handleSend}
              size="icon"
              className="rounded-full h-12 w-12 flex-shrink-0 transition-all hover:scale-105 active:scale-95"
              style={{ 
                background: inputValue.trim() 
                  ? 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)' 
                  : '#E8ECFF',
                boxShadow: inputValue.trim() 
                  ? '0 4px 16px rgba(0, 72, 255, 0.3)' 
                  : 'none'
              }}
              disabled={!inputValue.trim()}
            >
              <Send className={`w-5 h-5 ${inputValue.trim() ? 'text-white' : 'text-gray-400'}`} />
            </Button>
          </div>
          
          {messages.length > 4 && !isGuest && (
            <button
              onClick={onRequestFollowUpId}
              className="mt-3 text-sm transition-all hover:underline"
              style={{ color: '#0048ff' }}
            >
              Get Follow-up ID
            </button>
          )}
        </div>
      </div>
    </div>
  );
}