import * as THREE from 'three';

export interface ElevatorCabinResult {
  group: THREE.Group;
  doorLeft: THREE.Mesh;
  doorRight: THREE.Mesh;
  indicatorTextCanvas: HTMLCanvasElement;
  indicatorTexture: THREE.CanvasTexture;
  updateFloorDisplay: (floor: number, direction: 'up' | 'down' | 'idle') => void;
  openDoors: () => void;
  closeDoors: () => void;
}

export function createElevatorCabin(): ElevatorCabinResult {
  const group = new THREE.Group();
  group.name = 'elevator_cabin';

  const w = 4.2;
  const d = 3.6;
  const h = 3.2;

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0xcfd8dc,
    metalness: 0.9,
    roughness: 0.15,
  });

  const darkPanelMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.5,
    roughness: 0.3,
  });

  const mirrorMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.98,
    roughness: 0.05,
  });

  const goldTrimMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.85,
    roughness: 0.2,
  });

  // Floor
  const floor = new THREE.Mesh(
    new THREE.BoxGeometry(w, 0.1, d),
    new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 })
  );
  floor.position.set(0, -0.05, 0);
  group.add(floor);

  // Ceiling with warm perimeter LED cove
  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d), darkPanelMat);
  ceiling.position.set(0, h, 0);
  group.add(ceiling);

  const ledLight = new THREE.Mesh(
    new THREE.BoxGeometry(w - 0.6, 0.02, d - 0.6),
    new THREE.MeshBasicMaterial({ color: 0xfef3c7 })
  );
  ledLight.position.set(0, h - 0.04, 0);
  group.add(ledLight);

  // Back Wall (Mirror + stainless panels)
  const backMirror = new THREE.Mesh(new THREE.BoxGeometry(w - 0.4, h - 0.8, 0.05), mirrorMat);
  backMirror.position.set(0, h / 2, -d / 2 + 0.05);
  group.add(backMirror);

  // Handrail
  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, w - 0.6), goldTrimMat);
  rail.rotation.z = Math.PI / 2;
  rail.position.set(0, 1.0, -d / 2 + 0.2);
  group.add(rail);

  // Left & Right Walls
  const wallL = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, d), steelMat);
  wallL.position.set(-w / 2, h / 2, 0);
  const wallR = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, d), steelMat);
  wallR.position.set(w / 2, h / 2, 0);
  group.add(wallL, wallR);

  // Sliding Front Doors
  const doorGeo = new THREE.BoxGeometry(w / 2 - 0.1, h - 0.1, 0.08);
  const doorLeft = new THREE.Mesh(doorGeo, steelMat);
  doorLeft.position.set(-w / 4, h / 2, d / 2 - 0.05);
  const doorRight = new THREE.Mesh(doorGeo, steelMat);
  doorRight.position.set(w / 4, h / 2, d / 2 - 0.05);
  group.add(doorLeft, doorRight);

  // Digital Floor Indicator Screen above door
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const updateFloorDisplay = (floorNum: number, dir: 'up' | 'down' | 'idle') => {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 256, 128);

    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, 256, 16);

    const arrow = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '●';
    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${arrow} ${floorNum === 0 ? 'G' : floorNum}`, 128, 70);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '16px "Segoe UI", sans-serif';
    ctx.fillText(dir === 'idle' ? 'DOORS OPEN' : 'ELEVATOR MOVING...', 128, 105);

    texture.needsUpdate = true;
  };

  updateFloorDisplay(0, 'idle');

  const screenMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.6, 0.05),
    new THREE.MeshBasicMaterial({ map: texture })
  );
  screenMesh.position.set(0, h - 0.45, d / 2 - 0.12);
  group.add(screenMesh);

  // Elevator Floor Control Panel (Buttons 1-32 + G on wall)
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.8, 0.6), darkPanelMat);
  panel.position.set(w / 2 - 0.08, 1.4, 0.8);
  group.add(panel);

  const openDoors = () => {
    doorLeft.position.x = -w / 2 + 0.3;
    doorRight.position.x = w / 2 - 0.3;
  };

  const closeDoors = () => {
    doorLeft.position.x = -w / 4;
    doorRight.position.x = w / 4;
  };

  return {
    group,
    doorLeft,
    doorRight,
    indicatorTextCanvas: canvas,
    indicatorTexture: texture,
    updateFloorDisplay,
    openDoors,
    closeDoors,
  };
}
