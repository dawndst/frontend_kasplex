/**
 * Proof verification logic (frontend-safe)
 * - NO process
 * - NO fs / readline
 * - NO require
 */

import { KAASPLEX_RPC_URL } from '../utils/constants'
import {
  verifySingleProofFromChain,
  verifyBatchProofFromChain,
  getChainConfig,
  ProofData
} from './index'

/* ===================== types ===================== */

export interface CliArgs {
  file?: string
  network: string
  block?: number
  startBlock?: number
  endBlock?: number
  rpcUrl?: string
  verifierAddress?: string
  proverAddress?: string
}

interface ProofObject {
  proof?: string
  quote?: string
  input?: string
  instance_address?: string
  [key: string]: string | undefined
}

interface ApiResponseData {
  status?: string
  error?: string
  proof?: ProofObject
  batch_proof?: ProofObject
}

interface JsonProofResponse {
  status?: string
  batch_id?: string | number
  proof_type?: string
  data?: ApiResponseData
  proof?: ProofObject
  batch_proof?: ProofObject
  result?: {
    data?: {
      proof?: ProofObject
    }
  }
}

export interface VerifyInput {
  args: CliArgs
  json?: unknown
  jsonText?: string
}

/* ===================== utils ===================== */

function extractJsonFromText(text: string) {
  const lines = text.split('\n')

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return JSON.parse(trimmed)
      } catch {
        continue
      }
    }
  }

  try {
    return JSON.parse(text.trim())
  } catch {
    throw new Error(
      `Could not parse JSON. Input starts with: ${text.substring(0, 100)}...`
    )
  }
}

function readJsonFromInput(input: VerifyInput) {
  if (input.json) return input.json
  if (input.jsonText) return extractJsonFromText(input.jsonText)

  throw new Error('No JSON input provided')
}

/* ===================== proof extraction ===================== */

function extractProofData(json: JsonProofResponse): ProofData {
  let proofObj: ProofObject | null = null

  if (json.data?.proof) proofObj = json.data.proof
  else if (json.data?.batch_proof) proofObj = json.data.batch_proof
  else if (json.proof) proofObj = json.proof
  else if (json.batch_proof) proofObj = json.batch_proof
  else if (json.result?.data?.proof) proofObj = json.result.data.proof

  if (!proofObj) {
    throw new Error('Could not find proof data in JSON response')
  }

  const proofData: ProofData = {
    proof: proofObj.proof || '',
    quote: proofObj.quote || '',
    input: proofObj.input || '',
  }

  if (proofObj.instance_address) {
    proofData.instance_address = proofObj.instance_address
  }

  if (!proofData.proof || !proofData.input) {
    throw new Error('Missing required fields: proof and input')
  }

  return proofData
}

/* ===================== main entry ===================== */

/**
 * Frontend-safe verification entry
 */
export async function verifyProof(
  input: VerifyInput
) {
  const { args } = input

  if (!args?.network) {
    throw new Error('network is required')
  }

  const json = readJsonFromInput(input)

  const proofStatus = json.data?.status
  if (
    proofStatus &&
    proofStatus !== 'success' &&
    proofStatus !== 'completed'
  ) {
    throw new Error(`Proof not ready: ${proofStatus}`)
  }

  const proofData = extractProofData(json)

  const chainConfig = getChainConfig(args.network)

  if (args.rpcUrl) {
    chainConfig.rpcUrl = args.rpcUrl || KAASPLEX_RPC_URL
  }
  if (args.verifierAddress) {
    chainConfig.verifierAddress = args.verifierAddress
  }
  if (args.proverAddress) {
    chainConfig.proverAddress = args.proverAddress
  }

  if (
    args.startBlock !== undefined &&
    args.endBlock !== undefined
  ) {
    return verifyBatchProofFromChain(
      proofData,
      chainConfig,
      args.startBlock,
      args.endBlock
    )
  }

  if (args.block !== undefined) {
    return verifySingleProofFromChain(
      proofData,
      chainConfig,
      args.block
    )
  }

  throw new Error(
    'Must specify block or startBlock/endBlock'
  )
}
