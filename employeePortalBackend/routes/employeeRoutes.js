const express = require('express');
const router = express.Router();
const { getEmployees, updateEmployee } = require('../Controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getEmployees);

router.put('/:id', protect, updateEmployee);

module.exports = router;
