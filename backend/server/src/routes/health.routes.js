const { Router } = require('express')
const { checkDbConnection } = require('../controllers/health.controller')

const router = Router()

router.get('/db', checkDbConnection)

module.exports = router
