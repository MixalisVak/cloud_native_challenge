const express = require('express');
const articleController = require('../controllers/articleController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Route to create a new article (Admin only)
router.post('/', verifyToken, isAdmin, articleController.createArticle);

// Route to get all articles (Public: Admins and Guests)
router.get('/', articleController.getAllArticles);

// Route to get a single article by ID (Public: Admins and Guests)
router.get('/:id', articleController.getArticleById);

// Route to update an article (Admin only)
router.put('/:id', verifyToken, isAdmin, articleController.updateArticle);

// Route to delete an article (Admin only)
router.delete('/:id', verifyToken, isAdmin, articleController.deleteArticle);

module.exports = router;
