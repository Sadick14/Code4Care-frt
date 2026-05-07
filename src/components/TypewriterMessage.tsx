import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTypewriter } from '@/hooks/useTypewriter';

interface TypewriterMessageProps {
  text: string;
  speed?: number;
  isCompleted?: boolean;
  className?: string;
  onComplete?: () => void;
}

export function TypewriterMessage({
  text,
  speed = 15,
  isCompleted = false,
  className = '',
  onComplete,
}: TypewriterMessageProps) {
  const { displayedText, isComplete } = useTypewriter({
    text,
    speed,
    enabled: !isCompleted,
  });

  useEffect(() => {
    if (isComplete && onComplete && !isCompleted) {
      onComplete();
    }
  }, [isComplete, onComplete, isCompleted]);

  const textToDisplay = isCompleted ? text : displayedText;

  return (
    <div className={`text-sm leading-relaxed whitespace-pre-wrap chat-markdown ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{textToDisplay}</ReactMarkdown>
    </div>
  );
}
