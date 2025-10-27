const express = require('express');
const router = express.Router();
const { getEmployees } = require('../Controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getEmployees);

module.exports = router;
