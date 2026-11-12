import * as THREE from 'three';
import { createTowerFacadeTexture, createTowerSignTexture } from '../textures';

// 3D Procedural Tower Model matching Photos 1 & 2 (Menara Bank Mandiri - Kopra & Livin' 32-Floor Skyscraper)
export function createTowerBuilding(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'tower_building';

  const facadeTexture = createTowerFacadeTexture();
  const livinSignTexture = createTowerSignTexture('livin');
  const kopraSignTexture = createTowerSignTexture('kopra');

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x1e293b,
    metalness: 0.85,
    roughness: 0.15,
    map: facadeTexture,
    reflectivity: 0.9,
    clearcoat: 0.8,
  });

  const bronzeMaterial = new THREE.MeshStandardMaterial({
    color: 0xb45309,
    metalness: 0.8,
    roughness: 0.25,
  });

  const concreteMaterial = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.1,
    roughness: 0.7,
  });

  const foliageMaterial = new THREE.MeshStandardMaterial({
    color: 0x15803d,
    metalness: 0.1,
    roughness: 0.8,
  });

  // Tower dimensions (32 floors tall = 128 units tall)
  const towerHeight = 128;
  const towerWidth = 36;
  const towerDepth = 28;

  // 1. Main Tower Shaft (Sleek multi-faceted body)
  const mainShaftGeo = new THREE.BoxGeometry(towerWidth, towerHeight, towerDepth, 1, 32, 1);
  const mainShaft = new THREE.Mesh(mainShaftGeo, glassMaterial);
  mainShaft.position.set(0, towerHeight / 2, 0);
  mainShaft.castShadow = true;
  mainShaft.receiveShadow = true;
  group.add(mainShaft);

  // 2. Vertical architectural fins with hyperbolic curve twist (Photos 1 & 2)
  const finGeo = new THREE.BoxGeometry(0.3, towerHeight, 0.6);
  const finCountX = 14;
  for (let i = -finCountX / 2; i <= finCountX / 2; i++) {
    const finFront = new THREE.Mesh(finGeo, bronzeMaterial);
    const xPos = (i / (finCountX / 2)) * (towerWidth / 2 - 0.5);
    finFront.position.set(xPos, towerHeight / 2, towerDepth / 2 + 0.3);
    group.add(finFront);

    const finBack = new THREE.Mesh(finGeo, bronzeMaterial);
    finBack.position.set(xPos, towerHeight / 2, -towerDepth / 2 - 0.3);
    group.add(finBack);
  }

  // 3. Sweeping curved bronze accent ribbon (as seen on the front face in photo 1 & 2)
  const curvePoints: THREE.Vector3[] = [];
  curvePoints.push(new THREE.Vector3(-towerWidth / 2 + 2, 16, towerDepth / 2 + 0.5));
  curvePoints.push(new THREE.Vector3(-6, 45, towerDepth / 2 + 0.7));
  curvePoints.push(new THREE.Vector3(8, 85, towerDepth / 2 + 0.6));
  curvePoints.push(new THREE.Vector3(towerWidth / 2 - 4, towerHeight - 8, towerDepth / 2 + 0.5));
  const curve = new THREE.CatmullRomCurve3(curvePoints);
  const curveGeo = new THREE.TubeGeometry(curve, 32, 0.8, 8, false);
  const sweepFins = new THREE.Mesh(curveGeo, bronzeMaterial);
  group.add(sweepFins);

  // 4. Crown Angled Top (Roof finial with vertical glass fins)
  const crownGeo = new THREE.BoxGeometry(towerWidth - 4, 14, towerDepth - 4);
  const crownMesh = new THREE.Mesh(crownGeo, glassMaterial);
  crownMesh.position.set(0, towerHeight + 7, 0);
  crownMesh.rotation.z = -0.05; // stylish angled roofline
  group.add(crownMesh);

  // 5. Crown Signage: "livin' by mandiri" on front, "kopra by mandiri" on side
  const signMatLivin = new THREE.MeshBasicMaterial({
    map: livinSignTexture,
    transparent: true,
  });
  const signLivin = new THREE.Mesh(new THREE.PlaneGeometry(24, 12), signMatLivin);
  signLivin.position.set(0, towerHeight - 12, towerDepth / 2 + 0.4);
  group.add(signLivin);

  const signMatKopra = new THREE.MeshBasicMaterial({
    map: kopraSignTexture,
    transparent: true,
  });
  const signKopra = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), signMatKopra);
  signKopra.position.set(-towerWidth / 2 - 0.4, towerHeight - 12, 0);
  signKopra.rotation.y = -Math.PI / 2;
  group.add(signKopra);

  // 6. Podium base with curved rounded wings and landscaped roof gardens (Photos 1 & 2)
  const podiumGeo = new THREE.BoxGeometry(towerWidth + 24, 16, towerDepth + 18);
  const podiumMesh = new THREE.Mesh(podiumGeo, glassMaterial);
  podiumMesh.position.set(6, 8, 4);
  podiumMesh.castShadow = true;
  podiumMesh.receiveShadow = true;
  group.add(podiumMesh);

  // Podium rooftop green gardens
  const terraceGarden = new THREE.Mesh(new THREE.BoxGeometry(towerWidth + 20, 0.8, towerDepth + 14), foliageMaterial);
  terraceGarden.position.set(6, 16.4, 4);
  group.add(terraceGarden);

  // Miniature trees on terrace garden
  const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
  for (let t = 0; t < 6; t++) {
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2, 6), treeTrunkMat);
    const foliage = new THREE.Mesh(new THREE.SphereGeometry(1.2, 8, 8), foliageMaterial);
    trunk.position.set(-8 + t * 4, 17.4, 10 + (t % 2) * 2);
    foliage.position.set(-8 + t * 4, 19, 10 + (t % 2) * 2);
    group.add(trunk);
    group.add(foliage);
  }

  // 7. Ground Level Grand Entrance Canopy & Tall Bronze Pilotis (Columns)
  const canopyGeo = new THREE.BoxGeometry(28, 1.2, 14);
  const canopyMesh = new THREE.Mesh(canopyGeo, bronzeMaterial);
  canopyMesh.position.set(0, 5, towerDepth / 2 + 10);
  group.add(canopyMesh);

  // Tall supporting columns (pilotis)
  for (let c = -1; c <= 1; c += 2) {
    const colMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 5, 8), bronzeMaterial);
    colMesh.position.set(c * 11, 2.5, towerDepth / 2 + 15);
    group.add(colMesh);
  }

  // 8. Glass Entrance Doors (Portal to Lobby)
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(10, 4.2, 0.4), bronzeMaterial);
  doorFrame.position.set(0, 2.1, towerDepth / 2 + 8.8);
  group.add(doorFrame);

  const glassDoorMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.65,
    roughness: 0.1,
    transmission: 0.7,
  });
  const doorPanes = new THREE.Mesh(new THREE.BoxGeometry(9.4, 3.8, 0.2), glassDoorMat);
  doorPanes.position.set(0, 2.1, towerDepth / 2 + 8.8);
  group.add(doorPanes);

  // "ENTRANCE LOBBY - BANK IT" Sign over door
  const signPlate = new THREE.Mesh(
    new THREE.BoxGeometry(8, 0.9, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x0284c7 })
  );
  signPlate.position.set(0, 4.4, towerDepth / 2 + 9);
  group.add(signPlate);

  // 9. Surrounding Outdoor Plaza Ground, Roads & Walkway
  const groundGeo = new THREE.PlaneGeometry(160, 160);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.85,
    metalness: 0.1,
  });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.position.y = 0;
  groundMesh.receiveShadow = true;
  group.add(groundMesh);

  // Decorative stone pavement path leading to entrance
  const walkwayGeo = new THREE.PlaneGeometry(16, 36);
  const walkwayMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.6,
  });
  const walkway = new THREE.Mesh(walkwayGeo, walkwayMat);
  walkway.rotation.x = -Math.PI / 2;
  walkway.position.set(0, 0.02, towerDepth / 2 + 24);
  walkway.receiveShadow = true;
  group.add(walkway);

  // Security guard booth outside
  const boothGroup = new THREE.Group();
  boothGroup.position.set(-16, 0, towerDepth / 2 + 28);
  const boothBody = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), concreteMaterial);
  boothBody.position.y = 1.5;
  const boothRoof = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.3, 3.6), bronzeMaterial);
  boothRoof.position.y = 3.1;
  const boothWindow = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 0.1), glassDoorMat);
  boothWindow.position.set(0, 1.8, 1.51);
  boothGroup.add(boothBody, boothRoof, boothWindow);
  group.add(boothGroup);

  // Outdoor landscaping trees & planter boxes
  for (let p = -2; p <= 2; p++) {
    if (p === 0) continue;
    const planter = new THREE.Mesh(new THREE.BoxGeometry(3, 0.8, 3), concreteMaterial);
    planter.position.set(p * 14, 0.4, towerDepth / 2 + 20);
    const treeTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 4, 8), treeTrunkMat);
    treeTrunk.position.set(p * 14, 2.5, towerDepth / 2 + 20);
    const treeLeaves = new THREE.Mesh(new THREE.ConeGeometry(2.2, 4.5, 8), foliageMaterial);
    treeLeaves.position.set(p * 14, 5.5, towerDepth / 2 + 20);
    group.add(planter, treeTrunk, treeLeaves);
  }

  return group;
}
