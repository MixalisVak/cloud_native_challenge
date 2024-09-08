const express = require('express');
const imageController = require('../controllers/imageController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to upload an image (Admin only)
router.post('/', verifyToken, isAdmin, imageController.uploadImage);

// Route to get an image by ID (Public)
router.get('/:id', imageController.getImageById);

module.exports = router;
