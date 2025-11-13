

```js
const express = require('express');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const paypal = require('paypal-rest-sdk');

paypal.configure({
mode: 'sandbox',
client_id: 'YOUR_PAYPAL_ID',
client_secret: 'YOUR_PAYPAL_SECRET'
});

const app = express();
app.use(express.json());

let api;
async function connect() {
const provider = new WsProvider('wss://kusama-rpc.polkadot.io');
api = await ApiPromise.create({ provider });
}
connect();

app.post('/start', async (req, res) => {
const { email, hours } = req.body;
res.json({ ok: true, message: "Session started" });
});

app.post('/sdk/init', (req, res) => {
console.log('SDK init', req.body);
res.json({ ok: true });
});

app.post('/pop/verify', async (req, res) => {
const { sessionId, playTime } = req.body;
// TODO: Verify with PoP pallet
paypal.payment.create({
 intent: 'sale',
 payer: { payment_method: 'paypal' },
 transactions: [{ amount: { total: '25.00', currency: 'GBP' } }]
}, (err, payment) => {
 if (err) return res.json({ error: err });
 res.json({ payment });
});
});

app.listen(3000, () => {
console.log('API running on http://localhost:3000');
});
