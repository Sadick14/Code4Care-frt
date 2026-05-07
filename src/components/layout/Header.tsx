import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Menu, UserCheck, AlertCircle, Phone } from "lucide-react";
import { dktSupportLines } from '@/data/dktProducts';
import { useApp } from '@/providers/AppProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  onMenuClick: () => void;
  onPanicClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  onPanicClick
}) => {
  const { t } = useTranslation();
  const { nickname, botName, consultantMode } = useApp();
  const dktPrimary = (dktSupportLines && dktSupportLines.length > 0) ? dktSupportLines[0] : undefined;
  const consultantPhone = dktPrimary?.phone || '';

  return (
    <header className="bg-white border-b border-[#E8ECFF] flex-shrink-0 sticky top-0 z-50 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl lg:hidden" onClick={onMenuClick}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex min-w-0 flex-col">
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
              <Shield className="w-4 h-4 text-[#0048ff]" />
              <h1 className="min-w-0 truncate font-bold leading-none text-gray-900">{botName}</h1>
              <Badge variant="outline" className="hidden h-5 gap-1 border-green-100 bg-green-50 px-1.5 text-green-600 sm:flex">
                <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                {t('common.online')}
              </Badge>
            </div>
            {nickname ? (
              <span className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
                <UserCheck className="w-2 h-2" />
                {t('chat.welcome', { name: nickname })}
              </span>
            ) : (
              <span className="text-[10px] text-gray-400 mt-1 italic">{t('chat.anonymous')}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile-only consultant call button (next to panic) */}
          {consultantPhone && (
            <a
              href={`tel:${consultantPhone.replace(/\D/g, '')}`}
              title={t('chat.talkToConsultant', 'Talk to consultant')}
              aria-label={t('chat.talkToConsultant', 'Talk to consultant')}
              className="inline-flex items-center justify-center rounded-full p-2 text-white bg-emerald-600 hover:bg-emerald-700 sm:hidden"
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
          {consultantMode && (
             <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white hidden sm:flex items-center gap-1 px-2 py-1">
               <AlertCircle className="w-3 h-3" />
               {t('chat.consultantModeActive', 'Expert Active')}
             </Badge>
          )}
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onPanicClick}
            className="h-9 rounded-full px-3 text-xs sm:px-4 sm:text-sm bg-[#ff4444] hover:bg-[#ff1111] shadow-lg shadow-red-200"
          >
            {t('common.panic', 'PANIC')}
          </Button>
        </div>
      </div>
    </header>
  );
};
