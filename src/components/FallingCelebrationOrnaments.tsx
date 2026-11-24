import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface OrnamentItem {
  id: number;
  kind: 'emoji' | 'gold-diamond' | 'ribbon-flake' | 'sparkle-circle' | 'heart-shape';
  symbol?: string;
  left: number; // percentage 0 - 100
  size: number;
  duration: number; // seconds
  delay: number; // seconds
  swayDistance: number; // px
  color: string;
  rotation: number;
}

export function FallingCelebrationOrnaments({ count = 36 }: { count?: number }) {
  const ornaments = useMemo(() => {
    const emojis = ['✨', '💖', '🌸', '🎀', '⭐', '🎈', '💕', '🌷'];
    const colors = [
      '#F6D574', // Gold
      '#E5A93C', // Warm Gold
      '#FFB5C5', // Soft Rose Pink
      '#FAF6EE', // Champagne White
      '#E25B6E', // Ruby Crimson
      '#FFEAA7', // Pastel Yellow
    ];

    return Array.from({ length: count }, (_, i): OrnamentItem => {
      const typeIndex = i % 5;
      const left = (i * (100 / count) + (Math.sin(i * 3.7) * 4) + 100) % 98;
      const duration = 4.5 + (i % 5) * 1.2;
      const delay = (i * 0.28) % 4.5;
      const swayDistance = (i % 2 === 0 ? 1 : -1) * (18 + (i % 4) * 8);
      const color = colors[i % colors.length];

      if (typeIndex === 0) {
        return {
          id: i,
          kind: 'emoji',
          symbol: emojis[i % emojis.length],
          left,
          size: 16 + (i % 3) * 4,
          duration,
          delay,
          swayDistance,
          color,
          rotation: (i * 45) % 360,
        };
      }

      if (typeIndex === 1 || typeIndex === 2) {
        return {
          id: i,
          kind: 'ribbon-flake',
          left,
          size: 10 + (i % 3) * 4,
          duration,
          delay,
          swayDistance,
          color,
          rotation: (i * 60) % 360,
        };
      }

      if (typeIndex === 3) {
        return {
          id: i,
          kind: 'gold-diamond',
          left,
          size: 9 + (i % 3) * 3,
          duration,
          delay,
          swayDistance,
          color,
          rotation: 45,
        };
      }

      return {
        id: i,
        kind: 'sparkle-circle',
        left,
        size: 7 + (i % 4) * 3,
        duration,
        delay,
        swayDistance,
        color,
        rotation: 0,
      };
    });
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10">
      {ornaments.map((item) => (
        <motion.div
          key={item.id}
          initial={{
            y: '-5vh',
            x: 0,
            opacity: 0,
            rotate: 0,
          }}
          animate={{
            y: '105vh',
            x: [0, item.swayDistance, -item.swayDistance, 0],
            opacity: [0, 0.95, 0.95, 0.8, 0],
            rotate: item.rotation + 360,
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            left: `${item.left}%`,
            willChange: 'transform, opacity',
          }}
        >
          {item.kind === 'emoji' && (
            <span
              style={{
                fontSize: `${item.size}px`,
                filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))',
              }}
            >
              {item.symbol}
            </span>
          )}

          {item.kind === 'ribbon-flake' && (
            <div
              style={{
                width: `${item.size}px`,
                height: `${item.size * 0.55}px`,
                backgroundColor: item.color,
                borderRadius: '2px',
                boxShadow: `0 0 8px ${item.color}99`,
                transform: 'rotate(15deg)',
              }}
            />
          )}

          {item.kind === 'gold-diamond' && (
            <div
              style={{
                width: `${item.size}px`,
                height: `${item.size}px`,
                backgroundColor: item.color,
                borderRadius: '1.5px',
                transform: 'rotate(45deg)',
                boxShadow: `0 0 10px ${item.color}`,
              }}
            />
          )}

          {item.kind === 'sparkle-circle' && (
            <div
              style={{
                width: `${item.size}px`,
                height: `${item.size}px`,
                backgroundColor: item.color,
                borderRadius: '50%',
                boxShadow: `0 0 10px ${item.color}`,
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
