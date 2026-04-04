const express = require('express')
const router = express.Router()
const { registerUser, loginUser } = require('../controllers/authController')
const { requireDatabase } = require('../middleware/dbMiddleware')

router.post('/register', requireDatabase, registerUser)
router.post('/login', requireDatabase, loginUser)

module.exports = router
