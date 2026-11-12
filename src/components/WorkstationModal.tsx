import React, { useState } from 'react';
import { sounds } from '../audio/soundEffects';
import { Laptop, Terminal, Server, CheckCircle2, Play, GitBranch, RefreshCw, X, Shield, Sparkles } from 'lucide-react';

interface Props {
  onTaskComplete: () => void;
  onClose: () => void;
}

export const WorkstationModal: React.FC<Props> = ({ onTaskComplete, onClose }) => {
  const [activeTab, setActiveTab] = useState<'monitor' | 'deploy' | 'code'>('monitor');
  const [deploying, setDeploying] = useState(false);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [deployed, setDeployed] = useState(false);

  const startDeployment = () => {
    if (deploying || deployed) return;
    setDeploying(true);
    setDeployLogs(['[08:42:10] Inisialisasi Git release tag v4.2.0-prod...']);
    sounds.playKeyboardType();

    const steps = [
      '[08:42:11] Menjalankan automated unit & integration tests (1,482 tests passed)...',
      '[08:42:12] Membangun Docker container image: mandiri/livin-payment-gateway:v4.2.0...',
      '[08:42:13] Mengirim image ke Enterprise Harbor Registry...',
      '[08:42:14] Kubectl rollout restart deployment/livin-payment-gw -n production...',
      '[08:42:15] Menghubungkan 12 Pods baru, healthcheck 200 OK...',
      '[08:42:16] Mengalihkan lalu lintas transaksi (Traffic switch 100%)...',
      '[08:42:17] SELESAI: Rilis Livin v4.2.0 Sukses Berjalan Tanpa Downtime! 🎉',
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setDeployLogs((prev) => [...prev, step]);
        sounds.playKeyboardType();
        if (idx === steps.length - 1) {
          setDeploying(false);
          setDeployed(true);
          sounds.playFaceScanSuccess();
          onTaskComplete();
        }
      }, (idx + 1) * 800);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-blue-500/30 shadow-2xl text-white overflow-hidden flex flex-col max-h-[88vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">FARID WORKSTATION - BANK IT TERMINAL</h3>
              <p className="text-xs text-blue-400 font-mono">Host: mandiri-livin-dev-14 • IP: 10.14.88.24</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-900/90 border-b border-slate-800 px-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('monitor')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'monitor'
                ? 'border-blue-500 text-blue-400 font-bold bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" /> Status Microservices Bank
          </button>
          <button
            onClick={() => setActiveTab('deploy')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'deploy'
                ? 'border-blue-500 text-blue-400 font-bold bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-4 h-4" /> CI/CD Deployment Release
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'code'
                ? 'border-blue-500 text-blue-400 font-bold bg-blue-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" /> Source Code (Livin Core API)
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'monitor' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Livin' Transaction TPS</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-2xl font-black font-mono text-white mt-1">42,850</div>
                  <p className="text-[11px] text-emerald-400 mt-1">▲ 14% dari jam puncak kemarin</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>P99 API Latency</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-2xl font-black font-mono text-cyan-400 mt-1">12.4 ms</div>
                  <p className="text-[11px] text-slate-400 mt-1">Target SLA: &lt; 50 ms</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Uptime Bulanan</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="text-2xl font-black font-mono text-amber-300 mt-1">99.998%</div>
                  <p className="text-[11px] text-slate-400 mt-1">High Availability Cluster L10-L14</p>
                </div>
              </div>

              {/* Service list */}
              <div className="space-y-2 mt-2">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Kesehatan Microservices (Cluster Produksi)
                </h4>
                {[
                  { name: 'livin-qris-switch', pods: '18/18 Running', cpu: '28%', status: 'HEALTHY' },
                  { name: 'biometric-face-recognition', pods: '12/12 Running', cpu: '42%', status: 'HEALTHY' },
                  { name: 'core-banking-ledger-sync', pods: '24/24 Running', cpu: '35%', status: 'HEALTHY' },
                  { name: 'kopra-open-api-gateway', pods: '8/8 Running', cpu: '19%', status: 'HEALTHY' },
                  { name: 'cardless-atm-withdrawal', pods: '6/6 Running', cpu: '15%', status: 'HEALTHY' },
                ].map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-white font-medium">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                      <span>{s.pods}</span>
                      <span>CPU: {s.cpu}</span>
                      <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {s.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'deploy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Rilis Sprint 48: Hotfix QRIS Cross-Border</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Branch: <span className="font-mono text-cyan-400">release/v4.2.0-patch</span> • Target: Produksi L14
                  </p>
                </div>
                <button
                  onClick={startDeployment}
                  disabled={deploying || deployed}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all ${
                    deployed
                      ? 'bg-emerald-600 text-white cursor-default'
                      : deploying
                      ? 'bg-amber-600 text-white cursor-wait animate-pulse'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {deployed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" /> Rilis Selesai
                    </>
                  ) : deploying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Sedang Deploy...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Mulai Rollout Produksi
                    </>
                  )}
                </button>
              </div>

              {/* Terminal Logs */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 min-h-[220px] max-h-[260px] overflow-y-auto space-y-1.5">
                <div className="text-slate-500">// Terminal Build & Kubectl Rollout Logs</div>
                {deployLogs.length === 0 ? (
                  <p className="text-slate-500 italic">Tekan 'Mulai Rollout Produksi' untuk mengeksekusi pipeline...</p>
                ) : (
                  deployLogs.map((log, i) => (
                    <div
                      key={i}
                      className={
                        log.includes('SELESAI')
                          ? 'text-emerald-400 font-bold'
                          : log.includes('passed')
                          ? 'text-cyan-400'
                          : 'text-slate-300'
                      }
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs overflow-x-auto text-slate-300 leading-relaxed">
              <div className="text-slate-500">// LivinPaymentProcessor.ts - Bank Mandiri Digital IT</div>
              <p>
                <span className="text-purple-400">import</span> &#123; QRISEngine, LedgerService &#125;{' '}
                <span className="text-purple-400">from</span>{' '}
                <span className="text-emerald-300">'@mandiri/core-banking'</span>;
              </p>
              <p>
                <span className="text-purple-400">import</span> &#123; BiometricAuth &#125;{' '}
                <span className="text-purple-400">from</span>{' '}
                <span className="text-emerald-300">'@mandiri/security-ai'</span>;
              </p>
              <br />
              <p>
                <span className="text-blue-400">export async function</span>{' '}
                <span className="text-yellow-300">executeFastCheckout</span>(payload:{' '}
                <span className="text-cyan-300">PaymentRequest</span>) &#123;
              </p>
              <p className="pl-4">
                <span className="text-blue-400">const</span> isVerified ={' '}
                <span className="text-blue-400">await</span> BiometricAuth.verifyLiveness(payload.faceToken);
              </p>
              <p className="pl-4">
                <span className="text-purple-400">if</span> (!isVerified) &#123;
              </p>
              <p className="pl-8 text-rose-400">
                throw new SecurityException('Biometrik tidak valid atau kadaluarsa');
              </p>
              <p className="pl-4">&#125;</p>
              <br />
              <p className="pl-4">
                <span className="text-slate-500">// Direct debit from primary savings account</span>
              </p>
              <p className="pl-4">
                <span className="text-blue-400">const</span> receipt ={' '}
                <span className="text-blue-400">await</span> LedgerService.transferDirect(&#123;
              </p>
              <p className="pl-8">sourceAccount: payload.accountNumber,</p>
              <p className="pl-8">amount: payload.amount,</p>
              <p className="pl-8">merchant: payload.merchantCode,</p>
              <p className="pl-8">timestamp: Date.now()</p>
              <p className="pl-4">&#125;);</p>
              <p className="pl-4 text-cyan-300">return &#123; success: true, refNumber: receipt.ref &#125;;</p>
              <p>&#125;</p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 px-5">
          <span>Karyawan IT: Farid Ramadhan (Lead Cloud Engineer)</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Jaringan Internal Mandiri Terenkripsi
          </span>
        </div>
      </div>
    </div>
  );
};
