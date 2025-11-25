// Config/reservationDb.js
const mongoose = require('mongoose');

let reservationConn = null;

async function connectReservationDB() {
  const uri = process.env.RESERVATION_MONGODB_URI;
  if (!uri) {
    console.warn('RESERVATION_MONGODB_URI not set — skipping reservation DB connect');
    return;
  }
  if (reservationConn) return reservationConn;
  reservationConn = await mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).asPromise();
  console.log('Connected to Reservation DB');
  return reservationConn;
}

module.exports = { connectReservationDB, getReservationConn: () => reservationConn };
