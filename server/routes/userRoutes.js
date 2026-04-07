const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getProfile, updateProfile } = require('../controllers/authController')
const { requireDatabase } = require('../middleware/dbMiddleware')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', requireDatabase, registerUser)
router.post('/login', requireDatabase, loginUser)
router.get('/profile', requireDatabase, protect, getProfile)
router.put('/profile', requireDatabase, protect, updateProfile)

module.exports = router
