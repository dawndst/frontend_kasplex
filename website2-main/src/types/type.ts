interface TransferParams {
    'address': string
}

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

type CSSVars = React.CSSProperties & {
    ["--d"]?: string;
};


interface StatsShowData {
    title: string;
    value: string | number;
    tip: string;
}

interface ResponseContracts {
    smart_contracts: string;
    new_smart_contracts_24h: string;
    new_verified_smart_contracts_24h: string;
    verified_smart_contracts: string;
}

interface BlocksItem {
    number: number;
    input: string;
    proof: string;
    quote: string;
    uuid: null | string;
    daa_score: number;
    anchor_hash: string;
    blockSizeMB?: string
    daq_score?: number;
    minFee?: string;
    maxFee?: string;
}

interface ResponseBlocks {
    errcode: number;
    errmsg: string;
    blocks: BlocksItem[]
}

interface KasplexStatsItem {
    id: string,
    value: string | number,
    title: string,
    units: string
    description: string;
}

interface KasplexStats {
    counters: KasplexStatsItem[]
}

type FormatStatsParams = KasplexStats & ResponseContracts;

interface MainPageBlocksItem {
    base_fee_per_gas: string;
    burnt_fees: string;
    burnt_fees_percentage: null | string;
    difficulty: string
    gas_limit: string
    gas_target_percentage: number;
    gas_used: string
    gas_used_percentage: number
    hash: string
    height: number;
    internal_transactions_count: number | null;
    transactions_count: number
}

type BlockParams = {
    start: number;
    number: number;
};

type BlocksApiResponse = {
    errcode: number;
    errmsg?: string;
    blocks?: BlocksItem[];
};

type DecoratedBlock = BlocksItem & {
    blockSizeMB: string;
    minFee?: string;
    maxFee?: string;
    transactionsCount?: number;
    timestamp?: string
    ago?: string;
};

type ValidationItem = {
    label: string;
    ok: boolean;
    detail?: string;
};

type BlockValidation = {
    summaryOk: boolean;
    items: ValidationItem[];
};

type ResponseBlockTransactionCount = {
    height: number
    transactions_count: number
    timestamp: string
}


export type ChainBlock = {
    daascore: number;
    hash: string;
    header: string;
    verbose: string;
    txid: string;
};

export type VspcData = {
    chainBlock: ChainBlock;
    txList: TxItem[];
};

export type TxItem = {
    txid: string;
    data: string;
};


export type ChainBlockParsed = {
    daascore: number;
    hash: string;
    txid: string;
    header: ChainBlockHeader;
    verbose: ChainBlockVerbose;
};

export type ChainBlockHeader = {
    version: number;
    acceptedIdMerkleRoot: string;
    timestamp: number;
    daaScore: number;
    blueScore: number;
};

export type ChainBlockVerbose = {
    hash: string;
    selectedParentHash: string;
};


export type {
    TransferParams,
    TransferResponse,
    ListData,
    CSSVars,
    KasplexStats,
    StatsShowData,
    ResponseContracts,
    FormatStatsParams,
    KasplexStatsItem,
    ResponseBlocks,
    BlocksItem,
    MainPageBlocksItem,
    ValidationItem,
    BlockParams,
    BlockValidation,
    DecoratedBlock,
    BlocksApiResponse,
    ResponseBlockTransactionCount,
}
export interface VspcItem {
    daaScore: bigint;
    hash: string;
}

export interface ValidationData {
    key: string;
    label: string;
    icon: React.ReactNode;
    status: "OK" | "FAIL";
    detail: string;
}