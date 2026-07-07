# kasplex.org page screenshots

Captured 2026-07-07 from the extracted `website2-main` source running on a local Vite dev server (`--port 8095`), headless Chromium 1440×900 @2x, full-page. `01-home-mobile` is 390×844 (iPhone 14).

Routes use HashRouter (`/#/...`):

| File | Route |
|---|---|
| 01-home | `/#/` |
| 02-ecosystem | `/#/evm` |
| 03-faucet | `/#/faucet` |
| 04-mediakit | `/#/mediaKit` |
| 05-privacypolicy | `/#/privacypolicy` |
| 06-stats | `/#/stats` |
| 07-verify | `/#/verify` |

Regenerate: `node _capture.mjs` (needs `npm i playwright` + chromium headless shell, dev server on :8095).
