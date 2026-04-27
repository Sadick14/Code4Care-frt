import { useState, useEffect } from 'react';

interface UseTypewriterProps {
  text: string;
  speed?: number; // milliseconds per character
  enabled?: boolean;
}

export function useTypewriter({ text, speed = 15, enabled = true }: UseTypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    if (displayedText === text) {
      setIsComplete(true);
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, displayedText.length + 1));
    }, speed);

    return () => clearTimeout(timer);
  }, [displayedText, text, speed, enabled]);

  // Reset when text changes
  useEffect(() => {
    if (enabled) {
      setDisplayedText('');
      setIsComplete(false);
    }
  }, [text, enabled]);

  return {
    displayedText,
    isComplete,
  };
}
