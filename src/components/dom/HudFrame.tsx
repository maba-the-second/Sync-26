import { useEffect, useRef, useState } from 'react';
import { useAppStore, type PageId } from '../../store/useAppStore';
import { ShuffleText } from './ShuffleText';

const NAV_ITEMS = [
  { label: 'FRONTIER', target: '#project', section: 0 },
  { label: 'ROADMAP', target: '#the-keep', section: 1 },
  { label: 'CATEGORIES', target: '#factions', section: 2 },
  { label: 'THE WORLD', target: '#the-world', section: 3 },
];

const SIDEBAR_ITEMS: { label: string; page: PageId }[] = [
  { label: 'HOME', page: 'home' },
  { label: 'REGISTRATIONS AND SUBMISSIONS', page: 'registrations' },
  { label: 'ODYSSEY', page: 'odyssey' },
  { label: 'ASPECT', page: 'aspect' },
  { label: 'ABOUT', page: 'about' },
];

export function HudFrame() {
  const activePage = useAppStore((state) => state.activePage);
  const setActivePage = useAppStore((state) => state.setActivePage);
  const isHolding = useAppStore((state) => state.isHolding);
  const setIsHolding = useAppStore((state) => state.setIsHolding);
  const activeSection = useAppStore((state) => state.activeSection);
  const audioMuted = useAppStore((state) => state.audioMuted);
  const toggleAudio = useAppStore((state) => state.toggleAudio);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return useAppStore.subscribe((state) => {
      const pct = `${(state.scrollProgress * 100).toFixed(1)}%`;
      if (progressBarRef.current) {
        progressBarRef.current.style.width = pct;
      }
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `SYS.LOC // ${pct}`;
      }
    });
  }, []);

  useEffect(() => {
    if (activePage === 'home') {
      setIsHolding(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (!e.repeat) {
          setIsHolding(true);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsHolding(false);
      }
    };

    const handleBlur = () => {
      setIsHolding(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [activePage, setIsHolding]);

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
          <div className="w-[320px] sm:w-[520px] md:w-[600px] h-full flex flex-col justify-between pt-8">
            <div className="flex items-start gap-6 sm:gap-10 px-6">
              <span className="text-[9px] text-mint-leaf shrink-0 pt-2">
                <ShuffleText text="DISCOVER" />
              </span>
              <ul className="font-ethnocentric flex flex-col gap-3 text-base sm:text-xl md:text-2xl tracking-wider">
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
                        className={`px-3 py-1.5 text-left leading-tight transition-colors cursor-pointer ${
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
                <div className="flex flex-wrap gap-6 text-[10px]">
                  <a
                    href="https://chat.whatsapp.com/IaBJyTRhZcACMFKUOrYndg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-mint-leaf cursor-pointer"
                  >
                    <ShuffleText text="WHATSAPP" />
                  </a>
                  <a
                    href="https://instagram.com/dharmaraja_ict_society"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-mint-leaf cursor-pointer"
                  >
                    <ShuffleText text="INSTAGRAM" />
                  </a>
                  <a
                    href="https://facebook.com/dhamarajaicts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-mint-leaf cursor-pointer"
                  >
                    <ShuffleText text="FACEBOOK" />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-16 border-t border-white/20 p-4">
                <span className="text-[9px] text-white/50">SYSTEM</span>
                <span className="text-[10px] text-mint-leaf">
                  DHARMARAJA ICT SOCIETY // SYNC'26
                </span>
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
              ref={progressBarRef}
              className="absolute top-0 left-0 h-full bg-mint-leaf/15 border-r border-mint-leaf/60 transition-all duration-150 pointer-events-none"
              style={{ width: '0.0%' }}
            />

            {/* Subtle Left Telemetry Counter */}
            <div className="relative z-10 hidden lg:flex items-center gap-2 pl-5 text-[9px] text-white/60">
              <span className="w-1.5 h-1.5 bg-mint-leaf inline-block" />
              <span ref={progressTextRef}>SYS.LOC // 0.0%</span>
            </div>

            {/* Center Top Navigation Links or Page Title on Registrations */}
            {activePage === 'registrations' ? (
              <div className="relative z-10 pointer-events-auto mx-auto pr-0 lg:pr-24">
                <button
                  type="button"
                  className="nav-hover-pill px-2 py-1 flex items-center gap-2 text-[10px] tracking-[0.22em] text-white font-semibold transition-colors cursor-pointer"
                >
                  <span>
                    ■ <ShuffleText text="REGISTRATIONS AND SUBMISSIONS" />
                  </span>
                </button>
              </div>
            ) : (
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
            )}

            {/* Top-Right Chamfered White "REGISTER NOW" Button (Hidden on Registrations Page) */}
            {activePage !== 'registrations' && (
              <div className="relative z-10 h-full flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    setActivePage('registrations');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className="pointer-events-auto h-full bg-white hover:bg-mint-leaf text-black font-mono font-bold text-[10px] tracking-[0.22em] px-6 sm:px-7 transition-colors cursor-pointer"
                  style={{
                    clipPath:
                      'polygon(0 0, 100% 0, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
                  }}
                >
                  <ShuffleText text="REGISTER NOW" />
                </button>
              </div>
            )}
          </header>

          {/* Bottom Bar: Hold Status & "SCROLL ⌄" Indicator */}
          <footer className="w-full flex items-end justify-between px-5 sm:px-8 pb-4 sm:pb-5">
            {/* Spacebar-Hold Decrypt Telemetry (Disabled on Home Page) */}
            <div className="flex items-center gap-4">
              {activePage !== 'home' && (
                <span className="inline-block text-[9px] text-white/50">
                  {isHolding ? (
                    <span className="text-mint-leaf">BREACH ACTIVE // REALITY PEELING</span>
                  ) : (
                    'PRESS AND HOLD SPACE BAR TO ACCELERATE'
                  )}
                </span>
              )}
            </div>

            {/* Bottom-Right SCROLL V Indicator (Hidden on Registrations Page) */}
            {activePage !== 'registrations' && (
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
            )}
          </footer>
        </div>
      </div>
    </div>
  );
}
