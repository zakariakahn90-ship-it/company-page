import * as THREE from 'three';
import { ProceduralTextureBundle } from './textures.ts';

export type LandmarkId = 'kaaba' | 'rotana' | 'maqam' | 'minarets' | 'walkway';

export interface SceneBuildArtifacts {
  root: THREE.Group;
  interactables: THREE.Object3D[];
  pilgrimMesh: THREE.InstancedMesh;
  pilgrimData: PilgrimInstanceData[];
  walkwayGroup: THREE.Group;
  walkwayBeads: THREE.InstancedMesh;
  walkwayCurve: THREE.CatmullRomCurve3;
  emissiveMaterials: THREE.MeshStandardMaterial[];
  hotelFacadeMaterial: THREE.MeshPhysicalMaterial;
  lanternLights: THREE.PointLight[];
  motesPoints: THREE.Points;
  dispose: () => void;
}

export interface PilgrimInstanceData {
  mode: 'tawaf' | 'walkway';
  radius: number;
  angle: number;
  speed: number;
  bobPhase: number;
  scaleY: number;
  t: number;
  laneOffset: number;
}

const _dummy = new THREE.Object3D();
const _color = new THREE.Color();

/**
 * Helper to create a raycast proxy box on layer 1 for effortless, high-performance picking.
 */
function createHitProxy(
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  landmarkId: LandmarkId
): THREE.Mesh {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshBasicMaterial({ visible: false });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.layers.set(1);
  mesh.userData.landmarkId = landmarkId;
  return mesh;
}

/**
 * Helper to create an authentic Arabian date palm tree (planter + curved bark trunk + vibrant emerald crown).
 */
function buildDatePalm(
  planterMat: THREE.Material,
  trunkMat: THREE.Material,
  frondMat: THREE.Material,
  soilMat: THREE.Material
): THREE.Group {
  const palm = new THREE.Group();

  // Octagonal marble planter box with lush emerald soil bed
  const planter = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.62, 0.52, 8), planterMat);
  planter.position.y = 0.26;
  planter.castShadow = true;
  planter.receiveShadow = true;
  palm.add(planter);

  const foliageBed = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.14, 8), soilMat);
  foliageBed.position.y = 0.52;
  palm.add(foliageBed);

  // Tapered date palm trunk
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.22, 3.6, 8), trunkMat);
  trunk.position.y = 2.25;
  trunk.castShadow = true;
  palm.add(trunk);

  // Radiating lush green palm fronds (8 arched leaves)
  const frondGeo = new THREE.ConeGeometry(0.32, 1.95, 4);
  frondGeo.scale(1.0, 1.0, 0.25);
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2;
    const pivot = new THREE.Group();
    pivot.position.y = 4.0;
    pivot.rotation.y = ang;

    const leaf = new THREE.Mesh(frondGeo, frondMat);
    leaf.rotation.z = -Math.PI * 0.36;
    leaf.position.set(0.75, 0.22, 0);
    leaf.castShadow = true;
    pivot.add(leaf);

    // Lower secondary tier frond
    if (i % 2 === 0) {
      const lowerLeaf = new THREE.Mesh(frondGeo, frondMat);
      lowerLeaf.scale.setScalar(0.82);
      lowerLeaf.rotation.z = -Math.PI * 0.48;
      lowerLeaf.position.set(0.62, -0.08, 0);
      pivot.add(lowerLeaf);
    }

    palm.add(pivot);
  }

  return palm;
}

/**
 * Builds the composite 12-part Holy Kaaba, Hijr Ismail (Hateem), and Maqam Ibrahim pavilion.
 */
function buildSacredCenter(
  textures: ProceduralTextureBundle,
  isSoftwareGl: boolean,
  emissiveMaterials: THREE.MeshStandardMaterial[],
  lanternLights: THREE.PointLight[]
): { group: THREE.Group; proxies: THREE.Object3D[] } {
  const group = new THREE.Group();
  const proxies: THREE.Object3D[] = [];

  const goldMat = new THREE.MeshPhysicalMaterial({
    color: 0xf7ca3e,
    metalness: 0.94,
    roughness: 0.16,
    anisotropy: 0.65,
    clearcoat: 0.8,
    clearcoatRoughness: 0.14,
  });

  const emeraldMarbleMat = new THREE.MeshPhysicalMaterial({
    color: 0x0b7a4b,
    roughness: 0.22,
    metalness: 0.08,
    clearcoat: 0.6,
    clearcoatRoughness: 0.18,
  });

  const whiteMarbleMat = new THREE.MeshPhysicalMaterial({
    color: 0xe6e4de,
    roughness: 0.34,
    metalness: 0.02,
    clearcoat: 0.25,
    clearcoatRoughness: 0.28,
    envMapIntensity: 0.42,
  });

  const silverMat = new THREE.MeshPhysicalMaterial({
    color: 0xeef3f9,
    metalness: 0.98,
    roughness: 0.12,
    clearcoat: 0.5,
  });

  const kiswahMat = new THREE.MeshStandardMaterial({
    map: textures.kiswahAlbedo,
    metalnessMap: textures.kiswahMetalness,
    roughnessMap: textures.kiswahRoughness,
    bumpMap: textures.kiswahBump,
    bumpScale: 0.065,
    metalness: 1.0,
    roughness: 1.0,
  });

  const roofMat = new THREE.MeshStandardMaterial({
    color: 0xd8d3c8,
    roughness: 0.68,
    metalness: 0.02,
    envMapIntensity: 0.35,
  });

  // 1. Tight physically grounded ambient-occlusion skirt flush beneath the Shadherwan plinth
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(6.6, 6.2),
    new THREE.MeshBasicMaterial({
      map: textures.contactShadow,
      transparent: true,
      depthWrite: false,
      opacity: 0.55,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    })
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.012;
  group.add(shadowPlane);

  // 2. Shadherwan (sloping white & royal emerald-trimmed marble base plinth)
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(5.38, 0.34, 4.98), whiteMarbleMat);
  plinth.position.y = 0.17;
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  group.add(plinth);

  const plinthEmeraldBand = new THREE.Mesh(new THREE.BoxGeometry(5.42, 0.09, 5.02), emeraldMarbleMat);
  plinthEmeraldBand.position.y = 0.09;
  group.add(plinthEmeraldBand);

  const plinthTrim = new THREE.Mesh(new THREE.BoxGeometry(5.1, 0.22, 4.7), whiteMarbleMat);
  plinthTrim.position.y = 0.42;
  plinthTrim.receiveShadow = true;
  group.add(plinthTrim);

  // 3. Main Kaaba Structure
  const kaabaW = 4.6;
  const kaabaH = 5.3;
  const kaabaD = 4.2;
  const kaabaMaterials = [
    kiswahMat,
    kiswahMat,
    roofMat,
    roofMat,
    kiswahMat,
    kiswahMat,
  ];
  const kaabaCube = new THREE.Mesh(
    new THREE.BoxGeometry(kaabaW, kaabaH, kaabaD),
    kaabaMaterials
  );
  kaabaCube.position.y = 0.34 + kaabaH / 2;
  kaabaCube.castShadow = true;
  kaabaCube.receiveShadow = true;
  group.add(kaabaCube);

  // 4. Roof Parapet Rim & Golden Cornice Accent
  const parapet = new THREE.Mesh(
    new THREE.BoxGeometry(kaabaW + 0.14, 0.22, kaabaD + 0.14),
    new THREE.MeshStandardMaterial({
      color: 0x10141c,
      roughness: 0.72,
      metalness: 0.1,
    })
  );
  parapet.position.y = 0.34 + kaabaH + 0.08;
  group.add(parapet);

  const roofGoldTrim = new THREE.Mesh(
    new THREE.BoxGeometry(kaabaW + 0.18, 0.07, kaabaD + 0.18),
    goldMat
  );
  roofGoldTrim.position.y = 0.34 + kaabaH + 0.19;
  group.add(roofGoldTrim);

  const roofInset = new THREE.Mesh(new THREE.BoxGeometry(kaabaW - 0.5, 0.08, kaabaD - 0.5), whiteMarbleMat);
  roofInset.position.y = 0.34 + kaabaH + 0.05;
  group.add(roofInset);

  // 5. Bab al-Kaaba (Solid 24K Gold Door on +X face)
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.08, 1.24), goldMat);
  doorFrame.position.set(kaabaW / 2 + 0.03, 0.34 + 1.85, 0.65);
  group.add(doorFrame);

  const doorPanelMat = new THREE.MeshPhysicalMaterial({
    map: textures.doorAlbedo,
    bumpMap: textures.doorBump,
    bumpScale: 0.08,
    metalness: 0.94,
    roughness: 0.18,
    clearcoat: 0.7,
  });
  const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.9, 1.06), doorPanelMat);
  doorMesh.position.set(kaabaW / 2 + 0.08, 0.34 + 1.85, 0.65);
  group.add(doorMesh);

  // 6. Hajar al-Aswad (The Black Stone in gleaming silver bezel at Southeast corner)
  const hajarGroup = new THREE.Group();
  hajarGroup.position.set(kaabaW / 2 + 0.04, 0.34 + 1.18, kaabaD / 2 - 0.04);
  hajarGroup.rotation.y = Math.PI / 4;

  const silverBezel = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.065, 16, 28), silverMat);
  silverBezel.scale.set(0.82, 1.25, 0.8);
  hajarGroup.add(silverBezel);

  const blackStone = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 20, 16),
    new THREE.MeshPhysicalMaterial({
      color: 0x161418,
      roughness: 0.08,
      metalness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
    })
  );
  blackStone.scale.set(0.75, 1.15, 0.5);
  hajarGroup.add(blackStone);
  group.add(hajarGroup);

  // 7. Mizab al-Rahmah (24K Golden Rain Spout)
  const mizab = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.14, 0.95), goldMat);
  mizab.position.set(0, 0.34 + kaabaH - 0.08, -kaabaD / 2 - 0.42);
  mizab.castShadow = true;
  group.add(mizab);

  // 8. Hijr Ismail / Hateem (Semi-circular white marble enclosure with turquoise-tinted mosaic floor)
  const hateemShape = new THREE.Shape();
  const outerR = 2.65;
  const innerR = 2.18;
  hateemShape.absarc(0, 0, outerR, 0, Math.PI, false);
  hateemShape.lineTo(-innerR, 0);
  hateemShape.absarc(0, 0, innerR, Math.PI, 0, true);
  hateemShape.closePath();

  const hateemGeo = new THREE.ExtrudeGeometry(hateemShape, {
    depth: 0.72,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.04,
    bevelSegments: 3,
    curveSegments: 36,
  });
  hateemGeo.rotateX(-Math.PI / 2);
  const hateemWall = new THREE.Mesh(hateemGeo, whiteMarbleMat);
  hateemWall.position.set(0, 0.03, -kaabaD / 2 - 0.65);
  hateemWall.castShadow = true;
  hateemWall.receiveShadow = true;
  group.add(hateemWall);

  // Cool turquoise-jade inlaid marble floor inside Hijr Ismail
  const hateemFloor = new THREE.Mesh(
    new THREE.CircleGeometry(innerR + 0.05, 32, 0, Math.PI),
    new THREE.MeshStandardMaterial({
      color: 0xd4ece4,
      roughness: 0.22,
      metalness: 0.05,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    })
  );
  hateemFloor.rotation.x = -Math.PI / 2;
  hateemFloor.position.set(0, 0.04, -kaabaD / 2 - 0.65);
  group.add(hateemFloor);

  // Three golden lanterns along the Hateem wall
  const lanternGlowMat = new THREE.MeshStandardMaterial({
    color: 0xfff3c4,
    emissive: 0xffc638,
    emissiveIntensity: 1.55,
    roughness: 0.18,
  });
  emissiveMaterials.push(lanternGlowMat);

  for (const ang of [Math.PI * 0.15, Math.PI * 0.5, Math.PI * 0.85]) {
    const lx = Math.cos(ang) * ((outerR + innerR) / 2);
    const lz = -kaabaD / 2 - 0.65 - Math.sin(ang) * ((outerR + innerR) / 2);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.36, 12), goldMat);
    post.position.set(lx, 0.94, lz);
    group.add(post);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), lanternGlowMat);
    bulb.position.set(lx, 1.18, lz);
    group.add(bulb);
  }

  // 9. Maqam Ibrahim (Ornate Golden & Emerald-Base Glass Pavilion east of Kaaba)
  const maqamGroup = new THREE.Group();
  maqamGroup.position.set(kaabaW / 2 + 3.4, 0, 0.55);

  const maqamBase1 = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.05, 0.22, 8), emeraldMarbleMat);
  maqamBase1.position.y = 0.11;
  maqamBase1.receiveShadow = true;
  maqamGroup.add(maqamBase1);

  const maqamBase2 = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.74, 0.35, 8), goldMat);
  maqamBase2.position.y = 0.39;
  maqamBase2.castShadow = true;
  maqamGroup.add(maqamBase2);

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe6fff8,
    metalness: 0.05,
    roughness: 0.06,
    transmission: isSoftwareGl ? 0 : 0.88,
    transparent: true,
    opacity: isSoftwareGl ? 0.45 : 1.0,
    ior: 1.52,
    thickness: 0.4,
    clearcoat: 1.0,
    depthWrite: false,
  });
  const maqamGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.54, 0.92, 20), glassMat);
  maqamGlass.position.y = 1.02;
  maqamGlass.renderOrder = 2;
  maqamGroup.add(maqamGlass);

  const innerStone = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.42, 0.38),
    new THREE.MeshStandardMaterial({ color: 0xd4a862, roughness: 0.65 })
  );
  innerStone.position.y = 0.82;
  maqamGroup.add(innerStone);

  const domePts = [
    new THREE.Vector2(0.62, 0),
    new THREE.Vector2(0.64, 0.12),
    new THREE.Vector2(0.56, 0.38),
    new THREE.Vector2(0.36, 0.68),
    new THREE.Vector2(0.12, 0.92),
    new THREE.Vector2(0.03, 1.06),
    new THREE.Vector2(0.0, 1.15),
  ];
  const maqamDome = new THREE.Mesh(new THREE.LatheGeometry(domePts, 24), goldMat);
  maqamDome.position.y = 1.48;
  maqamDome.castShadow = true;
  maqamGroup.add(maqamDome);

  const maqamLight = new THREE.PointLight(0xffcf6e, 2.4, 11, 2);
  maqamLight.position.set(0, 1.2, 0);
  maqamGroup.add(maqamLight);
  lanternLights.push(maqamLight);

  group.add(maqamGroup);

  proxies.push(createHitProxy(6.2, 6.2, 6.2, 0, 3.1, 0, 'kaaba'));
  proxies.push(createHitProxy(2.6, 3.0, 2.6, kaabaW / 2 + 3.4, 1.5, 0.55, 'maqam'));

  return { group, proxies };
}

/**
 * Builds an 8-part composite Makkah Grand Minaret with rich emerald/turquoise tile bands,
 * burnished copper-gold cupola, glowing emerald-amber lantern, and 24K gold crescent.
 */
function buildMakkahMinaret(
  limestoneMat: THREE.Material,
  emeraldTileMat: THREE.Material,
  turquoiseTileMat: THREE.Material,
  copperGoldMat: THREE.Material,
  goldMat: THREE.Material,
  lanternMat: THREE.Material
): THREE.Group {
  const m = new THREE.Group();

  // 1. Square stone base plinth with emerald marble cornice
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 5.2, 2.6), limestoneMat);
  base.position.y = 2.6;
  base.castShadow = true;
  base.receiveShadow = true;
  m.add(base);

  const baseEmeraldTrim = new THREE.Mesh(new THREE.BoxGeometry(2.74, 0.42, 2.74), emeraldTileMat);
  baseEmeraldTrim.position.y = 5.05;
  m.add(baseEmeraldTrim);

  // 2. First octagonal shaft
  const shaft1 = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.32, 8.2, 8), limestoneMat);
  shaft1.position.y = 5.2 + 4.1;
  shaft1.castShadow = true;
  m.add(shaft1);

  // 3. Lower carved balcony with turquoise ceramic inlay & gold rail
  const balc1 = new THREE.Mesh(new THREE.CylinderGeometry(1.68, 1.18, 1.1, 16), limestoneMat);
  balc1.position.y = 13.4;
  balc1.castShadow = true;
  m.add(balc1);

  const balc1Tile = new THREE.Mesh(new THREE.CylinderGeometry(1.72, 1.66, 0.36, 16), turquoiseTileMat);
  balc1Tile.position.y = 13.72;
  m.add(balc1Tile);

  const balc1Trim = new THREE.Mesh(new THREE.TorusGeometry(1.68, 0.095, 10, 24), goldMat);
  balc1Trim.rotation.x = Math.PI / 2;
  balc1Trim.position.y = 14.0;
  m.add(balc1Trim);

  // 4. Upper cylindrical shaft
  const shaft2 = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 1.06, 6.2, 16), limestoneMat);
  shaft2.position.y = 13.95 + 3.1;
  shaft2.castShadow = true;
  m.add(shaft2);

  // 5. Upper gallery balcony with emerald mosaic accent
  const balc2 = new THREE.Mesh(new THREE.CylinderGeometry(1.42, 0.96, 0.95, 16), limestoneMat);
  balc2.position.y = 20.15;
  m.add(balc2);

  const balc2Emerald = new THREE.Mesh(new THREE.CylinderGeometry(1.46, 1.4, 0.32, 16), emeraldTileMat);
  balc2Emerald.position.y = 20.42;
  m.add(balc2Emerald);

  // 6. Illuminated Lantern Pavilion (Warm golden-emerald glowing arches)
  const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.76, 0.82, 2.4, 12), lanternMat);
  lantern.position.y = 21.8;
  m.add(lantern);

  // 7. Sculpted LatheGeometry Ribbed Burnished Copper-Gold Conical Cupola
  const spirePts = [
    new THREE.Vector2(0.96, 0),
    new THREE.Vector2(0.88, 0.5),
    new THREE.Vector2(0.55, 1.6),
    new THREE.Vector2(0.24, 3.0),
    new THREE.Vector2(0.08, 4.1),
    new THREE.Vector2(0.0, 4.6),
  ];
  const spire = new THREE.Mesh(new THREE.LatheGeometry(spirePts, 16), copperGoldMat);
  spire.position.y = 23.0;
  spire.castShadow = true;
  m.add(spire);

  // 8. 24K Gold Crescent Finial (Hilal)
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.8, 8), goldMat);
  mast.position.y = 28.2;
  m.add(mast);

  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), goldMat);
  orb.position.y = 28.3;
  m.add(orb);

  const crescent = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.085, 10, 20, Math.PI * 1.45), goldMat);
  crescent.position.y = 29.35;
  crescent.rotation.z = Math.PI * 0.78;
  m.add(crescent);

  return m;
}

/**
 * Builds the Mataf Courtyard, Multi-Tiered Haram Colonnade Galleries (Riwaq),
 * King Fahd Ceremonial Gate, and 6 Grand Minarets with rich Islamic architectural hues.
 */
function buildHaramComplex(
  textures: ProceduralTextureBundle,
  emissiveMaterials: THREE.MeshStandardMaterial[],
  lanternLights: THREE.PointLight[]
): { group: THREE.Group; proxies: THREE.Object3D[] } {
  const group = new THREE.Group();
  const proxies: THREE.Object3D[] = [];

  const matafMat = new THREE.MeshStandardMaterial({
    map: textures.marbleAlbedo,
    roughnessMap: textures.marbleRoughness,
    bumpMap: textures.marbleBump,
    bumpScale: 0.018,
    roughness: 0.88,
    metalness: 0.02,
    envMapIntensity: 0.28,
  });

  const limestoneMat = new THREE.MeshStandardMaterial({
    map: textures.limestoneAlbedo,
    bumpMap: textures.limestoneBump,
    bumpScale: 0.032,
    roughness: 0.78,
    metalness: 0.02,
    envMapIntensity: 0.38,
  });

  const emeraldTileMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a7e4b,
    roughness: 0.24,
    metalness: 0.12,
    clearcoat: 0.7,
    clearcoatRoughness: 0.18,
  });

  const turquoiseTileMat = new THREE.MeshPhysicalMaterial({
    color: 0x108ea3,
    roughness: 0.22,
    metalness: 0.14,
    clearcoat: 0.75,
    clearcoatRoughness: 0.15,
  });

  const domeSandstoneMat = new THREE.MeshStandardMaterial({
    color: 0xe9bc76,
    roughness: 0.45,
    metalness: 0.16,
  });

  const copperGoldMat = new THREE.MeshPhysicalMaterial({
    color: 0xd99638,
    metalness: 0.78,
    roughness: 0.26,
    clearcoat: 0.5,
  });

  const goldMat = new THREE.MeshPhysicalMaterial({
    color: 0xf5c83c,
    metalness: 0.95,
    roughness: 0.16,
    clearcoat: 0.7,
  });

  const arcadeGlowMat = new THREE.MeshStandardMaterial({
    color: 0xfff2c2,
    emissive: 0xffba42,
    emissiveIntensity: 1.25,
    roughness: 0.3,
  });
  emissiveMaterials.push(arcadeGlowMat);

  const minaretLanternGlowMat = new THREE.MeshStandardMaterial({
    color: 0xc8ffea,
    emissive: 0x14d685,
    emissiveIntensity: 1.35,
    roughness: 0.22,
  });
  emissiveMaterials.push(minaretLanternGlowMat);

  // 1. Vast Luminous White Marble Mataf Courtyard Ground
  const matafFloor = new THREE.Mesh(new THREE.CircleGeometry(30, 64), matafMat);
  matafFloor.rotation.x = -Math.PI / 2;
  matafFloor.position.y = 0;
  matafFloor.receiveShadow = true;
  group.add(matafFloor);

  // Vibrant alternating inlaid turquoise-teal, emerald-green, and champagne-gold concentric rings
  const ringConfigs = [
    { r: 8.5, color: 0x15988b },
    { r: 13.5, color: 0xd9a834 },
    { r: 18.5, color: 0x0d8050 },
    { r: 23.2, color: 0xc7952c },
  ];
  for (const cfg of ringConfigs) {
    const ringMat = new THREE.MeshStandardMaterial({
      color: cfg.color,
      roughness: 0.3,
      metalness: 0.18,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(cfg.r - 0.16, cfg.r + 0.16, 64), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.015;
    ring.receiveShadow = true;
    group.add(ring);
  }

  // Iconic Vibrant Emerald-Green Start-of-Tawaf Alignment Line extending from Hajar al-Aswad
  const greenLineMat = new THREE.MeshStandardMaterial({
    color: 0x00c868,
    emissive: 0x009e50,
    emissiveIntensity: 0.75,
    roughness: 0.18,
    polygonOffset: true,
    polygonOffsetFactor: -2,
  });
  emissiveMaterials.push(greenLineMat);
  const tawafLine = new THREE.Mesh(new THREE.PlaneGeometry(18.5, 0.32), greenLineMat);
  tawafLine.rotation.x = -Math.PI / 2;
  tawafLine.rotation.z = -Math.PI / 4;
  tawafLine.position.set(8.6, 0.022, 8.6);
  group.add(tawafLine);

  // 2. Surrounding Multi-Story Haram Colonnade Galleries (Riwaq) with Emerald & Gold Frieze
  const arcadeRadius = 26.5;
  const bayCount = 44;
  const pillarGeo = new THREE.CylinderGeometry(0.36, 0.42, 7.6, 10);
  const archTopGeo = new THREE.BoxGeometry(3.85, 1.8, 2.2);
  const friezeGeo = new THREE.BoxGeometry(3.88, 0.44, 2.28);
  const domeGeo = new THREE.SphereGeometry(1.15, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeFinialGeo = new THREE.ConeGeometry(0.14, 0.55, 8);

  const validBays: number[] = [];
  for (let i = 0; i < bayCount; i++) {
    const angle = (i / bayCount) * Math.PI * 2;
    if (angle > 2.52 && angle < 3.08) continue;
    validBays.push(angle);
  }

  const pillarInst = new THREE.InstancedMesh(pillarGeo, limestoneMat, validBays.length * 2);
  const archInst = new THREE.InstancedMesh(archTopGeo, limestoneMat, validBays.length);
  const friezeInst = new THREE.InstancedMesh(friezeGeo, emeraldTileMat, validBays.length);
  const domeInst = new THREE.InstancedMesh(domeGeo, domeSandstoneMat, validBays.length);
  const finialInst = new THREE.InstancedMesh(domeFinialGeo, goldMat, validBays.length);
  const glowInst = new THREE.InstancedMesh(new THREE.PlaneGeometry(2.6, 4.6), arcadeGlowMat, validBays.length);

  pillarInst.castShadow = true;
  pillarInst.receiveShadow = true;
  archInst.castShadow = true;
  archInst.receiveShadow = true;
  friezeInst.castShadow = true;
  friezeInst.receiveShadow = true;
  domeInst.castShadow = true;
  domeInst.receiveShadow = true;

  validBays.forEach((angle, idx) => {
    const x = Math.cos(angle) * arcadeRadius;
    const z = Math.sin(angle) * arcadeRadius;

    _dummy.position.set(Math.cos(angle) * (arcadeRadius - 1.1), 3.8, Math.sin(angle) * (arcadeRadius - 1.1));
    _dummy.rotation.set(0, -angle, 0);
    _dummy.scale.set(1, 1, 1);
    _dummy.updateMatrix();
    pillarInst.setMatrixAt(idx * 2, _dummy.matrix);

    _dummy.position.set(Math.cos(angle) * (arcadeRadius + 1.2), 3.8, Math.sin(angle) * (arcadeRadius + 1.2));
    _dummy.updateMatrix();
    pillarInst.setMatrixAt(idx * 2 + 1, _dummy.matrix);

    _dummy.position.set(x, 8.2, z);
    _dummy.rotation.set(0, -angle + Math.PI / 2, 0);
    _dummy.updateMatrix();
    archInst.setMatrixAt(idx, _dummy.matrix);

    // Rich royal emerald-green Islamic frieze ribbon crowning the arcade
    _dummy.position.set(x, 8.95, z);
    _dummy.rotation.set(0, -angle + Math.PI / 2, 0);
    _dummy.updateMatrix();
    friezeInst.setMatrixAt(idx, _dummy.matrix);

    // Warm golden-ochre Ottoman domes crowning the gallery roof
    _dummy.position.set(x, 9.15, z);
    _dummy.rotation.set(0, 0, 0);
    _dummy.updateMatrix();
    domeInst.setMatrixAt(idx, _dummy.matrix);

    // 24K Gold spire finial atop every dome
    _dummy.position.set(x, 10.52, z);
    _dummy.updateMatrix();
    finialInst.setMatrixAt(idx, _dummy.matrix);

    // Warm glowing arched gallery interior backdrop
    _dummy.position.set(Math.cos(angle) * (arcadeRadius + 1.6), 3.4, Math.sin(angle) * (arcadeRadius + 1.6));
    _dummy.rotation.set(0, -angle - Math.PI / 2, 0);
    _dummy.updateMatrix();
    glowInst.setMatrixAt(idx, _dummy.matrix);
  });

  [pillarInst, archInst, friezeInst, domeInst, finialInst, glowInst].forEach((inst) => {
    inst.instanceMatrix.needsUpdate = true;
    inst.computeBoundingSphere();
    group.add(inst);
  });

  // 3. Outer Haram Stone Plaza Deck with warm sunlit travertine & turquoise-marble outer border ring
  const outerPlaza = new THREE.Mesh(
    new THREE.RingGeometry(28.5, 95, 64),
    new THREE.MeshStandardMaterial({
      color: 0xd9c8ae,
      roughness: 0.82,
      metalness: 0.02,
      envMapIntensity: 0.3,
    })
  );
  outerPlaza.rotation.x = -Math.PI / 2;
  outerPlaza.position.y = -0.04;
  outerPlaza.receiveShadow = true;
  group.add(outerPlaza);

  const outerAccentRing = new THREE.Mesh(
    new THREE.RingGeometry(31.2, 32.1, 64),
    new THREE.MeshStandardMaterial({
      color: 0x0e8772,
      roughness: 0.36,
      metalness: 0.08,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    })
  );
  outerAccentRing.rotation.x = -Math.PI / 2;
  outerAccentRing.position.y = -0.02;
  group.add(outerAccentRing);

  // 4. Grand Ceremonial Gate Portal (King Fahd Gate with Emerald, Turquoise & 24K Gold Inlays)
  const gateAngle = 2.8;
  const gateGroup = new THREE.Group();
  gateGroup.position.set(Math.cos(gateAngle) * arcadeRadius, 0, Math.sin(gateAngle) * arcadeRadius);
  gateGroup.rotation.y = -gateAngle + Math.PI / 2;

  const gatePylonGeo = new THREE.BoxGeometry(2.4, 11.5, 3.2);
  const leftPylon = new THREE.Mesh(gatePylonGeo, limestoneMat);
  leftPylon.position.set(-4.2, 5.75, 0);
  leftPylon.castShadow = true;
  gateGroup.add(leftPylon);

  const rightPylon = new THREE.Mesh(gatePylonGeo, limestoneMat);
  rightPylon.position.set(4.2, 5.75, 0);
  rightPylon.castShadow = true;
  gateGroup.add(rightPylon);

  // Emerald-green inlaid marble panels on both pylons
  const pylonPanelGeo = new THREE.BoxGeometry(1.3, 8.2, 3.32);
  const leftInlay = new THREE.Mesh(pylonPanelGeo, emeraldTileMat);
  leftInlay.position.set(-4.2, 5.6, 0);
  gateGroup.add(leftInlay);

  const rightInlay = new THREE.Mesh(pylonPanelGeo, emeraldTileMat);
  rightInlay.position.set(4.2, 5.6, 0);
  gateGroup.add(rightInlay);

  const gateHeader = new THREE.Mesh(new THREE.BoxGeometry(10.8, 3.2, 3.4), limestoneMat);
  gateHeader.position.set(0, 10.6, 0);
  gateHeader.castShadow = true;
  gateGroup.add(gateHeader);

  const gateTurquoiseFrieze = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.9, 3.48), turquoiseTileMat);
  gateTurquoiseFrieze.position.set(0, 10.35, 0);
  gateGroup.add(gateTurquoiseFrieze);

  const gateGoldBand = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.5, 3.55), goldMat);
  gateGoldBand.position.set(0, 11.65, 0);
  gateGroup.add(gateGoldBand);

  group.add(gateGroup);

  // 5. Six Iconic Makkah Grand Minarets positioned around the perimeter
  const minaretAngles = [0.45, 1.35, 2.38, 3.22, 4.35, 5.45];
  minaretAngles.forEach((ang, i) => {
    const minaret = buildMakkahMinaret(
      limestoneMat,
      emeraldTileMat,
      turquoiseTileMat,
      copperGoldMat,
      goldMat,
      minaretLanternGlowMat
    );
    const mx = Math.cos(ang) * (arcadeRadius + 3.2);
    const mz = Math.sin(ang) * (arcadeRadius + 3.2);
    minaret.position.set(mx, 0, mz);
    group.add(minaret);

    if (i === 2 || i === 3) {
      const mLight = new THREE.PointLight(0x4effaa, 3.8, 28, 1.6);
      mLight.position.set(mx, 22, mz);
      group.add(mLight);
      lanternLights.push(mLight);
    }
  });

  const sampleAng = minaretAngles[2];
  proxies.push(
    createHitProxy(
      5,
      28,
      5,
      Math.cos(sampleAng) * (arcadeRadius + 3.2),
      14,
      Math.sin(sampleAng) * (arcadeRadius + 3.2),
      'minarets'
    )
  );

  return { group, proxies };
}

/**
 * Builds the contemporary luxury Rotana Jabal Omar Makkah tower complex at the 150m mark
 * with signature ruby-gold crown accents, sapphire reflective glass, lush palm-lined plaza,
 * and an illuminated emerald-to-gold 150m pedestrian promenade.
 */
function buildRotanaJabalOmarAndWalkway(
  textures: ProceduralTextureBundle,
  emissiveMaterials: THREE.MeshStandardMaterial[],
  lanternLights: THREE.PointLight[]
): {
  hotelGroup: THREE.Group;
  walkwayGroup: THREE.Group;
  walkwayBeads: THREE.InstancedMesh;
  walkwayCurve: THREE.CatmullRomCurve3;
  hotelFacadeMaterial: THREE.MeshPhysicalMaterial;
  proxies: THREE.Object3D[];
} {
  const hotelGroup = new THREE.Group();
  const proxies: THREE.Object3D[] = [];

  const hotelOrigin = new THREE.Vector3(-44, 0, 14.5);
  hotelGroup.position.copy(hotelOrigin);
  hotelGroup.rotation.y = 0.34;

  const podiumStoneMat = new THREE.MeshStandardMaterial({
    map: textures.limestoneAlbedo,
    bumpMap: textures.limestoneBump,
    bumpScale: 0.025,
    color: 0xf2dbb6,
    roughness: 0.58,
    metalness: 0.05,
  });

  const rotanaCrimsonMat = new THREE.MeshPhysicalMaterial({
    color: 0xa61d33,
    roughness: 0.25,
    metalness: 0.22,
    clearcoat: 0.75,
    clearcoatRoughness: 0.16,
  });

  const goldTrimMat = new THREE.MeshPhysicalMaterial({
    color: 0xf4c63d,
    metalness: 0.94,
    roughness: 0.16,
    clearcoat: 0.75,
  });

  const hotelFacadeMaterial = new THREE.MeshPhysicalMaterial({
    map: textures.hotelFacadeAlbedo,
    emissiveMap: textures.hotelFacadeEmissive,
    emissive: new THREE.Color(0xffd682),
    emissiveIntensity: 0.75,
    roughnessMap: textures.hotelFacadeRoughness,
    metalnessMap: textures.hotelFacadeMetalness,
    roughness: 0.8,
    metalness: 0.9,
    clearcoat: 0.45,
    clearcoatRoughness: 0.16,
  });

  const crownGlowMat = new THREE.MeshStandardMaterial({
    color: 0xffeaa8,
    emissive: 0xffc638,
    emissiveIntensity: 1.7,
    roughness: 0.18,
  });
  emissiveMaterials.push(crownGlowMat);

  // 1. Grand Stepped Podium Base (Shopping Arcade & Lobby)
  const podium1 = new THREE.Mesh(new THREE.BoxGeometry(19.5, 4.4, 13.5), podiumStoneMat);
  podium1.position.y = 2.2;
  podium1.castShadow = true;
  podium1.receiveShadow = true;
  hotelGroup.add(podium1);

  const podiumCrimsonRibbon = new THREE.Mesh(new THREE.BoxGeometry(19.8, 0.75, 13.8), rotanaCrimsonMat);
  podiumCrimsonRibbon.position.y = 4.1;
  hotelGroup.add(podiumCrimsonRibbon);

  const podiumCornice = new THREE.Mesh(new THREE.BoxGeometry(20.2, 0.45, 14.2), goldTrimMat);
  podiumCornice.position.y = 4.62;
  hotelGroup.add(podiumCornice);

  // Illuminated Rotana Lobby Entrance Canopy facing Masjid al-Haram (+X face)
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.48, 8.0), rotanaCrimsonMat);
  canopy.position.set(10.9, 3.55, 0);
  canopy.castShadow = true;
  hotelGroup.add(canopy);

  const canopyGoldEdge = new THREE.Mesh(new THREE.BoxGeometry(3.52, 0.16, 8.12), goldTrimMat);
  canopyGoldEdge.position.set(10.9, 3.82, 0);
  hotelGroup.add(canopyGoldEdge);

  const lobbyGlow = new THREE.Mesh(new THREE.PlaneGeometry(7.0, 2.95), crownGlowMat);
  lobbyGlow.rotation.y = Math.PI / 2;
  lobbyGlow.position.set(9.78, 1.75, 0);
  hotelGroup.add(lobbyGlow);

  // 2. Primary Rotana Jabal Omar Central Luxury Tower
  const mainTower = new THREE.Mesh(new THREE.BoxGeometry(11.2, 27.5, 9.6), hotelFacadeMaterial);
  mainTower.position.set(0, 4.4 + 13.75, 0);
  mainTower.castShadow = true;
  mainTower.receiveShadow = true;
  hotelGroup.add(mainTower);

  // 3. Flanking Twin Wing Towers
  const leftWing = new THREE.Mesh(new THREE.BoxGeometry(7.2, 21.5, 7.8), hotelFacadeMaterial);
  leftWing.position.set(-1.5, 4.4 + 10.75, -8.2);
  leftWing.castShadow = true;
  leftWing.receiveShadow = true;
  hotelGroup.add(leftWing);

  const rightWing = new THREE.Mesh(new THREE.BoxGeometry(7.2, 23.0, 7.8), hotelFacadeMaterial);
  rightWing.position.set(-1.5, 4.4 + 11.5, 8.2);
  rightWing.castShadow = true;
  rightWing.receiveShadow = true;
  hotelGroup.add(rightWing);

  // 4. Sculpted Rooftop Crown Parapets with Rotana Crimson & 24K Gold Illuminated Crest
  const addCrown = (x: number, y: number, z: number, w: number, d: number) => {
    const cap = new THREE.Mesh(new THREE.BoxGeometry(w + 0.5, 1.35, d + 0.5), podiumStoneMat);
    cap.position.set(x, y + 0.65, z);
    hotelGroup.add(cap);

    const crimsonBand = new THREE.Mesh(new THREE.BoxGeometry(w + 0.58, 0.42, d + 0.58), rotanaCrimsonMat);
    crimsonBand.position.set(x, y + 0.48, z);
    hotelGroup.add(crimsonBand);

    const glowStrip = new THREE.Mesh(new THREE.BoxGeometry(w + 0.66, 0.3, d + 0.66), crownGlowMat);
    glowStrip.position.set(x, y + 1.15, z);
    hotelGroup.add(glowStrip);
  };

  addCrown(0, 31.9, 0, 11.2, 9.6);
  addCrown(-1.5, 25.9, -8.2, 7.2, 7.8);
  addCrown(-1.5, 27.4, 8.2, 7.2, 7.8);

  // 5. Architectural Rooftop Crest Finial on Main Tower
  const crownArch = new THREE.Mesh(new THREE.BoxGeometry(6.8, 2.2, 6.2), rotanaCrimsonMat);
  crownArch.position.set(0, 34.1, 0);
  hotelGroup.add(crownArch);

  const crownFinial = new THREE.Mesh(new THREE.BoxGeometry(7.1, 0.35, 6.5), goldTrimMat);
  crownFinial.position.set(0, 35.35, 0);
  hotelGroup.add(crownFinial);

  const hotelLight = new THREE.PointLight(0xffd27a, 3.6, 24, 1.8);
  hotelLight.position.set(11.5, 5.2, 0);
  hotelGroup.add(hotelLight);
  lanternLights.push(hotelLight);

  proxies.push(createHitProxy(20, 36, 26, hotelOrigin.x, 18, hotelOrigin.z, 'rotana'));

  // === ILLUMINATED 150m PEDESTRIAN PROMENADE CONNECTING ROTANA TO HARAM COURTYARD ===
  const walkwayGroup = new THREE.Group();
  const walkwayCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-34.2, 0.14, 11.4),
    new THREE.Vector3(-29.5, 0.14, 9.8),
    new THREE.Vector3(-25.0, 0.14, 8.8),
    new THREE.Vector3(-20.2, 0.14, 7.2),
  ]);

  // Luminous emerald-gold 150m ribbon line
  const ribbonMat = new THREE.MeshStandardMaterial({
    color: 0x26e68a,
    emissive: 0x0ec76e,
    emissiveIntensity: 1.5,
    roughness: 0.18,
    metalness: 0.4,
  });
  emissiveMaterials.push(ribbonMat);

  const ribbonMesh = new THREE.Mesh(new THREE.TubeGeometry(walkwayCurve, 36, 0.16, 8, false), ribbonMat);
  walkwayGroup.add(ribbonMesh);

  // Crisp honed marble promenade paving with twin golden edge rails
  const promenadePaving = new THREE.Mesh(
    new THREE.BoxGeometry(16.8, 0.08, 4.6),
    new THREE.MeshStandardMaterial({
      color: 0xe0d9cb,
      roughness: 0.62,
      metalness: 0.03,
      envMapIntensity: 0.3,
    })
  );
  promenadePaving.position.set(-27.2, 0.03, 9.3);
  promenadePaving.rotation.y = 0.28;
  promenadePaving.receiveShadow = true;
  walkwayGroup.add(promenadePaving);

  const edgeRailGeo = new THREE.BoxGeometry(16.8, 0.11, 0.2);
  for (const offsetZ of [-2.25, 2.25]) {
    const rail = new THREE.Mesh(edgeRailGeo, goldTrimMat);
    const cos = Math.cos(0.28);
    const sin = Math.sin(0.28);
    rail.position.set(-27.2 + sin * offsetZ, 0.05, 9.3 + cos * offsetZ);
    rail.rotation.y = 0.28;
    walkwayGroup.add(rail);
  }

  // Lush Emerald Date Palms & Glowing Lantern Bollards flanking the 150m Promenade
  const planterMat = new THREE.MeshStandardMaterial({ color: 0xf4eee2, roughness: 0.45 });
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x7a5130, roughness: 0.88 });
  const frondMat = new THREE.MeshStandardMaterial({ color: 0x1d8f46, roughness: 0.55, flatShading: true });
  const soilMat = new THREE.MeshStandardMaterial({ color: 0x136e36, roughness: 0.8 });

  const palmPositions: [number, number][] = [
    [-33.6, 15.0],
    [-29.2, 13.7],
    [-31.2, 6.2],
    [-26.8, 5.0],
    [-36.5, 19.2],
    [-35.2, 8.6],
  ];
  for (const [px, pz] of palmPositions) {
    const palm = buildDatePalm(planterMat, trunkMat, frondMat, soilMat);
    palm.position.set(px, 0, pz);
    palm.rotation.y = px * 0.7;
    walkwayGroup.add(palm);
  }

  // Animated traveling radiant 24K golden light beads along the 150m corridor
  const beadCount = 14;
  const beadGeo = new THREE.SphereGeometry(0.25, 12, 12);
  const beadMat = new THREE.MeshStandardMaterial({
    color: 0xfff8d6,
    emissive: 0xffc830,
    emissiveIntensity: 2.3,
    roughness: 0.1,
  });
  emissiveMaterials.push(beadMat);

  const walkwayBeads = new THREE.InstancedMesh(beadGeo, beadMat, beadCount);
  walkwayBeads.frustumCulled = false;
  walkwayGroup.add(walkwayBeads);

  proxies.push(createHitProxy(15, 2.5, 5, -27.2, 1.2, 9.3, 'walkway'));

  return {
    hotelGroup,
    walkwayGroup,
    walkwayBeads,
    walkwayCurve,
    hotelFacadeMaterial,
    proxies,
  };
}

/**
 * Builds rich warm Hejaz desert hills (terracotta, burnt sienna, ochre, amethyst)
 * and the iconic illuminated emerald-and-gold Makkah Clock Tower (Abraj Al Bait) on the southern skyline.
 */
function buildMakkahValleySurroundings(
  emissiveMaterials: THREE.MeshStandardMaterial[]
): THREE.Group {
  const group = new THREE.Group();

  // Warm sunlit golden-sand desert valley floor
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0xc29e72,
    roughness: 0.9,
    metalness: 0.02,
  });
  const valleyFloor = new THREE.Mesh(new THREE.CircleGeometry(240, 48), groundMat);
  valleyFloor.rotation.x = -Math.PI / 2;
  valleyFloor.position.y = -0.14;
  valleyFloor.receiveShadow = true;
  group.add(valleyFloor);

  // Sculpted Hejaz rocky hills with rich terracotta, sienna, amber & dusty violet mountain tints
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.88,
    metalness: 0.04,
    flatShading: true,
  });

  const hillCount = 26;
  const hillGeo = new THREE.DodecahedronGeometry(1, 1);
  const hillInst = new THREE.InstancedMesh(hillGeo, rockMat, hillCount);

  const hillPalette = [
    new THREE.Color(0xa66948), // Warm terracotta
    new THREE.Color(0x8e563f), // Burnt Hejaz sienna
    new THREE.Color(0xb88252), // Golden desert ochre
    new THREE.Color(0x7c555c), // Dusty rose-amethyst shadow rock
    new THREE.Color(0x9a6b4c), // Sandstone rust
  ];

  let seed = 786;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < hillCount; i++) {
    const ang = (i / hillCount) * Math.PI * 2 + (rand() - 0.5) * 0.18;
    const dist = 88 + rand() * 52;
    const sx = 18 + rand() * 26;
    const sy = 14 + rand() * 24;
    const sz = 16 + rand() * 22;

    _dummy.position.set(Math.cos(ang) * dist, sy * 0.35 - 2, Math.sin(ang) * dist);
    _dummy.rotation.set(rand() * 0.3, rand() * Math.PI, rand() * 0.3);
    _dummy.scale.set(sx, sy, sz);
    _dummy.updateMatrix();
    hillInst.setMatrixAt(i, _dummy.matrix);

    const baseCol = hillPalette[i % hillPalette.length];
    const shade = 0.88 + rand() * 0.22;
    _color.setRGB(baseCol.r * shade, baseCol.g * shade, baseCol.b * shade);
    hillInst.setColorAt(i, _color);
  }
  hillInst.instanceMatrix.needsUpdate = true;
  if (hillInst.instanceColor) hillInst.instanceColor.needsUpdate = true;
  hillInst.computeBoundingSphere();
  group.add(hillInst);

  // Colorful distant Makkah city skyline blocks (warm ivory, rose-sandstone, pale teal-glass)
  const cityMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.72,
    metalness: 0.12,
  });
  const cityPalette = [
    new THREE.Color(0xdcc7a4),
    new THREE.Color(0xc8a484),
    new THREE.Color(0x88aab5),
    new THREE.Color(0xd5b594),
  ];
  const cityCount = 34;
  const cityGeo = new THREE.BoxGeometry(1, 1, 1);
  const cityInst = new THREE.InstancedMesh(cityGeo, cityMat, cityCount);
  let placed = 0;
  for (let i = 0; i < cityCount; i++) {
    const ang = (i / cityCount) * Math.PI * 2;
    // Leave clear corridors for Rotana Jabal Omar and the Clock Tower
    if ((ang > 2.4 && ang < 3.25) || (ang > 1.25 && ang < 1.85)) continue;
    const dist = 54 + rand() * 26;
    const bw = 6 + rand() * 7;
    const bh = 9 + rand() * 19;
    const bd = 6 + rand() * 7;
    _dummy.position.set(Math.cos(ang) * dist, bh / 2 - 0.1, Math.sin(ang) * dist);
    _dummy.rotation.set(0, -ang, 0);
    _dummy.scale.set(bw, bh, bd);
    _dummy.updateMatrix();
    cityInst.setMatrixAt(placed, _dummy.matrix);
    cityInst.setColorAt(placed, cityPalette[placed % cityPalette.length]);
    placed++;
  }
  cityInst.count = placed;
  cityInst.instanceMatrix.needsUpdate = true;
  if (cityInst.instanceColor) cityInst.instanceColor.needsUpdate = true;
  cityInst.computeBoundingSphere();
  group.add(cityInst);

  // Iconic Abraj Al Bait (Makkah Royal Clock Tower) rising in the southern skyline (+Z)
  const clockGroup = new THREE.Group();
  clockGroup.position.set(4, 0, 62);

  const towerStoneMat = new THREE.MeshStandardMaterial({
    color: 0xe6d6bc,
    roughness: 0.55,
    metalness: 0.12,
  });
  const clockEmeraldMat = new THREE.MeshStandardMaterial({
    color: 0x0b8c55,
    emissive: 0x00d977,
    emissiveIntensity: 1.2,
    roughness: 0.25,
  });
  emissiveMaterials.push(clockEmeraldMat);

  const clockGoldMat = new THREE.MeshPhysicalMaterial({
    color: 0xf7c93e,
    metalness: 0.94,
    roughness: 0.18,
    clearcoat: 0.7,
  });

  const baseTower = new THREE.Mesh(new THREE.BoxGeometry(16, 26, 12), towerStoneMat);
  baseTower.position.y = 13;
  clockGroup.add(baseTower);

  const midTower = new THREE.Mesh(new THREE.BoxGeometry(10.5, 22, 10.5), towerStoneMat);
  midTower.position.y = 37;
  clockGroup.add(midTower);

  // Glowing Emerald-Green Royal Clock Faces on North & South faces
  const clockFaceGeo = new THREE.CircleGeometry(3.4, 24);
  const clockFaceNorth = new THREE.Mesh(clockFaceGeo, clockEmeraldMat);
  clockFaceNorth.position.set(0, 41, -5.32);
  clockFaceNorth.rotation.y = Math.PI;
  clockGroup.add(clockFaceNorth);

  const clockRingNorth = new THREE.Mesh(new THREE.TorusGeometry(3.55, 0.28, 10, 28), clockGoldMat);
  clockRingNorth.position.set(0, 41, -5.34);
  clockGroup.add(clockRingNorth);

  const clockUpperEmerald = new THREE.Mesh(new THREE.BoxGeometry(7.2, 6.5, 7.2), clockEmeraldMat);
  clockUpperEmerald.position.y = 51.2;
  clockGroup.add(clockUpperEmerald);

  const clockSpire = new THREE.Mesh(new THREE.ConeGeometry(2.6, 12, 8), clockGoldMat);
  clockSpire.position.y = 60.4;
  clockGroup.add(clockSpire);

  const clockCrescent = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.32, 10, 20, Math.PI * 1.45), clockGoldMat);
  clockCrescent.position.y = 68.2;
  clockCrescent.rotation.z = Math.PI * 0.78;
  clockGroup.add(clockCrescent);

  group.add(clockGroup);

  return group;
}

/**
 * Builds 416 instanced pilgrims performing live counter-clockwise Tawaf in concentric rings
 * plus pilgrims walking along the 150m Rotana Jabal Omar promenade with authentic diverse attire tints.
 */
function buildAnimatedPilgrims(): {
  pilgrimMesh: THREE.InstancedMesh;
  pilgrimData: PilgrimInstanceData[];
} {
  const tawafCount = 390;
  const walkwayCount = 26;
  const total = tawafCount + walkwayCount;

  const pts = [
    new THREE.Vector2(0.0, 0.0),
    new THREE.Vector2(0.14, 0.0),
    new THREE.Vector2(0.13, 0.45),
    new THREE.Vector2(0.15, 0.74),
    new THREE.Vector2(0.08, 0.84),
    new THREE.Vector2(0.10, 0.96),
    new THREE.Vector2(0.07, 1.06),
    new THREE.Vector2(0.0, 1.09),
  ];
  const geo = new THREE.LatheGeometry(pts, 8);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.75,
    metalness: 0.02,
  });

  const pilgrimMesh = new THREE.InstancedMesh(geo, mat, total);
  pilgrimMesh.castShadow = false;
  pilgrimMesh.receiveShadow = true;
  pilgrimMesh.frustumCulled = false;

  const pilgrimData: PilgrimInstanceData[] = [];
  let seed = 999;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  // Authentic pilgrim palette: predominant luminous Ihram white + dignified international robe/scarf accents
  const accentPalette = [
    new THREE.Color(0x1f3d59), // Deep sapphire navy
    new THREE.Color(0x145940), // Emerald sage
    new THREE.Color(0x6b273d), // Rich burgundy plum
    new THREE.Color(0x2a2d36), // Classic charcoal abaya
    new THREE.Color(0x3a6f8f), // Soft azure blue
    new THREE.Color(0x8c6d46), // Warm camel-gold
  ];

  const assignPilgrimColor = (idx: number) => {
    const roll = rand();
    if (roll < 0.68) {
      // Crisp white / warm ivory Ihram
      const v = 0.92 + rand() * 0.08;
      _color.setRGB(v, v * 0.99, v * 0.97);
    } else {
      const col = accentPalette[Math.floor(rand() * accentPalette.length)];
      _color.copy(col);
    }
    pilgrimMesh.setColorAt(idx, _color);
  };

  for (let i = 0; i < tawafCount; i++) {
    const ringBias = Math.pow(rand(), 0.78);
    const radius = 6.2 + ringBias * 15.2;
    const angle = rand() * Math.PI * 2;
    const speed = (0.24 + (1 - ringBias) * 0.14) * (0.88 + rand() * 0.24);
    const scaleY = 0.88 + rand() * 0.24;

    pilgrimData.push({
      mode: 'tawaf',
      radius,
      angle,
      speed,
      bobPhase: rand() * Math.PI * 2,
      scaleY,
      t: 0,
      laneOffset: 0,
    });
    assignPilgrimColor(i);
  }

  for (let i = 0; i < walkwayCount; i++) {
    pilgrimData.push({
      mode: 'walkway',
      radius: 0,
      angle: 0,
      speed: 0.065 + rand() * 0.035,
      bobPhase: rand() * Math.PI * 2,
      scaleY: 0.9 + rand() * 0.2,
      t: rand(),
      laneOffset: (rand() - 0.5) * 2.6,
    });
    assignPilgrimColor(tawafCount + i);
  }

  if (pilgrimMesh.instanceColor) pilgrimMesh.instanceColor.needsUpdate = true;

  return { pilgrimMesh, pilgrimData };
}

/**
 * Builds warm ambient floating golden & emerald-tinted atmospheric light motes around the sanctuary.
 */
function buildGoldenMotes(): THREE.Points {
  const count = 240;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const gold = new THREE.Color(0xffe178);
  const emerald = new THREE.Color(0x52ffae);
  const aqua = new THREE.Color(0x7ae6ff);

  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const r = 4 + Math.random() * 46;
    positions[i * 3] = Math.cos(ang) * r;
    positions[i * 3 + 1] = 1.5 + Math.random() * 26;
    positions[i * 3 + 2] = Math.sin(ang) * r;

    const c = i % 5 === 0 ? emerald : i % 7 === 0 ? aqua : gold;
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.24,
    vertexColors: true,
    transparent: true,
    opacity: 0.52,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  return new THREE.Points(geo, mat);
}

export function buildHaramainScene(
  textures: ProceduralTextureBundle,
  isSoftwareGl: boolean
): SceneBuildArtifacts {
  const root = new THREE.Group();
  const interactables: THREE.Object3D[] = [];
  const emissiveMaterials: THREE.MeshStandardMaterial[] = [];
  const lanternLights: THREE.PointLight[] = [];

  const sacred = buildSacredCenter(textures, isSoftwareGl, emissiveMaterials, lanternLights);
  root.add(sacred.group);
  sacred.proxies.forEach((p) => {
    root.add(p);
    interactables.push(p);
  });

  const haram = buildHaramComplex(textures, emissiveMaterials, lanternLights);
  root.add(haram.group);
  haram.proxies.forEach((p) => {
    root.add(p);
    interactables.push(p);
  });

  const rotana = buildRotanaJabalOmarAndWalkway(textures, emissiveMaterials, lanternLights);
  root.add(rotana.hotelGroup);
  root.add(rotana.walkwayGroup);
  rotana.proxies.forEach((p) => {
    root.add(p);
    interactables.push(p);
  });

  const valley = buildMakkahValleySurroundings(emissiveMaterials);
  root.add(valley);

  const { pilgrimMesh, pilgrimData } = buildAnimatedPilgrims();
  root.add(pilgrimMesh);

  const motesPoints = buildGoldenMotes();
  root.add(motesPoints);

  const dispose = () => {
    root.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh || (obj as THREE.Points).isPoints) {
        const m = obj as THREE.Mesh;
        m.geometry?.dispose();
        if (Array.isArray(m.material)) {
          m.material.forEach((mat) => mat.dispose());
        } else {
          m.material?.dispose();
        }
      }
    });
  };

  return {
    root,
    interactables,
    pilgrimMesh,
    pilgrimData,
    walkwayGroup: rotana.walkwayGroup,
    walkwayBeads: rotana.walkwayBeads,
    walkwayCurve: rotana.walkwayCurve,
    emissiveMaterials,
    hotelFacadeMaterial: rotana.hotelFacadeMaterial,
    lanternLights,
    motesPoints,
    dispose,
  };
}
