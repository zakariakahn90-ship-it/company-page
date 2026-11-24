import React from 'react';
import { ShieldCheck } from 'lucide-react';

export interface AlIsrajLogoProps {
  variant?: 'full' | 'emblem' | 'header' | 'horizontal' | 'seal';
  theme?: 'dark' | 'light';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'header';
  className?: string;
  showAccreditation?: boolean;
}

export const AlIsrajLogo: React.FC<AlIsrajLogoProps> = ({
  variant = 'header',
  size = 'header',
  className = '',
  showAccreditation = true,
}) => {
  // Sizing definitions for circular seal
  const sealSizes = {
    xs: 'w-9 h-9',
    sm: 'w-11 h-11',
    header: 'w-12 h-12 sm:w-15 sm:h-15',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  // =========================================================================
  // STABLE OFFICIAL CIRCULAR SEAL MEDALLION (Symmetrical, Stable & High-Definition)
  // Perfectly balanced on both Left & Right sides
  // =========================================================================
  const OfficialSealSvg = (
    <svg
      viewBox="0 0 1000 1000"
      className="w-full h-full block select-none drop-shadow-md"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Al-Israj International Travels Official Seal"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
    >
      <defs>
        {/* Symmetrical Vertical Gold Gradient (Even on Left and Right) */}
        <linearGradient id="stableGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f7d878" />
          <stop offset="35%" stopColor="#d8a326" />
          <stop offset="70%" stopColor="#b47e12" />
          <stop offset="100%" stopColor="#e5b236" />
        </linearGradient>

        <linearGradient id="accentGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fdf098" />
          <stop offset="50%" stopColor="#dba728" />
          <stop offset="100%" stopColor="#b88014" />
        </linearGradient>

        {/* Symmetrical Vertical Emerald Green Gradient (No Lopsided Darkness on Right) */}
        <linearGradient id="stableGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#085438" />
          <stop offset="50%" stopColor="#06482f" />
          <stop offset="100%" stopColor="#053e28" />
        </linearGradient>

        {/* Clip Path to Constrain Mosque Graphics Inside Inner Circle */}
        <clipPath id="stableInnerClip">
          <circle cx="500" cy="500" r="316" />
        </clipPath>
      </defs>

      {/* ======================================================== */}
      {/* 1. OUTER RING FRAME & TRIPLE GOLD BORDERS (Symmetric)    */}
      {/* ======================================================== */}
      <circle cx="500" cy="500" r="490" fill="url(#stableGoldGrad)" />
      <circle cx="500" cy="500" r="478" fill="#ffffff" />
      <circle cx="500" cy="500" r="472" fill="url(#stableGoldGrad)" />
      {/* Stable, Solid Islamic Emerald Green Ring Band */}
      <circle cx="500" cy="500" r="466" fill="url(#stableGreenGrad)" />

      {/* Inner Medallion Triple Border (Gold & White) */}
      <circle cx="500" cy="500" r="332" fill="url(#stableGoldGrad)" />
      <circle cx="500" cy="500" r="324" fill="#ffffff" />
      <circle cx="500" cy="500" r="320" fill="url(#stableGoldGrad)" />
      {/* Inner Sanctuary Background (Warm Ivory Cream) */}
      <circle cx="500" cy="500" r="316" fill="#fdfbf6" />

      {/* ======================================================== */}
      {/* 2. INNER SANCTUARY GRAPHICS (Kaaba, Minarets, Crescent)   */}
      {/* ======================================================== */}
      <g clipPath="url(#stableInnerClip)">
        {/* Thin Gold Horizon Line */}
        <line x1="180" y1="435" x2="820" y2="435" stroke="#dba728" strokeWidth="2.5" opacity="0.85" />

        {/* 2A. UPPER SKY: GOLDEN CRESCENT & 5-POINTED STAR */}
        <g id="sky-crescent-star">
          {/* Golden Crescent Moon */}
          <path
            d="M 405,295
               C 405,355 455,405 515,405
               C 565,405 605,372 618,328
               C 596,350 562,364 526,364
               C 474,364 435,324 435,272
               C 435,244 447,218 466,200
               C 428,218 405,254 405,295 Z"
            fill="url(#accentGoldGrad)"
          />

          {/* Golden 5-Pointed Star */}
          <polygon
            points="548,242 556,268 582,268 561,284 569,310 548,294 527,310 535,284 514,268 540,268"
            fill="url(#accentGoldGrad)"
          />
        </g>

        {/* 2B. BACKGROUND MOSQUE COLONNADE (Balanced on Left & Right) */}
        <g id="mosque-colonnade" opacity="0.95">
          <rect x="230" y="695" width="540" height="70" fill="#f8f6ee" stroke="#d5c8a4" strokeWidth="1.5" />
          <rect x="230" y="690" width="540" height="7" fill="#dba728" />
          {/* Balanced Arches Left and Right */}
          <path
            d="M 240,765 V 725 A 12,12 0 0,1 264,725 V 765
               M 270,765 V 725 A 12,12 0 0,1 294,725 V 765
               M 300,765 V 725 A 12,12 0 0,1 324,725 V 765
               M 676,765 V 725 A 12,12 0 0,1 700,725 V 765
               M 706,765 V 725 A 12,12 0 0,1 730,725 V 765
               M 736,765 V 725 A 12,12 0 0,1 760,725 V 765"
            stroke="#c4a242"
            strokeWidth="2"
            fill="#eae3ce"
          />
        </g>

        {/* 2C. TWIN MAJESTIC MINARETS (Symmetrical: Left at 285, Right at 715) */}
        {/* Left Minaret (X Center = 285) */}
        <g id="left-minaret">
          <rect x="269" y="660" width="32" height="105" fill="#fdfcf8" stroke="#dba728" strokeWidth="2" />
          <rect x="263" y="652" width="44" height="8" fill="#dba728" />
          <polygon points="263,660 307,660 299,668 271,668" fill="#b47e12" />
          <rect x="273" y="585" width="24" height="67" fill="#ffffff" stroke="#dba728" strokeWidth="2" />
          <line x1="285" y1="585" x2="285" y2="652" stroke="#dba728" strokeWidth="1.5" />
          <rect x="265" y="577" width="40" height="8" fill="#dba728" />
          <rect x="275" y="525" width="20" height="52" fill="#ffffff" stroke="#dba728" strokeWidth="1.5" />
          <path d="M 273,525 C 273,502 285,482 285,470 C 285,482 297,502 297,525 Z" fill="#ffffff" stroke="#dba728" strokeWidth="2" />
          <line x1="285" y1="470" x2="285" y2="448" stroke="#dba728" strokeWidth="2.5" />
          <path d="M 283,452 A 4,4 0 1,1 287,458 A 3,3 0 1,0 283,452 Z" fill="#dba728" />
        </g>

        {/* Right Minaret (X Center = 715) */}
        <g id="right-minaret">
          <rect x="699" y="660" width="32" height="105" fill="#fdfcf8" stroke="#dba728" strokeWidth="2" />
          <rect x="693" y="652" width="44" height="8" fill="#dba728" />
          <polygon points="693,660 737,660 729,668 701,668" fill="#b47e12" />
          <rect x="703" y="585" width="24" height="67" fill="#ffffff" stroke="#dba728" strokeWidth="2" />
          <line x1="715" y1="585" x2="715" y2="652" stroke="#dba728" strokeWidth="1.5" />
          <rect x="695" y="577" width="40" height="8" fill="#dba728" />
          <rect x="705" y="525" width="20" height="52" fill="#ffffff" stroke="#dba728" strokeWidth="1.5" />
          <path d="M 703,525 C 703,502 715,482 715,470 C 715,482 727,502 727,525 Z" fill="#ffffff" stroke="#dba728" strokeWidth="2" />
          <line x1="715" y1="470" x2="715" y2="448" stroke="#dba728" strokeWidth="2.5" />
          <path d="M 713,452 A 4,4 0 1,1 717,458 A 3,3 0 1,0 713,452 Z" fill="#dba728" />
        </g>

        {/* 2D. THE HOLY KAABA (Centered and Symmetrical) */}
        <g id="holy-kaaba">
          {/* Kaaba Left Shadow Face */}
          <polygon points="348,535 500,470 500,805 348,795" fill="#141414" />
          {/* Kaaba Right Face */}
          <polygon points="500,470 652,535 652,795 500,805" fill="#080808" />
          {/* Kaaba Roof Plane */}
          <polygon points="348,535 500,470 652,535 500,474" fill="#f8f8f8" stroke="#ffffff" strokeWidth="1" />

          {/* Golden Kiswah Belt (Left & Right Balanced) */}
          <polygon points="348,570 500,535 500,600 348,625" fill="url(#accentGoldGrad)" />
          <polygon points="500,535 652,570 652,625 500,600" fill="url(#accentGoldGrad)" />

          {/* Kiswah Inscriptions Motifs */}
          <g fill="#080808" opacity="0.9">
            <rect x="515" y="556" width="10" height="22" rx="4" transform="skewY(12)" />
            <rect x="535" y="560" width="10" height="22" rx="4" transform="skewY(12)" />
            <rect x="555" y="564" width="10" height="22" rx="4" transform="skewY(12)" />
            <rect x="585" y="570" width="24" height="24" rx="3" transform="skewY(12)" />
            <rect x="620" y="577" width="18" height="22" rx="3" transform="skewY(12)" />
          </g>

          {/* Shadirwan Base */}
          <polygon points="344,795 500,805 656,795 658,810 500,820 342,810" fill="#f8f8f8" stroke="#dba728" strokeWidth="1.5" />

          {/* Bab al-Kaaba (Golden Door) */}
          <g id="bab-al-kaaba">
            <rect x="467" y="655" width="66" height="115" rx="3" fill="url(#accentGoldGrad)" stroke="#9c6d0c" strokeWidth="2" />
            <rect x="473" y="662" width="54" height="104" fill="#f5c842" stroke="#b47e12" strokeWidth="1.5" />
            <line x1="500" y1="662" x2="500" y2="766" stroke="#8a5a04" strokeWidth="2.5" />
            <rect x="477" y="670" width="20" height="42" fill="none" stroke="#9e6d08" strokeWidth="1.5" />
            <rect x="503" y="670" width="20" height="42" fill="none" stroke="#9e6d08" strokeWidth="1.5" />
            <rect x="477" y="718" width="20" height="42" fill="none" stroke="#9e6d08" strokeWidth="1.5" />
            <rect x="503" y="718" width="20" height="42" fill="none" stroke="#9e6d08" strokeWidth="1.5" />
            <circle cx="500" cy="722" r="5" fill="#8a5a04" />
          </g>

          {/* Golden Steps (Centered at X = 500) */}
          <g id="kaaba-steps" fill="url(#accentGoldGrad)" stroke="#8a5a04" strokeWidth="1.5">
            <rect x="461" y="770" width="78" height="7" />
            <rect x="457" y="777" width="86" height="7" />
            <rect x="453" y="784" width="94" height="7" />
            <rect x="449" y="791" width="102" height="7" />
          </g>
        </g>
      </g>

      {/* ======================================================== */}
      {/* 3. SYMMETRICAL GOLDEN SHIELD CRESTS (Left at 112, Right at 888) */}
      {/* ======================================================== */}
      {/* Left Golden Shield */}
      <g transform="translate(112, 500)">
        <path
          d="M 0 -34 L 30 -34 C 30 10, 15 32, 0 44 C -15 32, -30 10, -30 -34 Z"
          fill="url(#accentGoldGrad)"
          stroke="#b47e12"
          strokeWidth="3"
        />
        <path
          d="M 0 -26 L 22 -26 C 22 6, 11 23, 0 32 C -11 23, -22 6, -22 -26 Z"
          fill="#06482f"
          stroke="#dba728"
          strokeWidth="2"
        />
        <path
          d="M 0 -22 L 18 -22 C 18 4, 9 18, 0 25 C -9 18, -18 4, -18 -22 Z"
          fill="url(#accentGoldGrad)"
        />
      </g>

      {/* Right Golden Shield (Exact Symmetrical Match) */}
      <g transform="translate(888, 500)">
        <path
          d="M 0 -34 L 30 -34 C 30 10, 15 32, 0 44 C -15 32, -30 10, -30 -34 Z"
          fill="url(#accentGoldGrad)"
          stroke="#b47e12"
          strokeWidth="3"
        />
        <path
          d="M 0 -26 L 22 -26 C 22 6, 11 23, 0 32 C -11 23, -22 6, -22 -26 Z"
          fill="#06482f"
          stroke="#dba728"
          strokeWidth="2"
        />
        <path
          d="M 0 -22 L 18 -22 C 18 4, 9 18, 0 25 C -9 18, -18 4, -18 -22 Z"
          fill="url(#accentGoldGrad)"
        />
      </g>
    </svg>
  );

  // Standalone Seal View
  if (variant === 'seal' || variant === 'emblem') {
    return (
      <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
        <div className={sealSizes[size as keyof typeof sealSizes] || sealSizes.header}>
          {OfficialSealSvg}
        </div>
      </div>
    );
  }

  // =========================================================================
  // EXECUTIVE HEADER LOCKUP (Left Corner Production)
  // =========================================================================
  return (
    <div className={`flex items-center gap-3 sm:gap-3.5 select-none ${className}`}>
      {/* Official Circular Seal Medallion from logo.png */}
      <div className="relative shrink-0 flex items-center justify-center p-0.5 rounded-full bg-white shadow-xl shadow-black/35 ring-2 ring-[#c9a227] group-hover:ring-[#dfb235] group-hover:shadow-2xl group-hover:shadow-[#c9a227]/40 transition-all duration-300 transform group-hover:scale-[1.04]">
        <div className={sealSizes[size as keyof typeof sealSizes] || sealSizes.header}>
          {OfficialSealSvg}
        </div>
      </div>

      {/* Corporate Typographic Hierarchy */}
      <div className="flex flex-col justify-center text-left">
        <div className="flex items-center gap-1.5">
          <span className="font-serif font-black text-lg sm:text-xl md:text-2xl text-white tracking-tight leading-none drop-shadow-sm">
            AL-ISRAJ
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#c9a227]" />
          <span className="font-arabic text-sm text-[#f7d878] hidden sm:inline leading-none font-medium">
            الإسراج
          </span>
        </div>

        <span className="font-sans font-bold text-[9px] sm:text-[11px] text-[#c9a227] tracking-[0.18em] uppercase leading-tight mt-1">
          INTERNATIONAL TRAVELS (PVT.) LTD.
        </span>

        {showAccreditation && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#021f12] border border-[#c9a227]/60 text-[9px] sm:text-[10px] text-emerald-300 font-semibold tracking-wide">
              <ShieldCheck className="w-2.5 h-2.5 text-[#c9a227] shrink-0" />
              <span>MORA Enrolment # 1215/P</span>
            </span>
            <span className="text-white/30 text-[9px]">·</span>
            <span className="text-[9px] text-white/70 hidden md:inline">Govt. Approved HGO</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlIsrajLogo;
