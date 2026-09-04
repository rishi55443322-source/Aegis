/**
 * Aegis Smart Contract Type Definitions
 * Midnight Compact Language Binding Types
 */

export type Address = string;

export interface VerificationRecord {
  /** Public eligibility boolean result (true = age >= threshold) */
  isEligible: boolean;
  /** The public age threshold evaluated during proof verification */
  thresholdTested: number;
  /** Block timestamp when verification occurred */
  timestamp: number;
  /** Cryptographic proof commitment hash (32-byte hex) */
  proofCommitment: string;
}

export interface AegisLedgerState {
  /** Contract deployer/administrator address */
  admin: Address;
  /** Configured public minimum age threshold */
  minimumAgeThreshold: number;
  /** Mapping of public wallet addresses to their verification status */
  verifications: Record<Address, VerificationRecord>;
  /** Total count of eligible users verified */
  totalEligibleCount: number;
  /** Protocol version */
  protocolVersion: number;
}

export interface AegisWitness {
  /**
   * User's exact raw age (PRIVATE).
   * Kept strictly in client-side memory; NEVER transmitted on-chain.
   */
  privateAge: number;
  /** User's public wallet address */
  userAddress: Address;
  /** Cryptographic client entropy for proof blinding */
  entropy: string;
}

export interface ZKProofResult {
  /** Proof output boolean */
  isEligible: boolean;
  /** Public inputs verified by circuit */
  publicInputs: {
    threshold: number;
    userAddress: Address;
    timestamp: number;
  };
  /** SNARK/STARK proof representation */
  proofData: {
    a: [string, string];
    b: [[string, string], [string, string]];
    c: [string, string];
    commitment: string;
  };
  /** Verification computation duration in milliseconds */
  provingTimeMs: number;
}

/** Protocol schema definition */
