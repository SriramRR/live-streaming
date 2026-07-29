// Centralized environment config so the rest of the app never touches process.env directly.
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing. Add it to backend/server/.env')
}

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  PORT: process.env.PORT || 5000,
}
