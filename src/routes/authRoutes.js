const express = require('express')
const { register, login, registerForm, loginForm } = require('../controllers/authController')
const router = express.Router()

router.get('/', (req, res) => {
    res.redirect('/register')
})
router.get('/register',registerForm)
router.get('/login',loginForm)

router.post('/register',register)
router.post('/login',login)

module.exports = router