const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getProfile, updateProfile, getAllUsers } = require('../controllers/authController')
const { requireDatabase } = require('../middleware/dbMiddleware')
const { protect, admin } = require('../middleware/authMiddleware')

router.post('/register', requireDatabase, registerUser)
router.post('/login', requireDatabase, loginUser)
router.get('/profile', requireDatabase, protect, getProfile)
router.put('/profile', requireDatabase, protect, updateProfile)
router.get('/', requireDatabase, protect, admin, getAllUsers)

module.exports = router
