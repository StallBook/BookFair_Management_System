const express = require("express");
const StallController =  require("../controllers/StallController");
const router = express.Router();

router.get("/all-stalls",StallController.getAllStalls);
router.get("/available",StallController.getAllStallsAvailable);

module.exports = router;