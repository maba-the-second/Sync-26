import { lazy, Suspense, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from './store/useAppStore';
import { SceneCanvas } from './components/canvas/SceneCanvas';
import { OdysseyCanvas } from './components/canvas/OdysseyCanvas';
import { HudFrame } from './components/dom/HudFrame';
import { Preloader } from './components/dom/Preloader';
import { KprFooter } from './components/dom/KprFooter';
import { HomePage } from './pages/HomePage';

const RegistrationsPage = lazy(() =>
  import('./pages/RegistrationsPage').then((m) => ({ default: m.RegistrationsPage }))
);
const OdysseyPage = lazy(() =>
  import('./pages/OdysseyPage').then((m) => ({ default: m.OdysseyPage }))
);
const AspectPage = lazy(() =>
  import('./pages/AspectPage').then((m) => ({ default: m.AspectPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((m) => ({ default: m.AboutPage }))
);

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const activePage = useAppStore((state) => state.activePage);
  const odysseyStage2 = useAppStore((state) => state.odysseyStage2);
  const setScrollProgress = useAppStore((state) => state.setScrollProgress);
  const lenisRef = useRef<Lenis | null>(null);

  const isScrollLocked = activePage === 'odyssey' && !odysseyStage2;

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenisRef.current = lenis;

    lenis.on('scroll', ({ progress }: { progress: number }) => {
      setScrollProgress(progress);
      ScrollTrigger.update();
    });

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [setScrollProgress]);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activePage]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (isScrollLocked) {
      lenis?.scrollTo(0, { immediate: true });
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      const preventScroll = (e: Event) => {
        e.preventDefault();
      };
      const preventKeyScroll = (e: KeyboardEvent) => {
        if (
          ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.key)
        ) {
          e.preventDefault();
        }
      };

      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('keydown', preventKeyScroll, { passive: false });

      return () => {
        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
        window.removeEventListener('keydown', preventKeyScroll);
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        lenis?.start();
        ScrollTrigger.refresh();
      };
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      lenis?.start();
      ScrollTrigger.refresh();
    }
  }, [isScrollLocked]);

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage key="home" />;
      case 'registrations':
        return <RegistrationsPage key="registrations" />;
      case 'odyssey':
        return <OdysseyPage key="odyssey" />;
      case 'aspect':
        return <AspectPage key="aspect" />;
      case 'about':
        return <AboutPage key="about" />;
      default:
        return <HomePage key="home" />;
    }
  };

  return (
    /* Step 1: Root .container */
    <div className="container-root relative w-full min-h-screen min-h-[100dvh] bg-black text-white selection:bg-mint-leaf selection:text-black">
      {/* Boot-Sequence Preloader */}
      <Preloader />

      {/* Fixed Sci-Fi Command Console HUD (z-40) */}
      <HudFrame />

      {/* Step 2 & 4: Footer placed fixed BEHIND the .subcontainer-wrapper (z-0) */}
      {activePage !== 'registrations' && <KprFooter />}

      {/* Step 3 & 5: .subcontainer-wrapper in front (z-10) */}
      <div className="subcontainer-wrapper relative z-10 w-full pointer-events-none">
        {/* UPPER PART: Content-Visible (Opaque black background blocks the footer behind it) */}
        <div
          className={`content-visible relative w-full bg-black ${
            activePage !== 'registrations'
              ? 'border-b border-mint-leaf/40 shadow-[0_35px_90px_rgba(0,0,0,0.98)]'
              : ''
          } [clip-path:inset(0)]`}
        >
          {/* Sticky 3D WebGL Background inside the upper content curtain */}
          <div
            className={`sticky top-0 left-0 w-full h-screen h-[100dvh] z-0 ${
              (activePage === 'odyssey' && odysseyStage2) || activePage === 'about'
                ? 'pointer-events-none'
                : 'pointer-events-auto'
            } ${
              activePage === 'registrations'
                ? 'pl-11 pt-12 pr-0 sm:pl-12 sm:pt-12 sm:pr-0 md:pl-14 md:pt-12 md:pr-0'
                : ''
            }`}
          >
            {activePage === 'odyssey' ? (
              <OdysseyCanvas />
            ) : activePage === 'about' ? null : (
              <SceneCanvas />
            )}
          </div>

          {/* Active Directory Standalone View */}
          <main className="relative z-10 -mt-[100vh] -mt-[100dvh] pointer-events-none">
            <Suspense fallback={<div className="min-h-screen min-h-[100dvh] w-full" />}>
              {renderActivePage()}
            </Suspense>
          </main>
        </div>

        {/* LOWER PART: Invisible Section (100dvh transparent window that reveals the footer underneath) */}
        {activePage !== 'registrations' && (
          <div
            className="invisible-section w-full h-screen h-[100dvh] bg-transparent pointer-events-none"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
