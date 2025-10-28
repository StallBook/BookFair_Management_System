const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI_USER_SERVICE)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Stall management service running on port ${PORT}`);
});
