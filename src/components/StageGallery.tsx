import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Pause,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Music,
  Disc,
  ZoomIn,
  Sparkles,
  Heart,
} from 'lucide-react';
import { MemoryItem, MusicSource } from '../types/gift';
import { BirthdayAudioPlayer } from '../lib/audioEngine';
import { PolaroidArt } from './Artwork';
import { FloatingSparkles } from './FloatingSparkles';
import { FallingCelebrationOrnaments } from './FallingCelebrationOrnaments';

interface StageGalleryProps {
  memories: MemoryItem[];
  musicTitle: string;
  musicSource: MusicSource;
  musicUrl: string;
  onBack: () => void;
}

export function StageGallery({
  memories,
  musicTitle,
  musicSource,
  musicUrl,
  onBack,
}: StageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<BirthdayAudioPlayer | null>(null);

  useEffect(() => {
    playerRef.current = new BirthdayAudioPlayer();
    return () => {
      playerRef.current?.dispose();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSelectedIndex(null);
      } else if (e.key === 'ArrowRight' && selectedIndex !== null) {
        setSelectedIndex((prev) => ((prev! + 1) % memories.length));
      } else if (e.key === 'ArrowLeft' && selectedIndex !== null) {
        setSelectedIndex((prev) => (prev! === 0 ? memories.length - 1 : prev! - 1));
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, memories.length]);

  async function toggleMusic() {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.stop();
      setIsPlaying(false);
    } else {
      await playerRef.current.start(musicSource, musicUrl);
      setIsPlaying(true);
    }
  }

  function handleBack() {
    playerRef.current?.stop();
    setIsPlaying(false);
    onBack();
  }

  const selectedMemory = selectedIndex !== null ? memories[selectedIndex] : null;

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#4A080C] via-[#6B0F16] to-[#3B0609] text-[#FAF6EE] flex flex-col items-center justify-between p-5 sm:p-8 md:p-10 overflow-x-hidden">
      {/* Pernak-pernik perayaan jatuh melayang dari atas ke bawah */}
      <FallingCelebrationOrnaments count={36} />

      {/* Decorative ambient sparkles */}
      <FloatingSparkles count={26} variant="champagne" />

      {/* Top Header */}
      <header className="relative z-20 w-full max-w-5xl mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-white/10 backdrop-blur-md text-[#FAF6EE] text-xs sm:text-sm font-semibold hover:bg-white/20 transition-all shadow-md border border-white/15 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FAF6EE]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Menu</span>
        </button>

        <div className="inline-flex items-center gap-1.5 text-xs text-[#F5DFC0]/85 bg-white/10 px-3 py-1.5 rounded-full border border-white/15">
          <Music className="w-3.5 h-3.5 text-[#F6D574]" />
          <span>Kenangan &amp; Alunan Melodi</span>
        </div>
      </header>

      {/* Title Section */}
      <div className="relative z-20 text-center max-w-xl pt-4">
        <h1 className="font-display italic text-4xl sm:text-5xl md:text-6xl text-[#FAF6EE] mb-2 drop-shadow-sm">
          Memories &amp; Melody
        </h1>
        <p className="font-handwriting text-2xl text-[#F3DFC1]/90">
          Setiap potret mengabadikan cerita, diputar dengan alunan lagu indah ✨
        </p>
      </div>

      {/* Polaroid Grid */}
      <div className="relative z-20 w-full max-w-5xl mx-auto my-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-center justify-items-center">
        {memories.map((item, idx) => {
          const tiltClass = idx % 2 === 0 ? '-rotate-2' : 'rotate-2';
          return (
            <motion.button
              key={item.id}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ scale: 1.05, rotate: 0, y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-full max-w-[220px] bg-white text-[#241617] p-3 pb-6 rounded-md shadow-[0_15px_35px_rgba(0,0,0,0.4)] ${tiltClass} transition-all duration-300 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-[#F5DFC0] group border border-black/5`}
            >
              {/* Top Washi Tape decorative element */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-4 bg-[#F2DEC0]/70 backdrop-blur-xs rounded-xs border-y border-[#D6C2A4]/60 rotate-1 shadow-2xs pointer-events-none" />

              {/* Photo Area */}
              <div className="aspect-square w-full overflow-hidden bg-[#EFE7DA] mb-3 rounded-xs relative">
                <PolaroidArt
                  presetArt={item.presetArt}
                  imageData={item.imageData}
                  caption={item.caption}
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <ZoomIn className="w-6 h-6 text-white drop-shadow-md" />
                </div>
              </div>

              {/* Captions */}
              <p className="font-note text-xl font-bold text-[#7A1318] leading-tight truncate">
                {item.caption}
              </p>
              {item.dateLabel && (
                <p className="text-[11px] font-sans font-medium text-[#7C635B] mt-0.5 truncate flex items-center gap-1">
                  <span>📅</span>
                  <span>{item.dateLabel}</span>
                </p>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Deluxe Vintage Vinyl Turntable Player */}
      <div className="relative z-20 w-full max-w-xl bg-gradient-to-r from-[#3D0A0E] via-[#520C12] to-[#3D0A0E] border border-[#F5DFC0]/25 rounded-3xl p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
        {/* Vinyl Disc Container */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={toggleMusic}
            aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
            className="relative w-24 h-24 rounded-full cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#F5DFC0]"
          >
            {/* Spinning Vinyl Record with Grooves */}
            <div
              className={`w-24 h-24 rounded-full bg-[#120E0F] border-4 border-[#2E2426] flex items-center justify-center shadow-xl relative overflow-hidden ${
                isPlaying ? 'animate-vinyl-spin' : ''
              }`}
            >
              {/* Grooves concentric rings */}
              <div className="absolute inset-1 rounded-full border border-white/5" />
              <div className="absolute inset-2.5 rounded-full border border-white/5" />
              <div className="absolute inset-4 rounded-full border border-white/5" />
              <div className="absolute inset-6 rounded-full border border-white/5" />

              {/* Vinyl center red label */}
              <div className="w-10 h-10 rounded-full bg-[#9E1B22] border-2 border-[#D6A438] flex items-center justify-center shadow-inner">
                <div className="w-3 h-3 rounded-full bg-[#FAF6EE]" />
              </div>
            </div>

            {/* Tonearm */}
            <div
              className={`absolute -top-1 -right-2 w-10 h-2.5 bg-gradient-to-r from-[#D6A438] to-[#F7D37B] rounded-full origin-right transition-transform duration-500 shadow-md pointer-events-none ${
                isPlaying ? '-rotate-[32deg]' : '-rotate-[55deg]'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-white absolute left-0 top-0.5 shadow-xs" />
            </div>
          </button>
        </div>

        {/* Info & Soundwave Visualizer */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[#F3DFC1]/80 mb-0.5">
            <Disc className={`w-3.5 h-3.5 text-[#F6D574] ${isPlaying ? 'animate-spin' : ''}`} />
            <span>Soundtrack Ulang Tahun</span>
          </div>

          <h3 className="font-display italic text-xl sm:text-2xl text-[#FAF6EE] truncate">
            {musicTitle}
          </h3>

          {/* Soundwave Bars Animation when playing */}
          <div className="flex items-center justify-center sm:justify-start gap-1 mt-2.5 h-5">
            {isPlaying ? (
              <>
                {[40, 90, 60, 100, 75, 45, 85, 95, 55, 70].map((h, i) => (
                  <motion.span
                    key={i}
                    animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.4}%`] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6 + (i % 3) * 0.2,
                      ease: 'easeInOut',
                    }}
                    className="w-1 bg-[#F6D574] rounded-full"
                  />
                ))}
                <span className="text-xs text-[#F5DFC0] ml-2">Sedang Diputar...</span>
              </>
            ) : (
              <span className="text-xs text-[#F3DFC1]/70">
                Klik piringan hitam untuk memutar kotak musik 🎵
              </span>
            )}
          </div>
        </div>

        {/* Play / Pause Primary Button */}
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={isPlaying ? 'Jeda lagu' : 'Putar lagu'}
          className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#F6D574] to-[#E5B54A] text-[#55090E] flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-all shadow-[0_5px_15px_rgba(246,213,116,0.4)] cursor-pointer"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
        </button>
      </div>

      {/* Footer Info */}
      <footer className="relative z-20 text-center text-xs text-[#F3DFC1]/70 pt-4">
        <p className="font-note text-lg text-[#F3DFC1]/85">
          Klik foto polaroid mana pun untuk melihat kenangan ukuran penuh
        </p>
      </footer>

      {/* Lightbox Modal with Next / Prev Controls */}
      <AnimatePresence>
        {selectedMemory && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          >
            {/* Prev Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev! === 0 ? memories.length - 1 : prev! - 1));
              }}
              aria-label="Foto sebelumnya"
              className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((prev) => (prev! + 1) % memories.length);
              }}
              aria-label="Foto selanjutnya"
              className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Modal Card */}
            <motion.div
              key={selectedMemory.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-white text-[#241617] p-4 sm:p-5 pb-7 rounded-lg shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Tutup foto"
                className="absolute -top-3.5 -right-3.5 w-9 h-9 rounded-full bg-[#7A1318] text-[#FAF6EE] shadow-lg flex items-center justify-center hover:bg-[#5E0E12] cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-square w-full overflow-hidden bg-[#EFE7DA] rounded-sm mb-4">
                <PolaroidArt
                  presetArt={selectedMemory.presetArt}
                  imageData={selectedMemory.imageData}
                  caption={selectedMemory.caption}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display italic text-2xl text-[#7A1318]">
                    {selectedMemory.caption}
                  </h2>
                  {selectedMemory.dateLabel && (
                    <p className="text-xs text-[#6B5455] mt-0.5">
                      📅 {selectedMemory.dateLabel}
                    </p>
                  )}
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAF4EB] text-[#7A1318] border border-[#7A1318]/20">
                  {selectedIndex + 1} / {memories.length}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
