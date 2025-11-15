
const express = require("express");
const app = express();
const path = require("path");

// Required for PayPal webhook JSON bodies
app.use(express.json({ type: "*/*" }));

// Load PayPal webhook route
const paypalWebhook = require("./routes/paypal");
app.use("/paypal", paypalWebhook);

// Default route (optional, just for testing)
app.get("/", (req, res) => {
  res.send("Gamverse API backend is running");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
