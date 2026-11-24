import React, { useMemo } from 'react';

interface FloatingSparklesProps {
  count?: number;
  variant?: 'gold' | 'champagne' | 'petals';
}

export function FloatingSparkles({ count = 24, variant = 'gold' }: FloatingSparklesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 100) / count + (Math.sin(i * 99) * 4)}%`,
      top: `${(i * 37) % 96}%`,
      size: 3 + (i % 5) * 2,
      duration: 3.5 + (i % 4) * 1.5,
      delay: (i * 0.4) % 4,
      opacity: 0.25 + (i % 4) * 0.18,
      rotation: (i * 45) % 360,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full animate-sparkle"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor:
              variant === 'petals'
                ? '#FAD4D8'
                : variant === 'champagne'
                ? '#F5E6C8'
                : '#F6D574',
            boxShadow:
              variant === 'petals'
                ? '0 0 10px rgba(244, 114, 182, 0.5)'
                : '0 0 10px rgba(245, 213, 116, 0.7)',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
