import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mail, Heart, Sparkles, X, ZoomIn } from 'lucide-react';
import { FloatingSparkles } from './FloatingSparkles';
import { FallingCelebrationOrnaments } from './FallingCelebrationOrnaments';
import { WaxSealEmblem } from './Artwork';

interface StageMessageProps {
  letterTitle: string;
  letterBody: string;
  senderName: string;
  messagePhotos?: string[];
  onBack: () => void;
}

export function StageMessage({
  letterTitle,
  letterBody,
  senderName,
  messagePhotos = [],
  onBack,
}: StageMessageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Fallback photos if messagePhotos are empty or missing
  const defaultPhotos = [
    '/images/photo1.jpeg',
    '/images/photo2.jpeg',
    '/images/photo3.jpeg',
    '/images/photo4.jpeg',
  ];

  const photos = [
    messagePhotos[0] || defaultPhotos[0],
    messagePhotos[1] || defaultPhotos[1],
    messagePhotos[2] || defaultPhotos[2],
    messagePhotos[3] || defaultPhotos[3],
  ];

  const paragraphs = letterBody
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#4A080C] via-[#6B0F16] to-[#3B0609] text-[#FAF6EE] overflow-x-hidden flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Pernak-pernik perayaan jatuh melayang dari atas ke bawah */}
      <FallingCelebrationOrnaments count={36} />

      {/* Decorative ambient sparkles */}
      <FloatingSparkles count={25} variant="champagne" />

      {/* Top Header / Back Button */}
      <header className="relative z-30 w-full max-w-6xl mx-auto flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-white/10 backdrop-blur-md text-[#FAF6EE] text-xs sm:text-sm font-semibold hover:bg-white/20 transition-all shadow-md border border-white/15 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FAF6EE]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Menu</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-[#F5DFC0]/80">
          <Heart className="w-3.5 h-3.5 fill-[#E5989B] text-[#E5989B]" />
          <span>Pesan Cinta &amp; Harapan</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-6 sm:py-8">
        {!isOpen ? (
          /* TAMPILAN 1: AMPLOP TERTUTUP YANG ELEGAN */
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center max-w-md w-full px-4"
          >
            <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/10 text-xs text-[#F5DFC0] mb-4 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-[#F6D574]" />
              <span>Surat Pribadi</span>
            </div>

            <h1 className="font-display italic text-4xl sm:text-5xl text-[#FAF6EE] mb-2 leading-tight">
              A Special Letter
            </h1>

            <p className="font-handwriting text-2xl text-[#F3DFC1] mb-8">
              Klik amplop di bawah untuk membuka suratmu...
            </p>

            {/* Amplop Interaktif */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsOpen(true)}
              aria-label="Klik untuk membuka surat ucapan"
              className="relative w-[300px] sm:w-[380px] h-[210px] sm:h-[240px] bg-gradient-to-b from-[#8B1A21] to-[#600C12] rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.5)] cursor-pointer overflow-hidden border border-white/20 group focus-visible:outline-2 focus-visible:outline-[#F5DFC0]"
            >
              {/* Outer Glow */}
              <div className="absolute -inset-2 bg-[#D6A438]/20 rounded-3xl blur-md opacity-50 group-hover:opacity-100 transition-opacity" />

              {/* Folds */}
              <div
                className="absolute inset-0 bg-[#9A1E26]"
                style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)' }}
              />
              <div
                className="absolute inset-0 bg-[#9A1E26]"
                style={{ clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)' }}
              />
              <div
                className="absolute inset-0 bg-[#A8242D]"
                style={{ clipPath: 'polygon(0 100%, 50% 45%, 100% 100%)' }}
              />
              <div
                className="absolute inset-0 bg-[#83141B] z-10 drop-shadow-md"
                style={{ clipPath: 'polygon(0 0, 50% 56%, 100% 0)' }}
              />

              {/* Wax Seal Center */}
              <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-transform group-hover:scale-110">
                <div className="relative">
                  <div className="absolute -inset-2 rounded-full bg-[#F6D574]/40 blur-sm animate-pulse" />
                  <WaxSealEmblem className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-md" />
                </div>
              </div>
            </motion.button>

            <p className="text-xs text-[#F5DFC0]/75 mt-6 flex items-center justify-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>Sentuh amplop untuk mengeluarkan surat &amp; foto kenangan</span>
            </p>
          </motion.div>
        ) : (
          /* TAMPILAN 2: SURAT TERBUKA & POLAROID RESPONSIF */
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
            {/* Mobile Polaroid Strip (Muncul di layar HP / Tablet agar foto tidak hilang!) */}
            <div className="lg:hidden w-full max-w-md mb-6 overflow-x-auto pb-2 custom-scrollbar">
              <div className="flex gap-3 px-2">
                {photos.map((src, idx) => (
                  <motion.button
                    key={idx}
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setSelectedPhoto(src)}
                    className="shrink-0 w-28 bg-white p-2 pb-4 rounded-md shadow-md text-left cursor-pointer group"
                  >
                    <div className="w-24 h-24 bg-[#EFE7DA] overflow-hidden rounded-xs relative">
                      <img src={src} alt={`Kenangan ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="font-note text-sm text-[#7A1318] mt-1 text-center truncate">
                      Momen #{idx + 1}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Desktop Layout dengan 3 Kolom (Kiri: Polaroid, Tengah: Surat, Kanan: Polaroid) */}
            <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-10">
              {/* === POLAROID SISI KIRI (Desktop) === */}
              <div className="hidden lg:flex flex-col gap-8 w-60 shrink-0 pt-4">
                {/* Foto Kiri 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -60, rotate: -20 }}
                  animate={{ opacity: 1, x: 0, rotate: -8, y: [0, -10, 0] }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.2 },
                    x: { duration: 0.6, delay: 0.2 },
                    rotate: { duration: 0.6, delay: 0.2 },
                    y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 },
                  }}
                  onClick={() => setSelectedPhoto(photos[0])}
                  className="bg-white p-3 pb-5 shadow-2xl rounded-sm cursor-pointer hover:scale-105 hover:rotate-0 transition-transform duration-300 group border border-black/5"
                >
                  <div className="w-full h-44 bg-[#EFE7DA] overflow-hidden rounded-xs relative">
                    <img src={photos[0]} alt="Foto Kenangan 1" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="font-note text-lg text-[#7A1318] text-center mt-2">
                    Kenangan Indah ✨
                  </p>
                </motion.div>

                {/* Foto Kiri 2 */}
                <motion.div
                  initial={{ opacity: 0, x: -60, rotate: 20 }}
                  animate={{ opacity: 1, x: 0, rotate: 6, y: [0, 10, 0] }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.4 },
                    x: { duration: 0.6, delay: 0.4 },
                    rotate: { duration: 0.6, delay: 0.4 },
                    y: { repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.8 },
                  }}
                  onClick={() => setSelectedPhoto(photos[1])}
                  className="bg-white p-3 pb-5 shadow-2xl rounded-sm cursor-pointer hover:scale-105 hover:rotate-0 transition-transform duration-300 group border border-black/5"
                >
                  <div className="w-full h-40 bg-[#EFE7DA] overflow-hidden rounded-xs relative">
                    <img src={photos[1]} alt="Foto Kenangan 2" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="font-note text-lg text-[#7A1318] text-center mt-2">
                    Senyum Manismu 🌸
                  </p>
                </motion.div>
              </div>

              {/* === TENGAH: KERTAS SURAT ELEGAN === */}
              <motion.article
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-xl bg-[#FAF6EE] text-[#352324] rounded-2xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-[#E5D7C3] paper-lines overflow-hidden"
              >
                {/* Decorative Vintage Corner Accents */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#7A1318]/25 rounded-tl-sm pointer-events-none" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#7A1318]/25 rounded-tr-sm pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#7A1318]/25 rounded-bl-sm pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#7A1318]/25 rounded-br-sm pointer-events-none" />

                {/* Letter Header */}
                <div className="text-center mb-6 border-b border-[#7A1318]/15 pb-4">
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#8B151B] font-semibold tracking-wider uppercase mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#D6A438]" />
                    <span>Birthday Greetings</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#D6A438]" />
                  </div>
                  <h2 className="font-display italic text-3xl sm:text-4xl text-[#7A1318]">
                    {letterTitle}
                  </h2>
                </div>

                {/* Letter Body Paragraphs */}
                <div className="space-y-4 text-sm sm:text-base leading-relaxed text-[#3B2527] max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
                  {paragraphs.map((para, index) => (
                    <p key={index} className="whitespace-pre-line font-serif text-[15px] sm:text-[16px] leading-7">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Letter Footer Signature */}
                <div className="mt-8 pt-5 border-t border-[#7A1318]/15 flex items-center justify-between gap-4">
                  <div>
                    <span className="block text-xs text-[#7A1318]/70">Salam hangat &amp; doa,</span>
                    <span className="font-handwriting text-3xl text-[#7A1318]">
                      With love, {senderName}
                    </span>
                  </div>

                  {/* Wax Seal Stamp */}
                  <div className="shrink-0 opacity-85">
                    <WaxSealEmblem className="w-12 h-12 drop-shadow-sm" />
                  </div>
                </div>
              </motion.article>

              {/* === POLAROID SISI KANAN (Desktop) === */}
              <div className="hidden lg:flex flex-col gap-8 w-60 shrink-0 pt-4">
                {/* Foto Kanan 1 */}
                <motion.div
                  initial={{ opacity: 0, x: 60, rotate: 20 }}
                  animate={{ opacity: 1, x: 0, rotate: 10, y: [0, -12, 0] }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.3 },
                    x: { duration: 0.6, delay: 0.3 },
                    rotate: { duration: 0.6, delay: 0.3 },
                    y: { repeat: Infinity, duration: 4.8, ease: 'easeInOut', delay: 0.7 },
                  }}
                  onClick={() => setSelectedPhoto(photos[2])}
                  className="bg-white p-3 pb-5 shadow-2xl rounded-sm cursor-pointer hover:scale-105 hover:rotate-0 transition-transform duration-300 group border border-black/5"
                >
                  <div className="w-full h-40 bg-[#EFE7DA] overflow-hidden rounded-xs relative">
                    <img src={photos[2]} alt="Foto Kenangan 3" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="font-note text-lg text-[#7A1318] text-center mt-2">
                    Hari Bahagia 💖
                  </p>
                </motion.div>

                {/* Foto Kanan 2 */}
                <motion.div
                  initial={{ opacity: 0, x: 60, rotate: -20 }}
                  animate={{ opacity: 1, x: 0, rotate: -6, y: [0, 12, 0] }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.5 },
                    x: { duration: 0.6, delay: 0.5 },
                    rotate: { duration: 0.6, delay: 0.5 },
                    y: { repeat: Infinity, duration: 4.2, ease: 'easeInOut', delay: 1.0 },
                  }}
                  onClick={() => setSelectedPhoto(photos[3])}
                  className="bg-white p-3 pb-5 shadow-2xl rounded-sm cursor-pointer hover:scale-105 hover:rotate-0 transition-transform duration-300 group border border-black/5"
                >
                  <div className="w-full h-44 bg-[#EFE7DA] overflow-hidden rounded-xs relative">
                    <img src={photos[3]} alt="Foto Kenangan 4" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="font-note text-lg text-[#7A1318] text-center mt-2">
                    Tumbuh Bersama ⭐
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Lightbox Modal saat klik foto */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-white p-3 pb-6 rounded-md shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Tutup foto"
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#7A1318] text-white flex items-center justify-center shadow-lg hover:bg-[#5E0E12] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-full aspect-square bg-[#EFE7DA] overflow-hidden rounded-xs mb-3">
                <img src={selectedPhoto} alt="Foto Kenangan Besar" className="w-full h-full object-contain bg-[#1A1A1A]" />
              </div>
              <p className="font-handwriting text-2xl text-[#7A1318] text-center">
                Momen Spesial yang Selalu Dikenang ✨
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
