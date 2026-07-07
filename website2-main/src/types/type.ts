// The faucet backend responds only with { msg }: a "Txhash: 0x..." string on
// success, or a human-readable reason on failure. See faucet-server/src/server.ts.
interface TransferResponse {
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
