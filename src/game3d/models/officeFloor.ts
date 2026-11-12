import * as THREE from 'three';
import {
  createOfficeCarpetTexture,
  createOakWoodTexture,
  createAcousticFabricTexture,
  createLaptopScreenTexture,
  createSmartBoardTexture,
  createFloorDirectoryTexture,
} from '../textures';
import { createHumanFigure } from './lobbyFloor';

export interface OfficeFloorResult {
  group: THREE.Group;
  waterFaucetState: { running: boolean; mesh: THREE.Mesh | null };
}

export function createOfficeFloor(floorNum: number, floorTitle: string): OfficeFloorResult {
  const group = new THREE.Group();
  group.name = `office_floor_${floorNum}`;

  const carpetTexture = createOfficeCarpetTexture();
  const oakTexture = createOakWoodTexture();
  const fabricCoral = createAcousticFabricTexture('coral');
  const fabricOlive = createAcousticFabricTexture('olive');
  const fabricGrey = createAcousticFabricTexture('grey');
  const laptopCodeTexture = createLaptopScreenTexture('code');
  const laptopDashTexture = createLaptopScreenTexture('dashboard');
  const smartBoardTexture = createSmartBoardTexture();
  const directoryTexture = createFloorDirectoryTexture(floorNum, floorTitle);

  // Materials
  const floorMat = new THREE.MeshStandardMaterial({
    map: carpetTexture,
    roughness: 0.85,
    metalness: 0.05,
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.9,
  });

  const darkWallMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.6,
  });

  const oakMat = new THREE.MeshStandardMaterial({
    map: oakTexture,
    roughness: 0.4,
    metalness: 0.05,
  });

  const whiteMetalMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.3,
    metalness: 0.4,
  });

  const blackMeshMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.8,
    metalness: 0.1,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x93c5fd,
    transparent: true,
    opacity: 0.35,
    roughness: 0.1,
    transmission: 0.85,
  });

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.9,
    roughness: 0.2,
  });

  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.8,
    roughness: 0.25,
  });

  const roomW = 44;
  const roomD = 38;
  const roomH = 4.2;

  // 1. Floor
  const floorGeo = new THREE.PlaneGeometry(roomW, roomD);
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  group.add(floorMesh);

  // 2. Exposed Industrial Ceiling (Matching Photo 3)
  const ceilingGeo = new THREE.PlaneGeometry(roomW, roomD);
  const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.9 });
  const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.y = roomH;
  group.add(ceilingMesh);

  // Large White HVAC Ducts running across ceiling (as in Photo 3)
  const ductMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  for (let d = -12; d <= 12; d += 8) {
    const duct = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, roomW - 4, 16), ductMat);
    duct.rotation.z = Math.PI / 2;
    duct.position.set(0, roomH - 0.5, d);
    group.add(duct);

    // Cable tray rack beneath ducts
    const cableTray = new THREE.Mesh(new THREE.BoxGeometry(roomW - 4, 0.08, 0.6), steelMat);
    cableTray.position.set(0, roomH - 0.7, d + 0.8);
    group.add(cableTray);
  }

  // Hanging linear LED minimalist lights
  const lightBarMat = new THREE.MeshBasicMaterial({ color: 0xffedd5 });
  for (let lx = -14; lx <= 14; lx += 7) {
    for (let lz = -10; lz <= 10; lz += 8) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.08, 0.15), lightBarMat);
      bar.position.set(lx, roomH - 0.9, lz);
      group.add(bar);

      // Suspension wire
      const wireL = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.9), steelMat);
      wireL.position.set(lx - 1.8, roomH - 0.45, lz);
      const wireR = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.9), steelMat);
      wireR.position.set(lx + 1.8, roomH - 0.45, lz);
      group.add(wireL, wireR);
    }
  }

  // 3. Perimeter Walls & City View Windows
  // South Wall (Elevator bank & corridor)
  const southWall = new THREE.Mesh(new THREE.BoxGeometry(roomW, roomH, 0.4), darkWallMat);
  southWall.position.set(0, roomH / 2, roomD / 2);
  group.add(southWall);

  // North Wall (Panoramic Skyscraper Windows overlooking city)
  const northGlass = new THREE.Mesh(new THREE.BoxGeometry(roomW, roomH, 0.2), glassMat);
  northGlass.position.set(0, roomH / 2, -roomD / 2);
  group.add(northGlass);

  // Exterior window bronze vertical mullions
  for (let w = -roomW / 2 + 3; w < roomW / 2; w += 3) {
    const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.2, roomH, 0.4), whiteMetalMat);
    mullion.position.set(w, roomH / 2, -roomD / 2);
    group.add(mullion);
  }

  // West Wall & East Wall
  const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, roomH, roomD), wallMat);
  westWall.position.set(-roomW / 2, roomH / 2, 0);
  group.add(westWall);

  const eastWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, roomH, roomD), wallMat);
  eastWall.position.set(roomW / 2, roomH / 2, 0);
  group.add(eastWall);

  // ==========================================
  // 4. RUANG KERJA (OPEN OFFICE WORKBENCHES - PHOTO 3)
  // ==========================================
  const workZone = new THREE.Group();
  workZone.position.set(-4, 0, 0);

  // Long oak workbench cluster (Photo 3 has 2 long opposing benches)
  const benchW = 12;
  const benchD = 3.6;
  const benchH = 0.75;

  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(benchW, 0.06, benchD), oakMat);
  tableTop.position.set(0, benchH, 0);
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  workZone.add(tableTop);

  // Desk metal frame legs
  for (let lx of [-benchW / 2 + 0.3, 0, benchW / 2 - 0.3]) {
    for (let lz of [-benchD / 2 + 0.3, benchD / 2 - 0.3]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, benchH), whiteMetalMat);
      leg.position.set(lx, benchH / 2, lz);
      workZone.add(leg);
    }
  }

  // Colorful Acoustic Divider Screens (Terracotta/Red & Olive Green as in Photo 3)
  const dividerH = 0.45;
  const divCoralMat = new THREE.MeshStandardMaterial({ map: fabricCoral, roughness: 0.8 });
  const divOliveMat = new THREE.MeshStandardMaterial({ map: fabricOlive, roughness: 0.8 });
  const divGreyMat = new THREE.MeshStandardMaterial({ map: fabricGrey, roughness: 0.8 });

  // Coral red acoustic screen (Left section)
  const screenCoral = new THREE.Mesh(new THREE.BoxGeometry(benchW * 0.48, dividerH, 0.05), divCoralMat);
  screenCoral.position.set(-benchW * 0.24, benchH + dividerH / 2, 0);
  workZone.add(screenCoral);

  // Olive green acoustic screen (Right section)
  const screenOlive = new THREE.Mesh(new THREE.BoxGeometry(benchW * 0.48, dividerH, 0.05), divOliveMat);
  screenOlive.position.set(benchW * 0.24, benchH + dividerH / 2, 0);
  workZone.add(screenOlive);

  // Ergonomic Mesh Chairs (Photo 3) & Laptop Setups
  const chairPositions = [
    { x: -4, z: -1.2, rot: 0, isPlayer: true },
    { x: -1.4, z: -1.2, rot: 0, isPlayer: false },
    { x: 1.4, z: -1.2, rot: 0, isPlayer: false },
    { x: 4, z: -1.2, rot: 0, isPlayer: false },
    // Opposing side
    { x: -4, z: 1.2, rot: Math.PI, isPlayer: false },
    { x: -1.4, z: 1.2, rot: Math.PI, isPlayer: false },
    { x: 1.4, z: 1.2, rot: Math.PI, isPlayer: false },
    { x: 4, z: 1.2, rot: Math.PI, isPlayer: false },
  ];

  chairPositions.forEach((pos, idx) => {
    const chair = createErgonomicOfficeChair(blackMeshMat, whiteMetalMat);
    chair.position.set(pos.x, 0, pos.z);
    chair.rotation.y = pos.rot;
    workZone.add(chair);

    // Tech Setup on table
    const tableZ = pos.z < 0 ? -0.8 : 0.8;
    const laptopRot = pos.z < 0 ? 0 : Math.PI;

    // Laptop & Monitor
    const laptopScreenMat = new THREE.MeshBasicMaterial({
      map: idx % 2 === 0 ? laptopCodeTexture : laptopDashTexture,
    });
    const laptop = createLaptop(laptopScreenMat);
    laptop.position.set(pos.x, benchH + 0.03, tableZ);
    laptop.rotation.y = laptopRot;
    workZone.add(laptop);

    // Hydroflask / drink tumbler (Photo 3 shows red, teal, yellow bottles)
    const bottleColor = idx % 3 === 0 ? 0xef4444 : idx % 3 === 1 ? 0x06b6d4 : 0xeab308;
    const bottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.24, 12),
      new THREE.MeshStandardMaterial({ color: bottleColor, roughness: 0.3 })
    );
    bottle.position.set(pos.x + 0.45, benchH + 0.12, tableZ + (pos.z < 0 ? 0.2 : -0.2));
    workZone.add(bottle);
  });

  // Nameplate at player workstation
  const playerDeskPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.12, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x0284c7 })
  );
  playerDeskPlate.position.set(-4, benchH + 0.06, -0.4);
  workZone.add(playerDeskPlate);

  // Modular Lockers Wall at the back (matching photo 3)
  // Photo 3 shows modular lockers with sage green and natural wood doors
  const lockerGroup = new THREE.Group();
  lockerGroup.position.set(-benchW / 2 - 4, 0, 0);

  const sageDoorMat = new THREE.MeshStandardMaterial({ color: 0x6ee7b7, roughness: 0.5 });
  const woodDoorMat = oakMat;

  const lockerW = 1.2;
  const lockerH = 2.4;
  const lockerD = 0.6;
  const cols = 5;
  const rows = 4;

  const lockerFrame = new THREE.Mesh(new THREE.BoxGeometry(cols * 0.7, lockerH, lockerD), darkWallMat);
  lockerFrame.position.set(0, lockerH / 2, 0);
  lockerGroup.add(lockerFrame);

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const doorMat = (c + r) % 2 === 0 ? sageDoorMat : woodDoorMat;
      const door = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 0.05), doorMat);
      door.position.set(-1.4 + c * 0.7, 0.3 + r * 0.6, lockerD / 2 + 0.02);
      lockerGroup.add(door);

      // Handle slit
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.02), blackMeshMat);
      handle.position.set(-1.4 + c * 0.7 + 0.22, 0.3 + r * 0.6, lockerD / 2 + 0.05);
      lockerGroup.add(handle);
    }
  }

  workZone.add(lockerGroup);

  // Colleague NPCs (Photo 3: colleagues discussing tasks)
  const npcAndi = createHumanFigure('Andi', '#1e293b', '#334155'); // Tech Lead
  npcAndi.position.set(2, 0, -2.4);
  npcAndi.rotation.y = Math.PI / 4;
  workZone.add(npcAndi);

  const npcSiti = createHumanFigure('Siti', '#0284c7', '#0f172a'); // Mobile Dev
  npcSiti.position.set(3, 0, -2.2);
  npcSiti.rotation.y = -Math.PI / 3;
  workZone.add(npcSiti);

  group.add(workZone);

  // ==========================================
  // 5. RUANG MEETING (CONFERENCE ROOM)
  // ==========================================
  const meetZone = new THREE.Group();
  meetZone.position.set(13, 0, -6);

  const meetW = 14;
  const meetD = 11;

  // Glass Wall enclosure with frosted band
  const glassWallN = new THREE.Mesh(new THREE.BoxGeometry(meetW, roomH, 0.15), glassMat);
  glassWallN.position.set(0, roomH / 2, -meetD / 2);
  const glassWallW = new THREE.Mesh(new THREE.BoxGeometry(0.15, roomH, meetD), glassMat);
  glassWallW.position.set(-meetW / 2, roomH / 2, 0);
  const glassWallS = new THREE.Mesh(new THREE.BoxGeometry(meetW, roomH, 0.15), glassMat);
  glassWallS.position.set(0, roomH / 2, meetD / 2);
  meetZone.add(glassWallN, glassWallW, glassWallS);

  // Meeting Room Door Frame
  const meetDoor = new THREE.Mesh(new THREE.BoxGeometry(2, 2.8, 0.2), whiteMetalMat);
  meetDoor.position.set(0, 1.4, meetD / 2);
  meetZone.add(meetDoor);

  // Room Sign: "RUANG MEETING SPRINT A"
  const meetSign = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.35, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x0284c7 })
  );
  meetSign.position.set(1.5, 2.2, meetD / 2 + 0.1);
  meetZone.add(meetSign);

  // Large Conference Table
  const confTable = new THREE.Mesh(new THREE.BoxGeometry(7, 0.08, 2.8), oakMat);
  confTable.position.set(0, benchH, 0);
  meetZone.add(confTable);

  // Table base
  const confBase = new THREE.Mesh(new THREE.BoxGeometry(4.5, benchH, 1.4), darkWallMat);
  confBase.position.set(0, benchH / 2, 0);
  meetZone.add(confBase);

  // Conference Chairs around table
  for (let cx = -2.4; cx <= 2.4; cx += 1.6) {
    const chairTop = createErgonomicOfficeChair(blackMeshMat, whiteMetalMat);
    chairTop.position.set(cx, 0, -1.8);
    chairTop.rotation.y = 0;
    const chairBot = createErgonomicOfficeChair(blackMeshMat, whiteMetalMat);
    chairBot.position.set(cx, 0, 1.8);
    chairBot.rotation.y = Math.PI;
    meetZone.add(chairTop, chairBot);
  }

  // 85-inch 4K Smart Presentation Board on the wall
  const smartBoard = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 2.7, 0.1),
    new THREE.MeshBasicMaterial({ map: smartBoardTexture })
  );
  smartBoard.position.set(meetW / 2 - 0.2, 2.2, 0);
  smartBoard.rotation.y = -Math.PI / 2;
  meetZone.add(smartBoard);

  group.add(meetZone);

  // ==========================================
  // 6. RUANG PANTRY (KITCHENETTE & RELAX AREA)
  // ==========================================
  const pantryZone = new THREE.Group();
  pantryZone.position.set(-13, 0, -11);

  const pantryW = 8;
  const pantryD = 6;

  // Modern Kitchen Counter & Overhead Cabinets
  const counterBase = new THREE.Mesh(
    new THREE.BoxGeometry(5.5, 0.9, 1.2),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 })
  );
  counterBase.position.set(0, 0.45, 0);
  pantryZone.add(counterBase);

  const counterTop = new THREE.Mesh(
    new THREE.BoxGeometry(5.6, 0.08, 1.3),
    new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.2 })
  );
  counterTop.position.set(0, 0.94, 0);
  pantryZone.add(counterTop);

  // Espresso Coffee Machine (Interactive)
  const coffeeMachine = new THREE.Group();
  coffeeMachine.position.set(-1.4, 0.98, 0.1);
  const cmBody = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.6), steelMat);
  cmBody.position.y = 0.3;
  const cmNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.15), bronzeMat);
  cmNozzle.position.set(0, 0.2, 0.25);
  const cmCup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.06, 0.14, 12),
    new THREE.MeshStandardMaterial({ color: 0xffffff })
  );
  cmCup.position.set(0, 0.08, 0.25);
  coffeeMachine.add(cmBody, cmNozzle, cmCup);
  pantryZone.add(coffeeMachine);

  // Water Dispenser (Galon / Dispenser Hot & Cold)
  const dispenser = new THREE.Group();
  dispenser.position.set(1.4, 0, 0);
  const dispBase = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.1, 0.7), whiteMetalMat);
  dispBase.position.y = 0.55;
  const galonBottle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.7, 12),
    new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
  );
  galonBottle.position.y = 1.45;
  dispenser.add(dispBase, galonBottle);
  pantryZone.add(dispenser);

  // Modern Refrigerator
  const fridge = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 1), steelMat);
  fridge.position.set(2.8, 1.1, 0);
  pantryZone.add(fridge);

  // High Bar Table & Stools overlooking the window
  const barTable = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 0.9), oakMat);
  barTable.position.set(-0.5, 1.1, -2.4);
  const barLeg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1), blackMeshMat);
  barLeg1.position.set(-2, 0.55, -2.4);
  const barLeg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.1), blackMeshMat);
  barLeg2.position.set(1, 0.55, -2.4);
  pantryZone.add(barTable, barLeg1, barLeg2);

  // Bar stools
  for (let bs = -1.6; bs <= 0.6; bs += 1.1) {
    const stool = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 12), oakMat);
    stool.position.set(bs, 0.8, -1.8);
    const stoolLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8), blackMeshMat);
    stoolLeg.position.set(bs, 0.4, -1.8);
    pantryZone.add(stool, stoolLeg);
  }

  // Pantry Door Sign
  const pantrySign = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.35, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x16a34a })
  );
  pantrySign.position.set(0, 2.2, 1.8);
  pantryZone.add(pantrySign);

  group.add(pantryZone);

  // ==========================================
  // 7. WC PRIA & WC WANITA (RESTROOMS)
  // ==========================================
  const wcZone = new THREE.Group();
  wcZone.position.set(14, 0, 10);

  // Restroom divider wall
  const wcDivider = new THREE.Mesh(new THREE.BoxGeometry(0.3, roomH, 12), darkWallMat);
  wcDivider.position.set(0, roomH / 2, 0);
  wcZone.add(wcDivider);

  // WC Pria Door & Sign
  const wcPriaDoor = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.6, 0.1), whiteMetalMat);
  wcPriaDoor.position.set(-2, 1.3, -5.8);
  const wcPriaSign = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.35, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x0284c7 })
  );
  wcPriaSign.position.set(-2, 2.75, -5.7);
  wcZone.add(wcPriaDoor, wcPriaSign);

  // WC Wanita Door & Sign
  const wcWanitaDoor = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.6, 0.1), whiteMetalMat);
  wcWanitaDoor.position.set(2, 1.3, -5.8);
  const wcWanitaSign = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.35, 0.05),
    new THREE.MeshStandardMaterial({ color: 0xdb2777 })
  );
  wcWanitaSign.position.set(2, 2.75, -5.7);
  wcZone.add(wcWanitaDoor, wcWanitaSign);

  // Sink vanity in WC
  const vanityMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
  const vanityCounter = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.85, 0.9), vanityMat);
  vanityCounter.position.set(-2, 0.42, 0);
  wcZone.add(vanityCounter);

  // Mirror with LED backlight
  const mirror = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 1.4, 0.05),
    new THREE.MeshStandardMaterial({ color: 0xdbeafe, roughness: 0.05, metalness: 0.9 })
  );
  mirror.position.set(-2, 1.9, 0.4);
  wcZone.add(mirror);

  // Interactive Faucet with water flow
  const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3), steelMat);
  faucet.position.set(-2, 0.98, 0.1);
  wcZone.add(faucet);

  // Flowing water stream representation
  const waterStream = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.03, 0.3),
    new THREE.MeshPhysicalMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.7 })
  );
  waterStream.position.set(-2, 0.85, 0.18);
  waterStream.visible = false;
  wcZone.add(waterStream);

  group.add(wcZone);

  // ==========================================
  // 8. ELEVATOR FOYER & DIRECTORY BOARD
  // ==========================================
  const elevFoyer = new THREE.Group();
  elevFoyer.position.set(-4, 0, roomD / 2 - 1.2);

  const numElevators = 4;
  const elevSpacing = 4.2;
  const startX = -((numElevators - 1) * elevSpacing) / 2;

  for (let e = 0; e < numElevators; e++) {
    const ex = startX + e * elevSpacing;

    // Elevator doors
    const elevDoor = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.2, 0.1), steelMat);
    elevDoor.position.set(ex, 1.6, 0);
    elevFoyer.add(elevDoor);

    // Call button
    const btn = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 0.08), darkWallMat);
    btn.position.set(ex + 1.5, 1.5, 0.05);
    elevFoyer.add(btn);
  }

  // Floor Directory Signboard on the foyer wall
  const dirBoard = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 1.3, 0.05),
    new THREE.MeshBasicMaterial({ map: directoryTexture })
  );
  dirBoard.position.set(0, 2.6, 0.1);
  elevFoyer.add(dirBoard);

  group.add(elevFoyer);

  return {
    group,
    waterFaucetState: { running: false, mesh: waterStream },
  };
}

// 3D Ergonomic Office Chair Model (based on Photo 3 mesh office chair with headrest)
function createErgonomicOfficeChair(blackMat: THREE.Material, metalMat: THREE.Material): THREE.Group {
  const chair = new THREE.Group();

  // 5-Star castor base
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.06, 5), metalMat);
  base.position.y = 0.08;
  const gasLift = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4), metalMat);
  gasLift.position.y = 0.28;
  chair.add(base, gasLift);

  // Ergonomic seat cushion
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.52), blackMat);
  seat.position.y = 0.48;
  chair.add(seat);

  // Curved mesh backrest
  const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.06), blackMat);
  back.position.set(0, 0.8, -0.25);
  chair.add(back);

  // Adjustable headrest (prominently seen in photo 3!)
  const headrestPillar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.2, 0.04), metalMat);
  headrestPillar.position.set(0, 1.15, -0.27);
  const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.08), blackMat);
  headrest.position.set(0, 1.25, -0.26);
  chair.add(headrestPillar, headrest);

  // Armrests
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.25), blackMat);
  armL.position.set(-0.28, 0.62, 0);
  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.25), blackMat);
  armR.position.set(0.28, 0.62, 0);
  chair.add(armL, armR);

  return chair;
}

// 3D Laptop model
function createLaptop(screenMat: THREE.Material): THREE.Group {
  const laptop = new THREE.Group();

  const caseMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });

  // Base with keyboard
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.02, 0.3), caseMat);
  base.position.set(0, 0.01, 0);
  laptop.add(base);

  // Screen display hinge angled at 105 degrees
  const screenHinge = new THREE.Group();
  screenHinge.position.set(0, 0.02, -0.15);

  const lid = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.28, 0.015), caseMat);
  lid.position.set(0, 0.14, 0);

  const display = new THREE.Mesh(new THREE.PlaneGeometry(0.39, 0.25), screenMat);
  display.position.set(0, 0.14, 0.009);

  screenHinge.add(lid, display);
  screenHinge.rotation.x = 0.22; // angled back slightly
  laptop.add(screenHinge);

  return laptop;
}
