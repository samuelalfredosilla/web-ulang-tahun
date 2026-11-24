import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { FallingCelebrationOrnaments } from './FallingCelebrationOrnaments';

interface StageEnvelopeProps {
  title: string;
  recipientName: string;
  onOpened: () => void;
}

export function StageEnvelope({ title, recipientName, onOpened }: StageEnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  function handleOpen() {
    if (isOpening) return;
    setIsOpening(true);
    setShowConfetti(true);

    window.setTimeout(() => {
      onOpened();
    }, 2000);
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#3E070A] via-[#5C0C12] to-[#2E0407] text-[#FAF6EE] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
      {/* Pernak-pernik perayaan jatuh melayang */}
      <FallingCelebrationOrnaments count={30} />

      {/* Confetti Burst when envelope opens */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => {
              const colors = [
                '#F6D574',
                '#FAF6EE',
                '#FF7675',
                '#F39C12',
                '#F1C40F',
                '#E84393',
                '#E17055',
              ];
              const color = colors[i % colors.length];
              const randomX = (i * 31) % 100;
              const randomDuration = 1.3 + (i % 5) * 0.22;
              const randomDelay = (i % 6) * 0.04;
              return (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 1,
                    x: '50vw',
                    y: '50vh',
                    scale: 0.4,
                    rotate: 0,
                  }}
                  animate={{
                    opacity: [1, 1, 0],
                    x: `${randomX}vw`,
                    y: `${((i * 43) % 85) + 10}vh`,
                    scale: [0.4, 1.3, 0.7],
                    rotate: (i % 2 === 0 ? 1 : -1) * 450,
                  }}
                  transition={{
                    duration: randomDuration,
                    delay: randomDelay,
                    ease: 'easeOut',
                  }}
                  style={{
                    position: 'absolute',
                    width: i % 3 === 0 ? '12px' : '9px',
                    height: i % 3 === 0 ? '12px' : '15px',
                    borderRadius: i % 2 === 0 ? '50%' : '3px',
                    backgroundColor: color,
                    boxShadow: `0 0 10px ${color}`,
                  }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 text-center max-w-xl w-full flex flex-col items-center"
      >
        {/* Top greeting pill */}
        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-[#F7E7CE] mb-4 shadow-sm">
          <Heart className="w-3.5 h-3.5 fill-[#E5989B] text-[#E5989B]" />
          <span>Kado Spesial Untuk {recipientName}</span>
          <Sparkles className="w-3.5 h-3.5 text-[#F7D37B]" />
        </div>

        {/* Title */}
        <h1 className="font-display italic text-5xl sm:text-6xl md:text-7xl text-[#FAF6EE] mb-8 sm:mb-10 text-balance leading-tight drop-shadow-md">
          {title}
        </h1>

        {/* ================= REALISTIC LUXURY ENVELOPE ================= */}
        <div
          onClick={handleOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleOpen();
          }}
          aria-label="Sentuh segel lilin untuk membuka amplop kado"
          className="group relative block w-[320px] sm:w-[410px] h-[220px] sm:h-[265px] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-[#F5DFC0] select-none transition-transform duration-300 hover:scale-[1.02]"
        >
          {/* Outer Soft Candlelight Glow */}
          <div className="absolute -inset-6 rounded-3xl bg-[#D6A438]/20 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* 1. ENVELOPE BACK LINER SHELL */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#690D13] via-[#52080D] to-[#3B0407] border border-[#D4AF37]/35 shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_35px_rgba(212,175,55,0.18)] overflow-hidden">
            {/* Subtle inner parchment texture */}
            <div className="absolute inset-3 rounded-xl bg-[#2D0407]/40 border border-[#D4AF37]/15" />
          </div>

          {/* 2. RISING LETTER CARD (Hidden inside when closed, glides UP when opened) */}
          <motion.div
            initial={false}
            animate={
              isOpening
                ? { y: -100, opacity: 1, scale: 1.04 }
                : { y: 20, opacity: 0, scale: 0.96 }
            }
            transition={{
              duration: 0.85,
              delay: isOpening ? 0.28 : 0,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute left-6 right-6 top-4 bottom-5 rounded-xl bg-gradient-to-b from-[#FAF6EE] to-[#F3E9D9] border border-[#E2D5C0] shadow-xl flex flex-col items-center justify-center px-6 z-10 pointer-events-none overflow-hidden"
          >
            {/* Delicate Inner Gold Border */}
            <div className="absolute inset-1.5 rounded-lg border border-[#D4AF37]/35 pointer-events-none" />

            <span className="font-handwriting text-3xl sm:text-4xl text-[#7A1318] drop-shadow-2xs">
              For {recipientName}
            </span>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#7A1318]/40 to-transparent" />
              <Heart className="w-3.5 h-3.5 fill-[#7A1318] text-[#7A1318]" />
              <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#7A1318]/40 to-transparent" />
            </div>
            <p className="font-note text-lg text-[#6E4F42] mt-1 text-center">
              Membuka pesan manis untukmu di hari spesial ini ✨
            </p>
          </motion.div>

          {/* 3. ENVELOPE FRONT POCKET (Left, Right, and Bottom Folds) */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <svg
              viewBox="0 0 400 260"
              className="w-full h-full overflow-visible"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="pocketGrad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#7E1117" />
                  <stop offset="60%" stopColor="#630B10" />
                  <stop offset="100%" stopColor="#4A060A" />
                </linearGradient>
                <linearGradient id="sideGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6A0D12" />
                  <stop offset="100%" stopColor="#4F070B" />
                </linearGradient>
                <linearGradient id="pocketGold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFF2B2" />
                  <stop offset="40%" stopColor="#F6D574" />
                  <stop offset="70%" stopColor="#D4A232" />
                  <stop offset="100%" stopColor="#966C15" />
                </linearGradient>
              </defs>

              {/* Left Side Pocket Fold */}
              <path
                d="M 2,2 L 200,135 L 2,258 Z"
                fill="url(#sideGrad)"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.8"
              />

              {/* Right Side Pocket Fold */}
              <path
                d="M 398,2 L 200,135 L 398,258 Z"
                fill="url(#sideGrad)"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.8"
              />

              {/* Bottom Front Fold */}
              <path
                d="M 2,258 L 398,258 L 200,122 Z"
                fill="url(#pocketGrad)"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.8"
              />

              {/* Gold foil trim on Bottom V fold */}
              <path
                d="M 2,258 L 200,122 L 398,258"
                fill="none"
                stroke="url(#pocketGold)"
                strokeWidth="1.6"
                strokeOpacity="0.6"
              />
            </svg>
          </div>

          {/* 4. TOP FLAP (Folds DOWN when closed, Flips UPWARDS when opened) */}
          <motion.div
            initial={false}
            animate={
              isOpening
                ? { scaleY: -1, zIndex: 5, filter: 'drop-shadow(0 -8px 16px rgba(0,0,0,0.5))' }
                : { scaleY: 1, zIndex: 25, filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.55))' }
            }
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'top center' }}
            className="absolute inset-x-0 top-0 h-[155px] pointer-events-none"
          >
            <svg
              viewBox="0 0 400 155"
              className="w-full h-full overflow-visible"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="flapVelvetGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#96151D" />
                  <stop offset="60%" stopColor="#780F15" />
                  <stop offset="100%" stopColor="#5C0A0E" />
                </linearGradient>
                <linearGradient id="flapGoldTrim" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FFF2B2" />
                  <stop offset="35%" stopColor="#F6D574" />
                  <stop offset="70%" stopColor="#D4A232" />
                  <stop offset="100%" stopColor="#966C15" />
                </linearGradient>
              </defs>

              {/* Flap Triangle Body pointing down */}
              <path
                d="M 2,2 L 398,2 L 208,148 Q 200,155 192,148 Z"
                fill="url(#flapVelvetGrad)"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />

              {/* Deluxe Gold Foil Trim on Flap V-border */}
              <path
                d="M 2,2 L 192,148 Q 200,155 208,148 L 398,2"
                fill="none"
                stroke="url(#flapGoldTrim)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeOpacity="0.9"
              />
            </svg>
          </motion.div>

          {/* 5. LUXURY WAX SEAL (Embossed Melted Gold Medallion with Heart) */}
          <motion.div
            initial={false}
            animate={
              isOpening
                ? { opacity: 0, scale: 0.4, y: -20 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 z-30 transition-transform duration-300 group-hover:scale-110 pointer-events-none"
          >
            <div className="relative flex items-center justify-center">
              {/* Pulsing Golden Aura Glow */}
              <div className="absolute -inset-4 rounded-full bg-[#F6D574]/40 blur-lg animate-pulse-glow" />

              {/* Realistic Melted Wax Stamp SVG with self-contained gradients */}
              <svg
                viewBox="0 0 100 100"
                className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_10px_22px_rgba(0,0,0,0.65)]"
              >
                <defs>
                  <radialGradient id="sealGoldGrad" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FFFBE6" />
                    <stop offset="25%" stopColor="#F6D574" />
                    <stop offset="55%" stopColor="#D4A232" />
                    <stop offset="85%" stopColor="#966C15" />
                    <stop offset="100%" stopColor="#684706" />
                  </radialGradient>
                </defs>

                {/* Organic Natural Wax Rim */}
                <path
                  d="M50 5 C58 6 65 3 71 9 C78 14 84 15 87 23 C91 30 94 37 93 46 C95 54 93 63 88 70 C86 78 81 83 73 88 C66 93 57 96 48 95 C39 96 30 93 23 88 C15 83 11 78 9 70 C4 63 2 54 4 46 C3 37 6 30 11 23 C14 15 21 14 27 9 C33 3 41 6 50 5 Z"
                  fill="url(#sealGoldGrad)"
                  stroke="#7A4F0B"
                  strokeWidth="1.5"
                />

                {/* Concentric Stamped Ridges */}
                <circle cx="50" cy="50" r="31" fill="none" stroke="#7A4A06" strokeWidth="2.2" opacity="0.65" />
                <circle cx="50" cy="50" r="28" fill="none" stroke="#FFF2B8" strokeWidth="1.4" opacity="0.75" />

                {/* Embossed Heart in center with 3D Depth */}
                <path
                  d="M50 67 C50 67 33 54 33 43 C33 37 38 32 43 32 C47 32 49 34 50 36 C51 34 53 32 57 32 C62 32 67 37 67 43 C67 54 50 67 50 67 Z"
                  fill="#784706"
                />
                <path
                  d="M50 65 C50 65 35 52.5 35 43 C35 38.5 39 34.5 43 34.5 C46.5 34.5 48.5 36 50 38.5 C51.5 36 53.5 34.5 57 34.5 C61 34.5 65 38.5 65 43 C65 52.5 50 65 50 65 Z"
                  fill="#FBE27C"
                  opacity="0.85"
                />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Prompt Message Below Envelope */}
        <div className="mt-8 sm:mt-10 flex flex-col items-center gap-1.5">
          <p className="font-handwriting text-2xl sm:text-3xl text-[#F7E7CE] tracking-wide drop-shadow-xs">
            {isOpening ? 'Membuka amplop cintamu...' : 'Sentuh segel lilin emas untuk membuka'}
          </p>
          {!isOpening && (
            <motion.p
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="text-xs text-[#F5DFC0]/75 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F6D574]" />
              <span>Klik amplop untuk mengeluarkan surat kejutan</span>
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
}