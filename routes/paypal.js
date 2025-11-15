
const express = require("express");
const router = express.Router();

router.post("/webhook", (req, res) => {
  console.log("PayPal Webhook Received:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

module.exports = router;
