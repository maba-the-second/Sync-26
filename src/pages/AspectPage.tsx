import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '../store/useAppStore';
import { ImageTilt } from '../components/dom/ImageTilt';
import { PerspectiveCardGallery } from '../components/dom/PerspectiveCardGallery';

gsap.registerPlugin(ScrollTrigger);

const TERMINAL_LINES = [
  'INITIALIZING',
  "SYNC'26 ASPECT",
  '',
  'VISION_MATRIX...[SYNCED]',
  '',
  'AESTHETIC_PARAMETERS',
  'DIMENSIONAL_SHADERS',
  'PERSPECTIVE_LOCK',
];

const SECTION_ANCHORS = ['#project', '#the-keep', '#factions'];

export function AspectPage() {
  const setActiveSection = useAppStore((state) => state.setActiveSection);
  const rootRef = useRef<HTMLDivElement>(null);

  const heroCardStageRef = useRef<HTMLDivElement>(null);
  const heroCardBodyRef = useRef<HTMLDivElement>(null);
  const heroCardTiltRef = useRef<HTMLDivElement>(null);
  const heroCardGlareRef = useRef<HTMLDivElement>(null);
  const tiltRafRef = useRef<number | null>(null);

  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(hover: none), (pointer: coarse)').matches
    ) {
      return;
    }
    const target = e.currentTarget;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (tiltRafRef.current !== null) {
      window.cancelAnimationFrame(tiltRafRef.current);
    }

    tiltRafRef.current = window.requestAnimationFrame(() => {
      if (!heroCardTiltRef.current) return;
      const rect = target.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (clientX - cx) / (rect.width / 2);
      const dy = (clientY - cy) / (rect.height / 2);
      const rotateX = (-dy * 16).toFixed(2);
      const rotateY = (dx * 16).toFixed(2);
      heroCardTiltRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
      tiltRafRef.current = null;
    });
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    if (tiltRafRef.current !== null) {
      window.cancelAnimationFrame(tiltRafRef.current);
      tiltRafRef.current = null;
    }
    if (heroCardTiltRef.current) {
      heroCardTiltRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  }, []);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const aboutSection = rootRef.current?.querySelector('.about-section');

      SECTION_ANCHORS.forEach((selector, idx) => {
        ScrollTrigger.create({
          trigger: selector,
          start: 'top 45%',
          end: 'bottom 45%',
          onEnter: () => setActiveSection(idx),
          onEnterBack: () => setActiveSection(idx),
        });
      });

      mm.add(
        {
          isDesktop: '(min-width: 769px)',
          isMobile: '(max-width: 768px)',
        },
        (mc) => {
          const isDesktop = Boolean(mc.conditions?.isDesktop);
          if (heroCardBodyRef.current) {
            const heroToCardTl = gsap.timeline({
              scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                endTrigger: aboutSection || '.about-section',
                end: 'top top',
                scrub: 0.65,
              },
            });

            heroToCardTl.fromTo(
              heroCardBodyRef.current,
              {
                width: '100vw',
                height: '100vh',
                x: '0vw',
                y: '0vh',
                rotateY: 0,
                rotateX: 0,
                rotateZ: 0,
                z: 0,
                borderRadius: '0px',
              },
              {
                width: isDesktop ? '27vw' : '74vw',
                height: isDesktop ? '66vh' : '38vh',
                x: isDesktop ? '32.5vw' : '22px',
                y: isDesktop ? '4vh' : '16vh',
                rotateY: 360,
                keyframes: {
                  rotateX: [0, 22, -14, 0],
                  rotateZ: [0, -9, 6, 0],
                  z: [0, -180, 60, 0],
                },
                borderRadius: '14px',
                ease: 'power2.inOut',
              },
              0
            );

            if (heroCardGlareRef.current) {
              heroToCardTl.fromTo(
                heroCardGlareRef.current,
                { xPercent: -120, opacity: 0 },
                {
                  keyframes: {
                    xPercent: [-120, 0, 120],
                    opacity: [0, 0.65, 0],
                  },
                  ease: 'none',
                },
                0
              );
            }

            gsap.to(heroCardBodyRef.current, {
              scale: 0,
              rotateY: 540,
              rotateX: -28,
              rotateZ: 12,
              opacity: 0,
              ease: 'power2.inOut',
              scrollTrigger: {
                trigger: '.section3',
                start: 'top 75%',
                end: 'top 15%',
                scrub: 0.6,
              },
            });
          }

          gsap.fromTo(
            '.s3image',
            {
              scale: 0,
              y: isDesktop ? 0 : -80,
              transformOrigin: 'center',
            },
            {
              scale: isDesktop ? 1.08 : 1.02,
              y: 0,
              ease: 'power3.inOut',
              scrollTrigger: {
                trigger: '.section3',
                start: 'top 45%',
                end: 'top -20%',
                scrub: true,
              },
            }
          );
        },
        rootRef
      );

      gsap.to('.hero-section-content', {
        opacity: 0,
        y: -50,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom center',
          scrub: true,
        },
      });

      gsap.from('.about-section .section-title', {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-section',
          start: 'top 65%',
        },
      });

      gsap.to('.s3image', {
        scale: 0,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: '.section4',
          start: 'top 35%',
          end: 'center center',
          scrub: true,
        },
      });

      gsap.fromTo(
        '.s4-center-portrait',
        { scale: 0.35, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.section4',
            start: 'top 55%',
            end: 'center center',
            scrub: 1,
          },
        }
      );

      const blockTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.section5',
          start: 'top 75%',
          end: 'center 35%',
          scrub: 1,
        },
      });

      blockTl
        .fromTo(
          '.bg-block1',
          { scale: 0, transformOrigin: 'center' },
          { scale: 1.05, duration: 1, ease: 'power3.inOut' }
        )
        .fromTo(
          '.bg-block2',
          { scale: 0, transformOrigin: 'center' },
          { scale: 1.15, duration: 1, ease: 'power3.inOut' },
          '-=0.5'
        )
        .fromTo(
          '.bg-block3',
          { scale: 0, transformOrigin: 'center' },
          { scale: 1.25, duration: 1, ease: 'power3.inOut' },
          '-=0.4'
        );

      gsap.from('.s7-scale-up', {
        scale: 0.25,
        opacity: 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.section7',
          start: 'top 65%',
          end: 'top 10%',
          scrub: true,
        },
      });

      gsap.from('.s7-fade-up', {
        opacity: 0.2,
        y: 100,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.section7',
          start: 'top 65%',
          end: 'top 10%',
          scrub: true,
        },
      });
    }, rootRef);

    ScrollTrigger.refresh();
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [setActiveSection]);

  return (
    <div ref={rootRef} className="w-full text-white">
      {/* =====================================================================
          3D MORPHING HERO-TO-CARD STAGE (ASPECT)
      ===================================================================== */}
      <div
        ref={heroCardStageRef}
        className="fixed inset-0 w-full h-full z-25 pointer-events-none flex items-center justify-center"
        style={{ perspective: '1600px' }}
      >
        <div
          ref={heroCardBodyRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          className="pointer-events-auto relative w-screen h-screen will-change-transform"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            ref={heroCardTiltRef}
            className="relative w-full h-full transition-transform duration-300 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            }}
          >
            <div
              className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-mint-leaf via-sea-green to-evergreen border border-mint-leaf/60 shadow-[0_25px_70px_rgba(4,56,38,0.85)]"
              style={{
                transform: 'translateZ(-10px)',
              }}
            />

            <div
              className="absolute inset-0 rounded-[inherit] bg-evergreen border border-mint-leaf/40"
              style={{
                transform: 'translateZ(-5px)',
              }}
            />

            <div
              className="absolute inset-0 rounded-[inherit] overflow-hidden bg-evergreen border-2 border-mint-leaf/70 flex flex-col items-center justify-center p-6"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg) translateZ(1px)',
              }}
            >
              <img
                src="./images/about-image.png"
                alt="Card Back Face"
                className="w-full h-full object-cover opacity-90 mix-blend-luminosity"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-evergreen via-transparent to-evergreen/60" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center font-mono text-[10px] text-mint-leaf tracking-widest">
                <span>SYNC'26 - ASPECT</span>
                <span>3D ROTATION ACTIVE</span>
              </div>
            </div>

            <div
              className="relative w-full h-full rounded-[inherit] overflow-hidden border border-white/20 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.95)]"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'translateZ(2px)',
              }}
            >
              <img
                src="./images/hero-bg.png"
                alt="Hero 3D Morphing Card"
                className="w-full h-full object-cover opacity-100"
                draggable={false}
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/35" />

              <div className="pointer-events-none absolute inset-3 border border-mint-leaf/25 rounded-[inherit]">
                <div className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 border-mint-leaf" />
                <div className="absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2 border-mint-leaf" />
                <div className="absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2 border-mint-leaf" />
                <div className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 border-mint-leaf" />
              </div>

              <div
                ref={heroCardGlareRef}
                className="pointer-events-none absolute inset-y-0 -left-1/4 w-1/2 bg-gradient-to-r from-transparent via-frozen-water/45 to-transparent skew-x-[-20deg]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          SECTION 1: HERO SECTION (#project) — ASPECT
      ===================================================================== */}
      <section
        id="project"
        className="hero-section relative min-h-screen min-h-[100dvh] w-full flex flex-col justify-between pl-16 sm:pl-20 md:pl-24 pr-4 sm:pr-10 md:pr-14 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 z-30 pointer-events-none"
      >
        <div className="hero-section-content flex flex-col justify-between flex-1">
          <div className="max-w-[300px] sm:max-w-[340px]">
            <span className="font-mono text-[10px] tracking-[0.25em] text-mint-leaf block mb-2">
              ASPECT
            </span>
            <p className="font-ethnocentric text-[11px] sm:text-[13px] md:text-sm leading-[1.45] text-white/90 font-normal tracking-normal">
              Shift your perspective inside SYNC'26. Aspect celebrates visual direction, creative design systems, and immersive digital craft.
            </p>
          </div>

          <div className="w-full flex flex-col gap-1 sm:gap-0 my-auto pt-8 sm:pt-14">
            <div className="ml-[4%] sm:ml-[24%] md:ml-[29%] flex flex-col items-start">
              <div className="font-ethnocentric text-[clamp(1.35rem,7.2vw,6.8rem)] leading-[0.88] tracking-tight text-white uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
                VISION<span className="text-mint-leaf">.</span>
              </div>
            </div>

            <div className="ml-[8%] sm:ml-[30%] md:ml-[37%] flex flex-col items-start mt-1 sm:mt-2">
              <div className="font-ethnocentric text-[clamp(1.35rem,7.2vw,6.8rem)] leading-[0.88] tracking-tight text-white uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
                DESIGN<span className="text-mint-leaf">.</span>
              </div>
            </div>

            <div className="ml-0 sm:ml-[2%] flex flex-col items-start mt-1 sm:mt-2">
              <h1 className="font-ethnocentric text-[clamp(1.4rem,7.8vw,7.4rem)] leading-[0.88] tracking-tight text-white uppercase drop-shadow-[0_0_35px_rgba(65,210,162,0.28)]">
                ASPECT<span className="text-mint-leaf">.</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: ABOUT SECTION (#about)
      ===================================================================== */}
      <section
        id="about"
        className="about-section min-h-screen min-h-[100dvh] w-full relative z-20 flex justify-center font-ethnocentric"
      >
        <div className="h-full w-[97vw] max-md:w-full pl-16 pr-3 sm:pl-20 sm:pr-6 md:pl-[68px] md:pr-0 pt-16 md:pt-[70px] flex items-start z-20 relative max-md:flex-col border-t border-white/20 bg-black/55 backdrop-blur-[2px]">
          <div className="relative flex flex-col max-md:w-full w-[62%] min-h-0 md:min-h-[86vh] justify-between">
            <div className="px-4 py-6 sm:px-6 sm:py-8 text-white border-b border-white/20">
              <div className="relative">
                <h3 className="section-title text-lg sm:text-4xl md:text-[44px] leading-tight md:leading-none font-black tracking-tight pl-0 sm:pl-12 md:pl-20 uppercase break-words">
                  EVERY DIMENSION...
                </h3>
                <h3 className="section-title text-lg sm:text-4xl md:text-[44px] leading-tight md:leading-none font-black tracking-tight mt-1 uppercase break-words">
                  REIMAGINED IN LIGHT<span className="text-mint-leaf">.</span>
                </h3>
              </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between gap-6 flex-1">
              <div className="w-full max-w-[220px] sm:w-56 md:w-64">
                <ImageTilt
                  src="./images/trailer-side-media.webp"
                  alt="Trailer Side Media"
                  className="border border-mint-leaf/30"
                  tiltOptions={{ max: 20, scale: 1.03, perspective: 1200, speed: 400 }}
                />
                <div className="mt-2 flex items-center gap-2 font-mono text-[9px] text-mint-leaf uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-mint-leaf inline-block" />
                  <span>ASPECT - ARCHIVE 05</span>
                </div>
              </div>

              <h6 className="block max-w-xs font-mono text-[12px] leading-[18px] text-white/80 section-title">
                Where motion, 3D aesthetics, and interactive storytelling converge to define the visual language of SYNC'26.
              </h6>
            </div>
          </div>

          <div className="w-[38%] min-h-[42vh] md:min-h-[86vh] border-l border-white/20 p-4 sm:p-6 max-md:w-full max-md:border-l-0 max-md:border-t flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between font-mono text-[9px] text-white/40 uppercase tracking-widest">
              <span>DOCKING BAY - 05</span>
              <span className="text-mint-leaf">3D OBJECT LOCK</span>
            </div>
            <div className="w-full flex-1 flex items-center justify-center my-2 sm:my-4 border border-dashed border-white/10 rounded-2xl" />
            <div className="w-full flex items-center justify-between font-mono text-[9px] text-white/40 uppercase tracking-widest">
              <span className="hidden md:inline">HOVER CARD TO TILT</span>
              <span className="md:hidden">SCROLL TO EXPLORE</span>
              <span>SYNC'26 ARCHIVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: 4-ROW ARCHITECTURAL GRID (#the-keep)
      ===================================================================== */}
      <section
        id="the-keep"
        className="section3 min-h-screen w-full relative z-20 flex flex-col justify-center font-ethnocentric"
      >
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none z-10">
          <img
            src="./images/section3-image.png"
            alt="Section 3 Backdrop"
            className="s3image absolute object-cover w-[78vw] md:w-[92vw] max-w-[1250px] h-[54vh] md:h-[82vh] max-h-[900px] ml-10 md:ml-0 scale-0 rounded-xl opacity-45 border border-mint-leaf/30"
          />
        </div>

        <div className="h-full mt-16 md:mt-[180px] w-[97vw] max-md:w-full pl-16 pr-3 sm:pl-20 sm:pr-6 md:pl-[68px] md:pr-0 pt-16 md:pt-[70px] z-30 relative mx-auto">
          <div className="relative min-h-0 md:min-h-[52vh] flex max-md:flex-col w-full text-white border-y border-white/20 bg-black/50 backdrop-blur-[2px]">
            <div className="px-4 sm:px-6 py-6 sm:py-8 w-[70%] max-md:w-full border-r border-white/20 max-md:border-r-0 max-md:border-b">
              <div className="relative">
                <h3 className="section-title text-lg sm:text-4xl md:text-[44px] leading-tight md:leading-none font-black pl-0 sm:pl-12 md:pl-20 uppercase break-words">
                  CRAFT INTERFACES AND WORLDS
                </h3>
                <h3 className="section-title text-lg sm:text-4xl md:text-[44px] leading-tight md:leading-none font-black mt-1 uppercase break-words">
                  THAT RESHAPE HUMAN
                </h3>
                <h3 className="section-title text-lg sm:text-4xl md:text-[44px] leading-tight md:leading-none font-black mt-1 uppercase break-words">
                  PERCEPTION<span className="text-mint-leaf">.</span>
                </h3>
              </div>
            </div>

            <div className="p-4 sm:p-8 w-[30%] max-md:w-full font-mono text-[10px] leading-4 text-mint-leaf/80 space-y-0.5">
              {TERMINAL_LINES.map((line, idx) => (
                <p key={idx} className="min-h-[12px]">
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="relative min-h-0 sm:min-h-[48vh] flex flex-col sm:flex-row w-full text-white border-b border-white/20 bg-black/50 backdrop-blur-[2px]">
            <div className="hidden sm:block px-6 py-8 sm:w-[70%] border-r border-white/20" />
            <div className="p-4 sm:p-6 md:p-8 overflow-hidden w-full sm:w-[30%] flex flex-col justify-between gap-4">
              <div className="w-full flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-mint-leaf">
                <div>
                  <p>N 35°27.37</p>
                  <p>E 139°38.57</p>
                </div>
                <span className="px-2 py-0.5 border border-mint-leaf/40 text-[9px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint-leaf animate-ping" />
                  ASPECT - LIVE
                </span>
              </div>

              <div className="relative border border-mint-leaf/30 rounded overflow-hidden bg-evergreen/40 h-40 flex items-center justify-center">
                <img
                  src="./images/protocol-bg.jpg"
                  alt="Topographic Sector Map"
                  className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity"
                  draggable={false}
                />
                <svg
                  className="relative z-10 w-full h-full text-mint-leaf/70"
                  viewBox="0 0 320 160"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse cx="160" cy="80" rx="130" ry="58" stroke="currentColor" strokeWidth="0.8" strokeDasharray="6 4" className="animate-pulse" />
                  <ellipse cx="160" cy="80" rx="96" ry="42" stroke="currentColor" strokeWidth="1" />
                  <ellipse cx="164" cy="78" rx="62" ry="26" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" />
                  <ellipse cx="168" cy="76" rx="28" ry="12" stroke="#D6F8ED" strokeWidth="1.2" />
                  <line x1="0" y1="80" x2="320" y2="80" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.75" />
                  <line x1="160" y1="0" x2="160" y2="160" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.75" />
                  <circle cx="168" cy="76" r="3" fill="#41D2A2" />
                </svg>
                <div className="pointer-events-none absolute bottom-2 left-2.5 right-2.5 flex justify-between font-mono text-[8px] text-mint-leaf/80 tracking-widest">
                  <span>ELEV - +412M</span>
                  <span>SECTOR 05-A</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative min-h-0 sm:min-h-[45vh] flex w-full text-white border-b border-white/20 bg-black/50 backdrop-blur-[2px]">
            <div className="px-6 py-8 w-[30%] border-r border-white/20 relative overflow-hidden max-sm:hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49.5%,rgba(65,210,162,0.35)_50%,transparent_50.5%)]" />
            </div>

            <div className="px-4 sm:px-6 py-6 sm:py-8 w-[70%] max-sm:w-full">
              <div className="relative">
                {[
                  'FORM MEETS FUNCTION IN',
                  'HIGH-CONTRAST PRECISION.',
                  'DEFINE THE VISUAL IDENTITY',
                  'OF TOMORROW.',
                ].map((item, idx) => (
                  <h3
                    key={idx}
                    className={`section-title text-lg sm:text-4xl md:text-[42px] leading-tight font-black uppercase break-words ${
                      idx === 0 ? 'pl-0 sm:pl-12 md:pl-20' : ''
                    }`}
                  >
                    {item}
                  </h3>
                ))}
              </div>
            </div>
          </div>

          <div className="relative h-[45vh] max-sm:hidden flex w-full text-white border-b border-white/20 bg-black/50">
            <div className="p-8 h-full w-[30%] border-r border-white/20" />
            <div className="p-8 h-full w-[35%] border-r border-white/20 flex flex-col justify-between">
              <p className="text-[10px] leading-3 uppercase font-mono text-mint-leaf">
                SYNC'26 <br /> ASPECT - ARCHIVE
              </p>
              <img src="./images/logo.png" alt="Symbol" className="w-16 opacity-70" />
            </div>
            <div className="p-8 h-full w-[35%]" />
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: 10K INITIAL COLLECTION (#factions)
      ===================================================================== */}
      <section
        id="factions"
        className="section4 mt-16 md:mt-[120px] min-h-screen w-full relative z-20 flex justify-center font-ethnocentric overflow-hidden"
      >
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none z-10">
          <div className="bg-block1 absolute w-[88vw] md:w-[92vw] max-w-[1300px] h-[78vh] md:h-[88vh] bg-evergreen/90 border border-turf-green scale-0 rounded-xl" />
        </div>
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none z-10">
          <div className="bg-block2 absolute w-[90vw] md:w-[94vw] max-w-[1320px] h-[80vh] md:h-[90vh] bg-turf-green/80 border border-sea-green scale-0 rounded-xl" />
        </div>
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none z-10">
          <div className="bg-block3 absolute w-[92vw] md:w-[96vw] max-w-[1340px] h-[82vh] md:h-[92vh] bg-black/90 border border-mint-leaf/40 scale-0 rounded-xl" />
        </div>

        <div className="w-[97vw] max-md:w-full pl-16 pr-3 sm:pl-20 sm:pr-6 md:pl-[68px] md:pr-0 pt-16 md:pt-[70px] flex items-center z-30 relative max-md:flex-col">
          <div className="flex items-center justify-center w-[22vw] max-md:w-full py-4 sm:py-8">
            <div className="-rotate-90 max-md:rotate-0 flex flex-col gap-2 items-center md:items-start">
              <h2 className="font-ethnocentric text-[10vw] max-md:text-[18vw] leading-none tracking-tighter font-black text-white">
                05A
              </h2>
              <span className="font-mono text-[11px] uppercase tracking-widest text-mint-leaf flex items-center gap-2">
                <span>&gt;&gt;</span> Aspect Showcase
              </span>
            </div>
          </div>

          <div className="w-[48vw] max-md:w-full h-full flex items-center justify-center relative py-4 sm:py-8 border-x border-white/20 max-md:border-x-0">
            <div className="s4-center-portrait w-full max-w-[260px] sm:max-w-md px-3 sm:px-6">
              <ImageTilt
                src="./images/section4-image.png"
                alt="Aspect Portrait"
                className="!object-contain"
                tiltOptions={{ max: 30, scale: 1.04, perspective: 1200, speed: 800 }}
              />
            </div>
          </div>

          <div className="w-[30vw] max-md:w-full h-full flex flex-col justify-center">
            <div className="p-4 sm:p-6 border-b border-white/20 max-w-[280px] sm:max-w-none mx-auto w-full">
              <ImageTilt
                src="./images/face-traits.webp"
                alt="Face Traits Upper"
                tiltOptions={{ max: 25, scale: 0.96, perspective: 1200, speed: 800 }}
              />
            </div>
            <div className="p-4 sm:p-6 max-w-[280px] sm:max-w-none mx-auto w-full">
              <ImageTilt
                src="./images/face-traits.webp"
                alt="Face Traits Lower"
                tiltOptions={{ max: 25, scale: 0.96, perspective: 1200, speed: 800 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: COLLECTIBLES / GALLERY (#collectibles)
      ===================================================================== */}
      <section
        id="collectibles"
        className="section5 relative z-30 w-[97vw] max-md:w-full mx-auto min-h-screen pl-16 pr-3 sm:pl-20 sm:pr-6 md:pl-[68px] md:pr-0 pt-16 md:pt-[70px] overflow-x-hidden font-ethnocentric flex flex-col justify-between gap-8 md:gap-12"
      >
        <div className="flex max-md:flex-col items-stretch w-full border-y border-white/20 bg-black/60 backdrop-blur-sm">
          <div className="w-1/2 max-md:w-full p-4 sm:p-6 border-r border-white/20 max-md:border-r-0 max-md:border-b">
            <div className="relative">
              <h3 className="text-lg sm:text-4xl md:text-[42px] leading-tight md:leading-none font-black pl-0 sm:pl-12 md:pl-20 uppercase break-words">
                VISUAL EXHIBITION &amp;
              </h3>
              <h3 className="text-lg sm:text-4xl md:text-[42px] leading-tight md:leading-none font-black mt-1 uppercase break-words">
                GALLERY<span className="text-mint-leaf">.</span>
              </h3>
            </div>
          </div>

          <div className="w-1/2 max-md:w-full p-4 sm:p-6 flex items-center">
            <div className="relative">
              <span className="dot-mint pl-3 font-mono text-[9px] text-mint-leaf uppercase block mb-2">
                Creative Direction
              </span>
              <p className="font-mono text-[12px] leading-[18px] text-white/80 max-w-md">
                Explore curated visual studies, 3D artifacts, and motion concepts produced for the Aspect division of SYNC'26.
              </p>
            </div>
          </div>
        </div>

        <PerspectiveCardGallery className="my-auto py-4 sm:py-8" />
      </section>

      {/* =====================================================================
          SECTION 7: FOOTER CALLOUT
      ===================================================================== */}
      <section className="section7 min-h-screen w-full relative z-30 flex justify-center font-ethnocentric bg-black/85 border-t border-white/20">
        <div className="h-full w-[97vw] max-md:w-full pt-16 md:pt-[70px] pl-16 pr-3 sm:pl-20 sm:pr-6 md:pl-[68px] md:pr-0 flex flex-col justify-between z-30 relative overflow-hidden">
          <div className="min-h-[22vh] sm:min-h-[34vh] md:min-h-[42vh] w-full border-b border-white/20 p-4 sm:p-8 flex items-end justify-center s7-fade-up">
            <h2 className="font-ethnocentric text-[clamp(2rem,10.5vw,9.5rem)] leading-none font-black tracking-tight text-white uppercase">
              ASPECT<span className="text-mint-leaf">.</span>
            </h2>
          </div>

          <div className="min-h-0 md:min-h-[42vh] w-full flex flex-col justify-between gap-4 py-6 sm:py-8 px-4 sm:px-8 md:px-12">
            <span className="font-mono text-[10px] tracking-[0.25em] text-mint-leaf s7-fade-up">
              ASPECT - SYNC'26
            </span>
            <span className="font-mono font-normal text-[12px] max-w-xs leading-5 block text-white/80 s7-fade-up">
              Experience the creative and visual dimension of SYNC'26 through Aspect.
            </span>
          </div>

          <div className="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 sm:w-72 md:w-96 max-md:static max-md:translate-x-0 max-md:translate-y-0 max-md:mx-auto max-md:pb-8">
            <ImageTilt
              src="./images/section4-image.png"
              alt="Aspect"
              className="!object-contain s7-scale-up"
              tiltOptions={{ max: 35, scale: 1.04, perspective: 1200, speed: 1200 }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
