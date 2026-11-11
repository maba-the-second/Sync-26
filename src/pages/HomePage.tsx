import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '../store/useAppStore';
import { ImageTilt } from '../components/dom/ImageTilt';
import { PerspectiveCardGallery } from '../components/dom/PerspectiveCardGallery';
import { OrbitTimeline } from '../components/dom/OrbitTimeline';

gsap.registerPlugin(ScrollTrigger);

const SECTION_ANCHORS = ['#project', '#the-keep', '#factions', '#the-world'];

export function HomePage() {
  const setActiveSection = useAppStore((state) => state.setActiveSection);
  const setActivePage = useAppStore((state) => state.setActivePage);
  const rootRef = useRef<HTMLDivElement>(null);

  // Refs for the 3D Morphing Hero-to-Card element
  const heroCardStageRef = useRef<HTMLDivElement>(null);
  const heroCardBodyRef = useRef<HTMLDivElement>(null);
  const heroCardTiltRef = useRef<HTMLDivElement>(null);
  const heroCardGlareRef = useRef<HTMLDivElement>(null);
  const s3RevealLayerRef = useRef<HTMLDivElement>(null);
  const tiltRafRef = useRef<number | null>(null);

  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
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
    const ctx = gsap.context(() => {
      const isDesktop = window.innerWidth > 768;

      SECTION_ANCHORS.forEach((selector, idx) => {
        ScrollTrigger.create({
          trigger: selector,
          start: 'top 45%',
          end: 'bottom 45%',
          onEnter: () => setActiveSection(idx),
          onEnterBack: () => setActiveSection(idx),
        });
      });

      // =========================================================================
      // 1. 3D HERO BACKGROUND -> ABOUT CARD ROTATION & MORPH TIMELINE
      // =========================================================================
      if (heroCardBodyRef.current) {
        const heroToCardTl = gsap.timeline({
          scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            endTrigger: '.about-section',
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
            width: isDesktop ? '27vw' : '84vw',
            height: isDesktop ? '66vh' : '46vh',
            x: isDesktop ? '32.5vw' : '0vw',
            y: isDesktop ? '4vh' : '18vh',
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

        // 2. AFTER CARD LOCK: ROTATE & SCALE UP TO REVEAL SECTION 3 IMAGE
        const cardToSection3Tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.section3',
            start: 'top 80%',
            end: 'top -15%',
            scrub: 0.65,
          },
        });

        cardToSection3Tl.fromTo(
          heroCardBodyRef.current,
          {
            width: isDesktop ? '27vw' : '84vw',
            height: isDesktop ? '66vh' : '46vh',
            x: isDesktop ? '32.5vw' : '0vw',
            y: isDesktop ? '4vh' : '18vh',
            rotateY: 360,
            rotateX: 0,
            rotateZ: 0,
            z: 0,
            scale: 1,
            borderRadius: '14px',
          },
          {
            width: '92vw',
            height: '82vh',
            x: '0vw',
            y: '0vh',

            rotateY: 180,
            rotateX: 0,
            rotateZ: 0,
            scale: 1.08,
            keyframes: {
              rotateX: [0, -18, 0],
              rotateZ: [0, 8, 0],
              z: [0, -140, 0],
            },
            borderRadius: '12px',
            duration: 0.75,
            ease: 'power2.inOut',
            immediateRender: false,
          },
          0
        );

        if (s3RevealLayerRef.current) {
          cardToSection3Tl.fromTo(
            s3RevealLayerRef.current,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.25,
              ease: 'none',
              immediateRender: false,
            },
            0
          );
        }

        // Fade in the face marking image after the 3D card finishes rotating
        cardToSection3Tl.fromTo(
          '.s3-face-marking',
          { opacity: 0, scale: 1.3 },
          {
            opacity: 1,
            scale: 1.48,
            duration: 0.25,
            ease: 'power2.out',
          },
          0.75
        );

        // 3. SCALE DOWN REVEALED SECTION 3 IMAGE AS SECTION 4 ENTERS
        gsap.fromTo(
          heroCardBodyRef.current,
          {
            rotateY: 180,
            rotateX: 0,
            rotateZ: 0,
            scale: 1.08,
            opacity: 1,
          },
          {
            rotateY: 180,
            rotateX: 0,
            rotateZ: 0,
            scale: 0,
            opacity: 0,
            ease: 'power3.inOut',
            immediateRender: false,
            scrollTrigger: {
              trigger: '.section4',
              start: 'top 35%',
              end: 'center center',
              scrub: true,
            },
          }
        );
      }

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

      // 2. Section 2 (AboutSection) reveals
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

      // 4. Section 4 center character portrait & 3 expanding background blocks
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

      // 6. Section 6 Pinned 300vh Clip-Path Polygon World Reveal
      const s6Tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.section6',
          start: 'top top',
          end: () => `+=${window.innerHeight * 2.6}`,
          scrub: true,
          pin: true,
          pinSpacing: true,
        },
      });

      s6Tl.to('.s6-text1', { opacity: 1, ease: 'none' }, 0);
      s6Tl.to('.s6-img-1', { scale: 1.2, ease: 'none' }, 0);

      s6Tl.fromTo(
        '.s6-img-2',
        {
          clipPath: 'polygon(40% 25%, 60% 25%, 60% 75%, 40% 75%)',
          scale: 1,
        },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          scale: 1.18,
          ease: 'none',
        },
        0.2
      );
      s6Tl.to('.s6-text1', { opacity: 0, ease: 'none' }, 0.35);
      s6Tl.to('.s6-text2', { opacity: 1, ease: 'none' }, 0.45);

      s6Tl.fromTo(
        '.s6-img-3',
        {
          clipPath: 'polygon(50% 25%, 50% 25%, 50% 75%, 50% 75%)',
        },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          ease: 'none',
        },
        0.75
      );
      s6Tl.to('.s6-text2', { opacity: 0, ease: 'none' }, 0.85);
      s6Tl.to('.s6-text3', { opacity: 1, ease: 'none' }, 0.95);

      // 7. Section 7 Scale-Up & Fade-Up
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
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="w-full text-white">
      {/* =====================================================================
          3D MORPHING HERO-TO-CARD STAGE (HOME)
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
                <span>SYNC'26 - CORE ARTIFACT</span>
                <span>3D ROTATION ACTIVE</span>
              </div>

              {/* Section 3 Revealed Scaling Image Layer (active on 360deg -> 540deg flip) */}
              <div
                ref={s3RevealLayerRef}
                className="absolute inset-0 bg-black opacity-0"
              >
                <img
                  src="./images/section3-image.png"
                  alt="Section 3 Revealed Backdrop"
                  className="w-full h-full object-cover opacity-50"
                  draggable={false}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50" />
                <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex justify-between items-center font-mono text-[10px] text-mint-leaf/80 tracking-widest">
                  <span>SYNC'26 - THE KEEP</span>
                  <span>SECTOR 04-K</span>
                </div>
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
          SECTION 1: HERO SECTION (#project)
      ===================================================================== */}
      <section
        id="project"
        className="hero-section relative min-h-screen w-full flex flex-col justify-between pl-16 sm:pl-20 md:pl-24 pr-6 sm:pr-10 md:pr-14 pt-20 sm:pt-24 md:pt-28 pb-16 sm:pb-20 z-30 pointer-events-none"
      >
        <div className="hero-section-content flex flex-col justify-between flex-1">
          <div className="max-w-[340px] sm:max-w-[380px]">
            <span className="font-mono text-[10px] tracking-[0.25em] text-mint-leaf block mb-2">
              DHARMARAJA COLLEGE ICT SOCIETY PRESENTS
            </span>
            <p className="font-ethnocentric text-xs sm:text-[13px] md:text-sm leading-[1.45] text-white/90 font-normal tracking-normal">
              A futuristic ICT competition experience bringing together innovation, creativity, coding, digital design, and technological thinking.
            </p>
          </div>

          <div className="w-full flex flex-col gap-1 sm:gap-0 my-auto pt-10 sm:pt-14">
            <div className="ml-[14%] sm:ml-[24%] md:ml-[29%] flex flex-col items-start">
              <div className="font-ethnocentric text-[clamp(2.25rem,7.2vw,6.8rem)] leading-[0.88] tracking-tight text-white uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
                THINK<span className="text-mint-leaf">.</span>
              </div>
            </div>

            <div className="ml-[18%] sm:ml-[30%] md:ml-[37%] flex flex-col items-start mt-1 sm:mt-2">
              <div className="font-ethnocentric text-[clamp(2.25rem,7.2vw,6.8rem)] leading-[0.88] tracking-tight text-white uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
                DESIGN<span className="text-mint-leaf">.</span>
              </div>
            </div>

            <div className="ml-0 sm:ml-[2%] flex flex-col items-start mt-1 sm:mt-2">
              <h1 className="font-ethnocentric text-[clamp(2.4rem,7.8vw,7.4rem)] leading-[0.88] tracking-tight text-white uppercase drop-shadow-[0_0_35px_rgba(65,210,162,0.28)]">
                SYNC'26<span className="text-mint-leaf">.</span>
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
        className="about-section min-h-screen w-full relative z-20 flex justify-center font-ethnocentric"
      >
        <div className="h-full w-[97vw] max-md:w-full max-md:pl-4 pl-[68px] pt-[70px] flex items-start z-20 relative max-md:flex-col border-t border-white/20 bg-black/55 backdrop-blur-[2px]">
          <div className="relative flex flex-col max-md:w-full w-[62%] min-h-[86vh] justify-between">
            <div className="px-6 py-8 max-md:p-4 text-white border-b border-white/20">
              <div className="relative">
                <h3 className="section-title text-2xl sm:text-3xl md:text-[38px] leading-none font-black tracking-tight pl-20 uppercase">
                  WHERE CREATIVE INTELLECT...
                </h3>
                <h3 className="section-title text-2xl sm:text-3xl md:text-[38px] leading-none font-black tracking-tight mt-1.5 uppercase">
                  MEETS COMPUTATIONAL MASTERY<span className="text-mint-leaf">.</span>
                </h3>
              </div>
            </div>

            <div className="p-8 flex flex-col justify-between gap-6 flex-1">
              <div className="w-56 sm:w-64">
                <ImageTilt
                  src="./images/trailer-side-media.webp"
                  alt="Dharmaraja ICT Society Arena"
                  className="border border-mint-leaf/30"
                  tiltOptions={{ max: 20, scale: 1.03, perspective: 1200, speed: 400 }}
                />
              </div>

              <h6 className="block max-w-md font-mono text-[12px] leading-[18px] text-white/80 section-title">
                The Information and Communication Technology Society of Dharmaraja College creates an arena celebrating innovation, analytical thinking, cutting-edge software development, and boundary-pushing multimedia design.
              </h6>
            </div>
          </div>

          <div className="w-[38%] min-h-[86vh] border-l border-white/20 p-6 max-md:w-full max-md:border-l-0 max-md:border-t flex flex-col items-center justify-between">
            <div className="w-full flex-1 flex items-center justify-center my-4 border border-dashed border-white/10 rounded-2xl" />
            <div className="w-full flex items-center justify-end font-mono text-[9px] text-white/40 uppercase tracking-widest">
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
        className="section3 min-h-screen w-full relative z-30 flex flex-col justify-center font-ethnocentric pointer-events-none"
      >
        <div className="h-full mt-[180px] w-[97vw] max-md:w-full max-md:pl-4 pl-[68px] pt-[70px] z-30 relative mx-auto pointer-events-auto">
          <div className="relative flex max-md:flex-col w-full text-white border-y border-white/20 bg-black/50 backdrop-blur-[2px]">
            {/* Left 70% Column: Title Header + Integrated Orbital Radar Grid */}
            <div className="w-[70%] max-md:w-full border-r border-white/20 max-md:border-r-0 flex flex-col justify-between">
              <div className="px-6 py-7 border-b border-white/20 flex items-end justify-between gap-4">
                <div className="relative">
                  <h3 className="section-title text-2xl sm:text-3xl md:text-[38px] leading-none font-black pl-20 max-sm:pl-12 uppercase">
                    THE COMPETITION EXPERIENCE:
                  </h3>
                  <h3 className="section-title text-2xl sm:text-3xl md:text-[38px] leading-none font-black mt-1.5 uppercase">
                    THE GRAND STAGE<span className="text-mint-leaf">.</span>
                  </h3>
                </div>

              </div>

              <div className="flex-1 w-full">
                <OrbitTimeline />
              </div>
            </div>

            {/* Right 30% Column: Face Marking Image (Top) + Topographic Radar (Bottom) */}
            <div className="w-[30%] max-md:w-full flex flex-col justify-between">
              <div className="relative p-4 flex-1 min-h-[280px] border-b border-white/20 overflow-hidden flex items-center justify-center">
                <img
                  src="./images/face_marking.png"
                  alt="SYNC '26 Face Marking"
                  className="s3-face-marking opacity-0 w-full h-full max-h-[340px] object-contain scale-[1.48] select-none pointer-events-none"
                  draggable={false}
                />
              </div>

              <div className="p-6 sm:p-8 overflow-hidden flex flex-col justify-between gap-4">

                <div className="relative border border-mint-leaf/30 rounded overflow-hidden bg-evergreen/40 h-44 flex items-center justify-center">
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
                    <ellipse
                      cx="160"
                      cy="80"
                      rx="130"
                      ry="58"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      strokeDasharray="6 4"
                      className="animate-pulse"
                    />
                    <ellipse
                      cx="160"
                      cy="80"
                      rx="96"
                      ry="42"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                    <ellipse
                      cx="164"
                      cy="78"
                      rx="62"
                      ry="26"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeDasharray="4 3"
                    />
                    <ellipse
                      cx="168"
                      cy="76"
                      rx="28"
                      ry="12"
                      stroke="#D6F8ED"
                      strokeWidth="1.2"
                    />
                    <line x1="0" y1="80" x2="320" y2="80" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.75" />
                    <line x1="160" y1="0" x2="160" y2="160" stroke="currentColor" strokeOpacity="0.3" strokeWidth="0.75" />
                    <circle cx="168" cy="76" r="3" fill="#41D2A2" />
                  </svg>
                  <div className="pointer-events-none absolute bottom-2 left-2.5 right-2.5 flex justify-between font-mono text-[8px] text-mint-leaf/80 tracking-widest">
                    <span>ELEV - +500M</span>
                    <span>DHARMARAJA COLLEGE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex w-full text-white border-b border-white/20 bg-black/50 backdrop-blur-[2px]">
            <div className="px-6 py-8 w-[30%] border-r border-white/20 relative overflow-hidden max-sm:hidden flex flex-col justify-between font-mono text-[9px] text-mint-leaf/60 tracking-widest uppercase">
              <span></span>
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49.5%,rgba(65,210,162,0.35)_50%,transparent_50.5%)] pointer-events-none" />
              <span className="self-end text-white/40">DRCIS - 2026</span>
            </div>

            <div className="px-6 py-10 w-[70%] max-sm:w-full">
              <div className="relative">
                {[
                  "WHY PARTICIPATE IN SYNC'26?",
                  'APPLIED ENGINEERING & DESIGN,',
                  'NATIONAL INTER-SCHOOL GLORY,',
                  'SHOWCASED ON MAIN EVENT DAY.',
                ].map((item, idx) => (
                  <h3
                    key={idx}
                    className={`section-title text-xl sm:text-3xl md:text-[36px] leading-tight font-black uppercase ${
                      idx === 0 ? 'pl-20 max-sm:pl-12' : ''
                    }`}
                  >
                    {item}
                  </h3>
                ))}
              </div>
            </div>
          </div>

          <div className="relative max-sm:hidden flex w-full text-white border-b border-white/20 bg-black/50">
            <div className="p-8 w-[30%] border-r border-white/20 flex flex-col justify-between font-mono text-[10px] text-white/45 uppercase">
              <span> DIVISION_SCOPE</span>
              <p className="text-mint-leaf/80 leading-relaxed">
                INTRA-SCHOOL &amp; INTER-SCHOOL TRACKS  GRADES 06–13
              </p>
            </div>
            <div className="p-8 w-[35%] border-r border-white/20 flex items-center justify-between gap-4">
              <p className="text-[10px] leading-4 uppercase font-mono text-mint-leaf">
                DHARMARAJA COLLEGE <br /> ICT SOCIETY  OVER A DECADE OF EXCELLENCE
              </p>
              <img src="./images/logo.png" alt="Symbol" className="w-14 opacity-75 shrink-0" />
            </div>
            <div className="p-8 w-[35%] flex flex-col justify-end font-mono text-[10px] text-white/45 uppercase">
              <p className="text-mint-leaf/80 leading-relaxed">
                ONLINE QUALIFIERS &amp; PHYSICAL FINALE AT AUDITORIUM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: 08 COMPETITION TRACKS (#factions)
      ===================================================================== */}
      <section
        id="factions"
        className="section4 mt-[120px] min-h-screen w-full relative z-30 flex justify-center font-ethnocentric overflow-hidden"
      >
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none z-10">
          <div className="bg-block1 absolute w-[92vw] max-w-[1300px] h-[88vh] bg-evergreen/90 border border-turf-green scale-0 rounded-xl" />
        </div>
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none z-10">
          <div className="bg-block2 absolute w-[94vw] max-w-[1320px] h-[90vh] bg-turf-green/80 border border-sea-green scale-0 rounded-xl" />
        </div>
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none z-10">
          <div className="bg-block3 absolute w-[96vw] max-w-[1340px] h-[92vh] bg-black/90 border border-mint-leaf/40 scale-0 rounded-xl" />
        </div>

        <div className="w-[97vw] pl-[68px] pt-[70px] flex items-center z-30 relative max-md:flex-col max-md:pl-4">
          <div className="flex items-center justify-center w-[22vw] max-md:w-full py-8">
            <div className="-rotate-90 max-md:rotate-0 flex flex-col gap-2">
              <h2 className="font-ethnocentric text-[10vw] max-md:text-[22vw] leading-none tracking-tighter font-black text-white">
                08
              </h2>
            </div>
          </div>

          <div className="w-[48vw] max-md:w-full h-full flex items-center justify-center relative py-8 border-x border-white/20 max-md:border-x-0">
            <div className="s4-center-portrait w-full max-w-md px-6">
              <ImageTilt
                src="./images/section4-image.png"
                alt="08 Competition Tracks Portrait"
                className="!object-contain"
                tiltOptions={{ max: 30, scale: 1.04, perspective: 1200, speed: 800 }}
              />
            </div>
          </div>

          <div className="w-[30vw] max-md:w-full h-full flex flex-col justify-center">
            <div className="p-6 border-b border-white/20">
              <ImageTilt
                src="./images/face-traits.webp"
                alt="Competition Arena Upper"
                tiltOptions={{ max: 25, scale: 0.96, perspective: 1200, speed: 800 }}
              />
            </div>
            <div className="p-6">
              <ImageTilt
                src="./images/face-traits.webp"
                alt="Competition Arena Lower"
                tiltOptions={{ max: 25, scale: 0.96, perspective: 1200, speed: 800 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: 004 — 08 PREMIER COMPETITION CATEGORIES (#collectibles)
      ===================================================================== */}
      <section
        id="collectibles"
        className="section5 relative z-30 w-[97vw] mx-auto min-h-screen pl-[68px] pt-[70px] overflow-x-hidden font-ethnocentric flex flex-col justify-between gap-12 max-md:pl-4"
      >
        <div className="flex max-md:flex-col items-stretch w-full border-y border-white/20 bg-black/60 backdrop-blur-sm">
          <div className="w-1/2 max-md:w-full p-6 border-r border-white/20 max-md:border-r-0">
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl md:text-[38px] leading-none font-black pl-20 uppercase">
                08 PREMIER COMPETITION
              </h3>
              <h3 className="text-2xl sm:text-3xl md:text-[38px] leading-none font-black mt-1.5 uppercase">
                CATEGORIES<span className="text-mint-leaf">.</span>
              </h3>
            </div>
          </div>

          <div className="w-1/2 max-md:w-full p-6 flex items-center">
            <div className="relative space-y-4">
              <p className="font-mono text-[12px] leading-[18px] text-white/80 max-w-md">
                Compete across 7 core disciplines plus ASPECT Gaming: Logo Designing, Poster Designing, Game Designing, Web Designing, Algorithm (HackerRank), Video Editing, Odyssey Inter-School ICT Quiz, and Call of Duty 3 Esports.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActivePage('registrations');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                className="pointer-events-auto inline-flex items-center gap-2 px-5 py-2.5 bg-mint-leaf hover:bg-white text-black font-mono font-bold text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer"
              >
                <span>EXPLORE &amp; REGISTER &rarr;</span>
              </button>
            </div>
          </div>
        </div>

        <PerspectiveCardGallery className="my-auto py-8" />
      </section>

      {/* =====================================================================
          SECTION 7: FINAL CTA & COORDINATOR CONTACT MATRIX
      ===================================================================== */}
      <section className="section7 min-h-screen w-full relative z-30 flex justify-center font-ethnocentric bg-black/85 border-t border-white/20">
        <div className="h-full w-[97vw] max-md:w-full pt-[70px] pl-[68px] max-md:pl-4 flex flex-col justify-between z-30 relative overflow-hidden">
          <div className="min-h-[42vh] w-full border-b border-white/20 p-8 flex items-end justify-center s7-fade-up">
            <h2 className="font-ethnocentric text-[11vw] leading-none font-black tracking-tight text-white uppercase">
              SYNC'26<span className="text-mint-leaf">.</span>
            </h2>
          </div>

          <div className="min-h-[42vh] w-full flex max-md:flex-col justify-between items-start md:items-end py-8 px-12 max-sm:px-4 gap-8">
            <div className="flex flex-col justify-between space-y-4 s7-fade-up max-w-sm pointer-events-auto">
              <span className="font-mono text-[10px] tracking-[0.25em] text-mint-leaf">
                YOUR NEXT BREAKTHROUGH STARTS HERE  SYNC'26
              </span>
              <span className="font-mono font-normal text-[12px] leading-5 block text-white/80">
                Step into the futuristic dimension. Submit your entry or contact the Dharmaraja College ICT Society organizing committee.
              </span>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setActivePage('registrations');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  className="px-4 py-2 bg-mint-leaf hover:bg-white text-black font-mono font-bold text-[10px] tracking-[0.18em] uppercase transition-colors cursor-pointer"
                >
                  REGISTER NOW &rarr;
                </button>
                <a
                  href="https://chat.whatsapp.com/IaBJyTRhZcACMFKUOrYndg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-mint-leaf/40 bg-black/60 hover:bg-mint-leaf hover:text-black text-mint-leaf font-mono text-[10px] tracking-[0.18em] uppercase transition-colors"
                >
                  WHATSAPP COMMUNITY
                </a>
              </div>
            </div>

            <div className="flex flex-col space-y-2.5 font-mono text-[11px] s7-fade-up pointer-events-auto md:text-right">
              <span className="text-[10px] tracking-[0.25em] text-mint-leaf uppercase">
                GET IN TOUCH
              </span>
              <div className="text-white/85">
                <span className="text-white/50 text-[10px] mr-2">COORDINATOR:</span>
                <span>MUDITHA KORALEGEDARA — </span>
                <a href="tel:+94702645851" className="text-mint-leaf hover:underline">
                  +94 70 264 5851
                </a>
              </div>
              <div className="text-white/85">
                <span className="text-white/50 text-[10px] mr-2">CHIEF EDITOR &amp; TECH LEAD:</span>
                <span>NETHUN THE EDITOR — </span>
                <a href="tel:+94714906145" className="text-mint-leaf hover:underline">
                  +94 71 490 6145
                </a>
              </div>
              <div className="flex flex-wrap md:justify-end items-center gap-4 pt-1 text-[10px]">
                <a
                  href="mailto:drck.ictsociety@gmail.com"
                  className="text-white/75 hover:text-mint-leaf transition-colors"
                >
                  drck.ictsociety@gmail.com
                </a>
                <a
                  href="https://wa.link/05138r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-mint-leaf hover:underline"
                >
                  CHAT ON WHATSAPP &nearr;
                </a>
              </div>
            </div>
          </div>

          <div className="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 max-sm:static max-sm:translate-x-0 max-sm:translate-y-0 max-sm:mx-auto max-sm:pb-8">
            <ImageTilt
              src="./images/section4-image.png"
              alt="SYNC 26 Arena"
              className="!object-contain s7-scale-up"
              tiltOptions={{ max: 35, scale: 1.04, perspective: 1200, speed: 1200 }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
