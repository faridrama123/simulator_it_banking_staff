import React, { useState } from 'react';
import { sounds } from '../audio/soundEffects';
import { Coffee, Flame, CheckCircle2, X, Sparkles } from 'lucide-react';

interface Props {
  onBrewSuccess: (drinkName: string) => void;
  onClose: () => void;
}

export const CoffeeMachineModal: React.FC<Props> = ({ onBrewSuccess, onClose }) => {
  const [selectedDrink, setSelectedDrink] = useState<string>('Kopi Susu Gula Aren');
  const [brewing, setBrewing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [done, setDone] = useState<boolean>(false);

  const drinks = [
    { id: 'aren', name: 'Kopi Susu Gula Aren', desc: 'Favorit anak IT sprint deadline (+25 Energy)' },
    { id: 'espresso', name: 'Double Espresso Roast', desc: 'Konsentrasi ekstra untuk bug hunting (+30 Energy)' },
    { id: 'cappuccino', name: 'Creamy Cappuccino', desc: 'Foam susu tebal untuk santai pagi (+20 Energy)' },
    { id: 'americano', name: 'Iced Americano', desc: 'Kopi hitam dingin segar (+25 Energy)' },
  ];

  const startBrew = () => {
    if (brewing || done) return;
    setBrewing(true);
    setProgress(0);
    sounds.playCoffeeBrew();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setBrewing(false);
          setDone(true);
          sounds.playElevatorDing();
          onBrewSuccess(selectedDrink);
          return 100;
        }
        return prev + 12;
      });
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-emerald-500/30 shadow-2xl text-white p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">PANTRY BARISTA ESPRESSO</h3>
            <p className="text-xs text-emerald-400">Mesin Kopi Otomatis Lantai IT</p>
          </div>
        </div>

        {/* Drink selection */}
        <div className="space-y-2 mb-5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Pilih Minuman Kopi:
          </label>
          <div className="grid grid-cols-1 gap-2">
            {drinks.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  if (!brewing) setSelectedDrink(d.name);
                }}
                disabled={brewing}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  selectedDrink === d.name
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div>
                  <div className="font-semibold text-sm text-white">{d.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{d.desc}</div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedDrink === d.name ? 'border-emerald-400 bg-emerald-400' : 'border-slate-500'
                  }`}
                >
                  {selectedDrink === d.name && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Brewing Progress */}
        {brewing && (
          <div className="mb-5 space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="text-amber-400 font-medium flex items-center gap-1.5 animate-pulse">
                <Flame className="w-4 h-4" /> Sedang Mengekstrak Espresso & Steam Susu...
              </span>
              <span className="font-mono text-white">{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {done && (
          <div className="mb-5 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 flex-shrink-0 text-emerald-400" />
            <div>
              <p className="font-bold text-sm text-white">Kopi Siap Dinikmati!</p>
              <p className="text-slate-300">Energy bertambah! Siap coding dan meeting sprint hari ini.</p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={done ? onClose : startBrew}
          disabled={brewing}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          {done ? (
            'Ambil Gelas Kopi & Tutup'
          ) : brewing ? (
            'Mengekstrak Biji Kopi...'
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Mulai Seduh {selectedDrink}
            </>
          )}
        </button>
      </div>
    </div>
  );
};
