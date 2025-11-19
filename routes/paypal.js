const express = require("express");
const router = express.Router();

// GET route so browser and PayPal validator see OK.
router.get("/webhook", (req, res) => {
  res.status(200).send("OK - PayPal webhook receiver");
});

// POST route (actual PayPal webhook delivery)
router.post("/webhook", (req, res) => {
  console.log("PayPal Webhook Received:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

module.exports = router;

