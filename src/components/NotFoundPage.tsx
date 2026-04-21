import { motion } from "motion/react";
import { ChevronRight, Home, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "./ui/button";

export function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[#F4F8FF]">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="max-w-md w-full min-h-[680px] bg-white rounded-3xl shadow-2xl p-8 flex flex-col"
      >
        <div className="text-center mb-6">
          <p className="text-sm font-semibold tracking-wide uppercase text-blue-500 mb-3">
            {t("common.appName", "Room 1221")}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {t("notFound.title", "Page not found")}
          </h1>
          <p className="text-gray-500">
            {t("notFound.subtitle", "The page you were looking for does not exist or may have moved.")}
          </p>
        </div>

        <div className="mb-10 flex-1 flex items-center">
          <div className="mx-auto w-full max-w-sm h-72 rounded-3xl bg-gradient-to-b from-blue-50 to-white border border-blue-100 flex items-center justify-center relative overflow-visible">
            <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-blue-100/70" />
            <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-emerald-100/70" />
            <div className="relative z-10 flex flex-col items-center text-center px-6">
              <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
                <Home className="w-10 h-10 text-white" />
              </div>
              <p className="text-7xl font-bold tracking-tighter text-gray-900 leading-none">404</p>
              <p className="mt-3 text-sm text-gray-500 max-w-xs">
                {t("notFound.helper", "That path is outside the safe space. Use the button below to return home.")}
              </p>
            </div>
            <Sparkles className="absolute top-5 right-5 w-6 h-6 text-amber-400" />
          </div>
        </div>

        <Button onClick={() => navigate("/")} className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-lg">
          {t("notFound.cta", "Go Home")}
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </motion.div>
    </div>
  );
}