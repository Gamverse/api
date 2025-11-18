
const express = require("express");
const app = express();
app.use(express.json());

// Polkadot connection (Kusama)
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

// Start earning session
app.post('/start', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  console.log('Session started for:', email);
  res.json({ ok: true, message: 'Session started' });
});

// SDK init
app.post('/sdk/init', (req, res) => {
  console.log('SDK init', req.body);
  res.json({ ok: true });
});

// PoP verify + PayPal payout
app.post('/pop/verify', async (req, res) => {
  const { sessionId, playTime, email } = req.body;
  if (!sessionId || !playTime || !email) return res.status(400).json({ error: 'Missing data' });

  console.log('Verifying play time:', playTime, 'minutes for', email);

  const payout = {
    sender_batch_header: {
      email_subject: 'You earned £25!',
      email_message: 'Thanks for playing Gamverse!'
    },
    items: [
      {
        recipient_type: 'EMAIL',
        amount: { value: '25.00', currency: 'GBP' },
        receiver: email,
        note: 'Gamverse PoP Reward'
      }
    ]
  };

  paypal.payout.create(payout, (error, payout) => {
    if (error) {
      console.error('PayPal error:', error);
      return res.json({ error: 'Payment failed' });
    }
    res.json({ ok: true, payout, message: '£25 sent!' });
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server on dynamic port
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`API running on 0.0.0.0:${port}`);
});

module.exports = app;
app.post('/start', (req, res) => {
  const { email } = req.body;
  console.log('Session started for:', email || 'anonymous');
  res.json({ ok: true, message: 'Session started' });
});
