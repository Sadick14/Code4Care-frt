import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface DesktopHeroIntroProps {
  onComplete: () => void;
}

const heroImage = '/introscreen/6046367028903349859.jpg';

export function DesktopHeroIntro({ onComplete }: DesktopHeroIntroProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F7FAFF] via-white to-[#E8F4FF] flex items-center justify-center px-8 py-12">
      <div className="max-w-6xl w-full grid grid-cols-2 gap-12 items-center">
        {/* Left: Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              src={heroImage}
              alt="Room 1221 Welcome"
              className="w-full h-full object-cover aspect-square"
            />
          </div>
          {/* Decorative gradient blob */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-blue-200 to-blue-100 rounded-full blur-2xl opacity-50 -z-10" />
        </motion.div>

        {/* Right: Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                Welcome to Room 1221
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-5xl font-bold text-[#0F2A6B] leading-tight"
            >
              Your Safe Space for <br />
              <span className="bg-gradient-to-r from-[#0048ff] to-[#0066ff] bg-clip-text text-transparent">
                Confidential Support
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-lg text-[#5B77B8] leading-relaxed"
            >
              Experience 100% anonymity with no personal data collected. Your privacy is always our priority. Get reliable, expert SRHR guidance designed for the youth of Ghana.
            </motion.p>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-3 pt-4"
          >
            {[
              { icon: '🔒', text: 'Fully anonymous with no personal data' },
              { icon: '✓', text: 'Expert guidance from trusted sources' },
              { icon: '🌍', text: 'Designed for youth in Ghana' },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-[#0F2A6B] font-medium">{feature.text}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="pt-6"
          >
            <Button
              onClick={onComplete}
              size="lg"
              className="w-full md:w-auto h-14 text-base rounded-xl bg-gradient-to-r from-[#0048ff] to-[#0066ff] hover:from-[#0040dd] hover:to-[#005cdd] text-white font-semibold shadow-lg shadow-blue-200 transition-all hover:shadow-xl"
            >
              Get Started
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          {/* Bottom accent */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="pt-8 text-sm text-[#8E8E93]"
          >
            ↓ Join thousands of youth accessing safe health information
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
