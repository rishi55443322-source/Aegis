import React, { useState, useEffect } from 'react';
import { Database, ShieldCheck, ShieldAlert, RefreshCw, ExternalLink, Hash, Lock } from 'lucide-react';
import { contractService } from '../services/contractService';
import { AegisLedgerState } from '../../contract/src/types';

export const LedgerExplorer: React.FC = () => {
  const [ledger, setLedger] = useState<AegisLedgerState>(contractService.getLedgerState());

  useEffect(() => {
    return contractService.subscribe(() => {
      setLedger(contractService.getLedgerState());
    });
  }, []);

  const entries = Object.entries(ledger.verifications);
  const contractAddress = import.meta.env?.VITE_CONTRACT_ADDRESS || '0x7f4a21c99fbd8e32c842b10a9901ef45b23d91ae';

  const formatShort = (addr: string) => {
    if (addr.length <= 14) return addr;
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 6)}`;
  };

  return (
    <section id="ledger-explorer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
      <div className="neo-box p-6 sm:p-8 bg-white dark:bg-neo-darkCard dark:border-neo-yellow">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b-4 border-black dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black text-neo-yellow border-3 border-black flex items-center justify-center shadow-neo-sm">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <span className="neo-badge bg-neo-yellow text-black text-[10px]">
                PUBLIC LEDGER STATE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white font-display">
                Midnight Contract Explorer
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => contractService.resetLedger()}
              className="neo-btn !bg-white !text-black text-xs py-2 px-3 flex items-center gap-1.5"
              title="Clear cached verification logs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset State</span>
            </button>
          </div>
        </div>

        {/* Contract Meta Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="border-3 border-black p-4 bg-yellow-50 dark:bg-neutral-800">
            <span className="font-mono text-xs font-bold text-neutral-500 uppercase block">Contract Address</span>
            <span className="font-mono text-xs font-black text-black dark:text-yellow-300 break-all">
              {contractAddress}
            </span>
          </div>

          <div className="border-3 border-black p-4 bg-neutral-50 dark:bg-neutral-800">
            <span className="font-mono text-xs font-bold text-neutral-500 uppercase block">Active Threshold</span>
            <span className="font-display text-xl font-black text-black dark:text-white">
              {ledger.minimumAgeThreshold}+ Years
            </span>
          </div>

          <div className="border-3 border-black p-4 bg-green-50 dark:bg-neutral-800">
            <span className="font-mono text-xs font-bold text-neutral-500 uppercase block">Total Eligible Verified</span>
            <span className="font-display text-xl font-black text-neo-green">
              {ledger.totalEligibleCount} Addresses
            </span>
          </div>
        </div>

        {/* Records Table */}
        <div className="border-3 border-black overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-black text-white uppercase text-[11px] font-black tracking-wider">
              <tr>
                <th className="p-3">Wallet Address</th>
                <th className="p-3">Result (isEligible)</th>
                <th className="p-3">Threshold</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Proof Commitment</th>
                <th className="p-3 text-right">Age Privacy</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-neutral-200 dark:divide-neutral-700 bg-white dark:bg-neutral-900">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500 font-bold">
                    No on-chain verifications recorded yet. Generate your first ZK proof above!
                  </td>
                </tr>
              ) : (
                entries.map(([addr, rec]) => (
                  <tr key={addr} className="hover:bg-yellow-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="p-3 font-bold text-black dark:text-white">
                      {formatShort(addr)}
                    </td>
                    <td className="p-3">
                      {rec.isEligible ? (
                        <span className="inline-flex items-center gap-1 font-black bg-neo-green text-black px-2 py-0.5 border border-black">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          TRUE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-black bg-neo-red text-white px-2 py-0.5 border border-black">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          FALSE
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-black dark:text-white">
                      {rec.thresholdTested}+
                    </td>
                    <td className="p-3 text-neutral-600 dark:text-neutral-400">
                      {new Date(rec.timestamp * 1000).toLocaleTimeString()}
                    </td>
                    <td className="p-3 text-neutral-500 truncate max-w-[140px]" title={rec.proofCommitment}>
                      {rec.proofCommitment}
                    </td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 bg-black text-neo-yellow text-[10px] font-black px-1.5 py-0.5 border border-black">
                        <Lock className="w-3 h-3" />
                        CONCEALED
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Audit Callout */}
        <div className="mt-4 flex items-center justify-between text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400">
          <span>* Ledger contains only zero-knowledge boolean results. Private witness variables are physically absent.</span>
          <span className="hidden md:inline">Midnight Substrate Block Hash: #104291</span>
        </div>

      </div>
    </section>
  );
};

{/* Public ledger explorer showing verified credentials without raw ages */}
