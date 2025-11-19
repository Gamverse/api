const express = require("express");
const app = express();

// Required for Polkadot/Kusama
const { ApiPromise, WsProvider } = require("@polkadot/api");

// Required for PayPal payouts
const paypal = require("@paypal/payouts-sdk");

// Parse JSON
app.use(express.json());

// ----------------------
// PAYPAL SDK CLIENT (REQUIRED)
// ----------------------
const paypalClient = new paypal.core.PayPalHttpClient(
  new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

// ----------------------
// PAYPAL WEBHOOK ROUTE
// ----------------------
const paypalWebhook = require("./routes/paypal");
app.use("/paypal", paypalWebhook);

// ----------------------
// KUSAMA CONNECTION (your original)
// ----------------------
let api;
async function connectPolkadot() {
  try {
    const provider = new WsProvider("wss://kusama-rpc.polkadot.io");
    api = await ApiPromise.create({ provider });
    console.log("Connected to Polkadot (Kusama)");
  } catch (err) {
    console.error("Polkadot connection failed:", err.message);
  }
}
connectPolkadot();

// ----------------------
// START SESSION (your original)
// ----------------------
app.post("/start", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  console.log("Session started for:", email);
  res.json({ ok: true, message: "Session started" });
});

// ----------------------
// SDK INIT (your original)
// ----------------------
app.post("/sdk/init", (req, res) => {
  console.log("SDK init", req.body);
  res.json({ ok: true });
});

// ----------------------
// POP VERIFY + PAYPAL PAYOUT (your original)
// ----------------------
app.post("/pop/verify", async (req, res) => {
  const { sessionId, playTime, email } = req.body;
  if (!sessionId || !playTime || !email)
    return res.status(400).json({ error: "Missing data" });

  console.log("Verifying play time:", playTime, "minutes for", email);

  const payoutRequest = {
    sender_batch_header: {
      email_subject: "You earned £25!",
      email_message: "Thanks for playing Gamverse!",
    },
    items: [
      {
        recipient_type: "EMAIL",
        amount: { value: "25.00", currency: "GBP" },
        receiver: email,
        note: "Gamverse PoP Reward",
      },
    ],
  };

  const request = new paypal.payouts.PayoutsPostRequest();
  request.requestBody(payoutRequest);

  try {
    const payout = await paypalClient.execute(request);
    res.json({ ok: true, payout, message: "£25 sent!" });
  } catch (error) {
    console.error("PayPal error:", error);
    res.json({ error: "Payment failed" });
  }
});

// ----------------------
// HEALTH CHECK
// ----------------------
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// ----------------------
// ERROR HANDLER
// ----------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// ----------------------
// START SERVER — ONLY ONCE
// ----------------------
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`API running on 0.0.0.0:${port}`);
});

