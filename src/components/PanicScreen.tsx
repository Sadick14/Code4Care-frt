import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";

interface PanicScreenProps {
  onExit: () => void;
}

export function PanicScreen({ onExit }: PanicScreenProps) {
  const { t } = useTranslation();
  const [display, setDisplay] = useState("0");
  const [showReturn, setShowReturn] = useState(false);

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === "0" ? num : prev + num);
  };

  const handleClear = () => setDisplay("0");
  const handleDelete = () => setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : "0");

  const handleEquals = () => {
    try {
      // Safe math evaluation
      const sanitized = display.replace(/[^-()\d/*+.]/g, '');
      // eslint-disable-next-line no-new-func
      const result = new Function(`return ${sanitized}`)();
      setDisplay(result.toString());
    } catch {
      setDisplay("Error");
    }
  };

  const buttons = [
    { label: "C", action: handleClear, color: "bg-slate-700 text-teal-400" },
    { label: "⌫", action: handleDelete, color: "bg-slate-700 text-teal-400" },
    { label: "%", action: () => {}, color: "bg-slate-700 text-teal-400" },
    { label: "÷", action: () => handleNumber("/"), color: "bg-slate-700 text-orange-400" },
    { label: "7", action: () => handleNumber("7"), color: "bg-slate-800 text-white" },
    { label: "8", action: () => handleNumber("8"), color: "bg-slate-800 text-white" },
    { label: "9", action: () => handleNumber("9"), color: "bg-slate-800 text-white" },
    { label: "×", action: () => handleNumber("*"), color: "bg-slate-700 text-orange-400" },
    { label: "4", action: () => handleNumber("4"), color: "bg-slate-800 text-white" },
    { label: "5", action: () => handleNumber("5"), color: "bg-slate-800 text-white" },
    { label: "6", action: () => handleNumber("6"), color: "bg-slate-800 text-white" },
    { label: "-", action: () => handleNumber("-"), color: "bg-slate-700 text-orange-400" },
    { label: "1", action: () => handleNumber("1"), color: "bg-slate-800 text-white" },
    { label: "2", action: () => handleNumber("2"), color: "bg-slate-800 text-white" },
    { label: "3", action: () => handleNumber("3"), color: "bg-slate-800 text-white" },
    { label: "+", action: () => handleNumber("+"), color: "bg-slate-700 text-orange-400" },
    { label: "AC", action: handleClear, color: "bg-slate-800 text-white" },
    { label: "0", action: () => handleNumber("0"), color: "bg-slate-800 text-white" },
    { label: ".", action: () => handleNumber("."), color: "bg-slate-800 text-white" },
    { label: "=", action: handleEquals, color: "bg-orange-500 text-white shadow-lg shadow-orange-900/20" },
  ];

  return (
    <div className="fixed inset-0 bg-[#0F172A] flex flex-col items-center justify-end font-sans">
      <div className="w-full max-w-md h-full flex flex-col overflow-hidden">
        {/* Calc Display */}
        <div 
          className="flex-1 flex flex-col justify-end items-end p-8 cursor-pointer"
          onClick={() => {
            const clicks = parseInt(sessionStorage.getItem('panic_clicks') || '0');
            sessionStorage.setItem('panic_clicks', (clicks + 1).toString());
            if (clicks >= 2) {
              setShowReturn(true);
              sessionStorage.setItem('panic_clicks', '0');
            }
            setTimeout(() => sessionStorage.setItem('panic_clicks', '0'), 500);
          }}
        >
          <motion.div 
            key={display}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl font-light text-white tracking-tighter"
          >
            {display}
          </motion.div>
        </div>

        {/* Calc Pad */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-t-[40px] p-6 grid grid-cols-4 gap-4">
          {buttons.map((btn, i) => (
            <button
              key={i}
              onClick={btn.action}
              className={`h-20 w-full rounded-full text-2xl font-medium transition-transform active:scale-90 ${btn.color}`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Secret Exit */}
        <div className="h-20 flex items-center justify-center p-4">
           <AnimatePresence>
            {showReturn && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onExit}
                className="bg-white/10 text-white px-6 py-2 rounded-full text-sm hover:bg-white/20 transition-colors"
              >
                {t('common.exit', 'Exit')}
              </motion.button>
            )}
           </AnimatePresence>
        </div>
      </div>
      
      {!showReturn && (
        <div className="absolute top-10 w-full text-center text-slate-600 text-[10px] pointer-events-none">
          {t('panic.hint', 'Tap result 3 times to return')}
        </div>
      )}
    </div>
  );
}