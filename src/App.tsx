import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { VerificationFlow } from './components/VerificationFlow';
import { LedgerExplorer } from './components/LedgerExplorer';
import { PrivacyExplainerModal } from './components/PrivacyExplainerModal';
import { WalletModal } from './components/WalletModal';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem('aegis_theme') === 'dark';
      } catch {
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        try {
          window.localStorage?.setItem('aegis_theme', 'dark');
        } catch {
          // ignore
        }
      } else {
        document.documentElement.classList.remove('dark');
        try {
          window.localStorage?.setItem('aegis_theme', 'light');
        } catch {
          // ignore
        }
      }
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const scrollToVerification = () => {
    const el = document.getElementById('verification-gate');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neo-bg dark:bg-neo-darkBg text-black dark:text-white transition-colors duration-150">
      
      {/* Neo-Brutalist Top Sticky Header */}
      <Header
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
        onOpenWalletModal={() => setWalletModalOpen(true)}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Main Hero Banner with Tagline */}
      <Hero
        onStartVerification={scrollToVerification}
        onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
      />

      {/* Step-by-Step Interactive Verification Gate */}
      <main>
        <VerificationFlow onOpenWalletModal={() => setWalletModalOpen(true)} />
        
        {/* On-Chain Public Ledger Explorer & Audit Drawer */}
        <LedgerExplorer />
      </main>

      {/* Footer with Project & Submission Details */}
      <Footer />

      {/* Modals */}
      <PrivacyExplainerModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
      />

    </div>
  );
};

export default App;

// Dark mode preference persistence
