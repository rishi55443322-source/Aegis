import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ShieldCheck, ShieldAlert, AlertTriangle, ArrowLeft, ExternalLink, Lock, Check, Clock } from 'lucide-react';
import { VerificationRecord } from '../../contract/src/types';

interface EligibilityCardProps {
  record: VerificationRecord | null;
  error?: string | null;
  onReset: () => void;
  userAddress: string;
}

export const EligibilityCard: React.FC<EligibilityCardProps> = ({
  record,
  error,
  onReset,
  userAddress,
}) => {
  useEffect(() => {
    if (record?.isEligible) {
      // Fire confetti celebration on eligible verification
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFE600', '#000000', '#00D664', '#2563EB'],
        });
      } catch {
        // confetti fallback
      }
    }
  }, [record]);

  // Error State
  if (error) {
    return (
      <div className="neo-box p-6 sm:p-8 bg-neo-red text-white border-4 border-black shadow-neo-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white text-neo-red border-3 border-black flex items-center justify-center shadow-neo-sm">
            <AlertTriangle className="w-7 h-7 stroke-[3]" />
          </div>
          <div>
            <span className="neo-badge bg-black text-white text-xs">TRANSACTION HALTED</span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display">
              Verification Failed
            </h3>
          </div>
        </div>

        <div className="bg-white text-black p-4 border-3 border-black font-mono text-sm font-bold mb-6">
          <p className="text-neo-red uppercase font-black mb-1">Error Diagnostics:</p>
          <p>{error}</p>
        </div>

        <button
          onClick={onReset}
          className="neo-btn !bg-white !text-black flex items-center gap-2 text-sm sm:text-base"
        >
          <ArrowLeft className="w-5 h-5 stroke-[3]" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  if (!record) return null;

  const isEligible = record.isEligible;
  const formattedDate = new Date(record.timestamp * 1000).toLocaleString();

  return (
    <div className="relative">
      
      {/* SHIELD SLAMMING SHUT ANIMATION (Framer Motion) */}
      <motion.div
        initial={{ scale: 1.4, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="w-full"
      >
        <div
          className={`neo-box p-6 sm:p-8 border-4 border-black shadow-neo-xl ${
            isEligible ? 'bg-neo-green text-black' : 'bg-neo-red text-white'
          }`}
        >
          {/* Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b-4 border-black">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white text-black border-3 border-black flex items-center justify-center shadow-neo-sm">
                {isEligible ? (
                  <ShieldCheck className="w-9 h-9 text-neo-green stroke-[2.5]" />
                ) : (
                  <ShieldAlert className="w-9 h-9 text-neo-red stroke-[2.5]" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="neo-badge bg-black text-white text-[11px]">
                    ON-CHAIN VERIFIED
                  </span>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider bg-white text-black px-2 py-0.5 border border-black">
                    GATE RESULT
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-display mt-1">
                  {isEligible ? 'ACCESS GRANTED' : 'ACCESS DENIED'}
                </h2>
              </div>
            </div>

            {/* Decision Tag */}
            <div className="px-4 py-2 bg-black text-white font-display font-black text-lg sm:text-xl uppercase tracking-wider border-2 border-white shadow-neo-sm">
              {isEligible ? 'ELIGIBLE (18+)' : 'INELIGIBLE (< 18)'}
            </div>
          </div>

          {/* Privacy Preservation Shield Bar */}
          <div className="my-6 bg-black text-white p-4 border-3 border-black flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-neo-yellow text-black flex items-center justify-center border border-white">
                <Lock className="w-4 h-4 stroke-[3]" />
              </div>
              <div>
                <p className="font-mono text-xs uppercase text-neo-yellow font-black">
                  SHIELD ACTIVE — RAW AGE CONCEALED
                </p>
                <p className="text-xs font-bold text-neutral-300">
                  Exact numeric age sealed in local witness. Zero bytes of age revealed to Midnight.
                </p>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <span className="bg-neo-green text-black font-mono font-black text-xs px-2 py-1 border border-white">
                100% PRIVATE
              </span>
            </div>
          </div>

          {/* Public Ledger Record Breakdown */}
          <div className="bg-white text-black p-5 border-3 border-black shadow-neo-sm space-y-3 font-mono text-xs sm:text-sm">
            <div className="flex justify-between items-center pb-2 border-b-2 border-neutral-200">
              <span className="font-bold text-neutral-600">Wallet Address:</span>
              <span className="font-extrabold break-all sm:break-normal">{userAddress}</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b-2 border-neutral-200">
              <span className="font-bold text-neutral-600">Public Threshold Evaluated:</span>
              <span className="font-extrabold">{record.thresholdTested}+ Years</span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b-2 border-neutral-200">
              <span className="font-bold text-neutral-600">ZK Circuit Output (isEligible):</span>
              <span className={`font-black px-2 py-0.5 border border-black ${isEligible ? 'bg-neo-green text-black' : 'bg-neo-red text-white'}`}>
                {isEligible ? 'TRUE' : 'FALSE'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-2 border-b-2 border-neutral-200">
              <span className="font-bold text-neutral-600">Timestamp:</span>
              <span className="font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 pt-1">
              <span className="font-bold text-neutral-600">Proof Commitment:</span>
              <span className="font-mono text-xs bg-neutral-100 px-2 py-1 border border-black truncate max-w-[280px]">
                {record.proofCommitment}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={onReset}
              className="neo-btn !bg-white !text-black flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 stroke-[3]" />
              <span>Verify Another Attribute</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('ledger-explorer');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 bg-black text-white font-bold uppercase text-xs sm:text-sm border-3 border-black shadow-neo-sm hover:bg-neutral-800 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Inspect Public Ledger</span>
            </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

{/* Framer motion spring transition seals raw age from view */}
