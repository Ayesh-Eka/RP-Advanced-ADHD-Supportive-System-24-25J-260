const express = require("express");
const router = express.Router();
const predictionController = require("../controllers/TaskPrioritizationController");

router.post("/priority", predictionController.predictPriority);

module.exports = router;
