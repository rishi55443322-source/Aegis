/**
 * Midnight Contract Interaction Service
 * Manages on-chain submissions, public ledger queries, and local caching.
 */

import { AegisContract } from '../../contract/src/aegisContract';
import { VerificationRecord, ZKProofResult, AegisLedgerState } from '../../contract/src/types';

class MidnightContractService {
  private contract: AegisContract;
  private listeners: Set<() => void> = new Set();

  constructor() {
    const defaultThreshold = 18;
    this.contract = new AegisContract(defaultThreshold);

    // Restore cached public verifications if available
    if (typeof window !== 'undefined' && window.localStorage) {
      const cached = window.localStorage.getItem('aegis_public_ledger');
      if (cached) {
        try {
          const records: Record<string, VerificationRecord> = JSON.parse(cached);
          for (const [addr, rec] of Object.entries(records)) {
            (this.contract as unknown as { state: AegisLedgerState }).state.verifications[addr] = rec;
            if (rec.isEligible) {
              (this.contract as unknown as { state: AegisLedgerState }).state.totalEligibleCount += 1;
            }
          }
        } catch {
          // ignore cache parse error
        }
      }
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const ledger = this.contract.getLedgerState();
        window.localStorage.setItem('aegis_public_ledger', JSON.stringify(ledger.verifications));
      } catch {
        // ignore
      }
    }
    this.listeners.forEach((l) => l());
  }

  public getThreshold(): number {
    return this.contract.getThreshold();
  }

  public getLedgerState(): Readonly<AegisLedgerState> {
    return this.contract.getLedgerState();
  }

  public getRecordForAddress(address: string): VerificationRecord | null {
    return this.contract.queryStatus(address);
  }

  /**
   * Submits a zero-knowledge proof transaction to the Midnight blockchain
   */
  public async submitProofToChain(proof: ZKProofResult): Promise<VerificationRecord> {
    // Simulate block latency and consensus confirmation (Midnight Substrate layer)
    await new Promise((resolve) => setTimeout(resolve, 80));

    const record = this.contract.verifyAgeEligibility(proof);
    this.notify();
    return record;
  }

  /**
   * Reset local storage state (for testing & demonstration)
   */
  public resetLedger(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem('aegis_public_ledger');
      } catch {
        // ignore
      }
    }
    const defaultThreshold = 18;
    this.contract = new AegisContract(defaultThreshold);
    this.notify();
  }
}

export const contractService = new MidnightContractService();
