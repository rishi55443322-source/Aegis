/**
 * Aegis Formatting and Display Utilities
 */

/**
 * Shortens an address for clean UI display (e.g. 0x1234...5678)
 */
export function formatAddress(
  address: string | null | undefined,
  prefixLen: number = 6,
  suffixLen: number = 4
): string {
  if (!address) return '';
  if (address.length <= prefixLen + suffixLen) return address;
  return `${address.substring(0, prefixLen)}...${address.substring(address.length - suffixLen)}`;
}

/**
 * Formats a Unix timestamp into readable local date and time
 */
export function formatTimestamp(unixSeconds: number): string {
  if (!unixSeconds || isNaN(unixSeconds)) return 'N/A';
  const date = new Date(unixSeconds * 1000);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Formats Midnight tDUST tokens with precision
 */
export function formatDust(amount: number): string {
  if (isNaN(amount)) return '0.00 tDUST';
  return `${amount.toFixed(2)} tDUST`;
}

/**
 * Formats age threshold label
 */
export function formatThreshold(years: number): string {
  return `${years}+ Years`;
}
