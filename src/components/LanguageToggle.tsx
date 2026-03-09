import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

interface LanguageToggleProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export function LanguageToggle({ selectedLanguage, onLanguageChange }: LanguageToggleProps) {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'twi', name: 'Twi' },
    { code: 'ewe', name: 'Ewe' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full" style={{ borderColor: '#006d77' }}>
          <Languages className="w-5 h-5" style={{ color: '#006d77' }} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={selectedLanguage === lang.code ? 'bg-gray-100' : ''}
          >
            <span className={selectedLanguage === lang.code ? '' : ''} style={selectedLanguage === lang.code ? { color: '#006d77' } : {}}>
              {lang.name}
            </span>
            {selectedLanguage === lang.code && (
              <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20" style={{ color: '#006d77' }}>
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
