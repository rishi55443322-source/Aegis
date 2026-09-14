import { useState, useEffect, useCallback } from 'react';
import { contractService } from '../services/contractService';
import { AegisLedgerState, VerificationRecord } from '../../contract/src/types';

export function useLedgerState(walletAddress?: string | null) {
  const [ledgerState, setLedgerState] = useState<AegisLedgerState>(contractService.getLedgerState());
  const [userRecord, setUserRecord] = useState<VerificationRecord | null>(() => {
    return walletAddress ? contractService.getRecordForAddress(walletAddress) : null;
  });

  useEffect(() => {
    const update = () => {
      setLedgerState(contractService.getLedgerState());
      if (walletAddress) {
        setUserRecord(contractService.getRecordForAddress(walletAddress));
      } else {
        setUserRecord(null);
      }
    };

    update();
    return contractService.subscribe(update);
  }, [walletAddress]);

  const resetLedger = useCallback(() => {
    contractService.resetLedger();
  }, []);

  return {
    ledgerState,
    userRecord,
    threshold: ledgerState.minimumAgeThreshold,
    totalEligibleCount: ledgerState.totalEligibleCount,
    resetLedger,
  };
}

/** React hook synchronizing with Midnight public ledger */
