import React from 'react';
import { UserCheck, ShieldCheck, MessageSquare, X, ChevronRight } from 'lucide-react';

interface DialogData {
  npcName: string;
  role: string;
  avatarSeed: string;
  avatarBg: string;
  lines: string[];
}

interface Props {
  data: DialogData;
  onClose: () => void;
}

export const DialogModal: React.FC<Props> = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl text-white p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* NPC Profile Header */}
        <div className="flex items-center gap-3.5 border-b border-slate-800 pb-4 mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md ${data.avatarBg}`}
          >
            {data.npcName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-base text-white">{data.npcName}</h3>
            <p className="text-xs text-blue-400 font-medium">{data.role}</p>
          </div>
        </div>

        {/* Speech Bubbles */}
        <div className="space-y-3 mb-5">
          {data.lines.map((line, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-850 bg-slate-800/80 border border-slate-700/70 text-sm text-slate-200 leading-relaxed flex gap-2.5"
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0 text-cyan-400 mt-0.5" />
              <span>{line}</span>
            </div>
          ))}
        </div>

        {/* Close / Acknowledge */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          Lanjutkan Aktivitas <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
