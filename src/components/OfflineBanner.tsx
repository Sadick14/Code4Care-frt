import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OfflineBannerProps {
  isOffline: boolean;
  wasOffline?: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOffline,
  wasOffline = false,
}) => {
  if (isOffline) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white"
        >
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3">
            <WifiOff className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">
              You're offline. Some features may be limited.
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (wasOffline) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white"
        >
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3">
            <Wifi className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold">
              Back online!
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return null;
};
