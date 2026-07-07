# One-command VPS deploy

Deploys the whole project to a fresh Ubuntu/Debian VPS:

- **frontend** (`website2-main/`) — built and served as static files by Caddy, with SPA history fallback (needed because the app uses clean `/faucet` URLs)
- **backend** (`faucet-server/`) — run as a `systemd` service, restarted on crash/reboot, state persisted to `/var/lib/kasplex-faucet`
- **Caddy** — auto HTTPS for your domain, and reverse-proxies `/faucet-api/*` to the backend so the frontend talks to it same-origin (no CORS)

## Prerequisites

- A fresh **Ubuntu 22.04+ / Debian 12+** VPS, root/sudo access.
- If you want HTTPS: a **domain's DNS A/AAAA record pointing at the VPS IP** (Caddy fetches the cert automatically). Without a domain it serves plain HTTP on port 80.
- A **funded testnet key** for the faucet and the **testnet RPC URL**.
- Ports **80 and 443** open in the firewall.

## Deploy

```bash
# on the VPS, as root
git clone https://github.com/dawndst/frontend_kasplex.git
cd frontend_kasplex/deploy
cp deploy.config.example deploy.config
nano deploy.config          # fill in DOMAIN, RPC_URL, FAUCET_PRIVATE_KEY, ...
cd ..
sudo ./deploy/deploy.sh
```

The script is **idempotent** — re-run `sudo ./deploy/deploy.sh` any time to pull
new frontend code (rebuild) or change config (restart backend/Caddy).

After it finishes, **fund the faucet address** it prints under "Backend health"
(the `faucet` field). Until it has a balance, claims return "Faucet is empty".

## What it does

1. Installs **Node 22 LTS** (if missing/too old) and **Caddy**.
2. `npm install` in `faucet-server/`, writes `/etc/kasplex-faucet.env` (600),
   installs `systemd` unit `kasplex-faucet.service`, enables + starts it.
3. `npm run build` in `website2-main/`.
4. Writes `/etc/caddy/Caddyfile` (static site + SPA fallback + `/faucet-api`
   proxy), reloads Caddy.
5. Prints a health check and useful log commands.

## Operating

| Task | Command |
|---|---|
| Backend logs | `journalctl -u kasplex-faucet -f` |
| Restart backend | `systemctl restart kasplex-faucet` |
| Backend health | `curl localhost:8790/health` |
| Change faucet rules | edit `/etc/kasplex-faucet.env`, then `systemctl restart kasplex-faucet` |
| Update site (new code) | `git pull && sudo ./deploy/deploy.sh` |
| Caddy logs | `journalctl -u caddy -f` |

## Config reference

All knobs live in `deploy/deploy.config` (see `deploy.config.example`):

| Key | Required | Default | Meaning |
|---|---|---|---|
| `DOMAIN` | for HTTPS | — | domain pointing at the VPS; empty ⇒ HTTP on :80 |
| `RPC_URL` | yes | — | testnet JSON-RPC endpoint |
| `FAUCET_PRIVATE_KEY` | yes | — | funded testnet key (secret) |
| `CHAIN_ID` | no | — | warns on RPC chainId mismatch |
| `FAUCET_PORT` | no | 8790 | local backend port (proxied by Caddy) |
| `DRIP_KAS` | no | 50 | amount sent per claim |
| `COOLDOWN_HOURS` | no | 24 | per-address + per-IP cooldown |
| `BALANCE_CAP_KAS` | no | 2 | recipient must be below this to claim |
| `HOURLY_BUDGET` | no | 100 | global max claims/hour |
| `SERVICE_USER` | no | root | systemd user for the backend |

## Notes

- **Secrets**: `deploy/deploy.config` and `/etc/kasplex-faucet.env` hold the
  private key — both are kept out of git and written mode-600. Don't commit them.
- **State**: cooldown records persist in `/var/lib/kasplex-faucet/faucet-state.json`
  (survives restarts and redeploys).
- **Hardening**: the backend runs as `root` by default for simplicity. To run as a
  dedicated user, set `SERVICE_USER` and make sure that user can read the repo and
  the `faucet-server/node_modules` — then re-run the script.
