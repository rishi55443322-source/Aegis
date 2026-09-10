import { describe, it, expect } from 'vitest';
import { formatAddress, formatTimestamp, formatDust, formatThreshold } from '../src/utils/formatters';
import { generateSecureEntropy, computeSha256Digest, computeZKCommitment } from '../src/utils/crypto';

describe('Aegis Utility Functions Suite', () => {
  describe('Formatters', () => {
    it('should format long addresses with ellipsis', () => {
      const addr = '0x1234567890abcdef1234567890abcdef12345678';
      const formatted = formatAddress(addr);
      expect(formatted).toBe('0x1234...5678');
    });

    it('should handle null or short addresses gracefully', () => {
      expect(formatAddress(null)).toBe('');
      expect(formatAddress('0x123')).toBe('0x123');
    });

    it('should format timestamps correctly', () => {
      const ts = 1727000000;
      const formatted = formatTimestamp(ts);
      expect(formatted).not.toBe('N/A');
      expect(formatTimestamp(0)).toBe('N/A');
    });

    it('should format tDUST balances', () => {
      expect(formatDust(150.5)).toBe('150.50 tDUST');
      expect(formatDust(0)).toBe('0.00 tDUST');
    });

    it('should format age threshold', () => {
      expect(formatThreshold(18)).toBe('18+ Years');
      expect(formatThreshold(21)).toBe('21+ Years');
    });
  });

  describe('Cryptographic Helpers', () => {
    it('should generate secure hexadecimal entropy with correct length', () => {
      const entropy = generateSecureEntropy(16);
      expect(entropy.startsWith('0x')).toBe(true);
      expect(entropy.length).toBe(34); // '0x' + 32 hex chars
    });

    it('should compute deterministic SHA-256 digest', async () => {
      const digest1 = await computeSha256Digest('test-input');
      const digest2 = await computeSha256Digest('test-input');
      expect(digest1).toBe(digest2);
      expect(digest1.startsWith('0x')).toBe(true);
    });

    it('should generate distinct ZK commitments for different timestamps or addresses', () => {
      const c1 = computeZKCommitment('0xalice', '0xentropy1', 100);
      const c2 = computeZKCommitment('0xbob', '0xentropy1', 100);
      const c3 = computeZKCommitment('0xalice', '0xentropy1', 101);

      expect(c1).not.toBe(c2);
      expect(c1).not.toBe(c3);
    });
  });
});
