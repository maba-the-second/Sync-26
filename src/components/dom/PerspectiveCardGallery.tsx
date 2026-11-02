import { useState, useEffect } from 'react';

interface PerspectiveCardGalleryProps {
  className?: string;
}

const LEFT_PERSPECTIVES = [
  { x: -10, z: -4 },
  { x: -20, z: -8 },
  { x: -30, z: -12 },
  { x: -40, z: -16 },
  { x: -50, z: -20 },
  { x: 10, z: -4 },
];

const RIGHT_PERSPECTIVES = [
  { x: 10, z: -4 },
  { x: 20, z: -8 },
  { x: 30, z: -12 },
  { x: 40, z: -16 },
  { x: 50, z: -20 },
  { x: -10, z: -4 },
];

const FALLBACK_IMAGES = [
  '/images/about-image.png',
  '/images/section4-image.png',
  '/images/trailer-side-media.webp',
  '/images/face-traits.webp',
  '/images/hero.webp',
  '/images/hero-2.webp',
];

export function PerspectiveCardGallery({ className = '' }: PerspectiveCardGalleryProps) {
  const [leftCounters, setLeftCounters] = useState([1, 2, 3, 4, 5, 6]);
  const [rightCounters, setRightCounters] = useState([1, 2, 3, 4, 5, 6]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLeftCounters((prev) => prev.map((c) => (c === 6 ? 1 : c + 1)));
      setRightCounters((prev) => prev.map((c) => (c === 6 ? 1 : c + 1)));
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const getLeftTransform = (index: number) => {
    const p = LEFT_PERSPECTIVES[leftCounters[index] - 1];
    return `translate3d(${p.x}rem, 0, ${p.z}rem)`;
  };

  const getRightTransform = (index: number) => {
    const p = RIGHT_PERSPECTIVES[rightCounters[index] - 1];
    return `translate3d(${p.x}rem, 0, ${p.z}rem)`;
  };

  return (
    <div className={`flex h-[350px] w-full ${className}`}>
      {/* Left Tunnel */}
      <div className="flex items-center relative overflow-hidden w-1/2">
        <div
          className="relative w-full flex items-center"
          style={{
            perspective: '740px',
            transformStyle: 'preserve-3d',
            perspectiveOrigin: 'right center',
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((num, index) => (
            <img
              key={`left-${num}`}
              src={`https://kprverse.com/images/compressed/webp/collection/card-left-0${num}.webp`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGES[index];
              }}
              alt={`Card Left ${num}`}
              className="absolute w-[250px] h-[282px] max-sm:w-48 max-sm:h-56 object-cover rounded-md border border-mint-leaf/30 transition-transform duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              style={{
                right: '-10rem',
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
            perspective: '1210px',
            transformStyle: 'preserve-3d',
            perspectiveOrigin: 'left center',
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((num, index) => (
            <img
              key={`right-${num}`}
              src={`https://kprverse.com/images/compressed/webp/collection/card-right-0${num}.webp`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGES[index];
              }}
              alt={`Card Right ${num}`}
              className="absolute w-[250px] h-[282px] max-sm:w-48 max-sm:h-56 object-cover rounded-md border border-mint-leaf/30 transition-transform duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              style={{
                left: '-10rem',
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
