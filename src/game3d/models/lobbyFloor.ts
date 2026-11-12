import * as THREE from 'three';
import { createLobbyTerrazzoTexture, createFaceRecogScreenTexture } from '../textures';

export interface LobbyModels {
  group: THREE.Group;
  turnstileFlaps: THREE.Mesh[];
  openTurnstiles: () => void;
  closeTurnstiles: () => void;
}

export function createLobbyFloor(): LobbyModels {
  const group = new THREE.Group();
  group.name = 'lobby_floor';

  const terrazzoTexture = createLobbyTerrazzoTexture();
  const faceRecogTexture = createFaceRecogScreenTexture();

  const floorMat = new THREE.MeshStandardMaterial({
    map: terrazzoTexture,
    roughness: 0.25,
    metalness: 0.1,
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.8,
  });

  const darkWoodMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
    metalness: 0.2,
  });

  const marbleMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.1,
  });

  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.8,
    roughness: 0.25,
  });

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.85,
    roughness: 0.2,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.5,
    roughness: 0.1,
    transmission: 0.8,
  });

  const lobbyW = 34;
  const lobbyD = 34;
  const lobbyH = 6;

  // 1. Floor
  const floorGeo = new THREE.PlaneGeometry(lobbyW, lobbyD);
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  group.add(floorMesh);

  // 2. Ceiling with recessed warm LED panels
  const ceilingGeo = new THREE.PlaneGeometry(lobbyW, lobbyD);
  const ceilingMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
  const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.y = lobbyH;
  group.add(ceilingMesh);

  // Recessed warm light fixtures on ceiling
  const lightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
  for (let x = -10; x <= 10; x += 10) {
    for (let z = -10; z <= 10; z += 10) {
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(4, 0.1, 4), lightMat);
      lamp.position.set(x, lobbyH - 0.05, z);
      group.add(lamp);
    }
  }

  // 3. Walls
  // Back Wall (Elevator bank wall)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(lobbyW, lobbyH, 0.4), wallMat);
  backWall.position.set(0, lobbyH / 2, -lobbyD / 2);
  group.add(backWall);

  // Front Wall (Glass wall overlooking the outdoor entrance plaza)
  const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(lobbyW, lobbyH, 0.2), glassMat);
  frontGlass.position.set(0, lobbyH / 2, lobbyD / 2);
  group.add(frontGlass);

  // Side Walls
  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, lobbyH, lobbyD), wallMat);
  leftWall.position.set(-lobbyW / 2, lobbyH / 2, 0);
  group.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, lobbyH, lobbyD), wallMat);
  rightWall.position.set(lobbyW / 2, lobbyH / 2, 0);
  group.add(rightWall);

  // Decorative slatted bronze feature wall behind reception
  const featureWall = new THREE.Mesh(new THREE.BoxGeometry(16, lobbyH - 1, 0.3), darkWoodMat);
  featureWall.position.set(-8, lobbyH / 2, 0);
  group.add(featureWall);

  // 4. Meja Resepsionis (Grand Marble Reception Desk)
  const recepDesk = new THREE.Group();
  recepDesk.position.set(-8, 0, 6);

  const deskCounter = new THREE.Mesh(new THREE.BoxGeometry(7, 1.2, 2.4), marbleMat);
  deskCounter.position.set(0, 0.6, 0);
  deskCounter.castShadow = true;
  recepDesk.add(deskCounter);

  const deskAccent = new THREE.Mesh(new THREE.BoxGeometry(7.1, 0.15, 2.5), bronzeMat);
  deskAccent.position.set(0, 1.2, 0);
  recepDesk.add(deskAccent);

  // Receptionist PC & Nameplate
  const recepMonitor = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.1), darkWoodMat);
  recepMonitor.position.set(0, 1.5, 0);
  recepDesk.add(recepMonitor);

  // Receptionist NPC figure (Mbak Putri)
  const npcRecep = createHumanFigure('Mbak Putri', '#ec4899', '#1e293b');
  npcRecep.position.set(0, 0, -1);
  recepDesk.add(npcRecep);

  group.add(recepDesk);

  // 5. Pos Security & Security Guard (Pak Budi)
  const secDesk = new THREE.Group();
  secDesk.position.set(10, 0, 8);

  const secCounter = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.1, 1.8), darkWoodMat);
  secCounter.position.set(0, 0.55, 0);
  secDesk.add(secCounter);

  const secMonitor = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.1), steelMat);
  secMonitor.position.set(0, 1.35, 0);
  secDesk.add(secMonitor);

  // Security Guard figure (Pak Budi)
  const npcSec = createHumanFigure('Pak Budi', '#ffffff', '#1e3a8a'); // White uniform shirt, navy trousers
  npcSec.position.set(0, 0, -0.9);
  secDesk.add(npcSec);

  group.add(secDesk);

  // 6. Turnstile Gate Line with Face Recognition Terminals (Sistem Absensi Biometrik)
  const turnstilesGroup = new THREE.Group();
  turnstilesGroup.position.set(0, 0, -2); // Between lobby front and elevator bank

  const turnstileFlaps: THREE.Mesh[] = [];
  const laneCount = 4;
  const laneSpacing = 2.4;
  const startX = -((laneCount * laneSpacing) / 2);

  const faceMat = new THREE.MeshBasicMaterial({ map: faceRecogTexture });

  for (let i = 0; i <= laneCount; i++) {
    const x = startX + i * laneSpacing;

    // Stainless steel turnstile pedestal
    const pedestal = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.1, 1.8), steelMat);
    pedestal.position.set(x, 0.55, 0);
    pedestal.castShadow = true;
    turnstilesGroup.add(pedestal);

    // Top acrylic reader plate
    const topPlate = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 1.82), darkWoodMat);
    topPlate.position.set(x, 1.12, 0);
    turnstilesGroup.add(topPlate);

    // Face Recognition Scanner Terminal mounted on a slim bronze pole
    if (i < laneCount) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45), bronzeMat);
      pole.position.set(x + 0.15, 1.35, 0.4);
      turnstilesGroup.add(pole);

      const scanScreen = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.4, 0.04), faceMat);
      scanScreen.position.set(x + 0.15, 1.65, 0.4);
      scanScreen.rotation.y = -0.15;
      turnstilesGroup.add(scanScreen);

      // Status indicator ring (glowing emerald green or cyan)
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.06, 0.09, 16),
        new THREE.MeshBasicMaterial({ color: 0x22c55e, side: THREE.DoubleSide })
      );
      ring.position.set(x + 0.15, 1.9, 0.42);
      turnstilesGroup.add(ring);
    }

    // Glass swing flaps in the lane (between pedestals)
    if (i < laneCount) {
      const flapL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.04), glassMat);
      flapL.position.set(x + 0.4, 0.65, 0);
      turnstilesGroup.add(flapL);
      turnstileFlaps.push(flapL);

      const flapR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.04), glassMat);
      flapR.position.set(x + laneSpacing - 0.4, 0.65, 0);
      turnstilesGroup.add(flapR);
      turnstileFlaps.push(flapR);
    }
  }

  group.add(turnstilesGroup);

  // Turnstile open/close logic
  const openTurnstiles = () => {
    turnstileFlaps.forEach((flap, idx) => {
      flap.rotation.y = idx % 2 === 0 ? Math.PI / 2 : -Math.PI / 2;
    });
  };

  const closeTurnstiles = () => {
    turnstileFlaps.forEach((flap) => {
      flap.rotation.y = 0;
    });
  };

  // 7. Elevator Bank (4 Modern High-Speed Elevators to All 32 Floors)
  const elevatorFoyer = new THREE.Group();
  elevatorFoyer.position.set(0, 0, -lobbyD / 2 + 1);

  const numElevators = 4;
  const elevSpacing = 5.2;
  const elevStartX = -((numElevators - 1) * elevSpacing) / 2;

  for (let e = 0; e < numElevators; e++) {
    const ex = elevStartX + e * elevSpacing;

    // Elevator bronze door surround portal
    const portal = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.2, 0.3), bronzeMat);
    portal.position.set(ex, 2.1, 0);
    elevatorFoyer.add(portal);

    // Elevator stainless doors (double doors)
    const doorL = new THREE.Mesh(new THREE.BoxGeometry(1.3, 3.8, 0.1), steelMat);
    doorL.position.set(ex - 0.7, 1.9, 0.1);
    const doorR = new THREE.Mesh(new THREE.BoxGeometry(1.3, 3.8, 0.1), steelMat);
    doorR.position.set(ex + 0.7, 1.9, 0.1);
    elevatorFoyer.add(doorL, doorR);

    // Floor indicator digital display above elevator
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x090d16 });
    const screen = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 0.1), screenMat);
    screen.position.set(ex, 4.3, 0.16);
    elevatorFoyer.add(screen);

    // Call button panel
    const btnBox = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.8, 0.1), darkWoodMat);
    btnBox.position.set(ex + 1.8, 1.6, 0.15);
    elevatorFoyer.add(btnBox);
  }

  group.add(elevatorFoyer);

  // 8. Waiting Lounge (Designer Leather Sofas & Marble Tables)
  const loungeGroup = new THREE.Group();
  loungeGroup.position.set(-10, 0, -9);

  // Sofa 1
  const sofa1 = createSofa(0x334155);
  sofa1.position.set(0, 0, 0);
  loungeGroup.add(sofa1);

  // Coffee Table
  const coffeeTable = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 1.4), marbleMat);
  coffeeTable.position.set(0, 0.22, 2.2);
  loungeGroup.add(coffeeTable);

  // Potted indoor tree
  const plantPot = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.4, 1, 12), darkWoodMat);
  plantPot.position.set(3, 0.5, 0);
  const plantLeaves = new THREE.Mesh(new THREE.SphereGeometry(1.1, 8, 8), new THREE.MeshStandardMaterial({ color: 0x166534 }));
  plantLeaves.position.set(3, 1.8, 0);
  loungeGroup.add(plantPot, plantLeaves);

  group.add(loungeGroup);

  return {
    group,
    turnstileFlaps,
    openTurnstiles,
    closeTurnstiles,
  };
}

// Procedural 3D Human composite character (Security / Receptionist / IT Colleague)
export function createHumanFigure(name: string, shirtHex: string, pantsHex: string): THREE.Group {
  const human = new THREE.Group();
  human.name = `human_${name}`;

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5d0b0, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(shirtHex), roughness: 0.5 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(pantsHex), roughness: 0.7 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });

  // Torso / Body
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.3), shirtMat);
  torso.position.y = 1.15;
  human.add(torso);

  // ID Lanyard card around neck
  const idBadge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.02), new THREE.MeshBasicMaterial({ color: 0x0284c7 }));
  idBadge.position.set(0, 1.15, 0.16);
  human.add(idBadge);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), skinMat);
  head.position.y = 1.68;
  human.add(head);

  // Hair
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.21, 10, 10), hairMat);
  hair.position.set(0, 1.74, -0.03);
  hair.scale.set(1, 0.8, 1);
  human.add(hair);

  // Legs
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.75, 0.22), pantsMat);
  legL.position.set(-0.14, 0.4, 0);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.75, 0.22), pantsMat);
  legR.position.set(0.14, 0.4, 0);
  human.add(legL, legR);

  // Shoes
  const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.32), shoeMat);
  shoeL.position.set(-0.14, 0.06, 0.04);
  const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.32), shoeMat);
  shoeR.position.set(0.14, 0.06, 0.04);
  human.add(shoeL, shoeR);

  return human;
}

function createSofa(colorHex: number): THREE.Group {
  const sofa = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.7 });

  const seat = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.45, 1.2), mat);
  seat.position.set(0, 0.35, 0);
  const back = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.8, 0.3), mat);
  back.position.set(0, 0.8, -0.45);
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.65, 1.2), mat);
  armL.position.set(-1.8, 0.55, 0);
  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.65, 1.2), mat);
  armR.position.set(1.8, 0.55, 0);

  sofa.add(seat, back, armL, armR);
  return sofa;
}
