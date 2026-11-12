import * as THREE from 'three';

// Procedural Canvas Texture Generators with correct SRGBColorSpace & zero external dependencies

export function createTowerFacadeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Dark tinted architectural glass background
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(0.5, '#1e293b');
  grad.addColorStop(1, '#0b1120');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Vertical bronze/gold louvers / fins
  const finCount = 32;
  const colWidth = 1024 / finCount;
  for (let i = 0; i < finCount; i++) {
    const x = i * colWidth;
    // Window panes
    ctx.fillStyle = (i % 2 === 0) ? 'rgba(56, 189, 248, 0.08)' : 'rgba(30, 58, 138, 0.12)';
    ctx.fillRect(x + 4, 0, colWidth - 8, 1024);

    // Bronze vertical structural fin
    const bronzeGrad = ctx.createLinearGradient(x, 0, x + 4, 0);
    bronzeGrad.addColorStop(0, '#b45309');
    bronzeGrad.addColorStop(0.5, '#fbbf24');
    bronzeGrad.addColorStop(1, '#78350f');
    ctx.fillStyle = bronzeGrad;
    ctx.fillRect(x, 0, 4, 1024);

    // Floor dividers
    for (let f = 0; f < 32; f++) {
      const y = f * (1024 / 32);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(x, y, colWidth, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createTowerSignTexture(type: 'kopra' | 'livin'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, 512, 256);

  if (type === 'livin') {
    // "livin' by mandiri" branding in signature script & bright typography
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold italic 90px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("livin'", 256, 120);

    // Yellow accent dot
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(385, 65, 14, 0, Math.PI * 2);
    ctx.fill();

    // "by mandiri" subtext
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 32px "Segoe UI", sans-serif';
    ctx.fillText('by mandiri', 256, 180);
  } else {
    // "kopra by mandiri"
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold italic 84px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('kopra', 256, 120);

    // Orange crown petal accent
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(280, 60, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 32px "Segoe UI", sans-serif';
    ctx.fillText('by mandiri', 256, 180);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createOakWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm light natural oak base (as seen in photo 3 workbenches)
  ctx.fillStyle = '#d6b896';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle wood grains
  ctx.fillStyle = 'rgba(168, 134, 100, 0.25)';
  for (let i = 0; i < 512; i += 4) {
    const offset = Math.sin(i * 0.05) * 6;
    ctx.fillRect(0, i + offset, 512, 2);
  }

  // Soft plank seams
  ctx.fillStyle = 'rgba(110, 85, 60, 0.15)';
  ctx.fillRect(0, 255, 512, 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createAcousticFabricTexture(color: 'coral' | 'olive' | 'grey'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const baseHex = color === 'coral' ? '#c2410c' : color === 'olive' ? '#65a30d' : '#475569';
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 256, 256);

  // Felt weave micro-pattern
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  for (let y = 0; y < 256; y += 4) {
    for (let x = 0; x < 256; x += 4) {
      if ((x + y) % 8 === 0) {
        ctx.fillRect(x, y, 2, 2);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createOfficeCarpetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Modern corporate grey-slate speckled acoustic floor tile
  ctx.fillStyle = '#27272a';
  ctx.fillRect(0, 0, 512, 512);

  // Tile grid
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, 512, 512);
  ctx.strokeRect(256, 0, 256, 256);
  ctx.strokeRect(0, 256, 256, 256);

  // Noise specks
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.15)';
    ctx.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createLobbyTerrazzoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, 512, 512);

  // Large polished marble tile seams with subtle brass line
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, 512, 512);
  ctx.strokeRect(0, 0, 256, 256);
  ctx.strokeRect(256, 256, 256, 256);

  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1;
  ctx.strokeRect(2, 2, 508, 508);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createFaceRecogScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 384;
  const ctx = canvas.getContext('2d')!;

  // Dark biometric screen
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 256, 384);

  // Header
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, 256, 40);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MANDIRI ACCESS AI', 128, 26);

  // Face scanner oval guide
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.ellipse(128, 170, 70, 95, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Scanning crosshairs
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(128, 130);
  ctx.lineTo(128, 210);
  ctx.moveTo(90, 170);
  ctx.lineTo(166, 170);
  ctx.stroke();

  // Status prompt
  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 14px "Segoe UI", sans-serif';
  ctx.fillText('● SIAP SCAN WAJAH', 128, 300);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px "Segoe UI", sans-serif';
  ctx.fillText('Dekatkan wajah ke kamera', 128, 330);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createLaptopScreenTexture(mode: 'code' | 'dashboard'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 320);

  // Title bar
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 512, 32);

  // Window dots
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(20, 16, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#eab308';
  ctx.beginPath();
  ctx.arc(40, 16, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(60, 16, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px monospace';
  ctx.fillText(mode === 'code' ? 'LivinPaymentGateway.ts - Bank IT' : 'Kubernetes & Redis Pods - Cluster 14', 90, 20);

  if (mode === 'code') {
    ctx.fillStyle = '#38bdf8';
    ctx.font = '13px monospace';
    const lines = [
      "import { QRISEngine } from '@mandiri/core-payment';",
      "import { BiometricAuth } from '@mandiri/security';",
      "",
      "export async function processLivinTransaction(req: PaymentReq) {",
      "  const verified = await BiometricAuth.verifyToken(req.token);",
      "  if (!verified) throw new AuthError('Biometric mismatch');",
      "  const ledgerResult = await QRISEngine.settleDirect({",
      "    amount: req.amount,",
      "    merchantId: req.merchantId,",
      "    traceNumber: generateTraceId()",
      "  });",
      "  return { status: 200, message: 'Transaksi Sukses' };",
      "}",
    ];
    lines.forEach((line, idx) => {
      ctx.fillStyle = idx === 0 || idx === 1 ? '#c084fc' : idx === 3 ? '#60a5fa' : '#e2e8f0';
      ctx.fillText(line, 24, 60 + idx * 20);
    });
  } else {
    // Dashboard bars
    ctx.fillStyle = '#22c55e';
    ctx.fillText('● Microservices Healthy: 99.99%', 24, 70);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('● Livin TPS: 42,850 req/sec', 24, 100);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('● Latency P99: 14ms (Optimal)', 24, 130);

    // Mini graphs
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(24, 160, 464, 120);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(30, 250);
    for (let x = 30; x < 480; x += 30) {
      const y = 200 + Math.sin(x * 0.05) * 35 + (Math.random() * 20 - 10);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createSmartBoardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext('2d')!;

  // High-tech presentation board
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 1024, 576);

  // Mandiri Blue header bar
  const grad = ctx.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0, '#003366');
  grad.addColorStop(1, '#005599');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 80);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px "Segoe UI", sans-serif';
  ctx.fillText("LIVIN' & KOPRA IT SQUAD - SPRINT ARCHITECTURE", 40, 54);

  // Left card: Core Architecture
  ctx.fillStyle = '#1e293b';
  ctx.roundRect(40, 110, 440, 420, 12);
  ctx.fill();

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 22px "Segoe UI", sans-serif';
  ctx.fillText('Modern Cloud Core Architecture', 60, 150);

  const bullets = [
    '• Event-Driven Apache Kafka Streaming',
    '• Multi-Region Active-Active DB Clusters',
    '• Zero-Trust Service Mesh (mTLS Enforced)',
    '• Instant Face Recognition Biometrics (AI)',
    '• Livin’ SuperApp Microfrontends',
  ];
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '18px "Segoe UI", sans-serif';
  bullets.forEach((b, i) => {
    ctx.fillText(b, 60, 200 + i * 44);
  });

  // Right card: Sprint Status
  ctx.fillStyle = '#1e293b';
  ctx.roundRect(520, 110, 460, 420, 12);
  ctx.fill();

  ctx.fillStyle = '#22c55e';
  ctx.font = 'bold 22px "Segoe UI", sans-serif';
  ctx.fillText('Sprint 48 Delivery Progress', 540, 150);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '16px "Segoe UI", sans-serif';
  ctx.fillText('Target Release: v4.2.0 Next Monday', 540, 185);

  // Status pills
  const tasks = [
    { name: 'QRIS Cross-border Singapore/Malaysia', status: 'DONE', col: '#22c55e' },
    { name: 'Livin AI Personal Financial Assistant', status: 'IN REVIEW', col: '#38bdf8' },
    { name: 'Kopra Trade Finance API Upgrade', status: 'IN PROGRESS', col: '#eab308' },
    { name: 'Biometric Face Liveness Upgrade', status: 'TESTING', col: '#a855f7' },
  ];
  tasks.forEach((t, i) => {
    const y = 230 + i * 65;
    ctx.fillStyle = '#0f172a';
    ctx.roundRect(540, y, 420, 50, 8);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '15px "Segoe UI", sans-serif';
    ctx.fillText(t.name, 555, y + 31);

    ctx.fillStyle = t.col;
    ctx.font = 'bold 12px "Segoe UI", sans-serif';
    ctx.fillText(t.status, 875, y + 31);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function createFloorDirectoryTexture(floorNum: number, floorTitle: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 512, 160);

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, 16, 160);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 44px "Segoe UI", sans-serif';
  ctx.fillText(floorNum === 0 ? 'LANTAI G' : `LANTAI ${floorNum}`, 36, 65);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px "Segoe UI", sans-serif';
  ctx.fillText(floorTitle.length > 32 ? floorTitle.slice(0, 30) + '...' : floorTitle, 36, 110);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '15px "Segoe UI", sans-serif';
  ctx.fillText('BANK IT HEADQUARTERS • LIVIN & KOPRA', 36, 138);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
