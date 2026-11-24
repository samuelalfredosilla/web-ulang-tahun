import React, { useState } from 'react';
import { PresetArt } from '../types/gift';

export function WaxSealEmblem({ className = 'w-14 h-14' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="waxGold" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FBE588" />
          <stop offset="55%" stopColor="#D6A438" />
          <stop offset="100%" stopColor="#9A6B16" />
        </radialGradient>
      </defs>
      <path
        d="M40 4 C46 5 51 3 56 7 C61 10 67 11 70 17 C74 22 76 28 75 35 C77 41 75 48 72 54 C70 60 66 65 60 69 C54 73 47 76 40 75 C33 76 26 73 20 69 C14 65 10 60 8 54 C5 48 3 41 5 35 C4 28 6 22 10 17 C13 11 19 10 24 7 C29 3 34 5 40 4 Z"
        fill="url(#waxGold)"
      />
      <circle cx="40" cy="40" r="24" fill="none" stroke="#85580E" strokeWidth="1.5" opacity="0.55" />
      <circle cx="40" cy="40" r="21" fill="none" stroke="#FFF2B8" strokeWidth="1" opacity="0.5" />
      <path
        d="M40 52 C40 52 27 43 27 34.5 C27 30.2 30.4 27 34.5 27 C37 27 39 28.4 40 30.2 C41 28.4 43 27 45.5 27 C49.6 27 53 30.2 53 34.5 C53 43 40 52 40 52 Z"
        fill="#8E5F10"
      />
      <path
        d="M40 50.5 C40 50.5 28.5 42.3 28.5 34.5 C28.5 31 31.2 28.5 34.5 28.5 C36.7 28.5 38.6 29.8 40 31.8 C41.4 29.8 43.3 28.5 45.5 28.5 C48.8 28.5 51.5 31 51.5 34.5 C51.5 42.3 40 50.5 40 50.5 Z"
        fill="#F6D574"
        opacity="0.45"
      />
    </svg>
  );
}

export function BouquetIllustration({ bloomed }: { bloomed: boolean }) {
  return (
    <svg
      viewBox="0 0 320 380"
      className={`w-64 sm:w-72 md:w-80 h-auto drop-shadow-[0_24px_40px_rgba(0,0,0,0.4)] transition-transform duration-500 ease-out ${
        bloomed ? 'scale-105' : 'hover:scale-[1.03]'
      }`}
      aria-hidden="true"
    >
      {/* Eucalyptus foliage */}
      <g fill="#4F6F52" stroke="#364E38" strokeWidth="1.2">
        <path d="M160 245 Q110 175 75 115" fill="none" stroke="#456348" strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="92" cy="145" rx="14" ry="8" transform="rotate(-35 92 145)" />
        <ellipse cx="75" cy="115" rx="13" ry="7.5" transform="rotate(-20 75 115)" />
        <ellipse cx="115" cy="175" rx="15" ry="8.5" transform="rotate(-40 115 175)" />
        <ellipse cx="102" cy="122" rx="13" ry="7.5" transform="rotate(15 102 122)" />

        <path d="M160 245 Q215 170 248 112" fill="none" stroke="#456348" strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="228" cy="142" rx="14" ry="8" transform="rotate(35 228 142)" />
        <ellipse cx="248" cy="112" rx="13" ry="7.5" transform="rotate(20 248 112)" />
        <ellipse cx="205" cy="175" rx="15" ry="8.5" transform="rotate(42 205 175)" />
        <ellipse cx="220" cy="118" rx="13" ry="7.5" transform="rotate(-15 220 118)" />
      </g>

      {/* Stems */}
      <g stroke="#3F5D42" strokeWidth="5" strokeLinecap="round">
        <line x1="160" y1="120" x2="160" y2="265" />
        <line x1="115" y1="155" x2="155" y2="265" />
        <line x1="205" y1="155" x2="165" y2="265" />
      </g>

      {/* Back paper wrapper */}
      <polygon points="88,185 232,185 182,340 138,340" fill="#DEC8A8" />
      <polygon points="88,185 160,165 232,185 190,215 130,215" fill="#EDE0C9" />

      {/* Left Sunflower */}
      <g transform="translate(108, 148) rotate(-14)">
        {Array.from({ length: 14 }).map((_, i) => (
          <ellipse
            key={`l-${i}`}
            cx="0"
            cy="-28"
            rx="7"
            ry="17"
            fill={i % 2 === 0 ? '#F4B926' : '#E59F14'}
            transform={`rotate(${(i * 360) / 14})`}
          />
        ))}
        <circle cx="0" cy="0" r="17" fill="#4A2B18" />
        <circle cx="0" cy="0" r="12" fill="#633A22" opacity="0.65" />
      </g>

      {/* Right Sunflower */}
      <g transform="translate(212, 152) rotate(14)">
        {Array.from({ length: 14 }).map((_, i) => (
          <ellipse
            key={`r-${i}`}
            cx="0"
            cy="-27"
            rx="6.8"
            ry="16.5"
            fill={i % 2 === 0 ? '#F4B926' : '#E59F14'}
            transform={`rotate(${(i * 360) / 14})`}
          />
        ))}
        <circle cx="0" cy="0" r="16.5" fill="#4A2B18" />
        <circle cx="0" cy="0" r="11.5" fill="#633A22" opacity="0.65" />
      </g>

      {/* Center Hero Sunflower */}
      <g transform="translate(160, 106)">
        {Array.from({ length: 16 }).map((_, i) => (
          <ellipse
            key={`c-${i}`}
            cx="0"
            cy="-36"
            rx="8.5"
            ry="22"
            fill={i % 2 === 0 ? '#F7C631' : '#EA9E16'}
            transform={`rotate(${(i * 360) / 16})`}
          />
        ))}
        <circle cx="0" cy="0" r="23" fill="#432514" />
        <circle cx="0" cy="0" r="17" fill="#5D351E" />
        <circle cx="-6" cy="-5" r="2.2" fill="#8C593B" />
        <circle cx="6" cy="-4" r="2" fill="#8C593B" />
        <circle cx="0" cy="6" r="2.2" fill="#8C593B" />
        <circle cx="-7" cy="4" r="1.8" fill="#8C593B" />
        <circle cx="7" cy="5" r="1.8" fill="#8C593B" />
      </g>

      {/* Crimson Garden Roses */}
      <g transform="translate(132, 178)">
        <circle cx="0" cy="0" r="18" fill="#9E1B22" />
        <path d="M-11 -4 C-6 -14 10 -12 12 0 C13 10 -4 14 -11 6" fill="#C42B33" />
        <path d="M-5 -2 C-2 -8 6 -6 6 1 C6 6 -3 7 -5 2" fill="#7A1117" />
      </g>
      <g transform="translate(188, 178)">
        <circle cx="0" cy="0" r="17" fill="#9E1B22" />
        <path d="M-10 -3 C-5 -12 9 -10 11 0 C12 9 -3 12 -10 5" fill="#C42B33" />
        <path d="M-4 -2 C-1 -7 5 -5 5 1 C5 5 -2 6 -4 2" fill="#7A1117" />
      </g>

      {/* Baby's breath accents */}
      <g fill="#FAF6EE">
        <circle cx="88" cy="182" r="4" />
        <circle cx="96" cy="174" r="3.5" />
        <circle cx="232" cy="182" r="4" />
        <circle cx="223" cy="173" r="3.5" />
        <circle cx="160" cy="162" r="4" />
        <circle cx="150" cy="156" r="3" />
        <circle cx="171" cy="157" r="3" />
      </g>

      {/* Front kraft wrap folds */}
      <polygon points="88,185 164,225 182,340 138,340" fill="#D4B892" />
      <polygon points="232,185 156,225 138,340 182,340" fill="#C7A77E" />
      <polygon points="138,340 182,340 174,365 146,365" fill="#B59369" />

      {/* Satin maroon ribbon */}
      <rect x="134" y="254" width="52" height="14" rx="4" fill="#8B151B" />
      <path d="M160 261 C140 245 124 252 128 265 C132 276 150 268 160 261 Z" fill="#A82028" />
      <path d="M160 261 C180 245 196 252 192 265 C188 276 170 268 160 261 Z" fill="#A82028" />
      <path d="M156 266 L142 304 L152 300 L160 270 Z" fill="#7A1117" />
      <path d="M164 266 L178 304 L168 300 L160 270 Z" fill="#7A1117" />
      <circle cx="160" cy="261" r="6" fill="#C62B34" />
    </svg>
  );
}

export function PolaroidArt({
  presetArt,
  imageData,
  caption,
}: {
  presetArt: PresetArt;
  imageData?: string;
  caption: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  if (imageData && !imgFailed) {
    return (
      <img
        src={imageData}
        alt={caption}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    );
  }

  switch (presetArt) {
    case 'cake':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
          <rect width="200" height="200" fill="#F4E7D3" />
          <circle cx="100" cy="86" r="56" fill="#EAD4B4" />
          {/* Cake plate */}
          <ellipse cx="100" cy="148" rx="58" ry="10" fill="#FAF6EE" />
          {/* Cake body */}
          <rect x="54" y="106" width="92" height="38" rx="8" fill="#8B151B" />
          {/* Frosting */}
          <path
            d="M54 114 Q65 126 76 114 Q88 126 100 114 Q112 126 124 114 Q136 126 146 114 L146 106 Q146 98 138 98 L62 98 Q54 98 54 106 Z"
            fill="#FAF6EE"
          />
          {/* Candles */}
          <rect x="78" y="72" width="6" height="26" rx="2" fill="#D6A438" />
          <rect x="97" y="66" width="6" height="32" rx="2" fill="#C42B33" />
          <rect x="116" y="72" width="6" height="26" rx="2" fill="#D6A438" />
          {/* Flames */}
          <path d="M81 58 Q86 66 81 70 Q76 66 81 58 Z" fill="#F7B731" />
          <path d="M100 50 Q106 59 100 64 Q94 59 100 50 Z" fill="#F7B731" />
          <path d="M119 58 Q124 66 119 70 Q114 66 119 58 Z" fill="#F7B731" />
        </svg>
      );

    case 'sunset':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
          <defs>
            <linearGradient id="sunsetSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D9725B" />
              <stop offset="60%" stopColor="#F0B67F" />
              <stop offset="100%" stopColor="#F5DFBB" />
            </linearGradient>
          </defs>
          <rect width="200" height="200" fill="url(#sunsetSky)" />
          <circle cx="100" cy="112" r="34" fill="#FFF3D6" opacity="0.9" />
          <path d="M0 135 Q45 112 95 130 Q145 108 200 132 L200 200 L0 200 Z" fill="#6E2328" />
          <path d="M0 155 Q70 138 135 154 Q170 144 200 156 L200 200 L0 200 Z" fill="#461418" />
          <path d="M40 72 Q52 67 64 72" fill="none" stroke="#6E2328" strokeWidth="2" strokeLinecap="round" />
          <path d="M58 62 Q68 58 78 62" fill="none" stroke="#6E2328" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );

    case 'coffee':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
          <rect width="200" height="200" fill="#E8DCCB" />
          <circle cx="100" cy="118" r="56" fill="#D5C2A8" />
          {/* Saucer */}
          <ellipse cx="100" cy="134" rx="50" ry="14" fill="#FAF6EE" />
          {/* Cup */}
          <path d="M66 96 L134 96 L126 130 Q124 138 100 138 Q76 138 74 130 Z" fill="#FAF6EE" />
          <path d="M133 102 Q150 102 150 114 Q150 125 130 125" fill="none" stroke="#FAF6EE" strokeWidth="6" />
          <ellipse cx="100" cy="96" rx="34" ry="8" fill="#6F4531" />
          {/* Latte heart */}
          <path d="M100 100 C100 100 92 96 92 93 C92 91 94 90 96 90 C98 90 99 91 100 92 C101 91 102 90 104 90 C106 90 108 91 108 93 C108 96 100 100 100 100 Z" fill="#EFE4D4" />
          {/* Steam */}
          <path d="M84 78 Q80 68 86 58" fill="none" stroke="#8B6B56" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
          <path d="M102 74 Q108 62 100 50" fill="none" stroke="#8B6B56" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
          <path d="M118 78 Q114 68 120 58" fill="none" stroke="#8B6B56" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
        </svg>
      );

    case 'stars':
    default:
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
          <rect width="200" height="200" fill="#2A1622" />
          <path d="M138 44 A26 26 0 1 0 162 82 A21 21 0 1 1 138 44 Z" fill="#F4D37B" />
          <circle cx="48" cy="48" r="2.5" fill="#FAF6EE" />
          <circle cx="78" cy="36" r="1.8" fill="#FAF6EE" opacity="0.8" />
          <circle cx="108" cy="64" r="2.2" fill="#F4D37B" />
          <circle cx="54" cy="96" r="1.8" fill="#FAF6EE" opacity="0.7" />
          <circle cx="164" cy="112" r="2.2" fill="#FAF6EE" />
          <path d="M86 88 L89 96 L97 99 L89 102 L86 110 L83 102 L75 99 L83 96 Z" fill="#F4D37B" />
          <path d="M0 156 Q55 138 115 152 Q160 142 200 156 L200 200 L0 200 Z" fill="#461822" />
          <path d="M0 172 Q75 162 150 174 Q180 168 200 174 L200 200 L0 200 Z" fill="#5D1C26" />
        </svg>
      );
  }
}

export function MenuCardIcon({ type }: { type: 'message' | 'flower' | 'gallery' }) {
  if (type === 'message') {
    return (
      <svg viewBox="0 0 64 64" className="w-14 h-14" aria-hidden="true">
        <rect x="8" y="16" width="48" height="34" rx="5" fill="#FAF6EE" stroke="#7A1318" strokeWidth="2.5" />
        <path d="M10 18 L32 36 L54 18" fill="none" stroke="#7A1318" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="32" cy="35" r="6" fill="#D6A438" />
      </svg>
    );
  }
  if (type === 'flower') {
    return (
      <svg viewBox="0 0 64 64" className="w-14 h-14" aria-hidden="true">
        <line x1="32" y1="28" x2="32" y2="54" stroke="#4F6F52" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="24" cy="43" rx="6" ry="3.5" transform="rotate(-30 24 43)" fill="#4F6F52" />
        <ellipse cx="40" cy="41" rx="6" ry="3.5" transform="rotate(30 40 41)" fill="#4F6F52" />
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="32"
            cy="14"
            rx="4"
            ry="8"
            fill="#F4B926"
            transform={`rotate(${i * 45} 32 24)`}
          />
        ))}
        <circle cx="32" cy="24" r="6.5" fill="#5D351E" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className="w-14 h-14" aria-hidden="true">
      <rect x="10" y="14" width="32" height="36" rx="3" fill="#FAF6EE" stroke="#7A1318" strokeWidth="2.2" transform="rotate(-8 26 32)" />
      <rect x="14" y="18" width="24" height="20" rx="1.5" fill="#EAD4B4" transform="rotate(-8 26 32)" />
      <circle cx="44" cy="40" r="13" fill="#231819" stroke="#D6A438" strokeWidth="1.5" />
      <circle cx="44" cy="40" r="4.5" fill="#9E1B22" />
      <circle cx="44" cy="40" r="1.5" fill="#FAF6EE" />
    </svg>
  );
}
