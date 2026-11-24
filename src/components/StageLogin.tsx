import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Sparkles, AlertCircle, KeyRound, Heart, Gift } from 'lucide-react';
import { BirthdayGift } from '../types/gift';
import { WaxSealEmblem } from './Artwork';
import { FloatingSparkles } from './FloatingSparkles';

interface StageLoginProps {
  gift: BirthdayGift;
  loadingGift: boolean;
  giftLoadError: string | null;
  showStudioButton?: boolean;
  onUnlock: (pin: string) => Promise<boolean>;
  onOpenStudio: () => void;
}

const PIN_LENGTH = 6;

export function StageLogin({
  gift,
  loadingGift,
  giftLoadError,
  showStudioButton = false,
  onUnlock,
  onOpenStudio,
}: StageLoginProps) {
  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(''));
  const [showPin, setShowPin] = useState(false);
  const [checking, setChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Secret triple click trigger untuk pemilik web
  const secretClickCount = useRef(0);
  const secretClickTimer = useRef<number | null>(null);

  function handleSecretLogoClick() {
    secretClickCount.current += 1;
    if (secretClickCount.current >= 3) {
      secretClickCount.current = 0;
      onOpenStudio();
      return;
    }
    if (secretClickTimer.current) window.clearTimeout(secretClickTimer.current);
    secretClickTimer.current = window.setTimeout(() => {
      secretClickCount.current = 0;
    }, 1500);
  }

  const pinValue = digits.join('');

  async function submitPin(code: string) {
    if (code.length < PIN_LENGTH) {
      setErrorMsg('Masukkan 6 digit PIN terlebih dahulu ya.');
      setShakeKey((k) => k + 1);
      return;
    }
    setChecking(true);
    setErrorMsg('');
    try {
      const ok = await onUnlock(code);
      if (!ok) {
        setErrorMsg('PIN salah, silakan cek petunjuk atau coba lagi ya!');
        setDigits(Array(PIN_LENGTH).fill(''));
        setShakeKey((k) => k + 1);
        window.setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 50);
      }
    } finally {
      setChecking(false);
    }
  }

  function handleDigitChange(index: number, rawValue: string) {
    const cleaned = rawValue.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      if (errorMsg) setErrorMsg('');
      return;
    }

    if (cleaned.length > 1) {
      const next = [...digits];
      for (let i = 0; i < cleaned.length && index + i < PIN_LENGTH; i++) {
        next[index + i] = cleaned[i];
      }
      setDigits(next);
      if (errorMsg) setErrorMsg('');
      const focusIdx = Math.min(index + cleaned.length, PIN_LENGTH - 1);
      inputRefs.current[focusIdx]?.focus();
      return;
    }

    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);
    if (errorMsg) setErrorMsg('');

    if (index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (index === PIN_LENGTH - 1 && cleaned) {
      // Auto-submit when all 6 digits entered
      const finalCode = next.join('');
      if (finalCode.length === PIN_LENGTH) {
        void submitPin(finalCode);
      }
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        const next = [...digits];
        next[index - 1] = '';
        setDigits(next);
        inputRefs.current[index - 1]?.focus();
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, PIN_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(PIN_LENGTH).fill('');
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setDigits(next);
    if (errorMsg) setErrorMsg('');
    const focusIdx = Math.min(pasted.length, PIN_LENGTH - 1);
    inputRefs.current[focusIdx]?.focus();
    if (pasted.length === PIN_LENGTH) {
      void submitPin(pasted);
    }
  }

  // Ambil PIN 6 digit dari petunjuk jika dicantumkan, atau 123456 jika masih template bawaan
  const detectedPin =
    gift.passcodeHint?.match(/\b\d{6}\b/)?.[0] || (!gift.passcodeHash ? '123456' : null);

  function handleQuickFillPin() {
    if (!detectedPin) return;
    const pinDigits = detectedPin.split('');
    setDigits(pinDigits);
    setErrorMsg('');
    void submitPin(detectedPin);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    void submitPin(pinValue);
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#FAF6EE] via-[#F3ECE0] to-[#E9DFCE] text-[#241617] flex flex-col justify-between p-5 sm:p-8 md:p-10 overflow-hidden">
      {/* Decorative ambient sparkles */}
      <FloatingSparkles count={28} variant="gold" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div
          onClick={handleSecretLogoClick}
          className="flex items-center gap-2 cursor-pointer select-none"
          title="Kado Digital"
        >
          <div className="w-8 h-8 rounded-full bg-[#7A1318]/10 flex items-center justify-center text-[#7A1318]">
            <Gift className="w-4 h-4" />
          </div>
          <span className="font-display text-lg font-semibold tracking-wide text-[#7A1318]">
            Kado Digital
          </span>
        </div>

        {showStudioButton && (
          <button
            type="button"
            onClick={onOpenStudio}
            className="inline-flex items-center gap-2 py-2 px-3.5 sm:px-4 rounded-xl border border-[#7A1318]/20 bg-white/70 backdrop-blur-sm text-[#7A1318] text-xs sm:text-sm font-medium hover:bg-white hover:shadow-md transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#7A1318]"
          >
            <KeyRound className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
            <span>Kelola &amp; Sesuaikan Kado</span>
          </button>
        )}
      </header>

      {/* Center Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-8">
        <motion.div
          key={shakeKey}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={
            shakeKey > 0
              ? { opacity: 1, y: 0, scale: 1, x: [0, -10, 10, -7, 7, -3, 3, 0] }
              : { opacity: 1, y: 0, scale: 1 }
          }
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl p-7 sm:p-10 shadow-[0_25px_60px_rgba(107,15,22,0.15)] border border-[#E8DCCB] text-center"
        >
          {/* Top Wax Seal with animated aura */}
          <div className="flex justify-center -mt-2 mb-4">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 rounded-full bg-[#D6A438]/25 blur-lg animate-pulse" />
              <WaxSealEmblem className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md group-hover:scale-105 transition-transform" />
            </div>
          </div>

          {/* Recipient badge */}
          <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-[#FAF3E7] border border-[#E9DFCE] text-xs font-medium text-[#7A1318] mb-3 shadow-xs">
            <Heart className="w-3 h-3 fill-[#7A1318] text-[#7A1318]" />
            <span>Untuk {gift.recipientName}</span>
            <span className="text-[#A38B7D]">·</span>
            <span className="text-[#6E5548]">Dari {gift.senderName}</span>
          </div>

          <h1 className="font-display italic text-4xl sm:text-5xl text-[#7A1318] mb-2 text-balance leading-tight">
            Hello there!
          </h1>

          <p className="font-handwriting text-2xl text-[#8E5E36] mb-1">
            Ada kejutan manis untukmu...
          </p>

          <p className="text-xs sm:text-sm text-[#6C5556] leading-relaxed mb-6">
            Masukkan 6 digit PIN rahasia untuk membuka kado ulang tahun ini.
          </p>

          {loadingGift ? (
            <div className="py-6 text-sm text-[#7A1318] flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-[#D6A438]" />
              <span>Memuat kado dari server...</span>
            </div>
          ) : giftLoadError ? (
            <div className="mb-5 p-3 rounded-xl bg-[#FDF2F2] border border-[#C42B33]/25 text-xs text-[#8B151B] flex flex-col sm:flex-row items-center justify-between gap-2 text-left shadow-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#C42B33]" />
                <span>{giftLoadError}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const cleanUrl = new URL(window.location.href);
                  cleanUrl.searchParams.delete('gift');
                  window.history.replaceState({}, '', cleanUrl.toString());
                  window.location.reload();
                }}
                className="inline-flex items-center gap-1 font-semibold text-[#7A1318] underline hover:text-[#5E0E12] cursor-pointer whitespace-nowrap text-[11px]"
              >
                Gunakan Kado Lokal
              </button>
            </div>
          ) : null}

          {/* PIN Input Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                {digits.map((digit, index) => {
                  const isFilled = Boolean(digit);
                  return (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type={showPin ? 'text' : 'password'}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      aria-label={`Digit PIN ke-${index + 1}`}
                      className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-2xl font-bold tabular-nums rounded-2xl border transition-all duration-200 outline-none ${
                        isFilled
                          ? 'border-[#7A1318] bg-white text-[#7A1318] shadow-sm scale-102 ring-2 ring-[#7A1318]/15'
                          : 'border-[#E0D5C4] bg-[#FAF7F2] text-[#7A1318] focus:border-[#7A1318] focus:bg-white focus:ring-2 focus:ring-[#D6A438]/30'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Show / Hide Pin toggle */}
              <div className="mt-3.5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowPin((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#6C5556] hover:text-[#7A1318] py-1 px-2.5 rounded-lg hover:bg-[#FAF4EB] transition-colors cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPin ? 'Sembunyikan angka' : 'Tampilkan angka'}</span>
                </button>
              </div>
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                role="alert"
                className="flex items-center justify-center gap-2 text-xs font-semibold text-[#B41E25] bg-[#FDF2F2] py-2 px-3 rounded-xl border border-[#B41E25]/20"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={checking || loadingGift}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#8B151B] to-[#680C11] text-[#FAF6EE] text-sm sm:text-base font-semibold hover:from-[#731015] hover:to-[#55090E] shadow-[0_10px_25px_rgba(107,15,22,0.3)] hover:shadow-[0_14px_30px_rgba(107,15,22,0.4)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 transition-all inline-flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#7A1318]"
            >
              <Sparkles className="w-4 h-4 text-[#F7D37B]" />
              <span>{checking ? 'Membuka Kado...' : 'Buka Kado Spesial'}</span>
            </button>
          </form>

          {/* Passcode Hint or Quick Helper */}
          <div className="mt-6 pt-5 border-t border-[#F0E6D8] space-y-2">
            <button
              type="button"
              onClick={() => setShowHint((prev) => !prev)}
              className="text-xs font-medium text-[#7A1318]/80 hover:text-[#7A1318] underline underline-offset-4 cursor-pointer transition-colors"
            >
              {showHint ? 'Tutup petunjuk' : 'Lupa atau butuh petunjuk PIN?'}
            </button>

            {showHint && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-[#FAF5EB] rounded-xl border border-[#E9DFCE] text-xs text-[#5C4546] space-y-2"
              >
                <p>
                  {gift.passcodeHint ||
                    (gift.passcodeHash
                      ? 'Masukkan 6 digit PIN yang sudah ditentukan oleh pembuat kado.'
                      : 'Coba gunakan PIN bawaan: 123456')}
                </p>
                {detectedPin && (
                  <button
                    type="button"
                    onClick={handleQuickFillPin}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A1318] hover:underline cursor-pointer bg-white px-3 py-1 rounded-lg border border-[#7A1318]/20 shadow-xs"
                  >
                    <Sparkles className="w-3 h-3 text-[#D6A438]" />
                    <span>Isi Otomatis PIN ({detectedPin})</span>
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-xs text-[#7A1318]/70 pt-2">
        <p className="font-handwriting text-lg text-[#7A1318]/85">
          Dibuat dengan cinta &amp; kasih sayang ✨
        </p>
        <span className="text-[11px] opacity-75">
          Keepsake Ulang Tahun Interaktif · Tersimpan aman
        </span>
      </footer>
    </div>
  );
}
