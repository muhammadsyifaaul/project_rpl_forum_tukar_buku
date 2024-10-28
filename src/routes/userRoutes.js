const express = require('express');
const { dashboard, addRoom, profilePage, sendChat, getMessage, settings, updateProfile, directMessage, getAllDm, getMsgById, updateSession} = require('../controllers/userController');
const multer = require('multer');
const path = require('path');
const router = express.Router();

router.get('/dashboard', dashboard);
router.get('/profilePage',profilePage)
router.get('/settings',settings)
router.get('/account',settings)
router.get('/getAllDm',getAllDm)
router.post('/getMessage',getMessage)
router.post('/addRoom',addRoom);
router.post('/sendChat',sendChat)
router.post('/directMessage',directMessage)
router.post('/getMsgById',getMsgById)
router.post('/updateSession',updateSession)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

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
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: fileFilter
});

router.post('/updateProfile', upload.single('avatar'), updateProfile);

module.exports = router;
