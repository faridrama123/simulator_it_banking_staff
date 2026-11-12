/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { BankGameScene } from './game3d/gameScene';
import { GameZone, InteractableObject, EmployeeProfile, Quest, ViewMode } from './types/game';
import { FaceRecognitionModal } from './components/FaceRecognitionModal';
import { ElevatorSelectorModal } from './components/ElevatorSelectorModal';
import { WorkstationModal } from './components/WorkstationModal';
import { CoffeeMachineModal } from './components/CoffeeMachineModal';
import { SmartBoardModal } from './components/SmartBoardModal';
import { DialogModal } from './components/DialogModal';
import { HUDOverlay } from './components/HUDOverlay';
import { sounds } from './audio/soundEffects';

export default function App() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<BankGameScene | null>(null);

  // Game state
  const [currentZone, setCurrentZone] = useState<GameZone>('outdoor');
  const [currentFloor, setCurrentFloor] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('first');
  const [activePrompt, setActivePrompt] = useState<InteractableObject | null>(null);
  const [notification, setNotification] = useState<string | null>(
    'Selamat Datang! Dekati pintu masuk gedung Menara Mandiri 32 Lantai untuk memulai.'
  );

  // Modals state
  const [showFaceRecogModal, setShowFaceRecogModal] = useState(false);
  const [showElevatorModal, setShowElevatorModal] = useState(false);
  const [showWorkstationModal, setShowWorkstationModal] = useState(false);
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);
  const [showSmartBoardModal, setShowSmartBoardModal] = useState(false);
  const [dialogData, setDialogData] = useState<{
    npcName: string;
    role: string;
    avatarSeed: string;
    avatarBg: string;
    lines: string[];
  } | null>(null);

  // Employee Profile
  const [profile, setProfile] = useState<EmployeeProfile>({
    name: 'Farid Ramadhan',
    nip: '19842024-IT-007',
    role: 'Lead Cloud & Fullstack Engineer',
    squad: "Livin' SuperApp & Core Banking Squad",
    division: 'Digital Banking Technology',
    avatarSeed: 'farid',
    checkedIn: false,
    checkInTime: null,
    tasksCompleted: 0,
    energy: 85,
  });

  // Daily Quests
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 'q_enter',
      title: 'Masuk Gedung Menara Mandiri',
      description: 'Masuk melalui pintu putar utama menuju Lobi Lantai G',
      completed: false,
      xp: 50,
    },
    {
      id: 'q_face_recog',
      title: 'Absensi Face Recognition',
      description: 'Scan wajah di terminal biometric turnstile sebelum masuk lift',
      completed: false,
      xp: 100,
    },
    {
      id: 'q_elevator',
      title: 'Naik Lift ke Lantai 14',
      description: 'Gunakan lift berkecepatan tinggi ke Lantai 14 (Kantor IT Squad)',
      completed: false,
      xp: 100,
    },
    {
      id: 'q_coffee',
      title: 'Seduh Kopi di Ruang Pantry',
      description: 'Gunakan mesin espresso otomatis di pantry (+Energy)',
      completed: false,
      xp: 75,
    },
    {
      id: 'q_meeting',
      title: 'Cek Slide di Ruang Meeting',
      description: 'Buka Smart Presentation Board di Meeting Room Sprint A',
      completed: false,
      xp: 75,
    },
    {
      id: 'q_workstation',
      title: 'Deploy Hotfix di Workstation',
      description: 'Buka laptop Farid & eksekusi rilis produksi v4.2.0',
      completed: false,
      xp: 150,
    },
  ]);

  const markQuestDone = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId && !q.completed) {
          triggerNotification(`🎯 Misi Selesai: ${q.title}! (+${q.xp} XP)`);
          return { ...q, completed: true };
        }
        return q;
      })
    );
  };

  const triggerNotification = (text: string) => {
    setNotification(text);
    setTimeout(() => {
      setNotification((curr) => (curr === text ? null : curr));
    }, 4500);
  };

  // Mount 3D Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const game = new BankGameScene(mountRef.current, {
      onZoneChange: (zone, floor) => {
        setCurrentZone(zone);
        setCurrentFloor(floor);
      },
      onInteractPrompt: (obj) => {
        setActivePrompt(obj);
      },
      onElevatorTravelState: (traveling, targetFloor) => {
        if (traveling) {
          triggerNotification(`🛗 Lift sedang bergerak menuju Lantai ${targetFloor === 0 ? 'G' : targetFloor}...`);
        } else {
          triggerNotification(`🔔 Tiba di Lantai ${targetFloor === 0 ? 'G (Lobi Utama)' : targetFloor}`);
        }
      },
    });

    sceneRef.current = game;

    // Window resize listener
    const handleResize = () => {
      if (mountRef.current && sceneRef.current) {
        sceneRef.current.resize(mountRef.current.clientWidth, mountRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      game.destroy();
      sceneRef.current = null;
    };
  }, []);

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sceneRef.current) return;
      const ctrl = sceneRef.current.player.controlsState;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          ctrl.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          ctrl.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          ctrl.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          ctrl.right = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          ctrl.sprint = true;
          break;
        case 'Space':
          ctrl.jump = true;
          break;
        case 'KeyE':
          handleInteract();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!sceneRef.current) return;
      const ctrl = sceneRef.current.player.controlsState;

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          ctrl.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          ctrl.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          ctrl.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          ctrl.right = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          ctrl.sprint = false;
          break;
        case 'Space':
          ctrl.jump = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activePrompt, profile]);

  // Pointer lock / Mouse look
  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      // If clicking directly on canvas
      if ((e.target as HTMLElement).tagName === 'CANVAS') {
        isMouseDown = true;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement === mountEl?.querySelector('canvas')) {
        sceneRef.current?.player.handleMouseMove(e.movementX, e.movementY);
      } else if (isMouseDown && sceneRef.current) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
        sceneRef.current.player.handleMouseMove(deltaX, deltaY);
      }
    };

    const onMouseUp = () => {
      isMouseDown = false;
    };

    // Touch look on right half of screen
    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch.clientX > window.innerWidth / 2) {
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch.clientX > window.innerWidth / 2 && sceneRef.current) {
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        sceneRef.current.player.handleMouseMove(deltaX * 1.5, deltaY * 1.5);
      }
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  // Trigger Interaction Handler
  const handleInteract = () => {
    if (!activePrompt || !sceneRef.current) return;
    sounds.playClick();

    switch (activePrompt.type) {
      case 'outdoor_entrance':
        if (currentZone === 'outdoor') {
          sceneRef.current.setZone('lobby', 0);
          markQuestDone('q_enter');
          triggerNotification('Selamat datang di Lantai G Lobi Utama! Silakan lakukan absensi Face Recognition.');
        } else {
          sceneRef.current.setZone('outdoor', 0);
          triggerNotification('Anda sekarang berada di halaman luar plaza depan gedung.');
        }
        break;

      case 'security':
        setDialogData({
          npcName: 'Pak Budi',
          role: 'Komandan Keamanan Menara Mandiri',
          avatarSeed: 'budi',
          avatarBg: 'bg-blue-800',
          lines: [
            'Selamat pagi Mas Farid! Tetap semangat ya bangun sistem IT Livin & Kopra kita.',
            'Sebelum naik lift ke Lantai 14, pastikan scan wajah di gerbang turnstile otomatis dulu ya.',
            'Semoga server lancar terus hari ini tanpa ada insiden alert!',
          ],
        });
        break;

      case 'reception':
        setDialogData({
          npcName: 'Mbak Putri',
          role: 'Resepsionis Tamu & Hubungan Karyawan',
          avatarSeed: 'putri',
          avatarBg: 'bg-pink-700',
          lines: [
            'Selamat pagi Pak Farid! Kartu akses digital Anda sudah tersinkronisasi dengan sistem AI.',
            'Hari ini ada jadwal kunjungan audit OJK jam 14:00 di Lantai 20.',
            'Semoga hari kerja Anda menyenangkan!',
          ],
        });
        break;

      case 'face_recog':
        setShowFaceRecogModal(true);
        break;

      case 'elevator_door_outside':
      case 'elevator_panel':
        if (!profile.checkedIn && currentZone === 'lobby') {
          triggerNotification('⚠️ Akses Ditolak: Anda harus melakukan Absensi Face Recognition terlebih dahulu di turnstile!');
          sounds.playClick();
          return;
        }
        setShowElevatorModal(true);
        break;

      case 'workstation':
        setShowWorkstationModal(true);
        break;

      case 'colleague':
        const name = (activePrompt.data?.name as string) || 'Rekan Kerja';
        const role = (activePrompt.data?.role as string) || 'Software Engineer';
        if (name === 'Andi') {
          setDialogData({
            npcName: 'Andi',
            role: "Tech Lead Backend Livin'",
            avatarSeed: 'andi',
            avatarBg: 'bg-slate-700',
            lines: [
              'Halo Farid! Sudah cek PR hotfix QRIS cross-border yang barusan aku push?',
              'Tinggal kamu review dan trigger deployment di workstation kamu, langsung gas ke produksi!',
              'Habis ini yuk kita seduh kopi di pantry, kopinya baru di-refill biji arabika enak.',
            ],
          });
        } else {
          setDialogData({
            npcName: 'Siti',
            role: "Mobile Engineer Livin' iOS & Android",
            avatarSeed: 'siti',
            avatarBg: 'bg-cyan-700',
            lines: [
              'Pagi Farid! Tampilan baru fitur Tabungan Emas dan SBN di Livin sudah lolos uji QA L3.',
              'Kalo kamu mau presentasikan arsitekturnya, Smart Board di Meeting Room A sudah siap.',
            ],
          });
        }
        break;

      case 'meeting_board':
        setShowSmartBoardModal(true);
        markQuestDone('q_meeting');
        break;

      case 'coffee_machine':
        setShowCoffeeModal(true);
        break;

      case 'water_dispenser':
        sounds.playWaterFlow();
        setProfile((p) => ({ ...p, energy: Math.min(100, p.energy + 10) }));
        triggerNotification('💧 Mengisi tumbler dengan air mineral segar (+10 Energy)');
        break;

      case 'sink_male':
      case 'sink_female':
        const running = sceneRef.current.toggleSinkWater();
        if (running) {
          triggerNotification('🚰 Menyalakan wastafel otomatis & mencuci tangan dengan sabun.');
        } else {
          triggerNotification('Wastafel dimatikan.');
        }
        break;
    }
  };

  const handleFaceVerifySuccess = () => {
    setProfile((p) => ({
      ...p,
      checkedIn: true,
      checkInTime: '08:24 WIB',
    }));
    sceneRef.current?.triggerFaceRecognitionSuccess();
    markQuestDone('q_face_recog');
    triggerNotification('✅ Absensi Face Recognition Berhasil! Gerbang turnstile dibuka.');
  };

  const handleSelectFloor = (targetFloor: number) => {
    sceneRef.current?.travelToFloor(targetFloor);
    if (targetFloor === 14) {
      markQuestDone('q_elevator');
    }
  };

  const handleTaskComplete = () => {
    setProfile((p) => ({
      ...p,
      tasksCompleted: p.tasksCompleted + 1,
      energy: Math.max(20, p.energy - 10),
    }));
    markQuestDone('q_workstation');
    triggerNotification('🚀 Rilis Livin v4.2.0 Sukses Dideploy ke Produksi!');
  };

  const handleCoffeeSuccess = (drink: string) => {
    setProfile((p) => ({
      ...p,
      energy: Math.min(100, p.energy + 25),
    }));
    markQuestDone('q_coffee');
    triggerNotification(`☕ Menikmati secangkir ${drink}! Energi terisi penuh.`);
  };

  const handleToggleViewMode = () => {
    if (sceneRef.current) {
      const mode = sceneRef.current.player.toggleViewMode();
      setViewMode(mode);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* Isolated Three.js Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 z-0 cursor-crosshair" />

      {/* Floating System Notification Toast */}
      {notification && (
        <div className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 text-cyan-300 font-semibold text-xs shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          {notification}
        </div>
      )}

      {/* In-Game HUD & Consolidated Collapsible Bottom Dock */}
      <HUDOverlay
        currentZone={currentZone}
        currentFloor={currentFloor}
        profile={profile}
        quests={quests}
        activePrompt={activePrompt}
        onTriggerInteract={handleInteract}
        onToggleViewMode={handleToggleViewMode}
        viewMode={viewMode}
        onOpenElevator={() => setShowElevatorModal(true)}
        onUpdateJoystick={(x, y) => {
          if (sceneRef.current) {
            sceneRef.current.player.joystickMove = { x, y };
          }
        }}
        onJump={() => {
          if (sceneRef.current) {
            sceneRef.current.player.controlsState.jump = true;
            setTimeout(() => {
              if (sceneRef.current) sceneRef.current.player.controlsState.jump = false;
            }, 100);
          }
        }}
        onSprintToggle={(sprint) => {
          if (sceneRef.current) {
            sceneRef.current.player.controlsState.sprint = sprint;
          }
        }}
      />

      {/* Modals */}
      {showFaceRecogModal && (
        <FaceRecognitionModal
          profile={profile}
          onVerifySuccess={handleFaceVerifySuccess}
          onClose={() => setShowFaceRecogModal(false)}
        />
      )}

      {showElevatorModal && (
        <ElevatorSelectorModal
          currentFloor={currentFloor}
          onSelectFloor={handleSelectFloor}
          onClose={() => setShowElevatorModal(false)}
        />
      )}

      {showWorkstationModal && (
        <WorkstationModal
          onTaskComplete={handleTaskComplete}
          onClose={() => setShowWorkstationModal(false)}
        />
      )}

      {showCoffeeModal && (
        <CoffeeMachineModal
          onBrewSuccess={handleCoffeeSuccess}
          onClose={() => setShowCoffeeModal(false)}
        />
      )}

      {showSmartBoardModal && (
        <SmartBoardModal onClose={() => setShowSmartBoardModal(false)} />
      )}

      {dialogData && (
        <DialogModal data={dialogData} onClose={() => setDialogData(null)} />
      )}
    </div>
  );
}
