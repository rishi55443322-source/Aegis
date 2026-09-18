import React from 'react';
import { X, Shield, Eye, EyeOff, Check, AlertCircle, Lock } from 'lucide-react';

interface PrivacyExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyExplainerModal: React.FC<PrivacyExplainerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-none">
      <div className="relative w-full max-w-3xl neo-box bg-white dark:bg-neo-darkCard border-4 border-black p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-neo-xl">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b-4 border-black mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-neo-yellow text-black border-3 border-black flex items-center justify-center shadow-neo-sm">
              <Shield className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <span className="neo-badge bg-black text-white text-[11px]">
                SELECTIVE DISCLOSURE ARCHITECTURE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white font-display">
                How Aegis Stays Private
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Modal"
            className="p-1.5 bg-neo-red text-white border-3 border-black shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Introduction */}
        <p className="text-sm sm:text-base font-bold text-neutral-800 dark:text-neutral-200 mb-6">
          Traditional verification systems force you to upload passports, driver's licenses, or exact birthdates. 
          Aegis operates on <strong>Midnight's dual-state model</strong> to enforce complete separation between private witness inputs and public ledger state.
        </p>

        {/* Side-by-Side Selective Disclosure Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          
          {/* Public: What Observer CAN Learn */}
          <div className="border-3 border-black bg-yellow-50 dark:bg-neutral-800 p-5 shadow-neo-sm">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b-2 border-black text-black dark:text-white font-black uppercase text-sm">
              <Eye className="w-5 h-5 text-neo-cobalt" />
              <span>What An Observer CAN Learn</span>
            </div>
            <ul className="space-y-3 font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-neo-green stroke-[3] shrink-0 mt-0.5" />
                <span>
                  <strong>Wallet Address:</strong> The public address that submitted the transaction.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-neo-green stroke-[3] shrink-0 mt-0.5" />
                <span>
                  <strong>Eligibility Boolean:</strong> A single flag (<code className="bg-white dark:bg-black px-1 border border-black">isEligible: true/false</code>).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-neo-green stroke-[3] shrink-0 mt-0.5" />
                <span>
                  <strong>Threshold Tested:</strong> The public criteria evaluated (e.g. 18).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-neo-green stroke-[3] shrink-0 mt-0.5" />
                <span>
                  <strong>Timestamp:</strong> Block time when verification was finalized.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-neo-green stroke-[3] shrink-0 mt-0.5" />
                <span>
                  <strong>Proof Commitment:</strong> SHA-256 digest proving the ZK proof was forged for this caller.
                </span>
              </li>
            </ul>
          </div>

          {/* Private: What Observer CANNOT Learn */}
          <div className="border-3 border-black bg-red-50 dark:bg-neutral-900 p-5 shadow-neo-sm">
            <div className="flex items-center gap-2 pb-3 mb-3 border-b-2 border-black text-neo-red font-black uppercase text-sm">
              <EyeOff className="w-5 h-5 text-neo-red stroke-[2.5]" />
              <span>What Observer CANNOT Learn</span>
            </div>
            <ul className="space-y-3 font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-neo-red text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  ✕
                </div>
                <span>
                  <strong>Your Exact Age:</strong> Whether you are 19, 35, or 72 is NEVER disclosed.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-neo-red text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  ✕
                </div>
                <span>
                  <strong>Date of Birth / Government ID:</strong> No personal identity data is stored or handled.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-neo-red text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  ✕
                </div>
                <span>
                  <strong>Age Delta (Distance from Threshold):</strong> The observer cannot deduce how close you were to 18.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-4 h-4 bg-neo-red text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  ✕
                </div>
                <span>
                  <strong>Private Witness Entropy:</strong> Client blinding factors are deleted after proof creation.
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Midnight Compact Code Snippet Display */}
        <div className="bg-black text-white p-4 border-3 border-black font-mono text-xs mb-6 overflow-x-auto">
          <p className="text-neo-yellow font-bold uppercase mb-2">// aegis.compact - ZK Verification Circuit</p>
          <pre className="text-neutral-300">
{`witness getPrivateAge(): Uint<32>; // Kept in local witness memory

export circuit verifyAgeEligibility(): Boolean {
  const privateAge = getPrivateAge(); // Client memory ONLY
  const threshold = minimumAgeThreshold; // Public ledger cell
  
  // ZK inequality evaluated inside arithmetic circuit:
  const isEligible: Boolean = (privateAge >= threshold);
  
  // Public ledger receives ONLY the boolean outcome:
  verifications[caller] = VerificationRecord { isEligible, ... };
  return isEligible;
}`}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t-3 border-black">
          <button
            onClick={onClose}
            className="neo-btn !bg-neo-yellow text-black text-sm px-6 py-2.5"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};

{/* Selective disclosure matrix: Public vs Private state */}
