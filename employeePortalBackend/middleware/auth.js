//auth.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ msg: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_New);
    req.user = payload; // adjust if your login uses a different payload shape
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
}

module.exports = authMiddleware;
