import React, { useState, useEffect } from 'react';
import { Shield, Wallet, Sun, Moon, Info, CheckCircle2, ChevronDown, Lock } from 'lucide-react';
import { walletService, WalletState } from '../services/walletService';

interface HeaderProps {
  onOpenPrivacyModal: () => void;
  onOpenWalletModal: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPrivacyModal,
  onOpenWalletModal,
  darkMode,
  toggleDarkMode,
}) => {
  const [walletState, setWalletState] = useState<WalletState>(walletService.getState());

  useEffect(() => {
    return walletService.subscribe(setWalletState);
  }, []);

  const formatAddress = (addr: string | null) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="border-b-4 border-black bg-neo-yellow text-black sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black flex items-center justify-center border-2 border-black shadow-neo-sm">
            <Shield className="w-7 h-7 text-neo-yellow fill-neo-yellow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl tracking-tighter uppercase font-display">
                AEGIS
              </span>
              <span className="bg-black text-white text-[11px] font-mono font-bold px-1.5 py-0.5 tracking-wider uppercase border border-black">
                MIDNIGHT ZK
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-tight text-neutral-900 hidden sm:block">
              Guard the threshold. Guard the truth.
            </p>
          </div>
        </div>

        {/* Right Actions: Network status, Privacy button, Dark mode, Wallet */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Network Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white border-3 border-black shadow-neo-sm font-mono text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-neo-green animate-pulse"></span>
            <span>{walletState.network}</span>
          </div>

          {/* How Privacy Works Button */}
          <button
            onClick={onOpenPrivacyModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-white text-black font-bold uppercase text-xs sm:text-sm border-3 border-black shadow-neo-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-neo active:translate-x-[1px] active:translate-y-[1px] transition-all"
            title="Inspect Privacy Model"
          >
            <Info className="w-4 h-4 text-black" />
            <span className="hidden sm:inline">Privacy Model</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Theme"
            className="p-2 bg-white border-3 border-black shadow-neo-sm hover:bg-neutral-100 active:translate-x-[1px] active:translate-y-[1px] transition-all"
          >
            {darkMode ? <Sun className="w-5 h-5 text-black" /> : <Moon className="w-5 h-5 text-black" />}
          </button>

          {/* Wallet Connector Button */}
          {walletState.isConnected ? (
            <button
              onClick={onOpenWalletModal}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-black text-white font-mono font-bold text-xs sm:text-sm border-3 border-black shadow-neo-sm hover:bg-neutral-800 transition-all"
            >
              <CheckCircle2 className="w-4 h-4 text-neo-green" />
              <span>{formatAddress(walletState.address)}</span>
              <span className="hidden lg:inline text-xs text-neo-yellow">
                ({walletState.balanceDust.toFixed(1)} tDUST)
              </span>
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </button>
          ) : (
            <button
              onClick={onOpenWalletModal}
              className="neo-btn flex items-center gap-2 text-xs sm:text-sm !bg-white hover:!bg-neutral-100"
            >
              <Wallet className="w-4 h-4 text-black" />
              <span>Connect Wallet</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
