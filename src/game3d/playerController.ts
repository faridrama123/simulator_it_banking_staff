import * as THREE from 'three';
import { ViewMode, InteractableObject } from '../types/game';
import { sounds } from '../audio/soundEffects';

export interface PlayerControlsState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
  jump: boolean;
}

export class PlayerController {
  public camera: THREE.PerspectiveCamera;
  public playerMesh: THREE.Group;
  public position: THREE.Vector3 = new THREE.Vector3(0, 0, 48); // Start in outdoor entrance plaza!
  public velocity: THREE.Vector3 = new THREE.Vector3();
  public yaw: number = 0; // horizontal angle
  public pitch: number = 0; // vertical angle
  public viewMode: ViewMode = 'first';
  public isGrounded: boolean = true;
  private footstepTimer: number = 0;

  public controlsState: PlayerControlsState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    jump: false,
  };

  // Joystick virtual values (-1 to 1)
  public joystickMove: { x: number; y: number } = { x: 0, y: 0 };

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.playerMesh = this.buildPlayerAvatar();
    this.camera.rotation.order = 'YXZ';
  }

  private buildPlayerAvatar(): THREE.Group {
    const avatar = new THREE.Group();
    avatar.name = 'player_avatar';

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xf5d0b0, roughness: 0.6 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });
    const poloMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 }); // Bank Mandiri signature royal blue polo shirt
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.7 });
    const shoesMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.28), poloMat);
    torso.position.y = 1.15;
    avatar.add(torso);

    // Mandiri ID Lanyard
    const lanyard = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.18, 0.02),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
    );
    lanyard.position.set(0, 1.15, 0.15);
    avatar.add(lanyard);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), skinMat);
    head.position.y = 1.68;
    avatar.add(head);

    // Hair
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.21, 10, 10), hairMat);
    hair.position.set(0, 1.74, -0.03);
    avatar.add(hair);

    // Legs
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.75, 0.2), pantsMat);
    legL.position.set(-0.13, 0.4, 0);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.75, 0.2), pantsMat);
    legR.position.set(0.13, 0.4, 0);
    avatar.add(legL, legR);

    // Shoes
    const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.3), shoesMat);
    shoeL.position.set(-0.13, 0.06, 0.04);
    const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.3), shoesMat);
    shoeR.position.set(0.13, 0.06, 0.04);
    avatar.add(shoeL, shoeR);

    return avatar;
  }

  public update(delta: number, currentZoneBounds: { minX: number; maxX: number; minZ: number; maxZ: number }) {
    // Determine movement direction vector based on input
    const moveX = (this.controlsState.right ? 1 : 0) - (this.controlsState.left ? 1 : 0) + this.joystickMove.x;
    const moveZ = (this.controlsState.forward ? 1 : 0) - (this.controlsState.backward ? 1 : 0) - this.joystickMove.y;

    const baseSpeed = this.controlsState.sprint ? 7.2 : 3.8;
    const inputVec = new THREE.Vector2(moveX, moveZ);
    if (inputVec.lengthSq() > 1) {
      inputVec.normalize();
    }

    if (inputVec.lengthSq() > 0.01) {
      // Rotate by player yaw
      const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
      const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

      const dir = new THREE.Vector3()
        .addScaledVector(forward, inputVec.y)
        .addScaledVector(right, inputVec.x)
        .normalize();

      this.velocity.x = dir.x * baseSpeed;
      this.velocity.z = dir.z * baseSpeed;

      // Play footstep audio rhythm
      this.footstepTimer += delta * (this.controlsState.sprint ? 1.6 : 1.0);
      if (this.footstepTimer > 0.4) {
        sounds.playFootstep();
        this.footstepTimer = 0;
      }
    } else {
      this.velocity.x = 0;
      this.velocity.z = 0;
    }

    // Apply movement
    this.position.x += this.velocity.x * delta;
    this.position.z += this.velocity.z * delta;

    // Constrain position to current zone bounding box
    this.position.x = Math.max(currentZoneBounds.minX, Math.min(currentZoneBounds.maxX, this.position.x));
    this.position.z = Math.max(currentZoneBounds.minZ, Math.min(currentZoneBounds.maxZ, this.position.z));

    // Jump handling
    if (this.controlsState.jump && this.isGrounded) {
      this.velocity.y = 4.5;
      this.isGrounded = false;
    }

    if (!this.isGrounded) {
      this.velocity.y -= 14 * delta; // Gravity
      this.position.y += this.velocity.y * delta;
      if (this.position.y <= 0) {
        this.position.y = 0;
        this.velocity.y = 0;
        this.isGrounded = true;
      }
    }

    // Update avatar mesh position & orientation
    this.playerMesh.position.copy(this.position);
    this.playerMesh.rotation.y = this.yaw;

    // Camera placement
    if (this.viewMode === 'first') {
      this.camera.position.set(this.position.x, this.position.y + 1.68, this.position.z);
      this.camera.rotation.set(this.pitch, this.yaw, 0);
      this.playerMesh.visible = false; // Hide avatar in FPV so it doesn't block view
    } else {
      // Third person view
      const camDist = 3.6;
      const camHeight = 1.9;
      const camOffsetX = Math.sin(this.yaw) * camDist;
      const camOffsetZ = Math.cos(this.yaw) * camDist;

      this.camera.position.set(
        this.position.x + camOffsetX,
        this.position.y + camHeight + Math.sin(this.pitch) * camDist * 0.4,
        this.position.z + camOffsetZ
      );
      this.camera.lookAt(this.position.x, this.position.y + 1.5, this.position.z);
      this.playerMesh.visible = true;
    }
  }

  public handleMouseMove(movementX: number, movementY: number) {
    const sensitivity = 0.0022;
    this.yaw -= movementX * sensitivity;
    this.pitch -= movementY * sensitivity;
    // Clamp pitch
    this.pitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.pitch));
  }

  public toggleViewMode(): ViewMode {
    this.viewMode = this.viewMode === 'first' ? 'third' : 'first';
    return this.viewMode;
  }

  public findNearestInteractable(interactables: InteractableObject[]): InteractableObject | null {
    let closest: InteractableObject | null = null;
    let minDistance = Infinity;

    for (const obj of interactables) {
      const dx = this.position.x - obj.position[0];
      const dz = this.position.z - obj.position[2];
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist <= obj.radius && dist < minDistance) {
        minDistance = dist;
        closest = obj;
      }
    }

    return closest;
  }
}
