# Astra Trader

A dependency-free, responsive paper-trading terminal prepared for Cloudflare Pages. The order engine runs entirely in the browser and deliberately cannot place live trades. It enforces buying-power and no-short-selling guardrails.

> **Safety:** This is a simulation, not financial advice. No broker, exchange, autonomous model, or live funds are connected. A reviewed server-side broker adapter, authentication, durable audit log, secrets management, and explicit risk controls are required before any live-trading use.

## Local development

Requires Node.js 22 or newer.

```bash
npm run lint
npm test
npm run build
npm run dev
```

Open <http://localhost:4173>. No package installation is required.

## Containers

```bash
docker compose up --build
```

Open <http://localhost:8080>. The multi-stage image serves static assets as an unprivileged Nginx user with security headers and a health check.

## Cloudflare Pages deployment

1. Create a Pages project named `astra-trader`.
2. Create a scoped API token with **Cloudflare Pages: Edit** permission. Never commit or paste it into source files.
3. Configure GitHub environment secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
4. Push to `main`; `.github/workflows/deploy.yml` verifies and publishes `dist/`.

For a direct authenticated deployment:

```bash
npm run build
npx wrangler pages deploy dist --project-name=astra-trader
```

Copy `.env.example` for the required variable names. Rotate any credential disclosed in chat or terminal history before production use.

## Architecture

- `src/index.html` — accessible application shell.
- `src/styles.css` — responsive visual system.
- `src/app.js` — UI state and paper execution flow.
- `src/engine.js` — validated, independently tested order calculations.
- `scripts/` — dependency-free build and development server.
- `test/` — Node test-runner coverage of financial guardrails.

Market prices are clearly labeled simulated constants. Integrate an authorized data provider before presenting data as real time.
