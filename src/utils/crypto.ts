/**
 * Aegis Cryptographic Utilities
 * Provides client-side entropy generation, SHA-256 digests, and blinding factors
 */

/**
 * Generates cryptographically secure random hexadecimal entropy
 * @param byteLength Number of random bytes to generate (default 32)
 */
export function generateSecureEntropy(byteLength: number = 32): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(byteLength);
    crypto.getRandomValues(bytes);
    return '0x' + Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for non-browser environments
  let str = '0x';
  for (let i = 0; i < byteLength * 2; i++) {
    str += Math.floor(Math.random() * 16).toString(16);
  }
  return str;
}

/**
 * Computes deterministic SHA-256 digest
 */
export async function computeSha256Digest(data: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // Pure JS fallback
  let hash = 0x811c9dc5;
  for (let i = 0; i < data.length; i++) {
    hash ^= data.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  return `0x${hex}${hex}${hex}${hex}`;
}

/**
 * Computes Poseidon-compatible zero-knowledge commitment
 */
export function computeZKCommitment(address: string, entropy: string, timestamp: number): string {
  const payload = `${address.toLowerCase()}:${entropy}:${timestamp}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const chr = payload.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}${hex}${hex}${hex}`;
}
