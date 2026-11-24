import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { sha256Hex } from './lib/crypto';
import { DEFAULT_GIFT, DEFAULT_PASSCODE } from './lib/defaultGift';
import { BirthdayGift, GiftStage } from './types/gift';
import { ErrorBoundary } from './components/ErrorBoundary';
import { StageLogin } from './components/StageLogin';
import { StageEnvelope } from './components/StageEnvelope';
import { StageMenu } from './components/StageMenu';
import { StageMessage } from './components/StageMessage';
import { StageFlower } from './components/StageFlower';
import { StageGallery } from './components/StageGallery';
import { CreatorStudioModal } from './components/CreatorStudioModal';

function BirthdayGiftApp() {
  const [gift, setGift] = useState<BirthdayGift>(() => {
    try {
      const saved = localStorage.getItem('local_birthday_gift');
      if (saved) {
        const parsed = JSON.parse(saved) as BirthdayGift;
        if (!parsed.musicUrl || parsed.musicUrl.startsWith('data:audio')) {
          parsed.musicUrl = '/music/lany-soft.mp3';
          parsed.musicTitle = 'LANY - Soft';
          parsed.musicSource = 'custom_url';
        }
        return parsed;
      }
    } catch {}
    return DEFAULT_GIFT;
  });
  const [loadingGift, setLoadingGift] = useState<boolean>(false);
  const [giftLoadError, setGiftLoadError] = useState<string | null>(null);

  // Simpan status panggung kado agar saat refresh tidak kembali ke halaman PIN!
  const [stage, setStage] = useState<GiftStage>(() => {
    try {
      const savedStage = sessionStorage.getItem('unlocked_gift_stage');
      if (
        savedStage &&
        ['envelope', 'menu', 'message', 'flower', 'gallery'].includes(savedStage)
      ) {
        return savedStage as GiftStage;
      }
    } catch {}
    return 'login';
  });

  const [studioOpen, setStudioOpen] = useState<boolean>(false);

  // Mode Creator/Admin: Hanya aktif jika ada parameter ?admin=true, ?creator=true, ?edit=true, atau #studio
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return (
      search.includes('admin=true') ||
      search.includes('creator=true') ||
      search.includes('edit=true') ||
      hash === '#studio' ||
      hash === '#admin'
    );
  });

  // Hotkey Rahasia Khusus Pemilik Web: Tekan Ctrl + Shift + K (atau Cmd + Shift + K) untuk buka Studio kapan saja!
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAdmin(true);
        setStudioOpen((prev) => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function changeStage(next: GiftStage) {
    setStage(next);
    try {
      if (next === 'login') {
        sessionStorage.removeItem('unlocked_gift_stage');
      } else {
        sessionStorage.setItem('unlocked_gift_stage', next);
      }
    } catch {}
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const giftId = params.get('gift');
    if (!giftId || !/^[a-zA-Z0-9_-]{2,64}$/.test(giftId)) {
      return;
    }

    // 1. Cek terlebih dahulu apakah kado ini tersimpan di localStorage browser
    try {
      const saved = localStorage.getItem('local_birthday_gift');
      if (saved) {
        const parsed = JSON.parse(saved) as BirthdayGift;
        if (parsed.id === giftId) {
          setGift(parsed);
          setGiftLoadError(null);
          return;
        }
      }
    } catch {}

    // 2. Jika bukan kado lokal, muat dari database cloud Firebase
    let cancelled = false;
    async function loadSharedGift(id: string) {
      setLoadingGift(true);
      setGiftLoadError(null);
      const docPath = `gifts/${id}`;
      try {
        const snap = await getDoc(doc(db, 'gifts', id));
        if (cancelled) return;
        if (snap.exists()) {
          setGift(snap.data() as BirthdayGift);
        } else {
          // Jika tidak ada di cloud, periksa apakah ada kado lokal sebagai fallback
          try {
            const saved = localStorage.getItem('local_birthday_gift');
            if (saved) {
              const parsed = JSON.parse(saved) as BirthdayGift;
              setGift(parsed);
              const cleanUrl = new URL(window.location.href);
              cleanUrl.searchParams.delete('gift');
              window.history.replaceState({}, '', cleanUrl.toString());
              setGiftLoadError(null);
              return;
            }
          } catch {}

          setGiftLoadError(
            'Tautan kado tidak ditemukan di database cloud Firebase, menampilkan kado bawaan.'
          );
        }
      } catch (error) {
        if (!cancelled) {
          try {
            const saved = localStorage.getItem('local_birthday_gift');
            if (saved) {
              setGift(JSON.parse(saved) as BirthdayGift);
              setGiftLoadError(null);
              return;
            }
          } catch {}
          handleFirestoreError(error, OperationType.GET, docPath);
        }
      } finally {
        if (!cancelled) {
          setLoadingGift(false);
        }
      }
    }

    void loadSharedGift(giftId);
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUnlock(inputPassword: string): Promise<boolean> {
    const trimmed = inputPassword.trim();
    if (gift.passcodeHash) {
      const digest = await sha256Hex(trimmed);
      if (digest === gift.passcodeHash) {
        changeStage('envelope');
        return true;
      }
      return false;
    }

    if (trimmed === DEFAULT_PASSCODE) {
      changeStage('envelope');
      return true;
    }
    return false;
  }

  function handleSelectPreviewGift(updated: BirthdayGift, isCloudSaved = false) {
    setGift(updated);
    try {
      localStorage.setItem('local_birthday_gift', JSON.stringify(updated));
    } catch {}

    const nextUrl = new URL(window.location.href);
    if (isCloudSaved && updated.id && updated.id !== DEFAULT_GIFT.id) {
      nextUrl.searchParams.set('gift', updated.id);
    } else {
      nextUrl.searchParams.delete('gift');
    }
    window.history.replaceState({}, '', nextUrl.toString());
  }

  return (
    <div className="min-h-screen bg-[#4D090E] text-[#FAF6EE] relative overflow-hidden">
      <AnimatePresence mode="wait">
        {stage === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StageLogin
              gift={gift}
              loadingGift={loadingGift}
              giftLoadError={giftLoadError}
              showStudioButton={isAdmin}
              onUnlock={handleUnlock}
              onOpenStudio={() => setStudioOpen(true)}
            />
          </motion.div>
        )}

        {stage === 'envelope' && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StageEnvelope
              title={gift.envelopeTitle}
              recipientName={gift.recipientName}
              onOpened={() => changeStage('menu')}
            />
          </motion.div>
        )}

        {stage === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StageMenu
              title={gift.menuTitle}
              recipientName={gift.recipientName}
              showStudioButton={isAdmin}
              onSelectStage={(next) => changeStage(next)}
              onLockGift={() => changeStage('login')}
              onOpenStudio={() => setStudioOpen(true)}
            />
          </motion.div>
        )}

        {stage === 'message' && (
          <motion.div
            key="message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StageMessage
              letterTitle={gift.letterTitle}
              letterBody={gift.letterBody}
              senderName={gift.senderName}
              messagePhotos={gift.messagePhotos}
              onBack={() => changeStage('menu')}
            />
          </motion.div>
        )}

        {stage === 'flower' && (
          <motion.div
            key="flower"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StageFlower
              compliments={gift.flowerCompliments}
              onBack={() => changeStage('menu')}
            />
          </motion.div>
        )}

        {stage === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <StageGallery
              memories={gift.memories}
              musicTitle={gift.musicTitle}
              musicSource={gift.musicSource}
              musicUrl={gift.musicUrl || ''}
              onBack={() => changeStage('menu')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <CreatorStudioModal
        open={studioOpen}
        activeGift={gift}
        onClose={() => setStudioOpen(false)}
        onSelectGiftForPreview={handleSelectPreviewGift}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BirthdayGiftApp />
    </ErrorBoundary>
  );
}