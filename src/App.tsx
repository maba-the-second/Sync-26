import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from './store/useAppStore';
import { SceneCanvas } from './components/canvas/SceneCanvas';
import { HudFrame } from './components/dom/HudFrame';
import { ScrollSections } from './components/dom/ScrollSections';
import { Preloader } from './components/dom/Preloader';
import { KprFooter } from './components/dom/KprFooter';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const setScrollProgress = useAppStore((state) => state.setScrollProgress);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });

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
    };
  }, [setScrollProgress]);

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

          {/* Scrollable Transparent HTML Sections pulled over the sticky 3D canvas */}
          <main className="relative z-10 -mt-[100vh] pointer-events-none">
            <ScrollSections />
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
