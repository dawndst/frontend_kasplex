# kasplex-faucet-server

Testnet KAS faucet backend for kasplex.org (`/#/faucet`).

## Run

```bash
npm install
RPC_URL=<testnet-rpc> FAUCET_PRIVATE_KEY=0x... npm start   # or use a .env loader / systemd EnvironmentFile
```

## API

- `POST /claim` `{"address":"0x..."}` → `{"msg":"Txhash: 0x..."}` on success, `{"msg":"<reason>"}` otherwise. The frontend treats any `msg` containing `Txhash` as success.
- `GET /health` → faucet address, balance, hourly usage.

## Rules (all env-tunable, see .env.example)

50 KAS per claim · 24h cooldown per address AND per IP · recipient balance must be < 2 KAS · global hourly budget 100 claims · sends serialized (no nonce races) · cooldown state persisted to `faucet-state.json`.

## Production wiring

Frontend calls `/faucet-api/*`; point your reverse proxy at this service, e.g. Caddy:

```
handle /faucet-api/* {
    uri strip_prefix /faucet-api
    reverse_proxy 127.0.0.1:8790
}
```

The Vite dev server already proxies `/faucet-api` → `localhost:8790`.
