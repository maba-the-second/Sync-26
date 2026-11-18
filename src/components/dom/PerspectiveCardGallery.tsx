import { useState, useEffect, useRef } from 'react';

interface PerspectiveCardGalleryProps {
  className?: string;
}

const LEFT_STEPS = [-1, -2, -3, -4, -5, 1];
const RIGHT_STEPS = [1, 2, 3, 4, 5, -1];
const Z_STEPS = [-4, -8, -12, -16, -20, -4];

const LEFT_CARD_IMAGES = [
  './images/about-image.png',
  './images/section4-image.png',
  './images/trailer-side-media.webp',
  './images/face-traits.webp',
  './images/hero.webp',
  './images/hero-2.webp',
];

const RIGHT_CARD_IMAGES = [
  './images/hero-2.webp',
  './images/hero.webp',
  './images/section4-image.png',
  './images/about-image.png',
  './images/trailer-side-media.webp',
  './images/face-traits.webp',
];

export function PerspectiveCardGallery({ className = '' }: PerspectiveCardGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [leftCounters, setLeftCounters] = useState([1, 2, 3, 4, 5, 6]);
  const [rightCounters, setRightCounters] = useState([1, 2, 3, 4, 5, 6]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsCompact(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = window.setInterval(() => {
      setLeftCounters((prev) => prev.map((c) => (c === 6 ? 1 : c + 1)));
      setRightCounters((prev) => prev.map((c) => (c === 6 ? 1 : c + 1)));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isVisible]);

  const stepRem = isCompact ? 4.2 : 10;

  const getLeftTransform = (index: number) => {
    const idx = leftCounters[index] - 1;
    return `translate3d(${LEFT_STEPS[idx] * stepRem}rem, 0, ${Z_STEPS[idx]}rem)`;
  };

  const getRightTransform = (index: number) => {
    const idx = rightCounters[index] - 1;
    return `translate3d(${RIGHT_STEPS[idx] * stepRem}rem, 0, ${Z_STEPS[idx]}rem)`;
  };

  return (
    <div
      ref={containerRef}
      className={`flex h-[230px] sm:h-[290px] md:h-[350px] w-full overflow-hidden ${className}`}
    >
      {/* Left Tunnel */}
      <div className="flex items-center relative overflow-hidden w-1/2">
        <div
          className="relative w-full flex items-center"
          style={{
            perspective: isCompact ? '520px' : '740px',
            transformStyle: 'preserve-3d',
            perspectiveOrigin: 'right center',
          }}
        >
          {LEFT_CARD_IMAGES.map((src, index) => (
            <img
              key={`left-${index}`}
              src={src}
              alt={`Keeper Collectible Left ${index + 1}`}
              loading="lazy"
              decoding="async"
              className="absolute w-[124px] h-[152px] sm:w-[190px] sm:h-[220px] md:w-[250px] md:h-[282px] object-cover rounded-md border border-mint-leaf/30 transition-transform duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)] bg-evergreen"
              style={{
                right: `-${stepRem}rem`,
                transform: getLeftTransform(index),
                transitionTimingFunction: 'cubic-bezier(0, 0.55, 0.45, 1)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Right Tunnel */}
      <div className="flex items-center relative overflow-hidden w-1/2">
        <div
          className="relative w-full flex items-center"
          style={{
            perspective: isCompact ? '780px' : '1210px',
            transformStyle: 'preserve-3d',
            perspectiveOrigin: 'left center',
          }}
        >
          {RIGHT_CARD_IMAGES.map((src, index) => (
            <img
              key={`right-${index}`}
              src={src}
              alt={`Keeper Collectible Right ${index + 1}`}
              loading="lazy"
              decoding="async"
              className="absolute w-[124px] h-[152px] sm:w-[190px] sm:h-[220px] md:w-[250px] md:h-[282px] object-cover rounded-md border border-mint-leaf/30 transition-transform duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)] bg-evergreen"
              style={{
                left: `-${stepRem}rem`,
                transform: getRightTransform(index),
                transitionTimingFunction: 'cubic-bezier(0, 0.55, 0.45, 1)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
