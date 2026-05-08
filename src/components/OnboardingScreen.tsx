import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, ChevronLeft, Bot } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { UserTrackingService } from "@/services";
import { logger } from "@/utils/logger";

interface OnboardingScreenProps {
  onComplete: (payload: { botName: string; ageRange: string; genderIdentity: string; region: string }) => void;
  sessionId?: string;
  language?: string;
}

export default function OnboardingScreen({ onComplete, sessionId, language = 'en' }: OnboardingScreenProps) {
  const { t, i18n } = useTranslation();
  // Start at bot-name step.
  const [currentPage, setCurrentPage] = useState(2);
  const [botName, setBotName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [genderIdentity, setGenderIdentity] = useState("");
  const [region, setRegion] = useState("");

  const handleContinue = async () => {
    if (currentPage === 2) {
      setCurrentPage(3);
      return;
    }

    if (!ageRange || !genderIdentity || !region) {
      return;
    }

    const finalBotName = botName.trim() || t("onboarding.page2.defaultName");

    // Capture demographics via UserTrackingService
    if (sessionId) {
      try {
        await UserTrackingService.captureDemographics({
          session_id: sessionId,
          bot_name: finalBotName,
          age_range: ageRange,
          gender_identity: genderIdentity,
          region: region,
          language: language || i18n.language || 'en',
        });
        logger.info('User demographics captured successfully');
      } catch (error) {
        logger.error('Failed to capture demographics', error);
        // Don't block onboarding if API call fails
      }
    }

    onComplete({
      botName: finalBotName,
      ageRange,
      genderIdentity,
      region,
    });
  };

  const handleSkip = () => {
    setBotName(t("onboarding.page2.defaultName"));
    setCurrentPage(3);
  };

  const handleBack = () => {
    if (currentPage > 2) {
      setCurrentPage((prev) => prev - 1);
    }
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

  const regionOptions = [
    { value: "greater-accra", label: t("onboarding.page3.region.options.greater-accra", "Greater Accra") },
    { value: "ashanti", label: t("onboarding.page3.region.options.ashanti", "Ashanti") },
    { value: "western", label: t("onboarding.page3.region.options.western", "Western") },
    { value: "western-north", label: t("onboarding.page3.region.options.western-north", "Western North") },
    { value: "central", label: t("onboarding.page3.region.options.central", "Central") },
    { value: "eastern", label: t("onboarding.page3.region.options.eastern", "Eastern") },
    { value: "volta", label: t("onboarding.page3.region.options.volta", "Volta") },
    { value: "oti", label: t("onboarding.page3.region.options.oti", "Oti") },
    { value: "northern", label: t("onboarding.page3.region.options.northern", "Northern") },
    { value: "savannah", label: t("onboarding.page3.region.options.savannah", "Savannah") },
    { value: "north-east", label: t("onboarding.page3.region.options.north-east", "North East") },
    { value: "upper-east", label: t("onboarding.page3.region.options.upper-east", "Upper East") },
    { value: "upper-west", label: t("onboarding.page3.region.options.upper-west", "Upper West") },
    { value: "bono", label: t("onboarding.page3.region.options.bono", "Bono") },
    { value: "bono-east", label: t("onboarding.page3.region.options.bono-east", "Bono East") },
    { value: "ahafo", label: t("onboarding.page3.region.options.ahafo", "Ahafo") },
  ];

  const canSubmitDemographics = Boolean(ageRange && genderIdentity && region);

  return (
    <div className="h-[100dvh] sm:min-h-screen flex items-center justify-center px-3 py-3 sm:px-3 sm:py-4 sm:p-4 overflow-y-auto">
      <AnimatePresence mode="wait">
        {currentPage === 2 ? (
          <motion.div
            key="page2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-md w-full max-h-[calc(100dvh-1.5rem)] sm:max-h-none bg-white rounded-3xl shadow-2xl p-5 sm:p-8 overflow-y-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-100 relative">
                <Bot className="w-8 h-8 text-white" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t("onboarding.page2.title")}</h1>
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
              <Button onClick={handleContinue} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-base sm:text-lg">
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
            className="max-w-md w-full max-h-[calc(100dvh-1.5rem)] sm:max-h-none bg-white rounded-3xl shadow-2xl p-5 sm:p-8 overflow-y-auto"
          >
            <Button onClick={handleBack} variant="ghost" className="mb-4 h-10 rounded-xl text-gray-600 hover:text-gray-900 w-fit px-3">
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t("common.back", "Back")}
            </Button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t("onboarding.page3.title", "Help us personalize your support")}</h1>
              <p className="text-gray-500">{t("onboarding.page3.subtitle", "Your age group and gender help us tailor safer, more relevant guidance.")}</p>
            </div>

            <div className="space-y-5 mb-8">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  {t("onboarding.page3.age.label", "Age range")}
                </label>
                <Select value={ageRange} onValueChange={setAgeRange}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-white text-gray-700">
                    <SelectValue placeholder={t("onboarding.page3.age.placeholder", "Select age range")} />
                  </SelectTrigger>
                  <SelectContent>
                    {ageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  {t("onboarding.page3.gender.label", "Gender identity")}
                </label>
                <Select value={genderIdentity} onValueChange={setGenderIdentity}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-white text-gray-700">
                    <SelectValue placeholder={t("onboarding.page3.gender.placeholder", "Select gender identity")} />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  {t("onboarding.page3.region.label", "Region in Ghana")}
                </label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-white text-gray-700">
                    <SelectValue placeholder={t("onboarding.page3.region.placeholder", "Select your region")} />
                  </SelectTrigger>
                  <SelectContent>
                    {regionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleContinue}
              disabled={!canSubmitDemographics}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-base sm:text-lg disabled:opacity-60"
            >
              {t("onboarding.page3.finish", "Start Chat")}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
