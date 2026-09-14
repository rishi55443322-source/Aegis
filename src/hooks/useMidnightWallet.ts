import { useState, useEffect, useCallback } from 'react';
import { walletService, WalletState } from '../services/walletService';

export function useMidnightWallet() {
  const [walletState, setWalletState] = useState<WalletState>(walletService.getState());

  useEffect(() => {
    return walletService.subscribe(setWalletState);
  }, []);

  const connectLace = useCallback(async () => {
    return walletService.connect(true);
  }, []);

  const connectDevnet = useCallback(async () => {
    return walletService.connect(false);
  }, []);

  const disconnect = useCallback(() => {
    walletService.disconnect();
  }, []);

  return {
    ...walletState,
    connectLace,
    connectDevnet,
    disconnect,
  };
}

/** React hook providing reactive wallet state */
