const express = require("express");
const StallController =  require("../controllers/StallController");
const router = express.Router();

router.get("/",StallController.getAllStalls);

module.exports = router;