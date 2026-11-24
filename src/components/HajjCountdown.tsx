import React, { useState, useEffect } from 'react';
import { Calendar, Sparkles, AlertCircle } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

// Target estimated start date of Hajj 2027 (8 Dhul Hijjah 1448 AH)
// Corresponding to Friday, May 14, 2027 in Makkah
const HAJJ_2027_TARGET_TIMESTAMP = new Date('2027-05-14T00:00:00+03:00').getTime();

export const HajjCountdown: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = HAJJ_2027_TARGET_TIMESTAMP - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, totalMs: difference });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`mx-auto max-w-3xl rounded-3xl bg-emerald-950/75 backdrop-blur-md border border-[#c9a227]/40 p-5 sm:p-7 shadow-2xl select-none ${className}`}
    >
      {/* Registration Deadline Alert Banner */}
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-amber-500/25 via-amber-500/15 to-transparent border border-amber-400/50 p-3 sm:p-3.5 flex items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-[#032b19] shrink-0 font-bold text-sm shadow">
            ⚠️
          </span>
          <div>
            <div className="text-xs sm:text-sm font-bold text-amber-200 flex items-center gap-2 flex-wrap">
              <span>Registration Status:</span>
              <span className="bg-amber-400 text-[#032b19] px-2.5 py-0.5 rounded-md font-black text-xs sm:text-sm shadow-sm">
                Only Few Slots Remaining
              </span>
            </div>
            <p className="text-[11px] text-white/85 mt-0.5">
              Official MORA private quota allocations are filling up rapidly on a first-come, first-served basis.
            </p>
          </div>
        </div>
        <a
          href="#contact"
          className="shrink-0 px-3.5 py-1.5 rounded-full bg-[#c9a227] hover:bg-[#e6c964] text-[#032b19] font-bold text-xs shadow-md transition hidden sm:inline-block"
        >
          Reserve Token &rarr;
        </a>
      </div>

      {/* Header bar: Urgency banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#c9a227]/25 pb-4 text-center sm:text-left">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e6c964]">
            <Sparkles className="w-3.5 h-3.5 text-[#c9a227] animate-pulse" />
            Days Until Hajj 2027 / 1448 AH
          </div>
          <p className="text-xs sm:text-sm text-white/80 mt-0.5">
            Expected 8th Dhul Hijjah 1448 AH (May 14, 2027) · Official Quota Booking Open
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c9a227]/20 border border-[#c9a227]/50 text-[#c9a227] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Booking Active
          </span>
        </div>
      </div>

      {/* Countdown 4-Box Grid */}
      <div className="mt-5 grid grid-cols-4 gap-2.5 sm:gap-4 text-center">
        {/* Days */}
        <div className="rounded-2xl bg-black/45 border border-[#c9a227]/30 p-3 sm:p-4 shadow-inner">
          <div className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#e6c964] tabular-nums tracking-tight">
            {timeLeft.days}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70 mt-1 font-semibold">
            Days
          </div>
        </div>

        {/* Hours */}
        <div className="rounded-2xl bg-black/45 border border-[#c9a227]/30 p-3 sm:p-4 shadow-inner">
          <div className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#e6c964] tabular-nums tracking-tight">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70 mt-1 font-semibold">
            Hours
          </div>
        </div>

        {/* Minutes */}
        <div className="rounded-2xl bg-black/45 border border-[#c9a227]/30 p-3 sm:p-4 shadow-inner">
          <div className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#e6c964] tabular-nums tracking-tight">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70 mt-1 font-semibold">
            Minutes
          </div>
        </div>

        {/* Seconds */}
        <div className="rounded-2xl bg-black/45 border border-[#c9a227]/30 p-3 sm:p-4 shadow-inner">
          <div className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#e6c964] tabular-nums tracking-tight">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-white/70 mt-1 font-semibold">
            Seconds
          </div>
        </div>
      </div>

      {/* Sub-note encouraging timely token reservation */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px] text-white/70">
        <span className="flex items-center gap-1.5 text-white/80">
          <Calendar className="w-3.5 h-3.5 text-[#c9a227]" />
          Pilgrimage dates subject to moon sighting by Supreme Court of Saudi Arabia
        </span>
        <a
          href="#packages"
          className="text-[#e6c964] hover:text-white font-semibold underline underline-offset-2 transition"
        >
          Explore MORA Approved Packages &rarr;
        </a>
      </div>
    </div>
  );
};

export default HajjCountdown;
