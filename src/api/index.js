const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const places = require("./places");

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏"
  });
});

router.use("/places", places);

module.exports = router;
