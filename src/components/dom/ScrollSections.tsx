import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '../../store/useAppStore';
import { ImageTilt } from './ImageTilt';
import { PerspectiveCardGallery } from './PerspectiveCardGallery';

gsap.registerPlugin(ScrollTrigger);

const TERMINAL_LINES = [
  '//INITIALIZING',
  "SYNC'26 STORY",
  '',
  'LOADING...[47%]',
  '',
  'LOCATION_DATA',
  'CHARACTER_ATTRIBUTES',
  'KLMX TRANSMISSIONS',
];

export function ScrollSections() {
  const scrollProgress = useAppStore((state) => state.scrollProgress);
  const setActiveSection = useAppStore((state) => state.setActiveSection);
  const rootRef = useRef<HTMLDivElement>(null);

  // Refs for the 3D Morphing Hero-to-Card element
  const heroCardStageRef = useRef<HTMLDivElement>(null);
  const heroCardBodyRef = useRef<HTMLDivElement>(null);
  const heroCardGlareRef = useRef<HTMLDivElement>(null);

  // Interactive mouse tilt state when the card is docked in Section 2
  const [mouseTilt, setMouseTilt] = useState({ rotateX: 0, rotateY: 0, scale: 1 });

  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setMouseTilt({
      rotateX: Number((-dy * 16).toFixed(2)),
      rotateY: Number((dx * 16).toFixed(2)),
      scale: 1.03,
    });
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    setMouseTilt({ rotateX: 0, rotateY: 0, scale: 1 });
  }, []);

  useEffect(() => {
    const index = Math.min(3, Math.floor(scrollProgress * 4));
    setActiveSection(index);
  }, [scrollProgress, setActiveSection]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isDesktop = window.innerWidth > 768;

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

        // Morph dimensions, position, and 3D rotation simultaneously
        heroToCardTl.fromTo(
          heroCardBodyRef.current,
          {
            width: '100vw',
            height: '100vh',
            x: isDesktop ? '4vw' : '0vw',
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

        // Sweep the 3D specular glare across the card as it rotates
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

        // Rotate & shrink the 3D card out when scrolling into Section 3
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

      // Fade out hero text as we scroll into Section 2
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

      // 3. Section 3 center-scaling background image (.s3image)
      gsap.fromTo(
        '.s3image',
        {
          scale: 0,
          y: window.innerWidth < 768 ? -120 : 0,
          transformOrigin: 'center',
        },
        {
          scale: 1.08,
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

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="w-full text-white">
      {/* =====================================================================
          3D MORPHING HERO-TO-CARD STAGE
          Starts as 100vw x 100vh Hero Background, rotates 360° in 3D space
          on scroll, and docks as a 3D tiltable card in Section 2's right column.
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
          {/* Interactive Hover Tilt Wrapper (active when hovering the card) */}
          <div
            className="relative w-full h-full transition-transform duration-300 ease-out"
            style={{
              transformStyle: 'preserve-3d',
              transform: `rotateX(${mouseTilt.rotateX}deg) rotateY(${mouseTilt.rotateY}deg) scale3d(${mouseTilt.scale}, ${mouseTilt.scale}, ${mouseTilt.scale})`,
            }}
          >
            {/* 3D Extruded Back/Side Thickness Plate (-10px Z depth) */}
            <div
              className="absolute inset-0 rounded-[inherit] bg-gradient-to-br from-mint-leaf/60 via-sea-green/50 to-evergreen border border-mint-leaf/60 shadow-[0_25px_70px_rgba(4,56,38,0.85)]"
              style={{
                transform: 'translateZ(-10px)',
              }}
            />

            {/* 3D Mid-Chassis Plate (-5px Z depth) */}
            <div
              className="absolute inset-0 rounded-[inherit] bg-evergreen/90 border border-mint-leaf/40"
              style={{
                transform: 'translateZ(-5px)',
              }}
            />

            {/* Back Face of the 3D Card (visible when rotateY is between 90° and 270°) */}
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
                className="w-full h-full object-cover opacity-80 mix-blend-luminosity"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-evergreen via-transparent to-evergreen/60" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center font-mono text-[10px] text-mint-leaf tracking-widest">
                <span>SYNC&apos;26 // CORE ARTIFACT</span>
                <span>3D ROTATION ACTIVE</span>
              </div>
            </div>

            {/* Front Face of the 3D Card (Hero Background -> Section 2 Right Card) */}
            <div
              className="relative w-full h-full rounded-[inherit] overflow-hidden border border-white/20 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'translateZ(2px)',
              }}
            >
              <img
                src="./images/hero-bg.png"
                alt="Hero 3D Morphing Card"
                className="w-full h-full object-cover opacity-75"
                draggable={false}
              />

              {/* Subtle Sci-Fi Corner Brackets & Telemetry Overlay */}
              <div className="pointer-events-none absolute inset-3 border border-mint-leaf/25 rounded-[inherit]">
                <div className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 border-mint-leaf" />
                <div className="absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2 border-mint-leaf" />
                <div className="absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2 border-mint-leaf" />
                <div className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 border-mint-leaf" />
              </div>

              {/* Dynamic Specular Reflection Sweep during 3D Scroll Rotation */}
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
          {/* Top-Left KPRverse Narrative Intro Paragraph */}
          <div className="max-w-[310px] sm:max-w-[340px]">
            <p className="font-whyte text-xs sm:text-[13px] md:text-sm leading-[1.45] text-white/90 font-normal tracking-normal">
              SYNC&apos;26 is a brand that focuses on collective narrative and empowering storytellers. Keepers is a living story, an uncharted world waiting to be explored, to be imagined.
            </p>
          </div>

          {/* Lower Staggered 3-Tier KPRverse Display Lockup */}
          <div className="w-full flex flex-col gap-1 sm:gap-0 my-auto pt-10 sm:pt-14">
            {/* TIER 1: 01K — KEEP. */}
            <div className="ml-[14%] sm:ml-[24%] md:ml-[29%] flex flex-col items-start">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-white/75 mb-0.5 -ml-3 sm:-ml-4">
                01K
              </span>
              <div className="font-ethnocentric text-[clamp(2.25rem,7.2vw,6.8rem)] leading-[0.88] tracking-tight text-white uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
                KEEP<span className="text-mint-leaf">.</span>
              </div>
            </div>

            {/* TIER 2: 02P — PROTECT. */}
            <div className="ml-[18%] sm:ml-[30%] md:ml-[37%] flex flex-col items-start mt-1 sm:mt-2">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-white/75 mb-0.5">
                02P
              </span>
              <div className="font-ethnocentric text-[clamp(2.25rem,7.2vw,6.8rem)] leading-[0.88] tracking-tight text-white uppercase drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
                PROTECT<span className="text-mint-leaf">.</span>
              </div>
            </div>

            {/* TIER 3 (Anchored Bottom-Left): 03S — SYNC'26. */}
            <div className="ml-0 sm:ml-[2%] flex flex-col items-start mt-1 sm:mt-2">
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-mint-leaf mb-0.5 -ml-1 sm:-ml-3">
                03S
              </span>
              <h1 className="font-ethnocentric text-[clamp(2.4rem,7.8vw,7.4rem)] leading-[0.88] tracking-tight text-white uppercase drop-shadow-[0_0_35px_rgba(65,210,162,0.28)]">
                SYNC&apos;26<span className="text-mint-leaf">.</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: ABOUT SECTION (001 — A FAMILIAR WORLD... SET ON A DIFFERENT PATH)
      ===================================================================== */}
      <section className="about-section min-h-screen w-full relative z-20 flex justify-center font-whyte">
        <div className="h-full w-[97vw] max-md:w-full max-md:pl-4 pl-[68px] pt-[70px] flex items-start z-20 relative max-md:flex-col border-t border-white/20 bg-black/55 backdrop-blur-[2px]">
          {/* Left Side (62%) */}
          <div className="relative flex flex-col max-md:w-full w-[62%] min-h-[86vh] justify-between">
            {/* Left Side Top */}
            <div className="px-6 py-8 max-md:p-4 text-white border-b border-white/20">
              <div className="relative">
                <span className="dot-mint pl-3 font-mono text-[9px] text-mint-leaf absolute top-2 left-2">
                  001
                </span>
                <h3 className="section-title text-3xl sm:text-4xl md:text-[44px] leading-none font-black tracking-tight pl-20 uppercase">
                  A FAMILIAR WORLD... SET
                </h3>
                <h3 className="section-title text-3xl sm:text-4xl md:text-[44px] leading-none font-black tracking-tight mt-1 uppercase">
                  ON A DIFFERENT PATH<span className="text-mint-leaf">.</span>
                </h3>
              </div>
            </div>

            {/* Left Side Bottom */}
            <div className="p-8 flex flex-col justify-between gap-6 flex-1">
              <div className="w-56 sm:w-64">
                <ImageTilt
                  src="./images/trailer-side-media.webp"
                  alt="Trailer Side Media"
                  className="border border-mint-leaf/30"
                  tiltOptions={{ max: 20, scale: 1.03, perspective: 1200, speed: 400 }}
                />
                <div className="mt-2 flex items-center gap-2 font-mono text-[9px] text-mint-leaf uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-mint-leaf inline-block" />
                  <span>ANIMUS CHARACTER // ARCHIVE 01</span>
                </div>
              </div>

              <h6 className="block max-w-xs text-[13px] leading-[18px] text-white/80 section-title">
                Isolated within the New Eden safe zone, you witness humanity struggling to avoid descending into chaos.
              </h6>
            </div>
          </div>

          {/* Right Side (38%): Docking Bay for the 3D Rotating Hero Card */}
          <div className="w-[38%] min-h-[86vh] border-l border-white/20 p-6 max-md:w-full max-md:border-l-0 max-md:border-t flex flex-col items-center justify-between">
            <div className="w-full flex items-center justify-between font-mono text-[9px] text-white/40 uppercase tracking-widest">
              <span>DOCKING BAY // 01</span>
              <span className="text-mint-leaf">3D OBJECT LOCK</span>
            </div>
            {/* The 3D Hero Card rotates & lands right inside this frame */}
            <div className="w-full flex-1 flex items-center justify-center my-4 border border-dashed border-white/10 rounded-2xl" />
            <div className="w-full flex items-center justify-between font-mono text-[9px] text-white/40 uppercase tracking-widest">
              <span>HOVER CARD TO TILT</span>
              <span>SYNC&apos;26 ARCHIVE</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: 4-ROW ARCHITECTURAL GRID (002 & 003 — YOU ARE A KEEPER)
      ===================================================================== */}
      <section className="section3 min-h-screen w-full relative z-20 flex flex-col justify-center font-whyte">
        {/* Center-Scaling Background Image (.s3image) */}
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none z-10">
          <img
            src="./images/section3-image.png"
            alt="Section 3 Backdrop"
            className="s3image absolute object-cover w-[92vw] max-w-[1250px] h-[82vh] max-h-[900px] scale-0 rounded-xl opacity-45 border border-mint-leaf/30"
          />
        </div>

        <div className="h-full mt-[180px] w-[97vw] max-md:w-full max-md:pl-4 pl-[68px] pt-[70px] z-30 relative mx-auto">
          {/* Row 1 */}
          <div className="relative min-h-[52vh] flex max-md:flex-col w-full text-white border-y border-white/20 bg-black/50 backdrop-blur-[2px]">
            <div className="px-6 py-8 w-[70%] max-md:w-full border-r border-white/20 max-md:border-r-0">
              <div className="relative">
                <span className="dot-mint pl-3 font-mono text-[9px] text-mint-leaf absolute top-2 left-2">
                  002
                </span>
                <h3 className="section-title text-3xl sm:text-4xl md:text-[44px] leading-none font-black pl-20 max-sm:pl-12 uppercase">
                  YOU ARE A KEEPER: AN AGENT
                </h3>
                <h3 className="section-title text-3xl sm:text-4xl md:text-[44px] leading-none font-black mt-1 uppercase">
                  OF POWER AND CHANGE IN THIS
                </h3>
                <h3 className="section-title text-3xl sm:text-4xl md:text-[44px] leading-none font-black mt-1 uppercase">
                  WORLD<span className="text-mint-leaf">.</span>
                </h3>
              </div>
            </div>

            <div className="p-8 w-[30%] max-md:w-full font-mono text-[10px] leading-4 text-mint-leaf/80 space-y-0.5">
              {TERMINAL_LINES.map((line, idx) => (
                <p key={idx} className="min-h-[12px]">
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Row 2: Topographic Video & Coordinates */}
          <div className="relative min-h-[48vh] flex w-full text-white border-b border-white/20 bg-black/50 backdrop-blur-[2px]">
            <div className="px-6 py-8 w-[70%] max-sm:w-[35%] border-r border-white/20" />
            <div className="p-6 sm:p-8 overflow-hidden w-[30%] max-sm:w-[65%] flex flex-col justify-between gap-4">
              <div className="w-full flex items-center justify-between font-mono text-[10px] text-mint-leaf">
                <div>
                  <p>N 35°27.37</p>
                  <p>E 139°38.57</p>
                </div>
                <span className="px-2 py-0.5 border border-mint-leaf/40 text-[9px]">
                  TOPO // LIVE
                </span>
              </div>
              <div className="border border-white/15 rounded overflow-hidden bg-evergreen/30">
                <video playsInline loop autoPlay muted className="w-full h-40 object-cover opacity-80">
                  <source src="https://kprverse.com/videos/project/topo-landing.mp4" type="video/mp4" />
                  <source src="https://kprverse.com/videos/project/topo-landing.webm" type="video/webm" />
                </video>
              </div>
            </div>
          </div>

          {/* Row 3: Diagonal Line + 003 Headline */}
          <div className="relative min-h-[45vh] flex w-full text-white border-b border-white/20 bg-black/50 backdrop-blur-[2px]">
            <div className="px-6 py-8 w-[30%] border-r border-white/20 relative overflow-hidden max-sm:hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_49.5%,rgba(65,210,162,0.35)_50%,transparent_50.5%)]" />
            </div>

            <div className="px-6 py-8 w-[70%] max-sm:w-full">
              <div className="relative">
                <span className="dot-mint pl-3 font-mono text-[9px] text-mint-leaf absolute top-2 left-2">
                  003
                </span>
                {[
                  'WHAT WILL YOU DO WITH THIS',
                  'POWER? WILL YOU CHOOSE TO',
                  'PROTECT OR DESTROY? TO GIVE',
                  'OR TO TAKE?',
                ].map((item, idx) => (
                  <h3
                    key={idx}
                    className={`section-title text-2xl sm:text-4xl md:text-[42px] leading-tight font-black uppercase ${
                      idx === 0 ? 'pl-20 max-sm:pl-12' : ''
                    }`}
                  >
                    {item}
                  </h3>
                ))}
              </div>
            </div>
          </div>

          {/* Row 4: 3-Column Symbol Grid */}
          <div className="relative h-[45vh] max-sm:hidden flex w-full text-white border-b border-white/20 bg-black/50">
            <div className="p-8 h-full w-[30%] border-r border-white/20" />
            <div className="p-8 h-full w-[35%] border-r border-white/20 flex flex-col justify-between">
              <p className="text-[10px] leading-3 uppercase font-mono text-mint-leaf">
                SYNC&apos;26 <br /> SYMBOL // ARCHIVE
              </p>
              <img src="./images/logo.png" alt="Symbol" className="w-16 opacity-70" />
            </div>
            <div className="p-8 h-full w-[35%]" />
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: 10K INITIAL COLLECTION & EXPANDING GREEN BACKGROUND BLOCKS
      ===================================================================== */}
      <section className="section4 mt-[120px] min-h-screen w-full relative z-20 flex justify-center font-whyte overflow-hidden">
        {/* 3 Expanding Background Blocks (using the Green/Mint Palette) */}
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none z-10">
          <div className="bg-block1 absolute w-[92vw] max-w-[1300px] h-[88vh] bg-evergreen/90 border border-turf-green scale-0 rounded-xl" />
        </div>
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none z-10">
          <div className="bg-block2 absolute w-[94vw] max-w-[1320px] h-[90vh] bg-turf-green/80 border border-sea-green scale-0 rounded-xl" />
        </div>
        <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none z-10">
          <div className="bg-block3 absolute w-[96vw] max-w-[1340px] h-[92vh] bg-black/90 border border-mint-leaf/40 scale-0 rounded-xl" />
        </div>

        {/* Section 4 Content */}
        <div className="w-[97vw] pl-[68px] pt-[70px] flex items-center z-30 relative max-md:flex-col max-md:pl-4">
          {/* Left Vertical Rotated 10K */}
          <div className="flex items-center justify-center w-[22vw] max-md:w-full py-8">
            <div className="-rotate-90 max-md:rotate-0 flex flex-col gap-2">
              <h2 className="font-ethnocentric text-[10vw] max-md:text-[22vw] leading-none tracking-tighter font-black text-white">
                10K
              </h2>
              <span className="font-mono text-[11px] uppercase tracking-widest text-mint-leaf flex items-center gap-2">
                <span>&gt;&gt;</span> Initial Collection
              </span>
            </div>
          </div>

          {/* Center Character Portrait */}
          <div className="w-[48vw] max-md:w-full h-full flex items-center justify-center relative py-8 border-x border-white/20 max-md:border-x-0">
            <div className="s4-center-portrait w-full max-w-md px-6">
              <ImageTilt
                src="./images/section4-image.png"
                alt="10K Collection Portrait"
                className="!object-contain"
                tiltOptions={{ max: 30, scale: 1.04, perspective: 1200, speed: 800 }}
              />
            </div>
          </div>

          {/* Right Stacked Face Traits Cards */}
          <div className="w-[30vw] max-md:w-full h-full flex flex-col justify-center">
            <div className="p-6 border-b border-white/20">
              <ImageTilt
                src="./images/face-traits.webp"
                alt="Face Traits Upper"
                tiltOptions={{ max: 25, scale: 0.96, perspective: 1200, speed: 800 }}
              />
            </div>
            <div className="p-6">
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
          SECTION 5: 004 — 10,000 UNIQUE DIGITAL COLLECTIBLES (3D CARD TUNNEL)
      ===================================================================== */}
      <section className="section5 relative z-30 w-[97vw] mx-auto min-h-screen pl-[68px] pt-[70px] overflow-x-hidden font-whyte flex flex-col justify-between gap-12 max-md:pl-4">
        <div className="flex max-md:flex-col items-stretch w-full border-y border-white/20 bg-black/60 backdrop-blur-sm">
          <div className="w-1/2 max-md:w-full p-6 border-r border-white/20 max-md:border-r-0">
            <div className="relative">
              <span className="dot-mint pl-3 font-mono text-[9px] text-mint-leaf absolute top-2 left-2">
                004
              </span>
              <h3 className="text-3xl sm:text-4xl md:text-[42px] leading-none font-black pl-20 uppercase">
                10,000 UNIQUE DIGITAL
              </h3>
              <h3 className="text-3xl sm:text-4xl md:text-[42px] leading-none font-black mt-1 uppercase">
                COLLECTIBLES<span className="text-mint-leaf">.</span>
              </h3>
            </div>
          </div>

          <div className="w-1/2 max-md:w-full p-6 flex items-center">
            <div className="relative">
              <span className="dot-mint pl-3 font-mono text-[9px] text-mint-leaf uppercase block mb-2">
                Initial Collection
              </span>
              <p className="text-[13px] leading-[18px] text-white/80 max-w-md">
                Every Keeper is born, endowed with attributes from a collection of over 400 meticulously hand-painted assets. They are personable, iconic possessions that represent SYNC&apos;26&apos;s foundational pillars of evolution, inclusion, and imagination.
              </p>
            </div>
          </div>
        </div>

        {/* Dual-Tunnel 3D Perspective Card Carousel */}
        <PerspectiveCardGallery className="my-auto py-8" />
      </section>

      {/* =====================================================================
          SECTION 6: PINNED 300VH POLYGON CLIP-PATH WORLD REVEAL
      ===================================================================== */}
      <section className="section6 w-full h-screen z-30 relative overflow-hidden font-whyte text-white bg-black">
        {/* Layer 1: THE KEEP */}
        <div id="the-keep" className="absolute inset-0 z-10 overflow-hidden">
          <img
            src="./images/section3-image.png"
            alt="The Keep"
            className="s6-img-1 w-full h-full object-cover opacity-75"
          />
        </div>

        {/* Layer 2: FACTIONS (Expands via polygon clip-path) */}
        <div id="factions" className="absolute inset-0 z-20 overflow-hidden">
          <img
            src="./images/section3-bg.jpg"
            alt="Factions"
            className="s6-img-2 w-full h-full object-cover"
            style={{ clipPath: 'polygon(40% 25%, 60% 25%, 60% 75%, 40% 75%)' }}
          />
        </div>

        {/* Layer 3: THE WORLD (Expands via polygon clip-path) */}
        <div id="the-world" className="absolute inset-0 z-30 overflow-hidden">
          <img
            src="./images/protocol-bg.jpg"
            alt="The World"
            className="s6-img-3 w-full h-full object-cover"
            style={{ clipPath: 'polygon(50% 25%, 50% 25%, 50% 75%, 50% 75%)' }}
          />
        </div>

        {/* Caption 1: 001 . THE KEEP */}
        <div className="s6-text1 absolute bottom-14 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[85%] text-center bg-black/75 border border-mint-leaf/40 backdrop-blur-md p-6">
          <span className="font-mono text-[10px] tracking-[0.25em] text-mint-leaf block mb-2">
            001 . THE KEEP
          </span>
          <p className="text-sm sm:text-base text-white/90">
            SYNC&apos;26 is a fortress of collective narrative and empowering storytellers. Keepers is a living story, an uncharted world waiting to be explored.
          </p>
        </div>

        {/* Caption 2: 002 . FACTIONS */}
        <div className="s6-text2 opacity-0 absolute bottom-14 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[85%] text-center bg-black/75 border border-mint-leaf/40 backdrop-blur-md p-6">
          <span className="font-mono text-[10px] tracking-[0.25em] text-mint-leaf block mb-2">
            002 . FACTIONS
          </span>
          <p className="text-sm sm:text-base text-white/90">
            Rival syndicates and guardians converge across the frontier. Every faction shapes the protocol through collective action.
          </p>
        </div>

        {/* Caption 3: 003 . THE WORLD */}
        <div className="s6-text3 opacity-0 absolute bottom-14 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[85%] text-center bg-black/75 border border-mint-leaf/40 backdrop-blur-md p-6">
          <span className="font-mono text-[10px] tracking-[0.25em] text-mint-leaf block mb-2">
            003 . THE WORLD
          </span>
          <p className="text-sm sm:text-base text-white/90">
            An ever-expanding synthetic biosphere. Hold [DECRYPT] or press [SPACE] at any coordinates to breach the underlying stencil layer.
          </p>
        </div>
      </section>

      {/* =====================================================================
          SECTION 7: BECOME A KEEPER (MONUMENTAL HEADLINE + TILT PORTRAIT)
      ===================================================================== */}
      <section className="section7 min-h-screen w-full relative z-30 flex justify-center font-whyte bg-black/85 border-t border-white/20">
        <div className="h-full w-[97vw] max-md:w-full pt-[70px] pl-[68px] max-md:pl-4 flex flex-col justify-between z-30 relative overflow-hidden">
          <div className="min-h-[42vh] w-full border-b border-white/20 p-8 flex items-end justify-center s7-fade-up">
            <h2 className="font-ethnocentric text-[11vw] leading-none font-black tracking-tight text-white uppercase">
              KEEPERS<span className="text-mint-leaf">.</span>
            </h2>
          </div>

          <div className="min-h-[42vh] w-full flex flex-col justify-between py-8 px-12 max-sm:px-4">
            <span className="font-mono text-[10px] tracking-[0.25em] text-mint-leaf s7-fade-up">
              BECOME A KEEPER // SYNC&apos;26
            </span>
            <span className="font-normal text-[13px] max-w-xs leading-5 block text-white/80 s7-fade-up">
              SYNC&apos;26 is a brand that focuses on collective narrative and empowering storytellers. Keepers is a living story.
            </span>
          </div>

          {/* Centered Floating Portrait */}
          <div className="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 max-sm:static max-sm:translate-x-0 max-sm:translate-y-0 max-sm:mx-auto max-sm:pb-8">
            <ImageTilt
              src="./images/section4-image.png"
              alt="Become a Keeper"
              className="!object-contain s7-scale-up"
              tiltOptions={{ max: 35, scale: 1.04, perspective: 1200, speed: 1200 }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
