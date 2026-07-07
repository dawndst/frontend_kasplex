/**
 * Type definitions for Vereth SGX Proof Verifier
 */

export interface ProofData {
  /** Proof bytes in hex format (89 bytes: 4-byte instance_id + 20-byte address + 65-byte signature) */
  proof: string;
  /** SGX Quote in hex format */
  quote: string;
  /** Protocol instance hash (32-byte hash) */
  input: string;
  /** Expected instance address (optional, for verification) */
  instance_address?: string;
}

export interface Transition {
  /** Parent block hash (first block's parent hash for batch) */
  parent_hash: string;
  /** Block hash (last block's hash for batch) */
  block_hash: string;
  /** State root (last block's state root for batch) */
  state_root: string;
}

export interface BatchProofData extends ProofData {
  /** Transition data for batch proof */
  transition: Transition;
  /** Chain ID */
  chain_id: number;
  /** Verifier contract address */
  verifier_address: string;
  /** Prover address */
  prover_address: string;
}

export interface ParsedProof {
  /** Instance ID */
  instance_id: number;
  /** New instance address */
  new_instance_address: string;
  /** Signature (65 bytes: r[32] + s[32] + v[1]) */
  signature: string;
}

// QuoteInfo is exported from './quote' to avoid duplication
import type { QuoteInfo } from './quote';

export interface VerificationResult {
  /** Whether verification passed */
  valid: boolean;
  /** Array of error messages */
  errors: string[];
  /** Array of warning messages */
  warnings: string[];
  /** Parsed proof information */
  proofInfo?: {
    instance_id: number;
    new_instance_address: string;
    input_hash: string;
  };
  /** Parsed quote information */
  quoteInfo?: QuoteInfo;
}

