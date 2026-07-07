/**
 * ABI encoding utilities for instance hash calculation
 */

import { ethers } from 'ethers';
import { keccak256Hash } from './utils';
/**
 * ABI encode the instance hash parameters using standard Solidity ABI encoding
 * Format: keccak256(abi.encode("VERIFY_PROOF", chainId, verifierAddress, transition, sgxInstance, prover))
 * 
 * Note: This matches the Rust implementation which uses abi_encode().iter().skip(32)
 * The Rust code encodes a tuple and skips the first 32 bytes (which is the offset to the tuple data
 * when the tuple is encoded as a function parameter). However, when encoding a tuple directly
 * (not as a function parameter), alloy's abi_encode() may not add this outer offset.
 * 
 * We use ethers.js AbiCoder which follows the Solidity ABI spec, and skip the first 32 bytes
 * to match what Rust does after skip(32).
 */
export function abiEncodeInstanceHash(params: {
  chainId: number;
  verifierAddress: string;
  parentHash: string;
  blockHash: string;
  stateRoot: string;
  sgxInstanceAddress: string;
  proverAddress: string;
}): string {
  // Use ethers.js ABI coder to encode the tuple
  // The signature matches: (string, uint256, address, bytes32, bytes32, bytes32, address, address)
  const coder = ethers.AbiCoder.defaultAbiCoder();
  
  try {
    const encoded = coder.encode(
      ['string', 'uint256', 'address', 'bytes32', 'bytes32', 'bytes32', 'address', 'address'],
      [
        'VERIFY_PROOF',
        params.chainId,
        params.verifierAddress,
        params.parentHash,
        params.blockHash,
        params.stateRoot,
        params.sgxInstanceAddress,
        params.proverAddress,
      ]
    );
    
    // Match Rust's skip(32) behavior
    // Rust's alloy_sol_types::SolValue::abi_encode() for a tuple adds a tuple offset (32 bytes) at the beginning
    // Rust code does: abi_encode().iter().skip(32), which skips the tuple offset
    // ethers.js AbiCoder.encode() does NOT add this outer tuple offset, so we use skip(0) to match Rust's skip(32)
    const encodedWithoutPrefix = encoded.slice(2); // Remove '0x'
    const skipped = encodedWithoutPrefix; // No skip needed - ethers.js doesn't add the tuple offset that Rust skips
    
    
    return '0x' + skipped;
  } catch (error) {
    throw new Error(`Failed to ABI encode instance hash: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Calculate instance hash from parameters
 */
export function calculateInstanceHash(params: {
  chainId: number;
  verifierAddress: string;
  parentHash: string;
  blockHash: string;
  stateRoot: string;
  sgxInstanceAddress: string;
  proverAddress: string;
}): string {
  const encoded = abiEncodeInstanceHash(params);
  return keccak256Hash(encoded);
}

