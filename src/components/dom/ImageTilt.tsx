import { useState, useRef, useCallback } from 'react';

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
  const [transform, setTransform] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    max = 15,
    perspective = 1000,
    scale = 1.05,
    speed = 400,
  } = tiltOptions;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const card = cardRef.current;
      const cardRect = card.getBoundingClientRect();

      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;

      const mouseX = e.clientX - cardCenterX;
      const mouseY = e.clientY - cardCenterY;

      const rotateX = -((mouseY / cardRect.height) * max).toFixed(2);
      const rotateY = ((mouseX / cardRect.width) * max).toFixed(2);

      setTransform(
        `perspective(${perspective}px) scale3d(${scale},${scale},${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      );
    },
    [max, perspective, scale]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform(
      `perspective(${perspective}px) scale3d(1,1,1) rotateX(0deg) rotateY(0deg)`
    );
  }, [perspective]);

  return (
    <div
      ref={cardRef}
      className="pointer-events-auto relative w-full h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`,
      }}
    >
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover rounded-lg ${className}`}
        style={{
          transform: 'translateZ(20px)',
          willChange: 'transform',
        }}
        draggable={false}
      />
    </div>
  );
}
