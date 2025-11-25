// routes/stallsRoutes.js
const express = require('express');
const router = express.Router();
const { getStallConn, connectStallDB } = require('../Config/stallDb');
const createStallModel = require('../models/stallModel');
const mongoose = require('mongoose'); 

/**
 * Helper: ensure Stall model exists on the stall DB connection.
 * This function returns the model synchronously if connection is ready,
 * or waits for connectStallDB() to create the connection and then returns model.
 */
async function getStallModel() {
  let conn = getStallConn();
  if (!conn) conn = await connectStallDB();
  return createStallModel(conn);
}

/**
 * Attempt to obtain the User model from the default mongoose connection (auth DB).
 * If your auth module already defines a User model, mongoose.model('User') will return it.
 * Otherwise we create a minimal model that maps to the 'users' collection.
 */
function getUserModel() {
  try {
    return mongoose.model('User');
  } catch (e) {
    const UserSchema = new mongoose.Schema({
      name: String,
      email: { type: String, index: true },
      phone: String,
      organization: String,
    }, { collection: 'users', timestamps: true });
    return mongoose.model('User', UserSchema);
  }
}

/**
 * GET /api/stalls
 * Returns stalls. If any stalls have reservedBy.userId, we attempt to fetch user info
 * from the auth DB and merge it into reservedBy.
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

    // collect unique reservedBy.userId values
    const userIds = Array.from(new Set(
      stalls.filter(s => s.reservedBy && s.reservedBy.userId).map(s => String(s.reservedBy.userId))
    ));

    let usersById = {};
    if (userIds.length > 0) {
      const User = getUserModel();
      // Try to match by _id (ObjectId) where possible, otherwise by email
      const objectIds = [];
      const stringIds = [];
      const { Types } = mongoose;
      userIds.forEach(id => {
        if (Types.ObjectId.isValid(id)) objectIds.push(Types.ObjectId(id));
        else stringIds.push(id);
      });

      const or = [];
      if (objectIds.length) or.push({ _id: { $in: objectIds } });
      if (stringIds.length) or.push({ email: { $in: stringIds } }, { _id: { $in: stringIds } });

      const query = or.length ? { $or: or } : { _id: { $in: userIds } };
      const users = await User.find(query, { name: 1, email: 1, phone: 1, organization: 1 }).lean();

      usersById = users.reduce((acc, u) => {
        if (u._id) acc[String(u._id)] = u;
        if (u.email) acc[String(u.email)] = u;
        return acc;
      }, {});
    }

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

/**
 * GET /api/stalls/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const Stall = await getStallModel();
    const stall = await Stall.findOne({ id: req.params.id }).lean();
    if (!stall) return res.status(404).json({ msg: 'Stall not found' });

    // optionally merge user info for this stall only:
    if (stall.reservedBy && stall.reservedBy.userId) {
      try {
        const User = getUserModel();
        const uid = stall.reservedBy.userId;
        let user = null;
        if (mongoose.Types.ObjectId.isValid(uid)) {
          user = await User.findById(uid, { name:1, email:1, phone:1, organization:1 }).lean();
        }
        if (!user && uid) {
          user = await User.findOne({ email: uid }, { name:1, email:1, phone:1, organization:1 }).lean();
        }
        if (user) {
          stall.reservedBy = {
            userId: stall.reservedBy.userId,
            name: stall.reservedBy?.name || user.name,
            email: stall.reservedBy?.email || user.email,
            phone: stall.reservedBy?.phone || user.phone,
            organization: stall.reservedBy?.organization || user.organization,
          };
        }
      } catch (e) {
        console.warn('Failed to enrich user for stall', e);
      }
    }

    stall.id = stall.id || stall._id?.toString?.();
    return res.json(stall);
  } catch (err) {
    console.error('GET /api/stalls/:id error', err);
    return res.status(500).json({ msg: 'Failed to get stall' });
  }
});

/**
 * PATCH /api/stalls/:id/status
 * (keep your existing implementation; ensure you export router at end)
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const Stall = await getStallModel();
    const { status, reservedBy } = req.body;
    if (!['available', 'reserved'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const update = { status };
    if (status === 'available') {
      update.reservedAt = null;
      update.reservedBy = null;
    } else {
      update.reservedAt = new Date();
      update.reservedBy = reservedBy || { userId: 'ADMIN', name: 'Admin' };
    }

    const updated = await Stall.findOneAndUpdate({ id: req.params.id }, update, { new: true }).lean();
    if (!updated) return res.status(404).json({ msg: 'Stall not found' });

    updated.id = updated.id || updated._id?.toString?.();
    return res.json(updated);
  } catch (err) {
    console.error('PATCH /api/stalls/:id/status error', err);
    return res.status(500).json({ msg: 'Failed to update stall status' });
  }
});
module.exports = router;
