import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { motion } from "motion/react";

export function SupportAndClinics() {
  const { t } = useTranslation();

  const hotlinesData = t('support.hotlines', { returnObjects: true });
  const hotlines = Array.isArray(hotlinesData) ? hotlinesData : [];

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-white to-[#F8FAFE]">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#BE322D] mb-2">Support</h1>
          <p className="text-gray-500 text-lg">{t('support.subtitle')}</p>
        </div>

        <div className="space-y-8">
          {/* Legal Notice */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="p-8 border-2 border-[#F4D6D5] bg-[#FFF8F8] rounded-3xl shadow-sm">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF1F1] flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-7 h-7 text-[#BE322D]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#241515] mb-2">{t('support.legal.title')}</h3>
                  <p className="text-[#BE322D] font-semibold mb-2">{t('support.legal.age')}</p>
                  <p className="text-[#6D4A49] leading-relaxed">{t('support.legal.desc')}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Hotlines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hotlines.map((hotline, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6 h-full flex flex-col hover:shadow-xl transition-all border-slate-100 rounded-3xl">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-4 border-[#F4D6D5] text-[#BE322D] bg-[#FFF1F1] px-3 py-1">
                      {hotline.type}
                    </Badge>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{hotline.contact}</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">{hotline.description}</p>
                  </div>
                  <Button 
                    asChild
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#BE322D] to-[#F16365] hover:from-[#9F2622] hover:to-[#DD575A] shadow-lg shadow-[#F5D5D5]"
                  >
                    <a href={`tel:${hotline.phone.replace(/\s/g, '')}`}>
                      {t('support.callNow')}: {hotline.phone}
                    </a>
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Emergency Bottom Bar */}
          <Card className="p-6 bg-slate-900 text-white border-none rounded-3xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 animate-pulse">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium opacity-90 leading-relaxed">
                <strong>{t('support.emergency.prefix')}:</strong> {t('support.emergency.text')}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}