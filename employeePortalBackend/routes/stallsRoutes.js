// routes/stallsRoutes.js (partial file - replace the GET / handler)
const express = require('express');
const router = express.Router();
const { getStallConn, connectStallDB } = require('../Config/stallDb');
const createStallModel = require('../models/stallModel');
const mongoose = require('mongoose'); // default connection (auth DB)
const auth = require('../middleware/auth'); // if needed

async function getStallModel() {
  let conn = getStallConn();
  if (!conn) conn = await connectStallDB();
  return createStallModel(conn);
}

// Try to obtain an existing User model on the default mongoose connection (auth DB).
function getUserModel() {
  try {
    return mongoose.model('User');
  } catch (e) {
    // Minimal user schema fallback — extend fields if your real user model differs
    const UserSchema = new mongoose.Schema({
      name: String,
      email: String,
      phone: String,
      organization: String,
      // any other fields you rely on
    }, { collection: 'users', timestamps: true });
    return mongoose.model('User', UserSchema);
  }
}

/**
 * GET /api/stalls?status=&q=&page=&limit=
 * - returns stalls array
 * - if stalls contain reservedBy.userId, we query the auth DB once for those users
 *   and merge name/email/phone into reservedBy for each stall.
 */
router.get('/', async (req, res) => {
  try {
    const Stall = await getStallModel();
    const { status, q, page = 1, limit = 500 } = req.query;
    const filter = {};
    if (status && ['available','reserved'].includes(status)) filter.status = status;
    if (q) {
      const regex = new RegExp(String(q), 'i');
      filter.$or = [{ name: regex }, { id: regex }];
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const stalls = await Stall.find(filter).limit(Number(limit)).skip(skip).lean();

    // Collect unique userIds from reservedBy.userId
    const userIds = Array.from(new Set(
      stalls
        .filter(s => s.reservedBy && s.reservedBy.userId)
        .map(s => String(s.reservedBy.userId))
    ));

    let usersById = {};
    if (userIds.length > 0) {
      const User = getUserModel();
      // Depending on your auth DB, userId might be _id (ObjectId) or a custom string field.
      // Try to match by a string 'userId' first, then fallback to _id if necessary.
      // Here we attempt matching by email/username or by _id — adapt as needed.
      // We'll try two queries: $or {_id: {$in: [...]}} and {customIdField: {$in: [...]}}
      // Simpler: assume reservedBy.userId stores the user's _id string -> query by _id.

      // Try to cast to ObjectId where possible
      const objectIds = [];
      const stringIds = [];
      const { Types } = mongoose;
      userIds.forEach(id => {
        if (Types.ObjectId.isValid(id)) objectIds.push(Types.ObjectId(id));
        else stringIds.push(id);
      });

      // Build $or
      const orClauses = [];
      if (objectIds.length) orClauses.push({ _id: { $in: objectIds } });
      if (stringIds.length) {
        // if your users collection stores a custom userId field, replace 'customId' with actual field
        // e.g., { userId: { $in: stringIds } }
        orClauses.push({ _id: { $in: stringIds } }); // fallback, will not match if _id is ObjectId only
        orClauses.push({ email: { $in: stringIds } }); // optional: sometimes reservedBy.userId might be an email
      }

      const query = orClauses.length ? { $or: orClauses } : { _id: { $in: userIds } };
      const users = await User.find(query).lean();

      usersById = users.reduce((acc, u) => {
        // key by _id string and also by email for safety
        if (u._id) acc[String(u._id)] = u;
        if (u.email) acc[String(u.email)] = u;
        return acc;
      }, {});
    }

    // Merge user info into stalls.reservedBy (prefer explicit reservedBy fields if present)
    const merged = stalls.map(s => {
      const out = { ...s };
      const rid = s?.reservedBy?.userId;
      if (rid) {
        const user = usersById[String(rid)] || usersById[String(s.reservedBy.userId)] || null;
        if (user) {
          out.reservedBy = {
            userId: rid,
            name: out.reservedBy?.name || user.name || undefined,
            email: out.reservedBy?.email || user.email || undefined,
            phone: out.reservedBy?.phone || user.phone || undefined,
            organization: out.reservedBy?.organization || user.organization || undefined,
          };
        } else {
          // leave reservedBy as-is (maybe it already has name/email)
          out.reservedBy = out.reservedBy || null;
        }
      }
      out.id = out.id || out._id?.toString?.();
      return out;
    });

    return res.json(merged);
  } catch (err) {
    console.error('GET /api/stalls error', err);
    return res.status(500).json({ msg: 'Failed to list stalls' });
  }
});
