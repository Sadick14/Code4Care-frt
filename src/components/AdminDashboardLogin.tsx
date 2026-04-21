import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion } from 'motion/react';
import { Lock, Mail, Shield, Sparkles, ChevronRight } from 'lucide-react';

interface AdminDashboardLoginProps {
  onAdminLogin: () => void;
}

export function AdminDashboardLogin({ onAdminLogin }: AdminDashboardLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Demo authentication - accepts any credentials
    if (email && password) {
      onAdminLogin();
    } else {
      setError('Please enter both email and password');
    }
    setIsLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-b from-[#f2f7ff] via-white to-[#eef5ff]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        <div className="max-w-md w-full min-h-[680px] bg-white rounded-3xl shadow-2xl p-8 flex flex-col border border-blue-50">
          <div className="text-center mb-6">
            <p className="text-sm font-semibold tracking-wide uppercase text-blue-500 mb-3">Room 1221</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Admin Dashboard Login</h1>
            <p className="text-gray-500">Secure access for authorized administrators only.</p>
          </div>

          <div className="mb-8 flex-1 flex items-center">
            <div className="mx-auto w-full max-w-sm h-56 rounded-3xl bg-gradient-to-b from-blue-50 to-white border border-blue-100 flex items-center justify-center relative overflow-visible">
              <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-blue-100/70" />
              <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-emerald-100/70" />
              <img
                src="/chat2.png"
                alt="Admin login illustration"
                className="absolute z-10 left-1/2 -translate-x-1/2 -bottom-12 w-[38rem] h-[20rem] object-contain drop-shadow-2xl"
              />
              <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-blue-600/95 flex items-center justify-center shadow-lg shadow-blue-200">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="absolute top-5 right-5 w-6 h-6 text-amber-400" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mt-auto">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <Input
                type="email"
                placeholder="Admin email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="h-12 pl-10 rounded-xl border-gray-200 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="h-12 pl-10 rounded-xl border-gray-200 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Verifying...
                </div>
              ) : (
                <>
                  Access Dashboard
                  <ChevronRight className="w-5 h-5 ml-1" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-gray-400 pt-2">
              Demo mode: enter any email and password.
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
