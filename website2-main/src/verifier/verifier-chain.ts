/**
 * Chain-based verification functions that fetch block data from RPC
 */

import { ProofData, VerificationResult, ParsedProof } from './types';
import { parseProof, recoverSigner, verifyAddressMatch } from './proof';
import { calculateInstanceHash } from './abi';
import { stripHexPrefix } from './utils';
import { ChainConfig, fetchBlock, fetchBlocks } from './rpc';
import { calculateBatchTransition, verifyBlockContinuity } from './block';
import { parseQuote } from './quote';

/**
 * Verify single block proof by fetching block data from chain
 */
export async function verifySingleProofFromChain(
  proofData: ProofData,
  chainConfig: ChainConfig,
  blockNumber: number
): Promise<VerificationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    // Fetch block data from chain
    const block = await fetchBlock(chainConfig.rpcUrl, blockNumber);
    
    // Parse proof
    let parsedProof: ParsedProof;
    try {
      parsedProof = parseProof(proofData.proof);
      console.log('\n🔍 Parsed Proof:');
      console.log(`  Instance ID: ${parsedProof.instance_id}`);
      console.log(`  SGX Instance Address (from proof): ${parsedProof.new_instance_address}`);
      console.log(`  Signature length: ${parsedProof.signature.length} chars\n`);
    } catch (error) {
      errors.push(`Failed to parse proof bytes: ${error instanceof Error ? error.message : String(error)}`);
      return {
        valid: false,
        errors,
        warnings,
      };
    }
    
    // Calculate expected instance hash from block data
    // For single block: transition uses block's parent hash, block hash, and state root
    try {
      console.log('\n📊 Instance Hash Calculation Parameters:');
      console.log(`  Chain ID: ${chainConfig.chainId}`);
      console.log(`  Verifier Address: ${chainConfig.verifierAddress}`);
      console.log(`  Parent Hash: ${block.parentHash}`);
      console.log(`  Block Hash: ${block.hash}`);
      console.log(`  State Root: ${block.stateRoot}`);
      console.log(`  SGX Instance Address: ${parsedProof.new_instance_address}`);
      console.log(`  Prover Address: ${chainConfig.proverAddress}`);
      console.log(`  Expected Input Hash: ${proofData.input}\n`);
      
      const calculatedHash = calculateInstanceHash({
        chainId: chainConfig.chainId,
        verifierAddress: chainConfig.verifierAddress,
        parentHash: block.parentHash,
        blockHash: block.hash,
        stateRoot: block.stateRoot,
        sgxInstanceAddress: parsedProof.new_instance_address,
        proverAddress: chainConfig.proverAddress,
      });
      
      console.log(`  Calculated Hash: ${calculatedHash}\n`);
      
      const expectedHash = stripHexPrefix(calculatedHash).toLowerCase();
      const actualHash = stripHexPrefix(proofData.input).toLowerCase();
      
      if (expectedHash !== actualHash) {
        errors.push(
          `Instance hash mismatch: calculated ${calculatedHash} but proof has ${proofData.input}`
        );
      }
    } catch (error) {
      errors.push(`Failed to calculate instance hash: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Verify signature
    try {
      const recoveredAddress = recoverSigner(parsedProof.signature, proofData.input);
      
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
 * Verify batch proof by fetching block data from chain
 */
export async function verifyBatchProofFromChain(
  proofData: ProofData,
  chainConfig: ChainConfig,
  startBlock: number,
  endBlock: number
): Promise<VerificationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    // Fetch blocks from chain
    const blocks = await fetchBlocks(chainConfig.rpcUrl, startBlock, endBlock);
    
    // Verify block continuity
    if (!verifyBlockContinuity(blocks)) {
      errors.push('Block continuity check failed: parent hashes do not match');
    }
    
    // Calculate transition from batch blocks
    const transition = calculateBatchTransition(blocks);
    console.log("transition:", transition);
    
    // Parse proof
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
    
    // Calculate expected instance hash from batch transition
    try {
      console.log("Calculating instance hash...", {
        chainId: chainConfig.chainId,
        verifierAddress: chainConfig.verifierAddress,
        parentHash: transition.parentHash,
        blockHash: transition.blockHash,
        stateRoot: transition.stateRoot,
        sgxInstanceAddress: parsedProof.new_instance_address,
        proverAddress: chainConfig.proverAddress,
      })
      const calculatedHash = calculateInstanceHash({
        chainId: chainConfig.chainId,
        verifierAddress: chainConfig.verifierAddress,
        parentHash: transition.parentHash,
        blockHash: transition.blockHash,
        stateRoot: transition.stateRoot,
        sgxInstanceAddress: parsedProof.new_instance_address,
        proverAddress: chainConfig.proverAddress,
      });
      
      const expectedHash = stripHexPrefix(calculatedHash).toLowerCase();
      const actualHash = stripHexPrefix(proofData.input).toLowerCase();
      
      if (expectedHash !== actualHash) {
        errors.push(
          `Instance hash mismatch: calculated ${calculatedHash} but proof has ${proofData.input}`
        );
      }
    } catch (error) {
      errors.push(`Failed to calculate instance hash: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Verify signature
    try {
      const recoveredAddress = recoverSigner(parsedProof.signature, proofData.input);
      
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

