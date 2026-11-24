import { BirthdayGift, MemoryItem } from '../types/gift';

export const DEFAULT_PASSCODE = '123456';

export const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    caption: 'Senyum Terbaikmu',
    dateLabel: 'Momen Spesial',
    presetArt: 'custom',
    imageData: '/images/photo1.jpeg',
  },
  {
    id: 'mem-2',
    caption: 'Tawa & Keceriaan',
    dateLabel: 'Kenangan Manis',
    presetArt: 'custom',
    imageData: '/images/photo2.jpeg',
  },
  {
    id: 'mem-3',
    caption: 'Hari yang Bahagia',
    dateLabel: 'Momen Berharga',
    presetArt: 'custom',
    imageData: '/images/photo3.jpeg',
  },
  {
    id: 'mem-4',
    caption: 'Harapan Baru di Usia Baru',
    dateLabel: 'Tahun Penuh Berkah',
    presetArt: 'custom',
    imageData: '/images/photo4.jpeg',
  },
];

export const DEFAULT_GIFT: BirthdayGift = {
  id: 'default-birthday',
  ownerId: 'local-default',
  recipientName: 'Kamu yang Spesial',
  senderName: 'Seseorang yang Menghargaimu',
  passcodeHash: '',
  passcodeHint: 'Coba PIN bawaan: 123456',
  envelopeTitle: 'Happy Birthday!',
  menuTitle: 'These are for you',
  letterTitle: 'To: Kamu yang Spesial',
  letterBody:
    'Happy birthday! Wishing you a day filled with laughter, good vibes, and all the little things that make you genuinely happy. You deserve to feel appreciated and celebrated—not just today, but every day.\n\nSemoga di tahun ini, kamu selalu diberikan kesehatan, dilancarkan segala urusannya, rezeki yang berkah, dan dikelilingi orang-orang yang tulus menyayangimu. Tetaplah menjadi pribadi yang hangat dan luar biasa.\n\nI hope this little gift will make you smile! 💖',
  flowerCompliments: [
    'You are kind!',
    'You are strong!',
    'You are thoughtful!',
    'You are unique!',
  ],
  memories: DEFAULT_MEMORIES,
  musicTitle: 'LANY - Soft',
  musicSource: 'custom_url',
  musicUrl: '/music/lany-soft.mp3',
  messagePhotos: [
    '/images/photo1.jpeg',
    '/images/photo2.jpeg',
    '/images/photo3.jpeg',
    '/images/photo4.jpeg',
  ],
};

export function sanitizeGiftForFirestore(
  gift: BirthdayGift,
  ownerId: string,
  passcodeHash: string
): Omit<BirthdayGift, 'createdAt' | 'updatedAt'> {
  const cleanId = gift.id
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 64);

  const cleanCompliments = gift.flowerCompliments
    .map((text) => text.trim().slice(0, 120))
    .filter((text) => text.length > 0)
    .slice(0, 6);

  const safeCompliments =
    cleanCompliments.length > 0 ? cleanCompliments : ['You are appreciated!'];

  const cleanMemories = gift.memories
    .slice(0, 6)
    .map((item, idx) => ({
      id: (item.id || `mem-${idx + 1}`).replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 64),
      caption: (item.caption.trim() || `Kenangan ${idx + 1}`).slice(0, 120),
      dateLabel: item.dateLabel.trim().slice(0, 40),
      presetArt: item.presetArt,
      imageData: item.presetArt === 'custom' ? item.imageData.slice(0, 180000) : '',
    }));

  const safeMemories = cleanMemories.length > 0 ? cleanMemories : DEFAULT_MEMORIES.slice(0, 1);

  return {
    id: cleanId.length >= 2 ? cleanId : `gift-${Date.now()}`,
    ownerId: ownerId.slice(0, 128),
    recipientName: (gift.recipientName.trim() || 'Teman Spesial').slice(0, 80),
    senderName: (gift.senderName.trim() || 'Pengirim').slice(0, 80),
    passcodeHash,
    passcodeHint: (gift.passcodeHint || '').trim().slice(0, 120),
    envelopeTitle: (gift.envelopeTitle.trim() || 'Happy Birthday!').slice(0, 80),
    menuTitle: (gift.menuTitle.trim() || 'These are for you').slice(0, 80),
    letterTitle: (gift.letterTitle.trim() || 'To: You').slice(0, 80),
    letterBody: (gift.letterBody.trim() || 'Happy Birthday!').slice(0, 3000),
    flowerCompliments: safeCompliments,
    memories: safeMemories,
    musicTitle: (gift.musicTitle.trim() || 'Birthday Music Box').slice(0, 100),
    musicSource:
      gift.musicSource === 'custom_url' && (gift.musicUrl || '').trim()
        ? 'custom_url'
        : 'melody',
    musicUrl:
      gift.musicSource === 'custom_url'
        ? (gift.musicUrl || '').trim().slice(0, 500)
        : '',
    messagePhotos: (gift.messagePhotos || []).slice(0, 4),
  };
}
