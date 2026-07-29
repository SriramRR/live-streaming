const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env')

const SALT_ROUNDS = 10

// Hash a plain password before storing it.
async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS)
}

// Compare a plain password against the stored bcrypt hash.
async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash)
}

// Sign a JWT for an authenticated user. Payload stays minimal — no secrets.
function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

// Verify a JWT and return its decoded payload (throws if invalid/expired).
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET)
}

module.exports = { hashPassword, verifyPassword, signToken, verifyToken }
