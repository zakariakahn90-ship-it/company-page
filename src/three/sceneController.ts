import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createProceduralTextureBundle } from './textures.ts';
import { buildHaramainScene, LandmarkId } from './models.ts';

export type CameraPresetId = 'overview' | 'kaaba' | 'rotana' | 'mataf' | 'skyline';
export type LightingPresetId = 'fajr' | 'zuhr' | 'golden' | 'maghrib' | 'isha';

interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
}

interface LightingConfig {
  zenith: THREE.Color;
  midSky: THREE.Color;
  horizon: THREE.Color;
  fog: THREE.Color;
  fogDensity: number;
  sunPos: THREE.Vector3;
  sunColor: THREE.Color;
  sunIntensity: number;
  hemiSky: THREE.Color;
  hemiGround: THREE.Color;
  hemiIntensity: number;
  rimColor: THREE.Color;
  rimIntensity: number;
  emissiveMult: number;
  hotelEmissive: number;
  lanternIntensity: number;
  starOpacity: number;
  motesOpacity: number;
  envIntensity: number;
  exposure: number;
}

const CAMERA_PRESETS: Record<CameraPresetId, CameraPreset> = {
  overview: {
    position: [-26, 26, 48],
    target: [-10, 4.5, 4],
  },
  kaaba: {
    position: [13.5, 7.2, 13.5],
    target: [0, 3.0, 0],
  },
  rotana: {
    position: [-62, 22, 34],
    target: [-22, 7.5, 7],
  },
  mataf: {
    position: [2, 36, 18],
    target: [0, 1.5, 0],
  },
  skyline: {
    position: [28, 10.5, 38],
    target: [-18, 11.5, 6],
  },
};

const LIGHTING_PRESETS: Record<LightingPresetId, LightingConfig> = {
  fajr: {
    zenith: new THREE.Color(0x121c56),
    midSky: new THREE.Color(0x634185),
    horizon: new THREE.Color(0xff9284),
    fog: new THREE.Color(0x4c3650),
    fogDensity: 0.0026,
    sunPos: new THREE.Vector3(65, 20, -32),
    sunColor: new THREE.Color(0xffb8a3),
    sunIntensity: 1.65,
    hemiSky: new THREE.Color(0x7c93d4),
    hemiGround: new THREE.Color(0x3a282e),
    hemiIntensity: 0.48,
    rimColor: new THREE.Color(0x65a8e0),
    rimIntensity: 0.32,
    emissiveMult: 1.65,
    hotelEmissive: 1.35,
    lanternIntensity: 3.6,
    starOpacity: 0.55,
    motesOpacity: 0.25,
    envIntensity: 0.26,
    exposure: 0.98,
  },
  zuhr: {
    zenith: new THREE.Color(0x0047ab),
    midSky: new THREE.Color(0x2ea3f2),
    horizon: new THREE.Color(0x8fd0f5),
    fog: new THREE.Color(0x9ecae3),
    fogDensity: 0.0014,
    sunPos: new THREE.Vector3(16, 70, 20),
    sunColor: new THREE.Color(0xfff6e5),
    sunIntensity: 2.35,
    hemiSky: new THREE.Color(0x7ec2eb),
    hemiGround: new THREE.Color(0x524232),
    hemiIntensity: 0.54,
    rimColor: new THREE.Color(0x6ebae0),
    rimIntensity: 0.22,
    emissiveMult: 0.5,
    hotelEmissive: 0.14,
    lanternIntensity: 0.5,
    starOpacity: 0.0,
    motesOpacity: 0.0,
    envIntensity: 0.36,
    exposure: 0.96,
  },
  golden: {
    zenith: new THREE.Color(0x0c52ad),
    midSky: new THREE.Color(0x3ba0db),
    horizon: new THREE.Color(0xffd085),
    fog: new THREE.Color(0xa6bfd1),
    fogDensity: 0.0016,
    sunPos: new THREE.Vector3(48, 34, 32),
    sunColor: new THREE.Color(0xffe0a6),
    sunIntensity: 2.1,
    hemiSky: new THREE.Color(0x74b5e0),
    hemiGround: new THREE.Color(0x4a3827),
    hemiIntensity: 0.48,
    rimColor: new THREE.Color(0x5caed6),
    rimIntensity: 0.26,
    emissiveMult: 0.9,
    hotelEmissive: 0.38,
    lanternIntensity: 1.4,
    starOpacity: 0.0,
    motesOpacity: 0.06,
    envIntensity: 0.34,
    exposure: 0.98,
  },
  maghrib: {
    zenith: new THREE.Color(0x1b0e4a),
    midSky: new THREE.Color(0xa83458),
    horizon: new THREE.Color(0xff7d30),
    fog: new THREE.Color(0x4a232e),
    fogDensity: 0.0028,
    sunPos: new THREE.Vector3(-68, 14, 22),
    sunColor: new THREE.Color(0xff8e42),
    sunIntensity: 1.75,
    hemiSky: new THREE.Color(0x7b568a),
    hemiGround: new THREE.Color(0x361e16),
    hemiIntensity: 0.44,
    rimColor: new THREE.Color(0xe69f48),
    rimIntensity: 0.38,
    emissiveMult: 1.95,
    hotelEmissive: 1.65,
    lanternIntensity: 4.4,
    starOpacity: 0.58,
    motesOpacity: 0.32,
    envIntensity: 0.24,
    exposure: 1.0,
  },
  isha: {
    zenith: new THREE.Color(0x040d29),
    midSky: new THREE.Color(0x0a2c47),
    horizon: new THREE.Color(0x0e5441),
    fog: new THREE.Color(0x061b20),
    fogDensity: 0.0032,
    sunPos: new THREE.Vector3(24, 52, 24),
    sunColor: new THREE.Color(0x9ec0f5),
    sunIntensity: 0.95,
    hemiSky: new THREE.Color(0x356480),
    hemiGround: new THREE.Color(0x18211b),
    hemiIntensity: 0.42,
    rimColor: new THREE.Color(0x2bc482),
    rimIntensity: 0.45,
    emissiveMult: 2.35,
    hotelEmissive: 2.05,
    lanternIntensity: 5.5,
    starOpacity: 0.98,
    motesOpacity: 0.38,
    envIntensity: 0.16,
    exposure: 1.04,
  },
};

// Reusable module-scope math helpers (zero GC inside animation loop)
const _dummy = new THREE.Object3D();
const _vec3A = new THREE.Vector3();
const _vec3B = new THREE.Vector3();
const _mouse = new THREE.Vector2();

function detectSoftwareWebGL(): boolean {
  try {
    const gl = document.createElement('canvas').getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

/**
 * Creates a procedural atmospheric sky dome with horizon-to-zenith gradient, solar disc glow,
 * and procedural night stars.
 */
function createSkyDome(): { mesh: THREE.Mesh; uniforms: Record<string, THREE.IUniform> } {
  const uniforms = {
    uZenithColor: { value: LIGHTING_PRESETS.golden.zenith.clone() },
    uMidSkyColor: { value: LIGHTING_PRESETS.golden.midSky.clone() },
    uHorizonColor: { value: LIGHTING_PRESETS.golden.horizon.clone() },
    uSunDir: { value: LIGHTING_PRESETS.golden.sunPos.clone().normalize() },
    uSunColor: { value: LIGHTING_PRESETS.golden.sunColor.clone() },
    uStarOpacity: { value: 0.0 },
    uTime: { value: 0.0 },
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    vertexShader: `
      varying vec3 vWorldDir;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldDir = normalize(worldPos.xyz);
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform vec3 uZenithColor;
      uniform vec3 uMidSkyColor;
      uniform vec3 uHorizonColor;
      uniform vec3 uSunDir;
      uniform vec3 uSunColor;
      uniform float uStarOpacity;
      uniform float uTime;
      varying vec3 vWorldDir;

      float hash(vec3 p) {
        p = fract(p * 0.3183099 + 0.1);
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }

      void main() {
        vec3 dir = normalize(vWorldDir);
        float h = clamp(dir.y, 0.0, 1.0);
        // 3-stop cinematic sky gradient (horizon -> midSky -> zenith)
        vec3 lowBand = mix(uHorizonColor, uMidSkyColor, smoothstep(0.0, 0.28, h));
        vec3 col = mix(lowBand, uZenithColor, smoothstep(0.22, 0.82, h));

        // Soft solar / lunar atmospheric halo
        float sunDot = max(dot(dir, normalize(uSunDir)), 0.0);
        col += uSunColor * pow(sunDot, 12.0) * 0.38;
        col += uSunColor * pow(sunDot, 180.0) * 0.92;

        // Crisp multi-tinted starfield for Fajr, Maghrib & Isha night skies
        if (uStarOpacity > 0.01 && dir.y > 0.06) {
          vec3 grid = floor(dir * 210.0);
          float n = hash(grid);
          if (n > 0.9935) {
            float twinkle = 0.65 + 0.35 * sin(uTime * 1.9 + n * 120.0);
            vec3 starTint = mix(vec3(0.78, 0.92, 1.0), vec3(1.0, 0.92, 0.72), fract(n * 37.0));
            col += starTint * uStarOpacity * twinkle * smoothstep(0.06, 0.28, dir.y);
          }
        }

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(280, 32, 20), mat);
  return { mesh, uniforms };
}

export interface HaramainSceneOptions {
  container: HTMLElement;
  onSelectLandmark: (id: LandmarkId) => void;
  onWebGLError?: () => void;
}

export class HaramainSceneController {
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer | null = null;
  private bloomPass: UnrealBloomPass | null = null;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  private isSoftwareGl: boolean;
  private frameId = 0;
  private disposed = false;
  private isVisible = true;
  private clock = new THREE.Clock();

  // Dynamic state
  private targetCamPos = new THREE.Vector3(...CAMERA_PRESETS.overview.position);
  private targetCamLook = new THREE.Vector3(...CAMERA_PRESETS.overview.target);
  private isCameraFlying = false;
  private targetLighting: LightingConfig = LIGHTING_PRESETS.golden;
  private autoRotateEnabled = true;
  private tawafPlaying = true;
  private showWalkway = true;

  // Scene references
  private sunLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;
  private rimLight: THREE.DirectionalLight;
  private fog: THREE.FogExp2;
  private skyUniforms: Record<string, THREE.IUniform>;
  private artifacts: ReturnType<typeof buildHaramainScene>;
  private textureBundle: ReturnType<typeof createProceduralTextureBundle>;
  private envRT: THREE.WebGLRenderTarget;

  // Interaction
  private raycaster = new THREE.Raycaster();
  private lastRaycastMs = 0;
  private pointerDownPos = { x: 0, y: 0 };
  private onSelectLandmark: (id: LandmarkId) => void;

  // Observers & listeners
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;
  private cleanupListeners: () => void;

  constructor(options: HaramainSceneOptions) {
    const { container, onSelectLandmark, onWebGLError } = options;
    this.onSelectLandmark = onSelectLandmark;
    this.isSoftwareGl = detectSoftwareWebGL();

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);

    // 1. Renderer configured to Three.js r160+ PBR standards
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = LIGHTING_PRESETS.golden.exposure;
    this.renderer.setPixelRatio(
      this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const canvas = this.renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.outline = 'none';
    container.appendChild(canvas);

    // 2. Scene, Horizon-Matched Fog & Procedural Studio IBL Environment
    this.scene = new THREE.Scene();
    this.fog = new THREE.FogExp2(
      LIGHTING_PRESETS.golden.fog.getHex(),
      LIGHTING_PRESETS.golden.fogDensity
    );
    this.scene.fog = this.fog;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    this.scene.environment = this.envRT.texture;
    this.scene.environmentIntensity = LIGHTING_PRESETS.golden.envIntensity;
    pmrem.dispose();

    // 3. Camera & OrbitControls
    this.camera = new THREE.PerspectiveCamera(44, width / height, 0.5, 420);
    this.camera.position.set(...CAMERA_PRESETS.overview.position);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.target.set(...CAMERA_PRESETS.overview.target);
    this.controls.enableDamping = !this.isSoftwareGl;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 8.5;
    this.controls.maxDistance = 98;
    this.controls.maxPolarAngle = Math.PI * 0.465;
    this.controls.minPolarAngle = 0.14;
    this.controls.autoRotate = !this.isSoftwareGl && this.autoRotateEnabled;
    this.controls.autoRotateSpeed = 0.42;
    this.controls.update();

    // Cancel any scripted flight immediately when user grabs the viewport
    this.controls.addEventListener('start', () => {
      this.isCameraFlying = false;
    });

    // 4. Atmospheric Sky Dome
    const sky = createSkyDome();
    this.skyUniforms = sky.uniforms;
    this.scene.add(sky.mesh);

    // 5. Three-Point Warm/Cool Studio Architectural Lighting Rig
    this.hemiLight = new THREE.HemisphereLight(
      LIGHTING_PRESETS.golden.hemiSky.getHex(),
      LIGHTING_PRESETS.golden.hemiGround.getHex(),
      LIGHTING_PRESETS.golden.hemiIntensity
    );
    this.hemiLight.position.set(0, 60, 0);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(
      LIGHTING_PRESETS.golden.sunColor.getHex(),
      LIGHTING_PRESETS.golden.sunIntensity
    );
    this.sunLight.position.copy(LIGHTING_PRESETS.golden.sunPos);
    this.sunLight.castShadow = !this.isSoftwareGl;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 180;
    const d = 52;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0003;
    this.sunLight.shadow.normalBias = 0.018;
    this.sunLight.shadow.radius = 2.0;
    this.scene.add(this.sunLight);

    this.rimLight = new THREE.DirectionalLight(
      LIGHTING_PRESETS.golden.rimColor.getHex(),
      LIGHTING_PRESETS.golden.rimIntensity
    );
    this.rimLight.position.set(-45, 28, -42);
    this.scene.add(this.rimLight);

    // 6. Procedural PBR Textures & Composite Multi-Part Architectural Scene
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    this.textureBundle = createProceduralTextureBundle(maxAniso);
    this.artifacts = buildHaramainScene(this.textureBundle, this.isSoftwareGl);
    this.scene.add(this.artifacts.root);

    // Restrict raycaster strictly to proxy hitboxes on layer 1
    this.raycaster.layers.set(1);

    // 7. Post-Processing Bloom Pipeline on Hardware GPUs (high threshold prevents white marble bloom halos)
    if (!this.isSoftwareGl) {
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      this.bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        0.22, // refined lantern glow only
        0.38,
        1.45  // strict HDR threshold: never blooms sunlit marble or architectural surfaces
      );
      this.composer.addPass(this.bloomPass);
      this.composer.addPass(new OutputPass());
      this.renderer.compile(this.scene, this.camera);
    }

    // 8. Event Listeners (Raycasting, Context Loss, Resize, Visibility)
    const onPointerDown = (e: PointerEvent) => {
      this.pointerDownPos.x = e.clientX;
      this.pointerDownPos.y = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      const dx = e.clientX - this.pointerDownPos.x;
      const dy = e.clientY - this.pointerDownPos.y;
      if (dx * dx + dy * dy > 36) return; // Ignore orbit drags

      const rect = canvas.getBoundingClientRect();
      _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(_mouse, this.camera);
      const hits = this.raycaster.intersectObjects(this.artifacts.interactables, false);
      if (hits.length > 0) {
        const landmarkId = hits[0].object.userData.landmarkId as LandmarkId | undefined;
        if (landmarkId) {
          this.onSelectLandmark(landmarkId);
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - this.lastRaycastMs < 60) return;
      this.lastRaycastMs = now;

      const rect = canvas.getBoundingClientRect();
      _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      this.raycaster.setFromCamera(_mouse, this.camera);
      const hits = this.raycaster.intersectObjects(this.artifacts.interactables, false);
      canvas.style.cursor = hits.length > 0 ? 'pointer' : 'grab';
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(this.frameId);
      clearTimeout(this.frameId);
      onWebGLError?.();
    };

    const onContextRestored = () => {
      this.clock.getDelta();
      this.scheduleNextFrame();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('webglcontextlost', onContextLost, false);
    canvas.addEventListener('webglcontextrestored', onContextRestored, false);

    this.cleanupListeners = () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
    };

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(Math.floor(entry.contentRect.width), 300);
        const h = Math.max(Math.floor(entry.contentRect.height), 300);
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
        if (this.composer) {
          this.composer.setSize(w, h);
        }
        if (this.bloomPass) {
          this.bloomPass.resolution.set(w, h);
        }
      }
    });
    this.resizeObserver.observe(container);

    // Pause heavy rendering when scrolled completely off-screen to preserve page responsiveness
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const wasVisible = this.isVisible;
        this.isVisible = entries[0]?.isIntersecting ?? true;
        if (!wasVisible && this.isVisible && !this.disposed) {
          this.clock.getDelta();
          this.tick();
        }
      },
      { threshold: 0.02 }
    );
    this.intersectionObserver.observe(container);

    // Start animation loop
    this.clock.start();
    this.tick();
  }

  public setCameraPreset(presetId: CameraPresetId) {
    const preset = CAMERA_PRESETS[presetId];
    if (!preset) return;
    this.targetCamPos.set(...preset.position);
    this.targetCamLook.set(...preset.target);
    this.isCameraFlying = true;
  }

  public setLightingPreset(presetId: LightingPresetId) {
    this.targetLighting = LIGHTING_PRESETS[presetId] || LIGHTING_PRESETS.golden;
  }

  public setAutoRotate(enabled: boolean) {
    this.autoRotateEnabled = enabled;
    this.controls.autoRotate = !this.isSoftwareGl && enabled;
  }

  public setTawafPlaying(playing: boolean) {
    this.tawafPlaying = playing;
  }

  public setShowWalkway(visible: boolean) {
    this.showWalkway = visible;
    this.artifacts.walkwayGroup.visible = visible;
  }

  private afterDraw(cb: () => void) {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      if (this.disposed) {
        if (sync) gl.deleteSync(sync);
        return;
      }
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 80);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }

  private scheduleNextFrame() {
    if (this.disposed || !this.isVisible) return;
    if (this.isSoftwareGl) {
      this.afterDraw(() => this.tick());
    } else {
      this.frameId = requestAnimationFrame(() => this.tick());
    }
  }

  private tick() {
    if (this.disposed || !this.isVisible) return;

    const delta = Math.min(this.clock.getDelta(), 0.08);
    const elapsed = this.clock.getElapsedTime();

    // 1. Smoothly damp camera preset transitions
    if (this.isCameraFlying) {
      const lambda = 4.2;
      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, this.targetCamPos.x, lambda, delta);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, this.targetCamPos.y, lambda, delta);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, this.targetCamPos.z, lambda, delta);

      this.controls.target.x = THREE.MathUtils.damp(this.controls.target.x, this.targetCamLook.x, lambda, delta);
      this.controls.target.y = THREE.MathUtils.damp(this.controls.target.y, this.targetCamLook.y, lambda, delta);
      this.controls.target.z = THREE.MathUtils.damp(this.controls.target.z, this.targetCamLook.z, lambda, delta);

      if (
        this.camera.position.distanceToSquared(this.targetCamPos) < 0.04 &&
        this.controls.target.distanceToSquared(this.targetCamLook) < 0.04
      ) {
        this.isCameraFlying = false;
      }
    }

    this.controls.update();

    // 2. Smoothly damp time-of-day atmosphere, lighting, fog, and emissives
    const L = this.targetLighting;
    const dampFactor = 1 - Math.exp(-3.2 * delta);

    (this.skyUniforms.uZenithColor.value as THREE.Color).lerp(L.zenith, dampFactor);
    (this.skyUniforms.uMidSkyColor.value as THREE.Color).lerp(L.midSky, dampFactor);
    (this.skyUniforms.uHorizonColor.value as THREE.Color).lerp(L.horizon, dampFactor);
    (this.skyUniforms.uSunColor.value as THREE.Color).lerp(L.sunColor, dampFactor);
    this.skyUniforms.uStarOpacity.value = THREE.MathUtils.damp(
      this.skyUniforms.uStarOpacity.value as number,
      L.starOpacity,
      3.0,
      delta
    );
    this.skyUniforms.uTime.value = elapsed;

    this.sunLight.position.lerp(L.sunPos, dampFactor);
    (this.skyUniforms.uSunDir.value as THREE.Vector3).copy(this.sunLight.position).normalize();
    this.sunLight.color.lerp(L.sunColor, dampFactor);
    this.sunLight.intensity = THREE.MathUtils.damp(this.sunLight.intensity, L.sunIntensity, 3.0, delta);

    this.hemiLight.color.lerp(L.hemiSky, dampFactor);
    this.hemiLight.groundColor.lerp(L.hemiGround, dampFactor);
    this.hemiLight.intensity = THREE.MathUtils.damp(this.hemiLight.intensity, L.hemiIntensity, 3.0, delta);

    this.rimLight.color.lerp(L.rimColor, dampFactor);
    this.rimLight.intensity = THREE.MathUtils.damp(this.rimLight.intensity, L.rimIntensity, 3.0, delta);

    this.fog.color.lerp(L.fog, dampFactor);
    this.fog.density = THREE.MathUtils.damp(this.fog.density, L.fogDensity, 3.0, delta);

    this.renderer.toneMappingExposure = THREE.MathUtils.damp(
      this.renderer.toneMappingExposure,
      L.exposure,
      3.0,
      delta
    );

    this.scene.environmentIntensity = THREE.MathUtils.damp(
      this.scene.environmentIntensity,
      L.envIntensity,
      3.0,
      delta
    );

    this.artifacts.hotelFacadeMaterial.emissiveIntensity = THREE.MathUtils.damp(
      this.artifacts.hotelFacadeMaterial.emissiveIntensity,
      L.hotelEmissive,
      3.0,
      delta
    );

    for (let i = 0; i < this.artifacts.emissiveMaterials.length; i++) {
      const m = this.artifacts.emissiveMaterials[i];
      m.emissiveIntensity = THREE.MathUtils.damp(m.emissiveIntensity, L.emissiveMult, 3.0, delta);
    }

    for (let i = 0; i < this.artifacts.lanternLights.length; i++) {
      const pt = this.artifacts.lanternLights[i];
      pt.intensity = THREE.MathUtils.damp(pt.intensity, L.lanternIntensity, 3.0, delta);
    }

    const motesMat = this.artifacts.motesPoints.material as THREE.PointsMaterial;
    motesMat.opacity = THREE.MathUtils.damp(motesMat.opacity, L.motesOpacity, 2.5, delta);
    this.artifacts.motesPoints.rotation.y = elapsed * 0.025;

    // 3. Animate Instanced Pilgrims (Counter-clockwise Tawaf + 150m Rotana Promenade Walk)
    const { pilgrimMesh, pilgrimData, walkwayCurve, walkwayBeads } = this.artifacts;
    const stepDelta = this.tawafPlaying ? delta : 0;

    for (let i = 0; i < pilgrimData.length; i++) {
      const p = pilgrimData[i];
      if (p.mode === 'tawaf') {
        // Authentic counter-clockwise Tawaf around the Holy Kaaba (increasing angle in right-handed XZ with +Z front)
        p.angle -= p.speed * stepDelta;
        const bob = this.tawafPlaying ? Math.abs(Math.sin(elapsed * 4.5 + p.bobPhase)) * 0.045 : 0;
        _dummy.position.set(
          Math.cos(p.angle) * p.radius,
          0.02 + bob,
          Math.sin(p.angle) * p.radius
        );
        _dummy.rotation.set(0, -p.angle, 0);
        _dummy.scale.set(1, p.scaleY, 1);
      } else {
        p.t = (p.t + p.speed * stepDelta) % 1;
        walkwayCurve.getPointAt(p.t, _vec3A);
        walkwayCurve.getTangentAt(p.t, _vec3B);
        // Perpendicular lateral offset along promenade width
        const perpX = -_vec3B.z;
        const perpZ = _vec3B.x;
        const bob = this.tawafPlaying ? Math.abs(Math.sin(elapsed * 4.8 + p.bobPhase)) * 0.04 : 0;
        _dummy.position.set(
          _vec3A.x + perpX * p.laneOffset,
          0.06 + bob,
          _vec3A.z + perpZ * p.laneOffset
        );
        _dummy.rotation.set(0, Math.atan2(_vec3B.x, _vec3B.z), 0);
        _dummy.scale.set(1, p.scaleY, 1);
      }
      _dummy.updateMatrix();
      pilgrimMesh.setMatrixAt(i, _dummy.matrix);
    }
    pilgrimMesh.instanceMatrix.needsUpdate = true;

    // 4. Animate Glowing Light Beads along the 150m Rotana -> Haram Corridor
    if (this.showWalkway) {
      const beadCount = walkwayBeads.count;
      for (let i = 0; i < beadCount; i++) {
        const u = ((i / beadCount) + elapsed * 0.14) % 1;
        walkwayCurve.getPointAt(u, _vec3A);
        const pulseScale = 0.72 + Math.sin(u * Math.PI) * 0.45;
        _dummy.position.set(_vec3A.x, _vec3A.y + 0.18, _vec3A.z);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.setScalar(pulseScale);
        _dummy.updateMatrix();
        walkwayBeads.setMatrixAt(i, _dummy.matrix);
      }
      walkwayBeads.instanceMatrix.needsUpdate = true;
    }

    // 5. Render Frame
    if (this.composer && !this.isSoftwareGl) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }

    this.scheduleNextFrame();
  }

  public dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.cleanupListeners();
    this.controls.dispose();
    this.artifacts.dispose();
    this.textureBundle.dispose();
    this.envRT.dispose();
    this.composer?.dispose();
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
