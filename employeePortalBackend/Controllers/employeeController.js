const Employee = require('../models/Employee');

exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select('-password');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
