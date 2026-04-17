import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Shield, MessageCircle, Sparkles, ChevronRight, Bot } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface OnboardingScreenProps {
  onComplete: (payload: { botName: string; ageRange: string; genderIdentity: string }) => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [botName, setBotName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [genderIdentity, setGenderIdentity] = useState("");

  const handleContinue = () => {
    if (currentPage === 1) {
      setCurrentPage(2);
      return;
    }

    if (currentPage === 2) {
      setCurrentPage(3);
      return;
    }

    if (!ageRange || !genderIdentity) {
      return;
    }

    const finalBotName = botName.trim() || t("onboarding.page2.defaultName");
    onComplete({
      botName: finalBotName,
      ageRange,
      genderIdentity,
    });
  };

  const handleSkip = () => {
    onComplete({
      botName: t("onboarding.page2.defaultName"),
      ageRange: "15-19",
      genderIdentity: "prefer-not-say",
    });
  };

  const ageOptions = [
    { value: "10-14", label: t("onboarding.page3.age.options.10-14", "10-14") },
    { value: "15-19", label: t("onboarding.page3.age.options.15-19", "15-19") },
    { value: "20-24", label: t("onboarding.page3.age.options.20-24", "20-24") },
    { value: "25+", label: t("onboarding.page3.age.options.25+", "25+") },
  ];

  const genderOptions = [
    { value: "female", label: t("onboarding.page3.gender.options.female", "Female") },
    { value: "male", label: t("onboarding.page3.gender.options.male", "Male") },
    { value: "non-binary", label: t("onboarding.page3.gender.options.non-binary", "Non-binary") },
    { value: "prefer-not-say", label: t("onboarding.page3.gender.options.prefer-not-say", "Prefer not to say") },
  ];

  const canSubmitDemographics = Boolean(ageRange && genderIdentity);

  const renderSelectionCard = (
    options: Array<{ value: string; label: string }>,
    selectedValue: string,
    onSelect: (value: string) => void,
  ) => (
    <div className="grid grid-cols-2 gap-3">
      {options.map((option) => {
        const active = selectedValue === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`rounded-xl border px-3 py-3 text-sm font-semibold transition-colors ${
              active
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );

  const features = [
    { icon: Shield, title: t("onboarding.page1.features.anonymous.title"), desc: t("onboarding.page1.features.anonymous.desc") },
    { icon: MessageCircle, title: t("onboarding.page1.features.expert.title"), desc: t("onboarding.page1.features.expert.desc") },
    { icon: Heart, title: t("onboarding.page1.features.youth.title"), desc: t("onboarding.page1.features.youth.desc") },
  ];

  return (
    <div className="h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-[#0048ff] via-[#0066ff] to-[#00d4ff]">
      <AnimatePresence mode="wait">
        {currentPage === 1 ? (
          <motion.div
            key="page1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-blue-600 mb-2">{t("onboarding.page1.title")}</h1>
              <p className="text-gray-500">{t("onboarding.page1.subtitle")}</p>
            </div>

            <div className="space-y-6 mb-8">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{f.title}</h3>
                    <p className="text-sm text-gray-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleContinue} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-lg">
              {t("onboarding.page1.next")}
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>
        ) : currentPage === 2 ? (
          <motion.div
            key="page2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-100 relative">
                <Bot className="w-8 h-8 text-white" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("onboarding.page2.title")}</h1>
              <p className="text-gray-500">{t("onboarding.page2.subtitle")}</p>
            </div>

            <div className="space-y-4 mb-8">
              <label className="text-sm font-medium text-gray-700">{t("onboarding.page2.label")}</label>
              <div className="relative">
                <Input
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder={t("onboarding.page2.placeholder")}
                  className="h-12 pl-10 rounded-xl border-gray-200 focus:border-blue-500"
                />
                <Bot className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={handleContinue} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-lg">
                {t("onboarding.page2.continue")}
              </Button>
              <Button onClick={handleSkip} variant="ghost" className="w-full h-12 text-gray-500">
                {t("onboarding.page2.skip")}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="page3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("onboarding.page3.title", "Help us personalize your support")}</h1>
              <p className="text-gray-500">{t("onboarding.page3.subtitle", "Your age group and gender help us tailor safer, more relevant guidance.")}</p>
            </div>

            <div className="space-y-5 mb-8">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  {t("onboarding.page3.age.label", "Age range")}
                </label>
                {renderSelectionCard(ageOptions, ageRange, setAgeRange)}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  {t("onboarding.page3.gender.label", "Gender identity")}
                </label>
                {renderSelectionCard(genderOptions, genderIdentity, setGenderIdentity)}
              </div>
            </div>

            <Button
              onClick={handleContinue}
              disabled={!canSubmitDemographics}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-lg disabled:opacity-60"
            >
              {t("onboarding.page3.finish", "Start Chat")}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
