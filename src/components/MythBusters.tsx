import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { X, Check, Share2, Copy } from "lucide-react";
import { toast } from "sonner";

export function MythBusters() {
  const { t } = useTranslation();
  const [selectedMyth, setSelectedMyth] = useState<number | null>(null);

  const myths = t('myths.list', { returnObjects: true }) as any[];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('common.copied', 'Copied to clipboard!'));
  };

  return (
    <div className="h-full overflow-y-auto p-4 bg-gradient-to-b from-white to-[#F8FAFE]">
      <div className="max-w-4xl mx-auto pb-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">{t('myths.title')}</h1>
          <p className="text-gray-500">{t('myths.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myths.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card 
                className="p-6 cursor-pointer border-[#E8ECFF] hover:border-blue-200 transition-all hover:shadow-xl"
                onClick={() => setSelectedMyth(selectedMyth === idx ? null : idx)}
              >
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none px-3 py-1">
                    {item.category}
                  </Badge>
                  {selectedMyth === idx && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <X className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-red-400 tracking-wider mb-1">{t('myths.labels.myth')}</p>
                      <p className="font-medium text-gray-800">{item.myth}</p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedMyth === idx && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                          <div className="flex gap-3 items-start p-4 bg-emerald-50 rounded-2xl">
                            <Check className="w-5 h-5 text-emerald-600 mt-1 flex-shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider mb-1">{t('myths.labels.fact')}</p>
                              <p className="text-gray-900 leading-relaxed">{item.fact}</p>
                              <p className="text-[10px] text-gray-400 mt-3 italic">Source: {item.source}</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full text-blue-600 hover:bg-blue-50 bg-white border border-blue-50 rounded-xl"
                            onClick={(e) => { e.stopPropagation(); handleCopy(`${item.myth}\nFact: ${item.fact}`); }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            {t('common.copy', 'Copy this Fact')}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}