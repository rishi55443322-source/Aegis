import React, { useState, useEffect } from 'react';
import { X, Wallet, Shield, CheckCircle, ExternalLink, Cpu, RefreshCw } from 'lucide-react';
import { walletService, WalletState } from '../services/walletService';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const [walletState, setWalletState] = useState<WalletState>(walletService.getState());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return walletService.subscribe(setWalletState);
  }, []);

  if (!isOpen) return null;

  const handleConnectLace = async () => {
    setLoading(true);
    setError(null);
    try {
      await walletService.connect(true);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not connect to Midnight Lace');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectDevnet = async () => {
    setLoading(true);
    setError(null);
    try {
      await walletService.connect(false);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    walletService.disconnect();
    onClose();
  };

  const isLaceInstalled = typeof window !== 'undefined' && !!(window as unknown as { midnight?: { mnLace?: unknown } })?.midnight?.mnLace;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-none">
      <div className="relative w-full max-w-md neo-box bg-white dark:bg-neo-darkCard border-4 border-black p-6 sm:p-8 shadow-neo-xl">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b-4 border-black mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-yellow text-black border-2 border-black flex items-center justify-center shadow-neo-sm">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="neo-badge bg-black text-white text-[10px]">
                WEB3 CONNECTOR
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white font-display">
                Midnight Wallet
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 bg-neo-red text-white border-2 border-black shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border-2 border-neo-red text-neo-red font-mono text-xs font-bold">
            {error}
          </div>
        )}

        {/* Active Connected State */}
        {walletState.isConnected ? (
          <div className="space-y-4">
            <div className="p-4 border-3 border-black bg-yellow-50 dark:bg-neutral-800">
              <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-neutral-300">
                <span className="font-mono text-xs font-bold text-neutral-500">Status</span>
                <span className="neo-badge bg-neo-green text-black text-[10px]">Connected</span>
              </div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-neutral-300">
                <span className="font-mono text-xs font-bold text-neutral-500">Network</span>
                <span className="font-mono text-xs font-bold text-black dark:text-white">{walletState.network}</span>
              </div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-neutral-300">
                <span className="font-mono text-xs font-bold text-neutral-500">Balance</span>
                <span className="font-mono text-xs font-extrabold text-black dark:text-white">{walletState.balanceDust.toFixed(2)} tDUST</span>
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-neutral-500 block mb-1">Address</span>
                <span className="font-mono text-xs font-black bg-white dark:bg-black p-2 border border-black block break-all text-black dark:text-yellow-300">
                  {walletState.address}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDisconnect}
                className="w-full neo-btn !bg-neo-red !text-white text-xs sm:text-sm py-2.5"
              >
                Disconnect Wallet
              </button>
              <button
                onClick={onClose}
                className="w-full neo-btn !bg-white !text-black text-xs sm:text-sm py-2.5"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Connect Options */
          <div className="space-y-4">
            <p className="text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300">
              Connect your Midnight wallet to authorize zero-knowledge transactions and bind eligibility results to your address.
            </p>

            {/* Option 1: Official Midnight Lace Wallet */}
            <div className="border-3 border-black p-4 bg-yellow-50 dark:bg-neutral-800 shadow-neo-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-black text-base uppercase text-black dark:text-white">
                  Midnight Lace Wallet
                </span>
                {isLaceInstalled ? (
                  <span className="neo-badge bg-neo-green text-black text-[10px]">Detected</span>
                ) : (
                  <span className="neo-badge bg-neutral-300 text-neutral-700 text-[10px]">Extension</span>
                )}
              </div>
              <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-3">
                Official browser extension for Midnight testnet transactions and witness keys.
              </p>
              <button
                onClick={handleConnectLace}
                disabled={loading}
                className="w-full neo-btn text-xs sm:text-sm !bg-neo-yellow text-black flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4 stroke-[2.5]" />
                <span>Connect Lace Wallet</span>
              </button>
            </div>

            {/* Option 2: Devnet / Reviewer Testing Keypair */}
            <div className="border-3 border-black p-4 bg-white dark:bg-neutral-900 shadow-neo-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-display font-black text-base uppercase text-black dark:text-white">
                  Midnight Devnet Keypair
                </span>
                <span className="neo-badge bg-neo-cobalt text-white text-[10px]">Reviewer Ready</span>
              </div>
              <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-3">
                Pre-funded test account for local testing and submission reviewers without Lace installed.
              </p>
              <button
                onClick={handleConnectDevnet}
                disabled={loading}
                className="w-full neo-btn text-xs sm:text-sm !bg-white dark:!bg-neutral-800 !text-black dark:!text-white flex items-center justify-center gap-2"
              >
                <Cpu className="w-4 h-4" />
                <span>Use Devnet Keypair</span>
              </button>
            </div>

            <div className="pt-2 text-center">
              <a
                href="https://midnight.network"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs font-bold text-neutral-500 hover:text-black underline"
              >
                <span>Get Midnight Lace Wallet</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

{/* Dual connection options: Lace Extension or Devnet Keypair */}
