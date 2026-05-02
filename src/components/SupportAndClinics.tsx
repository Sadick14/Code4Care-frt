import { useTranslation } from "react-i18next";
import { AlertCircle, Building2 } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ReferralSection } from "./ReferralSection";
import { motion } from "motion/react";

export function SupportAndClinics() {
  const { t } = useTranslation();

  const hotlinesData = t('support.hotlines', { returnObjects: true });
  const hotlines = Array.isArray(hotlinesData) ? hotlinesData : [];

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-b from-white to-[#F8FAFE]">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">{t('support.title')}</h1>
          <p className="text-gray-500 text-lg">{t('support.subtitle')}</p>
        </div>

        <Tabs defaultValue="crisis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-10 p-1 bg-slate-100 rounded-2xl h-14">
            <TabsTrigger value="crisis" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm text-lg">
              <AlertCircle className="w-5 h-5 mr-2" />
              {t('support.tabs.crisis')}
            </TabsTrigger>
            <TabsTrigger value="clinics" className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm text-lg">
              <Building2 className="w-5 h-5 mr-2" />
              {t('support.tabs.clinics')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crisis" className="space-y-8 outline-none">
            {/* Legal Notice */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="p-8 border-2 border-blue-500/20 bg-blue-50/30 rounded-3xl shadow-sm">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">{t('support.legal.title')}</h3>
                    <p className="text-blue-800 font-semibold mb-2">{t('support.legal.age')}</p>
                    <p className="text-blue-700/80 leading-relaxed">{t('support.legal.desc')}</p>
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
                      <Badge variant="outline" className="mb-4 border-blue-100 text-blue-600 bg-blue-50/50 px-3 py-1">
                        {hotline.type}
                      </Badge>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{hotline.contact}</h3>
                      <p className="text-slate-500 text-sm mb-6 leading-relaxed">{hotline.description}</p>
                    </div>
                    <Button 
                      asChild
                      className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
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
          </TabsContent>

          <TabsContent value="clinics" className="outline-none">
            <ReferralSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}