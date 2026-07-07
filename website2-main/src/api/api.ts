import { FaucetApi } from '@/utils/constants';
import type { TransferResponse } from '@/types/type';

// Single backend call: request test KAS from the faucet service (see faucet-server/).
export const transfer = async (params: { address: string }): Promise<TransferResponse> => {
    try {
        const res = await fetch(`${FaucetApi}/claim`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
            signal: AbortSignal.timeout(30000),
        });
        return await res.json();
    } catch (error) {
        console.error('faucet claim failed', error);
        return {};
    }
};
