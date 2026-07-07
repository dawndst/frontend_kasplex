// src/utils/sign.ts
import CryptoJS from "crypto-js";
import { md5 } from "js-md5";

const APP_ID = 20250601;
const APP_SECRET = "65b896ed9623ddc50a27924afc1db2b7";

export function generateSign(obj: Record<string, unknown>): string {
    const sorted = sortASCII(obj);
    const queryStr = objToQuery(sorted);
    const hash = CryptoJS.HmacSHA256(queryStr, APP_SECRET).toString();
    return md5(hash).toLowerCase();
}

export function addSignParams(params: Record<string, unknown>): Record<string, unknown> {
    const signedParams = {
        ...params,
        appid: APP_ID,
        randomstr: generateRandomStr(8),
        timestamp: Math.floor(Date.now() / 1000)
    };
    return {
        ...signedParams,
        sign: generateSign(signedParams)
    };
}

function sortASCII(obj: Record<string, unknown>): Record<string, unknown> {
    const sortedKeys = Object.keys(obj).sort();
    const result: Record<string, unknown> = {};
    for (const key of sortedKeys) {
        result[key] = obj[key];
    }
    return result;
}

function objToQuery(obj: Record<string, unknown>): string {
    return Object.keys(obj)
        .map(key => `${key}=${obj[key] === undefined ? '' : obj[key]}`)
        .join("&");
}

function generateRandomStr(length = 8): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
