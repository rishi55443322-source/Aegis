import React from 'react';
import { ProvingProgress } from '../services/zkProofService';

interface ShieldProgressProps {
  progress: ProvingProgress;
}

export const ShieldProgress: React.FC<ShieldProgressProps> = ({ progress }) => {
  const percent = Math.min(100, Math.max(0, progress.percent));

  return (
    <div className="neo-box p-6 sm:p-8 bg-white dark:bg-neo-darkCard dark:border-neo-yellow text-center">
      <div className="mb-4">
        <span className="neo-badge bg-neo-yellow text-black">
          ZK-SNARK PROOF COMPUTATION
        </span>
      </div>

      {/* Charging Angular Shield Graphic */}
      <div className="relative w-36 h-44 mx-auto my-6 flex items-center justify-center">
        {/* Background Shield Outline */}
        <svg
          viewBox="0 0 100 120"
          className="w-full h-full drop-shadow-[4px_4px_0px_#000]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shield Outer Border */}
          <path
            d="M50 5 L90 25 L90 70 C90 95 50 115 50 115 C50 115 10 95 10 70 L10 25 Z"
            fill="#F3F4F6"
            stroke="#000000"
            strokeWidth="5"
          />

          {/* Clip path for energy fill level */}
          <clipPath id="shieldFillClip">
            <rect
              x="0"
              y={120 - (percent * 1.2)}
              width="100"
              height="120"
              className="transition-all duration-300 ease-out"
            />
          </clipPath>

          {/* Glowing/Charged Liquid Fill inside Shield */}
          <path
            d="M50 5 L90 25 L90 70 C90 95 50 115 50 115 C50 115 10 95 10 70 L10 25 Z"
            fill="#FFE600"
            clipPath="url(#shieldFillClip)"
          />

          {/* Inner Accent Line */}
          <path
            d="M50 20 V100"
            stroke="#000000"
            strokeWidth="3"
            strokeDasharray="4 4"
          />
          <path
            d="M30 55 H70"
            stroke="#000000"
            strokeWidth="3"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Center Percentage Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
          <span className="text-3xl font-black text-black bg-white px-2 py-0.5 border-2 border-black shadow-neo-sm">
            {percent}%
          </span>
          <span className="text-[10px] font-black uppercase text-black mt-1">
            CHARGING
          </span>
        </div>
      </div>

      {/* Progress Status Message */}
      <h3 className="font-display font-black text-lg sm:text-xl text-black dark:text-white uppercase tracking-tight mb-2">
        Synthesizing Zero-Knowledge Witness
      </h3>
      <p className="font-mono text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300 min-h-[40px] flex items-center justify-center">
        {progress.message}
      </p>

      {/* Hard-Edged Neo-Brutalist Progress Bar */}
      <div className="mt-6 border-4 border-black bg-neutral-200 h-8 p-1 relative shadow-neo-sm overflow-hidden">
        <div
          className="h-full bg-neo-yellow border-r-4 border-black transition-all duration-300 ease-out flex items-center justify-end pr-2"
          style={{ width: `${percent}%` }}
        >
          <div className="w-2 h-full bg-black/20 transform skew-x-12"></div>
        </div>
      </div>

      {/* Security callout under progress bar */}
      <div className="mt-4 pt-3 border-t-2 border-black dark:border-neutral-700 flex items-center justify-center gap-2 text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400">
        <span className="w-2 h-2 bg-neo-green rounded-full animate-ping"></span>
        <span>Isolated Memory Space: Client Device Witness Runtime</span>
      </div>
    </div>
  );
};
