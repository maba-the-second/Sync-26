import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore, type PageId } from '../store/useAppStore';
import { ShuffleText } from '../components/dom/ShuffleText';

gsap.registerPlugin(ScrollTrigger);

const SECTION_ANCHORS = ['#project', '#the-keep', '#factions'];

interface SocietyPillar {
  code: string;
  title: string;
  description: string;
}

const SOCIETY_PILLARS: SocietyPillar[] = [
  {
    code: '01 // VISION',
    title: 'STUDENT-DRIVEN EXCELLENCE',
    description:
      'Cultivating analytical rigor, software craft, and creative technology leadership among school-level innovators across Sri Lanka.',
  },
  {
    code: '02 // INITIATIVE',
    title: 'THE SYNC PLATFORM',
    description:
      'Orchestrated annually by the Dharmaraja College ICT Society in Kandy to bridge classroom fundamentals with real-world digital engineering.',
  },
  {
    code: '03 // HERITAGE',
    title: 'OVER A DECADE OF IMPACT',
    description:
      'Anchored by more than 20 years of Odyssey inter-school quiz tradition and an expanding multi-discipline competition ecosystem.',
  },
];

interface StatTile {
  value: string;
  label: string;
  detail: string;
}

const SYNC_STATS: StatTile[] = [
  {
    value: '08',
    label: 'COMPETITION TRACKS',
    detail: '7 Core ICT Disciplines + ASPECT Gaming',
  },
  {
    value: '06–13',
    label: 'ELIGIBLE GRADES',
    detail: 'Intra-School & National Inter-School Divisions',
  },
  {
    value: '20+ YRS',
    label: 'ODYSSEY HERITAGE',
    detail: 'Flagship Quiz Legacy Refreshed for SYNC26',
  },
  {
    value: 'NOV 28',
    label: 'PHYSICAL FINALE',
    detail: 'Hosted Live at Dharmaraja College, Kandy',
  },
];

interface DisciplineCard {
  code: string;
  tag: string;
  title: string;
  description: string;
  targetPage?: PageId;
}

const DISCIPLINES: DisciplineCard[] = [
  {
    code: '01',
    tag: 'QUIZ // FLAGSHIP',
    title: 'ODYSSEY',
    description:
      'Three-stage inter-school IT quiz spanning Networking, Programming & Database, AI & ML, IoT, and General ICT.',
    targetPage: 'odyssey',
  },
  {
    code: '02',
    tag: 'ENGINEERING',
    title: 'ALGORITHM',
    description:
      '4-hour HackerRank competitive programming arena testing data structures, logic, and optimal problem solving.',
  },
  {
    code: '03',
    tag: 'ENGINEERING',
    title: 'WEB DESIGNING',
    description:
      'Architecting responsive School Command Center web platforms blending interactive UI craft with clean front-end code.',
  },
  {
    code: '04',
    tag: 'INTERACTIVE',
    title: 'GAME DESIGNING',
    description:
      'End-to-end playable game builds uniting mechanics, world-building, and Cybernetic Odyssey visual direction.',
  },
  {
    code: '05',
    tag: 'CREATIVE',
    title: 'LOGO DESIGNING',
    description:
      'Crafting futuristic visual identities and geometric brand systems built for high-impact digital environments.',
  },
  {
    code: '06',
    tag: 'CREATIVE',
    title: 'POSTER DESIGNING',
    description:
      'High-concept editorial and promotional artwork capturing the kinetic pulse of the SYNC26 arena.',
  },
  {
    code: '07',
    tag: 'MULTIMEDIA',
    title: 'VIDEO EDITING',
    description:
      'Cinematic 60–120s motion storytelling and timeline breakdowns showcasing rhythm, grading, and VFX.',
  },
  {
    code: '08',
    tag: 'ESPORTS // ARENA',
    title: 'ASPECT',
    description:
      'Official tactical esports championship featuring Call of Duty 3 brackets and head-to-head finals.',
    targetPage: 'aspect',
  },
];

interface TimelinePhase {
  phase: string;
  window: string;
  title: string;
  detail: string;
}

const EVENT_TIMELINE: TimelinePhase[] = [
  {
    phase: 'STAGE 01',
    window: 'NOV 10 — NOV 16',
    title: 'CREATIVE SUBMISSIONS & ALGORITHM',
    detail:
      'Logo, Poster, and Video Editing submissions open alongside the 4-hour HackerRank Algorithm challenge.',
  },
  {
    phase: 'STAGE 02',
    window: 'NOV 18 — NOV 24',
    title: 'WEB, GAME, ODYSSEY & ASPECT',
    detail:
      'Web & Game builds deploy, Odyssey online qualifiers narrow to finalists, and ASPECT esports brackets unfold.',
  },
  {
    phase: 'STAGE 03',
    window: 'NOV 28 // KANDY',
    title: 'SYNC26 PHYSICAL GRAND FINALE',
    detail:
      'Live stage Odyssey finale, finalist showcases, and awards ceremony hosted at Dharmaraja College, Kandy.',
  },
];

export function AboutPage() {
  const setActiveSection = useAppStore((state) => state.setActiveSection);
  const setActivePage = useAppStore((state) => state.setActivePage);

  const rootRef = useRef<HTMLDivElement>(null);
  const ambientScrollRef = useRef<HTMLDivElement>(null);
  const logoFloatRef = useRef<HTMLDivElement>(null);
  const logoImgRef = useRef<HTMLImageElement>(null);
  const glassFrameRef = useRef<HTMLDivElement>(null);
  const lightSweepRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const ringOuterRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);

  const navigateTo = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useLayoutEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Sync top HUD section indicator with scroll position
      SECTION_ANCHORS.forEach((selector, idx) => {
        ScrollTrigger.create({
          trigger: selector,
          start: 'top 45%',
          end: 'bottom 45%',
          onEnter: () => setActiveSection(idx),
          onEnterBack: () => setActiveSection(idx),
        });
      });

      if (prefersReducedMotion) {
        gsap.set(logoImgRef.current, { opacity: 0.16, scale: 0.94, clearProps: 'filter' });
        gsap.set(glassFrameRef.current, { opacity: 0 });
        gsap.set(haloRef.current, { opacity: 0.35, scale: 1 });
        gsap.set([ringOuterRef.current, ringInnerRef.current], { opacity: 0.1 });
        gsap.set('.about-hero-reveal', { opacity: 1, y: 0 });
      } else {
        // 1. Multi-stage Opening Logo Choreography (3D tilt + liquid-glass light sweep + ambient settle)
        const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        introTl
          .fromTo(
            haloRef.current,
            { scale: 0.55, opacity: 0 },
            { scale: 1.08, opacity: 0.85, duration: 1.15, ease: 'power2.out' },
            0
          )
          .fromTo(
            ringOuterRef.current,
            { scale: 0.65, opacity: 0, rotate: -28 },
            { scale: 1, opacity: 0.38, rotate: 0, duration: 1.2 },
            0.08
          )
          .fromTo(
            ringInnerRef.current,
            { scale: 0.72, opacity: 0, rotate: 24 },
            { scale: 1, opacity: 0.32, rotate: 0, duration: 1.2 },
            0.12
          )
          .fromTo(
            glassFrameRef.current,
            { opacity: 0, scale: 0.88, rotateX: 16 },
            { opacity: 1, scale: 1, rotateX: 0, duration: 0.95, ease: 'power3.out' },
            0.12
          )
          .fromTo(
            logoImgRef.current,
            {
              opacity: 0,
              scale: 1.24,
              rotateX: 22,
              rotateY: -16,
              y: 18,
              filter: 'blur(12px) brightness(1.5)',
            },
            {
              opacity: 1,
              scale: 1,
              rotateX: 0,
              rotateY: 0,
              y: 0,
              filter: 'blur(0px) brightness(1)',
              duration: 1.1,
              ease: 'power3.out',
            },
            0.15
          )
          .fromTo(
            lightSweepRef.current,
            { xPercent: -140, opacity: 0 },
            {
              keyframes: [
                { xPercent: -40, opacity: 0.9, duration: 0.35, ease: 'power2.in' },
                { xPercent: 140, opacity: 0, duration: 0.55, ease: 'power2.out' },
              ],
            },
            0.78
          )
          // Settle from hero spotlight into subtle persistent ambient anchor
          .to(
            glassFrameRef.current,
            { opacity: 0, scale: 1.07, duration: 0.85, ease: 'power2.inOut' },
            1.55
          )
          .to(
            [ringOuterRef.current, ringInnerRef.current],
            { opacity: 0.1, scale: 1.05, duration: 0.95, ease: 'power2.inOut' },
            1.55
          )
          .to(
            haloRef.current,
            { opacity: 0.38, scale: 0.98, duration: 1.0, ease: 'power2.inOut' },
            1.55
          )
          .to(
            logoImgRef.current,
            {
              opacity: 0.2,
              scale: 0.92,
              duration: 1.05,
              ease: 'power2.inOut',
            },
            1.55
          )
          // Reveal hero framing typography around the settled emblem
          .fromTo(
            '.about-hero-reveal',
            { y: 26, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.1,
              ease: 'power3.out',
            },
            1.3
          );

        // Subtle continuous ambient hover drift on the background logo
        gsap.to(logoFloatRef.current, {
          y: -10,
          duration: 4.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        // Slow, ultra-lightweight orbital rotation on the background reticle rings
        gsap.to(ringOuterRef.current, {
          rotation: 360,
          duration: 72,
          repeat: -1,
          ease: 'none',
        });
        gsap.to(ringInnerRef.current, {
          rotation: -360,
          duration: 54,
          repeat: -1,
          ease: 'none',
        });

        // 2. Scroll-coupled attenuation so scrolled sections stay crisp and high-contrast
        gsap.fromTo(
          ambientScrollRef.current,
          { opacity: 1, scale: 1, y: 0 },
          {
            opacity: 0.44,
            scale: 1.05,
            y: -18,
            ease: 'none',
            scrollTrigger: {
              trigger: '.about-hero',
              start: 'top top',
              end: 'bottom 35%',
              scrub: 0.75,
            },
          }
        );

        // Hero content fade-up on scroll departure
        gsap.to('.about-hero-content', {
          opacity: 0,
          y: -36,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.about-hero',
            start: '12% top',
            end: 'bottom 35%',
            scrub: true,
          },
        });
      }

      // Section panel scroll reveals
      gsap.utils.toArray<HTMLElement>('.about-reveal').forEach((el) => {
        gsap.from(el, {
          y: 36,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 84%',
          },
        });
      });
    }, rootRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [setActiveSection]);

  return (
    <div ref={rootRef} className="relative w-full text-white pointer-events-none">
      {/* =====================================================================
          PERSISTENT AMBIENT LOGO & OPENING REVEAL STAGE
          Clipped inside .content-visible in App.tsx so it stays fixed behind
          all About sections and cleanly reveals the footer at page bottom.
      ===================================================================== */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden pl-11 sm:pl-12 md:pl-14"
      >
        <div
          ref={ambientScrollRef}
          className="relative w-full h-full flex items-center justify-center will-change-transform"
          style={{ perspective: '1400px' }}
        >
          {/* Ambient Emerald Depth Glow */}
          <div
            ref={haloRef}
            className="absolute w-[82vw] max-w-[680px] aspect-square rounded-full bg-[radial-gradient(circle,rgba(65,210,162,0.26)_0%,rgba(13,111,81,0.12)_42%,transparent_72%)] blur-2xl will-change-transform"
          />

          {/* Subtle Orbital Reticle Rings */}
          <div
            ref={ringOuterRef}
            className="absolute w-[76vw] max-w-[540px] aspect-square rounded-full border border-mint-leaf/25 border-dashed will-change-transform"
          />
          <div
            ref={ringInnerRef}
            className="absolute w-[60vw] max-w-[400px] aspect-square rounded-full border border-white/15 will-change-transform"
          />

          {/* Floating Logo + Opening Liquid-Glass Prism Lens */}
          <div
            ref={logoFloatRef}
            className="relative flex items-center justify-center w-[74vw] sm:w-[58vw] md:w-[46vw] max-w-[620px] px-4 will-change-transform"
          >
            {/* Opening Liquid-Glass Housing (fades out as logo settles to ambient depth) */}
            <div
              ref={glassFrameRef}
              className="pointer-events-none absolute -inset-4 sm:-inset-8 rounded-2xl border border-mint-leaf/35 bg-gradient-to-br from-white/[0.08] via-evergreen/20 to-black/50 backdrop-blur-[4px] shadow-[0_0_60px_rgba(65,210,162,0.18)] overflow-hidden will-change-transform"
            >
              {/* Corner HUD Brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-mint-leaf/80" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-mint-leaf/80" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-mint-leaf/80" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-mint-leaf/80" />

              {/* Specular Light Sweep */}
              <div
                ref={lightSweepRef}
                className="absolute inset-y-0 -left-1/3 w-2/3 bg-gradient-to-r from-transparent via-frozen-water/50 to-transparent skew-x-[-22deg] will-change-transform"
              />
            </div>

            <img
              ref={logoImgRef}
              src="./images/Sync logo 2.png"
              alt="SYNC26 Official Logo"
              className="relative z-10 w-full h-auto object-contain select-none drop-shadow-[0_0_28px_rgba(65,210,162,0.28)] will-change-transform"
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 1: HERO (#project) — CINEMATIC OPENING & TITLE SEQUENCE
      ===================================================================== */}
      <section
        id="project"
        className="about-hero relative z-20 min-h-screen min-h-[100dvh] w-full flex flex-col justify-between pl-16 pr-4 sm:pl-20 sm:pr-10 md:pl-24 md:pr-14 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 pointer-events-none"
      >
        <div className="about-hero-content flex flex-col justify-between flex-1">
          {/* Top Manifesto Eyebrow */}
          <div className="about-hero-reveal flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-sm">
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.24em] text-mint-leaf uppercase block mb-2">
                DHARMARAJA COLLEGE ICT SOCIETY // KANDY
              </span>
              <p className="font-mono text-xs sm:text-sm leading-relaxed text-white/80">
                Uniting young technologists, designers, and problem-solvers across Sri Lanka for the 2026 inter-school ICT arena.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-white/15 bg-black/50 backdrop-blur-md font-mono text-[10px] tracking-[0.2em] text-white/75 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-leaf animate-pulse" />
              <span>IN SYNC WITH THE FUTURE</span>
            </div>
          </div>

          {/* Bottom Monumental Title Block */}
          <div className="about-hero-reveal flex flex-col md:flex-row md:items-end justify-between gap-6 pt-12">
            <div>
              <span className="font-mono text-[10px] tracking-[0.26em] text-mint-leaf uppercase block mb-2">
                00 // IDENTITY &amp; ORIGIN
              </span>
              <h1 className="font-ethnocentric text-[clamp(2rem,7.2vw,6rem)] leading-[0.9] tracking-tight text-white uppercase drop-shadow-[0_0_35px_rgba(65,210,162,0.25)]">
                ABOUT SYNC26<span className="text-mint-leaf">.</span>
              </h1>
            </div>

            <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.22em] text-white/60 uppercase">
              <span>SCROLL TO EXPLORE</span>
              <span className="text-mint-leaf text-sm animate-bounce">↓</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: ICT SOCIETY (#about) — DHARMARAJA COLLEGE ICT SOCIETY
      ===================================================================== */}
      <section
        id="about"
        className="relative z-20 w-full pl-16 pr-3 sm:pl-20 sm:pr-8 md:pl-24 md:pr-12 pt-14 sm:pt-24 flex justify-center pointer-events-none"
      >
        <div className="about-reveal pointer-events-auto w-full max-w-[1400px] border border-white/20 bg-black/65 backdrop-blur-md">
          {/* Header */}
          <div className="px-4 sm:px-10 py-6 sm:py-8 border-b border-white/20 flex flex-wrap items-end justify-between gap-4">
            <div className="relative min-w-0">
              <span className="font-mono text-[10px] tracking-[0.25em] text-mint-leaf uppercase block mb-2">
                01 // THE ORGANIZERS
              </span>
              <h2 className="font-ethnocentric text-xl sm:text-4xl md:text-5xl leading-tight sm:leading-none font-black uppercase tracking-tight break-words">
                ICT SOCIETY<span className="text-mint-leaf">.</span>
              </h2>
            </div>

            <span className="font-mono text-[10px] tracking-[0.22em] text-white/50 uppercase">
              DHARMARAJA COLLEGE // KANDY
            </span>
          </div>

          {/* 2-Column Editorial + Pillars */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 p-5 sm:p-10 border-b lg:border-b-0 lg:border-r border-white/20 flex flex-col justify-center">
              <div className="space-y-5 font-mono text-xs sm:text-sm leading-relaxed text-white/85">
                <p className="text-white font-medium text-sm sm:text-base">
                  The Information and Communication Technology Society of Dharmaraja College, Kandy stands at the forefront of student-led digital innovation, engineering craft, and competitive computing.
                </p>
                <p>
                  Built across more than a decade of society initiatives and backed by over 20 years of inter-school ICT quiz heritage, the society brings together young programmers, designers, and strategists to build platforms that challenge students beyond conventional classroom boundaries.
                </p>
                <p>
                  As the organizing force behind SYNC26, the Dharmaraja College ICT Society curates every technical brief, online qualifier, judging rubric, and live stage finale—creating an inclusive yet fiercely competitive arena for Grades 6–13 across the island.
                </p>
              </div>
            </div>

            {/* Right Pillars Stack */}
            <div className="lg:col-span-5 p-5 sm:p-10 bg-evergreen/15 flex flex-col justify-center gap-4">
              {SOCIETY_PILLARS.map((pillar) => (
                <div
                  key={pillar.code}
                  className="group p-4 sm:p-5 border border-white/15 bg-black/50 bg-gradient-to-br from-white/[0.04] via-black/60 to-evergreen/15 hover:border-mint-leaf/50 transition-all duration-300"
                >
                  <span className="font-mono text-[9px] tracking-[0.22em] text-mint-leaf uppercase block mb-1.5">
                    {pillar.code}
                  </span>
                  <h3 className="font-ethnocentric text-xs sm:text-sm text-white uppercase mb-2 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="font-mono text-[11px] sm:text-xs leading-relaxed text-white/75">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: ABOUT SYNC26 (#the-keep) — SPIRIT & FLAGSHIP DIMENSION
      ===================================================================== */}
      <section
        id="the-keep"
        className="relative z-20 w-full pl-16 pr-3 sm:pl-20 sm:pr-8 md:pl-24 md:pr-12 pt-14 sm:pt-24 flex justify-center pointer-events-none"
      >
        <div className="about-reveal pointer-events-auto w-full max-w-[1400px] border border-white/20 bg-black/65 backdrop-blur-md">
          {/* Header */}
          <div className="px-4 sm:px-10 py-6 sm:py-8 border-b border-white/20 flex flex-wrap items-end justify-between gap-4">
            <div className="relative min-w-0">
              <span className="font-mono text-[10px] tracking-[0.25em] text-mint-leaf uppercase block mb-2">
                02 // THE INTER-SCHOOL TECH ARENA
              </span>
              <h2 className="font-ethnocentric text-xl sm:text-4xl md:text-5xl leading-tight sm:leading-none font-black uppercase tracking-tight break-words">
                WHAT IS SYNC26<span className="text-mint-leaf">.</span>
              </h2>
            </div>

            <span className="px-3 py-1 border border-mint-leaf/40 bg-mint-leaf/10 font-mono text-[10px] tracking-[0.2em] text-mint-leaf uppercase">
              THINK • DESIGN • COMPETE
            </span>
          </div>

          {/* Narrative + 2x2 Key Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/20">
            <div className="lg:col-span-6 p-5 sm:p-10 border-b lg:border-b-0 lg:border-r border-white/20 flex flex-col justify-center space-y-5 font-mono text-xs sm:text-sm leading-relaxed text-white/85">
              <p className="text-white font-medium text-sm sm:text-base">
                SYNC26 is Dharmaraja College&apos;s annual inter-school ICT competition and technology showcase—engineered under the vision &ldquo;In Sync With The Future.&rdquo;
              </p>
              <p>
                Designed as a converging arena where creative intellect meets computational mastery, SYNC26 unites eight distinct competitive disciplines spanning algorithmic coding, web architecture, game creation, multimedia storytelling, esports, and live quiz mastery.
              </p>
              <p>
                Whether competing individually in creative and coding brackets or representing your school on stage in Odyssey and ASPECT, every participant steps into an authentic testing ground built for collaboration, speed, and originality.
              </p>
            </div>

            <div className="lg:col-span-6 p-5 sm:p-10 bg-evergreen/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SYNC_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="p-5 sm:p-6 border border-white/15 bg-black/55 bg-gradient-to-br from-white/[0.04] via-black/60 to-evergreen/15 hover:border-mint-leaf/50 transition-colors flex flex-col justify-between gap-4"
                >
                  <span className="font-ethnocentric text-2xl sm:text-3xl text-mint-leaf leading-none">
                    {stat.value}
                  </span>
                  <div>
                    <h3 className="font-ethnocentric text-xs text-white uppercase tracking-wide mb-1.5">
                      {stat.label}
                    </h3>
                    <p className="font-mono text-[11px] leading-relaxed text-white/70">
                      {stat.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flagship Sub-Experience Links (Odyssey + Aspect) */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-evergreen/20 to-transparent">
              <div className="space-y-1.5">
                <span className="font-mono text-[9px] tracking-[0.22em] text-mint-leaf uppercase block">
                  FLAGSHIP INTER-SCHOOL QUIZ
                </span>
                <h3 className="font-ethnocentric text-base sm:text-lg text-white uppercase">
                  ODYSSEY // SYNC26
                </h3>
                <p className="font-mono text-xs text-white/75 max-w-md">
                  Three-stage ICT quiz culminating in a live championship showdown on stage.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('odyssey')}
                className="shrink-0 min-h-[42px] px-4 py-2 border border-mint-leaf/50 bg-mint-leaf/10 hover:bg-mint-leaf hover:text-black text-mint-leaf font-mono text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer"
              >
                EXPLORE ODYSSEY →
              </button>
            </div>

            <div className="p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-evergreen/20 to-transparent">
              <div className="space-y-1.5">
                <span className="font-mono text-[9px] tracking-[0.22em] text-mint-leaf uppercase block">
                  OFFICIAL ESPORTS CHAMPIONSHIP
                </span>
                <h3 className="font-ethnocentric text-base sm:text-lg text-white uppercase">
                  ASPECT // ARENA
                </h3>
                <p className="font-mono text-xs text-white/75 max-w-md">
                  Tactical Call of Duty 3 school tournament brackets and live finale combat.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigateTo('aspect')}
                className="shrink-0 min-h-[42px] px-4 py-2 border border-mint-leaf/50 bg-mint-leaf/10 hover:bg-mint-leaf hover:text-black text-mint-leaf font-mono text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer"
              >
                EXPLORE ASPECT →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: HIGHLIGHTS & TIMELINE (#factions) — 08 TRACKS & STAGES
      ===================================================================== */}
      <section
        id="factions"
        className="relative z-20 w-full pl-16 pr-3 sm:pl-20 sm:pr-8 md:pl-24 md:pr-12 pt-14 sm:pt-24 flex justify-center pointer-events-none"
      >
        <div className="about-reveal pointer-events-auto w-full max-w-[1400px] border border-white/20 bg-black/65 backdrop-blur-md">
          {/* Header */}
          <div className="px-4 sm:px-10 py-6 sm:py-8 border-b border-white/20 flex flex-wrap items-end justify-between gap-4">
            <div className="relative min-w-0">
              <span className="font-mono text-[10px] tracking-[0.25em] text-mint-leaf uppercase block mb-2">
                03 // DISCIPLINES &amp; CHRONOLOGY
              </span>
              <h2 className="font-ethnocentric text-xl sm:text-4xl md:text-5xl leading-tight sm:leading-none font-black uppercase tracking-tight break-words">
                ARENA HIGHLIGHTS<span className="text-mint-leaf">.</span>
              </h2>
            </div>

            <span className="font-mono text-[10px] tracking-[0.2em] text-white/55 uppercase">
              08 COMPETITIONS // 03 EVENT STAGES
            </span>
          </div>

          {/* 8 Disciplines Glass Grid */}
          <div className="p-4 sm:p-8 lg:p-10 border-b border-white/20 bg-evergreen/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {DISCIPLINES.map((item) => (
                <div
                  key={item.code}
                  className="group p-5 border border-white/15 bg-black/55 bg-gradient-to-br from-white/[0.04] via-black/65 to-evergreen/15 backdrop-blur-md hover:border-mint-leaf/55 transition-all duration-300 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                      <span className="font-ethnocentric text-xs text-mint-leaf">
                        {item.code}
                      </span>
                      <span className="font-mono text-[9px] tracking-[0.16em] text-white/55 uppercase">
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="font-ethnocentric text-xs sm:text-sm text-white uppercase leading-snug">
                      {item.title}
                    </h3>

                    <p className="font-mono text-[11px] sm:text-xs leading-relaxed text-white/75">
                      {item.description}
                    </p>
                  </div>

                  {item.targetPage && (
                    <button
                      type="button"
                      onClick={() => navigateTo(item.targetPage!)}
                      className="self-start font-mono text-[10px] tracking-[0.18em] text-mint-leaf hover:text-white uppercase transition-colors cursor-pointer"
                    >
                      VIEW ARENA →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3-Stage Event Chronology */}
          <div className="p-4 sm:p-8 lg:p-10">
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-[10px] tracking-[0.24em] text-mint-leaf uppercase">
                EVENT TIMELINE // NOVEMBER 2026
              </span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-white/45 uppercase hidden sm:inline">
                ONLINE QUALIFIERS → LIVE FINALE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {EVENT_TIMELINE.map((step, idx) => {
                const isFinale = idx === EVENT_TIMELINE.length - 1;
                return (
                  <div
                    key={step.phase}
                    className={`relative p-5 sm:p-6 border transition-all duration-300 ${
                      isFinale
                        ? 'border-mint-leaf/55 bg-gradient-to-br from-evergreen/55 via-black/80 to-black/95 shadow-[0_0_28px_rgba(65,210,162,0.14)]'
                        : 'border-white/15 bg-white/[0.02] hover:border-mint-leaf/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2 py-0.5 border border-mint-leaf/40 bg-mint-leaf/10 font-mono text-[9px] tracking-[0.2em] text-mint-leaf uppercase">
                        {step.phase}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.16em] text-white/60 uppercase">
                        {step.window}
                      </span>
                    </div>

                    <h3 className="font-ethnocentric text-xs sm:text-sm text-white uppercase mb-2 leading-snug">
                      {step.title}
                    </h3>

                    <p className="font-mono text-[11px] sm:text-xs leading-relaxed text-white/75">
                      {step.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: FINAL CTA BANNER
      ===================================================================== */}
      <section className="relative z-20 w-full pl-16 pr-3 sm:pl-20 sm:pr-8 md:pl-24 md:pr-12 py-14 sm:py-28 flex justify-center pointer-events-none">
        <div className="about-reveal pointer-events-auto relative w-full max-w-[1400px] border border-mint-leaf/40 bg-gradient-to-br from-evergreen/60 via-black/90 to-black backdrop-blur-md p-6 sm:p-14 md:p-20 overflow-hidden">
          {/* Corner Brackets */}
          <div className="pointer-events-none absolute -top-px -left-px w-5 h-5 border-t-2 border-l-2 border-mint-leaf" />
          <div className="pointer-events-none absolute -top-px -right-px w-5 h-5 border-t-2 border-r-2 border-mint-leaf" />
          <div className="pointer-events-none absolute -bottom-px -left-px w-5 h-5 border-b-2 border-l-2 border-mint-leaf" />
          <div className="pointer-events-none absolute -bottom-px -right-px w-5 h-5 border-b-2 border-r-2 border-mint-leaf" />

          {/* Subtle Radial Glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(65,210,162,0.16)_0%,transparent_65%)]" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="font-mono text-[10px] tracking-[0.25em] text-mint-leaf uppercase block">
                JOIN THE ARENA // DHARMARAJA COLLEGE ICT SOCIETY
              </span>
              <h2 className="font-ethnocentric text-xl sm:text-4xl md:text-5xl leading-tight font-black uppercase text-white break-words">
                STEP INTO SYNC26<span className="text-mint-leaf">.</span>
              </h2>
              <p className="font-mono text-xs sm:text-sm leading-relaxed text-white/80">
                Register your school squad or individual entries across 8 competitive ICT and gaming tracks before submission locks engage.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 w-full lg:w-auto">
              <button
                type="button"
                onClick={() => navigateTo('registrations')}
                className="group relative min-h-[48px] bg-mint-leaf hover:bg-white text-black font-ethnocentric text-xs sm:text-sm tracking-[0.16em] uppercase px-7 sm:px-9 py-4 transition-all duration-300 cursor-pointer shadow-[0_0_35px_rgba(65,210,162,0.35)] hover:shadow-[0_0_45px_rgba(255,255,255,0.5)] flex items-center justify-center gap-3"
                style={{
                  clipPath:
                    'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
                }}
              >
                <ShuffleText text="REGISTER NOW" />
                <span className="font-mono text-base transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('odyssey')}
                className="min-h-[48px] px-6 py-4 border border-white/25 hover:border-mint-leaf text-white hover:text-mint-leaf bg-black/50 backdrop-blur-md font-mono text-xs tracking-[0.18em] uppercase transition-colors cursor-pointer text-center"
              >
                EXPLORE ODYSSEY
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
