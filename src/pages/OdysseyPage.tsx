import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '../store/useAppStore';
import FlexCarousel, { type FlexCarouselItem } from '../components/dom/FlexCarousel';
import { ShuffleText } from '../components/dom/ShuffleText';
import "./style.css";

gsap.registerPlugin(ScrollTrigger);

const SECTION_ANCHORS = ['#project', '#the-keep', '#factions', '#the-world'];

interface AboutPillar {
  code: string;
  title: string;
  description: string;
  featured?: boolean;
  badge?: string;
}

const ABOUT_PILLARS: AboutPillar[] = [
  {
    code: 'PHASE 01',
    title: 'ALGORITHMIC & LOGIC TRIALS',
    description:
      'Navigate high-pressure problem-solving checkpoints designed to test analytical speed, computational thinking, and precision.',
  },
  {
    code: 'PHASE 02',
    title: 'STRATEGIC ADAPTABILITY',
    description:
      'Each stage introduces evolving constraints and real-world engineering scenarios where squads must pivot and innovate.',
  },
  {
    code: 'PHASE 03',
    title: 'THE FINAL BEACON',
    description:
      'Top-performing teams converge in the ultimate showdown to claim the Odyssey title at SYNC\u201926.',
    featured: true,
    badge: 'GRAND FINALE',
  },
];

const SHOWREEL_ITEMS: FlexCarouselItem[] = [
  {
    src: './images/odessy1.jpg',
    alt: 'Odyssey 2025 Grand Finale live stage competition',
    title: 'ODYSSEY 2025 — GRAND FINALE',
    subtitle: 'Live Stage Championship Showdown',
  },
  {
    src: './images/odessy2.jpg',
    alt: 'Odyssey 2024 sentinel archival artwork',
    title: 'ODYSSEY 2024 — ARCHIVAL HIGHLIGHT',
    subtitle: 'Top 8 Qualifier & Finals Protocol',
  },
  {
    src: './images/odessy3.jpg',
    alt: 'Odyssey 2023 refreshed identity showcase',
    title: 'ODYSSEY 2023 — REFRESHED IDENTITY',
    subtitle: 'A New Era of Inter-School IT Competition',
  },
  {
    src: './images/odessy4.jpg',
    alt: 'Odyssey 2022 champions archive highlight',
    title: 'ODYSSEY 2022 — CHAMPIONS ARCHIVE',
    subtitle: 'Algorithmic Trials & Computing Trivia',
  },
  {
    src: './images/odessy5.jpg',
    alt: 'Odyssey 2021 virtual gauntlet highlight',
    title: 'ODYSSEY 2021 — DIGITAL GAUNTLET',
    subtitle: 'Online League & Strategic Finals',
  },
  {
    src: './images/odessy6.jpg',
    alt: 'Odyssey 2019 legacy highlight',
    title: 'ODYSSEY 2019 — LEGACY SHOWREEL',
    subtitle: '20+ Years of Dharmaraja ICT Heritage',
  },
];

interface RuleItem {
  label?: string;
  text: string;
}

interface RuleCard {
  code: string;
  category: string;
  colSpanClass: string;
  description?: string;
  items?: RuleItem[];
}

const RULES: RuleCard[] = [
  {
    code: '01',
    category: 'ELIGIBILITY',
    colSpanClass: 'lg:col-span-3',
    description: 'Inter-school teams only. Maximum of 4 participants per team.',
  },
  {
    code: '02',
    category: 'STRUCTURE',
    colSpanClass: 'lg:col-span-6',
    items: [
      {
        label: 'Round 1 (Online):',
        text: 'General IT knowledge screening quiz (Timed multiple-choice format).',
      },
      {
        label: 'Round 2 (Online):',
        text: 'Advanced technical, computational, and history-of-computing online assessment.',
      },
      {
        label: 'Final Round (Live):',
        text: "Stage quiz hosted live during the ICT Day (sync'26) event.",
      },
    ],
  },
  {
    code: '03',
    category: 'SCORING RUBRIC',
    colSpanClass: 'lg:col-span-3',
    description:
      'Points awarded per correct response with penalty systems active during specific buzzer/rapid-fire stages in the finals.',
  },
];

export function OdysseyPage() {
  const setActiveSection = useAppStore((state) => state.setActiveSection);
  const setActivePage = useAppStore((state) => state.setActivePage);
  const odysseyStage2 = useAppStore((state) => state.odysseyStage2);

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      SECTION_ANCHORS.forEach((selector, idx) => {
        ScrollTrigger.create({
          trigger: selector,
          start: 'top 45%',
          end: 'bottom 45%',
          onEnter: () => setActiveSection(idx),
          onEnterBack: () => setActiveSection(idx),
        });
      });

      // Subtle reveal animations for sections
      gsap.utils.toArray<HTMLElement>('.odyssey-reveal').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
          },
        });
      });
    }, rootRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [setActiveSection]);

  const handleGoToRegistration = () => {
    setActivePage('registrations');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div ref={rootRef} className="w-full text-white pointer-events-none">
      {/* =====================================================================
          1. HERO SECTION — FULL UNOBSTRUCTED 3D ODYSSEY PARTICLE CANVAS VIEW
      ===================================================================== */}
      <section
        id="project"
        className="odyssey-hero relative min-h-screen min-h-[100svh] w-full pointer-events-none"
      />

      {/* =====================================================================
          2. DESCRIPTION: "ABOUT ODYSSEY"
      ===================================================================== */}
      <section
        id="the-keep"
        className="relative z-20 w-full pl-16 pr-3 sm:pl-20 sm:pr-8 pt-14 sm:pt-24 flex justify-center pointer-events-none"
      >
        <div
          className={`odyssey-reveal odyssey-panel w-full max-w-[1400px] border border-white/20 bg-black/70 backdrop-blur-md ${odysseyStage2 ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
        >
          {/* Section Header */}
          <div className="px-4 sm:px-10 py-6 sm:py-8 border-b border-white/20 flex flex-wrap items-end justify-between gap-4">
            <div className="relative">
              <h2 className="font-ethnocentric text-xl sm:text-4xl md:text-5xl leading-tight sm:leading-none font-black uppercase tracking-tight break-words">
                ARE YOU THE ODYSSEUS<span className="text-mint-leaf">.</span>
              </h2>
            </div>
          </div>

          {/* Main Description Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 p-4 sm:p-10 border-b lg:border-b-0 lg:border-r border-white/20 flex flex-col justify-center">
              <div className="space-y-4 sm:space-y-5 font-mono text-xs sm:text-sm leading-relaxed text-white/85">
                <p className="text-white font-medium text-sm sm:text-base">
                  Odyssey is the flagship inter-school IT quiz competition at SYNC26, built on over 20 years of heritage and reintroduced with a refreshed identity in 2023. It aims to challenge young technology enthusiasts beyond the boundaries of conventional classroom learning, providing a competitive platform to test their knowledge and skills.
                </p>
                <p>
                  Structured as a multi-stage competition, Odyssey covers key areas of information technology, including Networking, Programming and Database, AI & ML, IoT, and General ICT. The competition consists of three stages: an online League Round, an online Top 8 Qualifier and the Grand Finale, where the finalists compete in a live setting for the championship title.
                </p>
                <p>
                  Each stage introduces new challenges, requiring participants to demonstrate analytical thinking, effective teamwork and the ability to adapt under pressure. Ultimately, Odyssey brings together some of the brightest young IT enthusiasts to compete for the title.
                </p>
              </div>
            </div>

            {/* Right Phase Roadmap Column */}
            <div className="lg:col-span-6 p-4 sm:p-10 flex flex-col justify-center bg-evergreen/15">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ABOUT_PILLARS.map((pillar) => {
                  const isFeatured = Boolean(pillar.featured);
                  return (
                    <div
                      key={pillar.code}
                      className={`relative transition-all ${isFeatured
                        ? 'sm:col-span-2 p-5 sm:p-6 border border-mint-leaf/60 bg-gradient-to-br from-evergreen/70 via-black/85 to-black/95 shadow-[0_0_30px_rgba(65,210,162,0.14)] hover:border-mint-leaf hover:shadow-[0_0_35px_rgba(65,210,162,0.22)] overflow-hidden'
                        : 'p-4 sm:p-5 border border-white/15 bg-white/[0.02] hover:border-mint-leaf/50'
                        }`}
                    >
                      {isFeatured && (
                        <>
                          {/* Corner Accents */}
                          <div className="pointer-events-none absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-mint-leaf" />
                          <div className="pointer-events-none absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-mint-leaf" />
                          <div className="pointer-events-none absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-mint-leaf" />
                          <div className="pointer-events-none absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-mint-leaf" />

                          {/* Subtle Radial Glow */}
                          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(65,210,162,0.18)_0%,transparent_60%)]" />
                        </>
                      )}

                      <div className="relative z-10">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <span className="font-mono text-[9px] tracking-[0.2em] text-mint-leaf uppercase">
                            {pillar.code}
                          </span>
                          {pillar.badge && (
                            <span className="px-2 py-0.5 border border-mint-leaf/60 bg-mint-leaf/15 font-mono text-[9px] tracking-[0.18em] text-mint-leaf uppercase">
                              {pillar.badge}
                            </span>
                          )}
                        </div>
                        <h3
                          className={`font-ethnocentric text-white uppercase mb-2 leading-snug ${isFeatured ? 'text-xs sm:text-sm' : 'text-xs'
                            }`}
                        >
                          {pillar.title}
                        </h3>
                        <p
                          className={`font-mono leading-relaxed ${isFeatured
                            ? 'text-[11px] sm:text-xs text-white/80'
                            : 'text-[11px] text-white/70'
                            }`}
                        >
                          {pillar.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. ARCHIVAL PHOTO SHOWREEL (FlexCarousel)
      ===================================================================== */}
      <section
        id="factions"
        className="relative z-20 w-full pl-16 pr-3 sm:pl-20 sm:pr-8 pt-14 sm:pt-24 flex justify-center pointer-events-none"
      >
        <div
          className={`odyssey-reveal odyssey-panel w-full max-w-[1400px] border border-white/20 bg-black/70 backdrop-blur-md ${odysseyStage2 ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
        >
          {/* Section Header */}
          <div className="px-4 sm:px-10 py-6 sm:py-8 border-b border-white/20 flex flex-wrap items-end justify-between gap-4">
            <div className="relative">
              <h2 className="font-ethnocentric text-xl sm:text-4xl md:text-5xl leading-tight sm:leading-none font-black uppercase tracking-tight break-words">
                LEGACY IN MOTION<span className="text-mint-leaf">.</span>
              </h2>
            </div>
          </div>

          {/* Interactive Showreel Stage */}
          <div className="relative w-full h-[320px] sm:h-[480px] md:h-[580px] bg-gradient-to-b from-evergreen/20 via-black/40 to-black/70 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(65,210,162,0.12)_0%,transparent_65%)]" />

            <FlexCarousel
              items={SHOWREEL_ITEMS}
              preset="liquid"
              intro="rise"
              cardHeight={0.48}
              gap={16}
              radius={12}
              captions={false}
              autoplay={true}
              interval={4}
              captureWheel={false}
              className="odyssey-showreel text-white font-mono"
            />
          </div>

          {/* Footer Interaction Hint */}
          <div className="px-4 sm:px-10 py-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 sm:gap-4 font-mono text-[9px] sm:text-[10px] tracking-[0.16em] sm:tracking-[0.22em] text-white/50 uppercase">
            <span>DRAG OR SWIPE TO BROWSE · TAP TO FOCUS</span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. DESCRIPTION: "RULES AND REGULATIONS"
      ===================================================================== */}
      <section
        id="the-world"
        className="relative z-20 w-full pl-16 pr-3 sm:pl-20 sm:pr-8 pt-14 sm:pt-24 flex justify-center pointer-events-none"
      >
        <div
          className={`odyssey-reveal odyssey-panel w-full max-w-[1400px] border border-white/20 bg-black/70 backdrop-blur-md ${odysseyStage2 ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
        >
          {/* Section Header */}
          <div className="px-4 sm:px-10 py-6 sm:py-8 border-b border-white/20 flex items-center justify-between gap-3 sm:gap-4">
            <div className="relative min-w-0">
              <h2 className="font-ethnocentric text-xl sm:text-4xl md:text-5xl leading-tight sm:leading-none font-black uppercase tracking-tight break-words">
                RULES AND REGULATIONS<span className="text-mint-leaf">.</span>
              </h2>
            </div>

            <a
              href="./pdf/Sync Competition Rulebook.pdf"
              download="Sync Competition Rulebook.pdf"
              aria-label="Download Rulebook"
              title="Download Rulebook"
              className="group shrink-0 inline-flex items-center justify-center h-10 px-3 hover:px-4 focus:px-4 rounded-full border border-white/20 bg-black/60 bg-gradient-to-br from-white/[0.06] via-black/70 to-evergreen/25 backdrop-blur-md text-white/90 hover:text-white hover:border-mint-leaf/60 focus:border-mint-leaf/60 focus:outline-none shadow-[0_0_20px_rgba(0,0,0,0.45)] hover:shadow-[0_0_24px_rgba(65,210,162,0.22)] focus:shadow-[0_0_24px_rgba(65,210,162,0.22)] transition-all duration-300 ease-out overflow-hidden cursor-pointer font-mono"
            >
              <svg
                className="w-4 h-4 shrink-0 text-mint-leaf transition-transform duration-300 ease-out group-hover:scale-110 group-focus:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
                />
              </svg>
              <span className="max-w-0 opacity-0 ml-0 translate-x-1.5 group-hover:max-w-[180px] group-hover:opacity-100 group-hover:ml-2 group-hover:translate-x-0 group-focus:max-w-[180px] group-focus:opacity-100 group-focus:ml-2 group-focus:translate-x-0 overflow-hidden whitespace-nowrap text-[10px] tracking-[0.16em] uppercase transition-all duration-300 ease-out">
                Download Rulebook
              </span>
            </a>
          </div>

          {/* Introductory Note */}
          <div className="px-4 sm:px-10 py-5 sm:py-6 border-b border-white/15 bg-evergreen/15 flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-xs sm:text-sm text-white/85 max-w-3xl leading-relaxed">
              All participating teams must follow the Odyssey rules below. Violating any rule may result in penalty or disqualification.
            </p>
          </div>

          {/* Rules Cards Grid */}
          <div className="p-4 sm:p-8 lg:p-10 bg-evergreen/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
              {RULES.map((block) => (
                <div
                  key={block.code}
                  className={`${block.colSpanClass} group relative p-6 sm:p-8 border border-white/15 bg-black/55 bg-gradient-to-br from-white/[0.04] via-black/60 to-evergreen/15 backdrop-blur-md hover:border-mint-leaf/50 hover:bg-white/[0.06] transition-all duration-300 flex flex-col gap-5`}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-2.5 py-1 border border-mint-leaf/40 bg-mint-leaf/10 font-ethnocentric text-xs sm:text-sm tracking-[0.18em] text-mint-leaf">
                      {block.code}
                    </span>
                    <span className="h-px flex-1 bg-white/15 group-hover:bg-mint-leaf/30 transition-colors" />
                    <span className="w-1.5 h-1.5 bg-mint-leaf/60 group-hover:bg-mint-leaf transition-colors" />
                  </div>

                  <h3 className="font-ethnocentric text-sm sm:text-base text-white uppercase tracking-wide leading-snug break-words">
                    {block.category}
                  </h3>

                  {block.description && (
                    <p className="font-mono text-xs sm:text-[13px] leading-relaxed text-white/80">
                      {block.description}
                    </p>
                  )}

                  {block.items && (
                    <ul className="space-y-3.5">
                      {block.items.map((item, itemIdx) => (
                        <li
                          key={itemIdx}
                          className="flex items-start gap-3 font-mono text-xs sm:text-[13px] leading-relaxed text-white/80"
                        >
                          <span className="w-1.5 h-1.5 bg-mint-leaf shrink-0 mt-2" />
                          <span>
                            {item.label && (
                              <span className="text-white font-medium">{item.label} </span>
                            )}
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. REDIRECT BUTTON TO REGISTRATION PAGE WITH INSPIRING TEXT
      ===================================================================== */}
      <section className="relative z-20 w-full pl-16 pr-3 sm:pl-20 sm:pr-8 py-14 sm:py-28 flex justify-center pointer-events-none">
        <div
          className={`odyssey-reveal relative w-full max-w-[1400px] border border-mint-leaf/40 bg-gradient-to-br from-evergreen/60 via-black/90 to-black backdrop-blur-md p-5 sm:p-14 md:p-20 overflow-hidden ${odysseyStage2 ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
        >
          {/* Corner Brackets */}
          <div className="pointer-events-none absolute -top-px -left-px w-5 h-5 border-t-2 border-l-2 border-mint-leaf" />
          <div className="pointer-events-none absolute -top-px -right-px w-5 h-5 border-t-2 border-r-2 border-mint-leaf" />
          <div className="pointer-events-none absolute -bottom-px -left-px w-5 h-5 border-b-2 border-l-2 border-mint-leaf" />
          <div className="pointer-events-none absolute -bottom-px -right-px w-5 h-5 border-b-2 border-r-2 border-mint-leaf" />

          {/* Subtle Radial Glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(65,210,162,0.16)_0%,transparent_65%)]" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-10">
            <div className="space-y-4 max-w-2xl">
              <h2 className="font-ethnocentric text-xl sm:text-4xl md:text-5xl leading-tight font-black uppercase text-white break-words">
                FORGE YOUR LEGACY BEYOND THE HORIZON<span className="text-mint-leaf">.</span>
              </h2>
              <p className="font-mono text-xs sm:text-sm leading-relaxed text-white/80">
                Assemble your team and claim your place in SYNC'26 Odyssey.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-4 shrink-0 w-full lg:w-auto">
              <button
                type="button"
                onClick={handleGoToRegistration}
                className="group relative min-h-[48px] w-full sm:w-auto bg-mint-leaf hover:bg-white text-black font-ethnocentric text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.18em] uppercase px-6 sm:px-10 py-4 sm:py-5 transition-all duration-300 cursor-pointer shadow-[0_0_35px_rgba(65,210,162,0.35)] hover:shadow-[0_0_45px_rgba(255,255,255,0.5)] flex items-center justify-center gap-3"
                style={{
                  clipPath:
                    'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
                }}
              >
                <ShuffleText text="REGISTER FOR ODYSSEY" />
                <span className="font-mono text-base transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
