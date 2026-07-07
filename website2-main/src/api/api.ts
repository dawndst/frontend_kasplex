import { HttpRequest } from '../utils/http'
import { FaucetApi } from '@/utils/constants'
import type { TransferResponse } from '@/types/type'

const http = new HttpRequest()
export const transfer = async (params: Record<string, string>): Promise<TransferResponse>=> {
    try {
        return await http.post<TransferResponse>(`${FaucetApi}/claim`, params)
    } catch (error) {
        console.log('error',error)
        return {} as TransferResponse
    }
}
