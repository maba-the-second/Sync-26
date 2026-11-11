import React, { useEffect, useRef, useState } from 'react';

export interface OrbitTimelineEvent {
  date: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface OrbitTimelineDateGroup {
  dateLabel: string;
  events: OrbitTimelineEvent[];
}

export interface OrbitTimelineProps {
  data?: OrbitTimelineDateGroup[];
  showDates?: boolean;
  speed?: number;
  direction?: 'same' | 'alternate';
  style?: React.CSSProperties;
  className?: string;
}

export function OrbitTimeline({
  data = SYNC_TIMELINE_DATA,
  showDates = true,
  speed = 1,
  direction = 'alternate',
  style,
  className = '',
}: OrbitTimelineProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef(0);
  const [growth, setGrowth] = useState(0);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const activeKey = hoveredKey ?? selectedKey;

  // Flatten all events with their circular ring index and initial angle offset
  const flatNodes = React.useMemo(() => {
    const list: {
      key: string;
      indexLabel: string;
      ringIndex: number;
      groupDate: string;
      initialProgress: number;
      event: OrbitTimelineEvent;
    }[] = [];

    let globalIdx = 1;
    data.forEach((group, rIdx) => {
      const count = group.events.length;
      group.events.forEach((ev, eIdx) => {
        const baseOffset = (rIdx * 0.19 + eIdx / Math.max(1, count)) % 1;
        list.push({
          key: `${rIdx}-${eIdx}`,
          indexLabel: String(globalIdx++).padStart(2, '0'),
          ringIndex: rIdx,
          groupDate: group.dateLabel,
          initialProgress: baseOffset,
          event: ev,
        });
      });
    });

    return list;
  }, [data]);

  // Close clicked pop-out card when clicking outside
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (stageRef.current && !stageRef.current.contains(e.target as Node)) {
        setSelectedKey(null);
      }
    };
    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, []);

  // Outward growth animation on mount
  useEffect(() => {
    let rafId: number;
    const start = performance.now();
    const duration = 900;

    const animateGrowth = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setGrowth(eased);
      if (t < 1) {
        rafId = requestAnimationFrame(animateGrowth);
      }
    };

    rafId = requestAnimationFrame(animateGrowth);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Continuous circular orbit animation
  useEffect(() => {
    let rafId: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      const isPaused = activeKey !== null;
      if (!isPaused) {
        progressRef.current += dt * 0.038 * speed;
      }

      const ringCount = data.length;
      const minR = 14;
      const maxR = 42;

      flatNodes.forEach((item, idx) => {
        const wrapper = nodeRefs.current[idx];
        if (!wrapper) return;

        const rIdx = item.ringIndex;
        const ringSpeedFactor = 1 - (rIdx / Math.max(1, ringCount)) * 0.38;
        const dirSign = direction === 'alternate' && rIdx % 2 === 1 ? -1 : 1;

        const currentT =
          item.initialProgress + progressRef.current * ringSpeedFactor * dirSign;

        const baseR =
          ringCount > 1
            ? minR + (rIdx / (ringCount - 1)) * (maxR - minR)
            : 28;
        const r = baseR * growth;

        const angle = currentT * Math.PI * 2 - Math.PI / 2;
        const x = 50 + r * Math.cos(angle);
        const y = 50 + r * Math.sin(angle);

        wrapper.style.left = `${x}%`;
        wrapper.style.top = `${y}%`;
      });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [data.length, flatNodes, speed, direction, growth, activeKey]);

  const ringCount = data.length;
  const minR = 14;
  const maxR = 42;

  return (
    <div
      ref={stageRef}
      style={style}
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedKey(null);
      }}
      className={`relative w-full h-full select-none grid grid-cols-1 lg:grid-cols-[1fr_270px] xl:grid-cols-[1fr_300px] ${className}`}
    >
      {/* =====================================================================
          LEFT / MAIN STAGE: ARCHITECTURAL HUD RADAR + CIRCULAR ORBITS
      ===================================================================== */}
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedKey(null);
        }}
        className="relative flex items-center justify-center p-6 sm:p-8 min-h-[460px] sm:min-h-[520px] overflow-visible bg-[radial-gradient(circle_at_center,rgba(4,56,38,0.42)_0%,transparent_72%)]"
      >
        {/* Subtle Tactical Blueprint Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(65,210,162,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(65,210,162,0.12) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Corner HUD Registration Crosshairs & Telemetry */}
        <div className="pointer-events-none absolute top-4 left-5 flex flex-col gap-0.5 font-mono text-[9px] text-mint-leaf/70 tracking-widest uppercase">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-mint-leaf inline-block" />
            <span>ORBITAL_RADAR // SYNC'26</span>
          </div>
          <span className="text-white/40">RINGS: 0{ringCount} // NODES: {flatNodes.length}</span>
        </div>

        <div className="pointer-events-none absolute top-4 right-5 font-mono text-[9px] text-mint-leaf/60 tracking-widest uppercase text-right">
          <div>STATE // {activeKey ? 'LOCKED_INSPECT' : 'ORBITING'}</div>
          <div className="text-white/40">HOVER OR CLICK NODE</div>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-5 font-mono text-[9px] text-white/40 tracking-widest uppercase">
          <span>CORE // PRISM_CRYSTAL_V2.6</span>
        </div>

        <div className="pointer-events-none absolute bottom-4 right-5 font-mono text-[9px] text-mint-leaf/60 tracking-widest uppercase">
          <span>SECTOR // 07°17'N 80°38'E</span>
        </div>

        {/* Radar Square Canvas */}
        <div className="relative w-full max-w-[490px] aspect-square mx-auto flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full overflow-visible pointer-events-none"
          >
            <defs>
              <linearGradient id="syncCrystalTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D6F8ED" />
                <stop offset="50%" stopColor="#41D2A2" />
                <stop offset="100%" stopColor="#178966" />
              </linearGradient>
              <linearGradient id="syncCrystalLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#41D2A2" />
                <stop offset="100%" stopColor="#0D6F51" />
              </linearGradient>
              <linearGradient id="syncCrystalRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#178966" />
                <stop offset="100%" stopColor="#043826" />
              </linearGradient>
              <filter id="crystalGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Architectural Radar Axis Hairlines */}
            <line
              x1="2"
              y1="50"
              x2="98"
              y2="50"
              stroke="#41D2A2"
              strokeOpacity="0.14"
              strokeWidth="0.2"
              strokeDasharray="1 1.5"
            />
            <line
              x1="50"
              y1="2"
              x2="50"
              y2="98"
              stroke="#41D2A2"
              strokeOpacity="0.14"
              strokeWidth="0.2"
              strokeDasharray="1 1.5"
            />
            <line
              x1="15"
              y1="15"
              x2="85"
              y2="85"
              stroke="#41D2A2"
              strokeOpacity="0.07"
              strokeWidth="0.18"
            />
            <line
              x1="85"
              y1="15"
              x2="15"
              y2="85"
              stroke="#41D2A2"
              strokeOpacity="0.07"
              strokeWidth="0.18"
            />

            {/* Outer Tactical Degree Bezel Ring */}
            <circle
              cx="50"
              cy="50"
              r={46.5 * growth}
              fill="none"
              stroke="#41D2A2"
              strokeOpacity="0.18"
              strokeWidth="0.2"
              strokeDasharray="0.4 1.9"
            />

            {/* Cardinal Degree Markers */}
            {growth > 0.7 && (
              <g
                fill="#41D2A2"
                fillOpacity="0.45"
                fontSize="1.6"
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              >
                <text x="50" y="1.8" textAnchor="middle">
                  000°
                </text>
                <text x="98.5" y="50.5" textAnchor="end">
                  090°
                </text>
                <text x="50" y="99.2" textAnchor="middle">
                  180°
                </text>
                <text x="1.5" y="50.5" textAnchor="start">
                  270°
                </text>
              </g>
            )}

            {/* Concentric Circular Orbits */}
            {data.map((group, rIdx) => {
              const baseR =
                ringCount > 1
                  ? minR + (rIdx / (ringCount - 1)) * (maxR - minR)
                  : 28;
              const r = baseR * growth;
              const topY = 50 - r;

              const isRingHighlighted = flatNodes.some(
                (n) => n.ringIndex === rIdx && n.key === activeKey
              );

              return (
                <g key={group.dateLabel}>
                  <circle
                    cx="50"
                    cy="50"
                    r={r}
                    fill="none"
                    stroke={isRingHighlighted ? '#D6F8ED' : '#41D2A2'}
                    strokeOpacity={
                      isRingHighlighted ? 0.65 : 0.32 - rIdx * 0.025
                    }
                    strokeWidth={isRingHighlighted ? '0.42' : '0.28'}
                  />
                  {rIdx % 2 === 1 && (
                    <circle
                      cx="50"
                      cy="50"
                      r={r}
                      fill="none"
                      stroke="#D6F8ED"
                      strokeOpacity="0.18"
                      strokeWidth="0.2"
                      strokeDasharray="1.2 1.6"
                    />
                  )}

                  {/* Placeholder Date Label along Circular Orbit */}
                  {showDates && growth > 0.4 && (
                    <g transform={`translate(50, ${topY.toFixed(2)})`}>
                      <rect
                        x="-6"
                        y="-1.55"
                        width="12"
                        height="3.1"
                        rx="0.6"
                        fill="#031c13"
                        stroke={isRingHighlighted ? '#D6F8ED' : '#41D2A2'}
                        strokeOpacity={isRingHighlighted ? '0.9' : '0.5'}
                        strokeWidth="0.24"
                      />
                      <text
                        x="0"
                        y="0.55"
                        textAnchor="middle"
                        fill="#D6F8ED"
                        fontSize="1.8"
                        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                        letterSpacing="0.06em"
                      >
                        {group.dateLabel}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Center Small Prismatic Crystal */}
            <g transform="translate(50, 50)" filter="url(#crystalGlow)">
              <circle
                cx="0"
                cy="0"
                r="7.2"
                fill="rgba(4, 56, 38, 0.55)"
                stroke="#41D2A2"
                strokeOpacity="0.5"
                strokeWidth="0.3"
                strokeDasharray="2 1.2"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0"
                  to="360"
                  dur="16s"
                  repeatCount="indefinite"
                />
              </circle>

              <g>
                <animateTransform
                  attributeName="transform"
                  type="scale"
                  values="0.95;1.06;0.95"
                  dur="3.2s"
                  repeatCount="indefinite"
                />
                <polygon
                  points="0,-5.4 -3.2,-1.6 0,-0.6"
                  fill="url(#syncCrystalTop)"
                  stroke="#D6F8ED"
                  strokeWidth="0.22"
                />
                <polygon
                  points="0,-5.4 3.2,-1.6 0,-0.6"
                  fill="url(#syncCrystalLeft)"
                  stroke="#D6F8ED"
                  strokeWidth="0.22"
                />
                <polygon
                  points="-3.2,-1.6 0,-0.6 0,1.6 -3.2,1.2"
                  fill="url(#syncCrystalLeft)"
                  stroke="#41D2A2"
                  strokeWidth="0.22"
                />
                <polygon
                  points="3.2,-1.6 0,-0.6 0,1.6 3.2,1.2"
                  fill="url(#syncCrystalRight)"
                  stroke="#41D2A2"
                  strokeWidth="0.22"
                />
                <polygon
                  points="-3.2,1.2 0,1.6 0,5.4"
                  fill="url(#syncCrystalLeft)"
                  stroke="#41D2A2"
                  strokeWidth="0.22"
                />
                <polygon
                  points="3.2,1.2 0,1.6 0,5.4"
                  fill="url(#syncCrystalRight)"
                  stroke="#41D2A2"
                  strokeWidth="0.22"
                />
                <circle cx="0" cy="-0.4" r="0.65" fill="#D6F8ED" />
              </g>
            </g>
          </svg>

          {/* Orbiting Event Nodes + Floating Pop-Out Detail Cards */}
          {flatNodes.map((item, idx) => {
            const isOpen = activeKey === item.key;

            return (
              <div
                key={item.key}
                ref={(el) => {
                  nodeRefs.current[idx] = el;
                }}
                onMouseEnter={() => setHoveredKey(item.key)}
                onMouseLeave={() => setHoveredKey(null)}
                style={{ left: '50%', top: '50%' }}
                className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 ${
                  isOpen ? 'z-50' : 'z-20'
                }`}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedKey((prev) =>
                      prev === item.key ? null : item.key
                    );
                  }}
                  aria-label={`${item.event.title} (${item.event.date})`}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                    isOpen
                      ? 'scale-125 bg-mint-leaf text-black border-frozen-water shadow-[0_0_22px_rgba(65,210,162,0.95)]'
                      : 'bg-evergreen/95 text-mint-leaf border-mint-leaf/60 hover:scale-115 hover:bg-mint-leaf hover:text-black shadow-[0_0_12px_rgba(4,56,38,0.9)]'
                  }`}
                >
                  <span className="w-4 h-4 flex items-center justify-center">
                    {item.event.icon}
                  </span>
                </button>

                {/* Floating Pop-Out Card on Hover or Click */}
                {isOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 sm:w-72 p-3.5 rounded bg-black/95 backdrop-blur-xl border border-mint-leaf/70 shadow-[0_16px_45px_rgba(0,0,0,0.95),0_0_25px_rgba(65,210,162,0.28)] text-left font-mono z-50"
                  >
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-black border-r border-b border-mint-leaf/70" />

                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="px-2 py-0.5 bg-mint-leaf text-black font-bold text-[9px] tracking-[0.16em] uppercase">
                        {item.event.date}
                      </span>
                      <span className="text-[9px] text-mint-leaf/75 tracking-widest uppercase">
                        NODE // {item.indexLabel}
                      </span>
                    </div>

                    <h4 className="font-ethnocentric text-xs sm:text-[13px] text-white uppercase tracking-wide mb-1 leading-snug">
                      {item.event.title}
                    </h4>

                    <p className="text-[11px] text-white/80 leading-relaxed font-mono">
                      {item.event.description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          RIGHT ARCHITECTURAL SUB-COLUMN: SYNCHRONIZED EVENT TELEMETRY ROSTER
      ===================================================================== */}
      <div className="border-t lg:border-t-0 lg:border-l border-white/20 flex flex-col justify-between bg-black/35">
        <div className="px-4 py-3 border-b border-white/20 flex items-center justify-between font-mono text-[10px] text-mint-leaf tracking-widest uppercase">
          <span>// ORBITAL_TELEMETRY</span>
          <span className="text-white/50">10 EVENTS</span>
        </div>

        <div className="divide-y divide-white/10 flex-1 flex flex-col justify-between">
          {flatNodes.map((item) => {
            const isActive = activeKey === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onMouseEnter={() => setHoveredKey(item.key)}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() =>
                  setSelectedKey((prev) =>
                    prev === item.key ? null : item.key
                  )
                }
                className={`w-full px-4 py-2.5 text-left transition-colors flex items-center gap-3 cursor-pointer ${
                  isActive
                    ? 'bg-mint-leaf/15 text-white'
                    : 'hover:bg-white/5 text-white/75'
                }`}
              >
                <span
                  className={`font-mono text-[9px] px-1.5 py-0.5 border tracking-wider uppercase shrink-0 ${
                    isActive
                      ? 'bg-mint-leaf text-black border-mint-leaf font-bold'
                      : 'border-mint-leaf/35 text-mint-leaf/85 bg-evergreen/40'
                  }`}
                >
                  {item.groupDate}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[11px] uppercase tracking-wider truncate text-white">
                    {item.event.title}
                  </p>
                </div>

                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isActive ? 'bg-mint-leaf shadow-[0_0_8px_#41D2A2]' : 'bg-white/20'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <div className="px-4 py-2.5 border-t border-white/20 flex items-center justify-between font-mono text-[9px] text-white/45 tracking-widest uppercase">
          <span>SYNC'26 CHRONOLOGY</span>
          <span className="text-mint-leaf">INTERACTIVE</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   CUSTOM INLINE GEOMETRIC SVG ICONS (No lucide-react dependency)
============================================================================ */
const IconPortal = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
    <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconBriefing = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
    <path d="M2 12h4l3-9 6 18 3-9h4" />
  </svg>
);

const IconDesign = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
    <polygon points="12 2 19 21 12 17 5 21 12 2" />
  </svg>
);

const IconVideo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
    <rect x="2" y="5" width="14" height="14" rx="2" />
    <polygon points="22 7 16 12 22 17 22 7" />
  </svg>
);

const IconCode = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconWeb = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
  </svg>
);

const IconQuiz = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const IconEsports = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="3" x2="12" y2="21" />
    <line x1="3" y1="12" x2="21" y2="12" />
  </svg>
);

const IconTrophy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
    <path d="M6 9H3V4h3" />
    <path d="M18 9h3V4h-3" />
    <path d="M6 4h12v6a6 6 0 0 1-12 0V4z" />
    <line x1="12" y1="16" x2="12" y2="21" />
    <line x1="8" y1="21" x2="16" y2="21" />
  </svg>
);

const SYNC_TIMELINE_DATA: OrbitTimelineDateGroup[] = [
  {
    dateLabel: 'OCT 25',
    events: [
      {
        date: 'OCT 25 // TBA',
        icon: <IconPortal />,
        title: 'Registration Portal Opens',
        description:
          "Official SYNC '26 registration opens for Intra-School and Inter-School participants across all 8 tracks.",
      },
    ],
  },
  {
    dateLabel: 'NOV 02',
    events: [
      {
        date: 'NOV 02 // TBA',
        icon: <IconBriefing />,
        title: 'Official Briefing & Themes',
        description:
          'Competition guidelines, problem statements, and submission protocols dispatched via WhatsApp community.',
      },
      {
        date: 'NOV 05 // TBA',
        icon: <IconQuiz />,
        title: 'Odyssey Quiz — Round 01',
        description:
          'Online Preliminary round for Grades 10–13 school teams hosted via Zoom breakout rooms. Top 8 teams advance.',
      },
    ],
  },
  {
    dateLabel: 'NOV 10',
    events: [
      {
        date: 'NOV 10 // TBA',
        icon: <IconDesign />,
        title: 'Logo & Poster Submissions',
        description:
          'Submission deadline for Futuristic Identity logos and "Happening Now" SYNC \'26 promotional posters.',
      },
      {
        date: 'NOV 12 // TBA',
        icon: <IconVideo />,
        title: 'Video Editing Showreel',
        description:
          'Deadline for 60–120s "The Pulse of SYNC \'26: Future in Motion" cinematic edits and timeline breakdowns.',
      },
    ],
  },
  {
    dateLabel: 'NOV 16',
    events: [
      {
        date: 'NOV 16 // TBA',
        icon: <IconCode />,
        title: 'Algorithm on HackerRank',
        description:
          '4-hour competitive programming arena featuring 5 algorithmic challenges (500 points total).',
      },
      {
        date: 'NOV 18 // TBA',
        icon: <IconWeb />,
        title: 'Web & Game Designing',
        description:
          'Final deployment of School Command Center web platforms and Cybernetic Odyssey playable game builds.',
      },
    ],
  },
  {
    dateLabel: 'NOV 22',
    events: [
      {
        date: 'NOV 22 // TBA',
        icon: <IconQuiz />,
        title: 'Odyssey Quiz — Semifinal',
        description:
          'Online Semifinal scenario reasoning round. Top 2 school teams qualify for the Physical Grand Finale.',
      },
      {
        date: 'NOV 24 // TBA',
        icon: <IconEsports />,
        title: 'ASPECT Esports Arena',
        description:
          'Call of Duty 3 tactical tournament brackets and competitive cyber warfare qualifiers.',
      },
    ],
  },
  {
    dateLabel: 'NOV 28',
    events: [
      {
        date: 'NOV 28 // TBA',
        icon: <IconTrophy />,
        title: "SYNC '26 Physical Finale",
        description:
          'Grand final on-stage championship at Dharmaraja College, Kandy with live project showcase and awards.',
      },
    ],
  },
];

export default function OrbitTimelineDemo(props: OrbitTimelineProps) {
  return <OrbitTimeline {...props} />;
}
