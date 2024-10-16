const express = require('express');
const { dashboard, addRoom, profilePage} = require('../controllers/userController');
const router = express.Router();

// Rute untuk dashboard
router.get('/dashboard', dashboard);
router.get('/profilePage',profilePage)
router.post('/addRoom',addRoom);

module.exports = router;
