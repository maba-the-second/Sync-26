import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { cn } from '../../utils/cn';

export function Preloader() {
  const isLoaded = useAppStore((state) => state.isLoaded);
  const setIsLoaded = useAppStore((state) => state.setIsLoaded);
  const [progress, setProgress] = useState(0);
  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(interval);
          window.setTimeout(() => setIsLoaded(true), 250);
          return 100;
        }
        return Math.min(100, prev + Math.floor(Math.random() * 18) + 8);
      });
    }, 70);

    return () => window.clearInterval(interval);
  }, [setIsLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    const timer = window.setTimeout(() => setUnmounted(true), 750);
    return () => window.clearTimeout(timer);
  }, [isLoaded]);

  if (unmounted) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 h-screen h-[100dvh] bg-black flex flex-col justify-between p-5 sm:p-10 font-mono text-[10px] sm:text-xs uppercase tracking-widest transition-opacity duration-700',
        isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      )}
    >
      <div className="flex justify-between gap-3 text-white/50">
        <span>SYNC'26 ENGINE BOOT SEQUENCE</span>
        <span className="shrink-0">REV 26.04</span>
      </div>

      <div className="max-w-md w-full mx-auto space-y-3">
        <div className="flex justify-between gap-2 text-white">
          <span className="truncate">INITIALIZING DUAL-LAYER WEBGL STENCIL...</span>
          <span className="text-mint-leaf shrink-0">{progress}%</span>
        </div>
        <div className="h-1 w-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-mint-leaf transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="text-white/40 flex justify-between">
        <span>MEMORY: ALLOCATED</span>
        <span>STATUS: READY</span>
      </div>
    </div>
  );
}
