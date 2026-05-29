/**
 * Gerador de ícones e splash screen para o app Barcelos na NET
 * Usa Canvas (canvas npm package) para gerar PNGs sem depender do ImageMagick
 *
 * Instale: npm install canvas
 * Execute: node generate-assets.mjs
 */

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

const ANDROID_BASE = './android/app/src/main/res';

// Tamanhos de ícone Android
const iconSizes = {
  'mipmap-mdpi':    48,
  'mipmap-hdpi':    72,
  'mipmap-xhdpi':   96,
  'mipmap-xxhdpi':  144,
  'mipmap-xxxhdpi': 192,
};

// Splash screen — portrait
const splashSizes = {
  'drawable-port-mdpi':    { w: 320, h: 480 },
  'drawable-port-hdpi':    { w: 480, h: 800 },
  'drawable-port-xhdpi':   { w: 720, h: 1280 },
  'drawable-port-xxhdpi':  { w: 960, h: 1600 },
  'drawable-port-xxxhdpi': { w: 1280, h: 1920 },
};

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const r = size / 2;

  // Fundo escuro
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.arc(r, r, r, 0, Math.PI * 2);
  ctx.fill();

  // Letra B estilizada (Barcelos)
  ctx.fillStyle = '#e74c3c';
  ctx.font = `bold ${size * 0.55}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('B', r, r * 1.05);

  // Ponto vermelho decorativo
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(r * 1.35, r * 0.65, size * 0.07, 0, Math.PI * 2);
  ctx.fill();

  return canvas.toBuffer('image/png');
}

function drawSplash(w, h) {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');

  // Fundo gradiente escuro
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#0d0d1a');
  grad.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Ícone centralizado
  const iconSize = Math.min(w, h) * 0.3;
  const cx = w / 2;
  const cy = h / 2 - iconSize * 0.1;

  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.arc(cx, cy, iconSize / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${iconSize * 0.6}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('B', cx, cy * 1.01);

  // Nome do app
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${Math.min(w, h) * 0.045}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('Barcelos na NET', cx, cy + iconSize / 2 + iconSize * 0.25);

  // Tagline
  ctx.fillStyle = '#aaaacc';
  ctx.font = `${Math.min(w, h) * 0.025}px sans-serif`;
  ctx.fillText('Notícias • Cultura • Entretenimento', cx, cy + iconSize / 2 + iconSize * 0.5);

  return canvas.toBuffer('image/png');
}

// Gera ícones
console.log('Gerando ícones...');
for (const [folder, size] of Object.entries(iconSizes)) {
  const dir = path.join(ANDROID_BASE, folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'ic_launcher.png'), drawIcon(size));
  fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), drawIcon(size));
  fs.writeFileSync(path.join(dir, 'ic_launcher_foreground.png'), drawIcon(size));
  console.log(`  ✓ ${folder} (${size}x${size})`);
}

// Gera splash screens
console.log('\nGerando splash screens...');
for (const [folder, { w, h }] of Object.entries(splashSizes)) {
  const dir = path.join(ANDROID_BASE, folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'splash.png'), drawSplash(w, h));
  console.log(`  ✓ ${folder} (${w}x${h})`);
}

// Landscape splash (inverted)
const landSizes = {
  'drawable-land-mdpi':    { w: 480,  h: 320 },
  'drawable-land-hdpi':    { w: 800,  h: 480 },
  'drawable-land-xhdpi':   { w: 1280, h: 720 },
  'drawable-land-xxhdpi':  { w: 1600, h: 960 },
  'drawable-land-xxxhdpi': { w: 1920, h: 1280 },
};
for (const [folder, { w, h }] of Object.entries(landSizes)) {
  const dir = path.join(ANDROID_BASE, folder);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'splash.png'), drawSplash(w, h));
  console.log(`  ✓ ${folder} (${w}x${h})`);
}

console.log('\n✅ Assets gerados com sucesso!');
