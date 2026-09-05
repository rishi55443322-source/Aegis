/**
 * Aegis Smart Contract Runtime
 * Emulates the execution of `aegis.compact` on the Midnight Blockchain
 */

import { AegisLedgerState, Address, VerificationRecord, ZKProofResult } from './types';
import { AegisZKCircuit } from './zkCircuit';

export class AegisContract {
  private state: AegisLedgerState;

  constructor(initialThreshold: number = 18, adminAddress: Address = '0x000000000000000000000000000000000000aeg15') {
    if (initialThreshold <= 0 || initialThreshold > 150) {
      throw new Error("Constructor assertion failed: Invalid initial age threshold");
    }

    this.state = {
      admin: adminAddress,
      minimumAgeThreshold: initialThreshold,
      verifications: {},
      totalEligibleCount: 0,
      protocolVersion: 1,
    };
  }

  /**
   * Retrieves the current immutable snapshot of the Midnight public ledger
   */
  public getLedgerState(): Readonly<AegisLedgerState> {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * Retrieves the currently configured minimum age threshold
   */
  public getThreshold(): number {
    return this.state.minimumAgeThreshold;
  }

  /**
   * Admin circuit: updates the minimum age threshold
   */
  public updateThreshold(newThreshold: number, caller: Address): void {
    if (caller.toLowerCase() !== this.state.admin.toLowerCase()) {
      throw new Error("Unauthorized: Only admin can update threshold");
    }
    if (newThreshold <= 0 || newThreshold > 150) {
      throw new Error("Invalid threshold value: Must be between 1 and 150");
    }
    this.state.minimumAgeThreshold = newThreshold;
  }

  /**
   * Midnight On-Chain Verification Circuit
   *
   * Accepts a verified zero-knowledge proof from the Midnight proving service.
   * Records the eligibility result on the public ledger.
   *
   * Note: The contract verifies the proof validity without EVER having access to
   * the user's raw private age.
   */
  public verifyAgeEligibility(proof: ZKProofResult): VerificationRecord {
    // 1. Verify the cryptographic proof
    const isValidProof = AegisZKCircuit.verifyProof(proof);
    if (!isValidProof) {
      throw new Error("Midnight Proof Verification Failed: Cryptographic proof is invalid or malformed");
    }

    // 2. Ensure proof was generated against the current ledger threshold
    if (proof.publicInputs.threshold !== this.state.minimumAgeThreshold) {
      throw new Error(
        `Threshold Mismatch: Proof was generated for threshold ${proof.publicInputs.threshold}, but ledger threshold is ${this.state.minimumAgeThreshold}`
      );
    }

    const caller = proof.publicInputs.userAddress;

    // 3. Record verification in ledger
    const record: VerificationRecord = {
      isEligible: proof.isEligible,
      thresholdTested: proof.publicInputs.threshold,
      timestamp: proof.publicInputs.timestamp || Math.floor(Date.now() / 1000),
      proofCommitment: proof.proofData.commitment,
    };

    // Update public ledger
    this.state.verifications[caller] = record;

    if (proof.isEligible) {
      this.state.totalEligibleCount += 1;
    }

    return record;
  }

  /**
   * Query public verification status for any address
   */
  public queryStatus(userAddress: Address): VerificationRecord | null {
    return this.state.verifications[userAddress] || null;
  }
}
