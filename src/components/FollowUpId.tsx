import { useState } from "react";
import { Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";

interface FollowUpIdProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
}

export function FollowUpId({ isOpen, onClose, selectedLanguage }: FollowUpIdProps) {
  const [copied, setCopied] = useState(false);
  const followUpId = generateId();

  function generateId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '#';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  const content = {
    en: {
      title: "Your Follow-up ID",
      description: "Save this ID to continue your conversation later. Share it with any of our channels to pick up where you left off.",
      yourId: "Your ID:",
      copyButton: "Copy ID",
      copiedButton: "Copied!",
      saveNote: "Important: This ID will work across all our platforms (Web, WhatsApp, Telegram, SMS).",
      closeButton: "Close",
      copiedToast: "ID copied to clipboard!"
    },
    twi: {
      title: "Wo Nkɔmmɔbɔ ID",
      description: "Kora ID yi na toaa wo nkɔmmɔbɔ so akyire yi. Fa kyɛ yɛn akwan biara so na toaa so.",
      yourId: "Wo ID:",
      copyButton: "Fa ID",
      copiedButton: "Wɔafa!",
      saveNote: "Ɛho hia: ID yi bɛyɛ adwuma wɔ yɛn akwan nyinaa so (Web, WhatsApp, Telegram, SMS).",
      closeButton: "To mu",
      copiedToast: "Wɔafa ID no kɔ!"
    },
    ewe: {
      title: "Wò Nuƒoƒo ID",
      description: "Dzra ID sia ɖo be nàyi wò nuƒoƒo dzi emegbe. Ðɔe ɖe míaƒe mɔ̃wo dometɔ ɖesiaɖe dzi ne nàyi edzi.",
      yourId: "Wò ID:",
      copyButton: "Ŋlɔ ID",
      copiedButton: "Woŋlɔe!",
      saveNote: "Vevie: ID sia awɔ dɔ le míaƒe mɔ̃wo katã dzi (Web, WhatsApp, Telegram, SMS).",
      closeButton: "Tu",
      copiedToast: "Woŋlɔ ID la ɖe agbalẽ me!"
    }
  };

  const lang = content[selectedLanguage as keyof typeof content] || content.en;

  const handleCopy = () => {
    navigator.clipboard.writeText(followUpId);
    setCopied(true);
    toast.success(lang.copiedToast);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle style={{ color: '#006d77' }}>{lang.title}</DialogTitle>
          <DialogDescription>{lang.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">{lang.yourId}</p>
            <div className="inline-flex items-center gap-3 p-6 rounded-2xl" style={{ backgroundColor: '#e6f4f5' }}>
              <span className="text-3xl tracking-wider" style={{ color: '#006d77' }}>
                {followUpId}
              </span>
            </div>
          </div>

          <Button
            onClick={handleCopy}
            className="w-full rounded-full"
            style={{ backgroundColor: copied ? '#006d77' : '#006d77' }}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                {lang.copiedButton}
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                {lang.copyButton}
              </>
            )}
          </Button>

          <div className="p-4 rounded-lg" style={{ backgroundColor: '#fff0ed' }}>
            <p className="text-sm" style={{ color: '#ff7b6e' }}>
              {lang.saveNote}
            </p>
          </div>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full rounded-full"
            style={{ borderColor: '#006d77', color: '#006d77' }}
          >
            {lang.closeButton}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
