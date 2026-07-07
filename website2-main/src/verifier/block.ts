/**
 * Block header calculation and verification utilities
 */

import { BlockData } from './rpc';

/**
 * Calculate block header hash from block data
 * This simulates the block header calculation in Rust
 */
export function calculateBlockHash(block: BlockData): string {
  // For now, we use the hash directly from RPC
  // In a full implementation, you would reconstruct the header and hash it
  // This requires implementing the full RLP encoding and header structure
  return block.hash;
}

/**
 * Calculate transition for batch proof
 * Uses first block's parent hash and last block's hash and state root
 */
export function calculateBatchTransition(blocks: BlockData[]): {
  parentHash: string;
  blockHash: string;
  stateRoot: string;
} {
  if (blocks.length === 0) {
    throw new Error('Cannot calculate transition for empty block array');
  }
  
  const firstBlock = blocks[0];
  const lastBlock = blocks[blocks.length - 1];
  
  return {
    parentHash: firstBlock.parentHash,
    blockHash: lastBlock.hash,
    stateRoot: lastBlock.stateRoot,
  };
}

/**
 * Verify block continuity for batch
 * Checks that each block's parent hash matches the previous block's hash
 */
export function verifyBlockContinuity(blocks: BlockData[]): boolean {
  for (let i = 1; i < blocks.length; i++) {
    const prevBlock = blocks[i - 1];
    const currentBlock = blocks[i];
    
    if (prevBlock.hash.toLowerCase() !== currentBlock.parentHash.toLowerCase()) {
      return false;
    }
  }
  
  return true;
}

