import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Shield, MessageCircle, Sparkles, ChevronRight, Bot } from "lucide-react";

interface OnboardingScreenProps {
  onComplete: (botName: string) => void;
  selectedLanguage: string;
}

export default function OnboardingScreen({ onComplete, selectedLanguage }: OnboardingScreenProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [botName, setBotName] = useState("");

  const content = {
    en: {
      page1: {
        title: "Welcome to Room 1221",
        subtitle: "Your Safe Space for SRHR Support",
        features: [
          {
            icon: Shield,
            title: "100% Anonymous",
            description: "No personal data collected. Your privacy is our priority."
          },
          {
            icon: MessageCircle,
            title: "Expert Guidance",
            description: "Get accurate SRHR information from trusted sources."
          },
          {
            icon: Heart,
            title: "Youth-Friendly",
            description: "Designed specifically for young people in Ghana."
          }
        ],
        nextButton: "Get Started"
      },
      page2: {
        title: "Meet Your AI Companion",
        subtitle: "Give your chatbot a friendly name!",
        placeholder: "e.g., Ada, Kojo, Friend...",
        label: "What would you like to call me?",
        skipButton: "Skip (Use default name)",
        continueButton: "Continue",
        defaultName: "Friend"
      }
    },
    twi: {
      page1: {
        title: "Akwaaba kɔ Room 1221",
        subtitle: "Wo Ahobammɔ Beaeɛ ma SRHR Mmoa",
        features: [
          {
            icon: Shield,
            title: "Ahobammɔ 100%",
            description: "Yɛnnboaboa wo nsɛm. Wo ahobammɔ ho hia yɛn paa."
          },
          {
            icon: MessageCircle,
            title: "Nimdeɛ a Ɛyɛ Pɛpɛɛpɛ",
            description: "Nya SRHR nsɛm a wɔtumi de ho to so."
          },
          {
            icon: Heart,
            title: "Mmerante & Mmabaa Kwan",
            description: "Wɔayɛ no ama Ghana mmerante ne mmabaa."
          }
        ],
        nextButton: "Fi Aseɛ"
      },
      page2: {
        title: "Hyia Wo AI Adamfo",
        subtitle: "Ma chatbot no din a ɛyɛ anigye!",
        placeholder: "sɛ nhwɛsoɔ: Ada, Kojo, Adamfo...",
        label: "Dɛn na wopɛ sɛ wofrɛ me?",
        skipButton: "Twa Mu (Fa din a ɛwɔ hɔ dada)",
        continueButton: "Kɔ So",
        defaultName: "Adamfo"
      }
    },
    ewe: {
      page1: {
        title: "Woezɔ va Room 1221",
        subtitle: "Wò Dedinɔnɔƒe na SRHR Kpekpeɖeŋu",
        features: [
          {
            icon: Shield,
            title: "Ɣaɣlaɣaɣla 100%",
            description: "Womewɔa wò nyatakakawo o. Wò ɣaɣlaɣa nye míaƒe taɖodzinu."
          },
          {
            icon: MessageCircle,
            title: "Aɖaŋunyagbalɔla",
            description: "Xɔ SRHR nyatakaka tututu tso teƒe siwo dzi woaka ɖo."
          },
          {
            icon: Heart,
            title: "Ɖekakpuiwo Ƒe Mɔ",
            description: "Wowɔe tɔxɛ na Ghana ɖekakpuiwo."
          }
        ],
        nextButton: "Dze Egɔme"
      },
      page2: {
        title: "Do Go Wò AI Xɔlɔ̃",
        subtitle: "Tsɔ ŋkɔ nyui aɖe na wò chatbot!",
        placeholder: "kpɔɖeŋu: Ada, Kojo, Xɔlɔ̃...",
        label: "Alesi nèdi be yeayɔm?",
        skipButton: "Dzo Le Eŋu (Zã ŋkɔ si li xoxo)",
        continueButton: "Yi Edzi",
        defaultName: "Xɔlɔ̃"
      }
    },
    ga: {
      page1: {
        title: "Mɔɔ baa kɔ Room 1221",
        subtitle: "Wo Ahobammɔ Beaeɛ ma SRHR Mmoa",
        features: [
          {
            icon: Shield,
            title: "Ahobammɔ 100%",
            description: "Yɛ nnboaboa wo nsɛm. Wo ahobammɔ ho hia yɛn koraa."
          },
          {
            icon: MessageCircle,
            title: "Nimdeɛ ni Ɛyɛ Pɛpɛɛpɛ",
            description: "Nya SRHR nsɛm ni wɔtumi de ho to so."
          },
          {
            icon: Heart,
            title: "Mmerante & Mmabaa Kwan",
            description: "Wɔayɛ no ama Ghana mmerante lɛ mmabaa."
          }
        ],
        nextButton: "Fi Aseɛ"
      },
      page2: {
        title: "Hyia Wo AI Adamfo",
        subtitle: "Ma chatbot no din ni ɛyɛ anigye!",
        placeholder: "sɛ nhwɛsoɔ: Ada, Kojo, Adamfo...",
        label: "Dɛn na wopɛ sɛ wofrɛ me?",
        skipButton: "Twa Mu (Fa din ni ɛwɔ hɔ dada)",
        continueButton: "Kɔ So",
        defaultName: "Adamfo"
      }
    }
  };

  const lang = content[selectedLanguage as keyof typeof content] || content.en;

  const handleContinue = () => {
    if (currentPage === 1) {
      setCurrentPage(2);
    } else {
      const finalBotName = botName.trim() || lang.page2.defaultName;
      onComplete(finalBotName);
    }
  };

  const handleSkip = () => {
    onComplete(lang.page2.defaultName);
  };

  return (
    <div 
      className="h-screen flex items-center justify-center p-3 sm:p-4 overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 50%, #00d4ff 100%)',
      }}
    >
      <AnimatePresence mode="wait">
        {currentPage === 1 ? (
          <motion.div
            key="page1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full h-full max-h-[95vh] flex items-center"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 w-full overflow-y-auto max-h-full">
              {/* Header */}
              <div className="text-center mb-4 sm:mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 md:mb-6 rounded-xl sm:rounded-2xl flex items-center justify-center"
                  style={{ 
                    background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
                    boxShadow: '0 8px 24px rgba(0, 72, 255, 0.3)'
                  }}
                >
                  <Shield className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                </motion.div>
                <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl" style={{ color: '#0048ff' }}>
                  {lang.page1.title}
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                  {lang.page1.subtitle}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-4 sm:mb-6 md:mb-8">
                {lang.page1.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-blue-50 transition-colors"
                  >
                    <div 
                      className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: '#e6f0ff' }}
                    >
                      <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#0048ff' }} />
                    </div>
                    <div>
                      <h3 className="mb-1 text-base sm:text-lg" style={{ color: '#1A1A1A' }}>
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Next Button */}
              <Button
                onClick={handleContinue}
                className="w-full rounded-full h-11 sm:h-12 md:h-14 text-base sm:text-lg"
                style={{ 
                  background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
                  color: 'white'
                }}
              >
                {lang.page1.nextButton}
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>

              {/* Page Indicator */}
              <div className="flex justify-center gap-2 mt-4 sm:mt-6">
                <div className="w-8 h-2 rounded-full" style={{ backgroundColor: '#0048ff' }} />
                <div className="w-2 h-2 rounded-full bg-gray-300" />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="page2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full h-full max-h-[95vh] flex items-center"
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 w-full overflow-y-auto max-h-full">
              {/* Header */}
              <div className="text-center mb-4 sm:mb-6 md:mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto mb-3 sm:mb-4 md:mb-6 rounded-xl sm:rounded-2xl flex items-center justify-center relative"
                  style={{ 
                    background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
                    boxShadow: '0 8px 24px rgba(0, 72, 255, 0.3)'
                  }}
                >
                  <Bot className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-400 flex items-center justify-center"
                  >
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </motion.div>
                </motion.div>
                <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl" style={{ color: '#0048ff' }}>
                  {lang.page2.title}
                </h1>
                <p className="text-gray-600 text-base sm:text-lg">
                  {lang.page2.subtitle}
                </p>
              </div>

              {/* Bot Name Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4 sm:mb-6 md:mb-8"
              >
                <label className="block mb-2 sm:mb-3 text-gray-700 text-sm sm:text-base">
                  {lang.page2.label}
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={botName}
                    onChange={(e) => setBotName(e.target.value)}
                    placeholder={lang.page2.placeholder}
                    className="h-11 sm:h-12 md:h-14 pl-10 sm:pl-12 pr-4 rounded-xl text-base sm:text-lg border-2 focus:border-blue-500"
                    maxLength={20}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleContinue();
                      }
                    }}
                  />
                  <Bot className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                {botName.trim() && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 text-center"
                  >
                    Nice to meet you! You can call me <span style={{ color: '#0048ff', fontWeight: 600 }}>{botName.trim()}</span> 👋
                  </motion.p>
                )}
              </motion.div>

              {/* Buttons */}
              <div className="space-y-2 sm:space-y-3">
                <Button
                  onClick={handleContinue}
                  className="w-full rounded-full h-11 sm:h-12 md:h-14 text-base sm:text-lg"
                  style={{ 
                    background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
                    color: 'white'
                  }}
                >
                  {lang.page2.continueButton}
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  className="w-full h-10 sm:h-12 text-sm sm:text-base text-gray-600 hover:text-gray-900"
                >
                  {lang.page2.skipButton}
                </Button>
              </div>

              {/* Page Indicator */}
              <div className="flex justify-center gap-2 mt-4 sm:mt-6">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <div className="w-8 h-2 rounded-full" style={{ backgroundColor: '#0048ff' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}