# Telegram Coaching Mini App

Monorepo for Iranian wrestling coaches booking via Telegram Mini App.

## Quick start

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

## Features implemented (essential)

- Dark theme default + toggle
- RTL + Persian names from kosa.json
- Coach grid with search/filters
- Coach profile + blurred gallery
- Unlock for 2 USDT (real Tron address + QR + polling)
- Booking flow with packages + addons + price calc
- Real Tron payment polling (public Shasta API)
- My bookings
- Admin import from kosa.json

## Auth (dev friendly)

- Real Telegram initData verification when BOT_TOKEN is set
- Dev bypass when no token (accepts any initData)

## Payments

Real address generation + polling against public TronGrid.
Use Shasta testnet USDT for testing.

## Secrets

Copy `.env.example` to `.env` and fill when ready.

## Data

All coaches come from `kosa.json` (100 entries) and are enriched at runtime.

## Next steps for real deploy

- Add real Mongo + Prisma
- Add real BOT_TOKEN
- Add Cloudflare R2 for images
- Add proper admin auth
