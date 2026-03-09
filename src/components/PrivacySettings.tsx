import { Shield } from "lucide-react";
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

interface PrivacySettingsProps {
  selectedLanguage: string;
  autoDeleteOption: string;
  onAutoDeleteChange: (option: string) => void;
}

export function PrivacySettings({ selectedLanguage, autoDeleteOption, onAutoDeleteChange }: PrivacySettingsProps) {
  const content = {
    en: {
      title: "Privacy Settings",
      description: "Choose when your chat history should be deleted",
      options: [
        { value: 'instant', label: 'Delete chat instantly' },
        { value: 'leave', label: 'Delete when I leave' },
        { value: 'browser', label: 'Keep until I close browser' }
      ],
      button: "Privacy"
    },
    twi: {
      title: "Kokoamsɛm nhyehyɛe",
      description: "Yi bere a wɔbɛyi wo nkɔmmɔbɔ abakɔsɛm no",
      options: [
        { value: 'instant', label: 'Yi hɔ ntɛm ara' },
        { value: 'leave', label: 'Yi bere a mafi hɔ' },
        { value: 'browser', label: 'Kora kosi sɛ meto browser no mu' }
      ],
      button: "Kokoam"
    },
    ewe: {
      title: "Ɣaɣlawo ɖoɖowo",
      description: "Tia ɣeyiɣi si woatutu wò nuƒoƒo ŋutinya",
      options: [
        { value: 'instant', label: 'Tutu enumake kaba' },
        { value: 'leave', label: 'Tutu ne medo go' },
        { value: 'browser', label: 'Dzra ɖo va se ɖe esime matutu browser' }
      ],
      button: "Ɣaɣla"
    }
  };

  const lang = content[selectedLanguage as keyof typeof content] || content.en;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full" style={{ borderColor: '#006d77' }}>
          <Shield className="w-5 h-5" style={{ color: '#006d77' }} />
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogHeader>
          <DialogTitle style={{ color: '#006d77' }}>{lang.title}</DialogTitle>
          <DialogDescription>{lang.description}</DialogDescription>
        </DialogHeader>
        <RadioGroup value={autoDeleteOption} onValueChange={onAutoDeleteChange}>
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
