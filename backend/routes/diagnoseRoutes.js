const express = require("express");
const { predictDisease } = require("../controllers/diagnoseController");

const router = express.Router();

// POST route for predictions
router.post("/predict", predictDisease);

module.exports = router; 