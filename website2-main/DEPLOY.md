# Deploy notes

The app uses **BrowserRouter** (clean URLs, no `/#/`). Built assets are referenced
from the domain root (`vite.config.ts` `base: '/'`), so the site must be served at
the root of its domain.

## SPA history fallback (required)

Because there is no hash, a hard refresh or a direct visit to a deep route
(`/faucet`, `/evm`, `/mediaKit`, `/privacypolicy`) hits the server at that path.
The static host must rewrite any unknown path to `index.html` or those loads 404.

**Caddy**
```
kasplex.org {
    root * /path/to/website2-main/dist
    encode gzip zstd
    try_files {path} /index.html
    file_server

    # faucet backend (see faucet-server/)
    handle /faucet-api/* {
        uri strip_prefix /faucet-api
        reverse_proxy 127.0.0.1:8790
    }
}
```

**nginx**
```
location / {
    root /path/to/website2-main/dist;
    try_files $uri $uri/ /index.html;
}
location /faucet-api/ {
    rewrite ^/faucet-api/(.*)$ /$1 break;
    proxy_pass http://127.0.0.1:8790;
}
```

The Vite dev server already does history fallback automatically.
