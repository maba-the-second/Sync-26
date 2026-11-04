import { useAppStore } from '../../store/useAppStore';

const FOOTER_LINKS: {
  heading: string;
  items: { label: string; target?: string }[];
}[] = [
  {
    heading: '01 // NAVIGATION',
    items: [
      { label: 'PROJECT', target: '#project' },
      { label: 'THE KEEP', target: '#the-keep' },
      { label: 'FACTIONS', target: '#factions' },
      { label: 'THE WORLD', target: '#the-world' },
    ],
  },
  {
    heading: '02 // NETWORK',
    items: [
      { label: 'DISCORD' },
      { label: 'X // TWITTER' },
      { label: 'MANIFESTO', target: '#about' },
      { label: 'GITHUB' },
    ],
  },
  {
    heading: '03 // LEGAL & LORE',
    items: [
      { label: 'PRIVACY POLICY' },
      { label: 'TERMS OF USE' },
      { label: 'SECURITY BRIEF' },
      { label: 'PRESS KIT' },
    ],
  },
];

export function KprFooter() {
  const scrollProgress = useAppStore((state) => state.scrollProgress);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (target?: string) => {
    if (target) {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    scrollToTop();
  };

  return (
    <footer className="fixed inset-0 z-0 bg-evergreen text-white flex flex-col justify-between pl-16 sm:pl-20 md:pl-24 pr-6 sm:pr-10 md:pr-14 pt-20 sm:pt-24 pb-16 sm:pb-20 select-none overflow-hidden">
      {/* Subtle Radial Mint Glow & Grid Overlay in Footer Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 100%, #41D2A2 0%, #178966 28%, #043826 70%, #000000 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(to right, #D6F8ED 1px, transparent 1px), linear-gradient(to bottom, #D6F8ED 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* TOP TELEMETRY & DIRECTORY GRID */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-b border-white/15 py-8 font-mono text-xs uppercase tracking-widest">
        {/* Left Brand Brief */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-6 pr-6">
          <div className="inline-flex items-center gap-2 text-mint-leaf text-[10px] tracking-[0.25em]">
            <span className="w-2 h-2 bg-mint-leaf inline-block animate-pulse" />
            <span>TERMINAL // END OF TRANSMISSION</span>
          </div>
          <p className="font-sans text-xs sm:text-sm text-white/80 leading-relaxed tracking-normal normal-case max-w-sm">
            You have reached the foundation layer of SYNC&apos;26. The upper reality curtain has lifted to expose the core archive.
          </p>
          <div className="text-[10px] text-white/40 tracking-[0.2em]">
            DEPTH LOCK // {(scrollProgress * 100).toFixed(1)}% — SECURE CONNECTION
          </div>
        </div>

        {/* Center/Right Directory Columns */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading} className="space-y-3">
              <div className="text-[10px] text-mint-leaf tracking-[0.22em]">
                {col.heading}
              </div>
              <ul className="space-y-2">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.target ?? '#top'}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(item.target);
                      }}
                      className="pointer-events-auto inline-flex items-center gap-1.5 text-[11px] text-white/70 hover:text-mint-leaf transition-colors"
                    >
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* MASSIVE KPR-STYLE FULL-BLEED BANNER AT THE BOTTOM */}
      <div className="relative z-10 flex flex-col justify-end my-auto pt-6">
        <div className="flex items-end justify-between mb-2 font-mono text-[10px] tracking-[0.25em] text-white/50 uppercase">
          <span>04F // CORE ARCHIVE BANNER</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="pointer-events-auto px-4 py-2 border border-mint-leaf/40 bg-black/40 text-mint-leaf hover:bg-mint-leaf hover:text-black transition-colors cursor-pointer"
          >
            [ RETURN TO SURFACE ↑ ]
          </button>
        </div>

        {/* Giant Monumental SYNC'26 Banner */}
        <div className="w-full overflow-hidden border-t border-white/15 pt-4">
          <div className="font-ethnocentric text-[clamp(3.2rem,13.2vw,14rem)] leading-[0.82] tracking-tighter uppercase text-white select-none drop-shadow-[0_0_50px_rgba(65,210,162,0.3)]">
            SYNC&apos;26<span className="text-mint-leaf">.</span>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] tracking-[0.2em] text-white/45 uppercase">
          <span>© 2026 SYNC&apos;26 COLLECTIVE. ALL RIGHTS RESERVED.</span>
          <span className="text-mint-leaf/80">KEEP. PROTECT. REIMAGINE.</span>
        </div>
      </div>
    </footer>
  );
}
