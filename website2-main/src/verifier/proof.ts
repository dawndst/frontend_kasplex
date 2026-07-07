/**
 * Proof parsing and verification utilities
 */

import { ethers } from 'ethers';
import { ParsedProof } from './types';
import { hexToBytes, bytesToHex, stripHexPrefix } from './utils';

/**
 * Parse SGX proof bytes
 * Format: 89 bytes = 4-byte instance_id + 20-byte new_address + 65-byte signature
 * 
 * Also supports aggregation proofs (109 bytes) by extracting new_instance_address and signature
 */
export function parseProof(proofHex: string): ParsedProof {
  const proofBytes = hexToBytes(proofHex);

  if (proofBytes.length < 89) {
    throw new Error(`Invalid proof length: expected at least 89 bytes, got ${proofBytes.length}`);
  }

  // Parse instance_id (4 bytes, big-endian)
  const instanceId = (proofBytes[0] << 24) |
    (proofBytes[1] << 16) |
    (proofBytes[2] << 8) |
    proofBytes[3];

  let newInstanceAddress: string;
  let signature: string;

  if (proofBytes.length === 89) {
    // One-shot proof: 4(id) + 20(new) + 65(sig) = 89
    const addressBytes = proofBytes.slice(4, 24);
    newInstanceAddress = bytesToHex(addressBytes);
    const sigBytes = proofBytes.slice(24, 89);
    signature = bytesToHex(sigBytes);
  } else if (proofBytes.length === 109) {
    // Aggregation proof: 4(id) + 20(old) + 20(new) + 65(sig) = 109
    // Extract new_instance_address and signature for one-shot verification
    const addressBytes = proofBytes.slice(24, 44);
    newInstanceAddress = bytesToHex(addressBytes);
    const sigBytes = proofBytes.slice(44, 109);
    signature = bytesToHex(sigBytes);
  } else {
    throw new Error(
      `Invalid proof length: expected 89 (one-shot) or 109 (aggregation) bytes, got ${proofBytes.length}`
    );
  }

  return {
    instance_id: instanceId,
    new_instance_address: newInstanceAddress,
    signature,
  };
}

/**
 * Recover signer address from signature and message hash
 * Uses ECDSA recovery (ecrecover)
 */
export function recoverSigner(signature: string, messageHash: string): string {
  const cleanSig = stripHexPrefix(signature);
  const cleanMsg = stripHexPrefix(messageHash);

  if (cleanSig.length !== 130) {
    throw new Error(`Invalid signature length: expected 130 hex chars (65 bytes), got ${cleanSig.length}`);
  }

  if (cleanMsg.length !== 64) {
    throw new Error(`Invalid message hash length: expected 64 hex chars (32 bytes), got ${cleanMsg.length}`);
  }

  // Extract r, s, v from signature
  const r = '0x' + cleanSig.slice(0, 64);
  const s = '0x' + cleanSig.slice(64, 128);
  const v = parseInt(cleanSig.slice(128, 130), 16);

  // Recover public key using ethers
  // Note: ethers expects v to be 27 or 28, but our signature might have v as 0 or 1
  const vAdjusted = v >= 27 ? v : v + 27;

  try {
    const recoveredAddress = ethers.recoverAddress(
      '0x' + cleanMsg,
      {
        r,
        s,
        v: vAdjusted,
      }
    );

    return recoveredAddress.toLowerCase();
  } catch (error) {
    throw new Error(`Failed to recover signer: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Verify that recovered address matches expected address
 */
export function verifyAddressMatch(recovered: string, expected: string): boolean {
  return recovered.toLowerCase() === expected.toLowerCase();
}





