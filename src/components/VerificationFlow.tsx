import React, { useState, useEffect } from 'react';
import { Shield, Lock, ArrowRight, AlertCircle, RefreshCw, KeyRound, Sparkles, Check } from 'lucide-react';
import { walletService, WalletState } from '../services/walletService';
import { contractService } from '../services/contractService';
import { ZKProofService, ProvingProgress } from '../services/zkProofService';
import { ShieldProgress } from './ShieldProgress';
import { EligibilityCard } from './EligibilityCard';
import { VerificationRecord, ZKProofResult } from '../../contract/src/types';

interface VerificationFlowProps {
  onOpenWalletModal: () => void;
}

export const VerificationFlow: React.FC<VerificationFlowProps> = ({ onOpenWalletModal }) => {
  const [walletState, setWalletState] = useState<WalletState>(walletService.getState());
  const [ageInput, setAgeInput] = useState<string>('21');
  const [threshold, setThreshold] = useState<number>(18);
  const [isProving, setIsProving] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [progress, setProgress] = useState<ProvingProgress>({
    stage: 'idle',
    percent: 0,
    message: '',
  });
  const [generatedProof, setGeneratedProof] = useState<ZKProofResult | null>(null);
  const [verificationRecord, setVerificationRecord] = useState<VerificationRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    return walletService.subscribe((state) => {
      setWalletState(state);
      if (state.address) {
        // Check if this address already has a verified record on the ledger
        const existing = contractService.getRecordForAddress(state.address);
        if (existing) {
          setVerificationRecord(existing);
        }
      } else {
        setVerificationRecord(null);
      }
    });
  }, []);

  useEffect(() => {
    setThreshold(contractService.getThreshold());
    return contractService.subscribe(() => {
      setThreshold(contractService.getThreshold());
    });
  }, []);

  const handleStartProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletState.isConnected || !walletState.address) {
      onOpenWalletModal();
      return;
    }

    const age = parseInt(ageInput, 10);
    if (isNaN(age) || age <= 0 || age > 130) {
      setErrorMessage('Please enter a valid age between 1 and 130 years.');
      return;
    }

    setErrorMessage(null);
    setIsProving(true);
    setGeneratedProof(null);

    try {
      // Step 1: Client-Side ZK Proof Generation
      const proof = await ZKProofService.generateProofWithProgress(
        age,
        walletState.address,
        threshold,
        (p) => setProgress(p)
      );

      setGeneratedProof(proof);
      setIsProving(false);
      setIsSubmitting(true);

      // Step 2: On-Chain Midnight Verification Transaction
      const record = await contractService.submitProofToChain(proof);
      setVerificationRecord(record);
      setIsSubmitting(false);
    } catch (err: unknown) {
      setIsProving(false);
      setIsSubmitting(false);
      setErrorMessage(err instanceof Error ? err.message : 'ZK verification failed');
    }
  };

  const handleReset = () => {
    setVerificationRecord(null);
    setGeneratedProof(null);
    setErrorMessage(null);
    setIsProving(false);
    setIsSubmitting(false);
    setProgress({ stage: 'idle', percent: 0, message: '' });
  };

  return (
    <div id="verification-gate" className="max-w-3xl mx-auto my-12 px-4">
      
      {/* Verification Card Box */}
      <div className="neo-box p-6 sm:p-10 bg-white dark:bg-neo-darkCard dark:border-neo-yellow">
        
        {/* Step Indicator Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b-4 border-black dark:border-neutral-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="neo-badge bg-neo-yellow text-black">STAGE 01</span>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                ZK WITNESS ISOLATION
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white font-display mt-1">
              Zero-Knowledge Verification
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs font-bold bg-neutral-100 dark:bg-neutral-800 p-2 border-2 border-black dark:border-neo-yellow">
            <span className="text-neutral-500">GATE THRESHOLD:</span>
            <span className="font-black text-black dark:text-white bg-neo-yellow px-1.5 py-0.5 border border-black">
              {threshold}+ YEARS
            </span>
          </div>
        </div>

        {/* Dynamic State Rendering */}
        {verificationRecord ? (
          /* RESULT STATE (Success or Ineligible) */
          <EligibilityCard
            record={verificationRecord}
            onReset={handleReset}
            userAddress={walletState.address || 'Unknown'}
          />
        ) : isProving ? (
          /* PROOF GENERATION IN PROGRESS (Charging Shield) */
          <ShieldProgress progress={progress} />
        ) : isSubmitting ? (
          /* ON-CHAIN SUBMISSION IN PROGRESS */
          <div className="p-8 border-4 border-black bg-yellow-50 dark:bg-neutral-900 text-center">
            <div className="w-14 h-14 bg-neo-yellow text-black border-3 border-black mx-auto mb-4 flex items-center justify-center animate-spin">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h3 className="font-display font-black text-xl text-black dark:text-white uppercase mb-2">
              Transmitting Proof to Midnight Ledger
            </h3>
            <p className="font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              Submitting zero-knowledge proof commitment to Midnight smart contract. Ledger is confirming boolean verification...
            </p>
          </div>
        ) : (
          /* INPUT & VERIFICATION FORM */
          <div>
            {/* Wallet Not Connected Warning */}
            {!walletState.isConnected && (
              <div className="mb-6 p-4 bg-neo-yellow text-black border-3 border-black shadow-neo-sm flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <KeyRound className="w-6 h-6 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-black uppercase text-sm font-display">Wallet Not Connected</h4>
                    <p className="font-mono text-xs font-bold">
                      Connect your Midnight Lace wallet (or devnet keypair) to sign witness transactions.
                    </p>
                  </div>
                </div>
                <button
                  onClick={onOpenWalletModal}
                  className="neo-btn !bg-white !text-black text-xs shrink-0 py-1.5 px-3"
                >
                  Connect
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-100 text-neo-red border-3 border-black font-mono text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleStartProof} className="space-y-6">
              
              {/* Private Age Input Box */}
              <div className="border-3 border-black p-5 bg-neutral-50 dark:bg-neutral-900">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="private-age" className="font-display font-black text-sm uppercase text-black dark:text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-neo-red" />
                    <span>Your Private Age (Local Input Only)</span>
                  </label>
                  <span className="neo-badge bg-black text-white text-[10px]">
                    WITNESS CELL
                  </span>
                </div>

                <p className="font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400 mb-4">
                  This value remains in your browser's private memory runtime. It is <strong>NEVER transmitted over the network</strong> or stored on-chain.
                </p>

                <div className="flex gap-3 items-center">
                  <input
                    id="private-age"
                    type="number"
                    min="1"
                    max="125"
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    placeholder="e.g. 21"
                    className="neo-input w-32 text-2xl"
                    required
                  />

                  {/* Preset quick buttons */}
                  <div className="flex flex-wrap gap-2">
                    {[16, 18, 21, 25, 65].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setAgeInput(preset.toString())}
                        className={`font-mono text-xs font-black px-3 py-2 border-2 border-black shadow-neo-sm transition-all ${
                          ageInput === preset.toString()
                            ? 'bg-neo-yellow text-black translate-x-[-1px] translate-y-[-1px]'
                            : 'bg-white dark:bg-neutral-800 text-black dark:text-white hover:bg-yellow-100'
                        }`}
                      >
                        {preset} yrs
                      </button>
                    ))}
                  </div>
                </div>

                {/* Privacy Badge */}
                <div className="mt-4 pt-3 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center gap-2 text-xs font-mono font-bold text-neutral-500">
                  <Shield className="w-4 h-4 text-neo-green stroke-[3]" />
                  <span>Only the proof output (<code className="text-black dark:text-white font-black">isEligible: boolean</code>) will touch Midnight.</span>
                </div>
              </div>

              {/* Submit / Action Button */}
              <div>
                <button
                  type="submit"
                  disabled={!walletState.isConnected}
                  className="w-full neo-btn !bg-neo-yellow text-black text-base sm:text-lg py-4 flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-5 h-5 fill-black" />
                  <span>Generate ZK Proof & Verify On-Chain</span>
                  <ArrowRight className="w-5 h-5 stroke-[3]" />
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
