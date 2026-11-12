import React, { useState, useEffect } from 'react';
import { EmployeeProfile } from '../types/game';
import { sounds } from '../audio/soundEffects';
import { ScanFace, CheckCircle2, ShieldCheck, UserCheck, Sparkles, X } from 'lucide-react';

interface Props {
  profile: EmployeeProfile;
  onVerifySuccess: () => void;
  onClose: () => void;
}

export const FaceRecognitionModal: React.FC<Props> = ({ profile, onVerifySuccess, onClose }) => {
  const [scanStep, setScanStep] = useState<'idle' | 'scanning' | 'verifying' | 'success'>(
    profile.checkedIn ? 'success' : 'idle'
  );
  const [progress, setProgress] = useState(profile.checkedIn ? 100 : 0);

  useEffect(() => {
    if (profile.checkedIn) return;

    // Start auto scanning sequence
    setScanStep('scanning');
    sounds.playFaceScanTone();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setScanStep('verifying');
          setTimeout(() => {
            setScanStep('success');
            setProgress(100);
            sounds.playFaceScanSuccess();
            onVerifySuccess();
          }, 600);
          return 95;
        }
        return prev + 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-cyan-500/30 p-6 shadow-2xl text-white">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Terminal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <ScanFace className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">MANDIRI SECURE ACCESS</h3>
            <p className="text-xs text-cyan-400">Biometric Face Recognition AI Terminal v4.2</p>
          </div>
        </div>

        {/* Scanner Viewport */}
        <div className="relative w-full h-56 rounded-xl bg-slate-950 border-2 border-dashed border-cyan-500/50 flex flex-col items-center justify-center overflow-hidden mb-5">
          {/* Facial targeting grid */}
          <div className="relative w-36 h-44 rounded-full border-2 border-cyan-400/60 flex items-center justify-center">
            {/* Animated scan bar */}
            {scanStep !== 'success' && (
              <div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee] transition-all duration-150"
                style={{ top: `${progress}%` }}
              />
            )}

            {/* User Avatar Placeholder */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center text-white text-3xl font-black shadow-inner">
              {profile.name.charAt(0)}
            </div>

            {scanStep === 'success' && (
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 drop-shadow-md" />
              </div>
            )}
          </div>

          {/* Real-time status readout */}
          <div className="absolute bottom-2 inset-x-2 text-center text-xs font-mono">
            {scanStep === 'scanning' && (
              <span className="text-cyan-400">MENDETEKSI TITIK BIOMETRIK WAJAH... {progress}%</span>
            )}
            {scanStep === 'verifying' && (
              <span className="text-amber-400">MENCOCOKKAN BASIS DATA KARYAWAN...</span>
            )}
            {scanStep === 'success' && (
              <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" /> VERIFIKASI BERHASIL (99.98% MATCH)
              </span>
            )}
          </div>
        </div>

        {/* Employee Card Info */}
        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 space-y-2 text-sm mb-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs">Nama Karyawan:</span>
            <span className="font-semibold text-white">{profile.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs">NIP / ID:</span>
            <span className="font-mono text-cyan-400 text-xs">{profile.nip}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs">Divisi:</span>
            <span className="text-white text-xs">{profile.division}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-xs">Peran:</span>
            <span className="text-amber-300 text-xs font-medium">{profile.role}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-700">
            <span className="text-slate-400 text-xs">Status Absensi:</span>
            <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              {profile.checkedIn ? `SUDAH ABSEN (${profile.checkInTime || '08:24 WIB'})` : 'VALIDASI SELESAI'}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Akses Gerbang Dibuka - Masuk ke Lobi Lift
        </button>
      </div>
    </div>
  );
};
