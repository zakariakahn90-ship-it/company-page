import React, { useEffect, useRef, useState } from 'react';
import {
  Compass,
  Sun,
  SunMedium,
  Sunset,
  Moon,
  Sunrise,
  Eye,
  Play,
  Pause,
  RotateCw,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Route,
  Building2,
  MapPin,
} from 'lucide-react';
import {
  HaramainSceneController,
  CameraPresetId,
  LightingPresetId,
} from '../three/sceneController.ts';
import { LandmarkId } from '../three/models.ts';

interface LandmarkInfo {
  title: string;
  subtitle: string;
  detail: string;
  camera: CameraPresetId;
}

const LANDMARK_INFO: Record<LandmarkId, LandmarkInfo> = {
  kaaba: {
    title: 'The Holy Kaaba (Baytullah)',
    subtitle: 'Center of Masjid al-Haram · Mataf Courtyard',
    detail:
      'Featuring procedural gold-embroidered Kiswah silk, embossed 24K Bab al-Kaaba, Hajar al-Aswad in its silver bezel, Mizab al-Rahmah, and Hijr Ismail.',
    camera: 'kaaba',
  },
  rotana: {
    title: 'Rotana Jabal Omar Makkah',
    subtitle: '150 Meters from Haram Courtyard · 2–3 Min Level Walk',
    detail:
      'Our selected Makkah sanctuary residence overlooking the Grand Mosque with direct, level pedestrian promenade access for effortless five-time congregational prayers.',
    camera: 'rotana',
  },
  maqam: {
    title: 'Maqam Ibrahim & Hijr Ismail',
    subtitle: 'Sacred Mataf Sanctuary Landmarks',
    detail:
      'Sculpted golden-dome crystal pavilion east of the Holy Kaaba alongside the semi-circular white marble enclosure of Hijr Ismail (Hateem).',
    camera: 'kaaba',
  },
  minarets: {
    title: 'Grand Minarets & Haram Arcades',
    subtitle: 'Multi-Tiered Limestone Riwaq & King Fahd Gate',
    detail:
      'Six soaring Makkah minarets crowned with golden crescent finials and illuminated galleries framing the cool Thassos white marble Mataf.',
    camera: 'skyline',
  },
  walkway: {
    title: '150m Direct Haram Promenade',
    subtitle: 'Rotana Jabal Omar Lobby → King Fahd Gate',
    detail:
      'Level, marble-paved 150-meter pedestrian walkway connecting Rotana Jabal Omar Makkah directly to the Haram Courtyard without steep inclines.',
    camera: 'rotana',
  },
};

const CAMERA_BUTTONS: { id: CameraPresetId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'kaaba', label: 'Holy Kaaba' },
  { id: 'rotana', label: 'Rotana 150m' },
  { id: 'mataf', label: 'Mataf Top' },
  { id: 'skyline', label: 'Skyline' },
];

const LIGHTING_BUTTONS: {
  id: LightingPresetId;
  label: string;
  icon: React.FC<{ className?: string }>;
  activeClass: string;
  iconClass: string;
}[] = [
  {
    id: 'fajr',
    label: 'Fajr',
    icon: Sunrise,
    activeClass: 'bg-gradient-to-r from-[#5e387a] to-[#c96268] text-white border border-rose-300/60',
    iconClass: 'text-rose-300',
  },
  {
    id: 'zuhr',
    label: 'Zuhr',
    icon: Sun,
    activeClass: 'bg-gradient-to-r from-[#0284c7] to-[#38bdf8] text-white border border-sky-200/80',
    iconClass: 'text-sky-300',
  },
  {
    id: 'golden',
    label: 'Asr',
    icon: SunMedium,
    activeClass: 'bg-gradient-to-r from-[#0e66b3] to-[#d99d29] text-white border border-amber-300/70',
    iconClass: 'text-amber-300',
  },
  {
    id: 'maghrib',
    label: 'Maghrib',
    icon: Sunset,
    activeClass: 'bg-gradient-to-r from-[#8f2950] to-[#e06a26] text-white border border-orange-300/70',
    iconClass: 'text-orange-300',
  },
  {
    id: 'isha',
    label: 'Isha Night',
    icon: Moon,
    activeClass: 'bg-gradient-to-r from-[#0b4a6e] to-[#0d8252] text-emerald-100 border border-emerald-300/70',
    iconClass: 'text-emerald-300',
  },
];

export const Haramain3DShowcase: React.FC = () => {
  const viewportShellRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<HaramainSceneController | null>(null);

  const [activeCamera, setActiveCamera] = useState<CameraPresetId>('overview');
  const [activeLighting, setActiveLighting] = useState<LightingPresetId>('golden');
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkId>('rotana');
  const [autoRotate, setAutoRotate] = useState(true);
  const [tawafPlaying, setTawafPlaying] = useState(true);
  const [showWalkway, setShowWalkway] = useState(true);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  // Mount Three.js engine once inside isolated ref container
  useEffect(() => {
    const mountEl = canvasMountRef.current;
    if (!mountEl) return;

    let controller: HaramainSceneController | null = null;
    try {
      controller = new HaramainSceneController({
        container: mountEl,
        onSelectLandmark: (landmarkId) => {
          setSelectedLandmark(landmarkId);
          const targetCam = LANDMARK_INFO[landmarkId].camera;
          setActiveCamera(targetCam);
          controllerRef.current?.setCameraPreset(targetCam);
        },
        onWebGLError: () => setWebglUnavailable(true),
      });
      controllerRef.current = controller;
    } catch {
      setWebglUnavailable(true);
    }

    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      if (e.key === 'h' || e.key === 'H') {
        setDockCollapsed((prev) => !prev);
      }
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      window.removeEventListener('keydown', onKeyDown);
      controller?.dispose();
      controllerRef.current = null;
    };
  }, []);

  const handleCameraPreset = (presetId: CameraPresetId) => {
    setActiveCamera(presetId);
    controllerRef.current?.setCameraPreset(presetId);
    if (presetId === 'kaaba') setSelectedLandmark('kaaba');
    else if (presetId === 'rotana') setSelectedLandmark('rotana');
    else if (presetId === 'skyline') setSelectedLandmark('minarets');
  };

  const handleLightingPreset = (presetId: LightingPresetId) => {
    setActiveLighting(presetId);
    controllerRef.current?.setLightingPreset(presetId);
  };

  const handleToggleAutoRotate = () => {
    const next = !autoRotate;
    setAutoRotate(next);
    controllerRef.current?.setAutoRotate(next);
  };

  const handleToggleTawaf = () => {
    const next = !tawafPlaying;
    setTawafPlaying(next);
    controllerRef.current?.setTawafPlaying(next);
  };

  const handleToggleWalkway = () => {
    const next = !showWalkway;
    setShowWalkway(next);
    controllerRef.current?.setShowWalkway(next);
  };

  const handleToggleFullscreen = () => {
    const shell = viewportShellRef.current;
    if (!shell) return;
    if (!document.fullscreenElement) {
      shell.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const currentInfo = LANDMARK_INFO[selectedLandmark];

  return (
    <section
      id="sanctuary-3d"
      className="py-16 sm:py-24 bg-gradient-to-b from-[#042d1d] via-[#062630] to-[#031c14] text-white border-b border-[#c9a227]/35 scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Clean Editorial Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
            Interactive Architectural 3D Sanctuary · Real-Time WebGL
          </p>
          <h2 className="mt-3 font-serif text-3xl sm:text-5xl text-white font-semibold [text-wrap:balance]">
            Explore <span className="text-[#f5cf5b]">Masjid al-Haram</span> &amp;{' '}
            <span className="text-emerald-300">Rotana Jabal Omar</span> in 3D
          </h2>
          <div className="mx-auto mt-5 h-0.5 w-36 bg-gradient-to-r from-emerald-400 via-[#f5cf5b] to-sky-400 rounded-full"></div>
          <p className="mt-4 text-sm sm:text-base text-slate-200/90 font-light leading-relaxed [text-wrap:balance]">
            Orbit freely in 360°, switch between vivid Makkah skies from rose-gold Fajr to emerald-lit Isha Night, and inspect the palm-lined <strong className="text-[#f5cf5b] font-semibold">150-meter level walk</strong> from Rotana Jabal Omar Makkah to the Holy Haram courtyard.
          </p>
        </div>

        {/* Full-Presence Unobstructed 3D Viewport Frame */}
        <div
          ref={viewportShellRef}
          className={`mt-10 relative w-full rounded-3xl overflow-hidden border border-[#e6c453]/55 bg-[#05232b] shadow-2xl ${
            isFullscreen ? 'h-screen rounded-none border-0' : 'h-[540px] sm:h-[620px] lg:h-[680px]'
          }`}
        >
          {/* Isolated WebGL Mount Container (Never contains React HUD children) */}
          <div ref={canvasMountRef} className="absolute inset-0 w-full h-full" />

          {/* Graceful Fallback if WebGL Context Fails */}
          {webglUnavailable && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-[#031c10]">
              <Building2 className="w-12 h-12 text-[#c9a227] mb-4" />
              <h3 className="font-serif text-2xl font-bold text-white">
                Masjid al-Haram &amp; Rotana Jabal Omar Makkah (150m)
              </h3>
              <p className="mt-2 max-w-md text-sm text-white/75">
                Interactive 3D rendering requires hardware or software WebGL support. You can continue exploring all Hajj 2027 packages and hotel details below.
              </p>
            </div>
          )}

          {/* Top-Left Minimal Landmark Readout (Solid translucent dark surface, zero backdrop-filter over WebGL) */}
          {!webglUnavailable && (
            <div className="pointer-events-none absolute top-4 left-4 z-10 max-w-xs sm:max-w-sm">
              <div className="pointer-events-auto rounded-2xl bg-[#02170d]/90 border border-[#c9a227]/40 px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-[#e6c964]">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-[#c9a227]" />
                  <span className="truncate">{currentInfo.subtitle}</span>
                </div>
                <h3 className="mt-1 font-serif text-base sm:text-lg font-bold text-white leading-snug">
                  {currentInfo.title}
                </h3>
                <p className="mt-1 text-xs text-white/75 leading-relaxed hidden sm:block">
                  {currentInfo.detail}
                </p>
                <p className="mt-2 text-[11px] text-[#c9a227]/90 font-medium">
                  Drag to orbit · Scroll to zoom · Click landmarks to inspect
                </p>
              </div>
            </div>
          )}

          {/* Top-Right Compact Fullscreen Button Only (Zero side-panel clutter) */}
          {!webglUnavailable && (
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#02170d]/90 hover:bg-[#05331d] border border-[#c9a227]/40 px-3 py-2 text-xs font-semibold text-[#e6c964] transition-colors whitespace-nowrap"
                title={isFullscreen ? 'Exit Fullscreen' : 'View 3D Fullscreen'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Exit</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Fullscreen</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Unified Collapsible Bottom Control Dock (Zero Viewport Occlusion) */}
          {!webglUnavailable && (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 sm:bottom-5 z-10 flex flex-col items-center px-3">
              {/* Collapse / Expand Drawer Handle */}
              <button
                type="button"
                onClick={() => setDockCollapsed((prev) => !prev)}
                className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#02170d]/92 hover:bg-[#063620] border border-[#c9a227]/45 px-3.5 py-1 text-[11px] font-semibold text-[#e6c964] shadow transition-colors whitespace-nowrap"
                aria-expanded={!dockCollapsed}
              >
                {dockCollapsed ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    <span>Show 3D Controls</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>Hide Controls</span>
                  </>
                )}
              </button>

              {/* Main Horizontal Control Dock */}
              <div
                className={`pointer-events-auto w-full max-w-[990px] rounded-2xl bg-[#02170d]/92 border border-[#c9a227]/45 px-3 py-2.5 sm:px-4 sm:py-3 shadow-2xl transition-all duration-200 ${
                  dockCollapsed
                    ? 'opacity-0 translate-y-6 pointer-events-none h-0 py-0 overflow-hidden border-0'
                    : 'opacity-100 translate-y-0'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  {/* Camera Viewpoint Presets */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[11px] font-semibold text-white/60 mr-1 hidden md:inline-flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-[#c9a227]" />
                      View
                    </span>
                    {CAMERA_BUTTONS.map((btn) => {
                      const active = activeCamera === btn.id;
                      return (
                        <button
                          key={btn.id}
                          type="button"
                          onClick={() => handleCameraPreset(btn.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                            active
                              ? 'bg-[#c9a227] text-[#032b19]'
                              : 'bg-white/5 text-white/85 hover:bg-white/15'
                          }`}
                        >
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <span className="hidden lg:block h-5 w-px bg-white/15" aria-hidden="true" />

                  {/* Time-of-Day Lighting Switcher */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {LIGHTING_BUTTONS.map((btn) => {
                      const Icon = btn.icon;
                      const active = activeLighting === btn.id;
                      return (
                        <button
                          key={btn.id}
                          type="button"
                          onClick={() => handleLightingPreset(btn.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                            active
                              ? btn.activeClass
                              : 'bg-white/5 text-white/85 hover:bg-white/15 border border-transparent'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : btn.iconClass}`} />
                          <span>{btn.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Divider */}
                  <span className="hidden xl:block h-5 w-px bg-white/15" aria-hidden="true" />

                  {/* Scene Toggles (150m Path, Tawaf Motion, Orbit) */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleToggleWalkway}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        showWalkway
                          ? 'bg-emerald-600/35 text-emerald-200 border border-emerald-400/60'
                          : 'bg-white/5 text-white/70 hover:bg-white/15 border border-transparent'
                      }`}
                      title="Toggle 150m Rotana to Haram illuminated walking route"
                    >
                      <Route className="w-3.5 h-3.5 text-emerald-300" />
                      <span>150m Path</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleTawaf}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/15 text-white/85 transition-colors whitespace-nowrap shrink-0"
                      title={tawafPlaying ? 'Pause Tawaf motion' : 'Resume Tawaf motion'}
                    >
                      {tawafPlaying ? (
                        <Pause className="w-3.5 h-3.5 text-[#c9a227]" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-[#c9a227]" />
                      )}
                      <span className="hidden sm:inline">Tawaf</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleAutoRotate}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                        autoRotate
                          ? 'bg-white/15 text-[#e6c964]'
                          : 'bg-white/5 text-white/70 hover:bg-white/15'
                      }`}
                      title={autoRotate ? 'Stop gentle camera orbit' : 'Start gentle camera orbit'}
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Orbit</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clean Unboxed Architectural Legend Strip Below Viewport */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/70">
          <span className="inline-flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#c9a227]" />
            <span>PBR Silk Kiswah &amp; 24K Gold Hizam</span>
          </span>
          <span aria-hidden="true" className="text-white/30">·</span>
          <span>Live Counter-Clockwise Tawaf (400+ Pilgrims)</span>
          <span aria-hidden="true" className="text-white/30">·</span>
          <span>Rotana Jabal Omar Makkah (150m Direct Promenade)</span>
          <span aria-hidden="true" className="text-white/30">·</span>
          <span>Press H to toggle Zen View</span>
        </div>
      </div>
    </section>
  );
};

export default Haramain3DShowcase;
