import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils/cn';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789//[]#_';

function useScrambleText(targetText: string) {
  const [displayText, setDisplayText] = useState(targetText);

  useEffect(() => {
    let iteration = 0;
    const interval = window.setInterval(() => {
      setDisplayText(
        targetText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return targetText[index];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= targetText.length) {
        window.clearInterval(interval);
      }
      iteration += 1;
    }, 22);

    return () => window.clearInterval(interval);
  }, [targetText]);

  return displayText;
}

export function HoldButton() {
  const isHolding = useAppStore((state) => state.isHolding);
  const setIsHolding = useAppStore((state) => state.setIsHolding);

  const label = useScrambleText(
    isHolding ? 'HOLDING REALITY...' : '[ HOLD TO DECRYPT ]'
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && document.activeElement?.tagName !== 'BUTTON') {
        e.preventDefault();
        setIsHolding(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsHolding(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // A key/pointer release that lands outside the window never reaches the
    // button. Clear the hold so the scene doesn't stay locked in fast-spin.
    const releaseHold = () => setIsHolding(false);
    const handleVisibility = () => {
      if (document.hidden) releaseHold();
    };
    window.addEventListener('blur', releaseHold);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', releaseHold);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [setIsHolding]);

  return (
    <button
      type="button"
      onPointerDown={() => setIsHolding(true)}
      onPointerUp={() => setIsHolding(false)}
      onPointerLeave={() => setIsHolding(false)}
      onPointerCancel={() => setIsHolding(false)}
      className={cn(
        'pointer-events-auto relative px-4 py-2 border bg-black/70 backdrop-blur-md overflow-hidden group active:scale-95 transition-all select-none cursor-pointer text-[10px] tracking-[0.2em]',
        isHolding
          ? 'border-mint-leaf shadow-[0_0_25px_rgba(65,210,162,0.35)]'
          : 'border-white/25 hover:border-mint-leaf'
      )}
    >
      <span
        className={cn(
          'relative z-10 transition-colors',
          isHolding ? 'text-mint-leaf' : 'text-white group-hover:text-mint-leaf'
        )}
      >
        {label}
      </span>

      {/* Fill Bar Effect */}
      <div
        className={cn(
          'absolute inset-0 bg-mint-leaf/20 transition-transform duration-500 origin-left',
          isHolding ? 'scale-x-100' : 'scale-x-0'
        )}
      />
    </button>
  );
}
