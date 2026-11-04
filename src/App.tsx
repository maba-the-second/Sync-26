import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from './store/useAppStore';
import { SceneCanvas } from './components/canvas/SceneCanvas';
import { HudFrame } from './components/dom/HudFrame';
import { Preloader } from './components/dom/Preloader';
import { KprFooter } from './components/dom/KprFooter';
import { HomePage } from './pages/HomePage';
import { RegistrationsPage } from './pages/RegistrationsPage';
import { SubmissionsPage } from './pages/SubmissionsPage';
import { OdysseyPage } from './pages/OdysseyPage';
import { AspectPage } from './pages/AspectPage';
import { AboutPage } from './pages/AboutPage';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const activePage = useAppStore((state) => state.activePage);
  const setScrollProgress = useAppStore((state) => state.setScrollProgress);
  const lenisRef = useRef<Lenis | null>(null);

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
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 60);
    return () => window.clearTimeout(timer);
  }, [activePage]);

  const renderActivePage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage key="home" />;
      case 'registrations':
        return <RegistrationsPage key="registrations" />;
      case 'submissions':
        return <SubmissionsPage key="submissions" />;
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
    <div className="container-root relative w-full min-h-screen bg-black text-white selection:bg-mint-leaf selection:text-black">
      {/* Boot-Sequence Preloader */}
      <Preloader />

      {/* Fixed Sci-Fi Command Console HUD (z-40) */}
      <HudFrame />

      {/* Step 2 & 4: Footer placed fixed BEHIND the .subcontainer-wrapper (z-0) */}
      <KprFooter />

      {/* Step 3 & 5: .subcontainer-wrapper in front (z-10) */}
      <div className="subcontainer-wrapper relative z-10 w-full pointer-events-none">
        {/* UPPER PART: Content-Visible (Opaque black background blocks the footer behind it) */}
        <div className="content-visible relative w-full bg-black border-b border-mint-leaf/40 shadow-[0_35px_90px_rgba(0,0,0,0.98)] [clip-path:inset(0)]">
          {/* Sticky 3D WebGL Background inside the upper content curtain */}
          <div className="sticky top-0 left-0 w-full h-screen z-0 pointer-events-auto">
            <SceneCanvas />
          </div>

          {/* Active Directory Standalone View */}
          <main className="relative z-10 -mt-[100vh] pointer-events-none">
            {renderActivePage()}
          </main>
        </div>

        {/* LOWER PART: Invisible Section (100dvh transparent window that reveals the footer underneath) */}
        <div
          className="invisible-section w-full h-screen bg-transparent pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
