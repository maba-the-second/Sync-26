import { useEffect, useRef, useState } from 'react';
import { useAppStore, type PageId } from '../../store/useAppStore';
import { ShuffleText } from './ShuffleText';

const NAV_ITEMS = [
  { label: 'FRONTIER', target: '#project', section: 0 },
  { label: 'ROADMAP', target: '#the-keep', section: 1 },
  { label: 'CATEGORIES', target: '#factions', section: 2 },
];

const SIDEBAR_ITEMS: { label: string; page: PageId }[] = [
  { label: 'HOME', page: 'home' },
  { label: 'REGISTER', page: 'registrations' },
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
  const odysseyStage2 = useAppStore((state) => state.odysseyStage2);

  const isOdysseyStage1 = activePage === 'odyssey' && !odysseyStage2;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Detect touch-first devices (no hover, coarse pointer) to swap keyboard hints for touch controls
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setIsTouch(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Close the drawer with Escape
  useEffect(() => {
    if (!isSidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSidebarOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSidebarOpen]);

  useEffect(() => {
    return useAppStore.subscribe((state) => {
      const pct = `${(state.scrollProgress * 100).toFixed(1)}%`;
      if (progressBarRef.current) {
        progressBarRef.current.style.width = pct;
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
    if (isOdysseyStage1) return;
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`hud-safe fixed inset-0 z-40 pointer-events-none font-mono text-[13px] sm:text-[15px] tracking-[0.2em] uppercase select-none transition-opacity duration-1000 ${
        isOdysseyStage1 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Main 1px KPRverse Outer Grid Frame */}
      <div className="relative w-full h-full border border-white/20 rounded-none md:rounded-lg overflow-hidden flex">
        {/* Tap-outside scrim to close the drawer (mobile/tablet friendly) */}
        <div
          aria-hidden="true"
          onClick={() => setIsSidebarOpen(false)}
          className={`absolute inset-0 z-40 bg-black/50 transition-opacity duration-500 ${
            isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* SLIDE-OUT SIDEBAR DRAWER */}
        <div
          className={`${
            isOdysseyStage1 ? 'pointer-events-none' : 'pointer-events-auto'
          } absolute top-0 bottom-0 left-0 z-50 w-full sm:w-auto max-w-full bg-black/95 backdrop-blur-xl border-r border-white/20 transition-transform duration-500 ease-in-out flex ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex-1 min-w-0 sm:flex-none sm:w-[520px] md:w-[600px] h-full flex flex-col justify-between pt-6 sm:pt-8 overflow-y-auto overscroll-contain">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-10 px-4 sm:px-6">
              <span className="text-[11px] text-mint-leaf shrink-0 pt-2">
                <ShuffleText text="DISCOVER" />
              </span>
              <ul className="font-ethnocentric flex flex-col gap-2 sm:gap-3 text-[15px] sm:text-xl md:text-2xl tracking-wider w-full">
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
                        className={`w-full max-w-full break-words min-h-[44px] sm:min-h-0 px-3 py-2 sm:py-1.5 text-left leading-tight transition-colors cursor-pointer ${
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
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-16 border-t border-white/20 p-4">
                <span className="text-[9px] text-white/50">CONNECT</span>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px]">
                  <a
                    href="https://chat.whatsapp.com/IaBJyTRhZcACMFKUOrYndg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[36px] sm:min-h-0 inline-flex items-center text-white hover:text-mint-leaf cursor-pointer"
                  >
                    <ShuffleText text="WHATSAPP" />
                  </a>
                  <a
                    href="https://instagram.com/dharmaraja_ict_society"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[36px] sm:min-h-0 inline-flex items-center text-white hover:text-mint-leaf cursor-pointer"
                  >
                    <ShuffleText text="INSTAGRAM" />
                  </a>
                  <a
                    href="https://facebook.com/dhamarajaicts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[36px] sm:min-h-0 inline-flex items-center text-white hover:text-mint-leaf cursor-pointer"
                  >
                    <ShuffleText text="FACEBOOK" />
                  </a>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-16 border-t border-white/20 p-4">
                <span className="text-[10px] text-mint-leaf">
                  DHARMARAJA COLLEGE ICT SOCIETY
                </span>
              </div>
            </div>
          </div>

          {/* Drawer Right Close Strip */}
          <div className="w-12 sm:w-14 h-full shrink-0 border-l border-white/20 flex flex-col justify-between items-center pb-6">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              aria-label="Close Menu"
              className="w-full h-12 border-b border-white/20 flex items-center justify-center text-white hover:text-mint-leaf cursor-pointer"
            >
              ✕
            </button>
            <img src="./images/logo.png" alt="Logo" className="w-8 opacity-80" />
            <div />
          </div>
        </div>

        {/* LEFT SIDEBAR RAIL */}
        <aside className="w-11 sm:w-12 md:w-14 h-full border-r border-white/20 flex flex-col justify-between items-center shrink-0 bg-black/25 backdrop-blur-[2px]">
          {/* Top-Left Hamburger Box */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className={`${
              isOdysseyStage1 ? 'pointer-events-none' : 'pointer-events-auto'
            } w-full h-12 border-b border-white/20 flex flex-col items-center justify-center gap-1.5 hover:bg-white/5 transition-colors cursor-pointer group shrink-0`}
            aria-label="Open Menu"
          >
            <span className="w-5 h-[1.5px] bg-white group-hover:bg-mint-leaf transition-colors" />
            <span className="w-4 h-[1.5px] bg-white group-hover:bg-mint-leaf transition-colors -ml-1" />
          </button>

          {/* Mobile Vertical Upper Telemetry Rail */}
          <div
            aria-hidden="true"
            className="md:hidden flex-1 w-full flex flex-col items-center justify-between py-3 pointer-events-none"
          >
            <span className="w-2 h-px bg-white/25" />
            <span className="w-px flex-1 bg-gradient-to-b from-white/20 via-white/10 to-mint-leaf/35 my-2" />
            <span className="w-px flex-1 bg-gradient-to-b from-mint-leaf/35 via-white/10 to-white/20 my-2" />
            <span className="w-2 h-px bg-white/25" />
          </div>

          {/* Center-Left Vertical KPR/SYNC Geometric Emblem */}
          <div className="flex flex-col items-center justify-center my-auto px-2 shrink-0">
            <img src="./images/logo.png" alt="KPR Emblem" className="w-6 sm:w-7 opacity-90" />
          </div>

          {/* Mobile Vertical Lower Telemetry Rail */}
          <div
            aria-hidden="true"
            className="md:hidden flex-1 w-full flex flex-col items-center justify-between py-3 pointer-events-none"
          >
            <span className="w-2 h-px bg-white/25" />
            <span className="w-px flex-1 bg-gradient-to-b from-white/20 via-white/10 to-white/20 my-2" />
            <span className="w-px flex-1 bg-gradient-to-b from-white/20 via-white/10 to-white/20 my-2" />
            <div className="flex flex-col items-center gap-1">
              <span className="w-1.5 h-px bg-white/25" />
              <span className="w-2.5 h-px bg-mint-leaf/55" />
              <span className="w-1.5 h-px bg-white/25" />
            </div>
          </div>

          {/* Bottom-Left Sound Equalizer Button (/audio/bgm.mp3) */}
          <button
            type="button"
            onClick={handleAudioToggle}
            className={`${
              isOdysseyStage1 ? 'pointer-events-none' : 'pointer-events-auto'
            } w-full h-12 border-t border-white/20 flex items-center justify-center gap-[2px] hover:bg-white/5 transition-colors cursor-pointer group shrink-0`}
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
        <div className="relative flex-1 h-full flex flex-col justify-between min-w-0">
          {/* Mobile HUD Corner Brackets & Edge Reticle */}
          <div
            aria-hidden="true"
            className="md:hidden pointer-events-none absolute top-[54px] left-1.5 w-2.5 h-2.5 border-t border-l border-mint-leaf/45"
          />
          <div
            aria-hidden="true"
            className="md:hidden pointer-events-none absolute top-[54px] right-1.5 w-2.5 h-2.5 border-t border-r border-mint-leaf/45"
          />
          <div
            aria-hidden="true"
            className="md:hidden pointer-events-none absolute bottom-[52px] left-1.5 w-2.5 h-2.5 border-b border-l border-mint-leaf/45"
          />
          <div
            aria-hidden="true"
            className="md:hidden pointer-events-none absolute bottom-[52px] right-1.5 w-2.5 h-2.5 border-b border-r border-mint-leaf/45"
          />
          <div
            aria-hidden="true"
            className="md:hidden pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col items-end gap-1.5 opacity-45"
          >
            <span className="w-1.5 h-px bg-white/40" />
            <span className="w-1 h-px bg-white/30" />
            <span className="w-2.5 h-px bg-mint-leaf" />
            <span className="w-1 h-px bg-white/30" />
            <span className="w-1.5 h-px bg-white/40" />
          </div>

          {/* Top Navigation Bar with Scroll Progress Fill */}
          <header className="relative w-full h-12 border-b border-white/20 flex items-center justify-between bg-black/25 backdrop-blur-[2px] overflow-hidden shrink-0">
            {/* Scroll Progress Fill Bar */}
            <div
              ref={progressBarRef}
              className="absolute top-0 left-0 h-full bg-mint-leaf/15 border-r border-mint-leaf/60 transition-all duration-150 pointer-events-none"
              style={{ width: '0.0%' }}
            />

            {/* Center Top Navigation Links or Logo on Registrations */}
            {activePage === 'registrations' ? (
              <div className="relative z-10 w-full h-full flex items-center justify-center px-2.5 md:px-0">
                <div className="pointer-events-auto flex items-center justify-center">
                  <img
                    src="./images/Sync logo 2.png"
                    alt="SYNC'26 Logo"
                    className="h-7 sm:h-8 md:h-9 w-auto object-contain opacity-95"
                    draggable={false}
                  />
                </div>
              </div>
            ) : (
              <>
              {/* Compact brand mark on phones, where desktop section nav is hidden */}
              <div className="md:hidden relative z-10 pl-2.5 flex items-center shrink-0">
                <img
                  src="./images/Sync logo 2.png"
                  alt="SYNC'26 Logo"
                  className="h-6 sm:h-7 w-auto object-contain opacity-95"
                  draggable={false}
                />
              </div>
              <nav
                className={`relative z-10 ${
                  isOdysseyStage1 ? 'pointer-events-none' : 'pointer-events-auto'
                } hidden md:flex items-center gap-4 lg:gap-10 mx-auto`}
              >
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = activeSection === idx;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => scrollToTarget(item.target)}
                      className={`nav-hover-pill px-2 py-1 flex items-center gap-2 text-[11px] lg:text-[13px] tracking-[0.18em] lg:tracking-[0.22em] transition-colors cursor-pointer ${
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
              </>
            )}

            {/* Top-Right Chamfered White "REGISTER NOW" Button (Hidden on Registrations Page) */}
            {activePage !== 'registrations' && (
              <div className="relative z-10 h-full flex items-center ml-auto md:ml-0 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    setActivePage('registrations');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className={`${
                    isOdysseyStage1 ? 'pointer-events-none' : 'pointer-events-auto'
                  } h-full bg-white hover:bg-mint-leaf text-black font-mono font-bold text-[10px] sm:text-[13px] tracking-[0.14em] sm:tracking-[0.22em] pl-5 pr-3.5 sm:px-7 transition-colors cursor-pointer whitespace-nowrap`}
                  style={{
                    clipPath:
                      'polygon(0 0, 100% 0, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
                  }}
                >
                  <span className="sm:hidden">
                    <ShuffleText text="REGISTER" />
                  </span>
                  <span className="hidden sm:inline">
                    <ShuffleText text="REGISTER NOW" />
                  </span>
                </button>
              </div>
            )}
          </header>

          {/* Bottom Bar: Hold Status & "SCROLL ⌄" Indicator */}
          <footer className="w-full flex items-end justify-between gap-3 px-3 sm:px-8 pb-3 sm:pb-5">
            {/* Spacebar-Hold Accelerate Control */}
            <div className="flex items-center gap-4 min-w-0">
              {activePage === 'home' ? null : isTouch ? (
                /* Touch devices have no space bar: press-and-hold this control instead */
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture?.(e.pointerId);
                    setIsHolding(true);
                  }}
                  onPointerUp={() => setIsHolding(false)}
                  onPointerCancel={() => setIsHolding(false)}
                  onLostPointerCapture={() => setIsHolding(false)}
                  onContextMenu={(e) => e.preventDefault()}
                  className={`${
                    isOdysseyStage1 ? 'pointer-events-none' : 'pointer-events-auto'
                  } relative min-h-[40px] px-3 py-2 border bg-black/70 backdrop-blur-md text-[9px] tracking-[0.18em] select-none touch-none overflow-hidden transition-colors ${
                    isHolding ? 'border-mint-leaf text-mint-leaf' : 'border-white/25 text-white/80'
                  }`}
                  style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
                  aria-label="Press and hold to accelerate"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 bg-mint-leaf/20 origin-left transition-transform duration-500 ${
                      isHolding ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                  <span className="relative">
                    {isHolding ? 'ACCELERATING' : 'HOLD TO ACCELERATE'}
                  </span>
                </button>
              ) : (
                <span className="inline-block text-[9px] text-white/50">
                  {isHolding ? (
                    <span className="text-mint-leaf">ACCELERATING</span>
                  ) : (
                    'HOLD SPACE TO ACCELERATE'
                  )}
                </span>
              )}
            </div>

            {/* Bottom-Right SCROLL V Indicator (Hidden on Registrations Page or during Odyssey Stage 1) */}
            {activePage !== 'registrations' && (
              <div
                className={`flex shrink-0 items-center gap-2 text-[10px] tracking-[0.25em] text-white/80 transition-opacity duration-700 ${
                  isOdysseyStage1 ? 'opacity-0' : 'opacity-100'
                }`}
              >
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
