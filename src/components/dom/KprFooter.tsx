const FOOTER_LINKS: {
  heading: string;
  items: { label: string; target?: string; href?: string }[];
}[] = [
  {
    heading: 'NAVIGATION',
    items: [
      { label: 'FRONTIER', target: '#project' },
      { label: 'ROADMAP', target: '#the-keep' },
      { label: 'CATEGORIES', target: '#factions' },
      { label: 'THE WORLD', target: '#the-world' },
    ],
  },
  {
    heading: 'COMMUNITY & SOCIALS',
    items: [
      { label: 'WHATSAPP COMMUNITY', href: 'https://chat.whatsapp.com/IaBJyTRhZcACMFKUOrYndg' },
      { label: 'DIRECT WHATSAPP', href: 'https://wa.link/05138r' },
      { label: 'INSTAGRAM', href: 'https://instagram.com/dharmaraja_ict_society' },
      { label: 'FACEBOOK', href: 'https://facebook.com/dhamarajaicts' },
    ],
  },
  {
    heading: 'CONTACT',
    items: [
      { label: 'MUDITHA  +94 70 264 5851', href: 'tel:+94702645851' },
      { label: 'NETHUN  +94 71 490 6145', href: 'tel:+94714906145' },
      { label: 'DRCK.ICTSOCIETY@GMAIL.COM', href: 'mailto:drck.ictsociety@gmail.com' },
      { label: 'ABOUT', target: '#about' },
    ],
  },
];

export function KprFooter() {
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
    <footer className="fixed inset-0 z-0 bg-evergreen text-white flex flex-col justify-between pl-16 pr-4 sm:pl-20 sm:pr-10 md:pl-24 md:pr-14 pt-16 sm:pt-24 pb-10 sm:pb-20 select-none overflow-y-auto md:overflow-hidden">
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
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 border-t border-b border-white/15 py-4 sm:py-8 font-mono text-xs uppercase tracking-widest">
        {/* Left Brand Brief */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-3 sm:space-y-6 md:pr-6">
          <p className="font-mono text-[12px] sm:text-[15px] text-white/80 leading-relaxed tracking-normal normal-case max-w-sm">
            Official competition and registration platform of the Dharmaraja College Information &amp; Communication Technology Society.
          </p>
        </div>

        {/* Center/Right Directory Columns */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {FOOTER_LINKS.map((col, colIdx) => (
            <div key={col.heading} className={`space-y-2 sm:space-y-3 min-w-0 ${colIdx === 2 ? 'col-span-2 sm:col-span-1' : ''}`}>
              <div className="text-[11px] sm:text-[13px] text-mint-leaf tracking-[0.18em] sm:tracking-[0.22em]">
                {col.heading}
              </div>
              <ul className="space-y-1 sm:space-y-2">
                {col.items.map((item) => (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="pointer-events-auto inline-flex items-center gap-1.5 min-h-[32px] sm:min-h-0 text-[11px] sm:text-[12px] text-white/70 hover:text-mint-leaf transition-colors break-all sm:break-normal"
                      >
                        <span>{item.label}</span>
                      </a>
                    ) : (
                      <a
                        href={item.target ?? '#top'}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLinkClick(item.target);
                        }}
                        className="pointer-events-auto inline-flex items-center gap-1.5 min-h-[32px] sm:min-h-0 text-[11px] sm:text-[12px] text-white/70 hover:text-mint-leaf transition-colors"
                      >
                        <span>{item.label}</span>
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* MASSIVE KPR-STYLE FULL-BLEED BANNER AT THE BOTTOM */}
      <div className="relative z-10 flex flex-col justify-end my-auto pt-4 sm:pt-6">
        <div className="flex items-end justify-between mb-1.5 sm:mb-2 font-mono text-[10px] sm:text-[13px] tracking-[0.2em] sm:tracking-[0.25em] text-white/50 uppercase">
          <span>DHARMARAJA COLLEGE ICT SOCIETY</span>
        </div>

        {/* Giant Monumental SYNC'26 Banner */}
        <div className="w-full overflow-hidden border-t border-white/15 pt-3 sm:pt-4">
          <div className="font-ethnocentric text-[clamp(2.3rem,12vw,14rem)] leading-[0.82] tracking-tighter uppercase text-white select-none drop-shadow-[0_0_50px_rgba(65,210,162,0.3)]">
            SYNC'26<span className="text-mint-leaf">.</span>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-between gap-2 sm:gap-4 font-mono text-[10px] sm:text-[12px] tracking-[0.14em] sm:tracking-[0.2em] text-white/45 uppercase">
          <span>© 2026 DHARMARAJA COLLEGE ICT SOCIETY. ALL RIGHTS RESERVED.</span>
          <span className="text-mint-leaf/80">THINK BEYOND. DESIGN BEYOND. COMPETE BEYOND.</span>
        </div>
      </div>
    </footer>
  );
}
