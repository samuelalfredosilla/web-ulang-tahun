import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react';
import { BouquetIllustration } from './Artwork';
import { FloatingSparkles } from './FloatingSparkles';
import { FallingCelebrationOrnaments } from './FallingCelebrationOrnaments';

interface StageFlowerProps {
  compliments: string[];
  onBack: () => void;
}

export function StageFlower({ compliments, onBack }: StageFlowerProps) {
  const [bloomed, setBloomed] = useState(false);
  const [likedIndex, setLikedIndex] = useState<number | null>(null);

  const leftItems = compliments.filter((_, i) => i % 2 === 0);
  const rightItems = compliments.filter((_, i) => i % 2 === 1);

  // Floating petals animation generator
  const petals = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    left: `${(i * 100) / 16 + (Math.sin(i * 4) * 5)}%`,
    delay: (i * 0.4) % 3,
    duration: 4.5 + (i % 3) * 1.5,
    size: 14 + (i % 4) * 4,
    color: i % 2 === 0 ? '#F4B926' : '#E85D75',
  }));

  function handleComplimentClick(idx: number) {
    setLikedIndex(idx);
    window.setTimeout(() => setLikedIndex(null), 1000);
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#4A080C] via-[#6B0F16] to-[#3B0609] text-[#FAF6EE] flex flex-col items-center justify-between p-5 sm:p-8 md:p-10 overflow-hidden">
      {/* Pernak-pernik perayaan jatuh melayang dari atas ke bawah */}
      <FallingCelebrationOrnaments count={30} />

      {/* Decorative ambient sparkles */}
      <FloatingSparkles count={24} variant="champagne" />

      {/* Falling flower petals when bloomed */}
      <AnimatePresence>
        {bloomed && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {petals.map((petal) => (
              <motion.div
                key={petal.id}
                initial={{ y: -30, opacity: 0, rotate: 0 }}
                animate={{
                  y: '105vh',
                  opacity: [0, 0.85, 0.85, 0],
                  rotate: 360,
                  x: [0, 25, -25, 0],
                }}
                transition={{
                  duration: petal.duration,
                  delay: petal.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  position: 'absolute',
                  left: petal.left,
                  width: `${petal.size}px`,
                  height: `${petal.size * 0.75}px`,
                  borderRadius: '60% 40% 60% 40% / 50% 60% 40% 50%',
                  backgroundColor: petal.color,
                  boxShadow: `0 0 10px ${petal.color}88`,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-white/10 backdrop-blur-md text-[#FAF6EE] text-xs sm:text-sm font-semibold hover:bg-white/20 transition-all shadow-md border border-white/15 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FAF6EE]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Menu</span>
        </button>

        <div className="inline-flex items-center gap-1.5 text-xs text-[#F5DFC0]/85 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
          <Sparkles className="w-3.5 h-3.5 text-[#F6D574]" />
          <span>Bunga Kasih Sayang</span>
        </div>
      </header>

      {/* Title Section */}
      <div className="relative z-20 text-center max-w-xl pt-4">
        <h1 className="font-display italic text-4xl sm:text-5xl md:text-6xl text-[#FAF6EE] mb-2 drop-shadow-sm">
          A Bouquet for You
        </h1>
        <p className="font-handwriting text-2xl text-[#F3DFC1]/90">
          {bloomed
            ? 'Setiap kelopak bunga menyimpan pujian tulus tentang dirimu ✨'
            : 'Sentuh buket bunga di bawah ini untuk melihat pesan spesial...'}
        </p>
      </div>

      {/* Interactive Bouquet & Compliments Grid */}
      <div className="relative z-20 w-full max-w-5xl my-auto py-6 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-8">
        {/* Left Column Affirmations (Desktop) */}
        <div className="hidden md:flex flex-col items-end gap-5">
          <AnimatePresence>
            {bloomed &&
              leftItems.map((text, idx) => (
                <motion.div
                  key={`l-${idx}-${text}`}
                  initial={{ opacity: 0, x: 30, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05, x: -4 }}
                  onClick={() => handleComplimentClick(idx * 2)}
                  className="relative group max-w-[260px] bg-gradient-to-r from-[#FAF6EE] to-[#F5ECE0] text-[#7A1318] rounded-2xl px-5 py-4 shadow-[0_15px_30px_rgba(0,0,0,0.3)] border border-[#E8DCCB] font-display italic text-lg text-right cursor-pointer select-none"
                >
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <span className="text-[11px] font-sans font-semibold tracking-wide text-[#8E5E36] uppercase">
                      Pujian #{idx * 2 + 1}
                    </span>
                    <Heart className="w-3.5 h-3.5 fill-[#7A1318] text-[#7A1318]" />
                  </div>
                  <p className="font-bold leading-snug">{text}</p>
                  {likedIndex === idx * 2 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      className="absolute -top-3 left-3 text-xl"
                    >
                      💖
                    </motion.span>
                  )}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {/* Center Bouquet Button */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative group">
            {/* Ambient flower glow ring */}
            <div
              className={`absolute -inset-4 rounded-full bg-[#F4B926]/20 blur-xl transition-opacity duration-700 ${
                bloomed ? 'opacity-100 animate-pulse' : 'opacity-40 group-hover:opacity-80'
              }`}
            />

            <button
              type="button"
              onClick={() => setBloomed((prev) => !prev)}
              aria-pressed={bloomed}
              aria-label={bloomed ? 'Rapatkan bunga' : 'Mekarkan bunga dan baca pesan'}
              className="relative cursor-pointer rounded-3xl p-3 focus-visible:outline-2 focus-visible:outline-[#F5DFC0] transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              <BouquetIllustration bloomed={bloomed} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setBloomed((prev) => !prev)}
            className="mt-3 font-handwriting text-2xl sm:text-3xl text-[#F6D574] hover:text-[#FAF6EE] transition-colors cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{bloomed ? 'Klik buket untuk merapikan kembali' : 'Sentuh buket untuk memekarkan!'}</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {/* Right Column Affirmations (Desktop) */}
        <div className="hidden md:flex flex-col items-start gap-5">
          <AnimatePresence>
            {bloomed &&
              rightItems.map((text, idx) => (
                <motion.div
                  key={`r-${idx}-${text}`}
                  initial={{ opacity: 0, x: -30, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 + 0.05 }}
                  whileHover={{ scale: 1.05, x: 4 }}
                  onClick={() => handleComplimentClick(idx * 2 + 1)}
                  className="relative group max-w-[260px] bg-gradient-to-l from-[#FAF6EE] to-[#F5ECE0] text-[#7A1318] rounded-2xl px-5 py-4 shadow-[0_15px_30px_rgba(0,0,0,0.3)] border border-[#E8DCCB] font-display italic text-lg text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-3.5 h-3.5 fill-[#7A1318] text-[#7A1318]" />
                    <span className="text-[11px] font-sans font-semibold tracking-wide text-[#8E5E36] uppercase">
                      Pujian #{idx * 2 + 2}
                    </span>
                  </div>
                  <p className="font-bold leading-snug">{text}</p>
                  {likedIndex === idx * 2 + 1 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      className="absolute -top-3 right-3 text-xl"
                    >
                      💖
                    </motion.span>
                  )}
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {/* Mobile Affirmations Grid */}
        <AnimatePresence>
          {bloomed && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:hidden w-full px-2"
            >
              {compliments.map((text, idx) => (
                <div
                  key={`m-${idx}`}
                  className="bg-gradient-to-b from-[#FAF6EE] to-[#F5ECE0] text-[#7A1318] rounded-2xl p-4 shadow-lg border border-[#E8DCCB] font-display italic text-base text-center"
                >
                  <div className="flex items-center justify-center gap-1.5 text-xs text-[#8E5E36] font-sans font-semibold mb-1">
                    <Heart className="w-3 h-3 fill-[#7A1318] text-[#7A1318]" />
                    <span>Pujian #{idx + 1}</span>
                  </div>
                  <p className="font-bold">{text}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Quote */}
      <footer className="relative z-20 text-center text-xs text-[#F3DFC1]/75 pt-2">
        <p className="font-note text-lg text-[#F3DFC1]/90">
          "Bunga ini mekar abadi untuk selalu menyertai hari-harimu."
        </p>
      </footer>
    </div>
  );
}
