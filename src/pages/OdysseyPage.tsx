import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '../store/useAppStore';
import { ImageTilt } from '../components/dom/ImageTilt';
import { ShuffleText } from '../components/dom/ShuffleText';

gsap.registerPlugin(ScrollTrigger);

const SECTION_ANCHORS = ['#project', '#the-keep', '#factions', '#the-world'];

const ABOUT_PILLARS = [
  {
    code: 'PHASE // 01',
    title: 'ALGORITHMIC & LOGIC TRIALS',
    description:
      '[PLACEHOLDER] Navigate high-pressure problem-solving checkpoints designed to test analytical speed, computational thinking, and precision.',
  },
  {
    code: 'PHASE // 02',
    title: 'STRATEGIC ADAPTABILITY',
    description:
      '[PLACEHOLDER] Each stage introduces evolving constraints and real-world engineering scenarios where squads must pivot and innovate.',
  },
  {
    code: 'PHASE // 03',
    title: 'THE FINAL BEACON',
    description:
      '[PLACEHOLDER] Top-performing teams converge in the ultimate showdown to claim the Odyssey title at SYNC\u201926.',
  },
];

const PAST_CHAMPIONS = [
  {
    year: '2019',
    edition: 'ODYSSEY // 2019',
    status: 'CHAMPIONS',
    school: '[PLACEHOLDER: 2019 CHAMPION SCHOOL]',
    team: '[PLACEHOLDER: WINNING SQUAD / DELEGATION]',
    summary:
      'Placeholder description for the 2019 Odyssey Champions who claimed the inaugural title across the multi-stage technical trials.',
  },
  {
    year: '2020',
    edition: 'ODYSSEY // 2020',
    status: 'CHAMPIONS',
    school: '[PLACEHOLDER: 2020 CHAMPION SCHOOL]',
    team: '[PLACEHOLDER: WINNING SQUAD / DELEGATION]',
    summary:
      'Placeholder description for the 2020 Odyssey Champions, recognized for rapid algorithmic execution and strategic adaptability.',
  },
  {
    year: '2021',
    edition: 'ODYSSEY // 2021',
    status: 'CHAMPIONS',
    school: '[PLACEHOLDER: 2021 CHAMPION SCHOOL]',
    team: '[PLACEHOLDER: WINNING SQUAD / DELEGATION]',
    summary:
      'Placeholder description for the 2021 Odyssey Champions, excelling through virtual and remote problem-solving gauntlets.',
  },
  {
    year: '2022',
    edition: 'ODYSSEY // 2022',
    status: 'CHAMPIONS',
    school: '[PLACEHOLDER: 2022 CHAMPION SCHOOL]',
    team: '[PLACEHOLDER: WINNING SQUAD / DELEGATION]',
    summary:
      'Placeholder description for the 2022 Odyssey Champions, demonstrating superior engineering precision and teamwork.',
  },
  {
    year: '2023',
    edition: 'ODYSSEY // 2023',
    status: 'CHAMPIONS',
    school: '[PLACEHOLDER: 2023 CHAMPION SCHOOL]',
    team: '[PLACEHOLDER: WINNING SQUAD / DELEGATION]',
    summary:
      'Placeholder description for the 2023 Odyssey Champions, setting a high bar in cryptography, logic, and system design.',
  },
  {
    year: '2024',
    edition: 'ODYSSEY // 2024',
    status: 'CHAMPIONS',
    school: '[PLACEHOLDER: 2024 CHAMPION SCHOOL]',
    team: '[PLACEHOLDER: WINNING SQUAD / DELEGATION]',
    summary:
      'Placeholder description for the 2024 Odyssey Champions, dominating the sector checkpoints and final beacon showdown.',
  },
  {
    year: '2025',
    edition: 'ODYSSEY // 2025',
    status: 'DEFENDING CHAMPIONS',
    school: '[PLACEHOLDER: 2025 CHAMPION SCHOOL]',
    team: '[PLACEHOLDER: WINNING SQUAD / DELEGATION]',
    summary:
      'Placeholder description for the 2025 Odyssey Champions—the reigning title holders entering the SYNC\u201926 era.',
  },
];

const EXTENDED_RULES = [
  {
    code: 'REG // 01',
    category: 'ELIGIBILITY & TEAM COMPOSITION',
    items: [
      '[PLACEHOLDER] Open to students from Grades 6–13 representing recognized schools and institutions.',
      '[PLACEHOLDER] Each squad must consist of [X–Y] registered members from the same institution.',
      '[PLACEHOLDER] Participants may only register under a single squad for the duration of Odyssey.',
    ],
  },
  {
    code: 'REG // 02',
    category: 'COMPETITION FORMAT & STAGES',
    items: [
      '[PLACEHOLDER] Odyssey consists of multiple sequential rounds: Preliminary Qualifier, Sector Gauntlet, and the Final Beacon.',
      '[PLACEHOLDER] Checkpoints are time-bound; late submissions or incomplete telemetry packets will not be scored.',
      '[PLACEHOLDER] Detailed briefs and environment credentials will be unlocked prior to each stage.',
    ],
  },
  {
    code: 'REG // 03',
    category: 'TOOLS, RESOURCES & FAIR PLAY',
    items: [
      '[PLACEHOLDER] All solutions and code artifacts must be produced originally by the squad during the designated window.',
      '[PLACEHOLDER] Unauthorized external assistance, plagiarism, or sharing of checkpoint keys across teams leads to immediate disqualification.',
      '[PLACEHOLDER] Permitted languages, frameworks, and reference materials will be specified in each round brief.',
    ],
  },
  {
    code: 'REG // 04',
    category: 'EVALUATION & ARBITRATION',
    items: [
      '[PLACEHOLDER] Submissions are evaluated on accuracy, execution efficiency, architectural clarity, and time of completion.',
      '[PLACEHOLDER] In the event of a tie, checkpoint timestamps and bonus challenge telemetry will determine ranking.',
      '[PLACEHOLDER] The decisions of the Dharmaraja ICT Society judging panel are final and binding.',
    ],
  },
];

export function OdysseyPage() {
  const setActiveSection = useAppStore((state) => state.setActiveSection);
  const setActivePage = useAppStore((state) => state.setActivePage);

  const rootRef = useRef<HTMLDivElement>(null);
  const bannerImgRef = useRef<HTMLImageElement>(null);
  const logoPlaceholderRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

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

      // Parallax Effect on Banner Image
      if (bannerImgRef.current) {
        gsap.fromTo(
          bannerImgRef.current,
          { yPercent: -10, scale: 1.14 },
          {
            yPercent: 20,
            scale: 1.0,
            ease: 'none',
            scrollTrigger: {
              trigger: '.odyssey-hero',
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      }

      // Parallax Effect on Logo Placeholder
      if (logoPlaceholderRef.current) {
        gsap.to(logoPlaceholderRef.current, {
          yPercent: -35,
          opacity: 0.25,
          ease: 'none',
          scrollTrigger: {
            trigger: '.odyssey-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Parallax Effect on Hero Foreground Content
      if (heroContentRef.current) {
        gsap.to(heroContentRef.current, {
          yPercent: -20,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.odyssey-hero',
            start: 'top top',
            end: 'bottom 35%',
            scrub: true,
          },
        });
      }

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
    <div ref={rootRef} className="w-full text-white pointer-events-auto">
      {/* =====================================================================
          1. HERO SECTION WITH LOGO PLACEHOLDER & PARALLAX BANNER IMAGE
      ===================================================================== */}
      <section
        id="project"
        className="odyssey-hero relative min-h-screen w-full overflow-hidden flex items-center justify-center pl-14 sm:pl-16 md:pl-20 pr-4 sm:pr-8 pt-16 pb-14"
      >
        {/* Parallax Banner Image Container */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <img
            ref={bannerImgRef}
            src="./images/hero-bg.png"
            alt="Odyssey Banner Placeholder"
            className="w-full h-full object-cover opacity-75 will-change-transform"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(65,210,162,0.14)_0%,transparent_70%)]" />
        </div>

        {/* Architectural Inner HUD Frame */}
        <div className="relative z-10 w-full max-w-[1400px] min-h-[78vh] border border-white/20 bg-black/35 backdrop-blur-[2px] flex flex-col justify-between p-6 sm:p-10 md:p-14">
          {/* Corner Accents */}
          <div className="pointer-events-none absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 border-mint-leaf" />
          <div className="pointer-events-none absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 border-mint-leaf" />
          <div className="pointer-events-none absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 border-mint-leaf" />
          <div className="pointer-events-none absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 border-mint-leaf" />


          {/* Center Stage: Logo Placeholder + Hero Title */}
          <div
            ref={heroContentRef}
            className="my-auto py-10 flex flex-col items-center text-center gap-8 will-change-transform"
          >
            {/* Logo Placeholder */}
            <div>

              <img
                src="./images/logo.png"
                alt="Odyssey Logo Placeholder"
                className="w-14 sm:w-16 object-contain opacity-90 mb-2.5"
              />

            </div>

            {/* Main Heading */}
            <div className="space-y-3 max-w-4xl">
              <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-mint-leaf uppercase block">
                SYNC&apos;26
              </span>
              <h1 className="font-ethnocentric text-[clamp(2.4rem,7vw,6.2rem)] leading-[0.9] tracking-tight text-white uppercase drop-shadow-[0_0_35px_rgba(65,210,162,0.28)]">
                ODYSSEY<span className="text-mint-leaf">.</span>
              </h1>
              <p className="font-mono text-xs sm:text-sm text-white/80 max-w-xl mx-auto leading-relaxed pt-2">
                Chart the unknown frontiers of SYNC&apos;26. An elite multi-stage problem-solving and technical expedition across uncharted digital realms.
              </p>
            </div>
          </div>

          {/* Bottom Bar Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-4 font-mono text-[10px] tracking-[0.2em] text-white/50">
            <span>C03 - ODYSSEY</span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. DESCRIPTION: "ABOUT ODYSSEY"
      ===================================================================== */}
      <section
        id="the-keep"
        className="relative z-20 w-full pl-14 sm:pl-16 md:pl-20 pr-4 sm:pr-8 pt-16 sm:pt-24 flex justify-center"
      >
        <div className="odyssey-reveal w-full max-w-[1400px] border border-white/20 bg-black/70 backdrop-blur-md">
          {/* Section Header */}
          <div className="px-6 sm:px-10 py-8 border-b border-white/20 flex flex-wrap items-end justify-between gap-4">
            <div className="relative">
              <span className="dot-mint pl-3 font-mono text-[10px] tracking-[0.25em] text-mint-leaf uppercase block mb-2">
                001 // OVERVIEW
              </span>
              <h2 className="font-ethnocentric text-2xl sm:text-4xl md:text-5xl leading-none font-black uppercase tracking-tight">
                ABOUT ODYSSEY<span className="text-mint-leaf">.</span>
              </h2>
            </div>
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
              PROTOCOL // EXPEDITION BRIEFING
            </span>
          </div>

          {/* Main Description Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-white/20 flex flex-col justify-between gap-8">
              <div className="space-y-5 font-mono text-xs sm:text-sm leading-relaxed text-white/85">
                <p className="text-white font-medium text-sm sm:text-base">
                  [PLACEHOLDER] Odyssey is the premier team-based technical and analytical challenge of SYNC&apos;26, crafted to push participants beyond conventional classroom boundaries.
                </p>
                <p>
                  [PLACEHOLDER] Designed as an immersive expedition, Odyssey brings together aspiring technologists, coders, and strategic thinkers to tackle interconnected rounds of logic, software engineering, cryptography, and rapid prototyping.
                </p>
                <p>
                  [PLACEHOLDER] Every checkpoint unlocks a deeper layer of the Odyssey protocol—demanding seamless collaboration, adaptability under pressure, and creative execution to reach the final beacon.
                </p>
              </div>

              {/* Phase Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/15">
                {ABOUT_PILLARS.map((pillar) => (
                  <div
                    key={pillar.code}
                    className="p-4 border border-white/15 bg-white/[0.02] hover:border-mint-leaf/50 transition-colors"
                  >
                    <span className="font-mono text-[9px] tracking-[0.2em] text-mint-leaf block mb-1.5">
                      {pillar.code}
                    </span>
                    <h3 className="font-ethnocentric text-xs text-white uppercase mb-2 leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="font-mono text-[11px] leading-relaxed text-white/70">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col items-center justify-between gap-6 bg-evergreen/15">
              <div className="w-full flex items-center justify-between font-mono text-[9px] text-white/50 tracking-widest uppercase">
                <span>ARCHIVE VISUAL // 01</span>
                <span className="text-mint-leaf">PLACEHOLDER MEDIA</span>
              </div>

              <div className="w-full max-w-sm my-auto">
                <ImageTilt
                  src="./images/about-image.png"
                  alt="About Odyssey Visual Placeholder"
                  className="border border-mint-leaf/30 rounded-lg overflow-hidden"
                  tiltOptions={{ max: 15, scale: 1.02, perspective: 1200, speed: 400 }}
                />
              </div>

              <div className="w-full flex items-center justify-between font-mono text-[9px] text-mint-leaf/80 tracking-widest uppercase border-t border-white/15 pt-4">
                <span>DHARMARAJA ICT SOCIETY</span>
                <span>SYNC&apos;26 // ODYSSEY</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. DESCRIPTION: "PREVIOUS WINNERS FROM 2019"
      ===================================================================== */}
      <section
        id="factions"
        className="relative z-20 w-full pl-14 sm:pl-16 md:pl-20 pr-4 sm:pr-8 pt-16 sm:pt-24 flex justify-center"
      >
        <div className="odyssey-reveal w-full max-w-[1400px] border border-white/20 bg-black/70 backdrop-blur-md">
          {/* Section Header */}
          <div className="px-6 sm:px-10 py-8 border-b border-white/20 flex flex-wrap items-end justify-between gap-4">
            <div className="relative">
              <span className="dot-mint pl-3 font-mono text-[10px] tracking-[0.25em] text-mint-leaf uppercase block mb-2">
                HALL OF RECORDS
              </span>
              <h2 className="font-ethnocentric text-2xl sm:text-4xl md:text-5xl leading-none font-black uppercase tracking-tight">
                PREVIOUS WINNERS<span className="text-mint-leaf">.</span>
              </h2>
            </div>
            <span className="px-3 py-1 border border-mint-leaf/40 bg-mint-leaf/10 font-mono text-[10px] tracking-[0.2em] text-mint-leaf uppercase">
              LEGACY ARCHIVE
            </span>
          </div>

          {/* Legacy Description */}
          <div className="p-6 sm:p-10 border-b border-white/20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 font-mono text-xs sm:text-sm leading-relaxed text-white/80">
              <p className="text-white font-medium text-sm sm:text-base">
                [PLACEHOLDER] Honoring the champions of Odyssey from 2019 onwards who set the benchmark for excellence, teamwork, and technical mastery.
              </p>
              <p>
                [PLACEHOLDER] Year after year since 2019, competing delegations have faced an intensive series of problem-solving and ICT challenges. Each title-winning squad distinguished themselves through analytical precision, composure under time constraints, and innovative thinking—building a legacy that continues in SYNC&apos;26.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-between p-5 border border-mint-leaf/30 bg-evergreen/30 font-mono text-[11px] space-y-2">
              <div className="flex justify-between text-mint-leaf">
                <span>ARCHIVE TIMELINE</span>
                <span>2019 — 2025</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>EDITIONS RECORDED</span>
                <span>07 CHAMPIONS</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>NEXT EDITION</span>
                <span className="text-mint-leaf">SYNC&apos;26</span>
              </div>
            </div>
          </div>

          {/* Yearly Champions Grid (2019 - 2025) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {PAST_CHAMPIONS.map((champion, idx) => {
              const isLatest = champion.year === '2025';
              return (
                <div
                  key={champion.year}
                  className={`p-6 sm:p-8 border-b border-r border-white/20 flex flex-col justify-between gap-6 hover:bg-white/[0.02] transition-colors ${isLatest ? 'md:col-span-2 lg:col-span-3 bg-evergreen/20' : ''
                    }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-ethnocentric text-3xl sm:text-4xl text-mint-leaf leading-none">
                        {champion.year}
                      </span>
                      <span
                        className={`px-2.5 py-1 border font-mono text-[9px] tracking-[0.18em] uppercase ${isLatest
                          ? 'border-mint-leaf bg-mint-leaf/15 text-mint-leaf'
                          : 'border-white/30 bg-white/5 text-white/80'
                          }`}
                      >
                        {champion.status}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/15">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-mint-leaf/80 uppercase block mb-1">
                        {champion.team}
                      </span>
                      <h3 className="font-ethnocentric text-sm sm:text-base text-white uppercase leading-snug">
                        {champion.school}
                      </h3>
                    </div>

                    <p className="font-mono text-xs leading-relaxed text-white/75">
                      {champion.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-white/45 uppercase">
                    <span>{champion.edition}</span>
                    <span className="text-mint-leaf">ARCHIVE // 0{idx + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. DESCRIPTION: "RULES AND REGULATIONS - EXTENDED"
      ===================================================================== */}
      <section
        id="the-world"
        className="relative z-20 w-full pl-14 sm:pl-16 md:pl-20 pr-4 sm:pr-8 pt-16 sm:pt-24 flex justify-center"
      >
        <div className="odyssey-reveal w-full max-w-[1400px] border border-white/20 bg-black/70 backdrop-blur-md">
          {/* Section Header */}
          <div className="px-6 sm:px-10 py-8 border-b border-white/20 flex flex-wrap items-end justify-between gap-4">
            <div className="relative">
              <h2 className="font-ethnocentric text-2xl sm:text-4xl md:text-5xl leading-none font-black uppercase tracking-tight">
                RULES AND REGULATIONS — EXTENDED<span className="text-mint-leaf">.</span>
              </h2>
            </div>
          </div>

          {/* Introductory Note */}
          <div className="px-6 sm:px-10 py-6 border-b border-white/20 bg-evergreen/20 flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-xs sm:text-sm text-white/85 max-w-3xl leading-relaxed">
              [PLACEHOLDER] All participating squads must adhere strictly to the extended Odyssey operational directives below. Violation of any protocol clause may result in penalty or disqualification.
            </p>
          </div>

          {/* Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/20">
            {EXTENDED_RULES.map((block, idx) => (
              <div
                key={block.code}
                className={`p-6 sm:p-10 flex flex-col justify-between gap-6 ${idx >= 2 ? 'border-t border-white/20' : ''
                  }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/15 pb-3">
                    <span className="font-mono text-[10px] tracking-[0.25em] text-mint-leaf uppercase">
                      {block.code}
                    </span>
                  </div>

                  <h3 className="font-ethnocentric text-base sm:text-lg text-white uppercase leading-snug">
                    {block.category}
                  </h3>

                  <ul className="space-y-3 pt-2">
                    {block.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="flex items-start gap-3 font-mono text-xs leading-relaxed text-white/75"
                      >
                        <span className="w-1.5 h-1.5 bg-mint-leaf shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-white/40 uppercase">
                  <span>SYNC&apos;26 ODYSSEY RULEBOOK</span>
                  <span className="text-mint-leaf/80">SECTION 0{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. REDIRECT BUTTON TO REGISTRATION PAGE WITH INSPIRING TEXT
      ===================================================================== */}
      <section className="relative z-20 w-full pl-14 sm:pl-16 md:pl-20 pr-4 sm:pr-8 py-16 sm:py-28 flex justify-center">
        <div className="odyssey-reveal relative w-full max-w-[1400px] border border-mint-leaf/40 bg-gradient-to-br from-evergreen/60 via-black/90 to-black backdrop-blur-md p-8 sm:p-14 md:p-20 overflow-hidden">
          {/* Corner Brackets */}
          <div className="pointer-events-none absolute -top-px -left-px w-5 h-5 border-t-2 border-l-2 border-mint-leaf" />
          <div className="pointer-events-none absolute -top-px -right-px w-5 h-5 border-t-2 border-r-2 border-mint-leaf" />
          <div className="pointer-events-none absolute -bottom-px -left-px w-5 h-5 border-b-2 border-l-2 border-mint-leaf" />
          <div className="pointer-events-none absolute -bottom-px -right-px w-5 h-5 border-b-2 border-r-2 border-mint-leaf" />

          {/* Subtle Radial Glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(65,210,162,0.16)_0%,transparent_65%)]" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
            <div className="space-y-4 max-w-2xl">
              <h2 className="font-ethnocentric text-2xl sm:text-4xl md:text-5xl leading-tight font-black uppercase text-white">
                FORGE YOUR LEGACY BEYOND THE HORIZON<span className="text-mint-leaf">.</span>
              </h2>
              <p className="font-mono text-xs sm:text-sm leading-relaxed text-white/80">
                Every great breakthrough begins with a single step into the unknown. Assemble your squad, calibrate your resolve, and claim your place among the pioneers of SYNC&apos;26 Odyssey.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-4 shrink-0 w-full lg:w-auto">
              <button
                type="button"
                onClick={handleGoToRegistration}
                className="group relative bg-mint-leaf hover:bg-white text-black font-ethnocentric text-xs sm:text-sm tracking-[0.18em] uppercase px-8 sm:px-10 py-5 transition-all duration-300 cursor-pointer shadow-[0_0_35px_rgba(65,210,162,0.35)] hover:shadow-[0_0_45px_rgba(255,255,255,0.5)] flex items-center justify-center gap-3"
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
