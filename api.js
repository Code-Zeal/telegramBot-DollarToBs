const express = require("express");
const router = express.Router();

app.get("/health", (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
