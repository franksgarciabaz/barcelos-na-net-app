/**
 * Gerador de ícones e splash screen — Barcelos na NET
 * Usa a logo oficial: balão de chat verde/teal com mapa de Barcelos-AM
 */

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

const ANDROID_BASE = './android/app/src/main/res';

const iconSizes = {
  'mipmap-mdpi':    48,
  'mipmap-hdpi':    72,
  'mipmap-xhdpi':   96,
  'mipmap-xxhdpi':  144,
  'mipmap-xxxhdpi': 192,
};

const splashPort = {
  'drawable-port-mdpi':    { w: 320,  h: 480  },
  'drawable-port-hdpi':    { w: 480,  h: 800  },
  'drawable-port-xhdpi':   { w: 720,  h: 1280 },
  'drawable-port-xxhdpi':  { w: 960,  h: 1600 },
  'drawable-port-xxxhdpi': { w: 1280, h: 1920 },
};

const splashLand = {
  'drawable-land-mdpi':    { w: 480,  h: 320  },
  'drawable-land-hdpi':    { w: 800,  h: 480  },
  'drawable-land-xhdpi':   { w: 1280, h: 720  },
  'drawable-land-xxhdpi':  { w: 1600, h: 960  },
  'drawable-land-xxxhdpi': { w: 1920, h: 1280 },
};

/** Desenha o mapa simplificado de Barcelos-AM (silhueta aproximada) */
function drawBarcelosMap(ctx, cx, cy, scale) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Silhueta aproximada do município de Barcelos-AM
  ctx.beginPath();
  ctx.moveTo(-18, -45);
  ctx.bezierCurveTo(-25, -50, -35, -40, -38, -25);
  ctx.bezierCurveTo(-42, -10, -38,  0,  -35, 10);
  ctx.bezierCurveTo(-40, 20,  -38, 35,  -28, 42);
  ctx.bezierCurveTo(-18, 50,  -5,  48,   5,  45);
  ctx.bezierCurveTo(15,  50,  30,  45,   38, 35);
  ctx.bezierCurveTo(45,  25,  42,  10,   38,  0);
  ctx.bezierCurveTo(42, -12,  40, -28,   30, -38);
  ctx.bezierCurveTo(20, -48,   5, -50,  -5, -48);
  ctx.bezierCurveTo(-10,-50, -14,-46,  -18,-45);
  ctx.closePath();

  // Gradiente branco → azul claro (igual à logo)
  const grad = ctx.createRadialGradient(0, 5, 2, 0, 5, 52);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.5, '#d0eef8');
  grad.addColorStop(1, '#a8d8ea');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.restore();
}

/** Desenha o ícone completo — balão de chat com logo */
function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const p = size * 0.04; // padding
  const r = (size - p * 2) * 0.28; // border radius do balão

  // Fundo transparente → preenchemos camadas
  ctx.clearRect(0, 0, size, size);

  // ── Camada 3: sombra verde escuro (mais afastada) ──
  const off3 = size * 0.06;
  drawBubble(ctx, p + off3, p + off3 * 0.5, size - p * 2, size - p * 2, r, '#3cb371', size);

  // ── Camada 2: amarelo-verde ──
  const off2 = size * 0.03;
  drawBubble(ctx, p + off2 * 0.5, p + off2 * 0.3, size - p * 2, size - p * 2, r, '#c8e000', size);

  // ── Camada 1 (topo): teal com gradiente ──
  drawBubble(ctx, p, p, size - p * 2, size - p * 2, r, null, size, true);

  // ── Mapa de Barcelos no centro ──
  const mapScale = size / 192 * 1.1;
  drawBarcelosMap(ctx, size * 0.50, size * 0.44, mapScale);

  return canvas.toBuffer('image/png');
}

/** Desenha um balão de chat arredondado */
function drawBubble(ctx, x, y, w, h, r, color, size, useGradient = false) {
  const tailW = w * 0.15;
  const tailH = h * 0.12;
  const tailX = x + w * 0.18;
  const bubbleH = h - tailH;

  ctx.beginPath();
  // Corpo arredondado
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + bubbleH - r);
  ctx.quadraticCurveTo(x + w, y + bubbleH, x + w - r, y + bubbleH);
  // Borda direita antes do rabo
  ctx.lineTo(tailX + tailW, y + bubbleH);
  // Rabo (canto inferior esquerdo)
  ctx.lineTo(tailX + tailW * 0.3, y + bubbleH + tailH);
  ctx.lineTo(tailX, y + bubbleH);
  ctx.lineTo(x + r, y + bubbleH);
  ctx.quadraticCurveTo(x, y + bubbleH, x, y + bubbleH - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();

  if (useGradient) {
    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    grad.addColorStop(0, '#26c6b0');
    grad.addColorStop(0.5, '#00b5a0');
    grad.addColorStop(1, '#008f80');
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = color;
  }
  ctx.fill();
}

/** Splash screen com logo centralizada */
function drawSplash(w, h) {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');

  // Fundo branco limpo (estilo profissional)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  // Logo centralizada
  const iconSize = Math.min(w, h) * 0.38;
  const cx = w / 2;
  const cy = h / 2 - iconSize * 0.08;
  const iconBuf = drawIcon(iconSize);

  // Desenha o ícone via canvas (recria inline)
  const iconCanvas = createCanvas(iconSize, iconSize);
  const ictx = iconCanvas.getContext('2d');
  const p = iconSize * 0.04;
  const r2 = (iconSize - p * 2) * 0.28;

  const off3 = iconSize * 0.06;
  drawBubble(ictx, p + off3, p + off3 * 0.5, iconSize - p * 2, iconSize - p * 2, r2, '#3cb371', iconSize);
  const off2 = iconSize * 0.03;
  drawBubble(ictx, p + off2 * 0.5, p + off2 * 0.3, iconSize - p * 2, iconSize - p * 2, r2, '#c8e000', iconSize);
  drawBubble(ictx, p, p, iconSize - p * 2, iconSize - p * 2, r2, null, iconSize, true);
  drawBarcelosMap(ictx, iconSize * 0.50, iconSize * 0.44, iconSize / 192 * 1.1);

  ctx.drawImage(iconCanvas, cx - iconSize / 2, cy - iconSize / 2);

  // Nome do app
  ctx.fillStyle = '#1a5c50';
  ctx.font = `bold ${Math.min(w, h) * 0.046}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('Barcelos na NET', cx, cy + iconSize / 2 + iconSize * 0.18);

  // Tagline
  ctx.fillStyle = '#888';
  ctx.font = `${Math.min(w, h) * 0.026}px Arial, sans-serif`;
  ctx.fillText('Notícias • Cultura • Entretenimento', cx, cy + iconSize / 2 + iconSize * 0.32);

  return canvas.toBuffer('image/png');
}

// ── GERA ÍCONES ──
console.log('Gerando ícones com logo oficial...');
for (const [folder, size] of Object.entries(iconSizes)) {
  const dir = path.join(ANDROID_BASE, folder);
  fs.mkdirSync(dir, { recursive: true });
  const buf = drawIcon(size);
  fs.writeFileSync(path.join(dir, 'ic_launcher.png'), buf);
  fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), buf);
  fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.png'), buf);
  console.log(`  ✓ ${folder} (${size}x${size})`);
}

// ── GERA SPLASH PORTRAIT ──
console.log('\nGerando splash screens...');
for (const [folder, { w, h }] of Object.entries(splashPort)) {
  const dir = path.join(ANDROID_BASE, folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'splash.png'), drawSplash(w, h));
  console.log(`  ✓ ${folder} (${w}x${h})`);
}

// ── GERA SPLASH LANDSCAPE ──
for (const [folder, { w, h }] of Object.entries(splashLand)) {
  const dir = path.join(ANDROID_BASE, folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'splash.png'), drawSplash(w, h));
  console.log(`  ✓ ${folder} (${w}x${h})`);
}

console.log('\n✅ Assets com logo oficial gerados!');
