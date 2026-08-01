const { Router } = require('express')
const {
  listViewers,
  sendRequest,
  incomingRequests,
  acceptRequest,
  rejectRequest,
  listFriends,
  removeConnection,
} = require('../controllers/connection.controller')
const { requireAuth, requireRole } = require('../middlewares/verifyToken')

const router = Router()

// This whole feature belongs to viewers: a valid JWT with role=viewer.
// Admins get 403 here (their area is /api/users).
router.use(requireAuth, requireRole('viewer'))

router.get('/viewers', listViewers)
router.get('/requests', incomingRequests)
router.get('/friends', listFriends)

router.post('/request', sendRequest)
router.post('/:id/accept', acceptRequest)
router.post('/:id/reject', rejectRequest)
router.delete('/:id', removeConnection)

module.exports = router
