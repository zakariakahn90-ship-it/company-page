import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Calendar,
  Compass,
  Bus,
  Footprints,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Navigation,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  HeartHandshake,
} from 'lucide-react';

export interface RitualDay {
  dayNumber: number;
  hijriDate: string;
  islamicTitle: string;
  englishTitle: string;
  primaryLocationId: string;
  summary: string;
  activePathSegments: string[];
  keyRites: string[];
  alIsrajSupport: string;
  recommendedDua: string;
  travelDistanceKm: number;
  travelMode: string;
}

export interface RitualLocation {
  id: string;
  name: string;
  arabicName: string;
  shortDesc: string;
  fullDesc: string;
  coordinates: { x: number; y: number };
  badge: string;
  significance: string;
  ritesHere: string[];
  alIsrajFacility: string;
  imageThumbnail: string;
}

const RITUAL_LOCATIONS: Record<string, RitualLocation> = {
  makkah: {
    id: 'makkah',
    name: 'Makkah Al-Mukarramah (Masjid al-Haram)',
    arabicName: 'مكة المكرمة · المسجد الحرام',
    shortDesc: 'Starting & completion sanctuary: Tawaf, Sai, and Farewell Tawaf.',
    fullDesc:
      'The sacred sanctuary housing the Holy Kaaba. Pilgrims enter the state of Ihram here on 8th Zil-Hajj, return on 10th Zil-Hajj for the pillar Tawaf al-Ziyarah (Ifadah), and conclude with the final Tawaf al-Wida before departing.',
    coordinates: { x: 120, y: 320 },
    badge: 'SACRED SANCTUARY',
    significance: '1 prayer in Masjid al-Haram equals 100,000 prayers elsewhere.',
    ritesHere: [
      'Assume state of Ihram for Hajj with Niyyah & Talbiyah',
      'Tawaf al-Ziyarah (Ifadah) on 10th Zil-Hajj (Obligatory Pillar)',
      'Sai between Safa & Marwa (7 circuits)',
      'Tawaf al-Wida (Farewell Tawaf before departure)',
    ],
    alIsrajFacility:
      'Rotana Jabal Omar Makkah (150m from Haram courtyard) provides swift, flat access for all Tawaf rites.',
    imageThumbnail: '/images/kaaba_top_view_tawaf.jpg',
  },
  mina: {
    id: 'mina',
    name: 'Mina Valley (The Tent City & Makteb-C)',
    arabicName: 'منى · مدينة الخيام',
    shortDesc: 'Base camp for 8th Zil-Hajj & Tashreeq days (10th–12th Zil-Hajj).',
    fullDesc:
      'The historic valley of white tents where pilgrims stay for Yawm al-Tarwiyah (8th Zil-Hajj) and the days of Tashreeq (10th, 11th, 12th Zil-Hajj). Pilgrims shorten 4-rakat prayers without combining, rest, and make continuous Dhikr.',
    coordinates: { x: 370, y: 200 },
    badge: 'MAKTEB-C CAMP',
    significance: 'The Sunnah resting place where the Prophet ﷺ stayed and prayed 5 prayers.',
    ritesHere: [
      'Stay overnight from 8th Zil-Hajj until morning of 9th Zil-Hajj',
      'Pray Zuhr, Asr, Maghrib, Isha, and Fajr (Qasr / shortened)',
      'Base camp during Tashreeq days (10th, 11th, 12th Zil-Hajj)',
      'Recite continuous Talbiyah, Takbeerat, and Quran',
    ],
    alIsrajFacility:
      'Official Makteb-C fireproof AC gypsum tents with dedicated sofa-beds, private electrical outlets, and round-the-clock Pakistani buffet dining.',
    imageThumbnail: '/images/mina_camps_drone.jpg',
  },
  arafat: {
    id: 'arafat',
    name: 'Plains of Arafat & Jabal al-Rahmah',
    arabicName: 'صعيد عرفات · جبل الرحمة',
    shortDesc: 'The greatest pillar of Hajj: Wuqoof from noon until sunset (9th Zil-Hajj).',
    fullDesc:
      'The culmination of Hajj on 9th Zil-Hajj. Standing at Arafat (Wuqoof) between Dhuhr and sunset is the essential pillar without which Hajj is incomplete. Allah descends to the lowest heaven and boasts of the pilgrims to the angels.',
    coordinates: { x: 790, y: 350 },
    badge: 'GREATEST PILLAR',
    significance: '"Hajj is Arafah" — The day on which Allah forgives the most sins.',
    ritesHere: [
      'Listen to Khutbat-ul-Arafah at Masjid Nimrah',
      'Combine and shorten Zuhr & Asr prayers at Dhuhr time',
      'Intense Wuqoof (Standing & Supplication) facing Qibla until sunset',
      'Departure (Nafrah) immediately after sunset without praying Maghrib at Arafat',
    ],
    alIsrajFacility:
      'Upgraded air-conditioned marquee tents with mist cooling fans, chilled bottled water, catered hot lunch, and guided group supplications led by scholars.',
    imageThumbnail: '/images/arafat_pilgrims.jpg',
  },
  muzdalifah: {
    id: 'muzdalifah',
    name: 'Muzdalifah (Mash\'ar al-Haram)',
    arabicName: 'مزدلفة · المشعر الحرام',
    shortDesc: 'Night of 9th–10th Zil-Hajj: Combined prayer, pebble collection, sleep under the stars.',
    fullDesc:
      'The sacred open plain between Arafat and Mina. Pilgrims arrive after sunset on 9th Zil-Hajj, pray Maghrib and Isha together, gather 49 or 70 small pebbles for Jamarat, and sleep under the open sky until Fajr as per the Sunnah.',
    coordinates: { x: 570, y: 250 },
    badge: 'NIGHT UNDER THE STARS',
    significance: 'Mentioned specifically in the Quran: "Remember Allah at the Sacred Landmark (Mash\'ar al-Haram)".',
    ritesHere: [
      'Pray Maghrib (3 rakats) and Isha (2 rakats) together with one Adhan and two Iqamahs',
      'Collect 49 to 70 small chickpea-sized pebbles for Jamarat stoning',
      'Rest and sleep under the open sky (Sunnah of Rasulullah ﷺ)',
      'Pray Fajr at earliest dawn time and make heartfelt Dua at Mash\'ar al-Haram until sunrise',
    ],
    alIsrajFacility:
      'Assigned group holding sector with sleeping mats, hygienic refreshment packs, and group marshals to guide coach departures at dawn.',
    imageThumbnail: '/images/anjum_hotel_haram_drone.jpg',
  },
  jamarat: {
    id: 'jamarat',
    name: 'Jamarat Bridge (The Stoning Pillars)',
    arabicName: 'جسر الجمرات · رجم الشيطان',
    shortDesc: 'Symbolic rejection of evil: Stoning on 10th, 11th, and 12th Zil-Hajj.',
    fullDesc:
      'The modern multi-level Jamarat Bridge in Mina where pilgrims perform Ramy (throwing pebbles). On 10th Zil-Hajj only the Big Pillar (Jamarat al-Aqaba) is stoned. On 11th & 12th Zil-Hajj all three pillars (Small, Medium, and Big) are stoned in sequence.',
    coordinates: { x: 280, y: 175 },
    badge: 'RAMY RITUAL',
    significance: 'Emulating Prophet Ibrahim (AS) rejecting the whispers of Shaytan.',
    ritesHere: [
      '10th Zil-Hajj: Stone only Jamarat al-Aqaba (Big Pillar) with 7 pebbles reciting Takbeer',
      '11th & 12th Zil-Hajj: Stone all 3 pillars (Small, Medium, Big) with 7 pebbles each (21 total daily) after Zawwal',
      'Followed by Qurbani (Sacrifice) and Halq/Taqseer (Shaving or Trimming hair) on 10th Zil-Hajj',
      'Release from primary Ihram restrictions (Tahallul al-Asghar)',
    ],
    alIsrajFacility:
      'Scheduled group walk times avoiding peak midday heat and high crowd congestion, guided by experienced Al-Israj flag bearers.',
    imageThumbnail: '/images/mina_tents.jpg',
  },
};

const RITUAL_DAYS: RitualDay[] = [
  {
    dayNumber: 1,
    hijriDate: '8th Zil-Hajj',
    islamicTitle: 'Yawm al-Tarwiyah (Day of Deliberation)',
    englishTitle: 'Departure from Makkah to Mina',
    primaryLocationId: 'mina',
    summary:
      'Pilgrims enter the state of Ihram in Makkah, recite the Talbiyah, and travel to the tent city of Mina before Dhuhr. Pilgrims spend the day and night in Mina engaged in prayer and reflection.',
    activePathSegments: ['makkah-to-mina'],
    keyRites: [
      'Take ritual bath (Ghusl) & wear white Ihram garments',
      'Make Niyyah (Intention) for Hajj: "Labbaik Allahumma Hajjan"',
      'Travel to Mina and pray Zuhr, Asr, Maghrib, Isha, and Fajr (shortened, not combined)',
      'Stay overnight inside Mina Makteb-C air-conditioned tents',
    ],
    alIsrajSupport:
      'Seat-by-seat boarding on air-conditioned luxury coaches from Makkah directly to our private Makteb-C camp gate in Mina.',
    recommendedDua:
      'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لاَ شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ لاَ شَرِيكَ لَكَ',
    travelDistanceKm: 8,
    travelMode: 'Luxury AC Group Coach (~20 min)',
  },
  {
    dayNumber: 2,
    hijriDate: '9th Zil-Hajj',
    islamicTitle: 'Yawm al-Arafah & Overnight at Muzdalifah',
    englishTitle: 'Mina → Arafat (Wuqoof) → Sunset to Muzdalifah',
    primaryLocationId: 'arafat',
    summary:
      'The pinnacle of Hajj. Pilgrims move from Mina to the plain of Arafat after sunrise. After sunset, the entire congregation moves peacefully to Muzdalifah for an open-air night under the stars.',
    activePathSegments: ['mina-to-arafat', 'arafat-to-muzdalifah'],
    keyRites: [
      'Travel to Arafat after sunrise of 9th Zil-Hajj',
      'Perform Wuqoof (Standing & Supplication) from noon to sunset',
      'Listen to Khutbah and combine Dhuhr & Asr prayers at Dhuhr time',
      'Sunset departure (Nafrah) to Muzdalifah without praying Maghrib at Arafat',
      'Pray Maghrib & Isha combined in Muzdalifah, collect 49-70 pebbles, and sleep under open sky',
    ],
    alIsrajSupport:
      'Assigned air-conditioned marquees with misting fans in Arafat, catered lunch box, and organized coach transfer to Muzdalifah holding area.',
    recommendedDua:
      'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    travelDistanceKm: 22,
    travelMode: 'Luxury Coach to Arafat (13 km) + Coach to Muzdalifah (9 km)',
  },
  {
    dayNumber: 3,
    hijriDate: '10th Zil-Hajj',
    islamicTitle: 'Yawm al-Nahr (Eid al-Adha & Day of Sacrifice)',
    englishTitle: 'Muzdalifah → Jamarat (Ramy) → Makkah (Tawaf Ifadah) → Mina',
    primaryLocationId: 'jamarat',
    summary:
      'The most action-packed day: Depart Muzdalifah at dawn, stone the Big Pillar (Jamarat al-Aqaba), perform Qurbani, shave/trim hair (Halq), perform Tawaf al-Ziyarah at the Kaaba, and return to Mina.',
    activePathSegments: ['muzdalifah-to-jamarat', 'jamarat-to-makkah', 'makkah-to-mina-return'],
    keyRites: [
      'Pray Fajr at early dawn in Muzdalifah and make Dua at Mash\'ar al-Haram',
      'Stone Big Pillar (Jamarat al-Aqaba) with 7 pebbles reciting "Allahu Akbar"',
      'Arrange animal sacrifice (Qurbani / Damm al-Tamattu)',
      'Men shave head (Halq) or trim evenly (Taqseer); women trim one fingertip length (Tahallul al-Asghar)',
      'Perform Tawaf al-Ziyarah (Ifadah) & Sai at Masjid al-Haram in Makkah',
      'Return to Mina for overnight stay',
    ],
    alIsrajSupport:
      'Verified automated Qurbani coupon execution, shuttle coordination between Mina and Makkah for Tawaf Ifadah, and guided return to Mina tents.',
    recommendedDua:
      'بِسْمِ اللَّهِ، اللَّهُ أَكْبَرُ، رَغْمًا لِلشَّيْطَانِ وَرِضًا لِلرَّحْمَنِ',
    travelDistanceKm: 18,
    travelMode: 'Pedestrian Walk to Jamarat + AC Coach to Makkah & Mina',
  },
  {
    dayNumber: 4,
    hijriDate: '11th Zil-Hajj',
    islamicTitle: 'Ayyam al-Tashreeq (First Day of Tashreeq)',
    englishTitle: 'Mina Stay & Stoning the 3 Jamarat Pillars',
    primaryLocationId: 'mina',
    summary:
      'Pilgrims reside in Mina tents engaged in remembrance of Allah, then proceed after Zawwal (solar noon) to stone all three Jamarat pillars with 21 pebbles.',
    activePathSegments: ['mina-internal-jamarat'],
    keyRites: [
      'Stay overnight in Mina tents (Wajib)',
      'After Zawwal (noon), walk to Jamarat Bridge with 21 pebbles',
      'Stone Small Pillar (Jamarat al-Sughra) with 7 pebbles & make long Dua',
      'Stone Medium Pillar (Jamarat al-Wusta) with 7 pebbles & make long Dua',
      'Stone Big Pillar (Jamarat al-Aqaba) with 7 pebbles without stopping',
      'Return to Mina camp for evening prayer and recitation',
    ],
    alIsrajSupport:
      'Scheduled departure window during shaded hours to avoid excessive sun exposure and ensure elder pilgrims travel comfortably.',
    recommendedDua:
      'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    travelDistanceKm: 5,
    travelMode: 'Covered Pedestrian Walkway to Jamarat Bridge',
  },
  {
    dayNumber: 5,
    hijriDate: '12th/13th Zil-Hajj',
    islamicTitle: 'Yawm al-Ta\'ajjul / Nafr & Tawaf al-Wida',
    englishTitle: 'Final Stoning & Farewell Tawaf at the Holy Kaaba',
    primaryLocationId: 'makkah',
    summary:
      'Pilgrims stone all three pillars after Zawwal on 12th Zil-Hajj. Those departing Mina leave before sunset (Ta\'ajjul) and proceed to Makkah to perform Tawaf al-Wida, concluding their Hajj.',
    activePathSegments: ['mina-to-makkah-final'],
    keyRites: [
      'Stone all three Jamarat pillars after Zawwal with 21 pebbles',
      'Pack luggage and depart Mina before sunset of 12th Zil-Hajj (or remain until 13th for extra reward)',
      'Travel back to Rotana Jabal Omar Makkah',
      'Perform Tawaf al-Wida (Farewell Tawaf) around the Holy Kaaba before departure from Makkah',
      'Complete Hajj Mabroor with heart full of gratitude',
    ],
    alIsrajSupport:
      'Luggage collection from Mina camps directly transferred to Rotana Jabal Omar Makkah / departure buses, plus organized airport transfer coaches.',
    recommendedDua:
      'اللَّهُمَّ إِنَّ الْبَيْتَ بَيْتُكَ، وَالْعَبْدَ عَبْدُكَ، حَمَلْتَنِي عَلَى مَا سَخَّرْتَ لِي مِنْ خَلْقِكَ، حَتَّى سَيَّرْتَنِي إِلَى بِلادِكَ',
    travelDistanceKm: 12,
    travelMode: 'Luggage Transfer & Luxury Coach to Makkah Hotel',
  },
];

export const HajjRitualMap: React.FC = () => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('mina');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);

  const activeDay = RITUAL_DAYS[selectedDayIndex];
  const activeLocation = RITUAL_LOCATIONS[selectedLocationId] || RITUAL_LOCATIONS.mina;

  // Auto-play through the 5 days of Hajj
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setSelectedDayIndex((prev) => {
        const next = (prev + 1) % RITUAL_DAYS.length;
        setSelectedLocationId(RITUAL_DAYS[next].primaryLocationId);
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleSelectDay = (index: number) => {
    setSelectedDayIndex(index);
    setSelectedLocationId(RITUAL_DAYS[index].primaryLocationId);
  };

  const handleLocationClick = (locId: string) => {
    setSelectedLocationId(locId);
    // Find first day associated with this location if applicable
    const dayWithLoc = RITUAL_DAYS.findIndex((d) => d.primaryLocationId === locId);
    if (dayWithLoc !== -1 && dayWithLoc !== selectedDayIndex) {
      setSelectedDayIndex(dayWithLoc);
    }
  };

  // Determine path stroke colors & pulse states
  const isSegmentActive = (segmentId: string) => {
    return activeDay.activePathSegments.includes(segmentId);
  };

  return (
    <section
      id="ritual-path"
      className="py-20 sm:py-28 bg-[#032314] text-white relative overflow-hidden scroll-mt-24 sm:scroll-mt-28"
    >
      {/* Background Islamic Geometric Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg className="w-full h-full text-[#c9a227]" viewBox="0 0 100 100" fill="currentColor">
          <pattern id="islamic-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <polygon points="5,0 10,5 5,10 0,5" fill="none" stroke="currentColor" strokeWidth="0.3" />
            <circle cx="5" cy="5" r="1.5" fill="none" stroke="currentColor" strokeWidth="0.2" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#islamic-grid)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#c9a227]/20 px-4 py-1.5 border border-[#c9a227]/40 text-xs font-bold uppercase tracking-[0.22em] text-[#e6c964] mb-3 shadow">
            <Compass className="w-3.5 h-3.5 text-[#c9a227] animate-spin-slow" />
            Interactive 5-Day Sacred Pilgrimage Path
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-white font-semibold [text-wrap:balance]">
            Hajj Ritual Path &amp; Sanctuary Itinerary
          </h2>
          <div className="gold-rule mx-auto mt-5 h-0.5 w-32 bg-[#c9a227]"></div>
          <p className="mt-4 text-base sm:text-lg text-white/85 [text-wrap:balance] font-light leading-relaxed">
            Follow the blessed footsteps of Prophet Ibrahim (AS) and the Holy Prophet Muhammad ﷺ. Explore the step-by-step 5-day route between Makkah, Mina, Arafat, Muzdalifah, and Jamarat.
          </p>
        </div>

        {/* 5-Day Timeline Controller Bar */}
        <div className="mt-10 lg:mt-12 rounded-3xl bg-black/40 border border-[#c9a227]/40 p-3 sm:p-4 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Play / Pause Tour Button */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
              <button
                type="button"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition shadow ${
                  isAutoPlaying
                    ? 'bg-amber-400 text-amber-950 animate-pulse'
                    : 'bg-[#c9a227] hover:bg-[#e6c964] text-[#032b19]'
                }`}
                title={isAutoPlaying ? 'Pause Automated Journey Tour' : 'Play 5-Day Journey Tour'}
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause Tour</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    <span>Auto-Play Tour</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSelectDay(0)}
                className="rounded-full bg-white/10 hover:bg-white/20 p-2 text-white/80 transition"
                title="Reset to Day 1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="text-xs font-mono text-[#e6c964] hidden sm:inline-block">
                Day {activeDay.dayNumber} of 5 · <span className="text-white font-bold">{activeDay.hijriDate}</span>
              </div>
            </div>

            {/* 5-Day Selector Buttons */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 w-full md:w-auto">
              {RITUAL_DAYS.map((day, idx) => {
                const isCurrent = idx === selectedDayIndex;
                return (
                  <button
                    key={day.dayNumber}
                    type="button"
                    onClick={() => handleSelectDay(idx)}
                    className={`rounded-2xl px-2.5 sm:px-4 py-2 text-center transition-all flex flex-col items-center justify-center border ${
                      isCurrent
                        ? 'bg-[#c9a227] text-[#032b19] border-[#e6c964] shadow-lg font-bold scale-105 ring-2 ring-[#c9a227]/40'
                        : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/15 hover:border-white/30'
                    }`}
                  >
                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider block">
                      Day {day.dayNumber}
                    </span>
                    <span className="text-[9px] sm:text-[11px] opacity-90 truncate max-w-[70px] sm:max-w-none">
                      {day.hijriDate.replace(' Zil-Hajj', ' Zil')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Interactive Workspace: Map Graphic (Left/Top) + Detailed Itinerary (Right/Bottom) */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Interactive Stylized SVG Schematic Map (7 Cols) */}
          <div className="lg:col-span-7 bg-[#02180d] rounded-3xl border-2 border-[#c9a227]/40 p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            {/* Map Top Bar Kicker */}
            <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-bold uppercase tracking-wider text-[#e6c964]">
                  Sanctuary Topography Schematic
                </span>
              </div>
              <span className="text-[11px] text-white/60">
                Click any sanctuary node below to inspect rites
              </span>
            </div>

            {/* SVG Interactive Canvas */}
            <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-[#01140a] via-[#021d10] to-[#01160c] rounded-2xl overflow-hidden border border-[#c9a227]/20 p-2">
              <svg
                viewBox="0 0 920 540"
                className="w-full h-full select-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Subtle terrain elevation gradient */}
                  <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#082819" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#02150b" stopOpacity="0.8" />
                  </linearGradient>

                  {/* Active glowing path stroke gradient */}
                  <linearGradient id="activeGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c9a227" />
                    <stop offset="50%" stopColor="#f7e18b" />
                    <stop offset="100%" stopColor="#c9a227" />
                  </linearGradient>

                  {/* Marker Glow Filter */}
                  <filter id="glowGold" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  {/* Arrow marker for paths */}
                  <marker
                    id="arrowhead-gold"
                    markerWidth="7"
                    markerHeight="7"
                    refX="5"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 7 3.5, 0 7" fill="#e6c964" />
                  </marker>
                </defs>

                {/* Decorative Mountain Silhouettes (Jabal al-Noor & Jabal Thawr) */}
                <path
                  d="M 50 180 Q 110 100 170 175 Q 230 110 290 190 T 400 170"
                  fill="none"
                  stroke="#0f3b23"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.5"
                />
                <path
                  d="M 600 160 Q 690 90 770 160 Q 830 110 890 170"
                  fill="none"
                  stroke="#0f3b23"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.5"
                />
                <text x="110" y="115" fill="#4d7c5f" fontSize="10" fontStyle="italic">
                  Jabal Al-Noor (Cave Hira)
                </text>
                <text x="730" y="115" fill="#4d7c5f" fontSize="10" fontStyle="italic">
                  Jabal Al-Rahmah (Arafat)
                </text>

                {/* ======================================================== */}
                {/* 1. PERMANENT BASE CONNECTIONS (Inactive Dimmed Paths)     */}
                {/* ======================================================== */}
                {/* Leg 1: Makkah (120, 320) to Mina (370, 200) */}
                <path
                  d="M 120 320 Q 230 240 370 200"
                  fill="none"
                  stroke="#0e4327"
                  strokeWidth="4"
                  strokeDasharray="5 5"
                />

                {/* Leg 2: Mina (370, 200) to Arafat (790, 350) via south bypass */}
                <path
                  d="M 370 200 Q 550 170 680 230 T 790 350"
                  fill="none"
                  stroke="#0e4327"
                  strokeWidth="4"
                  strokeDasharray="5 5"
                />

                {/* Leg 3: Arafat (790, 350) to Muzdalifah (570, 250) (Nafrah Route) */}
                <path
                  d="M 790 350 Q 690 320 570 250"
                  fill="none"
                  stroke="#0e4327"
                  strokeWidth="4"
                  strokeDasharray="5 5"
                />

                {/* Leg 4: Muzdalifah (570, 250) to Jamarat (280, 175) & Mina (370, 200) */}
                <path
                  d="M 570 250 Q 420 220 370 200"
                  fill="none"
                  stroke="#0e4327"
                  strokeWidth="4"
                  strokeDasharray="5 5"
                />
                <path
                  d="M 370 200 L 280 175"
                  fill="none"
                  stroke="#0e4327"
                  strokeWidth="4"
                  strokeDasharray="5 5"
                />

                {/* Leg 5: Jamarat (280, 175) to Makkah (120, 320) (Tawaf Ifadah Loop) */}
                <path
                  d="M 280 175 Q 170 220 120 320"
                  fill="none"
                  stroke="#0e4327"
                  strokeWidth="4"
                  strokeDasharray="5 5"
                />

                {/* ======================================================== */}
                {/* 2. DYNAMIC ACTIVE PATH SEGMENTS (Highlighted per Day)    */}
                {/* ======================================================== */}

                {/* Segment: makkah-to-mina (Day 1) */}
                {isSegmentActive('makkah-to-mina') && (
                  <path
                    d="M 120 320 Q 230 240 370 200"
                    fill="none"
                    stroke="url(#activeGoldGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="12 6"
                    className="animate-pulse"
                    filter="url(#glowGold)"
                    markerEnd="url(#arrowhead-gold)"
                  />
                )}

                {/* Segment: mina-to-arafat (Day 2) */}
                {isSegmentActive('mina-to-arafat') && (
                  <path
                    d="M 370 200 Q 550 170 680 230 T 790 350"
                    fill="none"
                    stroke="url(#activeGoldGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="12 6"
                    className="animate-pulse"
                    filter="url(#glowGold)"
                    markerEnd="url(#arrowhead-gold)"
                  />
                )}

                {/* Segment: arafat-to-muzdalifah (Day 2 Sunset) */}
                {isSegmentActive('arafat-to-muzdalifah') && (
                  <path
                    d="M 790 350 Q 690 320 570 250"
                    fill="none"
                    stroke="#f7e18b"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="10 5"
                    className="animate-pulse"
                    filter="url(#glowGold)"
                    markerEnd="url(#arrowhead-gold)"
                  />
                )}

                {/* Segment: muzdalifah-to-jamarat (Day 3) */}
                {isSegmentActive('muzdalifah-to-jamarat') && (
                  <path
                    d="M 570 250 Q 420 220 280 175"
                    fill="none"
                    stroke="url(#activeGoldGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="12 6"
                    className="animate-pulse"
                    filter="url(#glowGold)"
                    markerEnd="url(#arrowhead-gold)"
                  />
                )}

                {/* Segment: jamarat-to-makkah (Day 3) */}
                {isSegmentActive('jamarat-to-makkah') && (
                  <path
                    d="M 280 175 Q 170 220 120 320"
                    fill="none"
                    stroke="url(#activeGoldGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="12 6"
                    className="animate-pulse"
                    filter="url(#glowGold)"
                    markerEnd="url(#arrowhead-gold)"
                  />
                )}

                {/* Segment: makkah-to-mina-return (Day 3 evening) */}
                {isSegmentActive('makkah-to-mina-return') && (
                  <path
                    d="M 120 320 Q 230 240 370 200"
                    fill="none"
                    stroke="#e6c964"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="8 4"
                    markerEnd="url(#arrowhead-gold)"
                  />
                )}

                {/* Segment: mina-internal-jamarat (Day 4) */}
                {isSegmentActive('mina-internal-jamarat') && (
                  <path
                    d="M 370 200 L 280 175"
                    fill="none"
                    stroke="#f7e18b"
                    strokeWidth="8"
                    strokeLinecap="round"
                    filter="url(#glowGold)"
                  />
                )}

                {/* Segment: mina-to-makkah-final (Day 5) */}
                {isSegmentActive('mina-to-makkah-final') && (
                  <path
                    d="M 370 200 Q 220 220 120 320"
                    fill="none"
                    stroke="url(#activeGoldGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="12 6"
                    filter="url(#glowGold)"
                    markerEnd="url(#arrowhead-gold)"
                  />
                )}

                {/* ======================================================== */}
                {/* 3. SANCTUARY HUBS & PINS (Interactive Nodes)             */}
                {/* ======================================================== */}

                {/* NODE 1: MAKKAH (Holy Kaaba & Grand Mosque) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => handleLocationClick('makkah')}
                  onMouseEnter={() => setHoveredLocationId('makkah')}
                  onMouseLeave={() => setHoveredLocationId(null)}
                >
                  {/* Outer pulsating ring if selected */}
                  {(selectedLocationId === 'makkah' || hoveredLocationId === 'makkah') && (
                    <circle cx="120" cy="320" r="32" fill="#c9a227" opacity="0.2" className="animate-ping" />
                  )}
                  <circle
                    cx="120"
                    cy="320"
                    r="24"
                    fill="#032b19"
                    stroke={selectedLocationId === 'makkah' ? '#e6c964' : '#c9a227'}
                    strokeWidth={selectedLocationId === 'makkah' ? '3.5' : '2'}
                    filter="url(#glowGold)"
                  />
                  {/* Stylized Kaaba Cube Icon */}
                  <rect x="110" y="310" width="20" height="20" rx="3" fill="#111827" stroke="#c9a227" strokeWidth="1.5" />
                  <line x1="110" y1="316" x2="130" y2="316" stroke="#e6c964" strokeWidth="1.5" />

                  {/* Label */}
                  <text x="120" y="360" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
                    Makkah (Haram)
                  </text>
                  <text x="120" y="375" textAnchor="middle" fill="#c9a227" fontSize="10">
                    Rotana Jabal Omar (150m)
                  </text>
                </g>

                {/* NODE 2: JAMARAT BRIDGE (Stoning Pillars) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => handleLocationClick('jamarat')}
                  onMouseEnter={() => setHoveredLocationId('jamarat')}
                  onMouseLeave={() => setHoveredLocationId(null)}
                >
                  {(selectedLocationId === 'jamarat' || hoveredLocationId === 'jamarat') && (
                    <circle cx="280" cy="175" r="26" fill="#c9a227" opacity="0.25" className="animate-ping" />
                  )}
                  <circle
                    cx="280"
                    cy="175"
                    r="18"
                    fill="#032b19"
                    stroke={selectedLocationId === 'jamarat' ? '#e6c964' : '#c9a227'}
                    strokeWidth={selectedLocationId === 'jamarat' ? '3' : '1.5'}
                  />
                  {/* 3 Pillar Dots */}
                  <circle cx="274" cy="175" r="2" fill="#e6c964" />
                  <circle cx="280" cy="175" r="2.5" fill="#e6c964" />
                  <circle cx="286" cy="175" r="3" fill="#e6c964" />

                  <text x="280" y="148" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
                    Jamarat Bridge
                  </text>
                  <text x="280" y="160" textAnchor="middle" fill="#e6c964" fontSize="9">
                    Ramy Pillars
                  </text>
                </g>

                {/* NODE 3: MINA (Tent City / Makteb-C) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => handleLocationClick('mina')}
                  onMouseEnter={() => setHoveredLocationId('mina')}
                  onMouseLeave={() => setHoveredLocationId(null)}
                >
                  {(selectedLocationId === 'mina' || hoveredLocationId === 'mina') && (
                    <circle cx="370" cy="200" r="32" fill="#c9a227" opacity="0.2" className="animate-ping" />
                  )}
                  <circle
                    cx="370"
                    cy="200"
                    r="24"
                    fill="#032b19"
                    stroke={selectedLocationId === 'mina' ? '#e6c964' : '#c9a227'}
                    strokeWidth={selectedLocationId === 'mina' ? '3.5' : '2'}
                    filter="url(#glowGold)"
                  />
                  {/* Stylized White Tent Triangle */}
                  <polygon points="370,188 358,210 382,210" fill="#ffffff" stroke="#c9a227" strokeWidth="1" />
                  <line x1="370" y1="188" x2="370" y2="210" stroke="#032b19" strokeWidth="1" />

                  <text x="370" y="238" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
                    Mina Valley
                  </text>
                  <text x="370" y="252" textAnchor="middle" fill="#c9a227" fontSize="10">
                    Makteb-C AC Tents
                  </text>
                </g>

                {/* NODE 4: MUZDALIFAH (Open-Air Plain) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => handleLocationClick('muzdalifah')}
                  onMouseEnter={() => setHoveredLocationId('muzdalifah')}
                  onMouseLeave={() => setHoveredLocationId(null)}
                >
                  {(selectedLocationId === 'muzdalifah' || hoveredLocationId === 'muzdalifah') && (
                    <circle cx="570" cy="250" r="30" fill="#c9a227" opacity="0.2" className="animate-ping" />
                  )}
                  <circle
                    cx="570"
                    cy="250"
                    r="22"
                    fill="#032b19"
                    stroke={selectedLocationId === 'muzdalifah' ? '#e6c964' : '#c9a227'}
                    strokeWidth={selectedLocationId === 'muzdalifah' ? '3.5' : '2'}
                  />
                  {/* Crescent Moon & Pebbles Icon */}
                  <path
                    d="M 567 242 A 8 8 0 1 0 575 256 A 6 6 0 0 1 567 242 Z"
                    fill="#e6c964"
                  />
                  <circle cx="577" cy="246" r="1.5" fill="#ffffff" />
                  <circle cx="579" cy="252" r="1.5" fill="#ffffff" />

                  <text x="570" y="288" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                    Muzdalifah
                  </text>
                  <text x="570" y="302" textAnchor="middle" fill="#c9a227" fontSize="10">
                    Open Sky &amp; Pebbles
                  </text>
                </g>

                {/* NODE 5: ARAFAT (Mount of Mercy & Plain) */}
                <g
                  className="cursor-pointer group"
                  onClick={() => handleLocationClick('arafat')}
                  onMouseEnter={() => setHoveredLocationId('arafat')}
                  onMouseLeave={() => setHoveredLocationId(null)}
                >
                  {(selectedLocationId === 'arafat' || hoveredLocationId === 'arafat') && (
                    <circle cx="790" cy="350" r="34" fill="#c9a227" opacity="0.25" className="animate-ping" />
                  )}
                  <circle
                    cx="790"
                    cy="350"
                    r="26"
                    fill="#032b19"
                    stroke={selectedLocationId === 'arafat' ? '#e6c964' : '#c9a227'}
                    strokeWidth={selectedLocationId === 'arafat' ? '4' : '2.5'}
                    filter="url(#glowGold)"
                  />
                  {/* Sunnah Supplication Hands / Mountain Icon */}
                  <polygon points="790,335 776,360 804,360" fill="#c9a227" />
                  <rect x="788" y="330" width="4" height="7" fill="#ffffff" />

                  <text x="790" y="392" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">
                    Plains of Arafat
                  </text>
                  <text x="790" y="407" textAnchor="middle" fill="#e6c964" fontSize="10">
                    Jabal al-Rahmah · Wuqoof
                  </text>
                </g>

                {/* Distance Measurement Badges on Canvas */}
                <g opacity="0.75" fontSize="10" fill="#9ca3af" textAnchor="middle">
                  <rect x="210" y="245" width="55" height="18" rx="4" fill="#01140a" stroke="#0e4327" />
                  <text x="237" y="258" fill="#e6c964" fontSize="9">8 km</text>

                  <rect x="525" y="170" width="60" height="18" rx="4" fill="#01140a" stroke="#0e4327" />
                  <text x="555" y="183" fill="#e6c964" fontSize="9">13 km</text>

                  <rect x="670" y="325" width="55" height="18" rx="4" fill="#01140a" stroke="#0e4327" />
                  <text x="697" y="338" fill="#e6c964" fontSize="9">9 km</text>

                  <rect x="440" y="235" width="55" height="18" rx="4" fill="#01140a" stroke="#0e4327" />
                  <text x="467" y="248" fill="#e6c964" fontSize="9">4 km</text>
                </g>

                {/* Compass Rose */}
                <g transform="translate(850, 60)" opacity="0.8">
                  <circle cx="0" cy="0" r="22" fill="#021f12" stroke="#c9a227" strokeWidth="1" />
                  <polygon points="0,-16 4,0 -4,0" fill="#e6c964" />
                  <polygon points="0,16 4,0 -4,0" fill="#4d7c5f" />
                  <text x="0" y="-7" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">N</text>
                  <text x="0" y="28" textAnchor="middle" fill="#9ca3af" fontSize="8">East (Arafat)</text>
                </g>
              </svg>
            </div>

            {/* Bottom Quick Legend */}
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/80">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#c9a227] inline-block"></span>
                  <span>Active Day {activeDay.dayNumber} Route</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-[#0e4327] inline-block"></span>
                  <span>General Hajj Corridor</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Bus className="w-3 h-3 text-emerald-400" />
                  <span>Al-Israj AC Luxury Bus Route</span>
                </span>
              </div>
              <span className="text-[#c9a227] font-medium">Total Loop: ~45–50 km</span>
            </div>
          </div>

          {/* Right Column: Detailed Itinerary & Rites Card (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#021f12] via-[#032b19] to-[#021f12] rounded-3xl border-2 border-[#c9a227]/40 p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="rounded-full bg-[#c9a227]/25 border border-[#c9a227]/50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#e6c964]">
                  {activeDay.hijriDate}
                </span>
                <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                  <Bus className="w-3.5 h-3.5" />
                  {activeDay.travelDistanceKm} km · {activeDay.travelMode.split(' (')[0]}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                {activeDay.islamicTitle}
              </h3>
              <p className="text-xs font-medium text-[#c9a227] mt-1">
                {activeDay.englishTitle}
              </p>

              {/* Day Narrative Summary */}
              <p className="mt-4 text-xs sm:text-sm text-white/85 leading-relaxed bg-black/30 p-3.5 rounded-2xl border border-white/10">
                {activeDay.summary}
              </p>

              {/* Key Rites to Perform */}
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#e6c964] flex items-center gap-1.5 mb-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#c9a227]" />
                  Essential Rites &amp; Sunnah Actions
                </h4>
                <ul className="space-y-2">
                  {activeDay.keyRites.map((rite, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-white/90">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#c9a227]/20 text-[#c9a227] font-bold text-[10px] mt-0.5 border border-[#c9a227]/40">
                        {idx + 1}
                      </span>
                      <span>{rite}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sunnah Supplication (Dua) Box */}
              <div className="mt-5 rounded-2xl bg-emerald-950/70 border border-emerald-400/40 p-3 sm:p-4">
                <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 mb-1">
                  Authentic Sunnah Supplication
                </p>
                <p className="font-arabic text-sm sm:text-base text-[#f4df8f] text-right leading-relaxed">
                  {activeDay.recommendedDua}
                </p>
              </div>

              {/* Al-Israj Logistics & Facilitation */}
              <div className="mt-5 rounded-2xl bg-black/40 border border-[#c9a227]/30 p-3 sm:p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#c9a227] shrink-0 mt-0.5" />
                <div className="text-xs text-white/85">
                  <strong className="text-[#e6c964] block mb-0.5">Al-Israj Group Facilitation:</strong>
                  {activeDay.alIsrajSupport}
                </div>
              </div>
            </div>

            {/* Bottom Sanctuary Spotlight Drawer */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold uppercase tracking-wider text-[#e6c964]">
                  Sanctuary Focus: {activeLocation.name.split(' (')[0]}
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/80">
                  {activeLocation.badge}
                </span>
              </div>
              <p className="text-[11px] text-white/80 line-clamp-2">
                {activeLocation.significance}
              </p>

              {/* Next Day Navigation Button */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectDay((selectedDayIndex + RITUAL_DAYS.length - 1) % RITUAL_DAYS.length)}
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/15 transition"
                >
                  ← Prev Day
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDay((selectedDayIndex + 1) % RITUAL_DAYS.length)}
                  className="rounded-full bg-[#c9a227] hover:bg-[#e6c964] text-[#032b19] px-4 py-1.5 text-xs font-bold transition flex items-center gap-1 shadow"
                >
                  Next: Day {((selectedDayIndex + 1) % RITUAL_DAYS.length) + 1}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Sanctuary Cards Grid (Makkah, Mina, Arafat, Muzdalifah) */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            RITUAL_LOCATIONS.makkah,
            RITUAL_LOCATIONS.mina,
            RITUAL_LOCATIONS.arafat,
            RITUAL_LOCATIONS.muzdalifah,
          ].map((loc) => {
            const isSelected = selectedLocationId === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => handleLocationClick(loc.id)}
                className={`cursor-pointer rounded-3xl p-5 border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-[#043d24] to-[#022415] border-[#c9a227] shadow-xl ring-2 ring-[#c9a227]/40 scale-[1.02]'
                    : 'bg-[#021c10]/80 border-white/10 hover:border-white/30 hover:bg-[#032918]'
                }`}
              >
                <div>
                  <div className="relative overflow-hidden rounded-2xl mb-4 h-32 border border-[#c9a227]/30">
                    <img
                      src={loc.imageThumbnail}
                      alt={loc.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 rounded-full bg-black/80 border border-[#c9a227]/60 px-2.5 py-0.5 text-[10px] font-bold text-[#e6c964] backdrop-blur-sm">
                      {loc.badge}
                    </span>
                  </div>

                  <h4 className="font-serif text-base font-bold text-white leading-tight">
                    {loc.name.split(' (')[0]}
                  </h4>
                  <p className="font-arabic text-xs text-[#c9a227] mt-0.5">
                    {loc.arabicName.split(' · ')[0]}
                  </p>
                  <p className="text-xs text-white/80 mt-2 leading-relaxed">
                    {loc.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#e6c964]">
                  <span>Explore Rites</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HajjRitualMap;
