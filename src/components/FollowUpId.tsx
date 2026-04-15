import { useState, useMemo } from "react";
import { Copy, Check, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

interface FollowUpIdProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FollowUpId({ isOpen, onClose }: FollowUpIdProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  // Generate ID once and memoize it
  const followUpId = useMemo(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '#';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(followUpId);
    setCopied(true);
    toast.success(t('followUp.copied', 'ID copied to clipboard!'));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-[32px] p-8 border-none shadow-2xl overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-blue-400" />
        
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
             <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-900">{t('followUp.title')}</DialogTitle>
          <DialogDescription className="text-slate-500 pt-2">
            {t('followUp.desc')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 mt-6">
          <div className="text-center group">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{t('followUp.yourId')}</p>
            <div 
                className="inline-flex items-center gap-4 p-8 rounded-3xl bg-slate-50 border-2 border-slate-100 group-hover:border-blue-100 transition-all cursor-pointer"
                onClick={handleCopy}
            >
              <span className="text-5xl font-mono font-black text-blue-600 tracking-wider">
                {followUpId}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
             <Button
                onClick={handleCopy}
                className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 text-lg transition-transform active:scale-95"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.div key="check" initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center">
                        <Check className="w-5 h-5 mr-3" />
                        {t('followUp.copied')}
                    </motion.div>
                  ) : (
                    <motion.div key="copy" initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="flex items-center">
                        <Copy className="w-5 h-5 mr-3" />
                        {t('followUp.copy')}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
          </div>

          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-50">
            <p className="text-xs text-blue-600 leading-relaxed font-medium">
               {t('followUp.note')}
            </p>
          </div>

          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full h-12 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          >
            {t('followUp.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
