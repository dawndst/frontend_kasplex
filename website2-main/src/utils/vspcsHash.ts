
import { keccak256 } from "ethers";
export type Vspc = { daa_score: number | string | bigint; hash: string };

function toU64BE(n: bigint): Uint8Array {
  if (n < 0n || n > 0xffff_ffff_ffff_ffffn) {
    throw new Error(`daa_score out of uint64 range: ${n.toString()}`);
  }
  const out = new Uint8Array(8);
  let x = n;
  for (let i = 7; i >= 0; i--) {
    out[i] = Number(x & 0xffn);
    x >>= 8n;
  }
  return out;
}

function concatBytes(chunks: Uint8Array[]): Uint8Array {
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.length;
  }
  return out;
}

function normalizeHashString(h: string): string {
  const t = (h ?? "").trim();
  if (!t || t === "0x0" || t === "0") return "";
  return (t.startsWith("0x") ? t.slice(2) : t).toLowerCase();
}

export function calcAnchorHash(vspcList: Vspc[]): string {
  const filtered = vspcList.map((v) => ({
      daa: BigInt(v.daa_score),
      hashStr: normalizeHashString(v.hash),
    })).filter((v) => v.hashStr.length > 0).sort((a, b) => (a.daa < b.daa ? -1 : a.daa > b.daa ? 1 : 0));

  if (filtered.length === 0) return "0x0";

  const enc = new TextEncoder();
  const chunks: Uint8Array[] = [];

  for (const v of filtered) {
    chunks.push(toU64BE(v.daa), enc.encode(v.hashStr));
  }

  const data = concatBytes(chunks);
  return keccak256(data).toLowerCase();
}
