const express = require("express");
const StallController = require("../controllers/StallController");
const router = express.Router();

router.get("/all-stalls", StallController.getAllStalls);
router.get("/available", StallController.getAllStallsAvailable);
router.get("/stall-by-name", StallController.getStallByName);
router.put("/update-status", StallController.updateStallStatus);
router.post("/all-user-stalls", StallController.getStallForUser);
router.get("/:id", StallController.getStallById);

module.exports = router;