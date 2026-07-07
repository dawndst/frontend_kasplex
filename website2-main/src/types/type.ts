interface TransferResponse {
    code: number;
    data?: {
        txid?: string;
        error?: string;
    };
    txid: string;
    error: string;
    msg?: string;
}

interface ListData {
    name: string;
    logo?: string;
    types: string[];
    desc?: string;
    href: string;
    tag?: string;
    isStar: boolean;
    isOpen: boolean;
}

export type {
    TransferResponse,
    ListData,
}
