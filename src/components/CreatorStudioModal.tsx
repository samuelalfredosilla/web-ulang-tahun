import React, { useEffect, useRef, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  Check,
  Copy,
  LogIn,
  LogOut,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
  Music,
  Play,
  Pause,
  Sparkles,
  Cloud,
  HardDrive,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { compressImageToDataUrl, readAudioFileAsDataUrl, sha256Hex } from '../lib/crypto';
import {
  DEFAULT_GIFT,
  DEFAULT_MEMORIES,
  DEFAULT_PASSCODE,
  sanitizeGiftForFirestore,
} from '../lib/defaultGift';
import { BirthdayGift, MemoryItem, PresetArt } from '../types/gift';

interface CreatorStudioModalProps {
  open: boolean;
  activeGift: BirthdayGift;
  onClose: () => void;
  onSelectGiftForPreview: (gift: BirthdayGift, isCloudSaved?: boolean) => void;
}

function createBlankDraft(uid: string): BirthdayGift {
  const randomSuffix = Math.random().toString(36).slice(2, 7);
  return {
    ...DEFAULT_GIFT,
    id: `kado-${randomSuffix}`,
    ownerId: uid || 'local-user',
    memories: DEFAULT_MEMORIES.map((m) => ({ ...m })),
    flowerCompliments: [...DEFAULT_GIFT.flowerCompliments],
    messagePhotos: [...(DEFAULT_GIFT.messagePhotos || [])],
  };
}

export function CreatorStudioModal({
  open,
  activeGift,
  onClose,
  onSelectGiftForPreview,
}: CreatorStudioModalProps) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authLoading, setAuthLoading] = useState(false);
  const [myGifts, setMyGifts] = useState<BirthdayGift[]>([]);
  const [loadingGifts, setLoadingGifts] = useState(false);

  const [draft, setDraft] = useState<BirthdayGift>(activeGift);
  const [isExistingDoc, setIsExistingDoc] = useState(false);
  const [newPasscode, setNewPasscode] = useState('');
  const [savingFirebase, setSavingFirebase] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Audio preview state
  const [audioPreviewing, setAudioPreviewing] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setDraft(activeGift);
  }, [activeGift, open]);

  useEffect(() => {
    if (!open || !user) return;
    void loadUserGifts(user.uid);
  }, [open, user]);

  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

  async function loadUserGifts(uid: string) {
    setLoadingGifts(true);
    setErrorMessage('');
    const path = 'gifts';
    try {
      const q = query(collection(db, path), where('ownerId', '==', uid));
      const snap = await getDocs(q);
      const list: BirthdayGift[] = snap.docs.map((d) => d.data() as BirthdayGift);
      setMyGifts(list);
      if (list.length > 0 && !isExistingDoc) {
        const currentMatch = list.find((g) => g.id === activeGift.id);
        if (currentMatch) {
          setDraft(currentMatch);
          setIsExistingDoc(true);
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    } finally {
      setLoadingGifts(false);
    }
  }

  async function handleSignIn() {
    setAuthLoading(true);
    setErrorMessage('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setDraft((prev) => ({
          ...prev,
          id:
            prev.id === DEFAULT_GIFT.id
              ? `kado-${Math.random().toString(36).slice(2, 7)}`
              : prev.id,
          ownerId: result.user.uid,
        }));
        setStatusMessage(`Berhasil masuk sebagai ${result.user.displayName || result.user.email}`);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Gagal masuk dengan Google.'
      );
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSignOut() {
    await signOut(auth);
    setMyGifts([]);
    setIsExistingDoc(false);
    setStatusMessage('Berhasil keluar dari akun Firebase.');
  }

  function handleStartNewGift() {
    const newDraft = createBlankDraft(user ? user.uid : 'local-user');
    setDraft(newDraft);
    setIsExistingDoc(false);
    setNewPasscode('');
    setStatusMessage('');
    setErrorMessage('');
  }

  function handleSelectGiftToEdit(gift: BirthdayGift) {
    setDraft(gift);
    setIsExistingDoc(true);
    setNewPasscode('');
    setStatusMessage('');
    setErrorMessage('');
  }

  // --- 1. SIMPAN LOKAL (LANGSUNG AKTIF TANPA HARUS LOGIN FIREBASE) ---
  async function handleSaveLocal() {
    const cleanedPin = newPasscode.replace(/\D/g, '');
    if (cleanedPin.length > 0 && cleanedPin.length !== 6) {
      setErrorMessage('PIN harus terdiri dari tepat 6 digit angka.');
      return;
    }

    setErrorMessage('');
    let passcodeHash = draft.passcodeHash;
    if (cleanedPin.length === 6) {
      passcodeHash = await sha256Hex(cleanedPin);
    }

    const updatedGift: BirthdayGift = {
      ...draft,
      passcodeHash: passcodeHash || draft.passcodeHash,
      passcodeHint: draft.passcodeHint || (cleanedPin ? `PIN yang kamu atur: ${cleanedPin}` : 'PIN: 123456'),
      messagePhotos: draft.messagePhotos || [],
    };

    setDraft(updatedGift);
    setNewPasscode('');
    onSelectGiftForPreview(updatedGift, false);
    setStatusMessage('Perubahan berhasil disimpan dan langsung diterapkan ke website!');
  }

  // --- 2. SIMPAN KE CLOUD FIREBASE (UNTUK DIBAGIKAN KE ORANG LAIN) ---
  async function handleSaveFirebase(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      setErrorMessage('Silakan Masuk dengan Google terlebih dahulu untuk menyimpan ke Firebase Cloud.');
      return;
    }

    const cleanedPin = newPasscode.replace(/\D/g, '');
    if (cleanedPin.length > 0 && cleanedPin.length !== 6) {
      setErrorMessage('PIN harus terdiri dari tepat 6 digit angka.');
      return;
    }

    setSavingFirebase(true);
    setStatusMessage('');
    setErrorMessage('');

    try {
      let passcodeHash = draft.passcodeHash;
      if (cleanedPin.length === 6) {
        passcodeHash = await sha256Hex(cleanedPin);
      } else if (!passcodeHash) {
        passcodeHash = await sha256Hex(DEFAULT_PASSCODE);
      }

      // Pastikan payload musik aman untuk Firebase (Firestore membatasi ukuran dokumen 1MB & url <= 500 karakter).
      // Jika user mengunggah base64 besar, kita gunakan file lokal yang sudah siap di /music/lany-soft.mp3
      let safeDraft = { ...draft };
      if (safeDraft.musicSource === 'custom_url') {
        if (!safeDraft.musicUrl || safeDraft.musicUrl.startsWith('data:audio')) {
          safeDraft.musicUrl = '/music/lany-soft.mp3';
          if (!safeDraft.musicTitle || safeDraft.musicTitle.includes('Melodi')) {
            safeDraft.musicTitle = 'LANY - Soft';
          }
        }
      }

      const cleanPayload = sanitizeGiftForFirestore(safeDraft, user.uid, passcodeHash);
      const ref = doc(db, 'gifts', cleanPayload.id);

      if (isExistingDoc) {
        await updateDoc(ref, {
          recipientName: cleanPayload.recipientName,
          senderName: cleanPayload.senderName,
          passcodeHash: cleanPayload.passcodeHash,
          passcodeHint: cleanPayload.passcodeHint,
          envelopeTitle: cleanPayload.envelopeTitle,
          menuTitle: cleanPayload.menuTitle,
          letterTitle: cleanPayload.letterTitle,
          letterBody: cleanPayload.letterBody,
          flowerCompliments: cleanPayload.flowerCompliments,
          memories: cleanPayload.memories,
          musicTitle: cleanPayload.musicTitle,
          musicSource: cleanPayload.musicSource,
          musicUrl: cleanPayload.musicUrl,
          messagePhotos: cleanPayload.messagePhotos,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(ref, {
          ...cleanPayload,
          messagePhotos: cleanPayload.messagePhotos,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setIsExistingDoc(true);
      }

      const updatedGift: BirthdayGift = { ...cleanPayload };
      setDraft(updatedGift);
      setNewPasscode('');
      setStatusMessage('Kado berhasil disimpan ke Firebase Cloud!');
      onSelectGiftForPreview(updatedGift, true);
      await loadUserGifts(user.uid);
    } catch (error) {
      handleFirestoreError(
        error,
        isExistingDoc ? OperationType.UPDATE : OperationType.CREATE,
        `gifts/${draft.id}`
      );
    } finally {
      setSavingFirebase(false);
    }
  }

  async function handleDeleteGift(giftId: string) {
    if (!user) return;
    const path = `gifts/${giftId}`;
    try {
      await deleteDoc(doc(db, 'gifts', giftId));
      setStatusMessage('Kado berhasil dihapus dari Firestore.');
      if (draft.id === giftId) {
        handleStartNewGift();
      }
      await loadUserGifts(user.uid);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  }

  function handleCopyShareLink(giftId: string) {
    const url = `${window.location.origin}${window.location.pathname}?gift=${encodeURIComponent(
      giftId
    )}`;
    void navigator.clipboard.writeText(url);
    setCopiedId(giftId);
    window.setTimeout(() => setCopiedId(null), 2500);
  }

  function updateDraft(field: keyof BirthdayGift, value: unknown) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function updateCompliment(index: number, text: string) {
    setDraft((prev) => {
      const next = [...prev.flowerCompliments];
      next[index] = text;
      return { ...prev, flowerCompliments: next };
    });
  }

  function addCompliment() {
    if (draft.flowerCompliments.length >= 6) return;
    setDraft((prev) => ({
      ...prev,
      flowerCompliments: [...prev.flowerCompliments, 'Kamu sangat istimewa!'],
    }));
  }

  function removeCompliment(index: number) {
    if (draft.flowerCompliments.length <= 1) return;
    setDraft((prev) => ({
      ...prev,
      flowerCompliments: prev.flowerCompliments.filter((_, i) => i !== index),
    }));
  }

  function updateMemory(index: number, patch: Partial<MemoryItem>) {
    setDraft((prev) => {
      const next = [...prev.memories];
      next[index] = { ...next[index], ...patch };
      return { ...prev, memories: next };
    });
  }

  async function handleUploadMemoryPhoto(index: number, file?: File) {
    if (!file) return;
    try {
      const compressed = await compressImageToDataUrl(file);
      updateMemory(index, { presetArt: 'custom', imageData: compressed });
      setStatusMessage(`Foto kenangan #${index + 1} berhasil diunggah.`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Gagal memproses foto kenangan.'
      );
    }
  }

  function addMemory() {
    if (draft.memories.length >= 6) return;
    setDraft((prev) => ({
      ...prev,
      memories: [
        ...prev.memories,
        {
          id: `mem-${Date.now().toString(36)}`,
          caption: 'Kenangan Baru',
          dateLabel: 'Hari Spesial',
          presetArt: 'custom',
          imageData: '/images/photo1.jpeg',
        },
      ],
    }));
  }

  function removeMemory(index: number) {
    if (draft.memories.length <= 1) return;
    setDraft((prev) => ({
      ...prev,
      memories: prev.memories.filter((_, i) => i !== index),
    }));
  }

  // --- UPLOAD FOTO SURAT POLAROID ---
  async function handleUploadMessagePhoto(index: number, file?: File) {
    if (!file) return;
    try {
      const compressed = await compressImageToDataUrl(file);
      setDraft((prev) => {
        const nextPhotos = [...(prev.messagePhotos || [])];
        nextPhotos[index] = compressed;
        return { ...prev, messagePhotos: nextPhotos };
      });
      setStatusMessage(`Foto surat polaroid #${index + 1} berhasil diunggah.`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Gagal memproses foto surat.'
      );
    }
  }

  function handleRemoveMessagePhoto(index: number) {
    setDraft((prev) => {
      const nextPhotos = [...(prev.messagePhotos || [])];
      nextPhotos[index] = '';
      return { ...prev, messagePhotos: nextPhotos };
    });
  }

  // --- UPLOAD FILE MUSIK SENDIRI (MP3/WAV/M4A) ---
  async function handleUploadCustomAudio(file?: File) {
    if (!file) return;
    try {
      setStatusMessage('Sedang memproses file audio...');
      const audioData = await readAudioFileAsDataUrl(file);
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
      setDraft((prev) => ({
        ...prev,
        musicSource: 'custom_url',
        musicUrl: audioData,
        musicTitle: cleanTitle.slice(0, 80),
      }));
      setStatusMessage(`Lagu "${cleanTitle}" berhasil dipilih.`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Gagal memproses file audio.'
      );
    }
  }

  function togglePreviewAudio() {
    if (!draft.musicUrl) return;
    if (audioPreviewing) {
      previewAudioRef.current?.pause();
      setAudioPreviewing(false);
    } else {
      if (!previewAudioRef.current) {
        previewAudioRef.current = new Audio(draft.musicUrl);
        previewAudioRef.current.onended = () => setAudioPreviewing(false);
      } else {
        previewAudioRef.current.src = draft.musicUrl;
      }
      previewAudioRef.current
        .play()
        .then(() => setAudioPreviewing(true))
        .catch(() => {
          setAudioPreviewing(false);
          setErrorMessage('Gagal memutar audio pratinjau.');
        });
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="studio-title"
    >
      <div className="w-full max-w-4xl max-h-[92vh] bg-[#FAF6EE] text-[#241617] rounded-3xl shadow-2xl border border-[#7A1318]/20 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E5DAC8] flex items-center justify-between gap-4">
          <div>
            <h2 id="studio-title" className="font-display text-2xl text-[#7A1318] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D6A438]" />
              <span>Studio Kado Ulang Tahun</span>
            </h2>
            <p className="text-xs text-[#5C4546]">
              Atur pesan, foto kenangan, PIN, dan lagu kado ulang tahunmu.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Studio"
            className="w-9 h-9 rounded-full bg-[#FAF6EE] text-[#7A1318] hover:bg-[#EAE0D0] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar">
          {/* Status Bar: Firebase Connection vs Local Mode */}
          <div className="bg-white rounded-2xl p-4 border border-[#E5DAC8] shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${user ? 'bg-green-500 animate-pulse' : 'bg-amber-400'}`} />
              <div>
                <p className="text-xs font-semibold text-[#241617]">
                  {user ? (
                    <span>Terhubung ke Firebase: <strong className="text-[#7A1318]">{user.displayName || user.email}</strong></span>
                  ) : (
                    <span>Mode Pengeditan Lokal (Tanpa Perlu Login)</span>
                  )}
                </p>
                <p className="text-[11px] text-[#7C635B]">
                  {user
                    ? 'Kado dapat disimpan ke Cloud dan tautan kado siap dibagikan ke orang lain.'
                    : 'Anda bisa langsung mengunggah foto dan lagu. Perubahan langsung aktif di laptop Anda.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={handleStartNewGift}
                    className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-[#FAF6EE] border border-[#7A1318]/25 text-xs font-semibold text-[#7A1318] hover:bg-[#EAE0D0] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Kado Baru</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-[#E5DAC8] text-xs font-medium text-[#7C635B] hover:text-[#7A1318] cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={authLoading}
                  className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-[#7A1318] text-[#FAF6EE] text-xs font-semibold hover:bg-[#5E0E12] transition-colors cursor-pointer shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#F6D574]" />
                  <span>{authLoading ? 'Menghubungkan...' : 'Masuk Google (Untuk Berbagi Link)'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Feedback Messages */}
          {statusMessage && (
            <div className="p-3.5 rounded-xl bg-[#EBF7EE] border border-[#2E7D32]/25 text-xs text-[#1E5624] flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0 text-[#2E7D32]" />
              <span>{statusMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-[#FDF2F2] border border-[#C42B33]/25 text-xs text-[#8B151B] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#C42B33]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* List of Saved Gifts in Cloud (If user is signed in) */}
          {user && myGifts.length > 0 && (
            <div className="bg-white rounded-2xl p-4 border border-[#E5DAC8] space-y-2">
              <p className="text-xs font-semibold text-[#5C4546]">
                Daftar Kado Cloud Tersimpan Milikmu ({myGifts.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {myGifts.map((item) => {
                  const selected = isExistingDoc && draft.id === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs transition-colors ${
                        selected
                          ? 'border-[#7A1318] bg-[#FAF6EE]'
                          : 'border-[#E5DAC8] bg-white hover:bg-[#FAF6EE]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSelectGiftToEdit(item)}
                        className="text-left flex-1 min-w-0 cursor-pointer"
                      >
                        <p className="font-semibold text-[#7A1318] truncate">
                          {item.envelopeTitle}
                        </p>
                        <p className="text-[11px] text-[#7C635B] truncate">
                          Untuk {item.recipientName}
                        </p>
                      </button>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyShareLink(item.id)}
                          className="p-1.5 rounded-md hover:bg-white text-[#7A1318]"
                          title="Salin Tautan Kado"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGift(item.id)}
                          className="p-1.5 rounded-md hover:bg-white text-[#C42B33]"
                          title="Hapus Kado"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EDIT FORM */}
          <form id="gift-editor-form" onSubmit={handleSaveFirebase} className="space-y-6">
            {/* 1. Recipient & Security */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5DAC8] space-y-4">
              <h3 className="font-display text-xl text-[#7A1318] flex items-center gap-2">
                <span>1. Informasi Dasar &amp; PIN Buka Kado</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[#5C4546]">Nama Penerima</span>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    value={draft.recipientName}
                    onChange={(e) => updateDraft('recipientName', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DFD5C5] text-sm focus:border-[#7A1318] outline-none"
                    placeholder="Nama teman spesial..."
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[#5C4546]">Nama Pengirim</span>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    value={draft.senderName}
                    onChange={(e) => updateDraft('senderName', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DFD5C5] text-sm focus:border-[#7A1318] outline-none"
                    placeholder="Namamu..."
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[#5C4546]">
                    Atur PIN Baru (6 Digit Angka, Kosongkan jika tetap)
                  </span>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    placeholder="Contoh: 123456"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DFD5C5] text-sm focus:border-[#7A1318] outline-none"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[#5C4546]">Petunjuk PIN</span>
                  <input
                    type="text"
                    maxLength={120}
                    value={draft.passcodeHint || ''}
                    onChange={(e) => updateDraft('passcodeHint', e.target.value)}
                    placeholder="Petunjuk untuk penerima..."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DFD5C5] text-sm focus:border-[#7A1318] outline-none"
                  />
                </label>
              </div>
            </div>

            {/* 2. Letter & Polaroid Photos */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5DAC8] space-y-4">
              <h3 className="font-display text-xl text-[#7A1318]">
                2. Surat Ucapan &amp; Foto Polaroid Surat
              </h3>
              <div className="space-y-4">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[#5C4546]">Judul Surat</span>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    value={draft.letterTitle}
                    onChange={(e) => updateDraft('letterTitle', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DFD5C5] text-sm focus:border-[#7A1318] outline-none"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[#5C4546]">Isi Pesan Surat</span>
                  <textarea
                    required
                    rows={6}
                    maxLength={3000}
                    value={draft.letterBody}
                    onChange={(e) => updateDraft('letterBody', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DFD5C5] text-sm leading-relaxed focus:border-[#7A1318] outline-none"
                  />
                </label>

                {/* Upload Foto Polaroid Surat (4 Slot) */}
                <div className="pt-2 border-t border-[#EFE7DA]">
                  <h4 className="font-semibold text-[#7A1318] text-sm mb-1">
                    Foto Polaroid Surat (4 Slot Foto)
                  </h4>
                  <p className="text-xs text-[#5C4546] mb-3">
                    Unggah foto dari komputermu. Foto akan dikompresi otomatis agar ukuran aman dan ringan.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: 'Foto Polaroid 1', idx: 0 },
                      { label: 'Foto Polaroid 2', idx: 1 },
                      { label: 'Foto Polaroid 3', idx: 2 },
                      { label: 'Foto Polaroid 4', idx: 3 },
                    ].map((slot) => {
                      const currentPhoto = draft.messagePhotos?.[slot.idx];
                      return (
                        <div key={slot.idx} className="p-3 bg-[#FAF6EE] rounded-xl border border-[#E5DAC8] flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white border border-[#DFD5C5] shrink-0 relative">
                              {currentPhoto ? (
                                <img src={currentPhoto} alt={slot.label} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-[#A0887A]">
                                  Kosong
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[#7A1318]">{slot.label}</p>
                              <p className="text-[10px] text-[#7C635B]">
                                {currentPhoto ? 'Foto terpasang' : 'Belum ada foto'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {currentPhoto && (
                              <button
                                type="button"
                                onClick={() => handleRemoveMessagePhoto(slot.idx)}
                                className="p-1.5 rounded-lg bg-white text-[#C42B33] border border-[#C42B33]/25 hover:bg-red-50 cursor-pointer"
                                title="Hapus Foto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <label className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white border border-[#7A1318]/25 text-xs font-medium text-[#7A1318] hover:bg-white cursor-pointer shadow-xs">
                              <Upload className="w-3.5 h-3.5" />
                              <span>Pilih File</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => void handleUploadMessagePhoto(slot.idx, e.target.files?.[0])}
                              />
                            </label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Flower Compliments */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5DAC8] space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-xl text-[#7A1318]">
                  3. Pesan Kelopak Bunga ({draft.flowerCompliments.length}/6)
                </h3>
                {draft.flowerCompliments.length < 6 && (
                  <button
                    type="button"
                    onClick={addCompliment}
                    className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl border border-[#7A1318]/25 text-xs font-semibold text-[#7A1318] hover:bg-[#FAF6EE] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Pesan</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {draft.flowerCompliments.map((text, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      maxLength={120}
                      value={text}
                      onChange={(e) => updateCompliment(idx, e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl border border-[#DFD5C5] text-sm focus:border-[#7A1318] outline-none"
                    />
                    {draft.flowerCompliments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCompliment(idx)}
                        className="p-2 text-[#C42B33] hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Memories & Photos (Polaroid Gallery) */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5DAC8] space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-xl text-[#7A1318]">
                    4. Foto Kenangan Galeri Polaroid ({draft.memories.length}/6)
                  </h3>
                  <p className="text-xs text-[#5C4546]">
                    Foto ini akan tampil di bagian 'Gallery &amp; Music'. Anda bisa mengunggah foto sendiri dari perangkat.
                  </p>
                </div>
                {draft.memories.length < 6 && (
                  <button
                    type="button"
                    onClick={addMemory}
                    className="inline-flex items-center gap-1 py-1.5 px-3 rounded-xl border border-[#7A1318]/25 text-xs font-semibold text-[#7A1318] hover:bg-[#FAF6EE] cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Foto</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {draft.memories.map((mem, idx) => (
                  <div
                    key={mem.id}
                    className="p-4 bg-[#FAF6EE] rounded-2xl border border-[#E5DAC8] flex flex-col sm:flex-row items-center gap-4"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl bg-white border border-[#DFD5C5] overflow-hidden shrink-0 relative group">
                      {mem.imageData ? (
                        <img src={mem.imageData} alt={mem.caption} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#7C635B]">
                          {mem.presetArt}
                        </div>
                      )}
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="block space-y-1">
                        <span className="text-[11px] font-medium text-[#5C4546]">Keterangan Foto</span>
                        <input
                          type="text"
                          required
                          maxLength={120}
                          value={mem.caption}
                          onChange={(e) => updateMemory(idx, { caption: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#DFD5C5] bg-white text-xs"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[11px] font-medium text-[#5C4546]">Label Tanggal / Momen</span>
                        <input
                          type="text"
                          maxLength={40}
                          value={mem.dateLabel}
                          onChange={(e) => updateMemory(idx, { dateLabel: e.target.value })}
                          placeholder="Contoh: 17 November"
                          className="w-full px-3 py-1.5 rounded-lg border border-[#DFD5C5] bg-white text-xs"
                        />
                      </label>
                    </div>

                    {/* Action Upload */}
                    <div className="flex sm:flex-col items-center gap-2 shrink-0">
                      <label className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white border border-[#7A1318]/25 text-xs font-medium text-[#7A1318] hover:bg-white cursor-pointer shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Ganti Foto</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => void handleUploadMemoryPhoto(idx, e.target.files?.[0])}
                        />
                      </label>
                      {draft.memories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMemory(idx)}
                          className="p-1.5 text-[#C42B33] hover:bg-white rounded-lg cursor-pointer"
                          title="Hapus kenangan ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Music Section (Ganti Lagu Sendiri) */}
            <div className="bg-white rounded-2xl p-5 border border-[#E5DAC8] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-display text-xl text-[#7A1318] flex items-center gap-2">
                  <Music className="w-5 h-5 text-[#D6A438]" />
                  <span>5. Musik Piringan Hitam (Ganti Lagu Sendiri)</span>
                </h3>
                <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Kompatibel Firebase Cloud</span>
                </span>
              </div>

              {/* Preset Quick Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDraft((prev) => ({
                      ...prev,
                      musicSource: 'custom_url',
                      musicTitle: 'LANY - Soft',
                      musicUrl: '/music/lany-soft.mp3',
                    }));
                    setStatusMessage('Lagu LANY - Soft berhasil dipilih (/music/lany-soft.mp3)');
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    draft.musicUrl === '/music/lany-soft.mp3'
                      ? 'border-[#7A1318] bg-[#7A1318]/10 shadow-xs ring-1 ring-[#7A1318]'
                      : 'border-[#E5DAC8] bg-[#FAF6EE] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7A1318] flex items-center gap-1.5">
                      <Music className="w-4 h-4 text-[#D6A438]" />
                      <span>LANY - Soft</span>
                    </span>
                    {draft.musicUrl === '/music/lany-soft.mp3' && (
                      <Check className="w-4 h-4 text-[#7A1318]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#7C635B] mt-1">
                    Lagu pilihanmu yang sudah tersimpan di folder proyek (<code>/music/lany-soft.mp3</code>).
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDraft((prev) => ({
                      ...prev,
                      musicSource: 'melody',
                      musicTitle: 'Birthday Music Box (Waltz)',
                      musicUrl: '',
                    }));
                    setStatusMessage('Melodi bawaan kotak musik dipilih.');
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    draft.musicSource === 'melody'
                      ? 'border-[#7A1318] bg-[#7A1318]/10 shadow-xs ring-1 ring-[#7A1318]'
                      : 'border-[#E5DAC8] bg-[#FAF6EE] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#7A1318] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#D6A438]" />
                      <span>Melodi Kotak Musik</span>
                    </span>
                    {draft.musicSource === 'melody' && (
                      <Check className="w-4 h-4 text-[#7A1318]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#7C635B] mt-1">
                    Instrumen synthesizer waltz bawaan aplikasi (tanpa file eksternal).
                  </p>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[#5C4546]">Judul Lagu</span>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={draft.musicTitle}
                    onChange={(e) => updateDraft('musicTitle', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DFD5C5] text-sm focus:border-[#7A1318] outline-none"
                    placeholder="Judul lagu yang diputar..."
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[#5C4546]">Pilihan Sumber Musik</span>
                  <select
                    value={draft.musicSource}
                    onChange={(e) => updateDraft('musicSource', e.target.value as 'melody' | 'custom_url')}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#DFD5C5] bg-white text-sm focus:border-[#7A1318] outline-none cursor-pointer"
                  >
                    <option value="melody">Melodi Kotak Musik Bawaan (Waltz Synthesizer)</option>
                    <option value="custom_url">Lagu Sendiri (File MP3 dari Laptop / URL)</option>
                  </select>
                </label>
              </div>

              {/* Detail Sumber Audio Kustom */}
              {draft.musicSource === 'custom_url' && (
                <div className="p-4 bg-[#FAF6EE] rounded-2xl border border-[#E5DAC8] space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="inline-flex items-center gap-2 py-2 px-4 rounded-xl bg-[#7A1318] text-[#FAF6EE] text-xs font-semibold hover:bg-[#5E0E12] cursor-pointer shadow-sm">
                      <Upload className="w-4 h-4 text-[#F6D574]" />
                      <span>Pilih File Lagu dari Komputer</span>
                      <input
                        type="file"
                        accept="audio/*,.mp3,.wav,.ogg,.m4a"
                        className="hidden"
                        onChange={(e) => void handleUploadCustomAudio(e.target.files?.[0])}
                      />
                    </label>

                    {draft.musicUrl && (
                      <button
                        type="button"
                        onClick={togglePreviewAudio}
                        className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-white border border-[#7A1318]/30 text-xs font-semibold text-[#7A1318] hover:bg-[#FAF6EE] cursor-pointer"
                      >
                        {audioPreviewing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{audioPreviewing ? 'Jeda Pratinjau' : 'Coba Putar Lagu'}</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-2">
                    <label className="block space-y-1">
                      <span className="text-[11px] font-medium text-[#7C635B]">
                        Tautan URL Lagu / Jalur File:
                      </span>
                      <input
                        type="text"
                        value={draft.musicUrl || ''}
                        onChange={(e) => updateDraft('musicUrl', e.target.value)}
                        placeholder="Contoh: /music/lany-soft.mp3 atau https://.../lagu.mp3"
                        className="w-full px-3.5 py-1.5 rounded-lg border border-[#DFD5C5] bg-white text-xs font-mono"
                      />
                    </label>
                    <p className="text-[11px] text-[#8C736B] mt-1.5">
                      💡 <strong>Catatan Database Cloud Firebase:</strong> Firestore membatasi ukuran dokumen maksimal 1MB. Agar lagu kustom tersimpan ke Firebase dan bisa didengarkan saat link dibagikan, selalu gunakan jalur file lokal seperti <code>/music/lany-soft.mp3</code> (yang ditaruh di folder <code>public/music/</code>) atau tautan URL MP3 online.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-[#E5DAC8] flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-[#DFD5C5] text-xs sm:text-sm font-medium text-[#5C4546] hover:text-[#241617] cursor-pointer"
          >
            Tutup
          </button>

          <div className="flex items-center gap-3">
            {/* Tombol Simpan Lokal */}
            <button
              type="button"
              onClick={handleSaveLocal}
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-[#FAF6EE] border border-[#7A1318]/40 text-[#7A1318] text-xs sm:text-sm font-bold hover:bg-[#F2E8D8] transition-all cursor-pointer shadow-xs"
              title="Langsung terapkan di browser ini tanpa perlu akun Firebase"
            >
              <HardDrive className="w-4 h-4 text-[#D6A438]" />
              <span>Simpan &amp; Terapkan (Lokal)</span>
            </button>

            {/* Tombol Simpan ke Firebase Cloud */}
            <button
              type="submit"
              form="gift-editor-form"
              disabled={savingFirebase}
              className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#8B151B] to-[#600C12] text-[#FAF6EE] text-xs sm:text-sm font-semibold hover:from-[#731015] hover:to-[#4D090E] transition-all cursor-pointer shadow-md disabled:opacity-60"
            >
              <Cloud className="w-4 h-4 text-[#F6D574]" />
              <span>
                {savingFirebase
                  ? 'Menyimpan ke Cloud...'
                  : user
                  ? 'Simpan ke Firebase Cloud'
                  : 'Simpan ke Cloud (Masuk Google)'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
