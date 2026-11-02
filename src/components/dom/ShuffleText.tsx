import { useState, useRef } from 'react';

interface ShuffleTextProps {
  text: string;
  className?: string;
  speed?: number;
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}:/,.;=';

export function ShuffleText({ text, className = '', speed = 35 }: ShuffleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    let iterations = 0;

    intervalRef.current = window.setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ' || char === '\n') return char;
            if (index < iterations) {
              return text[index];
            }
            return LETTERS[Math.floor(Math.random() * LETTERS.length)];
          })
          .join('')
      );

      iterations += 1 / 3;

      if (iterations >= text.length) {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
        }
        setDisplayText(text);
      }
    }, speed);
  };

  return (
    <span onMouseEnter={handleMouseEnter} className={className}>
      {displayText}
    </span>
  );
}
