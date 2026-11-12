import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GameZone, InteractableObject } from '../types/game';
import { createTowerBuilding } from './models/towerBuilding';
import { createLobbyFloor, LobbyModels } from './models/lobbyFloor';
import { createOfficeFloor, OfficeFloorResult } from './models/officeFloor';
import { createElevatorCabin, ElevatorCabinResult } from './models/elevatorCabin';
import { PlayerController } from './playerController';
import { FLOORS_DATA } from '../data/floors';
import { sounds } from '../audio/soundEffects';

export interface SceneCallbacks {
  onZoneChange: (zone: GameZone, floor: number) => void;
  onInteractPrompt: (obj: InteractableObject | null) => void;
  onElevatorTravelState: (traveling: boolean, targetFloor: number) => void;
}

export class BankGameScene {
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public player: PlayerController;
  public currentZone: GameZone = 'outdoor';
  public currentFloor: number = 0; // 0 = G
  public isSoftwareGl: boolean = false;

  private towerModel: THREE.Group | null = null;
  private lobbyModel: LobbyModels | null = null;
  private officeModel: OfficeFloorResult | null = null;
  private elevatorCabin: ElevatorCabinResult | null = null;

  private interactables: InteractableObject[] = [];
  private callbacks: SceneCallbacks;

  private clock: THREE.Clock = new THREE.Clock();
  private animFrameId: number = 0;
  private isDestroyed: boolean = false;

  // Elevator travel state
  public isElevatorMoving: boolean = false;
  private elevatorTargetFloor: number = 14;
  private elevatorTimer: number = 0;

  constructor(container: HTMLElement, callbacks: SceneCallbacks) {
    this.callbacks = callbacks;

    // Detect software WebGL from GPU renderer info (per Three.js skill)
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 500);

    // 2. Renderer configuration
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // 3. Procedural Studio Environment Reflection (RoomEnvironment)
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    // 4. Lighting Rig
    this.setupLighting();

    // 5. Player Controller
    this.player = new PlayerController(this.camera);
    this.scene.add(this.player.playerMesh);

    // 6. Build Models
    this.buildWorld();

    // 7. Start in outdoor plaza
    this.setZone('outdoor', 0);

    // 8. Start Loop
    this.startLoop();
  }

  private setupLighting() {
    // Sky/Ground contrast hemisphere light
    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x334155, 0.7);
    this.scene.add(hemiLight);

    // Warm Sun / Key directional light
    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.2);
    dirLight.position.set(30, 80, 50);
    dirLight.castShadow = !this.isSoftwareGl;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 180;
    const d = 50;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    this.scene.add(dirLight);

    // Ambient fill
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    this.scene.add(ambient);
  }

  private buildWorld() {
    // Tower Exterior
    this.towerModel = createTowerBuilding();
    this.scene.add(this.towerModel);

    // Lobby Floor
    this.lobbyModel = createLobbyFloor();
    this.lobbyModel.group.position.set(0, 0, 0);
    this.scene.add(this.lobbyModel.group);

    // Office Floor (Default starting configured to Floor 14 IT Squad)
    this.rebuildOfficeFloor(14);

    // Elevator Cabin
    this.elevatorCabin = createElevatorCabin();
    this.elevatorCabin.group.position.set(0, 0, 100); // Placed in isolated coordinates
    this.scene.add(this.elevatorCabin.group);
  }

  public rebuildOfficeFloor(floorNum: number) {
    if (this.officeModel) {
      this.scene.remove(this.officeModel.group);
    }
    const floorMeta = FLOORS_DATA.find((f) => f.floor === floorNum) || FLOORS_DATA[14];
    this.officeModel = createOfficeFloor(floorNum, floorMeta.name);
    this.officeModel.group.position.set(0, 50, 0); // Positioned on upper tier
    this.scene.add(this.officeModel.group);
  }

  public setZone(zone: GameZone, floor: number = 0) {
    this.currentZone = zone;
    this.currentFloor = floor;

    // Adjust visibility of sub-models for performance
    if (this.towerModel) this.towerModel.visible = zone === 'outdoor';
    if (this.lobbyModel) this.lobbyModel.group.visible = zone === 'lobby';
    if (this.officeModel) this.officeModel.group.visible = zone === 'office';
    if (this.elevatorCabin) this.elevatorCabin.group.visible = zone === 'elevator';

    // Sky/fog setting
    if (zone === 'outdoor') {
      this.scene.background = new THREE.Color(0x93c5fd); // Light blue Jakarta sky
      this.scene.fog = new THREE.Fog(0x93c5fd, 40, 160);
      this.player.position.set(0, 0, 48); // Walkway facing tower entrance
      this.player.yaw = 0;
      this.player.pitch = 0.1;
    } else if (zone === 'lobby') {
      this.scene.background = new THREE.Color(0x0f172a);
      this.scene.fog = null;
      this.player.position.set(0, 0, 14); // Near front lobby entrance doors
      this.player.yaw = Math.PI; // Looking toward reception & face recog
      this.player.pitch = 0;
    } else if (zone === 'elevator') {
      this.scene.background = new THREE.Color(0x0a0f1d);
      this.scene.fog = null;
      this.player.position.set(0, 0, 100.8); // Inside elevator cabin
      this.player.yaw = 0;
    } else if (zone === 'office') {
      this.scene.background = new THREE.Color(0x60a5fa); // High altitude sky through windows
      this.scene.fog = null;
      this.player.position.set(-4, 50, 14); // Coming out of elevator foyer into open office
      this.player.yaw = 0;
    }

    this.rebuildInteractables();
    this.callbacks.onZoneChange(zone, floor);
  }

  private rebuildInteractables() {
    this.interactables = [];

    if (this.currentZone === 'outdoor') {
      this.interactables.push({
        id: 'tower_entrance',
        type: 'outdoor_entrance',
        title: 'Pintu Masuk Utama Menara Mandiri',
        prompt: '[E] Masuk ke Lobi Lantai G',
        position: [0, 0, 24],
        radius: 4.5,
      });
      this.interactables.push({
        id: 'outdoor_security_booth',
        type: 'security',
        title: 'Pos Keamanan Luar Gedung',
        prompt: '[E] Sapa Petugas Keamanan',
        position: [-16, 0, 42],
        radius: 4.0,
      });
    } else if (this.currentZone === 'lobby') {
      this.interactables.push({
        id: 'lobby_exit',
        type: 'outdoor_entrance',
        title: 'Pintu Keluar Menuju Plaza',
        prompt: '[E] Keluar ke Halaman Luar Gedung',
        position: [0, 0, 16],
        radius: 3.5,
      });
      this.interactables.push({
        id: 'lobby_security',
        type: 'security',
        title: 'Pak Budi - Komandan Keamanan Lobi',
        prompt: '[E] Tanya Prosedur Masuk',
        position: [10, 0, 7],
        radius: 3.5,
      });
      this.interactables.push({
        id: 'lobby_reception',
        type: 'reception',
        title: 'Mbak Putri - Resepsionis Tamu & Karyawan',
        prompt: '[E] Kunjungi Meja Resepsionis',
        position: [-8, 0, 5],
        radius: 4.0,
      });
      // Face Recognition Terminal Turnstiles
      this.interactables.push({
        id: 'face_recognition_gate',
        type: 'face_recog',
        title: 'Sistem Absensi Biometrik Face Recognition',
        prompt: '[E] Scan Wajah Absensi Masuk',
        position: [0, 0, -1],
        radius: 3.2,
      });
      // Elevator door in lobby
      this.interactables.push({
        id: 'lobby_elevator_door',
        type: 'elevator_door_outside',
        title: 'Lobi Lift Penumpang (Lantai 1 - 32)',
        prompt: '[E] Naikkan Lift 32 Lantai',
        position: [0, 0, -14],
        radius: 4.0,
      });
    } else if (this.currentZone === 'elevator') {
      this.interactables.push({
        id: 'elevator_panel_inside',
        type: 'elevator_panel',
        title: 'Panel Kontrol Lift (Pilih Lantai G - 32)',
        prompt: '[E] Pilih Lantai Tujuan',
        position: [1.8, 0, 100.8],
        radius: 3.5,
      });
      this.interactables.push({
        id: 'elevator_exit_door',
        type: 'elevator_door_outside',
        title: 'Pintu Keluar Lift',
        prompt: '[E] Keluar dari Lift ke Lantai Kantor',
        position: [0, 0, 101.6],
        radius: 3.0,
      });
    } else if (this.currentZone === 'office') {
      // Workstation
      this.interactables.push({
        id: 'player_workstation',
        type: 'workstation',
        title: "Workstation Farid - Lead Cloud / Fullstack Engineer",
        prompt: '[E] Buka Laptop & IT Dashboard Perbankan',
        position: [-8, 50, -0.4],
        radius: 2.8,
      });
      // Colleague Andi
      this.interactables.push({
        id: 'colleague_andi',
        type: 'colleague',
        title: "Andi - Tech Lead Backend Livin'",
        prompt: '[E] Diskusi Arsitektur API',
        position: [-2, 50, -2.4],
        radius: 3.0,
        data: { name: 'Andi', role: 'Tech Lead Backend' },
      });
      // Colleague Siti
      this.interactables.push({
        id: 'colleague_siti',
        type: 'colleague',
        title: "Siti - Mobile Engineer Livin'",
        prompt: '[E] Tanya Progres Bug Transaksi',
        position: [-1, 50, -2.2],
        radius: 3.0,
        data: { name: 'Siti', role: 'Mobile iOS/Android Engineer' },
      });
      // Meeting room smart board
      this.interactables.push({
        id: 'meeting_smart_board',
        type: 'meeting_board',
        title: "Smart Presentation Board - Sprint Room A",
        prompt: '[E] Buka Slide Arsitektur IT Livin',
        position: [18, 50, -6],
        radius: 4.0,
      });
      // Pantry coffee machine
      this.interactables.push({
        id: 'pantry_coffee_machine',
        type: 'coffee_machine',
        title: 'Mesin Espresso Kopi Karyawan Bank IT',
        prompt: '[E] Seduh Kopi Segar (+Energy)',
        position: [-14.4, 50, -11],
        radius: 3.0,
      });
      // Pantry water dispenser
      this.interactables.push({
        id: 'pantry_water_dispenser',
        type: 'water_dispenser',
        title: 'Dispenser Air Minum Sehat',
        prompt: '[E] Isi Botol Minum Tumbler',
        position: [-11.6, 50, -11],
        radius: 2.8,
      });
      // Restroom sink
      this.interactables.push({
        id: 'restroom_sink_faucet',
        type: 'sink_male',
        title: 'Wastafel Cuci Tangan Sensor Otomatis',
        prompt: '[E] Cuci Tangan dengan Air Bersih',
        position: [12, 50, 10],
        radius: 3.0,
      });
      // Office Elevator to change floor or leave
      this.interactables.push({
        id: 'office_elevator_call',
        type: 'elevator_door_outside',
        title: 'Lobi Lift Lantai Ini (Menuju Lantai Lain / Lobi G)',
        prompt: '[E] Panggil Lift 32 Lantai',
        position: [-4, 50, 16],
        radius: 4.0,
      });
    }
  }

  public triggerFaceRecognitionSuccess() {
    if (this.lobbyModel) {
      sounds.playFaceScanSuccess();
      sounds.playGateSlide();
      this.lobbyModel.openTurnstiles();
    }
  }

  public travelToFloor(targetFloor: number) {
    this.isElevatorMoving = true;
    this.elevatorTargetFloor = targetFloor;
    this.elevatorTimer = 0;

    // Switch to elevator cabin zone
    this.setZone('elevator', targetFloor);
    if (this.elevatorCabin) {
      this.elevatorCabin.closeDoors();
      this.elevatorCabin.updateFloorDisplay(targetFloor, targetFloor > this.currentFloor ? 'up' : 'down');
    }

    sounds.playElevatorDing();
    this.callbacks.onElevatorTravelState(true, targetFloor);

    // Elevator travel duration
    setTimeout(() => {
      this.isElevatorMoving = false;
      if (this.elevatorCabin) {
        this.elevatorCabin.updateFloorDisplay(targetFloor, 'idle');
        this.elevatorCabin.openDoors();
      }
      sounds.playElevatorDing();
      this.callbacks.onElevatorTravelState(false, targetFloor);

      // Once arrived, automatically transfer to the floor if target > 0 or G
      setTimeout(() => {
        if (targetFloor === 0) {
          this.setZone('lobby', 0);
          this.player.position.set(0, 0, -10);
        } else {
          this.rebuildOfficeFloor(targetFloor);
          this.setZone('office', targetFloor);
        }
      }, 1000);
    }, 2400);
  }

  public toggleSinkWater(): boolean {
    if (!this.officeModel) return false;
    const s = this.officeModel.waterFaucetState;
    s.running = !s.running;
    if (s.mesh) s.mesh.visible = s.running;
    if (s.running) sounds.playWaterFlow();
    return s.running;
  }

  private startLoop() {
    const tick = () => {
      if (this.isDestroyed) return;

      const delta = Math.min(this.clock.getDelta(), 0.1);

      // Zone bounds
      let bounds = { minX: -50, maxX: 50, minZ: -50, maxZ: 70 };
      if (this.currentZone === 'outdoor') {
        bounds = { minX: -40, maxX: 40, minZ: 20, maxZ: 65 };
      } else if (this.currentZone === 'lobby') {
        bounds = { minX: -15, maxX: 15, minZ: -15, maxZ: 15 };
      } else if (this.currentZone === 'elevator') {
        bounds = { minX: -1.6, maxX: 1.6, minZ: 99.2, maxZ: 101.4 };
      } else if (this.currentZone === 'office') {
        bounds = { minX: -20, maxX: 20, minZ: -17, maxZ: 17 };
      }

      this.player.update(delta, bounds);

      // Check proximity to interactables
      const nearest = this.player.findNearestInteractable(this.interactables);
      this.callbacks.onInteractPrompt(nearest);

      this.renderer.render(this.scene, this.camera);

      this.animFrameId = requestAnimationFrame(tick);
    };

    this.animFrameId = requestAnimationFrame(tick);
  }

  public resize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public destroy() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.animFrameId);
    this.renderer.dispose();
  }
}
