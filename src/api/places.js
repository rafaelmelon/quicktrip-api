const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

const { getAutocomplete, postSearch } = require("../geo");

router.get("/autocomplete/:values", getAutocomplete);
router.post("/search", postSearch);

module.exports = router;
