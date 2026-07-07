/**
 * Utility functions for hex encoding/decoding and keccak256
 */

import { keccak256 } from 'ethers';

/**
 * Remove 0x prefix from hex string if present
 */
export function stripHexPrefix(hex: string): string {
  return hex.startsWith('0x') ? hex.slice(2) : hex;
}

/**
 * Convert hex string to Uint8Array
 */
export function hexToBytes(hex: string): Uint8Array {
  const cleanHex = stripHexPrefix(hex);
  if (cleanHex.length % 2 !== 0) {
    throw new Error(`Invalid hex string length: ${cleanHex.length}`);
  }
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Convert Uint8Array to hex string
 */
export function bytesToHex(bytes: Uint8Array, prefix: boolean = true): string {
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return prefix ? '0x' + hex : hex;
}

/**
 * Keccak256 hash
 */
export function keccak256Hash(data: Uint8Array | string): string {
  if (typeof data === 'string') {
    return keccak256('0x' + stripHexPrefix(data));
  }
  return keccak256(bytesToHex(data));
}





