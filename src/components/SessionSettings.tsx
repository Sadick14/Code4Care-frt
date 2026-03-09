import { Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface SessionSettingsProps {
  selectedLanguage: string;
  sessionDuration: string;
  onSessionDurationChange: (duration: string) => void;
}

export function SessionSettings({ selectedLanguage, sessionDuration, onSessionDurationChange }: SessionSettingsProps) {
  const content = {
    en: {
      title: "Chat History Settings",
      description: "Choose how long to keep your chat history",
      options: [
        { value: '24h', label: 'Keep for 24 hours' },
        { value: '7d', label: 'Keep for 7 days' },
        { value: 'logout', label: 'Keep until I logout' }
      ],
      button: "History"
    },
    twi: {
      title: "Nkɔmmɔbɔ Abakɔsɛm Nhyehyɛe",
      description: "Yi bere a wɔbɛkora wo nkɔmmɔbɔ abakɔsɛm",
      options: [
        { value: '24h', label: 'Kora nnɔnhwerew 24' },
        { value: '7d', label: 'Kora nnanson' },
        { value: 'logout', label: 'Kora kosi sɛ mifi mu' }
      ],
      button: "Abakɔsɛm"
    },
    ewe: {
      title: "Nuƒoƒo Ŋutinya Ðoɖowo",
      description: "Tia ɣeyiɣi si woadzra wò nuƒoƒo ŋutinya ɖo",
      options: [
        { value: '24h', label: 'Dzra ɖo gaƒoƒo 24' },
        { value: '7d', label: 'Dzra ɖo ŋkeke 7' },
        { value: 'logout', label: 'Dzra ɖo va se ɖe esime mado go' }
      ],
      button: "Ŋutinya"
    }
  };

  const lang = content[selectedLanguage as keyof typeof content] || content.en;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full" style={{ borderColor: '#006d77' }}>
          <Clock className="w-5 h-5" style={{ color: '#006d77' }} />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle style={{ color: '#006d77' }}>{lang.title}</DialogTitle>
          <DialogDescription>{lang.description}</DialogDescription>
        </DialogHeader>
        <RadioGroup value={sessionDuration} onValueChange={onSessionDurationChange}>
          {lang.options.map((option) => (
            <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="cursor-pointer flex-1">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </DialogContent>
    </Dialog>
  );
}
