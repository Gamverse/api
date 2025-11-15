const express = require("express");
const router = express.Router();

// Simple GET so PayPal / browser can validate the URL (returns 200)
router.get("/webhook", (req, res) => {
  res.status(200).send("OK - PayPal webhook receiver");
});

// POST webhook used by PayPal to send events
router.post("/webhook", (req, res) => {
  console.log("PayPal Webhook Received:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

module.exports = router;
