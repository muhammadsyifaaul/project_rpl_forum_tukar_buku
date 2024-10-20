const express = require('express');
const { dashboard, addRoom, profilePage, sendChat, getMessage, settings, updateProfile} = require('../controllers/userController');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Rute untuk dashboard
router.get('/dashboard', dashboard);
router.get('/profilePage',profilePage)
router.get('/settings',settings)
router.post('/getMessage',getMessage)
router.post('/addRoom',addRoom);
router.post('/sendChat',sendChat)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // The directory where uploaded files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Save files with a timestamp to avoid conflicts
    }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'), false);
    }
};

// Set up multer middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: fileFilter
});

// Route to update the profile
router.post('/updateProfile', upload.single('avatar'), updateProfile);

module.exports = router;
