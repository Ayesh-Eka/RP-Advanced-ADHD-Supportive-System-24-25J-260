const express = require("express");
const { getPrediction } = require("../controllers/cognitiveTriningController");

const router = express.Router();

// Define the prediction route
router.post("/cognitive", getPrediction);

module.exports = router;
