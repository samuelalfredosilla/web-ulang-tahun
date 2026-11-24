import React from 'react';
import { motion } from 'motion/react';
import { Lock, Settings2, Sparkles, Heart, ChevronRight } from 'lucide-react';
import { GiftStage } from '../types/gift';
import { MenuCardIcon } from './Artwork';
import { FloatingSparkles } from './FloatingSparkles';
import { FallingCelebrationOrnaments } from './FallingCelebrationOrnaments';

interface StageMenuProps {
  title: string;
  recipientName: string;
  showStudioButton?: boolean;
  onSelectStage: (stage: GiftStage) => void;
  onLockGift: () => void;
  onOpenStudio: () => void;
}

export function StageMenu({
  title,
  recipientName,
  showStudioButton = false,
  onSelectStage,
  onLockGift,
  onOpenStudio,
}: StageMenuProps) {
  const items: {
    stage: GiftStage;
    type: 'message' | 'flower' | 'gallery';
    label: string;
    subtitle: string;
    badge: string;
    actionText: string;
  }[] = [
    {
      stage: 'message',
      type: 'message',
      label: 'Message',
      badge: 'Surat Tulus',
      subtitle: 'Surat ucapan dan doa penuh makna yang ditulis khusus untukmu.',
      actionText: 'Baca Surat',
    },
    {
      stage: 'flower',
      type: 'flower',
      label: 'Flower',
      badge: 'Buket Abadi',
      subtitle: 'Buket bunga virtual yang menyimpan pesan manis di tiap kelopak.',
      actionText: 'Buka Bunga',
    },
    {
      stage: 'gallery',
      type: 'gallery',
      label: 'Gallery & Music',
      badge: 'Kenangan & Lagu',
      subtitle: 'Album foto kenangan polaroid berputar ditemani musik waltz.',
      actionText: 'Lihat Kenangan',
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#4A080C] via-[#6B0F16] to-[#3B0609] text-[#FAF6EE] flex flex-col justify-between p-5 sm:p-8 md:p-10 overflow-hidden">
      {/* Pernak-pernik perayaan yang jatuh melayang dari atas ke bawah */}
      <FallingCelebrationOrnaments count={42} />

      {/* Decorative ambient sparkles */}
      <FloatingSparkles count={20} variant="champagne" />

      {/* Top Bar Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 fill-[#F5DFC0] text-[#F5DFC0]" />
          <span className="font-handwriting text-2xl sm:text-3xl text-[#F5DFC0] whitespace-nowrap">
            Untuk {recipientName}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {showStudioButton && (
            <button
              type="button"
              onClick={onOpenStudio}
              className="inline-flex items-center gap-1.5 sm:gap-2 py-2 px-3 sm:px-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-xs sm:text-sm font-medium text-[#FAF6EE] hover:bg-white/20 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#F5DFC0]"
            >
              <Settings2 className="w-3.5 h-3.5 text-[#F6D574]" />
              <span className="hidden sm:inline">Studio Kado</span>
              <span className="sm:hidden">Studio</span>
            </button>
          )}
          <button
            type="button"
            onClick={onLockGift}
            className="inline-flex items-center gap-1.5 sm:gap-2 py-2 px-3 sm:px-4 rounded-xl bg-[#FAF6EE] text-[#6B0F16] text-xs sm:text-sm font-semibold hover:bg-white hover:shadow-md transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[#FAF6EE]"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Kunci</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-5xl text-center"
        >
          {/* Header Badge */}
          <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-xs text-[#F5DFC0] mb-3">
            <Sparkles className="w-3 h-3 text-[#F6D574]" />
            <span>Kejutan Ulang Tahun Terpilih</span>
          </div>

          <h1 className="font-display italic text-4xl sm:text-5xl md:text-6xl text-[#FAF6EE] mb-3 text-balance drop-shadow-sm">
            {title}
          </h1>

          <p className="font-handwriting text-2xl text-[#F3DFC1]/90 mb-8 sm:mb-12 max-w-lg mx-auto">
            Sentuh salah satu kado di bawah ini untuk melihat isi kejutanmu ✨
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto px-2">
            {items.map((item, index) => (
              <motion.button
                key={item.stage}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectStage(item.stage)}
                className="group relative bg-gradient-to-b from-[#FAF6EE] via-[#FAF4EA] to-[#F2E8D8] text-[#241617] rounded-3xl p-7 sm:p-8 shadow-[0_20px_45px_rgba(0,0,0,0.35)] hover:shadow-[0_25px_55px_rgba(214,164,56,0.25)] border border-[#E8DCCB] hover:border-[#D6A438]/60 transition-all duration-300 flex flex-col items-center text-center cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5DFC0] overflow-hidden"
              >
                {/* Subtle top ribbon badge */}
                <div className="absolute top-4 right-4">
                  <span className="text-[11px] font-semibold py-1 px-2.5 rounded-full bg-[#7A1318]/10 text-[#7A1318] border border-[#7A1318]/15">
                    {item.badge}
                  </span>
                </div>

                {/* Animated Icon Circle */}
                <div className="w-24 h-24 rounded-2xl bg-[#EFE3CF] border border-[#DFD1BD] flex items-center justify-center mb-5 mt-2 group-hover:scale-108 group-hover:rotate-1 transition-transform duration-300 shadow-inner">
                  <MenuCardIcon type={item.type} />
                </div>

                {/* Card Title */}
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#7A1318] mb-2 group-hover:text-[#5E0E12] transition-colors">
                  {item.label}
                </h2>

                {/* Card Description */}
                <p className="text-xs sm:text-sm text-[#5C4546] leading-relaxed mb-6 line-clamp-3">
                  {item.subtitle}
                </p>

                {/* Bottom Action Pill */}
                <div className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-[#7A1318] group-hover:text-[#9A1E26] py-1.5 px-4 rounded-xl bg-white/70 border border-[#7A1318]/20 group-hover:bg-[#7A1318] group-hover:text-white transition-all shadow-xs">
                  <span>{item.actionText}</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-[#F3DFC1]/70 pt-4">
        <p className="font-note text-lg text-[#F3DFC1]/85">
          Sentuh kartu pilihanmu untuk melanjutkan perjalanan kado ini
        </p>
      </footer>
    </div>
  );
}
