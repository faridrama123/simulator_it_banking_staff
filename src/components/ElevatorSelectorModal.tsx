import React, { useState } from 'react';
import { FLOORS_DATA } from '../data/floors';
import { FloorInfo } from '../types/game';
import { Building2, ArrowUpRight, X, Sparkles, Shield, Cpu, Coffee } from 'lucide-react';

interface Props {
  currentFloor: number;
  onSelectFloor: (floor: number) => void;
  onClose: () => void;
}

export const ElevatorSelectorModal: React.FC<Props> = ({ currentFloor, onSelectFloor, onClose }) => {
  const [filter, setFilter] = useState<'all' | 'key' | 'tech'>('key');

  const filteredFloors = FLOORS_DATA.filter((floor) => {
    if (filter === 'key') {
      return [0, 1, 7, 14, 21, 28, 32].includes(floor.floor);
    }
    if (filter === 'tech') {
      return [2, 3, 6, 7, 8, 9, 10, 11, 14, 21].includes(floor.floor);
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-amber-500/30 shadow-2xl text-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">ELEVATOR KONTROL - 32 LANTAI</h3>
              <p className="text-xs text-amber-400">Menara Bank Mandiri • Livin' & Kopra Tower</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Floor Indicator */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-5 py-3 flex items-center justify-between">
          <span className="text-xs text-amber-300 font-medium">Posisi Lift Sekarang:</span>
          <span className="font-mono text-sm font-bold text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30">
            {currentFloor === 0 ? 'LANTAI G (LOBI UTAMA)' : `LANTAI ${currentFloor}`}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 p-4 bg-slate-900/60 border-b border-slate-800 text-xs">
          <button
            onClick={() => setFilter('key')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === 'key' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            ⭐ Lantai Utama & Rekomendasi
          </button>
          <button
            onClick={() => setFilter('tech')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === 'tech' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            💻 IT & Software Engineering
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              filter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            🏢 Semua 32 Lantai
          </button>
        </div>

        {/* Floor Grid / List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-[50vh]">
          {filteredFloors.map((f: FloorInfo) => {
            const isCurrent = f.floor === currentFloor;
            return (
              <button
                key={f.floor}
                onClick={() => {
                  onSelectFloor(f.floor);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 cursor-default'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 hover:border-amber-400/60 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-10 rounded-lg flex items-center justify-center font-black font-mono text-base ${
                      f.floor === 14
                        ? 'bg-blue-600 text-white shadow-md'
                        : f.floor === 32
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {f.label}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white group-hover:text-amber-300 transition-colors">
                        {f.name}
                      </span>
                      {f.floor === 14 && (
                        <span className="text-[10px] bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full font-bold">
                          KANTOR UTAMA (FOTO 3)
                        </span>
                      )}
                      {f.floor === 32 && (
                        <span className="text-[10px] bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                          SKY PENTHOUSE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{f.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-3">
                  {isCurrent ? (
                    <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950 px-2.5 py-1 rounded-md">
                      DI SINI
                    </span>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-700 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center text-slate-400 transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-between items-center text-xs text-slate-400">
          <span>Gedung 32 Lantai • Dilengkapi 4 Lift Cepat</span>
          <button
            onClick={() => {
              onSelectFloor(14);
              onClose();
            }}
            className="text-amber-400 hover:underline font-medium"
          >
            Langsung ke Lantai 14 (Open Office Utama) →
          </button>
        </div>
      </div>
    </div>
  );
};
