const { Router } = require('express')
const { listUsers, updateUserRole, deleteUser, getStats } = require('../controllers/user.controller')
const { requireAuth, requireRole } = require('../middlewares/verifyToken')

const router = Router()

// Every route below requires a valid JWT.
router.use(requireAuth)

// Shared: any authenticated user (admin OR viewer).
router.get('/stats', requireRole('admin', 'viewer'), getStats)

// Admin-only: requireRole runs after requireAuth and rejects viewers with 403.
router.get('/', requireRole('admin'), listUsers)
router.patch('/:id/role', requireRole('admin'), updateUserRole)
router.delete('/:id', requireRole('admin'), deleteUser)

module.exports = router
