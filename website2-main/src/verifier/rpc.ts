/**
 * RPC client for fetching block data from chain
 */

import { ethers } from 'ethers';

export interface BlockData {
  number: number;
  hash: string;
  parentHash: string;
  stateRoot: string;
  transactionsRoot: string;
  receiptsRoot: string;
  timestamp: number;
  transactions: string[];
}

export interface ChainConfig {
  chainId: number;
  verifierAddress: string;
  proverAddress: string;
  rpcUrl: string;
}

/**
 * Fetch block data from RPC
 */
export async function fetchBlock(
  rpcUrl: string,
  blockNumber: number | 'latest'
): Promise<BlockData> {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  
  const block = await provider.getBlock(blockNumber, true);
  
  if (!block) {
    throw new Error(`Block ${blockNumber} not found`);
  }
  
  return {
    number: Number(block.number),
    hash: block.hash || '',
    parentHash: block.parentHash,
    stateRoot: block.stateRoot || '',
    transactionsRoot: (block as unknown as BlockData).transactionsRoot || '',
    receiptsRoot: (block as unknown as BlockData).receiptsRoot || '',
    timestamp: block.timestamp,
    transactions: block.transactions as string[],
  };
}

/**
 * Fetch multiple blocks for batch verification
 */
export async function fetchBlocks(
  rpcUrl: string,
  startBlock: number,
  endBlock: number
): Promise<BlockData[]> {
  const blocks: BlockData[] = [];
  
  for (let i = startBlock; i <= endBlock; i++) {
    const block = await fetchBlock(rpcUrl, i);
    blocks.push(block);
  }
  
  return blocks;
}

/**
 * Get chain config for a network
 */
export function getChainConfig(network: string): ChainConfig {
  // Default configurations for common networks
  const configs: Record<string, ChainConfig> = {
    mainnet: {
      chainId: 202555,
      verifierAddress: '0x0000000000000000000000000000000000000000',
      proverAddress: '0x0000000000000000000000000000000000000000',
      rpcUrl: 'https://evmrpc.kasplex.org',
    },
    testnet: {
      chainId: 167012,
      verifierAddress: '0x0000000000000000000000000000000000000000',
      proverAddress: '0x0000000000000000000000000000000000000000',
      rpcUrl: 'https://rpc.kasplextest.xyz',
    }
    // Add more networks as needed
  };
  
  const config = configs[network.toLowerCase()];
  if (!config) {
    throw new Error(`Unknown network: ${network}`);
  }
  
  return config;
}

