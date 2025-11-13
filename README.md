# Gamverse API (Node.js + Polkadot.js)

Connects Web2 frontends to Polkadot PoP pallet.

## Endpoints
- `POST /start` → Start gamer session
- `POST /sdk/init` → SDK handshake
- `POST /pop/verify` → Verify play → PayPal payout

## Setup
```bash
npm install
node index.js
Set PAYPAL_CLIENT_ID and PAYPAL_SECRET in .env
railway up
