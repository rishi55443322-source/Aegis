/**
 * Aegis Age & Eligibility Credential Suite
 * Validates zero-knowledge witness generation, proof constraints, and tamper resistance
 */

import { describe, it, expect } from 'vitest';
import { AegisZKCircuit } from '../contract/src/zkCircuit';
import { AegisContract } from '../contract/src/aegisContract';
import { AegisWitness } from '../contract/src/types';

describe('Aegis Zero-Knowledge Credential Verification Suite', () => {
  const contract = new AegisContract(18);
  const sampleWallet = '0x1234567890123456789012345678901234567890';

  it('should generate valid ZK proof points for age meeting exact legal threshold (18)', async () => {
    const witness: AegisWitness = {
      privateAge: 18,
      userAddress: sampleWallet,
      entropy: '0xseed_exact_18',
    };

    const proof = await AegisZKCircuit.generateProof(witness, 18);

    expect(proof.isEligible).toBe(true);
    expect(proof.publicInputs.threshold).toBe(18);
    expect(proof.publicInputs.userAddress).toBe(sampleWallet);
    expect(proof.proofData.a).toHaveLength(2);
    expect(proof.proofData.b).toHaveLength(2);
    expect(proof.proofData.c).toHaveLength(2);
    expect(proof.proofData.commitment).toBeDefined();

    // Verify cryptographic integrity
    const isValid = AegisZKCircuit.verifyProof(proof);
    expect(isValid).toBe(true);
  });

  it('should generate valid ZK proof points for age well above threshold (45 >= 18)', async () => {
    const witness: AegisWitness = {
      privateAge: 45,
      userAddress: sampleWallet,
      entropy: '0xseed_senior_45',
    };

    const proof = await AegisZKCircuit.generateProof(witness, 18);

    expect(proof.isEligible).toBe(true);
    expect(proof.publicInputs.threshold).toBe(18);

    const record = contract.verifyAgeEligibility(proof);
    expect(record.isEligible).toBe(true);
    expect(record.thresholdTested).toBe(18);
  });

  it('should generate valid proof marking ineligible for minor (15 < 18) without leaking exact age', async () => {
    const witness: AegisWitness = {
      privateAge: 15,
      userAddress: '0xminor_wallet_address_9988',
      entropy: '0xseed_minor_15',
    };

    const proof = await AegisZKCircuit.generateProof(witness, 18);

    expect(proof.isEligible).toBe(false);

    const record = contract.verifyAgeEligibility(proof);
    expect(record.isEligible).toBe(false);

    // Ensure raw age 15 is nowhere in the public record
    expect(JSON.stringify(record)).not.toContain('15');
  });

  it('should reject malformed or tampered proof data structures', () => {
    const malformedProof = {
      isEligible: true,
      publicInputs: { threshold: 18, userAddress: '', timestamp: Date.now() },
      proofData: {
        a: ['0x1', '0x2'] as [string, string],
        b: [['0x1', '0x2'], ['0x3', '0x4']] as [[string, string], [string, string]],
        c: ['0x1', '0x2'] as [string, string],
        commitment: 'invalid_commitment',
      },
      provingTimeMs: 120,
    };

    const isValid = AegisZKCircuit.verifyProof(malformedProof);
    expect(isValid).toBe(false);
  });
});
