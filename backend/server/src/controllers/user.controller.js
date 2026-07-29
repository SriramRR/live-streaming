const prisma = require('../config/db')

const VALID_ROLES = ['admin', 'viewer']

// Fields safe to expose — never select password_hash.
const PUBLIC_FIELDS = {
  id: true,
  email: true,
  full_name: true,
  role: true,
  created_at: true,
}

// GET /api/users  (admin only) — list every account.
async function listUsers(req, res) {
  try {
    const users = await prisma.app_users.findMany({
      select: PUBLIC_FIELDS,
      orderBy: { created_at: 'asc' },
    })
    return res.json({ count: users.length, users })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list users.', error: err.message })
  }
}

// PATCH /api/users/:id/role  (admin only) — promote/demote an account.
async function updateUserRole(req, res) {
  try {
    const { id } = req.params
    const { role } = req.body || {}

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ message: "Role must be 'admin' or 'viewer'." })
    }
    // Guard: an admin demoting themselves could lock them out of the admin area.
    if (id === req.user.sub && role !== 'admin') {
      return res.status(400).json({ message: 'You cannot change your own role.' })
    }

    const existing = await prisma.app_users.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ message: 'User not found.' })

    const user = await prisma.app_users.update({
      where: { id },
      data: { role, updated_at: new Date() },
      select: PUBLIC_FIELDS,
    })
    return res.json({ user })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update role.', error: err.message })
  }
}

// DELETE /api/users/:id  (admin only)
async function deleteUser(req, res) {
  try {
    const { id } = req.params
    // Guard: don't let an admin delete their own account while signed in.
    if (id === req.user.sub) {
      return res.status(400).json({ message: 'You cannot delete your own account.' })
    }

    const existing = await prisma.app_users.findUnique({ where: { id } })
    if (!existing) return res.status(404).json({ message: 'User not found.' })

    await prisma.app_users.delete({ where: { id } })
    return res.json({ message: 'User deleted.', id })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete user.', error: err.message })
  }
}

// GET /api/users/stats  (admin OR viewer) — shared read-only data,
// included to show the contrast with the admin-only routes above.
async function getStats(req, res) {
  try {
    const [total, admins, viewers] = await Promise.all([
      prisma.app_users.count(),
      prisma.app_users.count({ where: { role: 'admin' } }),
      prisma.app_users.count({ where: { role: 'viewer' } }),
    ])
    return res.json({ stats: { total, admins, viewers }, viewedBy: req.user.role })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load stats.', error: err.message })
  }
}

module.exports = { listUsers, updateUserRole, deleteUser, getStats }
