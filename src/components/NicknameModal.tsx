import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Shield, UserCircle2 } from "lucide-react";

interface NicknameModalProps {
  isOpen: boolean;
  onSubmit: (nickname: string) => void;
  onClose: () => void;
}

export function NicknameModal({ isOpen, onSubmit, onClose }: NicknameModalProps) {
  const { t } = useTranslation();
  const [nickname, setNickname] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.trim()) {
      onSubmit(nickname.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center" style={{ color: '#1A1A1A' }}>
            {t('nickname.title')}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t('nickname.desc')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center mb-4 mt-2">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center" 
            style={{ 
              background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
              boxShadow: '0 4px 16px rgba(0, 72, 255, 0.3)'
            }}
          >
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nickname" className="text-sm">{t('nickname.label')}</Label>
            <div className="relative mt-2">
              <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t('nickname.placeholder')}
                className="pl-10 rounded-xl"
                maxLength={20}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 rounded-xl"
            >
              {t('nickname.skip')}
            </Button>
            <Button
              type="submit"
              className="flex-1 transition-all rounded-xl hover:scale-105 active:scale-95"
              style={{ 
                background: 'linear-gradient(135deg, #0048ff 0%, #0066ff 100%)',
                boxShadow: '0 4px 16px rgba(0, 72, 255, 0.2)'
              }}
              disabled={!nickname.trim()}
            >
              {t('nickname.continue')}
            </Button>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-start gap-2 text-[10px] text-gray-500">
              <Shield className="w-3 h-3 flex-shrink-0 mt-0.5 text-[#0048ff]" />
              <p>{t('nickname.privacy')}</p>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}