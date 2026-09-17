import React from 'react';
import { Shield, EyeOff, Lock, ArrowRight, Check, Zap } from 'lucide-react';

interface HeroProps {
  onStartVerification: () => void;
  onOpenPrivacyModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartVerification, onOpenPrivacyModal }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 border-b-4 border-black bg-neo-bg dark:bg-neo-darkBg transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <div className="neo-badge bg-neo-yellow text-black">
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span>Midnight Compact Smart Contract</span>
          </div>
          <div className="neo-badge bg-black text-white">
            <Lock className="w-3.5 h-3.5 text-neo-yellow" />
            <span>Zero-Knowledge Proofs</span>
          </div>
          <div className="neo-badge bg-neo-cobalt text-white">
            <span>Level 3 Submission</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Title & Pitch */}
          <div className="lg:col-span-8">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-black dark:text-white leading-[0.95] mb-6 font-display">
              Guard the threshold. <br />
              <span className="bg-neo-yellow text-black px-2 inline-block border-3 border-black shadow-neo-sm mt-1">
                Guard the truth.
              </span>
            </h1>

            <p className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-neutral-200 max-w-2xl leading-relaxed mb-8">
              Aegis is an on-chain zero-knowledge eligibility gate on Midnight. 
              Prove your age meets the required threshold (e.g. 18+) with mathematical certainty — 
              <span className="underline decoration-wavy decoration-neo-red decoration-2 font-black">
                WITHOUT ever disclosing your birthdate, exact age, or identity
              </span> to the blockchain, verifiers, or eavesdroppers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onStartVerification}
                className="neo-btn flex items-center gap-3 text-base sm:text-lg px-6 py-3.5"
              >
                <span>Launch Verification Gate</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </button>

              <button
                onClick={onOpenPrivacyModal}
                className="font-bold uppercase tracking-wider border-3 border-black bg-white dark:bg-neo-darkCard text-black dark:text-white px-5 py-3.5 shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg transition-all text-sm sm:text-base flex items-center gap-2"
              >
                <EyeOff className="w-5 h-5 text-neo-cobalt" />
                <span>How Privacy Works</span>
              </button>
            </div>
          </div>

          {/* Right Highlight Box - Neo-Brutalist Feature Matrix */}
          <div className="lg:col-span-4">
            <div className="neo-box p-6 bg-white dark:bg-neo-darkCard dark:border-neo-yellow">
              <div className="flex items-center justify-between pb-4 mb-4 border-b-3 border-black dark:border-neo-yellow">
                <div className="flex items-center gap-2 font-black uppercase text-sm tracking-wider">
                  <Shield className="w-5 h-5 text-neo-cobalt fill-neo-cobalt" />
                  <span>The Aegis Guarantee</span>
                </div>
                <span className="font-mono text-xs font-black bg-neo-yellow text-black px-2 py-0.5 border border-black">
                  ZK-SNARK
                </span>
              </div>

              <ul className="space-y-3 font-mono text-xs sm:text-sm font-bold">
                <li className="flex items-start gap-2.5">
                  <div className="p-0.5 bg-neo-green text-black border border-black shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[4]" />
                  </div>
                  <span className="text-neutral-900 dark:text-neutral-100">
                    <strong>Local Witness:</strong> Raw age is isolated in client memory.
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="p-0.5 bg-neo-green text-black border border-black shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[4]" />
                  </div>
                  <span className="text-neutral-900 dark:text-neutral-100">
                    <strong>Zero Leakage:</strong> On-chain record has ONLY a boolean <code className="bg-yellow-100 dark:bg-neutral-800 px-1 border border-black text-black dark:text-yellow-300">isEligible</code>.
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="p-0.5 bg-neo-green text-black border border-black shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[4]" />
                  </div>
                  <span className="text-neutral-900 dark:text-neutral-100">
                    <strong>Cryptographic Certainty:</strong> Mathematical proof cannot be forged or tampered.
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <div className="p-0.5 bg-neo-green text-black border border-black shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[4]" />
                  </div>
                  <span className="text-neutral-900 dark:text-neutral-100">
                    <strong>Selective Disclosure:</strong> Total separation of public ledger and private witness.
                  </span>
                </li>
              </ul>

              <div className="mt-5 pt-4 border-t-3 border-black dark:border-neo-yellow text-center">
                <div className="bg-neo-yellow text-black font-mono text-xs font-black p-2 border-2 border-black">
                  CURRENT GATE THRESHOLD: 18+ YEARS
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
