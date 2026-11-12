import React, { useState } from 'react';
import { Presentation, ChevronLeft, ChevronRight, X, Shield, Sparkles, Cpu } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const SmartBoardModal: React.FC<Props> = ({ onClose }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: "Arsitektur Cloud-Native Livin' by Mandiri SuperApp",
      subtitle: "Sprint 48 Delivery • Microfrontends & Distributed Core Banking",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-blue-950/50 rounded-xl border border-blue-500/30">
              <div className="text-xl font-black text-cyan-400 font-mono">25 Juta+</div>
              <div className="text-xs text-slate-300">Pengguna Aktif Livin'</div>
            </div>
            <div className="p-3 bg-blue-950/50 rounded-xl border border-blue-500/30">
              <div className="text-xl font-black text-emerald-400 font-mono">1.8 Miliar</div>
              <div className="text-xs text-slate-300">Transaksi per Bulan</div>
            </div>
            <div className="p-3 bg-blue-950/50 rounded-xl border border-blue-500/30">
              <div className="text-xl font-black text-amber-300 font-mono">&gt; 3,200 T</div>
              <div className="text-xs text-slate-300">Volume Nilai Transaksi</div>
            </div>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2 text-xs">
            <h5 className="font-bold text-white text-sm">Pilar Keunggulan Teknologi:</h5>
            <p className="text-slate-300">
              • <strong className="text-cyan-400">Zero-Trust Network Architecture:</strong> Mutual TLS (mTLS) di semua komunikasi antar service pod.
            </p>
            <p className="text-slate-300">
              • <strong className="text-emerald-400">Face Recognition Biometrics AI:</strong> Liveness detection dengan tingkat akurasi 99.98% untuk login instan.
            </p>
            <p className="text-slate-300">
              • <strong className="text-amber-300">Multi-Region Active-Active:</strong> Datacenter failover sub-detik tanpa transaksi terputus.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Modernisasi Core Banking & Kopra Wholesale",
      subtitle: "Integrasi Real-Time Corporate Cash Management",
      content: (
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700 space-y-3">
            <h5 className="font-bold text-sm text-white">Komponen Arsitektur Kopra:</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-amber-400">1. Kopra Trade Finance</span>
                <p className="text-slate-400 mt-1">Penerbitan Letter of Credit (LC) digital dan Bank Garansi elektronik.</p>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-cyan-400">2. Kopra Cash Management</span>
                <p className="text-slate-400 mt-1">Multi-currency payroll batch switch hingga 100,000 rekening/menit.</p>
              </div>
            </div>
          </div>
          <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-emerald-300">
            ✓ Status OJK & Bank Indonesia SNAP API Standard: Compliant 100%
          </div>
        </div>
      ),
    },
    {
      title: "Sprint Retrospective & Action Items",
      subtitle: "Target Rollout Versi 4.2.0 Minggu Ini",
      content: (
        <div className="space-y-3 text-xs">
          <div className="p-4 bg-slate-800 rounded-xl space-y-2">
            <div className="flex justify-between items-center text-slate-300 pb-2 border-b border-slate-700">
              <span>Task: Rollout QRIS Cross-Border Singapore & Malaysia</span>
              <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded">READY</span>
            </div>
            <div className="flex justify-between items-center text-slate-300 pb-2 border-b border-slate-700">
              <span>Task: Biometric Liveness AI Fallback Enhancement</span>
              <span className="text-cyan-400 font-bold bg-cyan-950 px-2 py-0.5 rounded">TESTED</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Task: Kubernetes Cluster Auto-Scaling Optimization L10</span>
              <span className="text-amber-400 font-bold bg-amber-950 px-2 py-0.5 rounded">IN REVIEW</span>
            </div>
          </div>
          <p className="text-slate-400 italic">
            "Meeting selesai, semua engineer dapat melanjutkan coding di workstation masing-masing."
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-2xl text-white overflow-hidden flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">SMART INTERACTIVE BOARD</h3>
              <p className="text-xs text-cyan-400">Ruang Meeting Sprint Room A • Lantai 14</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Body */}
        <div className="p-6 flex-1 min-h-[320px]">
          <div className="mb-4">
            <h4 className="text-lg font-bold text-white">{slides[slide].title}</h4>
            <p className="text-xs text-slate-400">{slides[slide].subtitle}</p>
          </div>
          {slides[slide].content}
        </div>

        {/* Navigation Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={() => setSlide((prev) => Math.max(0, prev - 1))}
            disabled={slide === 0}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Slide Sebelumnya
          </button>
          <span className="text-xs text-slate-400 font-mono">
            Slide {slide + 1} dari {slides.length}
          </span>
          <button
            onClick={() => setSlide((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={slide === slides.length - 1}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-xs font-semibold flex items-center gap-1.5 text-white transition-colors"
          >
            Slide Selanjutnya <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
