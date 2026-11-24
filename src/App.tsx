import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  CheckCircle2,
  FileText,
  Download,
  Star,
  ShieldCheck,
  Award,
  Users,
  Clock,
  X,
  Building2,
  Bus,
  Utensils,
  BookOpen,
  Sliders,
  Info,
  Gift,
  Snowflake,
  Heart,
  Droplet,
  IdCard,
  Check,
  Compass,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Syringe
} from 'lucide-react';
import { HAJJ_PACKAGES, HajjPackage } from './data/packages.ts';
import AlIsrajLogo from './components/AlIsrajLogo.tsx';
import PrayerTimesWidget from './components/PrayerTimesWidget.tsx';
import HajjCountdown from './components/HajjCountdown.tsx';
import PilgrimExperiences from './components/PilgrimExperiences.tsx';
import HajjRitualMap from './components/HajjRitualMap.tsx';
import HajjGuideModal from './components/HajjGuideModal.tsx';
import Haramain3DShowcase from './components/Haramain3DShowcase.tsx';
import ContactQRCard from './components/ContactQRCard.tsx';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Currency configuration for Overseas Pilgrims (MORA Remittance Reference Rates)
export const ESTIMATOR_CURRENCIES = {
  PKR: {
    code: 'PKR',
    symbol: 'PKR',
    flag: '🇵🇰',
    name: 'Pakistani Rupee',
    rate: 1,
    format: (val: number) => `PKR ${val.toLocaleString('en-PK')}/-`,
    shortFormat: (val: number) => `PKR ${val.toLocaleString('en-PK')}/-`,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    flag: '🇺🇸',
    name: 'US Dollar',
    rate: 278.5,
    format: (val: number) => `$${Math.round(val / 278.5).toLocaleString('en-US')}`,
    shortFormat: (val: number) => `$${Math.round(val / 278.5).toLocaleString('en-US')}`,
  },
  SAR: {
    code: 'SAR',
    symbol: 'SAR',
    flag: '🇸🇦',
    name: 'Saudi Riyal',
    rate: 74.25,
    format: (val: number) => `SAR ${Math.round(val / 74.25).toLocaleString('en-US')}`,
    shortFormat: (val: number) => `SAR ${Math.round(val / 74.25).toLocaleString('en-US')}`,
  },
} as const;

export type EstimatorCurrency = keyof typeof ESTIMATOR_CURRENCIES;

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [selectedPackageForModal, setSelectedPackageForModal] = useState<HajjPackage | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Dynamic Scroll-Progress Indicator calculation
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 'Scroll to Section' Utility ensuring headers never overlap with the sticky navbar
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement> | null,
    targetId: string
  ) => {
    if (e) {
      e.preventDefault();
    }
    const cleanId = targetId.replace(/^#/, '');
    const el = document.getElementById(cleanId);
    if (el) {
      // 88px sticky navbar height + 12px breathing cushion to guarantee full header clearance
      const headerOffset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });

      try {
        window.history.pushState(null, '', `#${cleanId}`);
      } catch {
        // Fallback for sandboxed or cross-origin preview frames
      }
    }
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // Estimator State
  const [calcPackageId, setCalcPackageId] = useState<string>(HAJJ_PACKAGES[1].id); // 18 Days default
  const [calcPilgrims, setCalcPilgrims] = useState<number>(2);
  const [calcRoomType, setCalcRoomType] = useState<'double' | 'triple' | 'sharing'>('triple');
  const [calcCurrency, setCalcCurrency] = useState<EstimatorCurrency>('PKR');

  // Inquiry Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formPackage, setFormPackage] = useState(
    'Package 2: 18±1 Days (Shifting) - MORA 2-95'
  );
  const [formRoom, setFormRoom] = useState('3-Bed (Triple Room)');
  const [formPilgrims, setFormPilgrims] = useState('2');
  const [formPassport, setFormPassport] = useState('Passport valid until after 16 Nov 2027');
  const [formNotes, setFormNotes] = useState('');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState<'all' | 'logistics' | 'vaccines' | 'hotels'>('all');

  const faqs = [
    {
      category: 'logistics',
      categoryLabel: 'Hajj Logistics',
      question: 'What is the operational difference between Package 1 (Fixed Aziziya) and Packages 2 & 3 (Shifting)?',
      answer:
        'Package 1 (14±1 Days Fixed Aziziya - MORA Code 1-131) allows pilgrims to retain continuous access to their Azizya room throughout the entire pilgrimage without moving luggage before Mina days. Packages 2 & 3 (18±1 Days MORA Code 2-95 & 27±1 Days MORA Code 3-55) are Shifting itineraries: pilgrims first stay at Rotana Jabal Omar Makkah (150m from Haram), shift to Sheesha/Azizya for the core 5 days of Hajj rituals, and subsequently travel to Madinah Munawwarah for a peaceful stay in the Central Markazia district.',
    },
    {
      category: 'logistics',
      categoryLabel: 'Hajj Logistics',
      question: 'How is seat-by-seat luxury transportation handled across the holy sanctuaries?',
      answer:
        'Every pilgrim registered with Al-Israj is allocated a dedicated, reserved seat on modern, high-deck air-conditioned luxury coaches. This covers all intercity transfers (Jeddah Airport ⇄ Makkah ⇄ Madinah) as well as all ritual movements during the 5 days of Hajj (Makkah to Mina, Mina to Arafat, Arafat to Muzdalifah, and back to Mina). Dedicated group supervisors accompany each coach to manage crowd logistics and ensure timely arrivals.',
    },
    {
      category: 'logistics',
      categoryLabel: 'Hajj Logistics',
      question: 'Can Overseas Pakistanis (from UK, USA, Gulf, Europe) register under Al-Israj MORA Quota?',
      answer:
        'Yes. Overseas Pakistanis are fully eligible to register under our official MORA private Hajj quota (Enrolment No: 1215/P) via authorized international remittances. We provide complete facilitation including Saudi electronic Hajj visa processing, Nusuk platform biometric validation, flight coordination arriving into either Jeddah or Madinah, and dedicated airport meet-and-greet services.',
    },
    {
      category: 'vaccines',
      categoryLabel: 'Vaccination & Health',
      question: 'Which vaccinations are strictly mandatory for Hajj 2027 entry into Saudi Arabia?',
      answer:
        'In strict compliance with Saudi Ministry of Health and Government of Pakistan protocols, all pilgrims must provide proof of: (1) Meningococcal Meningitis (ACWY conjugate vaccine) administered not less than 10 days before departure; (2) Polio Oral/Inactivated Booster (OPV/IPV) for all Pakistani passport holders regardless of age; (3) Seasonal Influenza quadrivalent vaccine; and (4) COVID-19 approved vaccination verified through the official NADRA electronic certificate with QR code.',
    },
    {
      category: 'vaccines',
      categoryLabel: 'Vaccination & Health',
      question: 'What health verification and medical fitness documents must senior citizens provide?',
      answer:
        'All applicants must submit an authorized physician medical fitness certificate confirming they are physically capable of performing Manasik-e-Hajj, along with an official laboratory blood group report. For elderly pilgrims, senior citizens, or pilgrims with mobility challenges, Al-Israj arranges specialized wheelchair assistance and dedicated group assistants for Tawaf, Sai, and Jamarat stoning rituals.',
    },
    {
      category: 'hotels',
      categoryLabel: 'Hotel Facilities',
      question: 'What is the exact walking distance and facilities at Rotana Jabal Omar Makkah?',
      answer:
        'Rotana Jabal Omar Makkah is situated just 150 meters walking distance (an effortless 2-minute level walk) from the outer courtyard of the Holy Haram. The hotel features multiple elevator banks designed to minimize waiting times, 24/7 guest concierge, live internal audio transmission of Haram prayers directly into rooms, and expansive buffet restaurants serving fresh Pakistani and international cuisine.',
    },
    {
      category: 'hotels',
      categoryLabel: 'Hotel Facilities',
      question: 'How accessible are the contracted Markazia hotels in Madinah Munawwarah?',
      answer:
        'Our contracted hotels in Madinah Munawwarah are situated in the prestigious Central Markazia North/Central zone, only 250 to 300 meters from Bab-e-Salam and the Prophet’s Sacred Chamber (Roza Mubarak). The walk is completely flat and pedestrianized. Hotel amenities include high-speed Wi-Fi, 24-hour room service, daily housekeeping, en-suite sanitized bathrooms, and luggage handling upon arrival.',
    },
    {
      category: 'hotels',
      categoryLabel: 'Hotel Facilities',
      question: 'What living facilities and amenities are provided inside our Makteb-C Mina and Arafat camps?',
      answer:
        'Our official MORA-approved Makteb-C camps in Mina and Arafat are constructed with fire-retardant gypsum walling and equipped with high-capacity split air-conditioning systems. Each pilgrim is allocated an individual foldable sofa-bed with clean mattress, pillow, and fresh bedsheets. Camps feature continuous 24-hour Pakistani buffet catering (breakfast, lunch, dinner), unlimited chilled drinking water, hot tea bars, private electrical device charging stations, and dedicated sanitized washroom blocks maintained by full-time cleaning staff.',
    },
  ];

  const filteredFaqs =
    faqCategory === 'all'
      ? faqs
      : faqs.filter((f) => f.category === faqCategory);
  const [checkedDocs, setCheckedDocs] = useState<{ [key: string]: boolean }>({
    passport: true,
    cnic: true,
  });

  const toggleDoc = (key: string) => {
    setCheckedDocs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activeEstimatorPackage =
    HAJJ_PACKAGES.find((p) => p.id === calcPackageId) || HAJJ_PACKAGES[0];
  const unitCost = activeEstimatorPackage.rates[calcRoomType];
  const totalCost = unitCost * calcPilgrims;

  const handleHajjSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) return;

    const message = `🕋 *HAJJ 2027 SEAT RESERVATION INQUIRY*%0A*Company:* Al-Israj International Travels Pvt. Ltd. (MORA 1215/P)%0A%0A*Pilgrim Name:* ${encodeURIComponent(
      formName
    )}%0A*Phone/WhatsApp:* ${encodeURIComponent(formPhone)}%0A*Location:* ${encodeURIComponent(
      formCity || 'Not specified'
    )}%0A*Selected Package:* ${encodeURIComponent(
      formPackage
    )}%0A*Room Category:* ${encodeURIComponent(
      formRoom
    )}%0A*No. of Pilgrims:* ${encodeURIComponent(
      formPilgrims
    )}%0A*Passport Status:* ${encodeURIComponent(formPassport)}${
      formNotes ? `%0A*Special Notes:* ${encodeURIComponent(formNotes)}` : ''
    }%0A%0APlease confirm slot availability and payment procedure.`;

    window.open(`https://wa.link/47g4xb?text=${message}`, '_blank');
  };

  const handleEstimatorWhatsApp = () => {
    const roomLabel =
      calcRoomType === 'double'
        ? '2-Bed (Double)'
        : calcRoomType === 'triple'
        ? '3-Bed (Triple)'
        : 'Sharing Basis';

    const curr = ESTIMATOR_CURRENCIES[calcCurrency];
    const formattedUnit = curr.format(unitCost);
    const formattedTotal = curr.format(totalCost);
    const currencySuffix =
      calcCurrency !== 'PKR'
        ? `%0A*Converted Currency:* ${calcCurrency} (${curr.name})%0A*Official Base Total:* PKR ${totalCost.toLocaleString(
            'en-PK'
          )}/-%0A*Reference Rate:* 1 ${calcCurrency} ≈ ${curr.rate} PKR`
        : '';

    const message = `🕋 *HAJJ 2027 ESTIMATE INQUIRY*%0A*Company:* Al-Israj International Travels (MORA 1215/P)%0A%0A*Package:* ${encodeURIComponent(
      activeEstimatorPackage.title
    )} (${activeEstimatorPackage.moraCode})%0A*Room Category:* ${encodeURIComponent(
      roomLabel
    )}%0A*Pilgrims:* ${calcPilgrims} Person(s)%0A*Rate / Pilgrim:* ${encodeURIComponent(
      formattedUnit
    )}%0A*Estimated Total:* ${encodeURIComponent(
      formattedTotal
    )}${currencySuffix}%0A%0APlease confirm registration token availability and booking requirements.`;

    window.open(`https://wa.link/47g4xb?text=${message}`, '_blank');
  };

  const docItems = [
    {
      id: 'passport',
      title: 'Original Passport',
      desc: 'Machine-readable or e-Passport valid until at least 16 November 2027.',
    },
    {
      id: 'cnic',
      title: 'Clear CNIC Copy',
      desc: 'Smart National ID card (or NADRA B-Form for minors under 18 years).',
    },
    {
      id: 'contact',
      title: 'Contact & Blood Group',
      desc: 'Verified WhatsApp mobile line & physician verified blood group report.',
    },
    {
      id: 'kin',
      title: 'Next of Kin Details',
      desc: 'Emergency relative name, relationship, CNIC copy, and active contact number.',
    },
  ];

  const readyCount = Object.values(checkedDocs).filter(Boolean).length;
  const readinessPercentage = Math.round((readyCount / docItems.length) * 100);

  return (
    <div className="min-h-screen bg-[#fcfbf7] text-slate-800 antialiased selection:bg-[#c9a227] selection:text-[#032b19] overflow-x-hidden">
      {/* Precision 24K Gold Top Scroll-Progress Indicator */}
      <div
        className="fixed top-0 left-0 right-0 z-[70] h-0.5 sm:h-1 bg-[#021f12]/40 backdrop-blur-xs pointer-events-none transition-opacity duration-300"
        style={{ opacity: scrollProgress > 0 ? 1 : 0 }}
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-[#9a7913] via-[#f7df8e] to-[#c9a227] shadow-[0_0_10px_rgba(201,162,39,0.85)] transition-all duration-75 ease-out rounded-r-full"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Top Announcement Bar */}
      <aside
        aria-label="Official Hajj Announcement"
        className="bg-[#021f12] text-white text-xs border-b border-[#c9a227]/25"
      >
        <div className="w-full px-3 sm:px-5 lg:px-6 xl:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-center sm:text-left text-white/90">
            <span className="bg-[#c9a227] text-[#032b19] font-black tracking-wider uppercase text-[10px] sm:text-[11px] px-2 py-0.5 rounded shadow-sm">
              Only Few Slots Remaining
            </span>
            <span className="text-white/40 hidden sm:inline">·</span>
            <span className="text-white/80 hidden md:inline">
              MORA Approved Private HGO (ENRO #: 1215/P)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://wa.link/47g4xb"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#dfb235] transition flex items-center gap-1.5 text-emerald-300 font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Support
            </a>
            <span className="text-[#c9a227]/40 hidden sm:inline">·</span>
            <a
              href="tel:+923459900084"
              className="hover:text-[#dfb235] transition flex items-center gap-1.5 font-mono tabular-nums text-[#c9a227] font-semibold"
            >
              <Phone className="w-3 h-3 text-[#c9a227]" /> 0345-9900084
            </a>
          </div>
        </div>
      </aside>

      {/* Real-Time Live Haramain Prayer Times Bar (Makkah & Madinah) */}
      <PrayerTimesWidget variant="header-bar" defaultCity="Makkah" />

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#032b19]/95 backdrop-blur-md border-b border-[#c9a227]/20 shadow-md">
        <div className="w-full px-3 sm:px-5 lg:px-6 xl:px-8">
          <div className="flex min-h-[5.25rem] py-2 items-center justify-between gap-3 lg:gap-4">
            {/* Zone 1: Official Corporate Executive Logo Lockup in Left Corner */}
            <a
              href="#home"
              onClick={(e) => scrollToSection(e, 'home')}
              className="group flex items-center shrink-0 focus:outline-none transition-transform duration-200 hover:scale-[1.01]"
              title="Al-Israj International Travels (Pvt.) Ltd. - MORA Approved HGO # 1215/P"
            >
              <AlIsrajLogo variant="header" />
            </a>

            {/* Zone 2: Clean Text Navigation Links with Offset Scroll Utility */}
            <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 2xl:gap-6 text-xs xl:text-sm font-medium text-white/85">
              <a
                href="#home"
                onClick={(e) => scrollToSection(e, 'home')}
                className="hover:text-[#c9a227] transition"
              >
                Home
              </a>
              <a
                href="#sanctuary-3d"
                onClick={(e) => scrollToSection(e, 'sanctuary-3d')}
                className="hover:text-[#dfb235] transition font-semibold text-[#e6c964]"
              >
                3D Tour
              </a>
              <a
                href="#packages"
                onClick={(e) => scrollToSection(e, 'packages')}
                className="hover:text-[#c9a227] transition font-semibold text-[#c9a227]"
              >
                Packages
              </a>
              <a
                href="#accommodations"
                onClick={(e) => scrollToSection(e, 'accommodations')}
                className="hover:text-[#c9a227] transition"
              >
                Hotels
              </a>
              <a
                href="#estimator"
                onClick={(e) => scrollToSection(e, 'estimator')}
                className="hover:text-[#c9a227] transition"
              >
                Estimator
              </a>
              <a
                href="#inclusions"
                onClick={(e) => scrollToSection(e, 'inclusions')}
                className="hover:text-[#c9a227] transition"
              >
                Inclusions
              </a>
              <a
                href="#pilgrim-experiences"
                onClick={(e) => scrollToSection(e, 'pilgrim-experiences')}
                className="hover:text-[#c9a227] transition hidden xl:inline"
              >
                Experiences
              </a>
              <a
                href="#ritual-path"
                onClick={(e) => scrollToSection(e, 'ritual-path')}
                className="hover:text-[#c9a227] transition font-medium hidden 2xl:inline"
              >
                Ritual Path
              </a>
              <a
                href="#faq"
                onClick={(e) => scrollToSection(e, 'faq')}
                className="hover:text-[#c9a227] transition"
              >
                FAQ
              </a>
              <a
                href="#documents"
                onClick={(e) => scrollToSection(e, 'documents')}
                className="hover:text-[#c9a227] transition"
              >
                Documents
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, 'contact')}
                className="hover:text-[#c9a227] transition"
              >
                Contact
              </a>
            </nav>

            {/* Zone 3: Primary Actions (Fully Visible with Zero Clipping on WhatsApp Button) */}
            <div className="hidden sm:flex items-center gap-2 xl:gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setGuideModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#c9a227] bg-[#c9a227]/15 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-[#c9a227] hover:bg-[#c9a227] hover:text-[#032b19] transition shrink-0 whitespace-nowrap"
                title="Download Hajj 2027 Essential Guide PDF"
              >
                <Download className="w-3.5 h-3.5 text-[#c9a227] group-hover:text-[#032b19]" />
                <span>Guide PDF</span>
              </button>
              <a
                href="https://wa.link/47g4xb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#25D366]/60 bg-[#063b22] px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-emerald-300 hover:bg-[#25D366] hover:text-white transition shrink-0 whitespace-nowrap shadow-sm"
                title="Connect on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366] group-hover:text-white shrink-0" />
                <span>WhatsApp</span>
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, 'contact')}
                className="rounded-full bg-[#c9a227] px-4 py-1.5 sm:px-5 sm:py-2 text-xs font-bold text-[#032b19] shadow-md hover:bg-[#dfb235] hover:shadow-lg transition shrink-0 whitespace-nowrap"
              >
                Reserve Seat
              </a>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="lg:hidden p-2 rounded-lg text-white/80 hover:text-[#c9a227] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#c9a227]" /> : <Sliders className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Dropdown Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-[#c9a227]/20 py-4 px-2 space-y-2 bg-[#032b19]">
              <a
                href="#home"
                onClick={(e) => scrollToSection(e, 'home')}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#04361f] hover:text-[#c9a227]"
              >
                Home
              </a>
              <a
                href="#sanctuary-3d"
                onClick={(e) => scrollToSection(e, 'sanctuary-3d')}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#e6c964] hover:bg-[#04361f]"
              >
                Interactive 3D Haram &amp; Rotana Tour
              </a>
              <a
                href="#packages"
                onClick={(e) => scrollToSection(e, 'packages')}
                className="block px-3 py-2 rounded-md text-base font-medium text-[#c9a227] hover:bg-[#04361f]"
              >
                Hajj 2027 Packages &amp; Pricing
              </a>
              <a
                href="#accommodations"
                onClick={(e) => scrollToSection(e, 'accommodations')}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#04361f] hover:text-[#c9a227]"
              >
                Accommodation Highlights
              </a>
              <a
                href="#estimator"
                onClick={(e) => scrollToSection(e, 'estimator')}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#04361f] hover:text-[#c9a227]"
              >
                Price Estimator
              </a>
              <a
                href="#inclusions"
                onClick={(e) => scrollToSection(e, 'inclusions')}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#04361f] hover:text-[#c9a227]"
              >
                Key Inclusions
              </a>
              <a
                href="#pilgrim-experiences"
                onClick={(e) => scrollToSection(e, 'pilgrim-experiences')}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#04361f] hover:text-[#c9a227]"
              >
                Pilgrim Experiences
              </a>
              <a
                href="#ritual-path"
                onClick={(e) => scrollToSection(e, 'ritual-path')}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#04361f] hover:text-[#c9a227]"
              >
                Hajj Ritual Path Map
              </a>
              <a
                href="#faq"
                onClick={(e) => scrollToSection(e, 'faq')}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#04361f] hover:text-[#c9a227]"
              >
                Frequently Asked Questions
              </a>
              <a
                href="#documents"
                onClick={(e) => scrollToSection(e, 'documents')}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#04361f] hover:text-[#c9a227]"
              >
                Required Documents
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, 'contact')}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#04361f] hover:text-[#c9a227]"
              >
                Contact &amp; Peshawar Office
              </a>
              <div className="pt-3 border-t border-[#c9a227]/20 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setGuideModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#c9a227]/20 border border-[#c9a227] py-2.5 text-sm text-[#dfb235] font-semibold"
                >
                  <Download className="w-4 h-4 text-[#c9a227]" /> Download Guide PDF
                </button>
                <a
                  href="https://wa.link/47g4xb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#c9a227] py-2.5 text-sm text-[#032b19] font-semibold"
                >
                  <MessageCircle className="w-4 h-4" /> Reserve via WhatsApp
                </a>
                <a
                  href="tel:+923459900084"
                  className="flex items-center justify-center gap-2 rounded-full border border-[#c9a227]/40 py-2.5 text-sm text-[#c9a227] font-semibold"
                >
                  <Phone className="w-4 h-4" /> Call: 0345-9900084
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section (Majestic Islamic Typography & Spatial Presence) */}
      <section id="home" className="hero-bg relative pt-20 pb-24 sm:pt-28 sm:pb-36 text-white overflow-hidden scroll-mt-24 sm:scroll-mt-28">
        {/* Decorative Islamic Arch Geometric Silhouette */}
        <div className="absolute inset-0 pointer-events-none opacity-20 flex justify-center">
          <svg
            className="w-full max-w-4xl h-auto text-[#c9a227]"
            viewBox="0 0 800 600"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M 100 600 L 100 300 C 100 150, 400 50, 400 50 C 400 50, 700 150, 700 300 L 700 600" />
            <circle cx="400" cy="200" r="80" strokeDasharray="4 4" />
            <path d="M 400 120 L 400 280 M 320 200 L 480 200" strokeWidth="0.75" />
          </svg>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Reverent Arabic Inscription Finial */}
          <p className="font-arabic text-xl sm:text-2xl text-[#c9a227] tracking-wider mb-4 opacity-95">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ · خِدْمَةُ ضُيُوفِ الرَّحْمَٰنِ شَرَفٌ لَنَا
          </p>

          {/* Clean Unboxed Metadata Kicker */}
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-white/90 mb-6 flex-wrap justify-center">
            <span className="bg-[#c9a227]/20 border border-[#c9a227]/60 text-[#dfb235] px-2.5 py-0.5 rounded-full font-bold">
              Only Few Slots Remaining
            </span>
            <span aria-hidden="true" className="text-white/40 hidden sm:inline">·</span>
            <span className="text-[#dfb235] font-semibold">MORA Government Enrolment # 1215/P</span>
            <span aria-hidden="true" className="text-white/40 hidden sm:inline">·</span>
            <span>Peshawar, Pakistan</span>
          </div>

          {/* Display Headline with text-wrap: balance */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.12] font-semibold text-white tracking-tight [text-wrap:balance]">
            Your Sacred Journey to the Holy Haramain, <br />
            Guided With <span className="text-[#c9a227] italic font-serif">Dignity &amp; Excellence</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-white/85 font-light leading-relaxed [text-wrap:balance]">
            Al-Israj International Travels Pvt. Ltd. presents official Ministry of Religious Affairs (MORA) approved Hajj 2027 packages: <strong>14±1 Days</strong>, <strong>18±1 Days</strong>, and <strong>27±1 Days</strong> with Rotana Jabal Omar Makkah (150m), Central Markazia in Madinah, and upgraded Makteb-C camps.
          </p>

          {/* Days Until Hajj 2027 Countdown Widget */}
          <div className="mt-8">
            <HajjCountdown />
          </div>

          {/* Main Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#packages"
              onClick={(e) => scrollToSection(e, 'packages')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-[#c9a227] px-8 py-4 text-base font-bold text-[#032b19] shadow-xl shadow-black/30 hover:bg-[#dfb235] hover:scale-[1.02] transition-all"
            >
              <Building2 className="w-5 h-5 text-[#032b19]" />
              View Packages &amp; Pricing
            </a>
            <a
              href="https://wa.link/47g4xb"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-[#25D366]/70 bg-[#25D366]/15 backdrop-blur px-8 py-4 text-base font-semibold text-white hover:bg-[#25D366] hover:text-white transition-all"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366] group-hover:text-white" />
              WhatsApp: wa.link/47g4xb
            </a>
            <a
              href="tel:+923459900084"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-[#c9a227]/50 px-6 py-4 text-base font-medium text-[#c9a227] hover:bg-[#c9a227]/10 transition-all font-mono tabular-nums"
            >
              <Phone className="w-4 h-4" />
              0345-9900084
            </a>
          </div>

          {/* Quick Shortcuts: 3D Tour & PDF Guide */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#sanctuary-3d"
              onClick={(e) => scrollToSection(e, 'sanctuary-3d')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#f7df8e] hover:text-[#032b19] bg-[#c9a227]/20 hover:bg-[#c9a227] px-5 py-2.5 rounded-full border border-[#c9a227]/60 backdrop-blur-md transition shadow font-semibold"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Interactive 3D Haram &amp; Rotana (150m)</span>
            </a>
            <button
              type="button"
              onClick={() => setGuideModalOpen(true)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/90 hover:text-[#c9a227] bg-black/40 hover:bg-black/60 px-5 py-2.5 rounded-full border border-[#c9a227]/40 backdrop-blur-md transition shadow"
            >
              <FileText className="w-4 h-4 text-[#c9a227]" />
              <span>Download Free Hajj 2027 Essential Guide (PDF)</span>
            </button>
          </div>

          {/* Quantitative Trust Indicators (Tabular Numerals) */}
          <dl className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4 border-t border-white/15 pt-8 text-center">
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <dt className="font-serif text-3xl sm:text-4xl text-[#c9a227] font-bold tabular-nums">
                150m
              </dt>
              <dd className="mt-1 text-xs uppercase tracking-wider text-white/80">
                Rotana Jabal Omar Makkah
              </dd>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <dt className="font-serif text-3xl sm:text-4xl text-[#c9a227] font-bold tabular-nums">
                250–300m
              </dt>
              <dd className="mt-1 text-xs uppercase tracking-wider text-white/80">
                Markazia Madinah
              </dd>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <dt className="font-serif text-3xl sm:text-4xl text-[#c9a227] font-bold">
                Makteb-C
              </dt>
              <dd className="mt-1 text-xs uppercase tracking-wider text-white/80">
                Mina &amp; Arafat AC Tents
              </dd>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
              <dt className="font-serif text-3xl sm:text-4xl text-[#c9a227] font-bold font-mono">
                1215/P
              </dt>
              <dd className="mt-1 text-xs uppercase tracking-wider text-white/80">
                MORA Govt Enrolment
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Urgent Reservation Strip */}
      <section className="bg-gradient-to-r from-[#c9a227] via-[#e2b83b] to-[#c9a227] text-[#032b19] py-4 border-y border-[#9a7913]/30 shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#032b19] text-[#c9a227] shadow">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h4 className="font-serif font-bold text-base sm:text-lg leading-tight flex items-center gap-2 justify-center md:justify-start flex-wrap">
                <span>Only Few Slots Remaining</span>
                <span className="bg-[#032b19] text-[#c9a227] text-xs px-2 py-0.5 rounded font-sans font-bold">Closing Soon</span>
              </h4>
              <p className="text-xs sm:text-sm text-emerald-950 font-medium">
                Hajj 2027 allocations are strictly processed on a first-come, first-served basis under MORA regulations. Reserve your quota slot today before allocations fill completely.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://wa.link/47g4xb"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#032b19] px-6 py-2.5 text-xs sm:text-sm font-bold text-[#c9a227] hover:bg-emerald-950 shadow transition flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" /> Reserve Now on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Photorealistic Real-Time 3D Haramain & Rotana Jabal Omar Showcase */}
      <Haramain3DShowcase />

      {/* Accommodation Highlights Section */}
      <section id="accommodations" className="py-20 sm:py-28 bg-white border-b border-slate-200/80 scroll-mt-24 sm:scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a7913]">
              Sanctuary Proximity &amp; Dignified Comfort
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-5xl text-[#032b19] font-semibold [text-wrap:balance]">
              Accommodation Highlights
            </h2>
            <div className="gold-rule mx-auto mt-5 h-0.5 w-32"></div>
            <p className="mt-4 text-base text-slate-600 leading-relaxed [text-wrap:balance]">
              Hand-picked premium hotels within short walking distance of the Haramain, ensuring effortless congregational prayer attendance for elderly pilgrims and families.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {/* Makkah Hotel Card */}
            <div className="rounded-3xl border border-[#c9a227]/30 bg-gradient-to-b from-[#fdfbf6] to-white p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-[#c9a227] transition-all flex flex-col justify-between">
              <div>
                <div className="relative overflow-hidden rounded-2xl mb-5 border border-[#c9a227]/30 shadow-sm">
                  <img
                    src="/images/anjum_hotel_haram_drone.jpg"
                    alt="Rotana Jabal Omar Makkah (150m from Grand Mosque)"
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-[#032b19]/90 border border-[#c9a227]/60 px-3 py-1 text-[11px] font-bold text-[#e6c964] backdrop-blur-sm">
                    150m Level Walk
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#032b19] text-[#c9a227] text-lg shadow">
                    <Building2 className="w-5 h-5 text-[#c9a227]" />
                  </span>
                  <span className="text-xs font-semibold text-[#9a7913] uppercase tracking-wider">
                    Makkah Mukarramah
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-2xl text-[#032b19] font-bold">Rotana Jabal Omar Makkah</h3>
                <p className="mt-2 text-sm font-semibold text-[#065f38] flex items-center gap-1.5 tabular-nums">
                  <MapPin className="w-4 h-4 text-[#c9a227]" />
                  150 Meters from Haram Courtyard
                </p>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Premium hospitality at Rotana Jabal Omar Makkah situated within comfortable walking distance of the Holy Mosque, offering easy pedestrian access for elderly pilgrims and families.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Elevator-to-Haram walk</span>
                <span className="font-semibold text-[#032b19]">2–3 Minutes</span>
              </div>
            </div>

            {/* Madinah Hotel Card */}
            <div className="rounded-3xl border border-emerald-300/40 bg-gradient-to-b from-[#f7faf8] to-white p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-emerald-600 transition-all flex flex-col justify-between">
              <div>
                <div className="relative overflow-hidden rounded-2xl mb-5 border border-emerald-300/40 shadow-sm">
                  <img
                    src="/images/medinah_sanctuary_live.jpg"
                    alt="Al-Masjid an-Nabawi Markazia Hotels Madinah"
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-[#032b19]/90 border border-emerald-400/60 px-3 py-1 text-[11px] font-bold text-emerald-300 backdrop-blur-sm">
                    250–300m to Roza
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#032b19] text-[#c9a227] text-lg shadow">
                    <Star className="w-5 h-5 text-[#c9a227]" />
                  </span>
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                    Madinah Munawwarah
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-2xl text-[#032b19] font-bold">3/4-Star Markazia Hotels</h3>
                <p className="mt-2 text-sm font-semibold text-[#065f38] flex items-center gap-1.5 tabular-nums">
                  <MapPin className="w-4 h-4 text-[#c9a227]" />
                  250–300 Meters from Roza Mubarak
                </p>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Centrally situated in the coveted Markazia North/Central zone with effortless walking access to Masjid An-Nabawi and the Sacred Chamber.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Location Priority</span>
                <span className="font-semibold text-[#032b19]">Central Markazia Zone</span>
              </div>
            </div>

            {/* Makteb Category Card */}
            <div className="rounded-3xl border border-[#c9a227]/30 bg-gradient-to-b from-[#fdfbf6] to-white p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-[#c9a227] transition-all flex flex-col justify-between">
              <div>
                <div className="relative overflow-hidden rounded-2xl mb-5 border border-[#c9a227]/30 shadow-sm">
                  <img
                    src="/images/mina_camps_drone.jpg"
                    alt="Mina White Tents & Arafat Camps"
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-[#032b19]/90 border border-[#c9a227]/60 px-3 py-1 text-[11px] font-bold text-[#e6c964] backdrop-blur-sm">
                    Makteb-C AC Tents
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#032b19] text-[#c9a227] text-lg shadow">
                    <Snowflake className="w-5 h-5 text-[#c9a227]" />
                  </span>
                  <span className="text-xs font-semibold text-[#9a7913] uppercase tracking-wider">
                    Mina &amp; Arafat Camps
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-2xl text-[#032b19] font-bold">Makteb Category: Makteb-C</h3>
                <p className="mt-2 text-sm font-semibold text-[#065f38] flex items-center gap-1.5">
                  <Snowflake className="w-4 h-4 text-[#c9a227]" />
                  Air-Conditioned Upgraded Camps
                </p>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Official MORA approved Makteb-C allocation equipped with gypsum walling, climate control air-conditioning, sofa-beds, and uninterrupted buffet dining.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Sleeping Setup</span>
                <span className="font-semibold text-[#032b19]">Dedicated Sofa Beds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Package Options & Exact Pricing Section (MORA APPROVED) */}
      <section id="packages" className="py-20 sm:py-28 islamic-pattern-light border-b border-slate-200 scroll-mt-24 sm:scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Clean Unboxed Editorial Tag */}
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9a7913]">
              Official Government Standing · MORA Enrolment 1215/P
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-5xl text-[#032b19] font-semibold [text-wrap:balance]">
              Hajj 2027 Packages &amp; Verified Rates
            </h2>
            <div className="gold-rule mx-auto mt-5 h-0.5 w-32"></div>
            <p className="mt-4 text-base text-slate-600 leading-relaxed [text-wrap:balance]">
              Transparent, all-inclusive official rates for Hajj 2027. Choose your preferred duration with verified pricing across <strong>Sharing</strong>, <strong>3-Bed (Triple)</strong>, and <strong>2-Bed (Double)</strong> rooms.
            </p>
          </div>

          {/* Package Cards Grid */}
          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {HAJJ_PACKAGES.map((pkg, idx) => {
              const isMarquee = pkg.id === 'pkg-2-95'; // 18 Days shifting is the premier family choice
              return (
                <article
                  key={pkg.id}
                  className={`flex flex-col rounded-3xl bg-white p-7 sm:p-8 transition-all relative overflow-hidden ${
                    isMarquee
                      ? 'border-2 border-[#c9a227] shadow-xl hover:shadow-2xl'
                      : 'border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-[#c9a227]/60'
                  }`}
                >
                  {isMarquee && (
                    <div className="absolute top-0 right-0 bg-[#c9a227] text-[#032b19] text-[11px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider shadow">
                      Most Popular Family Choice
                    </div>
                  )}

                  {/* Header metadata unboxed */}
                  <div className="flex items-center gap-2 text-xs font-bold text-[#9a7913] uppercase tracking-wider">
                    <span>{pkg.packageNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span>{pkg.type}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-800">{pkg.moraCode}</span>
                  </div>

                  <h3 className="mt-2 font-serif text-3xl text-[#032b19] font-bold">
                    {pkg.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pkg.description}
                  </p>

                  {/* Pricing Tiers Table (Clean Typography & Tabular Figures) */}
                  <div className="mt-6 rounded-2xl bg-[#faf9f5] border border-[#c9a227]/25 p-5">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-600 uppercase tracking-wider pb-2 border-b border-slate-200/70">
                      <span>Room Category</span>
                      <span>All-Inclusive Rate</span>
                    </div>

                    <div className="mt-3 space-y-3">
                      {/* Sharing */}
                      <div className="flex justify-between items-center py-1 border-b border-slate-200/50">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-700">Sharing Basis</span>
                        </div>
                        <span className="text-base sm:text-lg font-bold text-[#032b19] font-mono tabular-nums">
                          PKR {pkg.rates.sharing.toLocaleString('en-PK')}/-
                        </span>
                      </div>

                      {/* 3-Bed (Triple) */}
                      <div className="flex justify-between items-center py-1 border-b border-slate-200/50">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-700">3-Bed (Triple)</span>
                        </div>
                        <span className="text-base sm:text-lg font-bold text-[#032b19] font-mono tabular-nums">
                          PKR {pkg.rates.triple.toLocaleString('en-PK')}/-
                        </span>
                      </div>

                      {/* 2-Bed (Double) */}
                      <div className="flex justify-between items-center py-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-700">2-Bed (Double)</span>
                        </div>
                        <span className="text-base sm:text-lg font-bold text-[#032b19] font-mono tabular-nums">
                          PKR {pkg.rates.double.toLocaleString('en-PK')}/-
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Specifications List */}
                  <ul className="mt-6 space-y-2.5 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-[#c9a227] font-bold mt-0.5">✦</span>
                      <span><strong>Makkah Hotel:</strong> {pkg.makkahHotel} ({pkg.makkahDistance})</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#c9a227] font-bold mt-0.5">✦</span>
                      <span><strong>Madinah Hotel:</strong> {pkg.madinahHotel} ({pkg.madinahDistance})</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#c9a227] font-bold mt-0.5">✦</span>
                      <span><strong>Mina &amp; Arafat:</strong> {pkg.tentCategory}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#c9a227] font-bold mt-0.5">✦</span>
                      <span><strong>Meals &amp; Qurbani:</strong> Full Board (3 Daily Buffet Meals) + Qurbani Included</span>
                    </li>
                  </ul>

                  {/* Direct WhatsApp Call to Action */}
                  <div className="mt-auto pt-7">
                    <a
                      href={`https://wa.link/47g4xb?text=Assalam%20o%20Alaikum,%20I%20would%20like%20to%20reserve%20a%20seat%20for%20${encodeURIComponent(
                        pkg.title
                      )}%20(${encodeURIComponent(pkg.moraCode)}).`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold shadow transition ${
                        isMarquee
                          ? 'bg-[#c9a227] text-[#032b19] hover:bg-[#e6c964]'
                          : 'bg-[#032b19] text-white hover:bg-emerald-950'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" /> Reserve {pkg.title}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Accommodation Clarification Note */}
          <div className="mt-10 rounded-2xl bg-white border border-[#c9a227]/30 p-4 text-center max-w-3xl mx-auto shadow-sm">
            <p className="text-xs sm:text-sm font-medium text-[#032b19]">
              <Info className="w-4 h-4 text-[#c9a227] inline mr-1.5" />
              Important Accommodation Note: Sharing accommodation applies during Azizya / Sheesha building stay.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Price Estimator & Calculator Widget */}
      <section id="estimator" className="py-20 sm:py-24 bg-white border-b border-slate-200 scroll-mt-24 sm:scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a7913]">
              Budget Planning
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-5xl text-[#032b19] font-semibold [text-wrap:balance]">
              Hajj 2027 Cost &amp; Room Estimator
            </h2>
            <div className="gold-rule mx-auto mt-5 h-0.5 w-32"></div>
            <p className="mt-4 text-base text-slate-600">
              Calculate exact group totals based on official MORA rates with real-time room breakdown.
            </p>
          </div>

          <div className="mt-12 max-w-4xl mx-auto rounded-3xl bg-[#faf9f5] border border-[#c9a227]/30 p-6 sm:p-10 shadow-xl">
            {/* Currency Converter Toggle Bar for Overseas Pilgrims */}
            <div className="mb-8 p-3.5 bg-white rounded-2xl border border-[#c9a227]/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5 text-xs text-center sm:text-left">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#032b19] text-[#c9a227] font-bold text-base shadow">
                  💱
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                    <span className="font-bold text-[#032b19] uppercase tracking-wider text-[11px]">
                      Currency Converter (Overseas Quota)
                    </span>
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Live Toggle
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    Official Reference: 1 USD ≈ 278.50 PKR · 1 SAR ≈ 74.25 PKR
                  </p>
                </div>
              </div>

              {/* Currency Segmented Toggle Buttons */}
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 shrink-0">
                {(['PKR', 'USD', 'SAR'] as const).map((currCode) => {
                  const isSelected = calcCurrency === currCode;
                  const item = ESTIMATOR_CURRENCIES[currCode];
                  return (
                    <button
                      key={currCode}
                      type="button"
                      onClick={() => setCalcCurrency(currCode)}
                      className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#032b19] text-[#c9a227] shadow-md scale-105'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                      }`}
                    >
                      <span className="text-sm">{item.flag}</span>
                      <span>{item.code}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Controls */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    1. Select MORA Approved Package
                  </label>
                  <select
                    value={calcPackageId}
                    onChange={(e) => setCalcPackageId(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
                  >
                    {HAJJ_PACKAGES.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.packageNumber}: {pkg.title} ({pkg.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      2. Number of Pilgrims
                    </label>
                    <span className="text-xs font-bold text-[#065f38] bg-emerald-100/70 px-2.5 py-0.5 rounded font-mono tabular-nums">
                      {calcPilgrims} Pilgrim{calcPilgrims > 1 ? 's' : ''}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={calcPilgrims}
                    onChange={(e) => setCalcPilgrims(Number(e.target.value))}
                    className="w-full accent-[#032b19] h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono tabular-nums">
                    <span>1 (Solo)</span>
                    <span>4 (Family)</span>
                    <span>8 (Group)</span>
                    <span>15</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    3. Room Occupancy
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCalcRoomType('sharing')}
                      className={`py-2.5 px-2 rounded-xl text-xs font-semibold border text-center transition flex flex-col items-center justify-center ${
                        calcRoomType === 'sharing'
                          ? 'border-[#c9a227] bg-[#032b19] text-white shadow ring-2 ring-[#c9a227]/40'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-[#c9a227]'
                      }`}
                    >
                      <span className="font-bold">Sharing Basis</span>
                      <span className="text-[10px] opacity-80 mt-0.5 font-mono tabular-nums">
                        {ESTIMATOR_CURRENCIES[calcCurrency].format(activeEstimatorPackage.rates.sharing)}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcRoomType('triple')}
                      className={`py-2.5 px-2 rounded-xl text-xs font-semibold border text-center transition flex flex-col items-center justify-center ${
                        calcRoomType === 'triple'
                          ? 'border-[#c9a227] bg-[#032b19] text-white shadow ring-2 ring-[#c9a227]/40'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-[#c9a227]'
                      }`}
                    >
                      <span className="font-bold">3-Bed (Triple)</span>
                      <span className="text-[10px] opacity-80 mt-0.5 font-mono tabular-nums">
                        {ESTIMATOR_CURRENCIES[calcCurrency].format(activeEstimatorPackage.rates.triple)}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCalcRoomType('double')}
                      className={`py-2.5 px-2 rounded-xl text-xs font-semibold border text-center transition flex flex-col items-center justify-center ${
                        calcRoomType === 'double'
                          ? 'border-[#c9a227] bg-[#032b19] text-white shadow ring-2 ring-[#c9a227]/40'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-[#c9a227]'
                      }`}
                    >
                      <span className="font-bold">2-Bed (Double)</span>
                      <span className="text-[10px] opacity-80 mt-0.5 font-mono tabular-nums">
                        {ESTIMATOR_CURRENCIES[calcCurrency].format(activeEstimatorPackage.rates.double)}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Estimate Calculation Display Card */}
              <div className="rounded-3xl bg-gradient-to-br from-[#032b19] to-[#02180e] text-white p-7 sm:p-8 shadow-xl border border-[#c9a227]/30 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs uppercase tracking-widest text-[#c9a227] font-bold">Total Estimate</span>
                      <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/80 uppercase font-mono">
                        {calcCurrency}
                      </span>
                    </div>
                    <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded text-white/80 tabular-nums">
                      {calcPilgrims} Pilgrim(s) · {calcRoomType.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-6 text-center sm:text-left">
                    <div className="text-3xl sm:text-4xl font-serif font-bold text-[#c9a227] font-mono tabular-nums">
                      {ESTIMATOR_CURRENCIES[calcCurrency].format(totalCost)}
                    </div>
                    <div className="text-xs text-white/80 mt-1 font-mono tabular-nums flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                      <span>
                        Per Pilgrim: {ESTIMATOR_CURRENCIES[calcCurrency].format(unitCost)}
                      </span>
                      {calcCurrency !== 'PKR' && (
                        <span className="text-[10px] text-amber-200 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                          Base: PKR {totalCost.toLocaleString('en-PK')}/-
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 space-y-2 text-xs text-white/80 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <div className="flex justify-between">
                      <span>Package:</span>
                      <span className="font-semibold text-white truncate max-w-[180px]">
                        {activeEstimatorPackage.title} ({activeEstimatorPackage.type})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Approval Code:</span>
                      <span className="font-semibold text-[#c9a227]">{activeEstimatorPackage.moraCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Selected Currency:</span>
                      <span className="font-semibold text-white">
                        {ESTIMATOR_CURRENCIES[calcCurrency].flag} {calcCurrency} ({ESTIMATOR_CURRENCIES[calcCurrency].name})
                      </span>
                    </div>
                    {calcCurrency !== 'PKR' && (
                      <div className="flex justify-between text-[11px] text-[#e6c964]">
                        <span>Conversion Rate:</span>
                        <span className="font-mono">1 {calcCurrency} ≈ {ESTIMATOR_CURRENCIES[calcCurrency].rate} PKR</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Makkah Stay:</span>
                      <span className="font-semibold text-white">Rotana Jabal Omar Makkah (150m)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Qurbani:</span>
                      <span className="font-semibold text-emerald-400">Included</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <button
                    onClick={handleEstimatorWhatsApp}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a227] px-6 py-3.5 text-xs sm:text-sm font-bold text-[#032b19] shadow-lg hover:bg-[#e6c964] transition"
                  >
                    <MessageCircle className="w-4 h-4" /> Send Estimate to WhatsApp ({calcCurrency})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Inclusions Section (6 Pillars of Complete Spiritual Care) */}
      <section id="inclusions" className="py-20 sm:py-28 bg-[#faf9f5] border-b border-slate-200 scroll-mt-24 sm:scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a7913]">
              All-Inclusive Care
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-5xl text-[#032b19] font-semibold [text-wrap:balance]">
              Key Inclusions
            </h2>
            <div className="gold-rule mx-auto mt-5 h-0.5 w-32"></div>
            <p className="mt-4 text-base text-slate-600 [text-wrap:balance]">
              Every religious and logistical detail organized with excellence to ensure seamless Hajj rites according to the Sunnah.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Inclusion 1: Qurbani */}
            <div className="rounded-3xl border border-[#c9a227]/25 p-7 bg-white shadow-sm hover:shadow-xl hover:border-[#c9a227] transition-all">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#032b19] text-[#c9a227] text-xl shadow">
                <Heart className="w-6 h-6 text-[#c9a227]" />
              </span>
              <h3 className="mt-5 font-serif font-bold text-xl text-[#032b19]">Qurbani Included</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Mandatory animal sacrifice (Hady/Qurbani) is officially arranged and fulfilled on time through verified Saudi government channels with zero hidden surcharges.
              </p>
            </div>

            {/* Inclusion 2: Mina & Arafat Camps */}
            <div className="rounded-3xl border border-[#c9a227]/25 p-7 bg-white shadow-sm hover:shadow-xl hover:border-[#c9a227] transition-all">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#032b19] text-[#c9a227] text-xl shadow">
                <Snowflake className="w-6 h-6 text-[#c9a227]" />
              </span>
              <h3 className="mt-5 font-serif font-bold text-xl text-[#032b19]">Mina &amp; Arafat AC Camps</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Official Makteb-C air-conditioned tents in Mina and Arafat with comfortable individual sofa-beds, pillows, and clean sanitized washrooms.
              </p>
            </div>

            {/* Inclusion 3: Luxury Transport */}
            <div className="rounded-3xl border border-[#c9a227]/25 p-7 bg-white shadow-sm hover:shadow-xl hover:border-[#c9a227] transition-all">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#032b19] text-[#c9a227] text-xl shadow">
                <Bus className="w-6 h-6 text-[#c9a227]" />
              </span>
              <h3 className="mt-5 font-serif font-bold text-xl text-[#032b19]">Seat-by-Seat Luxury Transport</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Reserved air-conditioned luxury coach transfers for all intercity travel and Hajj ritual movements between Makkah, Madinah, Mina, Arafat, and Muzdalifah.
              </p>
            </div>

            {/* Inclusion 4: Full Board Meals */}
            <div className="rounded-3xl border border-[#c9a227]/25 p-7 bg-white shadow-sm hover:shadow-xl hover:border-[#c9a227] transition-all">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#032b19] text-[#c9a227] text-xl shadow">
                <Utensils className="w-6 h-6 text-[#c9a227]" />
              </span>
              <h3 className="mt-5 font-serif font-bold text-xl text-[#032b19]">Full Board Buffet Meals</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Hygienic 3-time daily buffet catering (Breakfast, Lunch, and Dinner) featuring freshly cooked Pakistani dishes, hot tea, and bottled water.
              </p>
            </div>

            {/* Inclusion 5: Hajj Kits */}
            <div className="rounded-3xl border border-[#c9a227]/25 p-7 bg-white shadow-sm hover:shadow-xl hover:border-[#c9a227] transition-all">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#032b19] text-[#c9a227] text-xl shadow">
                <Gift className="w-6 h-6 text-[#c9a227]" />
              </span>
              <h3 className="mt-5 font-serif font-bold text-xl text-[#032b19]">Complimentary Hajj Kits</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Comprehensive pilgrim care package including Ihram garments/Abaya, traveling waist bag, shoe pouches, pebble bag for Jamarat, and Hajj guidebooks.
              </p>
            </div>

            {/* Inclusion 6: Complete Ziyarat */}
            <div className="rounded-3xl border border-[#c9a227]/25 p-7 bg-white shadow-sm hover:shadow-xl hover:border-[#c9a227] transition-all">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#032b19] text-[#c9a227] text-xl shadow">
                <Compass className="w-6 h-6 text-[#c9a227]" />
              </span>
              <h3 className="mt-5 font-serif font-bold text-xl text-[#032b19]">Complete Ziyarat Holy Tours</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Guided spiritual tours of historical Islamic heritage sites in Makkah (Jabal Al-Noor, Ghar Thawr) and Madinah (Masjid Quba, Mount Uhud, Masjid Qiblatayn).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pilgrim Experiences Section - Directly Below Inclusions */}
      <PilgrimExperiences />

      {/* Interactive 5-Day Hajj Ritual Path Map Graphic */}
      <HajjRitualMap />

      {/* Frequently Asked Questions (FAQ) Section - Below Inclusions */}
      <section id="faq" className="py-20 sm:py-28 bg-white border-b border-slate-200 scroll-mt-24 sm:scroll-mt-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9a7913]">
              Clear Answers &amp; Guidance
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-5xl text-[#032b19] font-semibold [text-wrap:balance]">
              Frequently Asked Questions
            </h2>
            <div className="gold-rule mx-auto mt-5 h-0.5 w-32"></div>
            <p className="mt-4 text-base text-slate-600 [text-wrap:balance]">
              Everything you need to know about Hajj 2027 logistics, official vaccination requirements, and hotel facilities near the Holy Sanctuaries.
            </p>

            {/* Category Filter Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setFaqCategory('all')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  faqCategory === 'all'
                    ? 'bg-[#032b19] text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Questions ({faqs.length})
              </button>
              <button
                type="button"
                onClick={() => setFaqCategory('logistics')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                  faqCategory === 'logistics'
                    ? 'bg-[#032b19] text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Bus className="w-3.5 h-3.5" /> Hajj Logistics
              </button>
              <button
                type="button"
                onClick={() => setFaqCategory('vaccines')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                  faqCategory === 'vaccines'
                    ? 'bg-[#032b19] text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Syringe className="w-3.5 h-3.5" /> Vaccines &amp; Health
              </button>
              <button
                type="button"
                onClick={() => setFaqCategory('hotels')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                  faqCategory === 'hotels'
                    ? 'bg-[#032b19] text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" /> Hotels &amp; Tents
              </button>
            </div>
          </div>

          {/* Accordion List */}
          <div className="mt-12 space-y-3.5">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-[#c9a227] bg-[#fdfbf6] shadow-md'
                      : 'border-slate-200 bg-white hover:border-[#c9a227]/60'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#9a7913] mb-1 block">
                        {faq.categoryLabel}
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#032b19] leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-1 transition-transform ${
                        isOpen
                          ? 'bg-[#032b19] text-[#c9a227] rotate-180'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-[#c9a227]/20 pt-4">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Help WhatsApp Prompt */}
          <div className="mt-10 rounded-2xl bg-[#faf9f5] border border-[#c9a227]/30 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#032b19] text-emerald-400">
                <HelpCircle className="w-5 h-5" />
              </span>
              <div>
                <h4 className="font-serif font-bold text-base text-[#032b19]">
                  Have a specific question about your 2027 Hajj arrangements?
                </h4>
                <p className="text-xs text-slate-500">
                  Our official pilgrimage counselors are available for instant clarification.
                </p>
              </div>
            </div>
            <a
              href="https://wa.link/47g4xb"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#032b19] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#c9a227] hover:bg-emerald-950 transition shadow"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" /> Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Required Documents Section & Interactive Checklist */}
      <section id="documents" className="py-20 sm:py-28 bg-white border-b border-slate-200 scroll-mt-24 sm:scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9a7913]">
                Compliance &amp; Verification
              </p>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-[#032b19] font-semibold [text-wrap:balance]">
                Required Documents for Hajj 2027
              </h2>
              <div className="gold-rule mt-5 h-0.5 w-28"></div>
              <p className="mt-5 text-sm sm:text-base text-slate-600 leading-relaxed">
                Please prepare and submit the following mandatory documents to secure your official MORA Hajj 2027 quota allocation with Al-Israj International Travels.
              </p>

              {/* Interactive Readiness Progress Meter */}
              <div className="mt-8 rounded-2xl bg-[#faf9f5] p-5 border border-[#c9a227]/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#032b19]">Your Document Readiness:</span>
                  <span className="text-xs font-bold text-[#065f38] font-mono tabular-nums">
                    {readinessPercentage}% Complete
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#032b19] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${readinessPercentage}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Click the items on the right to check off what you have ready.
                </p>
              </div>

              {/* Passport Cutoff Callout */}
              <div className="mt-6 rounded-2xl bg-[#faf9f5] p-5 border border-[#c9a227]/30 flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#c9a227]/20 text-[#9a7913] text-xl">
                  <Calendar className="w-6 h-6 text-[#9a7913]" />
                </span>
                <div>
                  <h4 className="font-serif font-bold text-sm text-[#032b19]">
                    Valid Until at Least 16 Nov 2027
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Strict Saudi Ministry of Hajj &amp; Umrah cutoff compliance.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid gap-3.5 sm:grid-cols-2">
                {docItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleDoc(item.id)}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all flex items-start gap-3.5 select-none ${
                      checkedDocs[item.id]
                        ? 'border-emerald-500/60 bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-[#c9a227]'
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg mt-0.5 transition ${
                        checkedDocs[item.id]
                          ? 'bg-[#032b19] text-[#c9a227]'
                          : 'border border-slate-300 bg-white'
                      }`}
                    >
                      {checkedDocs[item.id] && <Check className="w-4 h-4" />}
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#032b19]">{item.title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Download Hajj 2027 Essential Guide PDF Banner */}
          <div className="mt-12 rounded-3xl bg-[#032b19] p-6 sm:p-8 text-white border border-[#c9a227]/40 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-center gap-4 text-center md:text-left">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#c9a227] text-[#032b19] shadow">
                <FileText className="w-7 h-7" />
              </span>
              <div>
                <h4 className="font-serif text-xl sm:text-2xl font-bold">
                  Download Hajj 2027 Essential Guide (PDF)
                </h4>
                <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
                  Comprehensive 2-page printable guide featuring Day-by-Day ritual steps (8 to 12 Dhul Hijjah), Rotana Jabal Omar Makkah (150m) tips, hydration, footwear care, and official MORA instructions.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setGuideModalOpen(true)}
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#c9a227] hover:bg-[#e6c964] text-[#032b19] px-7 py-3.5 text-sm font-bold shadow-lg transition"
            >
              <Download className="w-4 h-4" />
              Download Guide PDF
            </button>
          </div>
        </div>
      </section>

      {/* Reservation & Contact Section */}
      <section id="contact" className="py-20 sm:py-28 bg-[#faf9f5] scroll-mt-24 sm:scroll-mt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9a7913]">
              Direct Official Booking
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-5xl text-[#032b19] font-semibold [text-wrap:balance]">
              Reserve Your Seat Today
            </h2>
            <div className="gold-rule mx-auto mt-5 h-0.5 w-32"></div>
            <p className="mt-4 text-base text-slate-600 leading-relaxed [text-wrap:balance]">
              Limited slots available on a first-come, first-served basis under MORA regulations. Connect directly with our authorized directors.
            </p>
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-12">
            {/* Contact Information Cards */}
            <div className="lg:col-span-5 space-y-5">
              {/* WhatsApp Link Direct Card */}
              <div className="rounded-3xl bg-emerald-50/70 p-6 sm:p-7 border border-emerald-200 shadow-sm flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#032b19] text-emerald-400 text-2xl shadow">
                  <MessageCircle className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#032b19]">Official WhatsApp Link</h3>
                  <p className="text-xs text-slate-600 mb-3">Instant connection to our Hajj 2027 desk:</p>
                  <a
                    href="https://wa.link/47g4xb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#032b19] px-5 py-2 text-xs sm:text-sm font-bold text-[#c9a227] hover:bg-emerald-950 shadow transition"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" /> Open wa.link/47g4xb
                  </a>
                </div>
              </div>

              {/* Official Phone Lines */}
              <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/90 shadow-sm flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#032b19] text-[#c9a227] text-xl shadow">
                  <Phone className="w-6 h-6 text-[#c9a227]" />
                </span>
                <div className="w-full">
                  <h3 className="font-serif font-bold text-base text-[#032b19]">Direct Telephone Lines</h3>
                  <p className="text-xs text-slate-500 mb-3">Available Mon–Sat: 9:00 AM – 7:00 PM (PKT):</p>
                  <div className="space-y-1.5 text-sm font-semibold text-[#032b19] font-mono tabular-nums">
                    <a href="tel:+923459900084" className="flex items-center gap-2 hover:text-[#c9a227] transition">
                      <Phone className="w-3.5 h-3.5 text-[#c9a227]" /> +92 345 9900084 (Primary)
                    </a>
                    <a href="tel:+923349977182" className="flex items-center gap-2 hover:text-[#c9a227] transition">
                      <Phone className="w-3.5 h-3.5 text-[#c9a227]" /> +92 334 9977182
                    </a>
                    <a href="tel:+923139966007" className="flex items-center gap-2 hover:text-[#c9a227] transition">
                      <Phone className="w-3.5 h-3.5 text-[#c9a227]" /> +92 313 9966007
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/90 shadow-sm flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#032b19] text-[#c9a227] text-xl shadow">
                  <FileText className="w-6 h-6 text-[#c9a227]" />
                </span>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#032b19]">Official Email</h3>
                  <p className="text-xs text-slate-500 mb-1">Corporate document submissions:</p>
                  <a
                    href="mailto:alisraj1215p@gmail.com"
                    className="text-sm font-semibold text-[#065f38] hover:text-[#c9a227] transition underline"
                  >
                    alisraj1215p@gmail.com
                  </a>
                </div>
              </div>

              {/* Office Address */}
              <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/90 shadow-sm flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#032b19] text-[#c9a227] text-xl shadow">
                  <MapPin className="w-6 h-6 text-[#c9a227]" />
                </span>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#032b19]">Peshawar Head Office</h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Office No. 1 &amp; 2, 1st Floor, Haji Tehmas Khan Building, Opp. Khyber CNG, Tehkal Payan, University Road, Peshawar, KPK.
                  </p>
                  <span className="inline-block mt-2 text-[11px] font-semibold text-emerald-900 bg-emerald-100/80 px-2.5 py-0.5 rounded">
                    MORA Approved HGO Enr #: 1215/P
                  </span>
                </div>
              </div>

              {/* Instant vCard & WhatsApp QR Code Generator Card */}
              <ContactQRCard />
            </div>

            {/* Hajj 2027 Reservation Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl bg-white p-8 sm:p-10 border border-[#c9a227]/30 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-2xl text-[#032b19] font-bold">
                      Hajj 2027 Seat Reservation Form
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Select your MORA approved package to generate your pre-filled inquiry for instant WhatsApp confirmation.
                    </p>
                  </div>
                  <span className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-[#faf9f5] border border-[#c9a227]/30 shadow-inner">
                    <AlIsrajLogo variant="emblem" theme="light" size="sm" />
                  </span>
                </div>

                {/* Registration Deadline Alert in Form */}
                <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-300 p-3 sm:p-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white font-bold text-sm shrink-0 shadow">
                    ⚠️
                  </span>
                  <div className="text-xs text-amber-950 leading-relaxed">
                    <strong className="text-amber-900 font-bold block text-sm">
                      Registration Status: Only Few Slots Remaining
                    </strong>
                    MORA private scheme quota allocations are strictly processed on a first-come, first-served basis. Submit your details now to guarantee your registration token.
                  </div>
                </div>

                <form onSubmit={handleHajjSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pilgrim Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Muhammad Bilal"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        WhatsApp / Contact Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="e.g. +92 345 1234567"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        City / Country of Residence *
                      </label>
                      <input
                        type="text"
                        required
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        placeholder="e.g. Peshawar / Overseas"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Select MORA Approved Package *
                      </label>
                      <select
                        value={formPackage}
                        onChange={(e) => setFormPackage(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227] bg-white"
                      >
                        <option value="Package 1: 14±1 Days (Fixed Aziziya) - MORA 1-131">
                          Package 1: 14±1 Days (Fixed Aziziya) - MORA 1-131
                        </option>
                        <option value="Package 2: 18±1 Days (Shifting) - MORA 2-95">
                          Package 2: 18±1 Days (Shifting) - MORA 2-95
                        </option>
                        <option value="Package 3: 27±1 Days (Shifting) - MORA 3-55">
                          Package 3: 27±1 Days (Shifting) - MORA 3-55
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Preferred Room Type *
                      </label>
                      <select
                        value={formRoom}
                        onChange={(e) => setFormRoom(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227] bg-white"
                      >
                        <option value="Sharing Basis">Sharing Basis</option>
                        <option value="3-Bed (Triple Room)">3-Bed (Triple Room)</option>
                        <option value="2-Bed (Double Room)">2-Bed (Double Room)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Number of Pilgrims
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="25"
                        value={formPilgrims}
                        onChange={(e) => setFormPilgrims(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227] font-mono tabular-nums"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Passport Validity Status
                    </label>
                    <select
                      value={formPassport}
                      onChange={(e) => setFormPassport(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227] bg-white"
                    >
                      <option value="Passport valid until after 16 Nov 2027">
                        Yes, Passport is valid until after 16 Nov 2027
                      </option>
                      <option value="Passport under renewal">Currently under renewal</option>
                      <option value="Overseas / International Passport">Overseas Pakistani / Foreign Passport</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Special Requirements (e.g. Wheelchair / Senior Pilgrims)
                    </label>
                    <textarea
                      rows={2}
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      placeholder="Mention any medical assistance, elderly care, or family preferences..."
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-[#c9a227] focus:outline-none focus:ring-1 focus:ring-[#c9a227]"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a227] px-8 py-4 text-base font-bold text-[#032b19] shadow-lg hover:bg-[#e6c964] transition"
                    >
                      <MessageCircle className="w-5 h-5" /> Submit Hajj 2027 Reservation via WhatsApp
                    </button>
                    <p className="text-[11px] text-center text-slate-400 mt-2">
                      Redirects directly to WhatsApp (wa.link/47g4xb) with your complete inquiry ready to send.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Google Map Location */}
      <section className="w-full h-80 bg-slate-200 relative border-t border-slate-300">
        <iframe
          title="Al-Israj International Travels Peshawar Office"
          className="w-full h-full border-0 filter grayscale-[15%]"
          src="https://maps.google.com/maps?q=Tehkal+Payan+University+Road+Peshawar&t=&z=15&ie=UTF8&iwloc=&output=embed"
          loading="lazy"
        ></iframe>
        <div className="absolute bottom-4 left-4 bg-[#032b19]/95 text-white p-4 rounded-2xl shadow-xl border border-[#c9a227]/40 max-w-sm hidden sm:block">
          <p className="text-xs font-bold text-[#c9a227]">Al-Israj International Travels Pvt. Ltd.</p>
          <p className="text-[11px] text-white/85 mt-0.5">
            Office No. 1 &amp; 2, 1st Floor, Haji Tehmas Khan Building, Opp. Khyber CNG, Tehkal Payan, Peshawar, KPK.
          </p>
        </div>
      </section>

      {/* Footer (Quiet & Dignified) */}
      <footer className="bg-[#021f12] pt-16 pb-12 text-white/70 border-t border-[#c9a227]/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Real-time Prayer Times Widget Card in Footer */}
          <div className="mb-12">
            <PrayerTimesWidget variant="card" defaultCity="Makkah" />
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Col 1: About & Registration */}
            <div>
              <a
                href="#home"
                onClick={(e) => scrollToSection(e, 'home')}
                className="group inline-block focus:outline-none transition-transform duration-200 hover:scale-[1.01]"
                title="Al-Israj International Travels (Pvt.) Ltd. - Back to Homepage"
              >
                <AlIsrajLogo variant="header" showAccreditation={false} />
              </a>
              <p className="mt-4 text-xs leading-relaxed text-white/75">
                Approved Government Hajj Group Organizer with Ministry of Religious Affairs (MORA Enrolment No:{' '}
                <strong className="text-[#c9a227]">1215/P</strong>). Dedicated to providing transparent and dignified pilgrimage services.
              </p>
              <div className="mt-4 text-[11px] text-[#e6c964] space-y-1">
                <p><strong>MORA Govt Enr:</strong> 1215/P</p>
                <p><strong>Makteb Category:</strong> Makteb-C</p>
                <p><strong>Email:</strong> alisraj1215p@gmail.com</p>
              </div>
            </div>

            {/* Col 2: Hajj 2027 Approved Packages */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#c9a227]">MORA Approved Packages</h3>
              <ul className="mt-4 space-y-2.5 text-xs text-white/75">
                <li>
                  <a
                    href="#packages"
                    onClick={(e) => scrollToSection(e, 'packages')}
                    className="hover:text-[#c9a227] transition"
                  >
                    <strong>Package 1:</strong> 14±1 Days (Fixed Aziziya)<br />
                    <span className="text-white/50">MORA Code: 1-131</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#packages"
                    onClick={(e) => scrollToSection(e, 'packages')}
                    className="hover:text-[#c9a227] transition"
                  >
                    <strong>Package 2:</strong> 18±1 Days (Shifting)<br />
                    <span className="text-white/50">MORA Code: 2-95</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#packages"
                    onClick={(e) => scrollToSection(e, 'packages')}
                    className="hover:text-[#c9a227] transition"
                  >
                    <strong>Package 3:</strong> 27±1 Days (Shifting)<br />
                    <span className="text-white/50">MORA Code: 3-55</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Direct Hotlines & WhatsApp */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#c9a227]">Official Hotlines</h3>
              <ul className="mt-4 space-y-3 text-xs text-white/75">
                <li className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-[#c9a227] mt-0.5 shrink-0" />
                  <div className="font-mono tabular-nums">
                    <a href="tel:+923459900084" className="hover:text-[#c9a227] block">+92 345 9900084</a>
                    <a href="tel:+923349977182" className="hover:text-[#c9a227] block">+92 334 9977182</a>
                    <a href="tel:+923139966007" className="hover:text-[#c9a227] block">+92 313 9966007</a>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <a
                    href="https://wa.link/47g4xb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#c9a227] font-semibold underline text-emerald-300"
                  >
                    wa.link/47g4xb (Instant WhatsApp)
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <FileText className="w-4 h-4 text-[#c9a227] mt-0.5 shrink-0" />
                  <a href="mailto:alisraj1215p@gmail.com" className="hover:text-[#c9a227] break-all">
                    alisraj1215p@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Office Address */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#c9a227]">Head Office</h3>
              <p className="mt-4 text-xs leading-relaxed text-white/75">
                Office No. 1 &amp; 2, 1st Floor, Haji Tehmas Khan Building, Opp. Khyber CNG, Tehkal Payan, University Road, Peshawar, KPK.
              </p>
              <div className="mt-4 p-3 rounded-xl bg-white/5 border border-[#c9a227]/20 text-xs">
                <p className="text-[#c9a227] font-semibold">Office Hours:</p>
                <p className="text-white/70 mt-0.5">Monday – Saturday: 9:00 AM – 7:00 PM</p>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-3">
            <p>© 2027 Al-Israj International Travels Pvt. Ltd. All rights reserved.</p>
            <p>MORA Approved Government HGO Enrolment #: 1215/P</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Quick Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <a
          href="https://wa.link/47g4xb"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 rounded-full bg-[#25D366] text-white p-3.5 sm:px-5 sm:py-3 shadow-2xl hover:scale-105 transition-all duration-300"
          aria-label="Reserve Hajj 2027 on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="hidden sm:inline text-xs font-bold tracking-wide">Reserve Seat (wa.link/47g4xb)</span>
        </a>
      </div>

      {/* Hajj 2027 Essential Guide Modal */}
      <HajjGuideModal isOpen={guideModalOpen} onClose={() => setGuideModalOpen(false)} />
      
      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </div>
  );
}
