import type { MainPageBlocksItem, DecoratedBlock, BlocksItem, BlockValidation, ValidationItem } from '@/types/type'

function debounce<T extends (...args: unknown[]) => unknown>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
        if (timer) {
            clearTimeout(timer);
        }

        timer = setTimeout(() => {
            func.apply(this, args);
            timer = null;
        }, delay);
    };
}

function isIphone(): boolean {
    return /iPhone/i.test(navigator.userAgent);
}

function isValidUrl(url: string) {
    const regex = /^https?:\/\/[^\s/]+\.[^\s/]+/;
    return regex.test(url);
}

function openUrl(url: string): void {
    if (!url || !isValidUrl(url)) return
    window.open(url, '_blank');
}

function formatNumber(num: string | number, dec: number = 2) {
    const n = typeof num === 'string' ? Number(num) : num;
    if (!Number.isFinite(n)) return '0';

    const units = [
        { threshold: 1e12, suffix: 'T' },
        { threshold: 1e9, suffix: 'B' },
        { threshold: 1e6, suffix: 'M' },
        { threshold: 1e3, suffix: 'K' }
    ];

    const truncate = (value: number, digits: number) => {
        const factor = Math.pow(10, digits);
        return Math.trunc(value * factor) / factor;
    };

    const trimZero = (value: number, digits: number) =>
        value
            .toFixed(digits)
            .replace(/\.0+$/, '')
            .replace(/(\.\d*?)0+$/, '$1');

    const abs = Math.abs(n);
    const unit = units.find(u => abs >= u.threshold);

    if (unit) {
        const value = truncate(n / unit.threshold, dec);
        return trimZero(value, dec) + unit.suffix;
    }

    const value = truncate(n, dec);
    return trimZero(value, dec);
}

function getLastRange(num: number) {
    const start = Math.abs(num) % 100
    const end = start + 10
    return { start, end }
}

function isHexString(value: string): boolean {
    return /^0x[0-9a-fA-F]*$/.test(value);
}

function getTxCountByHeight(items: MainPageBlocksItem[] | undefined, height: number): number {
    if (!items?.length) return 0;
    const found = items.find((it) => (it as unknown as { height?: number }).height === height);
    if (!found) return 0;

    const anyFound = found as unknown as {
        transactionsCount?: number;
        transactionCount?: number;
        transactions?: number;
        txs?: number;
        count?: number;
    };

    const candidates = [
        anyFound.transactionsCount,
        anyFound.transactionCount,
        anyFound.transactions,
        anyFound.txs,
        anyFound.count,
    ];

    const n = candidates.find((x) => typeof x === "number" && Number.isFinite(x));
    return typeof n === "number" ? n : 0;
}

function computeDecoratedBlocks(
    blocks: BlocksItem[],
): DecoratedBlock[] {
    return blocks.map((b) => {
        const inputHex = b.input ?? "";
        const bytes = inputHex.startsWith("0x")
            ? Math.max(0, (inputHex.length - 2) / 2)
            : Math.max(0, inputHex.length / 2);

        const blockSizeMB = (bytes / 1024 / 1024).toFixed(2);

        const transactionsCount = 0;

        let minFee: string | undefined;
        let maxFee: string | undefined;

        if (typeof b.daq_score === "number") {
            const baseFee = b.daq_score / 1e9;
            minFee = (baseFee * 0.8).toFixed(2);
            maxFee = (baseFee * 1.2).toFixed(2);
        }

        return { ...b, blockSizeMB, minFee, maxFee, transactionsCount, ago: '—' } as DecoratedBlock;
    });
}

function validateBlock(item: DecoratedBlock): BlockValidation {
    const items: ValidationItem[] = [];

    items.push({
        label: "block.number",
        ok: Number.isFinite(item.number) && item.number > 0,
        detail: String(item.number),
    });

    const inputOk = typeof item.input === "string" && isHexString(item.input) && item.input.length > 2;
    items.push({
        label: "block.input(hex)",
        ok: inputOk,
        detail: inputOk ? `len=${item.input.length}` : "should be 0x-prefixed hex",
    });

    const proofOk = typeof item.proof === "string" ? isHexString(item.proof) : item.proof == null;
    items.push({
        label: "block.proof(hex)",
        ok: proofOk,
        detail: typeof item.proof === "string" ? `len=${item.proof.length}` : "null/undefined allowed",
    });

    const quoteOk = item.quote !== null
    items.push({
        label: "block.quote(hex)",
        ok: quoteOk,
        detail: typeof item.quote === "string" ? `len=${item.quote.length}` : "null/undefined allowed",
    });

    const anchor = (item as unknown as { anchor_hash?: string }).anchor_hash;
    const anchorOk =
        typeof anchor === "string" ? /^[0-9a-fA-F]{64}$/.test(anchor) || isHexString(anchor) : anchor == null;

    items.push({
        label: "block.anchor_hash",
        ok: anchorOk,
        detail: typeof anchor === "string" ? `len=${anchor.length}` : "null/undefined allowed",
    });

    return { summaryOk: items.every((i) => i.ok), items };
}

function shortenString(str: string, front: number = 6, back: number = 16): string {
    if (!str) return "";
    if (str.length <= front + back) return str;
    return `${str.slice(0, front)}...${str.slice(-back)}`;
}

function generateDaaScoreRange(daaScore: number): number[] {
    const start = Math.floor(daaScore / 10) * 10;
    return Array.from({ length: 10 }, (_, i) => start + i);
}

export function shortenHex(v?: string, head = 6, tail = 12): string {
    const s = (v ?? "").toString().trim();
    if (!s) return "";
    if (s.length <= head + tail + 3) return s;

    const has0x = s.startsWith("0x");
    const prefix = has0x ? "0x" : "";
    const body = has0x ? s.slice(2) : s;

    if (body.length <= head + tail) return s;
    return `${prefix}${body.slice(0, head)}...${body.slice(-tail)}`;
}

const getAgo = (timestamp: string) => {
    const time = new Date(timestamp).getTime();
    const diff = Math.floor((Date.now() - time) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}
export const downloadFile = async (url: string, filename: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Download failed');
    }
    const blob = await res.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
};

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};


export {
    debounce,
    isIphone,
    isValidUrl,
    openUrl,
    formatNumber,
    getLastRange,
    isHexString,
    getTxCountByHeight,
    computeDecoratedBlocks,
    validateBlock,
    shortenString,
    generateDaaScoreRange,
    getAgo,
};