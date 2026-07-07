/**
 * Main verification functions for single and batch proofs
 */

import { ProofData, BatchProofData, VerificationResult, ParsedProof } from './types';
import { parseProof, recoverSigner, verifyAddressMatch } from './proof';
import { calculateInstanceHash } from './abi';
import { stripHexPrefix } from './utils';
import { parseQuote } from './quote';

/**
 * Verify a single block proof
 */
export function verifySingleProof(proofData: ProofData): VerificationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    // Parse proof bytes
    let parsedProof: ParsedProof;
    try {
      parsedProof = parseProof(proofData.proof);
    } catch (error) {
      errors.push(`Failed to parse proof bytes: ${error instanceof Error ? error.message : String(error)}`);
      return {
        valid: false,
        errors,
        warnings,
      };
    }
    
    // Validate input hash format
    const inputHash = stripHexPrefix(proofData.input);
    if (inputHash.length !== 64) {
      errors.push(`Invalid input hash length: expected 64 hex chars (32 bytes), got ${inputHash.length}`);
    }
    
    // Verify signature
    try {
      const recoveredAddress = recoverSigner(parsedProof.signature, proofData.input);
      
      // Check if recovered address matches new_instance_address
      if (!verifyAddressMatch(recoveredAddress, parsedProof.new_instance_address)) {
        errors.push(
          `Signature verification failed: recovered address ${recoveredAddress} does not match expected signer ${parsedProof.new_instance_address}`
        );
      }
    } catch (error) {
      errors.push(`Failed to recover signer from signature: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Verify instance address if provided
    if (proofData.instance_address) {
      const expectedAddr = stripHexPrefix(proofData.instance_address).toLowerCase();
      const actualAddr = stripHexPrefix(parsedProof.new_instance_address).toLowerCase();
      
      if (expectedAddr !== actualAddr) {
        errors.push(
          `Instance address mismatch: expected ${proofData.instance_address}, got ${parsedProof.new_instance_address}`
        );
      }
    }
    
    // Parse and verify quote
    let quoteInfo;
    if (proofData.quote) {
      try {
        quoteInfo = parseQuote(proofData.quote);
        
        // Verify REPORTDATA contains instance address
        if (quoteInfo.report_data_address) {
          const expectedAddr = stripHexPrefix(parsedProof.new_instance_address).toLowerCase();
          const actualAddr = stripHexPrefix(quoteInfo.report_data_address).toLowerCase();
          
          if (expectedAddr !== actualAddr) {
            warnings.push(
              `Quote REPORTDATA address ${quoteInfo.report_data_address} does not match proof new instance address ${parsedProof.new_instance_address}`
            );
          }
        }
      } catch (error) {
        warnings.push(`Failed to parse quote (continuing anyway): ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      warnings.push('Quote not provided in proof data');
    }
    
    const valid = errors.length === 0;
    
    return {
      valid,
      errors,
      warnings,
      proofInfo: {
        instance_id: parsedProof.instance_id,
        new_instance_address: parsedProof.new_instance_address,
        input_hash: proofData.input,
      },
      quoteInfo,
    };
  } catch (error) {
    errors.push(`Unexpected error during verification: ${error instanceof Error ? error.message : String(error)}`);
    return {
      valid: false,
      errors,
      warnings,
    };
  }
}

/**
 * Verify a batch proof for continuous blocks
 */
export function verifyBatchProof(batchProofData: BatchProofData): VerificationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    // Parse proof bytes
    let parsedProof: ParsedProof;
    try {
      parsedProof = parseProof(batchProofData.proof);
    } catch (error) {
      errors.push(`Failed to parse proof bytes: ${error instanceof Error ? error.message : String(error)}`);
      return {
        valid: false,
        errors,
        warnings,
      };
    }
    
    // Validate input hash format
    const inputHash = stripHexPrefix(batchProofData.input);
    if (inputHash.length !== 64) {
      errors.push(`Invalid input hash length: expected 64 hex chars (32 bytes), got ${inputHash.length}`);
    }
    
    // Calculate expected instance hash from transition data
    try {
      const calculatedHash = calculateInstanceHash({
        chainId: batchProofData.chain_id,
        verifierAddress: batchProofData.verifier_address,
        parentHash: batchProofData.transition.parent_hash,
        blockHash: batchProofData.transition.block_hash,
        stateRoot: batchProofData.transition.state_root,
        sgxInstanceAddress: parsedProof.new_instance_address,
        proverAddress: batchProofData.prover_address,
      });
      
      const expectedHash = stripHexPrefix(calculatedHash).toLowerCase();
      const actualHash = stripHexPrefix(batchProofData.input).toLowerCase();
      
      if (expectedHash !== actualHash) {
        errors.push(
          `Instance hash mismatch: calculated ${calculatedHash} but proof has ${batchProofData.input}`
        );
      }
    } catch (error) {
      errors.push(`Failed to calculate instance hash: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Verify signature
    try {
      const recoveredAddress = recoverSigner(parsedProof.signature, batchProofData.input);
      
      // Check if recovered address matches new_instance_address
      if (!verifyAddressMatch(recoveredAddress, parsedProof.new_instance_address)) {
        errors.push(
          `Signature verification failed: recovered address ${recoveredAddress} does not match expected signer ${parsedProof.new_instance_address}`
        );
      }
    } catch (error) {
      errors.push(`Failed to recover signer from signature: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Verify instance address if provided
    if (batchProofData.instance_address) {
      const expectedAddr = stripHexPrefix(batchProofData.instance_address).toLowerCase();
      const actualAddr = stripHexPrefix(parsedProof.new_instance_address).toLowerCase();
      
      if (expectedAddr !== actualAddr) {
        errors.push(
          `Instance address mismatch: expected ${batchProofData.instance_address}, got ${parsedProof.new_instance_address}`
        );
      }
    }
    
    // Parse and verify quote
    let quoteInfo;
    if (batchProofData.quote) {
      try {
        quoteInfo = parseQuote(batchProofData.quote);
        
        // Verify REPORTDATA contains instance address
        if (quoteInfo.report_data_address) {
          const expectedAddr = stripHexPrefix(parsedProof.new_instance_address).toLowerCase();
          const actualAddr = stripHexPrefix(quoteInfo.report_data_address).toLowerCase();
          
          if (expectedAddr !== actualAddr) {
            warnings.push(
              `Quote REPORTDATA address ${quoteInfo.report_data_address} does not match proof new instance address ${parsedProof.new_instance_address}`
            );
          }
        }
      } catch (error) {
        warnings.push(`Failed to parse quote (continuing anyway): ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      warnings.push('Quote not provided in proof data');
    }
    
    const valid = errors.length === 0;
    
  return {
    valid,
    errors,
    warnings,
    proofInfo: {
      instance_id: parsedProof.instance_id,
      new_instance_address: parsedProof.new_instance_address,
      input_hash: batchProofData.input,
    },
    quoteInfo,
  };
  } catch (error) {
    errors.push(`Unexpected error during verification: ${error instanceof Error ? error.message : String(error)}`);
    return {
      valid: false,
      errors,
      warnings,
    };
  }
}

