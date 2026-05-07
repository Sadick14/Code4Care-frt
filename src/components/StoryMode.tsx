import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  Baby,
  Brain,
  Check,
  ChevronLeft,
  ChevronRight,
  Droplets,
  HeartHandshake,
  HeartPulse,
  Pill,
  RotateCcw,
  ShieldCheck,
  TestTube2,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { getStoryModules, StoryModule } from "@/data/storyModules";
import { FeatureAnalyticsService } from "@/services";
import { useApp } from "@/providers/AppProvider";
import { logger } from "@/utils/logger";

const STORY_MODULE_ICONS: Record<string, { icon: LucideIcon; accent: string; background: string }> = {
  "puberty-body-changes": {
    icon: Baby,
    accent: "text-[#0F4CC9]",
    background: "from-[#EAF2FF] to-[#D9E9FF]",
  },
  "menstrual-health": {
    icon: Droplets,
    accent: "text-[#C42772]",
    background: "from-[#FFEAF4] to-[#FAD1E8]",
  },
  "consent-boundaries": {
    icon: ShieldCheck,
    accent: "text-[#16794D]",
    background: "from-[#E7FFF3] to-[#CFF6E1]",
  },
  "contraception-family-planning": {
    icon: Pill,
    accent: "text-[#7B3FE4]",
    background: "from-[#F0E9FF] to-[#D7C7FF]",
  },
  "sti-prevention-testing": {
    icon: TestTube2,
    accent: "text-[#C14D11]",
    background: "from-[#FFF1E7] to-[#FFD8BF]",
  },
  "pregnancy-options-care": {
    icon: HeartPulse,
    accent: "text-[#BE2D4E]",
    background: "from-[#FFE7EE] to-[#F9C2D0]",
  },
  "healthy-relationships": {
    icon: HeartHandshake,
    accent: "text-[#2563EB]",
    background: "from-[#E9F3FF] to-[#CFE1FF]",
  },
  "mental-health-help-seeking": {
    icon: Brain,
    accent: "text-[#6D28D9]",
    background: "from-[#F1EAFF] to-[#DCCEFF]",
  },
};

export function StoryMode() {
  const { t, i18n } = useTranslation();
  const { sessionId } = useApp();
  const activeLanguage = (i18n.resolvedLanguage || i18n.language || "en").split("-")[0];

  const modules = useMemo(() => getStoryModules(activeLanguage), [activeLanguage]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>(modules[0]?.id ?? "");
  const [viewMode, setViewMode] = useState<"catalog" | "quiz">("catalog");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<number | undefined>>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!modules.length) return;
    if (!modules.some((module) => module.id === selectedModuleId)) {
      setSelectedModuleId(modules[0].id);
    }
  }, [modules, selectedModuleId]);

  const currentModule = useMemo<StoryModule | undefined>(() => {
    return modules.find((module) => module.id === selectedModuleId) || modules[0];
  }, [modules, selectedModuleId]);

  const stories = currentModule?.stories ?? [];

  const story = stories[currentIdx];

  const answeredCount = answers.filter((answer) => typeof answer === "number").length;
  const score = answers.reduce((total: number, selected, idx) => {
    if (typeof selected !== "number") return total;
    const item = stories[idx];
    if (!item) return total;
    return total + (selected === item.correct ? 1 : 0);
  }, 0);

  const isCompleted = stories.length > 0 && answeredCount === stories.length;
  const scenarioProgress = stories.length > 0 ? ((currentIdx + 1) / stories.length) * 100 : 0;

  useEffect(() => {
    setCurrentIdx(0);
    setSelectedChoice(null);
    setAnswers([]);
    setShowCelebration(false);
  }, [selectedModuleId]);

  useEffect(() => {
    setSelectedChoice(answers[currentIdx] ?? null);
  }, [currentIdx, answers]);

  // Track module completion
  useEffect(() => {
    if (isCompleted && sessionId && selectedModuleId) {
      const logCompletion = async () => {
        try {
          const module = modules.find(m => m.id === selectedModuleId);
          await FeatureAnalyticsService.logStoryEvent({
            session_id: sessionId,
            story_id: selectedModuleId,
            event_type: 'completed',
            module_name: module?.title || selectedModuleId,
            score_achieved: score,
            total_questions: stories.length,
          });
          logger.info(`Story module completed: ${selectedModuleId} - Score: ${score}/${stories.length}`);
        } catch (error) {
          logger.error('Failed to log story completion event', error);
        }
      };

      logCompletion();
    }
  }, [isCompleted, sessionId, selectedModuleId, score, stories.length, modules]);

  const handleChoice = async (idx: number) => {
    if (selectedChoice !== null || isCompleted) return;

    setSelectedChoice(idx);
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIdx] = idx;
      return next;
    });

    const isCorrect = idx === story?.correct;

    // Show celebration if correct answer
    if (isCorrect) {
      setShowCelebration(true);
      // Auto-hide celebration after 1.5 seconds
      setTimeout(() => setShowCelebration(false), 1500);
    }

    // Track answer event
    if (sessionId && story) {
      try {
        await FeatureAnalyticsService.logStoryEvent({
          session_id: sessionId,
          story_id: selectedModuleId,
          event_type: isCorrect ? 'question_correct' : 'question_incorrect',
          module_name: currentModule?.title || selectedModuleId,
          question_index: currentIdx,
          choice_selected: idx,
        });
      } catch (error) {
        logger.error('Failed to log story answer event', error);
      }
    }
  };

  const nextStory = () => {
    if (currentIdx >= stories.length - 1) return;
    setCurrentIdx((prev) => prev + 1);
  };

  const prevStory = () => {
    if (currentIdx <= 0) return;
    setCurrentIdx((prev) => prev - 1);
  };

  const restartStories = () => {
    setCurrentIdx(0);
    setSelectedChoice(null);
    setAnswers([]);
    setShowCelebration(false);
  };

  const startModuleQuiz = async (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setCurrentIdx(0);
    setSelectedChoice(null);
    setAnswers([]);
    setShowCelebration(false);
    setViewMode("quiz");

    // Track story module start
    if (sessionId) {
      try {
        const module = modules.find(m => m.id === moduleId);
        await FeatureAnalyticsService.logStoryEvent({
          session_id: sessionId,
          story_id: moduleId,
          event_type: 'started',
          module_name: module?.title || moduleId,
        });
        logger.info(`Story module started: ${moduleId}`);
      } catch (error) {
        logger.error('Failed to log story start event', error);
      }
    }
  };

  const backToModules = () => {
    setViewMode("catalog");
    setCurrentIdx(0);
    setSelectedChoice(null);
    setAnswers([]);
    setShowCelebration(false);
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-[#f2f7ff] via-white to-[#eef5ff] p-4">
      <div className={`${viewMode === "catalog" ? "max-w-6xl" : "max-w-3xl"} mx-auto pb-12`}>
        <div className="mb-8 rounded-3xl border border-[#CFE0FF] bg-gradient-to-r from-[#0048ff] via-[#0066ff] to-[#00a3ff] p-6 text-white shadow-xl shadow-blue-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">{t("stories.title", "Story Mode")}</h1>
              <p className="text-white/85 text-sm">{t("stories.subtitle", "Learn through interactive scenarios")}</p>
              <p className="text-white/75 text-xs mt-2">
                {viewMode === "catalog"
                  ? t("stories.moduleHint", "Choose an SRH learning module below.")
                  : t("stories.quizHint", "Complete the selected module quiz.")}
              </p>
            </div>
            {viewMode === "quiz" && (
              <div className="rounded-2xl bg-white/15 border border-white/30 px-4 py-3 text-center min-w-[112px]">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/70">{t("stories.score", "Score")}</p>
                <p className="text-2xl font-bold leading-none mt-1">{score}/{stories.length}</p>
              </div>
            )}
          </div>
        </div>

        {viewMode === "catalog" ? (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => {
              const moduleIcon = STORY_MODULE_ICONS[module.id] ?? {
                icon: Baby,
                accent: "text-[#0F4CC9]",
                background: "from-[#EAF2FF] to-[#D9E9FF]",
              };
              const ModuleIcon = moduleIcon.icon;

              return (
                <Card
                  key={module.id}
                  onClick={() => startModuleQuiz(module.id)}
                  className="cursor-pointer border-[#D5E4FF] bg-white shadow-sm hover:shadow-xl hover:shadow-blue-100/70 hover:-translate-y-1 transition-all rounded-2xl overflow-hidden"
                >
                  <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${moduleIcon.background}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.75),transparent_48%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.45),transparent_38%)]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/80 shadow-lg backdrop-blur-sm">
                        <ModuleIcon className={`h-10 w-10 ${moduleIcon.accent}`} />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-base font-bold text-[#0B225A] leading-tight drop-shadow-sm">{module.title}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-[#5A77B0] min-h-10">{module.description}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-[#ECF3FF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2E58A5]">
                        {module.stories.length} {t("stories.scenarios", "scenarios")}
                      </span>
                      <span className="text-xs font-semibold text-[#0048ff]">
                        {t("stories.startModule", "Start Module")}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : !stories.length ? (
          <Card className="p-8 border-[#CFE0FF] shadow-sm rounded-3xl bg-white text-center">
            <h2 className="text-xl font-bold text-[#0F2A6B]">{t("stories.emptyTitle", "No scenarios available")}</h2>
            <p className="text-[#4A66A8] mt-2">{t("stories.emptyBody", "Please select a different module.")}</p>
            <div className="mt-5">
              <Button variant="outline" onClick={backToModules} className="rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("stories.backToModules", "Back to Modules")}
              </Button>
            </div>
          </Card>
        ) : isCompleted ? (
          <Card className="p-8 border-[#CFE0FF] shadow-xl rounded-3xl overflow-hidden relative bg-white">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0048ff] to-[#00a3ff] mx-auto flex items-center justify-center shadow-lg shadow-blue-100">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#0F2A6B] mt-5">{t("stories.completedTitle", "Great work!")}</h2>
              <p className="text-[#4A66A8] mt-2">
                {t("stories.completedBody", "You completed all scenarios and strengthened your SRHR safety decisions.")}
              </p>
              <p className="text-sm text-[#3D5D9C] mt-2">{currentModule?.title}</p>
              <p className="text-lg font-semibold text-[#0048ff] mt-4">
                {t("stories.finalScore", "Final Score")}: {score}/{stories.length}
              </p>

              <div className="mt-7">
                <Button onClick={restartStories} className="rounded-xl bg-[#0048ff] hover:bg-[#003eda] h-11 px-5">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t("stories.restart", "Try Again")}
                </Button>
                <Button variant="outline" onClick={backToModules} className="rounded-xl h-11 px-5 ml-2">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("stories.backToModules", "Back to Modules")}
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <>
          <div className="mb-3 flex items-center justify-between">
            <Button variant="ghost" onClick={backToModules} className="rounded-xl text-[#345291] hover:text-[#123780]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("stories.backToModules", "Back to Modules")}
            </Button>
            <p className="text-xs text-[#4A66A8] font-medium">{currentModule?.title}</p>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-8 border-[#CFE0FF] shadow-xl rounded-3xl overflow-hidden relative bg-white">
                <div className="absolute top-0 left-0 h-1 bg-blue-100 w-full">
                  <div
                    className="h-full bg-gradient-to-r from-[#0048ff] to-[#00a3ff] transition-all duration-500"
                    style={{ width: `${scenarioProgress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mb-8">
                  <Button variant="ghost" size="icon" onClick={prevStory} className="rounded-full" disabled={currentIdx === 0}>
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </Button>
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                      {t("common.scenario", "Scenario")} {currentIdx + 1}/{stories.length}
                    </span>
                    <h2 className="text-xl font-bold text-[#0F2A6B] mt-1">{story?.title}</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextStory}
                    className="rounded-full"
                    disabled={currentIdx >= stories.length - 1}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </Button>
                </div>

                <div className="mb-8 text-lg text-[#28457F] leading-relaxed bg-[#F2F7FF] p-6 rounded-2xl border border-[#D6E6FF]">
                  {story?.scenario}
                </div>

                <div className="space-y-3">
                  {story?.choices.map((choice: string, idx: number) => {
                    const isSelected = selectedChoice === idx;
                    const isCorrect = idx === story.correct;
                    const showFeedback = selectedChoice !== null;
                    const isCorrectAnswerDisplay = !isSelected && showFeedback && isCorrect;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleChoice(idx)}
                        disabled={showFeedback}
                        className={`w-full p-4 rounded-2xl text-left border-2 transition-all group relative overflow-hidden ${
                          isSelected
                            ? isCorrect
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-red-500 bg-red-50"
                            : isCorrectAnswerDisplay
                              ? "border-emerald-500 bg-emerald-50"
                              : showFeedback
                                ? "opacity-45 border-gray-100"
                                : "border-[#D6E6FF] hover:border-[#4A82FF] hover:bg-[#F7FAFF]"
                        }`}
                      >
                        <div className="flex gap-4 items-center">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                              isSelected
                                ? isCorrect
                                  ? "bg-emerald-500 text-white"
                                  : "bg-red-500 text-white"
                                : isCorrectAnswerDisplay
                                  ? "bg-emerald-500 text-white"
                                  : "bg-[#E8F0FF] text-[#4A66A8] group-hover:bg-[#0048ff] group-hover:text-white"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className={`font-medium ${isSelected || isCorrectAnswerDisplay ? "text-gray-900" : "text-[#314F89]"}`}>{choice}</span>
                        </div>

                        {(isSelected || isCorrectAnswerDisplay) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="mt-4 pt-4 border-t border-black/5 text-sm"
                          >
                            <div className="flex gap-2">
                              {isCorrect ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-red-600" />
                              )}
                              <p className={isCorrect ? "text-emerald-700" : "text-red-700"}>
                                {isCorrectAnswerDisplay ? `Correct answer! ${story.feedback[idx]}` : story.feedback[idx]}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedChoice !== null && currentIdx < stories.length - 1 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 flex justify-center">
                    <Button onClick={nextStory} className="rounded-full px-8 bg-[#0048ff] hover:bg-[#003eda] h-12">
                      {t("common.nextScenario", "Next Scenario")}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                )}

                {showCelebration && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: -20 }}
                      className="fixed inset-0 flex items-center justify-center pointer-events-none z-[999]"
                    >
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 0.95, 1] }}
                          transition={{ duration: 0.6 }}
                          className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-100 shadow-2xl flex items-center justify-center mx-auto mb-4"
                        >
                          <Trophy className="w-12 h-12 text-yellow-600" />
                        </motion.div>
                        <h3 className="text-3xl font-bold text-[#0F2A6B] drop-shadow-lg">
                          {t("common.excellent", "Excellent!")}
                        </h3>
                        <p className="text-lg text-[#4A66A8] mt-2 drop-shadow">
                          {t("common.correctAnswer", "You got it right!")}
                        </p>
                      </div>

                      {/* Confetti particles */}
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 1, x: 0, y: 0 }}
                          animate={{
                            opacity: 0,
                            x: (Math.random() - 0.5) * 400,
                            y: (Math.random() - 0.5) * 400,
                          }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="fixed w-3 h-3 rounded-full pointer-events-none"
                          style={{
                            left: "50%",
                            top: "50%",
                            backgroundColor: ["#FFD700", "#FFA500", "#FF69B4", "#87CEEB"][
                              Math.floor(Math.random() * 4)
                            ],
                          }}
                        />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </Card>
            </motion.div>
          </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
