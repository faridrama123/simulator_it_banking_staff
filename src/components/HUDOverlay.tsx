import React, { useState } from 'react';
import { GameZone, InteractableObject, EmployeeProfile, Quest } from '../types/game';
import { sounds } from '../audio/soundEffects';
import {
  Compass,
  CheckCircle2,
  Circle,
  Eye,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  Building,
  Sparkles,
  Smartphone,
  Flame,
  ArrowUp,
  CornerDownRight,
  User,
} from 'lucide-react';

interface Props {
  currentZone: GameZone;
  currentFloor: number;
  profile: EmployeeProfile;
  quests: Quest[];
  activePrompt: InteractableObject | null;
  onTriggerInteract: () => void;
  onToggleViewMode: () => void;
  viewMode: 'first' | 'third';
  onOpenElevator: () => void;
  onUpdateJoystick: (x: number, y: number) => void;
  onJump: () => void;
  onSprintToggle: (sprint: boolean) => void;
}

export const HUDOverlay: React.FC<Props> = ({
  currentZone,
  currentFloor,
  profile,
  quests,
  activePrompt,
  onTriggerInteract,
  onToggleViewMode,
  viewMode,
  onOpenElevator,
  onUpdateJoystick,
  onJump,
  onSprintToggle,
}) => {
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showQuests, setShowQuests] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [sprinting, setSprinting] = useState(false);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const completedQuestsCount = quests.filter((q) => q.completed).length;

  const getLocationLabel = () => {
    if (currentZone === 'outdoor') return 'Halaman Luar Gedung • Plaza Depan Menara';
    if (currentZone === 'lobby') return 'Lantai G • Grand Lobby & Face Recognition';
    if (currentZone === 'elevator') return `Di Dalam Lift • Menuju Lantai ${currentFloor === 0 ? 'G' : currentFloor}`;
    return `Lantai ${currentFloor} • Modern Open Office IT Squad`;
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-30 select-none overflow-hidden font-sans">
      {/* ============================================================ */}
      {/* TOP-LEFT MINIMAL SPEC BADGE (Clean, no occlusion) */}
      {/* ============================================================ */}
      <div className="pointer-events-auto absolute top-4 left-4 flex flex-col gap-1.5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-white shadow-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="font-bold text-xs tracking-wide">BANK IT TOWER 32</span>
          <span className="text-[10px] text-slate-400 font-mono">LIVIN' & KOPRA HQ</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 text-[11px] shadow">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-medium text-amber-300">{getLocationLabel()}</span>
        </div>
      </div>

      {/* TOP-RIGHT CONTROLS INFO & PROFILE BADGE */}
      <div className="pointer-events-auto absolute top-4 right-4 flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-white shadow-xl text-xs">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
            {profile.name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-white leading-tight">{profile.name}</div>
            <div className="text-[10px] text-cyan-400">
              {profile.checkedIn ? '● Absen Masuk OK' : '○ Belum Absen Face Recog'}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowQuests(!showQuests)}
          className="px-3 py-1.5 rounded-xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-slate-700/80 text-white shadow-xl text-xs flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold">Misi Harian: {completedQuestsCount}/{quests.length}</span>
        </button>
      </div>

      {/* DAILY QUEST POPUP PANEL */}
      {showQuests && (
        <div className="pointer-events-auto absolute top-16 right-4 w-80 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 shadow-2xl text-white text-xs z-40">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-3">
            <span className="font-bold text-sm text-white">Misi Karyawan Bank IT</span>
            <span className="text-[10px] text-amber-400 font-mono">32 Lantai Skyscraper</span>
          </div>
          <div className="space-y-2">
            {quests.map((q) => (
              <div
                key={q.id}
                className={`p-2.5 rounded-lg border transition-all flex items-start gap-2.5 ${
                  q.completed
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                }`}
              >
                {q.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <div className={`font-semibold text-xs ${q.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                    {q.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{q.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* CENTER INTERACTION RETICLE / PROMPT */}
      {/* ============================================================ */}
      {activePrompt ? (
        <div className="pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
          {/* Pulsing crosshair indicator */}
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400/80 flex items-center justify-center bg-slate-950/60 shadow-[0_0_20px_#22d3ee]">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          </div>

          <button
            onClick={onTriggerInteract}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-2xl border border-white/20 flex items-center gap-2 transform hover:scale-105 active:scale-95 transition-all"
          >
            <span>{activePrompt.prompt}</span>
          </button>
        </div>
      ) : (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/40 pointer-events-none" />
      )}

      {/* ============================================================ */}
      {/* MOBILE TOUCH VIRTUAL JOYSTICK & BUTTONS */}
      {/* ============================================================ */}
      <div className="pointer-events-auto md:hidden absolute bottom-28 left-6 w-32 h-32 rounded-full bg-slate-900/60 border border-slate-700/60 flex items-center justify-center touch-none">
        <div className="grid grid-cols-3 gap-1 p-2">
          <div />
          <button
            onPointerDown={() => onUpdateJoystick(0, 1)}
            onPointerUp={() => onUpdateJoystick(0, 0)}
            className="w-8 h-8 rounded bg-slate-800 text-white font-bold flex items-center justify-center text-xs active:bg-blue-600"
          >
            ▲
          </button>
          <div />
          <button
            onPointerDown={() => onUpdateJoystick(-1, 0)}
            onPointerUp={() => onUpdateJoystick(0, 0)}
            className="w-8 h-8 rounded bg-slate-800 text-white font-bold flex items-center justify-center text-xs active:bg-blue-600"
          >
            ◀
          </button>
          <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-mono">
            MOVE
          </div>
          <button
            onPointerDown={() => onUpdateJoystick(1, 0)}
            onPointerUp={() => onUpdateJoystick(0, 0)}
            className="w-8 h-8 rounded bg-slate-800 text-white font-bold flex items-center justify-center text-xs active:bg-blue-600"
          >
            ▶
          </button>
          <div />
          <button
            onPointerDown={() => onUpdateJoystick(0, -1)}
            onPointerUp={() => onUpdateJoystick(0, 0)}
            className="w-8 h-8 rounded bg-slate-800 text-white font-bold flex items-center justify-center text-xs active:bg-blue-600"
          >
            ▼
          </button>
          <div />
        </div>
      </div>

      <div className="pointer-events-auto md:hidden absolute bottom-28 right-6 flex flex-col gap-2.5">
        <button
          onClick={() => {
            const next = !sprinting;
            setSprinting(next);
            onSprintToggle(next);
          }}
          className={`w-12 h-12 rounded-full border flex items-center justify-center text-xs font-bold shadow-xl transition-all ${
            sprinting ? 'bg-amber-500 border-amber-400 text-slate-950' : 'bg-slate-900/80 border-slate-700 text-white'
          }`}
        >
          Lari
        </button>
        <button
          onClick={onJump}
          className="w-12 h-12 rounded-full bg-blue-600/90 border border-blue-400 text-white flex items-center justify-center text-xs font-bold shadow-xl active:bg-blue-500"
        >
          Lompat
        </button>
        {activePrompt && (
          <button
            onClick={onTriggerInteract}
            className="w-14 h-14 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center text-xs font-black shadow-2xl active:bg-emerald-500 animate-bounce"
          >
            [E] AKSI
          </button>
        )}
      </div>

      {/* ============================================================ */}
      {/* CONSOLIDATED COLLAPSIBLE BOTTOM DOCK (Per Three.js Guidelines) */}
      {/* ============================================================ */}
      <div
        className="pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 transition-transform duration-300 ease-out z-40 max-w-[95vw]"
        style={{
          transform: `translateX(-50%) translateY(${isDockCollapsed ? 'calc(100% - 32px)' : '0px'})`,
        }}
      >
        {/* Collapse / Expand Tab Button */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="px-3 py-1 rounded-t-lg bg-slate-900/90 hover:bg-slate-800 border-t border-x border-slate-700/80 text-[11px] font-medium text-slate-300 flex items-center gap-1 shadow-md transition-colors"
          >
            {isDockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{isDockCollapsed ? 'Tampilkan Kontrol & Lift' : 'Sembunyikan Dock (Cinema Mode)'}</span>
          </button>
        </div>

        {/* Main Dock Container */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl text-xs text-white">
          {/* Elevator 32 Floors Quick Jump */}
          <button
            onClick={onOpenElevator}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow transition-all"
          >
            <Building className="w-4 h-4" />
            <span>Lift 32 Lantai</span>
          </button>

          {/* View Mode Toggle */}
          <button
            onClick={onToggleViewMode}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>{viewMode === 'first' ? 'Kamera: FPV (Orang Pertama)' : 'Kamera: TPV (Orang Ketiga)'}</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title={isMuted ? 'Nyalakan Suara SFX' : 'Matikan Suara SFX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Energy Bar */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] text-slate-300">Energi:</span>
            <div className="w-16 h-2 rounded-full bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400"
                style={{ width: `${profile.energy}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-white">{profile.energy}%</span>
          </div>

          {/* Desktop Controls Hint */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 px-2 font-mono">
            <span>[WASD] Jalan</span>
            <span>•</span>
            <span>[Shift] Lari</span>
            <span>•</span>
            <span>[Space] Lompat</span>
            <span>•</span>
            <span>[E] Interaksi</span>
          </div>
        </div>
      </div>
    </div>
  );
};
