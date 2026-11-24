export type PresetArt = 'cake' | 'sunset' | 'coffee' | 'stars' | 'custom';

export type MusicSource = 'melody' | 'custom_url';

export type GiftStage = 'login' | 'envelope' | 'menu' | 'message' | 'flower' | 'gallery';

export interface MemoryItem {
  id: string;
  caption: string;
  dateLabel: string;
  presetArt: PresetArt;
  imageData: string;
}

export interface BirthdayGift {
  id: string;
  ownerId: string;
  recipientName: string;
  senderName: string;
  passcodeHash?: string;
  passcodeHint?: string;
  envelopeTitle: string;
  menuTitle: string;
  letterTitle: string;
  letterBody: string;
  
  // TAMBAHKAN BARIS INI:
  messagePhotos?: string[];

  flowerCompliments: string[];
  memories: MemoryItem[];
  musicTitle: string;
  musicSource: 'melody' | 'custom_url';
  musicUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}
