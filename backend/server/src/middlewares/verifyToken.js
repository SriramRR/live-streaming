const { verifyToken } = require('../services/auth.service')

// Protects a route: requires a valid "Authorization: Bearer <token>" header.
// On success, attaches the decoded payload to req.user and calls next().
function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Missing or malformed Authorization header' })
  }

  try {
    req.user = verifyToken(token) // { sub, email, role, iat, exp }
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

// Authorization helper: allow only the listed roles. Use after requireAuth.
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' })
    }
    next()
  }
}

module.exports = { requireAuth, requireRole }
