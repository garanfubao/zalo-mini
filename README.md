# Zalo Mini App - Food Ordering (Vite 5 + TS + React + Tailwind + Express)

## Run locally
```bash
pnpm i        # or npm i / yarn
pnpm serve:api  # start backend on http://localhost:3030
pnpm dev        # start frontend on http://localhost:5173
```

## Env
Copy `.env.example` to `.env` and fill values if you want to send Zalo OA messages.
```env
VITE_API_URL=http://localhost:3030
ZALO_OA_ACCESS_TOKEN=
ADMIN_ZALO_ID=
ZALO_MESSAGE_ENDPOINT=https://openapi.zalo.me/v3.0/oa/message
```

## Build
```bash
pnpm build
pnpm preview
```
