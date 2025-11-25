//stallsRoutes.js
const express = require('express');
const router = express.Router();
const { getStallConn, connectStallDB } = require('../Config/stallDb');
const createStallModel = require('../models/stallModel');
const auth = require('../middleware/auth'); // optional; use your own if exists

// helper to ensure model is ready
async function getStallModel() {
  let conn = getStallConn();
  if (!conn) conn = await connectStallDB();
  return createStallModel(conn);
}

// GET /api/stalls?status=&q=&limit=&page=
router.get('/', async (req, res) => {
  try {
    const Stall = await getStallModel();
    const { status, q, page = 1, limit = 500 } = req.query;
    const filter = {};
    if (status && ['available','reserved'].includes(status)) filter.status = status;
    if (q) {
      const reg = new RegExp(String(q), 'i');
      filter.$or = [{ name: reg }, { id: reg }];
    }
    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const rows = await Stall.find(filter).limit(Number(limit)).skip(skip).lean();
    return res.json(rows.map(s => {
      return {
        ...s,
        id: s.id || s._id?.toString?.(),
      };
    }));
  } catch (err) {
    console.error('GET /api/stalls error', err);
    return res.status(500).json({ msg: 'Failed to list stalls' });
  }
});

// GET single stall
router.get('/:id', async (req, res) => {
  try {
    const Stall = await getStallModel();
    const stall = await Stall.findOne({ id: req.params.id }).lean();
    if (!stall) return res.status(404).json({ msg: 'Stall not found' });
    stall.id = stall.id || stall._id?.toString?.();
    return res.json(stall);
  } catch (err) {
    console.error('GET /api/stalls/:id error', err);
    return res.status(500).json({ msg: 'Failed to get stall' });
  }
});

// PATCH /api/stalls/:id/status — protected
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const Stall = await getStallModel();
    const { status, reservedBy } = req.body;
    if (!['available','reserved'].includes(status)) return res.status(400).json({ msg: 'Invalid status' });

    const update = { status };
    if (status === 'available') {
      update.reservedAt = null;
      update.reservedBy = null;
    } else {
      update.reservedAt = new Date();
      if (reservedBy) update.reservedBy = reservedBy;
      else update.reservedBy = { userId: req.user?.id || 'ADMIN', name: req.user?.name || 'Admin' };
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
