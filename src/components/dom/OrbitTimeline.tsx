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
          RIGHT ARCHITECTURAL SUB-COLUMN: SYNCHRONIZED EVENT TELEMETRY ROSTER
      ===================================================================== */}
      <div className="border-t lg:border-t-0 lg:border-l border-white/20 flex flex-col justify-between bg-black/35 pl-10">
        <div className="px-4 py-3 border-b border-white/20 flex items-center justify-between font-mono text-[10px] text-mint-leaf tracking-widest uppercase">
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
