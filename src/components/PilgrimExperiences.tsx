import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
  MapPin,
  Clock,
  Eye,
  MessageCircle,
  Radio,
  Sliders,
  Sun,
  Moon,
  Compass,
  CheckCircle,
  Award,
  ChevronRight,
  Heart,
  ExternalLink,
} from 'lucide-react';

interface MontageScene {
  id: string;
  title: string;
  arabicVerse: string;
  englishVerse: string;
  reference: string;
  linkedPackage: string;
  linkedPackageCode: string;
  virtueTitle: string;
  virtueValue: string;
  location: string;
  description: string;
  durationSeconds: number;
  imageUrl: string;
  backupUrl: string;
  badge: string;
  highlight: string;
  isPanoramic?: boolean;
}

interface AudioTrack {
  id: string;
  name: string;
  arabicName: string;
  artist: string;
  localUrl: string;
  backupUrl: string;
}

const ISLAMIC_TRACKS: AudioTrack[] = [
  {
    id: 'talbiyah',
    name: 'Hajj Talbiyah (Labbaik Allahumma Labbaik)',
    arabicName: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ',
    artist: 'Haramain Pilgrims Voice',
    localUrl: '/audio/talbiyah.mp3',
    backupUrl: 'https://server6.mp3quran.net/thubti/022.mp3',
  },
  {
    id: 'quran-recitation',
    name: 'Surat Al-Fatiha & Quranic Recitation',
    arabicName: 'سورة الفاتحة',
    artist: 'Sheikh Mishary Rashid Alafasy',
    localUrl: '/audio/quran.mp3',
    backupUrl: 'https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3',
  },
];

const MONTAGE_SCENES: MontageScene[] = [
  {
    id: 'kaaba-top-view-tawaf',
    title: 'Top View of Holy Kaaba & Pilgrims Performing Tawaf',
    arabicVerse: 'وَطَهِّرْ بَيْتِيَ لِلطَّائِفِينَ وَالْقَائِمِينَ وَالرُّكَّعِ السُّجُودِ',
    englishVerse: '"And sanctify My House for those who perform Tawaf, those who stand in prayer, and those who bow and prostrate."',
    reference: 'Surah Al-Hajj (22:26) · Sahih al-Bukhari',
    linkedPackage: 'Included in All Hajj Packages (Pkg 1, 2 & 3)',
    linkedPackageCode: 'Tawaf al-Qudum & Tawaf al-Ziyarah',
    virtueTitle: 'Haram Reward',
    virtueValue: '1 Prayer = 100,000 Prayers',
    location: 'Mataf Courtyard, Masjid al-Haram, Makkah',
    description:
      'Iconic top aerial view of the Holy Kaaba surrounded by white concentric rings of thousands of pilgrims in Ihram performing circular Tawaf on the gleaming white marble floor.',
    durationSeconds: 8,
    imageUrl: '/images/kaaba_top_view_tawaf.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/79/The_Kaaba_during_Hajj.jpg',
    badge: 'KAABA TOP VIEW TAWAF',
    highlight: 'Sacred concentric circles of pilgrims circumambulating the Holy Kaaba during Hajj',
  },
  {
    id: 'makkah-hotel-drone',
    title: 'Rotana Jabal Omar Makkah (150 Meters from Haram)',
    arabicVerse: 'صَلَاةٌ فِي الْمَسْجِدِ الْحَرَامِ أَفْضَلُ مِنْ مِائَةِ أَلْفِ صَلَاةٍ',
    englishVerse: '"One prayer in the Sacred Mosque is better than one hundred thousand prayers elsewhere."',
    reference: 'Sunan Ibn Majah · Authentic Hadith',
    linkedPackage: 'Package 2 (18 Days) & Package 3 (27 Days)',
    linkedPackageCode: 'MORA Codes: 2-95 & 3-55',
    virtueTitle: 'Proximity',
    virtueValue: '150m Level Walk',
    location: 'Rotana Jabal Omar, Makkah (150m from Haram)',
    description:
      'Spectacular aerial view showcasing Rotana Jabal Omar Makkah situated just 150 meters level walking distance from the Grand Mosque courtyards.',
    durationSeconds: 10,
    imageUrl: '/images/anjum_hotel_haram_drone.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Great_Mosque_of_Mecca1.jpg',
    badge: 'ROTANA JABAL OMAR MAKKAH',
    highlight: 'Direct pedestrian walk to the Grand Mosque courtyards for seamless congregational prayers',
    isPanoramic: true,
  },
  {
    id: 'medinah-inside',
    title: 'Inside View of Al-Masjid an-Nabawi in Madinah Munawwarah',
    arabicVerse: 'مَا بَيْنَ بَيْتِي وَمِنْبَرِي رَوْضَةٌ مِنْ رِيَاضِ الْجَنَّةِ',
    englishVerse: '"Between my house and my pulpit is a garden from the gardens of Paradise (Riyad al-Jannah)."',
    reference: 'Sahih al-Bukhari 1196 · Sahih Muslim',
    linkedPackage: 'Package 2 (18 Days) & Package 3 (27 Days)',
    linkedPackageCode: 'Markazia Hotels (250–300m from Roza)',
    virtueTitle: 'Sacred Chamber',
    virtueValue: 'Guaranteed Intercession (Shifa)',
    location: 'Central Markazia, Al-Masjid an-Nabawi, Madinah',
    description:
      'Inspiring interior sanctuary view inside the Prophet\'s Mosque featuring illuminated Islamic arches, golden leaf columns, and tranquil prayer halls adjacent to the sacred Rawdah Mubarak.',
    durationSeconds: 8,
    imageUrl: '/images/medinah_sanctuary_live.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Madina_Haram_at_evening.jpg',
    badge: 'MEDINAH SANCTUARY INSIDE',
    highlight: 'Sacred interior halls, Rawdah Mubarak visits, and short 250m hotel access',
  },
  {
    id: 'mina-camps-drone',
    title: 'Drone Aerial View of Mina White Tents & Plain of Arafat',
    arabicVerse: 'الْحَجُّ عَرَفَةُ — مَا مِنْ يَوْمٍ أَكْثَرَ مِنْ أَنْ يُعْتِقَ اللَّهُ فِيهِ عَبْدًا مِنَ النَّارِ',
    englishVerse: '"Hajj is Arafah — There is no day on which Allah frees more servants from the Fire than the Day of Arafah."',
    reference: 'Sahih Muslim 1348 · Sunan at-Tirmidhi',
    linkedPackage: 'Included in All 3 Packages (Core 5 Days of Hajj)',
    linkedPackageCode: 'Upgraded Makteb-C AC Tents & Sofa-Beds',
    virtueTitle: 'Forgiveness',
    virtueValue: 'Complete Forgiveness of Sins',
    location: 'Mina Valley & Jabal al-Rahmah, Arafat Plain',
    description:
      'Expansive drone panoramic view across the vast white tent city of Mina stretching through the desert valley, and Mount Arafat (Jabal al-Rahmah) where pilgrims stand in prayer.',
    durationSeconds: 8,
    imageUrl: '/images/mina_camps_drone.jpg',
    backupUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Mina_2.JPG',
    badge: 'MINA & ARAFAT CAMPS DRONE',
    highlight: 'Vast air-conditioned Makteb-C tent city, sofa-beds, and private facilities',
  },
];

export const PilgrimExperiences: React.FC = () => {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Lighting Filter Preset: 'golden' | 'daylight' | 'night'
  const [atmosphereFilter, setAtmosphereFilter] = useState<'golden' | 'daylight' | 'night'>('golden');

  // Audio State
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.85);

  // Live Makkah Digital Clock
  const [makkahTime, setMakkahTime] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const activeScene = MONTAGE_SCENES[activeSceneIndex];
  const activeTrack = ISLAMIC_TRACKS[activeTrackIndex];

  // Update Live Makkah Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const makkahString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Riyadh',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setMakkahTime(makkahString);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-advancing video montage timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 100;
    const totalStepMs = activeScene.durationSeconds * 1000;
    const progressIncrement = (intervalTime / totalStepMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveSceneIndex((current) => (current + 1) % MONTAGE_SCENES.length);
          return 0;
        }
        return prev + progressIncrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, activeSceneIndex, activeScene.durationSeconds]);

  // Fallback Web Audio API peaceful acoustic chime generator
  const playSynthesizedChime = () => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }

      const ctx = audioContextRef.current;
      const now = ctx.currentTime;

      // Serene resonant tones in Maqam Hijaz (D, Eb, F#, G, A)
      const frequencies = [293.66, 311.13, 369.99, 392.0, 440.0];
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.25);

        gain.gain.setValueAtTime(0, now + i * 0.25);
        gain.gain.linearRampToValueAtTime(0.08 * volume, now + i * 0.25 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.25 + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * 0.25);
        osc.stop(now + i * 0.25 + 2.8);
      });
    } catch (e) {
      console.warn('Web Audio synthesis error:', e);
    }
  };

  // Sync Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Audio Playback synchronization
  const startAudioPlayback = async () => {
    if (!audioRef.current) return;

    try {
      audioRef.current.volume = volume;
      await audioRef.current.play();
      setIsAudioPlaying(true);
    } catch (err) {
      console.warn('HTML5 Audio play prevented, attempting fallback:', err);
      if (activeTrack.backupUrl && audioRef.current.src !== activeTrack.backupUrl) {
        audioRef.current.src = activeTrack.backupUrl;
        audioRef.current.load();
        audioRef.current
          .play()
          .then(() => setIsAudioPlaying(true))
          .catch(() => {
            playSynthesizedChime();
            setIsAudioPlaying(true);
          });
      } else {
        playSynthesizedChime();
        setIsAudioPlaying(true);
      }
    }
  };

  const pauseAudioPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsAudioPlaying(false);
  };

  const toggleAudio = () => {
    if (isAudioPlaying) {
      pauseAudioPlayback();
    } else {
      startAudioPlayback();
    }
  };

  const handleSelectTrack = (index: number) => {
    setActiveTrackIndex(index);
    const newTrack = ISLAMIC_TRACKS[index];

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = newTrack.localUrl;
      audioRef.current.load();
      if (isAudioPlaying) {
        audioRef.current.play().catch(() => {
          playSynthesizedChime();
        });
      }
    }
  };

  const handleAudioError = () => {
    if (audioRef.current && activeTrack.backupUrl) {
      audioRef.current.src = activeTrack.backupUrl;
      audioRef.current.load();
      if (isAudioPlaying) {
        audioRef.current.play().catch(() => {
          playSynthesizedChime();
        });
      }
    }
  };

  const handleSelectScene = (index: number) => {
    setActiveSceneIndex(index);
    setProgress(0);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Filter styles
  const getFilterStyle = () => {
    switch (atmosphereFilter) {
      case 'golden':
        return 'contrast-105 saturate-110 brightness-105';
      case 'daylight':
        return 'contrast-115 brightness-110 saturate-115';
      case 'night':
        return 'contrast-120 saturate-95 brightness-90';
      default:
        return '';
    }
  };

  return (
    <section
      id="pilgrim-experiences"
      className="py-20 sm:py-28 bg-[#021f12] text-white relative overflow-hidden scroll-mt-24 sm:scroll-mt-28"
    >
      {/* Local HTML5 Audio Element with local source files */}
      <audio
        ref={audioRef}
        src={activeTrack.localUrl}
        preload="auto"
        loop
        onError={handleAudioError}
        onPlay={() => setIsAudioPlaying(true)}
        onPause={() => setIsAudioPlaying(false)}
      />

      {/* Background Decorative Islamic Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[#c9a227]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#c9a227]/20 px-4 py-1.5 border border-[#c9a227]/40 text-xs font-bold uppercase tracking-[0.22em] text-[#e6c964] mb-3 shadow">
            <Radio className="w-3.5 h-3.5 text-[#c9a227] animate-pulse" />
            Live Pilgrimage Perspectives &amp; Sacred Sanctuaries
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-semibold [text-wrap:balance]">
            Pilgrim Experiences &amp; Package Sanctuaries
          </h2>
          <div className="gold-rule mx-auto mt-5 h-0.5 w-32 bg-[#c9a227]"></div>
          <p className="mt-4 text-base sm:text-lg text-white/85 [text-wrap:balance] font-light leading-relaxed">
            Witness the actual sanctuaries and sacred rites included in our MORA-approved Hajj 2027 packages: Kaaba top view Tawaf, Rotana Jabal Omar Makkah (150m walk), Al-Masjid an-Nabawi inside, and Mina white tent camps.
          </p>
        </div>

        {/* Video Montage Showcase Player */}
        <div className="mt-10 lg:mt-14">
          <div
            ref={containerRef}
            className="group relative rounded-3xl overflow-hidden bg-black border-2 border-[#c9a227]/50 shadow-2xl aspect-video max-h-[640px] w-full mx-auto"
          >
            {/* Active Scene Still with Ken-Burns Motion Effect & Panoramic Pan */}
            <div className="absolute inset-0 overflow-hidden bg-[#021f12]">
              <img
                src={activeScene.imageUrl}
                alt={activeScene.title}
                key={activeScene.id}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  if (activeScene.backupUrl && e.currentTarget.src !== activeScene.backupUrl) {
                    e.currentTarget.src = activeScene.backupUrl;
                  }
                }}
                className={`w-full h-full object-cover transition-all duration-1000 ${getFilterStyle()} ${
                  activeScene.isPanoramic
                    ? 'animate-panoramic scale-115'
                    : isPlaying
                    ? 'scale-105 transition-transform duration-[8000ms] ease-out'
                    : 'scale-100'
                }`}
                loading="eager"
              />

              {/* Viewfinder Crosshairs for Live Broadcast Feel */}
              <div className="absolute inset-4 sm:inset-6 pointer-events-none opacity-40">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#c9a227]" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#c9a227]" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#c9a227]" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#c9a227]" />
              </div>

              {/* Vignette & Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40 pointer-events-none" />

              {/* Live Makkah Clock & Package Connection Tag */}
              <div className="absolute top-16 left-4 sm:left-6 z-20 pointer-events-none flex flex-col gap-1.5 max-w-sm">
                <div className="inline-flex items-center gap-2 rounded-xl bg-black/80 backdrop-blur-md border border-[#c9a227]/60 px-3.5 py-1.5 text-xs text-[#e6c964] shadow-xl">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span className="font-bold tracking-wide uppercase">{activeScene.badge}</span>
                  <span className="text-white/40">|</span>
                  <span className="text-white/90 font-mono tabular-nums">{makkahTime || '12:00:00 PM'} (KSA)</span>
                </div>

                {/* Direct Package Connection Pill */}
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-950/85 border border-emerald-400/50 px-2.5 py-1 text-[11px] text-emerald-300 w-fit backdrop-blur-sm shadow">
                  <Award className="w-3 h-3 text-[#c9a227]" />
                  <span><strong>{activeScene.linkedPackage}</strong></span>
                </div>
              </div>
            </div>

            {/* Top Bar Metadata Overlay */}
            <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between z-20 pointer-events-none">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-[#c9a227]/50 text-[#e6c964] text-xs font-bold shadow">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  SCENE {activeSceneIndex + 1} / {MONTAGE_SCENES.length}
                </span>

                {/* Prominent Islamic Audio Status Pill */}
                <button
                  type="button"
                  onClick={toggleAudio}
                  className={`pointer-events-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md border transition-all text-xs font-bold shadow-lg ${
                    isAudioPlaying
                      ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300'
                      : 'bg-black/75 border-[#c9a227]/70 text-[#e6c964] hover:bg-[#c9a227] hover:text-[#032b19]'
                  }`}
                  title={isAudioPlaying ? 'Mute Islamic Audio' : 'Click to Listen Islamic Audio (Talbiyah)'}
                >
                  {isAudioPlaying ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="flex items-end gap-0.5 h-3">
                        <span className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_100ms] h-full"></span>
                        <span className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_300ms] h-2"></span>
                        <span className="w-0.5 bg-emerald-400 rounded-full animate-[bounce_1s_infinite_200ms] h-3"></span>
                      </span>
                      <span className="hidden sm:inline">Playing: {activeTrack.name}</span>
                      <span className="sm:hidden">Audio ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>▶ Listen Talbiyah Sound</span>
                    </>
                  )}
                </button>
              </div>

              {/* Top Right Controls: Lighting Presets & Fullscreen */}
              <div className="flex items-center gap-2 pointer-events-auto">
                {/* Lighting Filter Switcher */}
                <div className="hidden sm:flex items-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 p-0.5">
                  <button
                    type="button"
                    onClick={() => setAtmosphereFilter('golden')}
                    className={`px-2 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 transition ${
                      atmosphereFilter === 'golden' ? 'bg-[#c9a227] text-[#032b19]' : 'text-white/70 hover:text-white'
                    }`}
                    title="Golden Hour Glow"
                  >
                    <Sun className="w-3 h-3" /> Dawn
                  </button>
                  <button
                    type="button"
                    onClick={() => setAtmosphereFilter('daylight')}
                    className={`px-2 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 transition ${
                      atmosphereFilter === 'daylight' ? 'bg-[#c9a227] text-[#032b19]' : 'text-white/70 hover:text-white'
                    }`}
                    title="Brilliant Daylight"
                  >
                    <Sparkles className="w-3 h-3" /> Day
                  </button>
                  <button
                    type="button"
                    onClick={() => setAtmosphereFilter('night')}
                    className={`px-2 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 transition ${
                      atmosphereFilter === 'night' ? 'bg-[#c9a227] text-[#032b19]' : 'text-white/70 hover:text-white'
                    }`}
                    title="Sanctuary Night"
                  >
                    <Moon className="w-3 h-3" /> Night
                  </button>
                </div>

                {/* Audio Quick Mute Button */}
                <button
                  type="button"
                  onClick={toggleAudio}
                  className={`h-9 w-9 rounded-full backdrop-blur-md border flex items-center justify-center transition shadow ${
                    isAudioPlaying
                      ? 'bg-[#c9a227] text-[#032b19] border-[#c9a227]'
                      : 'bg-black/60 border-white/20 text-white hover:text-[#c9a227]'
                  }`}
                  title={isAudioPlaying ? 'Mute Islamic Audio' : 'Play Islamic Audio'}
                >
                  {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="h-9 w-9 rounded-full bg-black/60 backdrop-blur-md border border-white/20 hover:border-[#c9a227] text-white hover:text-[#c9a227] flex items-center justify-center transition"
                  title="Toggle Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Center Big Play Button if Video Paused */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="h-20 w-20 rounded-full bg-[#c9a227] hover:bg-[#e6c964] text-[#032b19] flex items-center justify-center shadow-2xl shadow-black/80 hover:scale-110 transition-all"
                  title="Play Video Montage"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
              </div>
            )}

            {/* Bottom Controls & Sacred Inspiration Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-20 bg-gradient-to-t from-black via-black/90 to-transparent">
              {/* Motivating Quranic Ayat / Hadith Banner */}
              <div className="max-w-3xl mb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#c9a227] mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{activeScene.location}</span>
                  <span className="text-white/40">·</span>
                  <span className="text-[#e6c964] font-medium">{activeScene.linkedPackageCode}</span>
                </div>
                <h3 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {activeScene.title}
                </h3>

                {/* Spiritual Motivation Callout */}
                <div className="mt-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-[#c9a227]/30 p-2.5 sm:p-3 text-xs">
                  <p className="font-arabic text-sm sm:text-base text-[#f4df8f] leading-relaxed text-right mb-1">
                    {activeScene.arabicVerse}
                  </p>
                  <p className="text-white/90 italic font-light">
                    {activeScene.englishVerse}
                  </p>
                  <div className="flex items-center justify-between gap-2 mt-1.5 flex-wrap">
                    <span className="text-[10px] text-[#c9a227] font-semibold">
                      — {activeScene.reference}
                    </span>
                    <a
                      href="#packages"
                      className="text-[10px] text-emerald-300 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      View Linked Package Details <ChevronRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Playback Bar */}
              <div className="mt-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-10 w-10 shrink-0 rounded-full bg-[#c9a227] text-[#032b19] flex items-center justify-center font-bold hover:bg-[#e6c964] transition shadow"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>

                {/* Segmented Timeline */}
                <div className="flex-1 grid grid-cols-4 gap-2">
                  {MONTAGE_SCENES.map((scene, idx) => {
                    const isCurrent = idx === activeSceneIndex;
                    const isPassed = idx < activeSceneIndex;
                    return (
                      <button
                        key={scene.id}
                        type="button"
                        onClick={() => handleSelectScene(idx)}
                        className="group/bar relative h-2.5 bg-white/20 rounded-full overflow-hidden text-left focus:outline-none"
                        title={`Scene ${idx + 1}: ${scene.title}`}
                      >
                        <div
                          className={`h-full rounded-full transition-all ${
                            isCurrent
                              ? 'bg-[#c9a227]'
                              : isPassed
                              ? 'bg-white/80'
                              : 'bg-transparent'
                          }`}
                          style={{
                            width: isCurrent ? `${progress}%` : isPassed ? '100%' : '0%',
                          }}
                        />
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs font-mono text-white/80 tabular-nums shrink-0">
                  {String(activeSceneIndex + 1).padStart(2, '0')}:0
                  {Math.floor((progress / 100) * activeScene.durationSeconds)} / 0
                  {activeScene.durationSeconds}
                </span>
              </div>
            </div>
          </div>

          {/* Eye-Catching Audio Console & Spiritual Motivation Bar */}
          <div className="mt-4 rounded-3xl bg-gradient-to-r from-[#032b19] via-[#043820] to-[#032b19] border-2 border-[#c9a227]/40 p-4 sm:p-5 flex flex-col lg:flex-row items-center justify-between gap-4 shadow-2xl">
            <div className="flex items-center gap-3.5 w-full lg:w-auto">
              <button
                type="button"
                onClick={toggleAudio}
                className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center transition shadow-lg ${
                  isAudioPlaying
                    ? 'bg-emerald-400 text-emerald-950 animate-pulse ring-4 ring-emerald-400/30'
                    : 'bg-[#c9a227] hover:bg-[#e6c964] text-[#032b19]'
                }`}
                title={isAudioPlaying ? 'Pause Islamic Audio' : 'Play Islamic Audio'}
              >
                {isAudioPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#e6c964]">
                    Sacred Soundtrack:
                  </span>
                  <span className="text-sm text-white font-bold">
                    {activeTrack.name}
                  </span>
                  <span className="font-arabic text-sm text-[#c9a227]">
                    ({activeTrack.arabicName})
                  </span>
                </div>
                <p className="text-xs text-white/80 mt-0.5">
                  {isAudioPlaying
                    ? '🔊 Audio is actively playing through your speakers. Adjust volume below.'
                    : 'Click Play to hear genuine Hajj Talbiyah and Quran recitation from Haramain.'}
                </p>
              </div>
            </div>

            {/* Audio Track Toggle & Volume Slider */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              {/* Track Selector Pills */}
              <div className="inline-flex rounded-full bg-emerald-950 p-1 border border-[#c9a227]/40 w-full sm:w-auto justify-center">
                {ISLAMIC_TRACKS.map((track, idx) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      handleSelectTrack(idx);
                      if (!isAudioPlaying) startAudioPlayback();
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                      activeTrackIndex === idx
                        ? 'bg-[#c9a227] text-[#032b19] shadow-md'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {idx === 0 ? '🕋 Hajj Talbiyah' : '📖 Surat Al-Fatiha'}
                  </button>
                ))}
              </div>

              {/* Volume Slider & Play Button */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full border border-white/15">
                  <Volume2 className="w-3.5 h-3.5 text-[#c9a227]" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-16 sm:w-20 accent-[#c9a227] cursor-pointer"
                    aria-label="Audio Volume"
                  />
                  <span className="text-[11px] font-mono text-white/80 w-7">
                    {Math.round(volume * 100)}%
                  </span>
                </div>

                <button
                  type="button"
                  onClick={toggleAudio}
                  className={`px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition shadow-lg ${
                    isAudioPlaying
                      ? 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950'
                      : 'bg-[#c9a227] hover:bg-[#e6c964] text-[#032b19]'
                  }`}
                >
                  {isAudioPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Audio</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Scene Selector Thumbnails (Chapter Strip with Package Connection) */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {MONTAGE_SCENES.map((scene, idx) => {
              const isCurrent = idx === activeSceneIndex;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => handleSelectScene(idx)}
                  className={`rounded-2xl p-3 sm:p-4 text-left border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-white/15 border-[#c9a227] shadow-xl shadow-[#c9a227]/20 ring-2 ring-[#c9a227]'
                      : 'bg-[#032b19]/70 border-white/10 hover:border-white/40 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isCurrent
                          ? 'bg-[#c9a227] text-[#032b19]'
                          : 'bg-white/10 text-white/80'
                      }`}
                    >
                      {scene.badge}
                    </span>
                    {isCurrent && (
                      <span className="flex items-center gap-1 text-[10px] text-[#e6c964] font-bold">
                        <Eye className="w-3 h-3" /> Live
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug">
                    {scene.title}
                  </h4>
                  <p className="text-[11px] text-[#c9a227] mt-1.5 font-medium line-clamp-1">
                    {scene.linkedPackage}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Motivational Trust Card & Immediate WhatsApp Action */}
          <div className="mt-10 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#03361e] to-emerald-950 border border-[#c9a227]/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#c9a227] text-[#032b19] font-bold text-2xl shadow-lg">
                🕋
              </span>
              <div>
                <h4 className="font-serif font-bold text-lg sm:text-xl text-white">
                  Answer the Call of Prophet Ibrahim (AS) for Hajj 2027
                </h4>
                <p className="text-xs sm:text-sm text-white/80 mt-0.5 max-w-xl">
                  MORA Government Enrolment <strong>1215/P</strong> · Peshawar Head Office. Secure your room at Rotana Jabal Omar Makkah (150m walk).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href="#packages"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a227] px-6 py-3 text-xs sm:text-sm font-bold text-[#032b19] hover:bg-[#e6c964] transition shadow-lg"
              >
                View Packages
              </a>
              <a
                href="https://wa.link/47g4xb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-full border-2 border-emerald-400 bg-emerald-900/80 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-emerald-800 transition shadow"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" /> WhatsApp Direct
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PilgrimExperiences;
