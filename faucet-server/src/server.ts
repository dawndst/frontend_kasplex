import http from 'node:http';
import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { isAddress, getAddress, parseEther, formatEther, JsonRpcProvider, Wallet } from 'ethers';

// ---------------- Config (env) ----------------
const RPC_URL = process.env.RPC_URL ?? '';
const CHAIN_ID = process.env.CHAIN_ID ? Number(process.env.CHAIN_ID) : undefined;
const FAUCET_PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY ?? '';
const PORT = Number(process.env.PORT ?? 8790);
const DRIP_KAS = process.env.DRIP_KAS ?? '50';
const COOLDOWN_MS = Number(process.env.COOLDOWN_HOURS ?? 24) * 3600_000;
const BALANCE_CAP_KAS = process.env.BALANCE_CAP_KAS ?? '2';
const HOURLY_BUDGET = Number(process.env.HOURLY_BUDGET ?? 100);
const STATE_FILE = process.env.STATE_FILE ?? './faucet-state.json';
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN ?? '*';

if (!RPC_URL || !FAUCET_PRIVATE_KEY) {
    console.error('Missing required env: RPC_URL and FAUCET_PRIVATE_KEY');
    process.exit(1);
}

const DRIP_WEI = parseEther(DRIP_KAS);
const BALANCE_CAP_WEI = parseEther(BALANCE_CAP_KAS);

const provider = new JsonRpcProvider(RPC_URL, CHAIN_ID, { staticNetwork: true });
const wallet = new Wallet(FAUCET_PRIVATE_KEY, provider);

// ---------------- Persistent state ----------------
type FaucetState = {
    addresses: Record<string, number>; // checksummed address -> last claim ts (ms)
    ips: Record<string, number>;       // ip -> last claim ts (ms)
    hourStamp: number;                 // Math.floor(now / 1h)
    hourUsed: number;
};

function loadState(): FaucetState {
    if (existsSync(STATE_FILE)) {
        try {
            return { addresses: {}, ips: {}, hourStamp: 0, hourUsed: 0, ...JSON.parse(readFileSync(STATE_FILE, 'utf8')) };
        } catch (e) {
            console.error('state file unreadable, starting fresh:', e);
        }
    }
    return { addresses: {}, ips: {}, hourStamp: 0, hourUsed: 0 };
}

const state = loadState();
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function saveStateSoon() {
    if (saveTimer) return;
    saveTimer = setTimeout(() => {
        saveTimer = null;
        try {
            // prune expired cooldowns so the file doesn't grow forever
            const cutoff = Date.now() - COOLDOWN_MS;
            for (const k of Object.keys(state.addresses)) if (state.addresses[k] < cutoff) delete state.addresses[k];
            for (const k of Object.keys(state.ips)) if (state.ips[k] < cutoff) delete state.ips[k];
            const tmp = `${STATE_FILE}.tmp`;
            writeFileSync(tmp, JSON.stringify(state));
            renameSync(tmp, STATE_FILE);
        } catch (e) {
            console.error('state save failed:', e);
        }
    }, 1000);
}

// ---------------- Claim pipeline ----------------
class ClaimError extends Error {}

function takeHourlyToken(): void {
    const stamp = Math.floor(Date.now() / 3600_000);
    if (stamp !== state.hourStamp) {
        state.hourStamp = stamp;
        state.hourUsed = 0;
    }
    if (state.hourUsed >= HOURLY_BUDGET) {
        throw new ClaimError('Faucet hourly budget exhausted, please try again later');
    }
    state.hourUsed++;
}

// Serialize sends so concurrent requests never race on the wallet nonce
let sendChain: Promise<unknown> = Promise.resolve();

async function claim(address: string, ip: string): Promise<string> {
    const to = getAddress(address); // checksummed
    const now = Date.now();

    const lastAddr = state.addresses[to] ?? 0;
    if (now - lastAddr < COOLDOWN_MS) {
        const hrs = Math.ceil((COOLDOWN_MS - (now - lastAddr)) / 3600_000);
        throw new ClaimError(`This address already claimed recently, retry in ~${hrs}h`);
    }
    const lastIp = state.ips[ip] ?? 0;
    if (now - lastIp < COOLDOWN_MS) {
        const hrs = Math.ceil((COOLDOWN_MS - (now - lastIp)) / 3600_000);
        throw new ClaimError(`This IP already claimed recently, retry in ~${hrs}h`);
    }

    const [toBalance, faucetBalance] = await Promise.all([
        provider.getBalance(to),
        provider.getBalance(wallet.address),
    ]);
    if (toBalance >= BALANCE_CAP_WEI) {
        throw new ClaimError(`To receive L2 KAS, your wallet must have a balance of less than ${BALANCE_CAP_KAS} KAS on Kasplex L2`);
    }
    if (faucetBalance < DRIP_WEI) {
        throw new ClaimError('Faucet is empty, please contact the team to refill');
    }

    takeHourlyToken();

    const result = sendChain.then(async () => {
        const tx = await wallet.sendTransaction({ to, value: DRIP_WEI });
        return tx.hash;
    });
    // keep the chain alive even when a send fails
    sendChain = result.catch(() => undefined);

    let hash: string;
    try {
        hash = await result;
    } catch (e) {
        state.hourUsed = Math.max(0, state.hourUsed - 1); // send failed -> give the token back
        console.error('send failed:', e);
        throw new ClaimError('Transaction submit failed, please try again later');
    }

    // Mark cooldowns only after a successful send
    state.addresses[to] = now;
    state.ips[ip] = now;
    saveStateSoon();
    console.log(`${new Date().toISOString()} dripped ${DRIP_KAS} KAS -> ${to} (${ip}) ${hash}`);
    return hash;
}

// ---------------- HTTP server ----------------
function clientIp(req: http.IncomingMessage): string {
    const fwd = req.headers['x-forwarded-for'];
    if (typeof fwd === 'string' && fwd.length > 0) return fwd.split(',')[0].trim();
    return req.socket.remoteAddress ?? 'unknown';
}

function json(res: http.ServerResponse, status: number, body: unknown): void {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': ALLOW_ORIGIN,
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    });
    res.end(JSON.stringify(body));
}

function readBody(req: http.IncomingMessage, limit = 10_000): Promise<string> {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
            if (data.length > limit) {
                reject(new ClaimError('Request too large'));
                req.destroy();
            }
        });
        req.on('end', () => resolve(data));
        req.on('error', reject);
    });
}

const server = http.createServer(async (req, res) => {
    try {
        if (req.method === 'OPTIONS') {
            json(res, 204, {});
            return;
        }
        if (req.method === 'GET' && req.url === '/health') {
            const balance = await provider.getBalance(wallet.address).catch(() => null);
            json(res, 200, {
                ok: balance !== null,
                faucet: wallet.address,
                balanceKAS: balance !== null ? formatEther(balance) : 'rpc unreachable',
                dripKAS: DRIP_KAS,
                hourlyUsed: state.hourUsed,
                hourlyBudget: HOURLY_BUDGET,
            });
            return;
        }
        if (req.method === 'POST' && req.url === '/claim') {
            const raw = await readBody(req);
            let address = '';
            try {
                address = String(JSON.parse(raw || '{}').address ?? '').trim();
            } catch {
                json(res, 400, { msg: 'Invalid JSON body' });
                return;
            }
            if (!isAddress(address)) {
                json(res, 400, { msg: 'Invalid wallet address' });
                return;
            }
            const hash = await claim(address, clientIp(req));
            json(res, 200, { msg: `Txhash: ${hash}` });
            return;
        }
        json(res, 404, { msg: 'Not found' });
    } catch (e) {
        if (e instanceof ClaimError) {
            json(res, 400, { msg: e.message });
        } else {
            console.error('unexpected error:', e);
            json(res, 500, { msg: 'Internal error, please try again later' });
        }
    }
});

server.listen(PORT, () => {
    console.log(`faucet-server listening on :${PORT}`);
    console.log(`faucet address: ${wallet.address}`);
    console.log(`drip ${DRIP_KAS} KAS / cooldown ${COOLDOWN_MS / 3600_000}h / balance cap ${BALANCE_CAP_KAS} KAS / hourly budget ${HOURLY_BUDGET}`);
    // boot-time RPC sanity check with timeout — warn loudly instead of hanging silently
    Promise.race([
        provider.getNetwork(),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout after 10s')), 10_000)),
    ]).then(
        (net) => {
            const n = net as { chainId: bigint };
            console.log(`rpc ok, chainId ${n.chainId}`);
            if (CHAIN_ID !== undefined && Number(n.chainId) !== CHAIN_ID) {
                console.error(`WARNING: rpc chainId ${n.chainId} != configured CHAIN_ID ${CHAIN_ID}`);
            }
        },
        (e) => console.error(`WARNING: rpc unreachable at boot (${e.message}) — claims will fail until it recovers`),
    );
});
