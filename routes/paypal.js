const express = require("express");
const router = express.Router();

// GET endpoint so PayPal can verify the URL and the browser can test it
router.get("/webhook", (req, res) => {
  res.status(200).send("OK - PayPal webhook receiver");
});

// POST endpoint for actual PayPal events
router.post("/webhook", (req, res) => {
  console.log("PayPal Webhook Received:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200); // Must return 200 immediately
});

module.exports = router;

