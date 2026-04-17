import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, ArrowLeft, Check, ChevronLeft, ChevronRight, RotateCcw, Trophy } from "lucide-react";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { getStoryModules, StoryModule } from "@/data/storyModules";

export function StoryMode() {
  const { t, i18n } = useTranslation();
  const activeLanguage = (i18n.resolvedLanguage || i18n.language || "en").split("-")[0];

  const modules = useMemo(() => getStoryModules(activeLanguage), [activeLanguage]);
  const [selectedModuleId, setSelectedModuleId] = useState<string>(modules[0]?.id ?? "");
  const [viewMode, setViewMode] = useState<"catalog" | "quiz">("catalog");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<number | undefined>>([]);

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
  const score = answers.reduce((total, selected, idx) => {
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
  }, [selectedModuleId]);

  useEffect(() => {
    setSelectedChoice(answers[currentIdx] ?? null);
  }, [currentIdx, answers]);

  const handleChoice = (idx: number) => {
    if (selectedChoice !== null || isCompleted) return;

    setSelectedChoice(idx);
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIdx] = idx;
      return next;
    });
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
  };

  const startModuleQuiz = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    setCurrentIdx(0);
    setSelectedChoice(null);
    setAnswers([]);
    setViewMode("quiz");
  };

  const backToModules = () => {
    setViewMode("catalog");
    setCurrentIdx(0);
    setSelectedChoice(null);
    setAnswers([]);
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-[#f2f7ff] via-white to-[#eef5ff] p-4">
      <div className="max-w-3xl mx-auto pb-12">
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
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modules.map((module) => (
              <Card
                key={module.id}
                onClick={() => startModuleQuiz(module.id)}
                className="cursor-pointer border-[#D5E4FF] bg-white shadow-sm hover:shadow-lg hover:shadow-blue-100/60 hover:-translate-y-0.5 transition-all rounded-2xl overflow-hidden"
              >
                <div className="h-1.5 w-full bg-gradient-to-r from-[#0048ff] to-[#00a3ff]" />
                <div className="p-4">
                  <p className="text-base font-bold text-[#1D3B79] leading-tight">{module.title}</p>
                  <p className="text-sm mt-2 text-[#5A77B0] min-h-10">{module.description}</p>

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
            ))}
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
                                : "bg-[#E8F0FF] text-[#4A66A8] group-hover:bg-[#0048ff] group-hover:text-white"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className={`font-medium ${isSelected ? "text-gray-900" : "text-[#314F89]"}`}>{choice}</span>
                        </div>

                        {isSelected && (
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
                              <p className={isCorrect ? "text-emerald-700" : "text-red-700"}>{story.feedback[idx]}</p>
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
              </Card>
            </motion.div>
          </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
