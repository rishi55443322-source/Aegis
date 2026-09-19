import React from 'react';
import { Shield, Github, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-4 border-black bg-black text-white mt-20 pt-12 pb-8 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b-2 border-neutral-800">
          
          {/* Brand Col */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neo-yellow text-black flex items-center justify-center border-2 border-white">
                <Shield className="w-6 h-6 fill-black" />
              </div>
              <span className="font-display font-black text-2xl uppercase tracking-tighter text-white">
                AEGIS
              </span>
            </div>

            <p className="font-sans font-bold text-sm text-neutral-300 max-w-md">
              Zero-Knowledge Age & Eligibility Gate on Midnight Blockchain. 
              Selective disclosure architecture ensuring users verify criteria without relinquishing their raw identity data.
            </p>

            <div className="pt-2">
              <p className="text-xs font-bold text-neo-yellow uppercase">
                "Guard the threshold. Guard the truth."
              </p>
            </div>
          </div>

          {/* Submission Info */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <h4 className="text-sm font-black uppercase text-white font-display tracking-wider border-b border-neutral-700 pb-1">
              Program Submission
            </h4>
            <p className="text-neutral-300">
              <strong className="text-white">Program:</strong> New Moon to Full: Monthly Moonshots on Midnight
            </p>
            <p className="text-neutral-300">
              <strong className="text-white">Organizer:</strong> RiseIn
            </p>
            <p className="text-neutral-300">
              <strong className="text-white">Milestone:</strong> Level 3 - First Quarter Submission
            </p>
            <p className="text-neutral-300">
              <strong className="text-white">Stack:</strong> Compact + React + TypeScript
            </p>
          </div>

          {/* Repository Links */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="text-sm font-black uppercase text-white font-display tracking-wider border-b border-neutral-700 pb-1">
              Source Code
            </h4>
            <div className="space-y-2">
              <a
                href="https://github.com/rishi55443322-source/Aegis"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-neo-yellow transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://github.com/rishi55443322-source"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-neo-yellow transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>Developer Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://midnight.network"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-neutral-300 hover:text-neo-yellow transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Midnight Network Docs</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© 2026 Aegis Project. Open-source under Apache-2.0 License.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neo-green animate-pulse"></span>
            <span>Midnight Testnet Remote Node Online</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
