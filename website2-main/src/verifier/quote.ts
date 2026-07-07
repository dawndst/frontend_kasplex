/**
 * SGX Quote parsing and verification
 * 
 * SGX Quote V3 structure:
 * - Header (48 bytes): version (2) + attestationKeyType (2) + teeType (4) + qeSvn (2) + pceSvn (2) + qeVendorId (16) + userData (20)
 * - Enclave Report (384 bytes): cpuSvn (16) + miscSelect (4) + reserved1 (28) + attributes (16) + mrEnclave (32) + reserved2 (32) + mrSigner (32) + reserved3 (96) + isvProdId (2) + isvSvn (2) + reserved4 (60) + reportData (64)
 * - Authentication Data: variable length
 */

import { hexToBytes, bytesToHex } from './utils';

export interface QuoteInfo {
  /** Quote version (2 bytes) */
  version: Uint8Array;
  /** Attestation key type (2 bytes) */
  attestation_key_type: Uint8Array;
  /** TEE type (4 bytes) */
  tee_type: Uint8Array;
  /** MRENCLAVE measurement (32 bytes) */
  mr_enclave: string;
  /** MRSIGNER measurement (32 bytes) */
  mr_signer: string;
  /** ISV Product ID (2 bytes, little-endian) */
  isv_prod_id: number;
  /** ISV SVN (2 bytes, little-endian) */
  isv_svn: number;
  /** Report data (64 bytes) */
  report_data: Uint8Array;
  /** Instance address extracted from REPORTDATA (first 20 bytes of reportData) */
  report_data_address?: string;
}

/**
 * Parse SGX Quote V3 structure
 * @param quoteHex - Quote in hex format (with or without 0x prefix)
 * @returns Parsed quote information
 */
export function parseQuote(quoteHex: string): QuoteInfo {
  // Remove 0x prefix if present
  const cleanHex = quoteHex.startsWith('0x') ? quoteHex.slice(2) : quoteHex;
  
  // Convert hex to bytes
  const quoteBytes = hexToBytes(cleanHex);
  
  if (quoteBytes.length < 432) {
    throw new Error(
      `Quote too short: expected at least 432 bytes, got ${quoteBytes.length}`
    );
  }

  // Parse header (first 8 bytes)
  const version = quoteBytes.slice(0, 2);
  const attestation_key_type = quoteBytes.slice(2, 4);
  const tee_type = quoteBytes.slice(4, 8);

  // Parse enclave report (starts at offset 48)
  const report_offset = 48;
  
  // MRENCLAVE is at offset 64 within the report (total offset: 48 + 64 = 112)
  const mr_enclave = bytesToHex(quoteBytes.slice(report_offset + 64, report_offset + 96));
  
  // MRSIGNER is at offset 128 within the report (total offset: 48 + 128 = 176)
  const mr_signer = bytesToHex(quoteBytes.slice(report_offset + 128, report_offset + 160));

  // Parse ISV fields (little-endian) at offset 256 within the report
  const isv_prod_id = quoteBytes[report_offset + 256] | (quoteBytes[report_offset + 257] << 8);
  const isv_svn = quoteBytes[report_offset + 258] | (quoteBytes[report_offset + 259] << 8);

  // Parse reportData (64 bytes) at offset 320 within the report (total offset: 48 + 320 = 368)
  const report_data_offset = report_offset + 320;
  const report_data = quoteBytes.slice(report_data_offset, report_data_offset + 64);

  // Extract instance address from REPORTDATA (first 20 bytes)
  // bytesToHex already includes 0x prefix by default
  const report_data_address = bytesToHex(report_data.slice(0, 20));

  return {
    version,
    attestation_key_type,
    tee_type,
    mr_enclave,
    mr_signer,
    isv_prod_id,
    isv_svn,
    report_data,
    report_data_address,
  };
}

/**
 * Verify quote structure and extract information
 * @param quoteHex - Quote in hex format
 * @param expectedInstanceAddress - Expected instance address to match against REPORTDATA
 * @returns QuoteInfo if valid, throws error if invalid
 */
export function verifyQuote(
  quoteHex: string,
  expectedInstanceAddress?: string
): QuoteInfo {
  const quoteInfo = parseQuote(quoteHex);

  // Verify REPORTDATA contains expected instance address if provided
  if (expectedInstanceAddress && quoteInfo.report_data_address) {
    const expected = expectedInstanceAddress.toLowerCase().replace(/^0x/, '');
    const actual = quoteInfo.report_data_address.toLowerCase().replace(/^0x/, '');
    
    if (expected !== actual) {
      throw new Error(
        `Quote REPORTDATA address mismatch: expected ${expectedInstanceAddress}, got ${quoteInfo.report_data_address}`
      );
    }
  }

  return quoteInfo;
}

/**
 * Format quote info for display
 */
export function formatQuoteInfo(quoteInfo: QuoteInfo): string {
  return `
Quote Information:
  Version: ${bytesToHex(quoteInfo.version)}
  Attestation Key Type: ${bytesToHex(quoteInfo.attestation_key_type)}
  TEE Type: ${bytesToHex(quoteInfo.tee_type)}
  MRENCLAVE: ${quoteInfo.mr_enclave}
  MRSIGNER: ${quoteInfo.mr_signer}
  ISV Product ID: ${quoteInfo.isv_prod_id}
  ISV SVN: ${quoteInfo.isv_svn}
  Report Data Address: ${quoteInfo.report_data_address || 'N/A'}
`;
}

