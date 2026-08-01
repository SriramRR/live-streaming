const prisma = require('../config/db')

// Public shape of another user — never expose password_hash.
const USER_FIELDS = { id: true, email: true, full_name: true, role: true }

// Fetch every connection row involving this user (any status).
function connectionsOf(userId) {
  return prisma.connections.findMany({
    where: { OR: [{ requester_id: userId }, { addressee_id: userId }] },
  })
}

// GET /api/connections/viewers
// Lists all OTHER viewers, each annotated with my relationship to them:
//   'none' | 'pending_sent' | 'pending_received' | 'connected' | 'rejected'
async function listViewers(req, res) {
  try {
    const me = req.user.sub

    const [viewers, links] = await Promise.all([
      prisma.app_users.findMany({
        where: { role: 'viewer', id: { not: me } },
        select: USER_FIELDS,
        orderBy: { created_at: 'asc' },
      }),
      connectionsOf(me),
    ])

    // Index the relationships by the *other* person's id for a quick lookup.
    const byOther = new Map()
    for (const c of links) {
      const otherId = c.requester_id === me ? c.addressee_id : c.requester_id
      const iSent = c.requester_id === me
      let status
      if (c.status === 'accepted') status = 'connected'
      else if (c.status === 'pending') status = iSent ? 'pending_sent' : 'pending_received'
      else status = 'rejected'
      byOther.set(otherId, { status, connectionId: c.id })
    }

    const result = viewers.map((v) => ({
      ...v,
      status: byOther.get(v.id)?.status ?? 'none',
      connectionId: byOther.get(v.id)?.connectionId ?? null,
    }))

    return res.json({ count: result.length, viewers: result })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to list viewers.', error: err.message })
  }
}

// POST /api/connections/request   { userId }
async function sendRequest(req, res) {
  try {
    const me = req.user.sub
    const { userId } = req.body || {}

    if (!userId) return res.status(400).json({ message: 'userId is required.' })
    if (userId === me) return res.status(400).json({ message: 'You cannot connect with yourself.' })

    const target = await prisma.app_users.findUnique({ where: { id: userId } })
    if (!target) return res.status(404).json({ message: 'User not found.' })
    if (target.role !== 'viewer') {
      return res.status(400).json({ message: 'You can only connect with other viewers.' })
    }

    // A relationship is unique per pair in either direction.
    const existing = await prisma.connections.findFirst({
      where: {
        OR: [
          { requester_id: me, addressee_id: userId },
          { requester_id: userId, addressee_id: me },
        ],
      },
    })
    if (existing) {
      const msg =
        existing.status === 'accepted'
          ? 'You are already connected.'
          : existing.status === 'pending'
            ? existing.requester_id === me
              ? 'Request already sent.'
              : 'This user already sent you a request — accept it instead.'
            : 'A previous request between you was declined.'
      return res.status(409).json({ message: msg })
    }

    const connection = await prisma.connections.create({
      data: { requester_id: me, addressee_id: userId, status: 'pending' },
    })
    return res.status(201).json({ connection })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to send request.', error: err.message })
  }
}

// GET /api/connections/requests — incoming pending requests (for me to accept).
async function incomingRequests(req, res) {
  try {
    const me = req.user.sub
    const rows = await prisma.connections.findMany({
      where: { addressee_id: me, status: 'pending' },
      orderBy: { created_at: 'desc' },
    })

    const senders = await prisma.app_users.findMany({
      where: { id: { in: rows.map((r) => r.requester_id) } },
      select: USER_FIELDS,
    })
    const byId = new Map(senders.map((u) => [u.id, u]))

    const requests = rows.map((r) => ({
      connectionId: r.id,
      created_at: r.created_at,
      from: byId.get(r.requester_id) || null,
    }))
    return res.json({ count: requests.length, requests })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load requests.', error: err.message })
  }
}

// Loads a pending request and checks that the caller is the addressee.
// Returns null after sending the error response.
async function loadPendingForMe(req, res) {
  const conn = await prisma.connections.findUnique({ where: { id: req.params.id } })
  if (!conn) {
    res.status(404).json({ message: 'Request not found.' })
    return null
  }
  if (conn.addressee_id !== req.user.sub) {
    res.status(403).json({ message: 'Only the recipient can respond to this request.' })
    return null
  }
  if (conn.status !== 'pending') {
    res.status(409).json({ message: `This request is already ${conn.status}.` })
    return null
  }
  return conn
}

// POST /api/connections/:id/accept — becomes a connection.
async function acceptRequest(req, res) {
  try {
    if (!(await loadPendingForMe(req, res))) return
    const connection = await prisma.connections.update({
      where: { id: req.params.id },
      data: { status: 'accepted', updated_at: new Date() },
    })
    return res.json({ connection })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to accept request.', error: err.message })
  }
}

// POST /api/connections/:id/reject — declines and clears the relationship.
// The row is removed rather than kept as 'rejected' so the pair returns to
// "not connected" and a fresh request is possible later.
async function rejectRequest(req, res) {
  try {
    if (!(await loadPendingForMe(req, res))) return
    await prisma.connections.delete({ where: { id: req.params.id } })
    return res.json({ message: 'Request declined.', id: req.params.id })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to decline request.', error: err.message })
  }
}

// GET /api/connections/friends — accepted connections + the count.
async function listFriends(req, res) {
  try {
    const me = req.user.sub
    const rows = await prisma.connections.findMany({
      where: {
        status: 'accepted',
        OR: [{ requester_id: me }, { addressee_id: me }],
      },
      orderBy: { updated_at: 'desc' },
    })

    const otherIds = rows.map((r) => (r.requester_id === me ? r.addressee_id : r.requester_id))
    const users = await prisma.app_users.findMany({
      where: { id: { in: otherIds } },
      select: USER_FIELDS,
    })
    const byId = new Map(users.map((u) => [u.id, u]))

    const friends = rows
      .map((r) => {
        const otherId = r.requester_id === me ? r.addressee_id : r.requester_id
        const u = byId.get(otherId)
        return u ? { ...u, connectionId: r.id, connectedAt: r.updated_at } : null
      })
      .filter(Boolean)

    return res.json({ connectionCount: friends.length, friends })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to load friends.', error: err.message })
  }
}

// DELETE /api/connections/:id — cancel a sent request, or remove a connection.
// Either participant may do this.
async function removeConnection(req, res) {
  try {
    const me = req.user.sub
    const { id } = req.params

    const conn = await prisma.connections.findUnique({ where: { id } })
    if (!conn) return res.status(404).json({ message: 'Connection not found.' })
    if (conn.requester_id !== me && conn.addressee_id !== me) {
      return res.status(403).json({ message: 'This connection is not yours.' })
    }

    await prisma.connections.delete({ where: { id } })
    return res.json({ message: 'Connection removed.', id })
  } catch (err) {
    return res.status(500).json({ message: 'Failed to remove connection.', error: err.message })
  }
}

module.exports = {
  listViewers,
  sendRequest,
  incomingRequests,
  acceptRequest,
  rejectRequest,
  listFriends,
  removeConnection,
}
