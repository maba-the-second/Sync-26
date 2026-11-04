import { useRef, useState } from 'react';
import { useAppStore, type PageId } from '../../store/useAppStore';
import { HoldButton } from './HoldButton';
import { ShuffleText } from './ShuffleText';

const NAV_ITEMS = [
  { label: 'PROJECT', target: '#project', section: 0 },
  { label: 'THE KEEP', target: '#the-keep', section: 1 },
  { label: 'FACTIONS', target: '#factions', section: 2 },
  { label: 'THE WORLD', target: '#the-world', section: 3 },
];

const SIDEBAR_ITEMS: { label: string; page: PageId }[] = [
  { label: 'HOME', page: 'home' },
  { label: 'REGISTRATIONS', page: 'registrations' },
  { label: 'SUBMISSIONS', page: 'submissions' },
  { label: 'ODYSSEY', page: 'odyssey' },
  { label: 'ASPECT', page: 'aspect' },
  { label: 'ABOUT', page: 'about' },
];

export function HudFrame() {
  const activePage = useAppStore((state) => state.activePage);
  const setActivePage = useAppStore((state) => state.setActivePage);
  const isHolding = useAppStore((state) => state.isHolding);
  const scrollProgress = useAppStore((state) => state.scrollProgress);
  const activeSection = useAppStore((state) => state.activeSection);
  const audioMuted = useAppStore((state) => state.audioMuted);
  const toggleAudio = useAppStore((state) => state.toggleAudio);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAudioToggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('./audio/bgm.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.45;
    }
    if (audioMuted) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
    toggleAudio();
  };

  const scrollToTarget = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-40 pointer-events-none p-2.5 sm:p-3.5 md:p-4 font-mono text-[10px] tracking-[0.2em] uppercase select-none">
      {/* Main 1px KPRverse Outer Grid Frame */}
      <div className="relative w-full h-full border border-white/20 rounded-lg overflow-hidden flex">
        {/* SLIDE-OUT SIDEBAR DRAWER */}
        <div
          className={`pointer-events-auto absolute top-0 bottom-0 left-0 z-50 bg-black/95 backdrop-blur-xl border-r border-white/20 transition-transform duration-500 ease-in-out flex ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="w-[340px] sm:w-[500px] md:w-[560px] h-full flex flex-col justify-between pt-8">
            <div className="flex items-start gap-6 sm:gap-10 px-6">
              <span className="text-[9px] text-mint-leaf shrink-0 pt-2">
                <ShuffleText text="DISCOVER" />
              </span>
              <ul className="font-ethnocentric flex flex-col gap-3 text-lg sm:text-2xl md:text-[26px] tracking-wider whitespace-nowrap">
                {SIDEBAR_ITEMS.map((item) => {
                  const isCurrentPage = activePage === item.page;
                  return (
                    <li key={item.label}>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSidebarOpen(false);
                          setActivePage(item.page);
                          window.scrollTo({ top: 0, behavior: 'instant' });
                        }}
                        className={`px-3 py-1 transition-colors cursor-pointer ${
                          isCurrentPage
                            ? 'bg-mint-leaf text-black'
                            : 'text-white hover:bg-white hover:text-black'
                        }`}
                        style={{
                          clipPath:
                            'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
                        }}
                      >
                        <ShuffleText text={item.label} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="w-full">
              <div className="flex items-center gap-16 border-t border-white/20 p-4">
                <span className="text-[9px] text-white/50">CONNECT</span>
                <div className="flex gap-6 text-[10px]">
                  <span className="text-white hover:text-mint-leaf cursor-pointer">
                    <ShuffleText text="TWITTER" />
                  </span>
                  <span className="text-white hover:text-mint-leaf cursor-pointer">
                    <ShuffleText text="DISCORD" />
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-16 border-t border-white/20 p-4">
                <span className="text-[9px] text-white/50">SYSTEM</span>
                <span className="text-[10px] text-mint-leaf">SYNC&apos;26 // © 2026</span>
              </div>
            </div>
          </div>

          {/* Drawer Right Close Strip */}
          <div className="w-14 h-full border-l border-white/20 flex flex-col justify-between items-center pb-6">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="w-full h-12 border-b border-white/20 flex items-center justify-center text-white hover:text-mint-leaf cursor-pointer"
            >
              ✕
            </button>
            <img src="./images/logo.png" alt="Logo" className="w-8 opacity-80" />
            <span className="text-[8px] text-mint-leaf">ONLINE</span>
          </div>
        </div>

        {/* LEFT SIDEBAR RAIL */}
        <aside className="w-11 sm:w-12 md:w-14 h-full border-r border-white/20 flex flex-col justify-between items-center shrink-0 bg-black/25 backdrop-blur-[2px]">
          {/* Top-Left Hamburger Box */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="pointer-events-auto w-full h-12 border-b border-white/20 flex flex-col items-center justify-center gap-1.5 hover:bg-white/5 transition-colors cursor-pointer group"
            aria-label="Open Menu"
          >
            <span className="w-5 h-[1.5px] bg-white group-hover:bg-mint-leaf transition-colors" />
            <span className="w-4 h-[1.5px] bg-white group-hover:bg-mint-leaf transition-colors -ml-1" />
          </button>

          {/* Center-Left Vertical KPR/SYNC Geometric Emblem */}
          <div className="flex flex-col items-center justify-center my-auto px-2">
            <img src="./images/logo.png" alt="KPR Emblem" className="w-7 opacity-90" />
          </div>

          {/* Bottom-Left Sound Equalizer Button (/audio/bgm.mp3) */}
          <button
            type="button"
            onClick={handleAudioToggle}
            className="pointer-events-auto w-full h-12 border-t border-white/20 flex items-center justify-center gap-[2px] hover:bg-white/5 transition-colors cursor-pointer group"
            title={audioMuted ? 'Play BGM' : 'Pause BGM'}
          >
            <span
              className={`w-[2px] bg-white group-hover:bg-mint-leaf transition-all ${
                audioMuted ? 'h-1.5 opacity-40' : 'h-2.5 animate-pulse'
              }`}
            />
            <span
              className={`w-[2px] bg-mint-leaf transition-all ${
                audioMuted ? 'h-1.5 opacity-40' : 'h-4 animate-pulse'
              }`}
            />
            <span
              className={`w-[2px] bg-white group-hover:bg-mint-leaf transition-all ${
                audioMuted ? 'h-1.5 opacity-40' : 'h-3 animate-pulse'
              }`}
            />
            <span
              className={`w-[2px] bg-white group-hover:bg-mint-leaf transition-all ${
                audioMuted ? 'h-1.5 opacity-40' : 'h-2 animate-pulse'
              }`}
            />
            <span
              className={`w-[2px] bg-mint-leaf transition-all ${
                audioMuted ? 'h-1.5 opacity-40' : 'h-3.5 animate-pulse'
              }`}
            />
          </button>
        </aside>

        {/* MAIN INNER HUD CANVAS OVERLAY */}
        <div className="relative flex-1 h-full flex flex-col justify-between">
          {/* Top Navigation Bar with Scroll Progress Fill */}
          <header className="relative w-full h-12 border-b border-white/20 flex items-center justify-between bg-black/25 backdrop-blur-[2px] overflow-hidden">
            {/* Scroll Progress Fill Bar */}
            <div
              className="absolute top-0 left-0 h-full bg-mint-leaf/15 border-r border-mint-leaf/60 transition-all duration-150 pointer-events-none"
              style={{ width: `${(scrollProgress * 100).toFixed(1)}%` }}
            />

            {/* Subtle Left Telemetry Counter */}
            <div className="relative z-10 hidden lg:flex items-center gap-2 pl-5 text-[9px] text-white/60">
              <span className="w-1.5 h-1.5 bg-mint-leaf inline-block" />
              <span>SYS.LOC // {(scrollProgress * 100).toFixed(1)}%</span>
            </div>

            {/* Center Top Navigation Links with ShuffleText & Hover Pill */}
            <nav className="relative z-10 pointer-events-auto flex items-center gap-5 sm:gap-8 md:gap-10 mx-auto">
              {NAV_ITEMS.map((item, idx) => {
                const isActive = activeSection === idx;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => scrollToTarget(item.target)}
                    className={`nav-hover-pill px-2 py-1 flex items-center gap-2 text-[10px] tracking-[0.22em] transition-colors cursor-pointer ${
                      isActive ? 'text-white font-semibold' : 'text-white/65'
                    }`}
                  >
                    <span>
                      {isActive && '■ '}
                      <ShuffleText text={item.label} />
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Top-Right Chamfered White "SIGN IN" Button */}
            <div className="relative z-10 h-full flex items-center">
              <button
                type="button"
                className="pointer-events-auto h-full bg-white hover:bg-mint-leaf text-black font-mono font-bold text-[10px] tracking-[0.22em] px-6 sm:px-7 transition-colors cursor-pointer"
                style={{
                  clipPath:
                    'polygon(0 0, 100% 0, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
                }}
              >
                <ShuffleText text="SIGN IN" />
              </button>
            </div>
          </header>

          {/* Bottom Bar: Hold Trigger & "SCROLL ⌄" Indicator */}
          <footer className="w-full flex items-end justify-between px-5 sm:px-8 pb-4 sm:pb-5">
            {/* Hold-to-Decrypt Trigger */}
            <div className="flex items-center gap-4">
              <HoldButton />
              <span className="hidden xl:inline-block text-[9px] text-white/50">
                {isHolding ? (
                  <span className="text-mint-leaf">BREACH ACTIVE // REALITY PEELING</span>
                ) : (
                  'HOLD [SPACE] OR BUTTON TO DECRYPT'
                )}
              </span>
            </div>

            {/* Bottom-Right SCROLL V Indicator */}
            <div className="flex items-center gap-2 text-[10px] tracking-[0.25em] text-white/80">
              <span>SCROLL</span>
              <svg
                className="w-3 h-3 text-mint-leaf animate-bounce"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="square"
                />
              </svg>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
