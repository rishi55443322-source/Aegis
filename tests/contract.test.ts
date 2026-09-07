import { describe, it, expect, beforeEach } from 'vitest';
import { AegisContract } from '../contract/src/aegisContract';
import { AegisZKCircuit } from '../contract/src/zkCircuit';
import { AegisWitness } from '../contract/src/types';

describe('Aegis Compact Contract & ZK Circuit Suite', () => {
  let contract: AegisContract;
  const adminAddress = '0x1111111111111111111111111111111111111111';
  const aliceAddress = '0xaaaa222233334444555566667777888899990000';
  const bobAddress = '0xbbbb222233334444555566667777888899990000';

  beforeEach(() => {
    // Initialized with default threshold of 18
    contract = new AegisContract(18, adminAddress);
  });

  describe('ZK Circuit Correctness (age >= threshold)', () => {
    it('should generate valid proof and return isEligible = true when age > threshold (age: 24, threshold: 18)', async () => {
      const witness: AegisWitness = {
        privateAge: 24,
        userAddress: aliceAddress,
        entropy: '0x99ffeedd11223344',
      };

      const proof = await AegisZKCircuit.generateProof(witness, contract.getThreshold());

      expect(proof.isEligible).toBe(true);
      expect(proof.publicInputs.threshold).toBe(18);
      expect(proof.publicInputs.userAddress).toBe(aliceAddress);
      expect(proof.proofData.commitment).toBeDefined();

      // Submit to contract
      const record = contract.verifyAgeEligibility(proof);
      expect(record.isEligible).toBe(true);
      expect(record.thresholdTested).toBe(18);

      // Verify public ledger
      const status = contract.queryStatus(aliceAddress);
      expect(status).not.toBeNull();
      expect(status?.isEligible).toBe(true);
      expect(contract.getLedgerState().totalEligibleCount).toBe(1);
    });

    it('should correctly mark isEligible = false when age < threshold (age: 16, threshold: 18)', async () => {
      const witness: AegisWitness = {
        privateAge: 16,
        userAddress: bobAddress,
        entropy: '0x1234567890abcdef',
      };

      const proof = await AegisZKCircuit.generateProof(witness, contract.getThreshold());

      expect(proof.isEligible).toBe(false);

      const record = contract.verifyAgeEligibility(proof);
      expect(record.isEligible).toBe(false);

      const status = contract.queryStatus(bobAddress);
      expect(status?.isEligible).toBe(false);
      // Ineligible verifications do not increment eligible count
      expect(contract.getLedgerState().totalEligibleCount).toBe(0);
    });

    it('should correctly evaluate exact boundary condition (age: 18, threshold: 18)', async () => {
      const witness: AegisWitness = {
        privateAge: 18,
        userAddress: aliceAddress,
        entropy: '0xboundary_18',
      };

      const proof = await AegisZKCircuit.generateProof(witness, 18);
      expect(proof.isEligible).toBe(true);

      const record = contract.verifyAgeEligibility(proof);
      expect(record.isEligible).toBe(true);
    });

    it('should correctly evaluate boundary condition right below threshold (age: 17, threshold: 18)', async () => {
      const witness: AegisWitness = {
        privateAge: 17,
        userAddress: bobAddress,
        entropy: '0xboundary_17',
      };

      const proof = await AegisZKCircuit.generateProof(witness, 18);
      expect(proof.isEligible).toBe(false);

      const record = contract.verifyAgeEligibility(proof);
      expect(record.isEligible).toBe(false);
    });
  });

  describe('Circuit Constraints & Input Validation', () => {
    it('should reject invalid human age values (<= 0 or > 150)', async () => {
      const invalidWitnessZero: AegisWitness = {
        privateAge: 0,
        userAddress: aliceAddress,
        entropy: '0xabc',
      };

      await expect(
        AegisZKCircuit.generateProof(invalidWitnessZero, 18)
      ).rejects.toThrow(/ZK Constraint Failure/);

      const invalidWitnessNegative: AegisWitness = {
        privateAge: -5,
        userAddress: aliceAddress,
        entropy: '0xabc',
      };

      await expect(
        AegisZKCircuit.generateProof(invalidWitnessNegative, 18)
      ).rejects.toThrow(/ZK Constraint Failure/);

      const invalidWitnessTooOld: AegisWitness = {
        privateAge: 200,
        userAddress: aliceAddress,
        entropy: '0xabc',
      };

      await expect(
        AegisZKCircuit.generateProof(invalidWitnessTooOld, 18)
      ).rejects.toThrow(/ZK Constraint Failure/);
    });

    it('should reject proof verification if proof threshold does not match contract threshold', async () => {
      const witness: AegisWitness = {
        privateAge: 22,
        userAddress: aliceAddress,
        entropy: '0xabc',
      };

      // Generate proof against threshold 21
      const proof = await AegisZKCircuit.generateProof(witness, 21);

      // Contract is configured for threshold 18 -> should throw mismatch error
      expect(() => contract.verifyAgeEligibility(proof)).toThrow(/Threshold Mismatch/);
    });
  });

  describe('Privacy Guarantee & Selective Disclosure', () => {
    it('MUST NOT leak private age in the public ledger state or verification record', async () => {
      const rawAge = 29;
      const witness: AegisWitness = {
        privateAge: rawAge,
        userAddress: aliceAddress,
        entropy: '0xsecret_entropy',
      };

      const proof = await AegisZKCircuit.generateProof(witness, 18);
      const record = contract.verifyAgeEligibility(proof);

      // Check VerificationRecord keys: only isEligible, thresholdTested, timestamp, proofCommitment
      const recordKeys = Object.keys(record);
      expect(recordKeys).not.toContain('privateAge');
      expect(recordKeys).not.toContain('age');

      // Check full serialized ledger
      const serializedLedger = JSON.stringify(contract.getLedgerState());
      expect(serializedLedger).not.toContain(`"privateAge":${rawAge}`);
      expect(serializedLedger).not.toContain(`"age":${rawAge}`);
    });
  });

  describe('Contract Admin & Governance', () => {
    it('should allow admin to update threshold and reject unauthorized updates', () => {
      // Update by admin
      contract.updateThreshold(21, adminAddress);
      expect(contract.getThreshold()).toBe(21);

      // Unauthorized update by Alice
      expect(() => contract.updateThreshold(25, aliceAddress)).toThrow(/Unauthorized/);
    });
  });
});
