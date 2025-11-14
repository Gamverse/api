const express = require('express');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const paypal = require('paypal-rest-sdk');

// === PAYPAL SANDBOX CONFIG (WILL USE ENV VARS ON RAILWAY) ===
paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_ID',
  client_secret: process.env.PAYPAL_SECRET || 'YOUR_PAYPAL_SECRET'
});

const app = express();
app.use(express.json());

// === POLKADOT CONNECTION (KUSAMA) ===
let api;
async function connectPolkadot() {
  try {
    const provider = new WsProvider('wss://kusama-rpc.polkadot.io');
    api = await ApiPromise.create({ provider });
    console.log('Connected to Polkadot (Kusama)');
  } catch (err) {
    console.error('Polkadot connection failed:', err.message);
  }
}
connectPolkadot();

// === API ENDPOINTS ===

// Start earning session
app.post('/start', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  console.log('Session started for:', email);
  res.json({ ok: true, message: 'Session started' });
});

// SDK init
app.post('/sdk/init', (req, res) => {
  console.log('SDK initialized:', req.body);
  res.json({ ok: true });
});

// PoP verify + PayPal payout
app.post('/pop/verify', async (req, res) => {
  const { sessionId, playTime } = req.body;
  if (!sessionId || !playTime) return res.status(400).json({ error: 'Missing data' });

  // TODO: Verify playTime with Polkadot PoP pallet
  console.log('Verifying play time:', playTime, 'minutes');

  // Create PayPal payout
  const payout = {
    sender_batch_header: {
      email_subject: 'You earned £25!',
      email_message: 'Thanks for playing!'
    },
    items: [
      {
        recipient_type: 'EMAIL',
        amount: { value: '25.00', currency: 'GBP' },
        receiver: 'payout@example.com', // Replace with real gamer email
        note: 'Gamverse PoP Reward'
      }
    ]
  };

  paypal.payout.create(payout, (error, payout) => {
    if (error) {
      console.error('PayPal error:', error);
      return res.json({ error: 'Payment failed' });
    }
    res.json({ ok: true, payout });
  });
});

// === ERROR HANDLING ===
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// === START SERVER ON DYNAMIC PORT (RAILWAY) ===
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

module.exports = app;
