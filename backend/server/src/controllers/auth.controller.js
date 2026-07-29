const prisma = require('../config/db')
const { hashPassword, verifyPassword, signToken } = require('../services/auth.service')

const VALID_ROLES = ['admin', 'viewer']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Strip sensitive fields before sending a user back to the client.
function publicUser(u) {
  return { id: u.id, email: u.email, full_name: u.full_name, role: u.role }
}

// POST /api/auth/register  { email, password, full_name?, role }
async function register(req, res) {
  try {
    const { email, password, full_name, role } = req.body || {}

    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ message: 'A valid email is required.' })
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ message: "Role must be 'admin' or 'viewer'." })
    }

    const existing = await prisma.app_users.findUnique({ where: { email } })
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const password_hash = await hashPassword(password)
    const user = await prisma.app_users.create({
      data: { email, password_hash, full_name: full_name || null, role },
    })

    const token = signToken(user)
    return res.status(201).json({ token, user: publicUser(user) })
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed.', error: err.message })
  }
}

// POST /api/auth/login  { email, password }
async function login(req, res) {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await prisma.app_users.findUnique({ where: { email } })
    // Same generic message whether email or password is wrong (don't leak which emails exist).
    const ok = user && (await verifyPassword(password, user.password_hash))
    if (!ok) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = signToken(user)
    return res.json({ token, user: publicUser(user) })
  } catch (err) {
    return res.status(500).json({ message: 'Login failed.', error: err.message })
  }
}

// GET /api/auth/me   (protected)
async function me(req, res) {
  try {
    const user = await prisma.app_users.findUnique({ where: { id: req.user.sub } })
    if (!user) return res.status(404).json({ message: 'User not found.' })
    return res.json({ user: publicUser(user) })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load user.', error: err.message })
  }
}

module.exports = { register, login, me }
