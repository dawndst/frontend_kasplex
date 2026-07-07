import { HttpRequest } from '../utils/http'
import { KasplexApiUrl, KasplexApi, ProofBlockApi, KasplexKrc20Api } from '@/utils/constants'
import type { TransferResponse, KasplexStats, ResponseBlocks, MainPageBlocksItem, ResponseBlockTransactionCount, ResponseVspcRes, } from '@/types/type'

const http = new HttpRequest()
export const transfer = async (params: Record<string, string>): Promise<TransferResponse>=> {
    try {
        return await http.post<TransferResponse>(`${KasplexApiUrl}/api/claim`, params)
    } catch (error) {
        console.log('error',error)
        return {} as TransferResponse
    }
}

export const getBlocks = async () => {
    try {
        return await http.get<MainPageBlocksItem>(`${KasplexApiUrl}main-page/blocks`)
    } catch(error) {
        console.log('error', error)
        return [] as MainPageBlocksItem[]
    }
}

export const getStats = async () => {
    try {
        return await http.get<KasplexStats>(`${KasplexApi}/counters`)
    } catch(error) {
        console.log('error', error)
        return { } as KasplexStats
    }
}


export const getSgxInfo = async (params: Record<string, number>) => {
    try {
        return await http.post<ResponseBlocks>(`${ProofBlockApi}/api/proof_blocks`, params)
    } catch(error) {
        console.log('error', error)
        return { } as ResponseBlocks
    }
}

export const getTransactionCountByBlock = async (blockNumber: number) => {
    try {
        return await http.get<ResponseBlockTransactionCount>(`${KasplexApiUrl}blocks/${blockNumber}`)
    } catch(error) {
        console.log('error', error)
        return { } as ResponseBlockTransactionCount
    }
}

export const getVspcList = async (daaScore: number) => {
    try {
        return await http.get<ResponseVspcRes>(`${KasplexKrc20Api}/archive/vspc/${daaScore}`)
    } catch(error) {
        console.log('error', error)
        return { } as ResponseVspcRes
    }
} 