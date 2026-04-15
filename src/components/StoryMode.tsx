import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, X, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function StoryMode() {
  const { t } = useTranslation();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);

  const stories = t('stories.list', { returnObjects: true }) as any[];
  const story = stories[currentIdx];

  const handleChoice = (idx: number) => {
    setSelectedChoice(idx);
  };

  const nextStory = () => {
    setSelectedChoice(null);
    setCurrentIdx((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setSelectedChoice(null);
    setCurrentIdx((prev) => (prev - 1 + stories.length) % stories.length);
  };

  return (
    <div className="h-full overflow-y-auto p-4 bg-slate-50">
      <div className="max-w-2xl mx-auto pb-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">{t('stories.title')}</h1>
          <p className="text-gray-500">{t('stories.subtitle')}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="p-8 border-none shadow-xl rounded-3xl overflow-hidden relative">
              {/* Progress bar */}
              <div className="absolute top-0 left-0 h-1 bg-blue-100 w-full">
                <div 
                  className="h-full bg-blue-600 transition-all duration-500" 
                  style={{ width: `${((currentIdx + 1) / stories.length) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between mb-8">
                <Button variant="ghost" size="icon" onClick={prevStory} className="rounded-full">
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </Button>
                <div className="text-center">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{t('common.scenario', 'Scenario')} {currentIdx + 1}</span>
                  <h2 className="text-xl font-bold text-gray-900 mt-1">{story.title}</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={nextStory} className="rounded-full">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </Button>
              </div>

              <div className="mb-10 text-lg text-gray-700 leading-relaxed bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                {story.scenario}
              </div>

              <div className="space-y-4">
                {story.choices.map((choice: string, idx: number) => {
                  const isSelected = selectedChoice === idx;
                  const isCorrect = idx === story.correct;
                  const showFeedback = selectedChoice !== null;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleChoice(idx)}
                      disabled={showFeedback}
                      className={`w-full p-4 rounded-2xl text-left border-2 transition-all group relative overflow-hidden ${
                        isSelected 
                          ? (isCorrect ? 'border-emerald-500 bg-emerald-50' : 'border-red-500 bg-red-50')
                          : (showFeedback ? 'opacity-40 border-gray-100' : 'border-gray-100 hover:border-blue-400 hover:bg-white')
                      }`}
                    >
                      <div className="flex gap-4 items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isSelected 
                            ? (isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white')
                            : 'bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>{choice}</span>
                      </div>
                      
                      {isSelected && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="mt-4 pt-4 border-t border-black/5 text-sm"
                        >
                          <div className="flex gap-2">
                             {isCorrect ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
                             <p className={isCorrect ? 'text-emerald-700' : 'text-red-700'}>
                               {story.feedback[idx]}
                             </p>
                          </div>
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedChoice !== null && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex justify-center">
                  <Button onClick={nextStory} className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 h-12">
                    {t('common.nextScenario', 'Next Scenario')}
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}