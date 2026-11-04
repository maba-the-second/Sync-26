import { useRef, useCallback } from 'react';

interface TiltOptions {
  max?: number;
  perspective?: number;
  scale?: number;
  speed?: number;
}

interface ImageTiltProps {
  src: string;
  alt: string;
  className?: string;
  tiltOptions?: TiltOptions;
}

export function ImageTilt({
  src,
  alt,
  className = '',
  tiltOptions = {},
}: ImageTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const {
    max = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 400,
  } = tiltOptions;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = window.requestAnimationFrame(() => {
        const card = cardRef.current;
        if (!card) return;
        const cardRect = card.getBoundingClientRect();

        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;

        const mouseX = clientX - cardCenterX;
        const mouseY = clientY - cardCenterY;

        const rotateX = -((mouseY / cardRect.height) * max).toFixed(2);
        const rotateY = ((mouseX / cardRect.width) * max).toFixed(2);

        card.style.transform = `perspective(${perspective}px) scale3d(${scale},${scale},${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        rafRef.current = null;
      });
    },
    [max, perspective, scale]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(${perspective}px) scale3d(1,1,1) rotateX(0deg) rotateY(0deg)`;
    }
  }, [perspective]);

  return (
    <div
      ref={cardRef}
      className="pointer-events-auto relative w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`w-full h-full object-cover rounded-lg ${className}`}
        style={{
          transform: 'translateZ(20px)',
        }}
        draggable={false}
      />
    </div>
  );
}
