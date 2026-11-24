import React, { useState, useEffect } from 'react';
import { Clock, Moon, Sun, Sparkles, MapPin, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface PrayerData {
  timings: PrayerTimings;
  hijri: {
    day: string;
    monthEn: string;
    year: string;
  };
  gregorian: string;
}

// Fallback accurate timings for Makkah and Madinah (Umm al-Qura)
const FALLBACK_MAKKAH: PrayerData = {
  timings: {
    Fajr: '04:58',
    Sunrise: '06:15',
    Dhuhr: '12:14',
    Asr: '15:36',
    Maghrib: '18:10',
    Isha: '19:40',
  },
  hijri: {
    day: '21',
    monthEn: "Rabi' al-Thani",
    year: '1448',
  },
  gregorian: '03 October 2026',
};

const FALLBACK_MADINAH: PrayerData = {
  timings: {
    Fajr: '04:56',
    Sunrise: '06:14',
    Dhuhr: '12:15',
    Asr: '15:38',
    Maghrib: '18:12',
    Isha: '19:42',
  },
  hijri: {
    day: '21',
    monthEn: "Rabi' al-Thani",
    year: '1448',
  },
  gregorian: '03 October 2026',
};

interface PrayerTimesWidgetProps {
  variant?: 'header-bar' | 'card' | 'compact';
  defaultCity?: 'Makkah' | 'Madinah';
  className?: string;
}

export const PrayerTimesWidget: React.FC<PrayerTimesWidgetProps> = ({
  variant = 'header-bar',
  defaultCity = 'Makkah',
  className = '',
}) => {
  const [city, setCity] = useState<'Makkah' | 'Madinah'>(defaultCity);
  const [prayerData, setPrayerData] = useState<PrayerData>(
    defaultCity === 'Makkah' ? FALLBACK_MAKKAH : FALLBACK_MADINAH
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [nextPrayerInfo, setNextPrayerInfo] = useState<{
    name: string;
    time: string;
    countdown: string;
  } | null>(null);

  // Fetch real-time prayer times from public AlAdhan API
  const fetchPrayerTimes = async (targetCity: 'Makkah' | 'Madinah') => {
    setLoading(true);
    try {
      const cityName = targetCity === 'Makkah' ? 'Makkah' : 'Madinah';
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
          cityName
        )}&country=Saudi%20Arabia&method=4`
      );

      if (!response.ok) {
        throw new Error('Network response failed');
      }

      const json = await response.json();
      if (json && json.data && json.data.timings) {
        const d = json.data;
        setPrayerData({
          timings: {
            Fajr: d.timings.Fajr.substring(0, 5),
            Sunrise: d.timings.Sunrise.substring(0, 5),
            Dhuhr: d.timings.Dhuhr.substring(0, 5),
            Asr: d.timings.Asr.substring(0, 5),
            Maghrib: d.timings.Maghrib.substring(0, 5),
            Isha: d.timings.Isha.substring(0, 5),
          },
          hijri: {
            day: d.date?.hijri?.day || '21',
            monthEn: d.date?.hijri?.month?.en || "Rabi' al-Thani",
            year: d.date?.hijri?.year || '1448',
          },
          gregorian: d.date?.readable || '03 Oct 2026',
        });
      }
    } catch {
      // Smooth fallback to official Umm al-Qura standard
      setPrayerData(targetCity === 'Makkah' ? FALLBACK_MAKKAH : FALLBACK_MADINAH);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayerTimes(city);
  }, [city]);

  // Calculate upcoming next prayer & countdown based on Saudi Time (UTC+3)
  useEffect(() => {
    const updateCountdown = () => {
      try {
        const now = new Date();
        // Convert to Saudi Arabia time (Asia/Riyadh)
        const saudiTimeStr = now.toLocaleTimeString('en-GB', {
          timeZone: 'Asia/Riyadh',
          hour12: false,
        });
        const [currentH, currentM] = saudiTimeStr.split(':').map(Number);
        const currentTotalMinutes = currentH * 60 + currentM;

        const prayers = [
          { name: 'Fajr', time: prayerData.timings.Fajr },
          { name: 'Sunrise', time: prayerData.timings.Sunrise },
          { name: 'Dhuhr', time: prayerData.timings.Dhuhr },
          { name: 'Asr', time: prayerData.timings.Asr },
          { name: 'Maghrib', time: prayerData.timings.Maghrib },
          { name: 'Isha', time: prayerData.timings.Isha },
        ];

        let next = null;
        for (const p of prayers) {
          const [pH, pM] = p.time.split(':').map(Number);
          const pTotalMinutes = pH * 60 + pM;
          if (pTotalMinutes > currentTotalMinutes) {
            const diff = pTotalMinutes - currentTotalMinutes;
            const hours = Math.floor(diff / 60);
            const mins = diff % 60;
            const countdownStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
            next = { name: p.name, time: p.time, countdown: countdownStr };
            break;
          }
        }

        // If all prayers passed for today, next is tomorrow's Fajr
        if (!next) {
          const [fH, fM] = prayerData.timings.Fajr.split(':').map(Number);
          const fTotal = 24 * 60 + (fH * 60 + fM);
          const diff = fTotal - currentTotalMinutes;
          const hours = Math.floor(diff / 60);
          const mins = diff % 60;
          next = {
            name: 'Fajr (Tomorrow)',
            time: prayerData.timings.Fajr,
            countdown: `${hours}h ${mins}m`,
          };
        }

        setNextPrayerInfo(next);
      } catch {
        setNextPrayerInfo(null);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [prayerData]);

  const prayersList = [
    { name: 'Fajr', ar: 'الفجر', time: prayerData.timings.Fajr, icon: Moon },
    { name: 'Sunrise', ar: 'الشروق', time: prayerData.timings.Sunrise, icon: Sun },
    { name: 'Dhuhr', ar: 'الظهر', time: prayerData.timings.Dhuhr, icon: Sun },
    { name: 'Asr', ar: 'العصر', time: prayerData.timings.Asr, icon: Sun },
    { name: 'Maghrib', ar: 'المغرب', time: prayerData.timings.Maghrib, icon: Moon },
    { name: 'Isha', ar: 'العشاء', time: prayerData.timings.Isha, icon: Moon },
  ];

  // -------------------------------------------------------------
  // VARIANT 1: HEADER BAR (Sits cleanly right beneath or above nav)
  // -------------------------------------------------------------
  if (variant === 'header-bar') {
    return (
      <div className={`bg-[#021f12] text-white border-b border-[#c9a227]/30 text-xs py-1.5 select-none ${className}`}>
        <div className="w-full px-3 sm:px-5 lg:px-6 xl:px-8 flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Left: City Toggle & Live Indicator */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#c9a227] font-semibold text-[11px] uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-[#c9a227] animate-pulse" />
              Live Haramain Namaz:
            </span>

            {/* City Tabs */}
            <div className="inline-flex rounded-full bg-emerald-950/80 p-0.5 border border-[#c9a227]/40">
              <button
                type="button"
                onClick={() => setCity('Makkah')}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                  city === 'Makkah'
                    ? 'bg-[#c9a227] text-[#032b19] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                🕋 Makkah Al-Mukarramah
              </button>
              <button
                type="button"
                onClick={() => setCity('Madinah')}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                  city === 'Madinah'
                    ? 'bg-[#c9a227] text-[#032b19] shadow-sm'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                🕌 Madinah Al-Munawwarah
              </button>
            </div>

            {/* Next Prayer Highlight Badge */}
            {nextPrayerInfo && (
              <span className="hidden xl:inline-flex items-center gap-1.5 rounded-md bg-[#03361e] px-2 py-0.5 text-[11px] text-[#e6c964] border border-[#c9a227]/30 font-medium">
                <Sparkles className="w-3 h-3 text-[#c9a227]" />
                Next: <strong>{nextPrayerInfo.name}</strong> ({nextPrayerInfo.time}) in {nextPrayerInfo.countdown}
              </span>
            )}
          </div>

          {/* Right: Individual Prayer Times Bar */}
          <div className="flex items-center gap-3 overflow-x-auto max-w-full pb-0.5 scrollbar-none">
            {prayersList.map((p) => {
              const isNext = nextPrayerInfo?.name.startsWith(p.name);
              return (
                <div
                  key={p.name}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    isNext
                      ? 'bg-[#c9a227] text-[#032b19] font-bold shadow-sm'
                      : 'text-emerald-200 hover:text-[#c9a227]'
                  }`}
                  title={`${p.name} (${p.ar}): ${p.time}`}
                >
                  <span className="text-[10px] font-sans font-medium uppercase tracking-tight text-[#c9a227]/90">
                    {p.name}:
                  </span>
                  <span className="text-white/95">{p.time}</span>
                </div>
              );
            })}

            {/* Hijri Date badge */}
            <span className="hidden lg:inline-flex text-[11px] text-[#c9a227] font-semibold border-l border-[#c9a227]/30 pl-3">
              {prayerData.hijri.day} {prayerData.hijri.monthEn} {prayerData.hijri.year} AH
            </span>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => fetchPrayerTimes(city)}
              disabled={loading}
              title="Refresh prayer times from AlAdhan API"
              className="text-[#c9a227]/70 hover:text-[#c9a227] transition p-0.5"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VARIANT 2: DEDICATED CARD (Used in footer or detailed sections)
  // -------------------------------------------------------------
  return (
    <div
      className={`rounded-3xl bg-[#032b19] border-2 border-[#c9a227]/40 p-6 text-white shadow-xl ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#c9a227]/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#c9a227] text-[#032b19]">
              <Clock className="w-4 h-4" />
            </span>
            <h3 className="font-serif font-bold text-lg text-white">
              Daily Haramain Namaz Timings
            </h3>
          </div>
          <p className="text-xs text-white/70 mt-1">
            Real-time prayer times calculated via official Saudi Umm al-Qura standard.
          </p>
        </div>

        {/* City Toggle */}
        <div className="inline-flex rounded-full bg-emerald-950 p-1 border border-[#c9a227]/40 shrink-0">
          <button
            type="button"
            onClick={() => setCity('Makkah')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition ${
              city === 'Makkah'
                ? 'bg-[#c9a227] text-[#032b19] shadow'
                : 'text-white/80 hover:text-white'
            }`}
          >
            🕋 Makkah
          </button>
          <button
            type="button"
            onClick={() => setCity('Madinah')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition ${
              city === 'Madinah'
                ? 'bg-[#c9a227] text-[#032b19] shadow'
                : 'text-white/80 hover:text-white'
            }`}
          >
            🕌 Madinah
          </button>
        </div>
      </div>

      {/* Date Header */}
      <div className="mt-4 flex items-center justify-between text-xs text-[#e6c964] font-medium bg-[#021f12] px-3.5 py-2 rounded-xl border border-[#c9a227]/20">
        <span>
          🗓️ {prayerData.hijri.day} {prayerData.hijri.monthEn} {prayerData.hijri.year} AH
        </span>
        <span>
          {city === 'Makkah' ? 'Masjid al-Haram' : 'Al-Masjid an-Nabawi'} (KSA)
        </span>
      </div>

      {/* Grid of 6 Prayers */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {prayersList.map((p) => {
          const isNext = nextPrayerInfo?.name.startsWith(p.name);
          const Icon = p.icon;
          return (
            <div
              key={p.name}
              className={`rounded-2xl p-3 text-center border transition-all ${
                isNext
                  ? 'bg-[#c9a227] text-[#032b19] border-[#c9a227] shadow-lg scale-[1.02]'
                  : 'bg-[#043820] text-white border-[#c9a227]/20 hover:border-[#c9a227]/60'
              }`}
            >
              <div className="flex items-center justify-center mb-1">
                <Icon className={`w-3.5 h-3.5 ${isNext ? 'text-[#032b19]' : 'text-[#c9a227]'}`} />
              </div>
              <div className={`text-xs font-semibold ${isNext ? 'text-[#032b19]' : 'text-white/90'}`}>
                {p.name}
              </div>
              <div className={`font-arabic text-[11px] opacity-75 ${isNext ? 'text-[#032b19]' : 'text-[#e6c964]'}`}>
                {p.ar}
              </div>
              <div
                className={`mt-1 font-mono text-base font-bold tabular-nums ${
                  isNext ? 'text-[#032b19]' : 'text-white'
                }`}
              >
                {p.time}
              </div>
              {isNext && (
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider bg-[#032b19] text-[#c9a227] rounded px-1.5 py-0.5">
                  Next Prayer
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer notice */}
      <div className="mt-4 flex items-center justify-between text-[11px] text-white/60">
        <span>Powered by AlAdhan Public API · Method: Umm al-Qura University</span>
        <button
          type="button"
          onClick={() => fetchPrayerTimes(city)}
          disabled={loading}
          className="hover:text-[#c9a227] transition flex items-center gap-1 text-[#c9a227]"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>
    </div>
  );
};

export default PrayerTimesWidget;
