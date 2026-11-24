import * as THREE from 'three';

export interface ProceduralTextureBundle {
  kiswahAlbedo: THREE.CanvasTexture;
  kiswahMetalness: THREE.CanvasTexture;
  kiswahRoughness: THREE.CanvasTexture;
  kiswahBump: THREE.CanvasTexture;
  doorAlbedo: THREE.CanvasTexture;
  doorBump: THREE.CanvasTexture;
  marbleAlbedo: THREE.CanvasTexture;
  marbleRoughness: THREE.CanvasTexture;
  marbleBump: THREE.CanvasTexture;
  limestoneAlbedo: THREE.CanvasTexture;
  limestoneBump: THREE.CanvasTexture;
  hotelFacadeAlbedo: THREE.CanvasTexture;
  hotelFacadeEmissive: THREE.CanvasTexture;
  hotelFacadeRoughness: THREE.CanvasTexture;
  hotelFacadeMetalness: THREE.CanvasTexture;
  contactShadow: THREE.CanvasTexture;
  dispose: () => void;
}

function makeCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

function configureTexture(
  canvas: HTMLCanvasElement,
  isColor: boolean,
  maxAnisotropy: number,
  repeatX = 1,
  repeatY = 1
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Generates high-resolution Kiswah PBR maps (albedo, metalness, roughness, bump)
 * with deep obsidian-midnight silk jacquard weave and radiant 24K gold-embroidered Hizam calligraphy.
 */
function createKiswahTextures(maxAnisotropy: number) {
  const size = 1024;
  const [aCanvas, aCtx] = makeCanvas(size, size);
  const [mCanvas, mCtx] = makeCanvas(size, size);
  const [rCanvas, rCtx] = makeCanvas(size, size);
  const [bCanvas, bCtx] = makeCanvas(size, size);

  // Deep luxurious obsidian-indigo silk base
  aCtx.fillStyle = '#0a0c12';
  aCtx.fillRect(0, 0, size, size);

  // Silk is dielectric (metalness 0), high matte roughness (~0.82)
  mCtx.fillStyle = '#000000';
  mCtx.fillRect(0, 0, size, size);
  rCtx.fillStyle = '#d4d4d4';
  rCtx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#7a7a7a';
  bCtx.fillRect(0, 0, size, size);

  // Subtle woven silk vertical ribs & chevron damask jacquard
  for (let x = 0; x < size; x += 4) {
    aCtx.fillStyle = x % 8 === 0 ? 'rgba(65,85,120,0.06)' : 'rgba(0,0,0,0.24)';
    aCtx.fillRect(x, 0, 2, size);
    bCtx.fillStyle = x % 8 === 0 ? '#8c8c8c' : '#6a6a6a';
    bCtx.fillRect(x, 0, 2, size);
  }

  // Subtle silk jacquard diamond calligraphy bands
  const bandRows = [80, 145, 420, 520, 620, 720, 820, 910];
  for (const ry of bandRows) {
    for (let cx = 32; cx < size; cx += 96) {
      aCtx.strokeStyle = 'rgba(42, 54, 72, 0.55)';
      aCtx.lineWidth = 2;
      aCtx.beginPath();
      aCtx.moveTo(cx, ry - 20);
      aCtx.lineTo(cx + 38, ry);
      aCtx.lineTo(cx, ry + 20);
      aCtx.lineTo(cx - 38, ry);
      aCtx.closePath();
      aCtx.stroke();

      rCtx.strokeStyle = '#929292';
      rCtx.lineWidth = 2;
      rCtx.beginPath();
      rCtx.moveTo(cx, ry - 20);
      rCtx.lineTo(cx + 38, ry);
      rCtx.lineTo(cx, ry + 20);
      rCtx.lineTo(cx - 38, ry);
      rCtx.closePath();
      rCtx.stroke();

      bCtx.strokeStyle = '#9d9d9d';
      bCtx.lineWidth = 2;
      bCtx.stroke();
    }
  }

  // Helper to paint radiant 24K gold embroidery across all 4 PBR channels
  const paintGold = (drawFn: (ctx: CanvasRenderingContext2D) => void, stroke = false) => {
    aCtx.save();
    aCtx.fillStyle = '#f5ca45';
    aCtx.strokeStyle = '#ffe074';
    drawFn(aCtx);
    if (stroke) aCtx.stroke();
    else aCtx.fill();
    aCtx.restore();

    mCtx.save();
    mCtx.fillStyle = '#f5f5f5';
    mCtx.strokeStyle = '#f5f5f5';
    drawFn(mCtx);
    if (stroke) mCtx.stroke();
    else mCtx.fill();
    mCtx.restore();

    rCtx.save();
    rCtx.fillStyle = '#323232';
    rCtx.strokeStyle = '#323232';
    drawFn(rCtx);
    if (stroke) rCtx.stroke();
    else rCtx.fill();
    rCtx.restore();

    bCtx.save();
    bCtx.fillStyle = '#efefef';
    bCtx.strokeStyle = '#ffffff';
    drawFn(bCtx);
    if (stroke) bCtx.stroke();
    else bCtx.fill();
    bCtx.restore();
  };

  // === HIZAM (Upper Radiant Gold Calligraphic Belt with subtle emerald silk inner trim) ===
  const hizamTop = 210;
  const hizamHeight = 122;

  // Subtle authentic deep emerald silk backing inside Hizam panels
  aCtx.fillStyle = '#08291b';
  aCtx.fillRect(0, hizamTop + 14, size, hizamHeight - 28);

  // Double gold framing rails
  paintGold((c) => {
    c.fillRect(0, hizamTop, size, 9);
    c.fillRect(0, hizamTop + 15, size, 3.5);
    c.fillRect(0, hizamTop + hizamHeight - 18, size, 3.5);
    c.fillRect(0, hizamTop + hizamHeight - 9, size, 9);
  });

  // Ornate Hizam cartouche panels (4 per wall)
  const panelCount = 4;
  const panelW = size / panelCount;
  for (let i = 0; i < panelCount; i++) {
    const px = i * panelW + 14;
    const pw = panelW - 28;
    const py = hizamTop + 23;
    const ph = hizamHeight - 46;

    paintGold((c) => {
      c.lineWidth = 3.5;
      c.beginPath();
      c.roundRect(px, py, pw, ph, 14);
    }, true);

    // Stylized Thuluth calligraphic strokes inside each Hizam panel
    paintGold((c) => {
      c.lineWidth = 4.6;
      c.lineCap = 'round';
      c.beginPath();
      const midY = py + ph * 0.56;
      for (let s = 0; s < 7; s++) {
        const sx = px + 18 + s * ((pw - 36) / 6.5);
        if (s % 2 === 0) {
          c.moveTo(sx, py + 12);
          c.lineTo(sx - 2, midY + 9);
        } else {
          c.moveTo(sx, py + 20);
          c.quadraticCurveTo(sx + 10, py + 14, sx + 14, midY + 7);
        }
        c.moveTo(sx - 8, midY + 4);
        c.quadraticCurveTo(sx + 6, midY + 15, sx + 20, midY - 2);
      }
    }, true);

    // Diacritic gold flourishes & dots
    paintGold((c) => {
      for (let d = 0; d < 9; d++) {
        const dx = px + 22 + d * ((pw - 44) / 8);
        const dy = py + (d % 2 === 0 ? 15 : ph - 13);
        c.beginPath();
        c.arc(dx, dy, 2.8, 0, Math.PI * 2);
      }
    });

    // Divider emerald & gold floral medallion between cartouches
    const divX = i * panelW;
    paintGold((c) => {
      c.beginPath();
      c.arc(divX, hizamTop + hizamHeight / 2, 11, 0, Math.PI * 2);
    });
  }

  // === SAMADIYAT (Ornamental Gold & Emerald Medallions below the Hizam) ===
  const medallionPositions = [128, 384, 640, 896];
  for (const mx of medallionPositions) {
    const my = 390;
    aCtx.fillStyle = '#0c3a25';
    aCtx.beginPath();
    aCtx.ellipse(mx, my, 33, 23, 0, 0, Math.PI * 2);
    aCtx.fill();

    paintGold((c) => {
      c.lineWidth = 4;
      c.beginPath();
      c.ellipse(mx, my, 35, 25, 0, 0, Math.PI * 2);
    }, true);
    paintGold((c) => {
      c.lineWidth = 3.2;
      c.beginPath();
      c.moveTo(mx - 19, my + 2);
      c.quadraticCurveTo(mx, my - 13, mx + 19, my + 2);
      c.quadraticCurveTo(mx, my + 13, mx - 19, my + 2);
    }, true);
    paintGold((c) => {
      c.beginPath();
      c.moveTo(mx, my + 25);
      c.lineTo(mx + 9, my + 42);
      c.lineTo(mx, my + 55);
      c.lineTo(mx - 9, my + 42);
      c.closePath();
    });
  }

  // Crisp gold trim border along the top cornice edge & bottom hem
  paintGold((c) => {
    c.fillRect(0, 12, size, 7);
    c.fillRect(0, 25, size, 3);
    c.fillRect(0, size - 28, size, 5);
  });

  return {
    kiswahAlbedo: configureTexture(aCanvas, true, maxAnisotropy),
    kiswahMetalness: configureTexture(mCanvas, false, maxAnisotropy),
    kiswahRoughness: configureTexture(rCanvas, false, maxAnisotropy),
    kiswahBump: configureTexture(bCanvas, false, maxAnisotropy),
  };
}

/**
 * Generates embossed 24K solid gold Bab al-Kaaba (Holy Kaaba Door) textures with subtle emerald relief.
 */
function createKaabaDoorTextures(maxAnisotropy: number) {
  const w = 512;
  const h = 1024;
  const [aCanvas, aCtx] = makeCanvas(w, h);
  const [bCanvas, bCtx] = makeCanvas(w, h);

  const grad = aCtx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#e0b12e');
  grad.addColorStop(0.5, '#ffe17a');
  grad.addColorStop(1, '#c9961d');
  aCtx.fillStyle = grad;
  aCtx.fillRect(0, 0, w, h);

  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, w, h);

  aCtx.strokeStyle = '#785509';
  aCtx.lineWidth = 18;
  aCtx.strokeRect(18, 18, w - 36, h - 36);

  bCtx.strokeStyle = '#ffffff';
  bCtx.lineWidth = 20;
  bCtx.strokeRect(18, 18, w - 36, h - 36);

  aCtx.fillStyle = '#5c4108';
  aCtx.fillRect(w / 2 - 4, 24, 8, h - 48);
  bCtx.fillStyle = '#202020';
  bCtx.fillRect(w / 2 - 4, 24, 8, h - 48);

  const rows = [
    { y: 60, h: 165 },
    { y: 255, h: 210 },
    { y: 495, h: 210 },
    { y: 735, h: 210 },
  ];

  for (const row of rows) {
    for (const side of [0, 1]) {
      const px = side === 0 ? 44 : w / 2 + 18;
      const pw = w / 2 - 62;

      aCtx.fillStyle = '#a87d14';
      aCtx.fillRect(px, row.y, pw, row.h);
      aCtx.strokeStyle = '#ffea94';
      aCtx.lineWidth = 6;
      aCtx.strokeRect(px, row.y, pw, row.h);

      bCtx.fillStyle = '#555555';
      bCtx.fillRect(px, row.y, pw, row.h);
      bCtx.strokeStyle = '#ffffff';
      bCtx.lineWidth = 8;
      bCtx.strokeRect(px, row.y, pw, row.h);

      const cx = px + pw / 2;
      const cy = row.y + row.h / 2;
      aCtx.fillStyle = '#ffdf70';
      aCtx.beginPath();
      aCtx.arc(cx, cy, Math.min(pw, row.h) * 0.28, 0, Math.PI * 2);
      aCtx.fill();

      aCtx.strokeStyle = '#6d4e0a';
      aCtx.lineWidth = 3;
      aCtx.stroke();

      bCtx.fillStyle = '#f2f2f2';
      bCtx.beginPath();
      bCtx.arc(cx, cy, Math.min(pw, row.h) * 0.28, 0, Math.PI * 2);
      bCtx.fill();
    }
  }

  return {
    doorAlbedo: configureTexture(aCanvas, true, maxAnisotropy),
    doorBump: configureTexture(bCanvas, false, maxAnisotropy),
  };
}

/**
 * Generates luminous cool-white Thassos marble tiles for the Mataf courtyard with subtle
 * pale-aqua & gold mineral veins and crisp architectural grout lines.
 */
function createMatafMarbleTextures(maxAnisotropy: number) {
  const size = 1024;
  const [aCanvas, aCtx] = makeCanvas(size, size);
  const [rCanvas, rCtx] = makeCanvas(size, size);
  const [bCanvas, bCtx] = makeCanvas(size, size);

  // Realistic physically calibrated honed Thassos marble (never clips under sunlight)
  aCtx.fillStyle = '#dedbd4';
  aCtx.fillRect(0, 0, size, size);

  // Honed satin marble roughness (~0.40) to prevent white studio glare in shadows
  rCtx.fillStyle = '#686868';
  rCtx.fillRect(0, 0, size, size);

  bCtx.fillStyle = '#888888';
  bCtx.fillRect(0, 0, size, size);

  let seed = 1448;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 70; i++) {
    const sx = rand() * size;
    const sy = rand() * size;
    const isGoldVein = i % 3 === 0;
    aCtx.strokeStyle = isGoldVein
      ? `rgba(176, 152, 108, ${0.11 + rand() * 0.12})`
      : `rgba(130, 152, 162, ${0.1 + rand() * 0.14})`;
    aCtx.lineWidth = 1 + rand() * 2.4;
    aCtx.beginPath();
    aCtx.moveTo(sx, sy);
    let cx = sx;
    let cy = sy;
    for (let s = 0; s < 5; s++) {
      cx += (rand() - 0.35) * 90;
      cy += (rand() - 0.5) * 60;
      aCtx.lineTo(cx, cy);
    }
    aCtx.stroke();
  }

  // Architectural slab grid (8x8 slabs) with natural stone tile variation
  const tile = size / 8;
  for (let gx = 0; gx < 8; gx++) {
    for (let gy = 0; gy < 8; gy++) {
      const tint = Math.floor((rand() - 0.5) * 14);
      aCtx.fillStyle = `rgba(${220 + tint}, ${217 + tint}, ${210 + tint}, 0.45)`;
      aCtx.fillRect(gx * tile + 2, gy * tile + 2, tile - 4, tile - 4);
    }
  }

  aCtx.strokeStyle = 'rgba(115, 118, 120, 0.45)';
  aCtx.lineWidth = 2;
  rCtx.strokeStyle = '#c8c8c8';
  rCtx.lineWidth = 3;
  bCtx.strokeStyle = '#383838';
  bCtx.lineWidth = 3;

  for (let i = 0; i <= 8; i++) {
    const p = i * tile;
    for (const ctx of [aCtx, rCtx, bCtx]) {
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, size);
      ctx.moveTo(0, p);
      ctx.lineTo(size, p);
      ctx.stroke();
    }
  }

  return {
    marbleAlbedo: configureTexture(aCanvas, true, maxAnisotropy, 12, 12),
    marbleRoughness: configureTexture(rCanvas, false, maxAnisotropy, 12, 12),
    marbleBump: configureTexture(bCanvas, false, maxAnisotropy, 12, 12),
  };
}

/**
 * Generates warm sunlit cream-travertine & golden sandstone blocks for Haram arcades and minarets.
 */
function createLimestoneTextures(maxAnisotropy: number) {
  const size = 512;
  const [aCanvas, aCtx] = makeCanvas(size, size);
  const [bCanvas, bCtx] = makeCanvas(size, size);

  aCtx.fillStyle = '#f2e4c9';
  aCtx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);

  let seed = 2027;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const rows = 8;
  const rowH = size / rows;
  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * 64;
    for (let c = -1; c < 5; c++) {
      const x = c * 128 + offset;
      const y = r * rowH;
      const shade = Math.floor((rand() - 0.5) * 18);
      // Warm honey-travertine variation
      aCtx.fillStyle = `rgb(${242 + shade}, ${223 + shade}, ${188 + shade})`;
      aCtx.fillRect(x + 2, y + 2, 124, rowH - 4);

      bCtx.fillStyle = `rgb(${128 + shade}, ${128 + shade}, ${128 + shade})`;
      bCtx.fillRect(x + 2, y + 2, 124, rowH - 4);
    }
  }

  for (let i = 0; i < 1800; i++) {
    const px = rand() * size;
    const py = rand() * size;
    aCtx.fillStyle = rand() > 0.5 ? 'rgba(255,248,230,0.16)' : 'rgba(176,132,78,0.12)';
    aCtx.fillRect(px, py, 2, 2);
  }

  return {
    limestoneAlbedo: configureTexture(aCanvas, true, maxAnisotropy, 3, 3),
    limestoneBump: configureTexture(bCanvas, false, maxAnisotropy, 3, 3),
  };
}

/**
 * Generates luxury contemporary Islamic curtain-wall facade maps for Rotana Jabal Omar Makkah.
 * Features warm sandstone & terracotta-champagne piers, rich sapphire-teal reflective glass,
 * champagne-gold cornices, and richly lit warm amber/golden hotel suites.
 */
function createHotelFacadeTextures(maxAnisotropy: number) {
  const w = 512;
  const h = 1024;
  const [aCanvas, aCtx] = makeCanvas(w, h);
  const [eCanvas, eCtx] = makeCanvas(w, h);
  const [rCanvas, rCtx] = makeCanvas(w, h);
  const [mCanvas, mCtx] = makeCanvas(w, h);

  // Warm sunlit champagne-terracotta architectural cladding
  aCtx.fillStyle = '#e8cba1';
  aCtx.fillRect(0, 0, w, h);

  eCtx.fillStyle = '#000000';
  eCtx.fillRect(0, 0, w, h);

  rCtx.fillStyle = '#b0b0b0';
  rCtx.fillRect(0, 0, w, h);
  mCtx.fillStyle = '#000000';
  mCtx.fillRect(0, 0, w, h);

  let seed = 150;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const floors = 18;
  const bays = 8;
  const floorH = h / floors;
  const bayW = w / bays;

  for (let f = 0; f < floors; f++) {
    const fy = f * floorH;

    // Warm rose-sandstone cornice & 24K gold spandrel accent
    aCtx.fillStyle = f % 6 === 0 ? '#a82838' : '#d8ad78';
    aCtx.fillRect(0, fy, w, 9);
    aCtx.fillStyle = '#e5b83c';
    aCtx.fillRect(0, fy + 9, w, 4);
    mCtx.fillStyle = '#e0e0e0';
    mCtx.fillRect(0, fy + 9, w, 4);
    rCtx.fillStyle = '#323232';
    rCtx.fillRect(0, fy + 9, w, 4);

    for (let b = 0; b < bays; b++) {
      const bx = b * bayW + 6;
      const bw = bayW - 12;
      const by = fy + 16;
      const bh = floorH - 21;

      // Vivid sapphire-teal reflective luxury glass facade
      const glassGrad = aCtx.createLinearGradient(bx, by, bx, by + bh);
      glassGrad.addColorStop(0, '#0f5e7a');
      glassGrad.addColorStop(0.5, '#197b96');
      glassGrad.addColorStop(1, '#0b3d54');
      aCtx.fillStyle = glassGrad;
      aCtx.fillRect(bx, by, bw, bh);

      // Glossy reflective glass in roughness & metalness maps
      rCtx.fillStyle = '#121212';
      rCtx.fillRect(bx, by, bw, bh);
      mCtx.fillStyle = '#8a8a8a';
      mCtx.fillRect(bx, by, bw, bh);

      // Gold mashrabiya mullion
      aCtx.fillStyle = '#e8c156';
      aCtx.fillRect(bx + bw / 2 - 1, by, 2, bh);

      // Warm luxury interior suite lighting (~68% of suites glowing warmly)
      const litRoll = rand();
      if (litRoll > 0.32) {
        const warmth =
          litRoll > 0.78
            ? '#ffe79e'
            : litRoll > 0.54
            ? '#ffbf5e'
            : '#8cf0e0'; // occasional cool-aqua suite accent
        const winGrad = eCtx.createLinearGradient(bx, by, bx, by + bh);
        winGrad.addColorStop(0, warmth);
        winGrad.addColorStop(1, litRoll > 0.54 ? '#d98426' : '#268fa8');
        eCtx.fillStyle = winGrad;
        eCtx.fillRect(bx + 2, by + 2, bw - 4, bh - 4);

        if (rand() > 0.58) {
          eCtx.fillStyle = 'rgba(18, 14, 12, 0.42)';
          eCtx.fillRect(bx + 2, by + 2, bw * 0.24, bh - 4);
        }
      }
    }
  }

  return {
    hotelFacadeAlbedo: configureTexture(aCanvas, true, maxAnisotropy, 1, 1),
    hotelFacadeEmissive: configureTexture(eCanvas, true, maxAnisotropy, 1, 1),
    hotelFacadeRoughness: configureTexture(rCanvas, false, maxAnisotropy, 1, 1),
    hotelFacadeMetalness: configureTexture(mCanvas, false, maxAnisotropy, 1, 1),
  };
}

/**
 * Generates a soft radial ambient occlusion contact shadow texture.
 */
function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const [canvas, ctx] = makeCanvas(size, size);
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.08,
    size / 2,
    size / 2,
    size * 0.5
  );
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.68)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.25)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export function createProceduralTextureBundle(maxAnisotropy: number): ProceduralTextureBundle {
  const kiswah = createKiswahTextures(maxAnisotropy);
  const door = createKaabaDoorTextures(maxAnisotropy);
  const marble = createMatafMarbleTextures(maxAnisotropy);
  const limestone = createLimestoneTextures(maxAnisotropy);
  const hotel = createHotelFacadeTextures(maxAnisotropy);
  const contactShadow = createContactShadowTexture();

  const allTextures: THREE.Texture[] = [
    kiswah.kiswahAlbedo,
    kiswah.kiswahMetalness,
    kiswah.kiswahRoughness,
    kiswah.kiswahBump,
    door.doorAlbedo,
    door.doorBump,
    marble.marbleAlbedo,
    marble.marbleRoughness,
    marble.marbleBump,
    limestone.limestoneAlbedo,
    limestone.limestoneBump,
    hotel.hotelFacadeAlbedo,
    hotel.hotelFacadeEmissive,
    hotel.hotelFacadeRoughness,
    hotel.hotelFacadeMetalness,
    contactShadow,
  ];

  return {
    ...kiswah,
    ...door,
    ...marble,
    ...limestone,
    ...hotel,
    contactShadow,
    dispose: () => {
      allTextures.forEach((t) => t.dispose());
    },
  };
}
